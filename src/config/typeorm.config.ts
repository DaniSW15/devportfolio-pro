import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'devtools_hub',
    entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../shared/database/migrations/*{.ts,.js}'],
});
