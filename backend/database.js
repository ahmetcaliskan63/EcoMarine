import pkg from 'pg';
const { Pool } = pkg;

class Database {
    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'ecomarine_db',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.init();
    }

    async init() {
        try {
            await this.createTables();
            await this.insertSampleData();
            console.log('PostgreSQL veritabanı başarıyla başlatıldı');
        } catch (error) {
            console.error('Veritabanı başlatma hatası:', error);
        }
    }

    async createTables() {
        const client = await this.pool.connect();
        try {
            // Uydu izleme verileri tablosu
            await client.query(`
        CREATE TABLE IF NOT EXISTS satellite_monitoring (
          id SERIAL PRIMARY KEY,
          location VARCHAR(255) NOT NULL,
          pollution_level VARCHAR(50) NOT NULL,
          confidence INTEGER NOT NULL,
          coordinates JSONB NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          image_url TEXT,
          analysis_data JSONB,
          risk_score DECIMAL(3,1),
          recommendations TEXT[]
        )
      `);

            // Alarm tablosu
            await client.query(`
        CREATE TABLE IF NOT EXISTS alarms (
          id SERIAL PRIMARY KEY,
          location VARCHAR(255) NOT NULL,
          pollution_level VARCHAR(50) NOT NULL,
          confidence INTEGER NOT NULL,
          message TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMP
        )
      `);

            // İstatistik tablosu
            await client.query(`
        CREATE TABLE IF NOT EXISTS statistics (
          id SERIAL PRIMARY KEY,
          total_area INTEGER DEFAULT 0,
          clean_area INTEGER DEFAULT 0,
          moderate_pollution INTEGER DEFAULT 0,
          polluted_area INTEGER DEFAULT 0,
          critical_area INTEGER DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Kullanıcılar tablosu
            await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
        )
      `);

            // AI analiz geçmişi tablosu
            await client.query(`
        CREATE TABLE IF NOT EXISTS ai_analysis_history (
          id SERIAL PRIMARY KEY,
          image_url TEXT,
          coordinates JSONB,
          pollution_level VARCHAR(50),
          confidence INTEGER,
          risk_score DECIMAL(3,1),
          analysis_data JSONB,
          recommendations TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

            console.log('Tüm tablolar başarıyla oluşturuldu');
        } catch (error) {
            console.error('Tablo oluşturma hatası:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async insertSampleData() {
        const client = await this.pool.connect();
        try {
            // Sadece admin kullanıcısı ekle (statik veri yok)
            await client.query(`
        INSERT INTO users (username, email, password_hash, name, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO NOTHING
      `, ['admin', 'admin@ecomarine.com', '$2a$10$rQZ8K9mN2pL3oI4jK5lM6eR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6kL7mN8oP9qR', 'Admin User', 'admin']);

            console.log('Admin kullanıcısı eklendi - Tüm veriler dinamik olarak oluşturulacak');
        } catch (error) {
            console.error('Admin kullanıcısı ekleme hatası:', error);
        } finally {
            client.release();
        }
    }

    async getSatelliteMonitoringData() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT * FROM satellite_monitoring 
        ORDER BY timestamp DESC 
        LIMIT 20
      `);
            return result.rows;
        } catch (error) {
            console.error('Uydu izleme verileri alınırken hata:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getPollutionAnalysisData() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT * FROM satellite_monitoring 
        WHERE timestamp >= NOW() - INTERVAL '1 hour'
        ORDER BY timestamp DESC
      `);
            return result.rows;
        } catch (error) {
            console.error('Kirlilik analiz verileri alınırken hata:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getActiveAlarms() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT * FROM alarms 
        WHERE is_active = true 
        ORDER BY created_at DESC
      `);
            return result.rows;
        } catch (error) {
            console.error('Alarm verileri alınırken hata:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getMonitoringStatistics() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT * FROM statistics 
        ORDER BY last_updated DESC 
        LIMIT 1
      `);
            return result.rows[0] || {
                total_area: 0,
                clean_area: 0,
                moderate_pollution: 0,
                polluted_area: 0,
                critical_area: 0
            };
        } catch (error) {
            console.error('İstatistik verileri alınırken hata:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async savePollutionAnalysis(data) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        INSERT INTO satellite_monitoring (location, pollution_level, confidence, coordinates, timestamp, analysis_data, risk_score, recommendations)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
                data.location,
                data.pollution_level,
                data.confidence,
                JSON.stringify(data.coordinates || {}),
                data.timestamp,
                JSON.stringify(data.analysis_data || {}),
                data.risk_score || 0,
                data.recommendations || []
            ]);

            // Eğer kirlilik seviyesi yüksekse alarm oluştur
            if (['kirli', 'kritik'].includes(data.pollution_level)) {
                await this.createAlarm(data);
            }

            return result.rows[0];
        } catch (error) {
            console.error('Kirlilik analizi kaydetme hatası:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async createAlarm(data) {
        const client = await this.pool.connect();
        try {
            const message = `${data.location} bölgesinde ${data.pollution_level} seviye kirlilik tespit edildi`;

            await client.query(`
        INSERT INTO alarms (location, pollution_level, confidence, message, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [data.location, data.pollution_level, data.confidence, message, data.timestamp]);
        } catch (error) {
            console.error('Alarm oluşturma hatası:', error);
        } finally {
            client.release();
        }
    }

    async updateStatistics() {
        const client = await this.pool.connect();
        try {
            const result = await client.query(`
        SELECT 
          COUNT(*) as total_area,
          SUM(CASE WHEN pollution_level = 'temiz' THEN 1 ELSE 0 END) as clean_area,
          SUM(CASE WHEN pollution_level = 'orta_kirlilik' THEN 1 ELSE 0 END) as moderate_pollution,
          SUM(CASE WHEN pollution_level = 'kirli' THEN 1 ELSE 0 END) as polluted_area,
          SUM(CASE WHEN pollution_level = 'kritik' THEN 1 ELSE 0 END) as critical_area
        FROM satellite_monitoring 
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
      `);

            const stats = result.rows[0];
            await client.query(`
        INSERT INTO statistics (total_area, clean_area, moderate_pollution, polluted_area, critical_area, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [stats.total_area, stats.clean_area, stats.moderate_pollution, stats.polluted_area, stats.critical_area, new Date()]);
        } catch (error) {
            console.error('İstatistik güncelleme hatası:', error);
        } finally {
            client.release();
        }
    }

    async close() {
        await this.pool.end();
    }
}

export default Database;
