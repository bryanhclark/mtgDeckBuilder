const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/mtg');

const Card = db.define('cards', {

    name: { type: Sequelize.STRING, allowNull: true },
    cmc: { type: Sequelize.STRING, allowNull: true },
    colors: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true },
    flavor: { type: Sequelize.TEXT, allowNull: true },
    layout: { type: Sequelize.STRING, allowNull: true },
    manaCost: { type: Sequelize.STRING, allowNull: true },
    // multiverseId: { type: Sequelize.INTEGER, allowNull: true },
    mciNumber: { type: Sequelize.INTEGER, allowNull: true },
    power: { type: Sequelize.STRING, allowNull: true },
    toughness: { type: Sequelize.STRING, allowNull: true },
    text: { type: Sequelize.TEXT, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
    types: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true }

})

const Deck = db.define('deck', {
    name: { type: Sequelize.STRING, allowNull: true }
})

const decks_cards = db.define('cards_decks', {
    cardId: { type: Sequelize.INTEGER, allowNull: true },
    quantity: { type: Sequelize.INTEGER, allowNull: false }
})

decks_cards.belongsTo(Deck);


module.exports = {
    db: db,
    Card: Card,
    Deck: Deck,
    decks_cards: decks_cards
}