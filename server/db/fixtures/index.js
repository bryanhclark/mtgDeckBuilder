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

const cardsWithMultiverseId = allCards.filter(card => {
    if (card.multiverseid) {
        return card
    };
})


// seed file for mtg db
// Card.sync({
//         force: true
//     })
//     .then(() => {
//         Card.bulkCreate(cardsWithMultiverseId);

//     })
//     .then(() => {
//         console.log('success');
//     })
//     .catch();