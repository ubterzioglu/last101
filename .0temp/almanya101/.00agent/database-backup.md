# Supabase Database Backup Configuration

## Connection Information

**Connection String:**
```
postgresql://postgres:PPPlll!11321132@db.ldptefnpiudquipdsezr.supabase.co:5432/postgres
```

**Project Details:**
- Database URL: `db.ldptefnpiudquipdsezr.supabase.co`
- Port: 5432
- Database: postgres
- User: postgres

## Backup Methods

### Method 1: Node.js Script (Recommended)

Create and run backup script:
```bash
cat > backup-db.js << 'EOF'
import pg from 'pg';
import fs from 'fs';

const { Client } = pg;
const connectionString = 'postgresql://postgres:PPPlll!11321132@db.ldptefnpiudquipdsezr.supabase.co:5432/postgres';

try {
  const client = new Client({ connectionString });
  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected!');

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

  const filename = `.0sql/supabase-backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.sql`;
  fs.writeFileSync(filename, sql);
  console.log(`\n✓ Backup completed: ${filename}`);
  await client.end();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
EOF
node backup-db.js
```

### Method 2: pg_dump (If Available)

```bash
pg_dump "postgresql://postgres:PPPlll!11321132@db.ldptefnpiudquipdsezr.supabase.co:5432/postgres" > .0sql/backup-$(date +%Y%m%d-%H%M%S).sql
```

### Method 3: Docker PostgreSQL Container

```bash
docker run --rm postgres:17 pg_dump "postgresql://postgres:PPPlll!11321132@db.ldptefnpiudquipdsezr.supabase.co:5432/postgres" > .0sql/backup-$(date +%Y%m%d-%H%M%S).sql
```

## Important Notes

### IPv6/IPv4 Issue
- **Problem**: Supabase shows "Not IPv4 compatible" in dashboard
- **Impact**: Docker containers may fail to connect due to IPv6 resolution issues
- **Solution**: Use Node.js native connection (Method 1) instead of Docker/pg_dump
- **Alternative**: Use Session Pooler in Supabase dashboard for IPv4 networks

### Dependencies
- Node.js project already has `pg` package installed (v8.18.0)
- No additional npm install needed for Method 1
- If pg package missing: `npm install pg`

### Backup File Management
- **SQL dosyaları:** `.0sql/` klasöründe saklanır
- **Git ignore:** Tüm `.0sql/` klasörü ignored
- **Dosya adı formatı:** `supabase-backup-YYYY-MM-DDTHH-MM-SS.sql`
- **Depolama:** Backup dosyaları repository'de değil, klasörde saklanır
- **Disaster recovery:** Backup'ları güvenli dış lokasyonda yedekleyin

### Database Structure
- **Last backup**: 39 tables total
- **Key tables**: devuser (88 rows), providers (205 rows), news_posts (28), vatandaslik_sorulari (469)
- **Tournament tables**: typing_*, tavla_*, vct_*, promote_participants
- **Public views**: Tables ending in `_public` for safe frontend queries

### Security
- Connection string contains sensitive password
- Store this file securely
- Never commit actual backup files to repository
- Rotate database password periodically via Supabase dashboard