const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/mtg', {
    logging: false
});

const Card = db.define('cards', {

    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cmc: {
        type: Sequelize.STRING,
        allowNull: true
    },
    colors: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true
    },
    flavor: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    layout: {
        type: Sequelize.STRING,
        allowNull: true
    },
    manaCost: {
        type: Sequelize.STRING,
        allowNull: true
    },
    multiverseid: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    mciNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    power: {
        type: Sequelize.STRING,
        allowNull: true
    },
    toughness: {
        type: Sequelize.STRING,
        allowNull: true
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    set: {
        type: Sequelize.STRING,
        allowNull: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: true
    },
    types: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true
    }

},{
    // this needs a lot of work
    // best way to do so is probably with test decks once the UI is working. then change the hook when edge cases become apparent
    getterMethods:{
        ProducibleManaColors(){
            return (card.type.indexOf('Land')===-1)
            ? false
            : card.text.split('\n').reduce((a,b)=>{
                if(b.indexOf('{T}') < b.indexOf('Add')){
                    if(b.indexOf('{B}')>0 && a.indexOf('B')<0) a+='B'
                    if(b.indexOf('{G}')>0 && a.indexOf('G')<0) a+='G'
                    if(b.indexOf('{W}')>0 && a.indexOf('W')<0) a+='W'
                    if(b.indexOf('{R}')>0 && a.indexOf('R')<0) a+='R'
                    if(b.indexOf('{U}')>0 && a.indexOf('U')<0) a+='U'
                    if(b.indexOf('{C}')>0 && a.indexOf('C')<0) a+='C'
                    if(b.indexOf('any color')>0 && a.indexOf('B')<0) a+='WRGBU'
                }
                if(b.indexOf(`Sacrifice ${card.name}: Search`) > -1){
                    a+='F'
                }
                return a
            },'').split('').sort().join(',')
        }
    }
})


const Deck = db.define('deck', {
    name: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

const decks_cards = db.define('cards_decks', {
    cardId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

decks_cards.belongsTo(Deck);


module.exports = {
    db: db,
    Card: Card
}
