const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config');
const env = process.env.NODE_ENV || 'development';

const basename = path.basename(__filename);
const db = {};
let sequelize;
if (env == 'development' && config.development.url) {
    sequelize = new Sequelize(config.development.url);
} else if (env == 'production' && config.production.url) {
    sequelize = new Sequelize(config.production.url);
} else if (env == 'production') {
    sequelize = new Sequelize(config.production.database, config.production.username, config.production.password, {
        host: config.production.host,
        dialect: config.production.dialect
    });
} else {
    sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
        host: config.development.host,
        dialect: config.development.dialect
    });
}

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;