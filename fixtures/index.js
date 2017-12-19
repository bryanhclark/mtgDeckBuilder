const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/mtg', { logging: false });
//All Sets of mtg w/l multiverseId's
const mtgJson = require('../AllSets.json');
//array of all mtg sets

const mtgModel = db.define('cards', {
    name: { type: Sequelize.STRING, allowNull: true },
    cmc: { type: Sequelize.STRING, allowNull: true },
    colors: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true },
    flavor: { type: Sequelize.TEXT, allowNull: true },
    layout: { type: Sequelize.STRING, allowNull: true },
    manaCost: { type: Sequelize.STRING, allowNull: true },
    multiverseid: { type: Sequelize.INTEGER, allowNull: true },
    mciNumber: { type: Sequelize.STRING, allowNull: true },
    power: { type: Sequelize.STRING, allowNull: true },
    toughness: { type: Sequelize.STRING, allowNull: true },
    text: { type: Sequelize.TEXT, allowNull: true },
    set: { type: Sequelize.STRING, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
    types: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true }

})
//an array of all the keys

//within each set[array] -> get cards array




const mtgSets = Object.keys(mtgJson);
let setNames = mtgSets.map((name) => {
    return mtgJson[name].name;
})
//get array of each cards array
const cardSets = mtgSets.map((name) => {
    return mtgJson[name].cards;
})


for (var i = 0; i < setNames.length; i++) {
    for (var j = 0; j < cardSets[i].length; j++) {
        cardSets[i][j].set = setNames[i];
    }
}


//forEach array, push into a cards array
//nested forEach
const allCards = []

cardSets.forEach(function (cardSet) {
    cardSet.forEach(function (card) {
        delete card.id;
        allCards.push(card);
    })
})

const cardsWithMultiverseId = allCards.filter(card => {
    if (card.multiverseid) {
        return card
    };
})

console.log(cardsWithMultiverseId.length);


// seed fial for mtg db
mtgModel.sync({ force: true })
    .then(() => {
        mtgModel.bulkCreate(cardsWithMultiverseId);

    })
    .then(() => {
        console.log('sucess');
    })
    .catch();






