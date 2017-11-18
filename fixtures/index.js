// const Sequelize = require('sequelize');
// const db = new Sequelize('postgres://localhost:5432/mtg');
// const mtgJson = require('../AllCards.json');

// const mtgModel = db.define('cards', {

//     name: { type: Sequelize.STRING, allowNull: true },
//     cmc: { type: Sequelize.STRING, allowNull: true },
//     colors: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true },
//     flavor: { type: Sequelize.TEXT, allowNull: true },
//     layout: { type: Sequelize.STRING, allowNull: true },
//     manaCost: { type: Sequelize.STRING, allowNull: true },
//     // multiverseId: { type: Sequelize.INTEGER, allowNull: true },
//     mciNumber: { type: Sequelize.INTEGER, allowNull: true },
//     power: { type: Sequelize.STRING, allowNull: true },
//     toughness: { type: Sequelize.STRING, allowNull: true },
//     text: { type: Sequelize.TEXT, allowNull: true },
//     type: { type: Sequelize.STRING, allowNull: true },
//     types: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true }

// })
// const mtgKeys = Object.keys(mtgJson);

// const mtgArray = mtgKeys.map((name) => {
//     return mtgJson[name];
// })

// mtgModel.sync()
//     .then(() => {
//         // mtgKeys.forEach((name) => {
//         //     mtgModel.({
//         //         name: mtgJson[name].name,
//         //         colors: mtgJson[name].colors,
//         //         manaCost: mtgJson[name].manaCost,
//         //         type: mtgJson[name].type
//         //     });
//         // })
//         mtgModel.bulkCreate(mtgArray)
//     })
//     .catch();






