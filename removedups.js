const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: '4U2qZCUDWtsTpiQ.root',
    password: 'VJVsC0FBMekCd5ez',
    database: 'signimus_jobs',
    ssl: { rejectUnauthorized: false },
  });
  // Keep only the latest record for each name+title combo
  const [rows] = await conn.execute('SELECT id, name, title, created_at FROM profiles ORDER BY created_at DESC');
  const seen = new Set();
  const toDelete = [];
  for (const row of rows) {
    const key = (row.name + '|' + row.title).toLowerCase().trim();
    if (seen.has(key)) {
      toDelete.push(row.id);
    } else {
      seen.add(key);
    }
  }
  console.log('Duplicates found:', toDelete.length);
  if (toDelete.length > 0) {
    for (const id of toDelete) {
      await conn.execute('DELETE FROM profiles WHERE id = ?', [id]);
    }
    console.log('Deleted:', toDelete.length);
  }
  await conn.end();
}
main().catch(console.error);
