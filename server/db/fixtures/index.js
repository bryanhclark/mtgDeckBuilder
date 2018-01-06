const db = require('../models');
const Card = db.Card
const mtgJson = require('./AllSets.json')



//an array of all the keys

//within each set[array] -> get cards array

//optional mana cost reducer, could be useful
//converts manacost to object, e.x.: '{2}{B}{B}{U}' => { colorless: 2, B: 2, U: 1 }
// Card.prototype.cost = function () {
//     return this.manaCost.split('{').slice(1).map(v => v.slice(0, -1)).reduce((a, b) => {
//         if (Object.keys(a).includes(b)) {
//             a[b]++
//         } else {
//             if (!isNaN(parseInt(b))) a.colorless = parseInt(b)
//             else a[b] = 1
//         }
//         return a
//     }, {})
// }

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

const cardsWithMultiverseId = allCards.reduce((cards,card,i) => {
    if (card.multiverseid) {

        let ProducibleManaColors = (card.text)?(card.type.indexOf('Land') === -1) ?
            false :
            card.text.split('\n').reduce((a, b) => {
                if (b.indexOf('{T}') < b.indexOf('Add')) {
                    if (b.indexOf('{B}') > 0 && a.indexOf('B') < 0) a += 'B'
                    if (b.indexOf('{G}') > 0 && a.indexOf('G') < 0) a += 'G'
                    if (b.indexOf('{W}') > 0 && a.indexOf('W') < 0) a += 'W'
                    if (b.indexOf('{R}') > 0 && a.indexOf('R') < 0) a += 'R'
                    if (b.indexOf('{U}') > 0 && a.indexOf('U') < 0) a += 'U'
                    if (b.indexOf('{C}') > 0 && a.indexOf('C') < 0) a += 'C'
                    if (b.indexOf('any color') > 0 && a.indexOf('B') < 0) a += 'WRGBU'
                }
                if (b.indexOf(`Sacrifice ${card.name}: Search`) > -1) {
                    a += 'F'
                }
                return a
            }, '').split('').sort().join(',') || false : false

        let fetchOptions = (ProducibleManaColors === 'F') ? card.text.split('\n').reduce((a, b) => {
            if (b.indexOf(`Sacrifice ${card.name}: Search`) > -1) {
                if (b.indexOf('basic') > 0 && a.indexOf('C') < 0) a += 'Basic,'
                if (b.indexOf('Mountain') > 0 && a.indexOf('C') < 0) a += 'Mountain,'
                if (b.indexOf('Forest') > 0 && a.indexOf('C') < 0) a += 'Forest,'
                if (b.indexOf('Island') > 0 && a.indexOf('C') < 0) a += 'Island,'
                if (b.indexOf('Swamp') > 0 && a.indexOf('C') < 0) a += 'Swamp,'
                if (b.indexOf('Plains') > 0 && a.indexOf('C') < 0) a += 'Plains,'
            }
            return a
        },'').slice(0,-1) : false

        cards.push(Object.assign({}, card, { fetchOptions , ProducibleManaColors , uniqueName: (card.name + ' (' + card.set + ') #' + card.multiverseid)}))
    };
    return cards
},[])


// seed file for mtg db
Card.sync({
        force: true
    })
    .then(() => {
        Card.bulkCreate(cardsWithMultiverseId);

    })
    .then(() => {
        console.log('success');
    })
    .catch();
