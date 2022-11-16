const connection = require("./connection");

function list(table, filter) {
    return new Promise((resolve, reject) => {
        const sql = filter == '' || filter === undefined ? `SELECT * FROM ${table}` : `SELECT * FROM ${table} WHERE ${filter}`;
        connection.query(sql, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}

function get(table, filter) {
    return new Promise((resolve, reject) => {
        const sql1 = `SELECT * FROM ${table} WHERE ${filter}`;
        connection.query(sql1, (err, data) => {
            if (err) return reject(err);
            resolve(data[0]);
        });
    });
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        const sql1 = `INSERT INTO ${table} SET ?`;
        connection.query(sql1, data, (err1, result) => {
            if (err1) return reject(err1);
            resolve(result);
        })
    })
}

function update(table, data, id) {
    return new Promise((resolve, reject) => {
        const sql1 = `UPDATE ${table} SET ? WHERE ${id}`;
        connection.query(sql1, [data], (err1, result) => {
            if (err1) return reject(err1);
            resolve(result);
        })
    })
}




module.exports = {
    list,
    get,
    insert,
    update,
};