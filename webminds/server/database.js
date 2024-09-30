// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// const dbPromise = open({
//     filename: './database.db',
//     driver: sqlite3.Database
// });

// const initDB = async () => {
//     const db = await dbPromise;
//     await db.run(`
//         CREATE TABLE IF NOT EXISTS cards (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             titulo TEXT NOT NULL,
//             descricao TEXT NOT NULL
//         )
//     `);
// };

// export { dbPromise, initDB };
