// database.js
import pkg from 'pg';
import fetch from 'node-fetch';
const { Pool } = pkg;

class Database {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'ecomarine_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '8025',
    });
    this.init();
  }

  async init() {
    try {
      await this.createTables();
      console.log("✅ PostgreSQL tablolar hazır");
    } catch (err) {
      console.error("❌ DB init hatası:", err);
    }
  }

  async createTables() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS satellite_monitoring (
          id SERIAL PRIMARY KEY,
          location VARCHAR(255),
          pollution_level VARCHAR(50),
          confidence INTEGER,
          coordinates JSONB,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          image_url TEXT
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS statistics (
          id SERIAL PRIMARY KEY,
          total_area INTEGER,
          clean_area INTEGER,
          moderate_pollution INTEGER,
          critical_area INTEGER,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } finally {
      client.release();
    }
  }

  async getSatelliteMonitoringData() {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM satellite_monitoring ORDER BY timestamp DESC LIMIT 20
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getMonitoringStatistics() {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM statistics ORDER BY last_updated DESC LIMIT 1
      `);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  async getRandomSatelliteRecords(limit = 3) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT id, location, image_url, coordinates 
         FROM satellite_monitoring 
         ORDER BY RANDOM() 
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async updateSatelliteRecord(id, aiData) {
    const client = await this.pool.connect();
    try {
      if (!aiData || !aiData.prediction) {
        console.error("❌ Geçersiz AI verisi:", aiData);
        return;
      }

      // Label (temiz/kirli)
      const pollutionLevel = aiData.prediction.label;

      // Confidence: en yüksek ihtimal yüzdesi
      const probs = aiData.prediction.probs || {};
      const maxProb = Math.max(...Object.values(probs));
      const confidence = Math.round(maxProb * 100);

      let pollutionRate = 0;
      if (pollutionLabel === "kirli" || pollutionLabel === "kritik") {
        pollutionRate = Math.round(probs.kirli * 100);
      } else {
        pollutionRate = Math.round(probs.kirli * 100); // temizse bu düşük bir yüzde olur
      }
      
      await db.pool.query(
        "UPDATE satellite_monitoring SET pollution_level=$1, confidence=$2 WHERE id=$3",
        [pollutionLabel, pollutionRate, id]
      );

      console.log(`💾 DB Güncellendi -> ID ${id}: ${pollutionLevel} (%${confidence})`);
    } catch (err) {
      console.error("❌ DB güncelleme hatası:", err.message);
    } finally {
      client.release();
    }
  }


  async updateSatelliteDataWithAI() {
    const client = await this.pool.connect();
    try {
      const rows = await client.query(`
        SELECT id, image_url, coordinates, location 
        FROM satellite_monitoring 
        ORDER BY RANDOM() 
        LIMIT 3
      `);

      if (rows.rows.length === 0) {
        console.error("❌ DB’de uydu kaydı yok, analiz yapılmadı");
        return null;
      }

      for (const row of rows.rows) {
        try {
          const response = await fetch(`${process.env.AI_API_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: row.image_url,
              coordinates: row.coordinates,
              location: row.location
            })
          });

          if (!response.ok) {
            throw new Error(`AI API HTTP ${response.status}`);
          }

          const aiResult = await response.json();
          console.log(`✅ AI sonucu ${row.location}:`, aiResult);

          await client.query(`
            UPDATE satellite_monitoring
            SET pollution_level=$1, confidence=$2, timestamp=NOW()
            WHERE id=$3
          `, [aiResult.pollution_level, aiResult.confidence, row.id]);

        } catch (err) {
          console.error(`❌ AI analiz hatası (${row.location}):`, err.message);
        }
      }

      return true;
    } finally {
      client.release();
    }
  }
}

export default Database;
