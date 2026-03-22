import pg from 'pg';
import fs from 'fs';

const { Client } = pg;
const connectionString = 'postgresql://postgres:PPPlll!11321132@db.ldptefnpiudquipdsezr.supabase.co:5432/postgres';

try {
  const client = new Client({ connectionString });
  
  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected!');
  
  // Get all tables
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  
  console.log(`Found ${tables.rows.length} tables`);
  
  let sql = `-- Database backup ${new Date().toISOString()}\n`;
  
  for (const row of tables.rows) {
    const tableName = row.table_name;
    console.log(`Processing: ${tableName}`);
    
    // Get table schema
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1 AND table_schema = 'public'
      ORDER BY ordinal_position
    `, [tableName]);
    
    sql += `-- Table: ${tableName}\n`;
    sql += `DROP TABLE IF EXISTS ${tableName} CASCADE;\n`;
    sql += `CREATE TABLE ${tableName} (\n`;
    
    const columns = schema.rows.map((col, i) => {
      let colDef = `  ${col.column_name} ${col.data_type}`;
      if (col.is_nullable === 'NO') colDef += ' NOT NULL';
      if (col.column_default) colDef += ` DEFAULT ${col.column_default}`;
      return colDef + (i < schema.rows.length - 1 ? ',' : '');
    });
    sql += columns.join('\n');
    sql += '\n);\n\n';
    
    // Get data
    const data = await client.query(`SELECT * FROM ${tableName}`);
    console.log(`  ${data.rowCount} rows`);
    
    if (data.rowCount > 0) {
      const cols = Object.keys(data.rows[0]);
      const values = data.rows.map(row => {
        const vals = cols.map(col => {
          const val = row[col];
          if (val === null) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
          return String(val);
        });
        return `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${vals.join(', ')});`;
      });
      sql += values.join('\n') + '\n\n';
    }
  }
  
  const filename = `supabase-backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.sql`;
  fs.writeFileSync(filename, sql);
  
  console.log(`\n✓ Backup completed: ${filename}`);
  await client.end();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
