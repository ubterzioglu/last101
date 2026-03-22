import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

// URL encode the password
const password = encodeURIComponent('[PPPlll!11321132]');
const connectionString = `postgresql://postgres:${password}@db.ldptefnpiudquipdsezr.supabase.co:5432/postgres`;

console.log('Attempting connection with encoded password...');

try {
  const client = new Client({ connectionString });
  
  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected!');
  
  // Simple test query
  const result = await client.query('SELECT NOW()');
  console.log('Server time:', result.rows[0].now);
  
  await client.end();
  console.log('Connection test successful!');
} catch (error) {
  console.error('Error:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}
