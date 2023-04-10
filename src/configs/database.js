import sql from 'mysql2/promise'

const pool = sql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'food_app'
})

export default pool