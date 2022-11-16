const mysql = require('mysql');
const dbconf = {
    host: "rivadb-dev.crsnlbvfbcnl.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "admin123",
    database: process.env.DATABASE_ENVIRONMENT,
    dateStrings: true,
};
const dbconnection = mysql.createConnection(dbconf);

dbconnection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("conectado a mysql!");
    }
});

module.exports = dbconnection;