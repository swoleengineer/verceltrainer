import Dexie from 'dexie';

const db = new Dexie('training');

db.version(1).stores({
    days: `day`,
    log: 'date'
});

export default db;
