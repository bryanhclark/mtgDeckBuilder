const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/mtg', { logging: false });

const Card = db.define('cards', {

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

//optional mana cost reducer, could be useful
Card.prototype.cost = function(){
    return this.manaCost.split('{').slice(1).map(v=>v.slice(0,-1)).reduce((a,b)=>{
    if(Object.keys(a).includes(b)){
      a[b]++
    }else{
      if(!isNaN(parseInt(b))) a.colorless = parseInt(b)
      else a[b]=1
    }
    return a
  },{})
}

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
