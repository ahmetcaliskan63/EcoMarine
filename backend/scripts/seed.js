import Database from '../database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
    const db = new Database();
    try {
        console.log('Örnek veriler ekleniyor...');
        await db.insertSampleData();
        console.log('Örnek veriler başarıyla eklendi!');
    } catch (error) {
        console.error('Seed hatası:', error);
    } finally {
        await db.close();
    }
}

seed();
