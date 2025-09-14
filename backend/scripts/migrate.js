import Database from '../database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
    const db = new Database();
    try {
        console.log('Veritabanı migrasyonu başlatılıyor...');
        await db.createTables();
        console.log('Veritabanı migrasyonu tamamlandı!');
    } catch (error) {
        console.error('Migrasyon hatası:', error);
    } finally {
        await db.close();
    }
}

migrate();
