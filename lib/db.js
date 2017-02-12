var model = module.exports;

model.sql = require('mysql2-promise')();
 
model.sql.configure({
    "host": "localhost",
    "user": "insta",
    "password": "dlstmxkrmfoa",
    "database": "insta"
});

