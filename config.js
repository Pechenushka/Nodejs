module.exports = {
    development: {
    url: process.env.DEV_DATABASE_URL,
        username: process.env.DEV_NAME,
        password: process.env.DEV_PASS,
        database: process.env.DEV_DB_NAME,
        host: process.env.DEV_DB_HOST,
        dialect: 'postgres'
},
production: {
    url: process.env.DEV_DATABASE_URL,
    username: process.env.DEV_NAME,
    password: process.env.DEV_PASS,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: 'postgres'
    // url: process.env.PROD_DATABASE_URL,
    //     username: process.env.PROD_NAME,
    //     password: process.env.PROD_PASS,
    //     database: process.env.PROD_DB_NAME,
    //     host: process.env.PROD_DB_HOST,
    //     dialect: 'postgres'
}
}