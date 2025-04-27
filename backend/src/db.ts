import {Pool} from 'pg';

const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'Test1',
    password: process.env.PGPASSWORD || 'N0failsafe',
    port: Number(process.env.PGPORT) || 5432,
});

export default pool;
