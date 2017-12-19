// probability calculators

// fuckJS
Array.prototype.copy = function(){
  return this.reduce((a,b)=>{
    if(Array.isArray(b)) a.push(b.copy())
    else a.push(b)
    return a
  },[])
}

function probabilityOfPlayingCard(cardsDrawn,card,deck,independent){
  if(isCardPlayable(card,cardsDrawn,deck)){
    let goodHands = parseHands(cardsDrawn,card,deck,independent)
    let P = 0
    cardsDrawn = (independent) ? cardsDrawn : cardsDrawn-1
    let deckSize = (independent) ? deck.length : deck.length-1
    goodHands.forEach(hand=>{
      P+=parseFloat(hypergeometric(cardsDrawn,hand,deckSize))
    })
    return P.toFixed(6)
  }
  else return 0
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

// test probabilityOfPlayingCard
// function test(deck,card,draws){
//   shuffle(deck)
//   let mana = deck.slice(0,draws).reduce((a,b)=>{
//     switch (b.name){
//       case 'Island':
//         if(a.U) a.U++
//         else a.U=1
//         break
//       case 'Forest':
//         if(a.G) a.G++
//         else a.G=1
//         break
//       case 'Mountain':
//         if(a.R) a.R++
//         else a.R=1
//         break
//       case 'Plains':
//         if(a.W) a.W++
//         else a.W=1
//         break
//       case 'Swamp':
//         if(a.B) a.B++
//         else a.B=1
//         break
//     }
//     return a
//   },{})
//   let cardCost = card.manaCost.split('{').slice(1).map(v=>v.slice(0,-1)).reduce((a,b)=>{
//     if(Object.keys(a).includes(b)){
//       a[b]++
//     }else{
//       if(!['B','G','W','R','U'].includes(b)) a.C = (!isNaN(parseInt(b))) ? parseInt(b) : 0
//       else a[b]=1
//     }
//     return a
//   },{})

//   let target = deck.slice(0,draws).map(v=>v.name).includes(card.name)
//   let manaC = Object.keys(cardCost).reduce((a,b)=>{
//     if(mana[b]<cardCost[b]) return a && false
//     else return a
//   },true)
//   let manaT = Object.keys(cardCost).reduce((a,b)=>a+cardCost[b],0) <= Object.keys(mana).reduce((a,b)=>a+mana[b],0)
//   return (target && manaT && manaC) ? 1: 0
// }

// let TestDeck = [
//   {name: 'Island' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Island' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Island' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Island' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Island' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Card1' , types:'{Other}' , type:'Other', manaCost: '{1}{R}{R}'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Card' , types:'{Other}' , type:'Other', manaCost: '{1}{G}{G}'},
//   {name: 'Plains' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Plains' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Plains' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Plains' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Plains' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Card1' , types:'{Other}' , type:'Other', manaCost: '{1}{R}{R}'}
//   ]
// let TargetCard = {
//   name: 'Card',
//   types:'{Other}',
//   type:'Other',
//   manaCost: '{1}{G}{G}'
// }
// console.time('PT: ')
// console.log('Prob = ',probabilityOfPlayingCard(10,TargetCard,TestDeck,true))
// console.timeEnd('PT: ')

// let sum = 0
// let tests = 1000000
// console.time('ST: ')
// for(var i=0;i<tests;i++){
//   sum+=test(TestDeck,TargetCard,10)
// }
// console.log('Stat = ',parseFloat(sum)/parseFloat(tests))
// console.timeEnd('ST: ')


// parseBins takes a card and a deck and returns an array of value groups which represent:
// ["number of this type of card in the hand", "number of this type of card in the deck",LABEL]
// each of the arrays can be directly input into the probability calc
function parseHands(numCards,card,deck,independent){

  // independant is a boolean denoting if the target card is assumed to be in the hand or not
  // numCards is the number of total cards drawn at a given turn of the game

  // currently does not work with all edge cases e.x.: {1}{X}{B} -> { colorless: 0, B: 1 }
  let cardCost = card.manaCost.split('{').slice(1).map(v=>v.slice(0,-1)).reduce((a,b)=>{
    if(Object.keys(a).includes(b)){
      a[b]++
    }else{
      if(!['B','G','W','R','U'].includes(b)) a.C = (!isNaN(parseInt(b))) ? parseInt(b) : 0
      else a[b]=1
    }
    return a
  },{})

  let convertedManaCost = Object.keys(cardCost).reduce((a,b)=>{
    return a+=cardCost[b]
  },0)

  let colorCost = convertedManaCost-cardCost.C

  // objectify deck into manaproducing, non-manaproducing, and target card groups
  let deckBins = (independent)
    ? deck.reduce((a,b)=>{
      // reducer for independent probability
      if(b.types.slice(1,5)==='Land'){
        a.L++
      }
      else if(b.name === card.name){
        a.T++
      }
      else{
        a.O++
      }
      return a
    },{O:0,T:0,L:0})
    : deck.reduce((a,b)=>{
      // reducer for independent probability
      if(b.types.slice(1,5)==='Land'){
        a.L++
      }
      else{
        a.O++
      }
      return a
    },{O:0,L:0})

  // arrafified deckBins
  let deckArray = []
  for(var i=0;i<Object.keys(deckBins).length;i++){
    let q
    switch(Object.keys(deckBins)[i]){
      case 'L':
        q = convertedManaCost
        break;
      case 'T':
        q = 1
        break;
      default:
        q = 0
        break;
    }
    deckArray.push([q,deckBins[Object.keys(deckBins)[i]],Object.keys(deckBins)[i]])
  }

  // objectify lands into relevant bins
  let landBins = deck.reduce((a,b)=>{
    if(b.types.slice(1,5)==='Land'){
      switch(b.name){
        case 'Island':
          if(a.U) a.U++
          else a.U=1
          break;
        case 'Forest':
          if(a.G) a.G++
          else a.G=1
          break;
        case 'Swamp':
          if(a.B) a.B++
          else a.B=1
          break;
        case 'Plains':
          if(a.W) a.W++
          else a.W=1
          break;
        case 'Mountain':
          if(a.R) a.R++
          else a.R=1
          break;
        default:
          if(a[b.name]) a[name]++
          else a[b.name]=1
          break;
      }
    }
    return a
  },{})

  // arrafified landBins
  let landArray = []
  for(var j=0;j<Object.keys(landBins).length;j++){
    landArray.push([(cardCost[Object.keys(landBins)[j]])?cardCost[Object.keys(landBins)[j]]:0,landBins[Object.keys(landBins)[j]],Object.keys(landBins)[j]])
  }

  // multichoosing between lands and nonlands
  let viableHands = []
  multichoose(numCards-convertedManaCost-1,deckArray,viableHands)

  //multichoosing lands
  viableHands = viableHands.reduce((a,b)=>{
    let landChoices = []
    multichoose(b[b.length-1][0]-colorCost,landArray,landChoices)
    return a.concat(landChoices.map(v=>b.slice(0,-1).concat(v)))
  },[])

  return viableHands
}

// tests for parseHands

// let testdeck = [
//   {name: 'Mountain' , types:'{Land,Creature}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Forest' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Swamp' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'Swamp' , types:'{Land}' , type:'Basic Land - ...'},
//   {name: 'testcard' , types:'{Other}' , type: 'Creature' , manaCost: '{1}{B}{G}'},
//   {name: 'testcard' , types:'{Other}' , type: 'Creature' , manaCost: '{1}{B}{G}'},
//   ]
// let testcard = {name: 'testcard', manaCost: '{1}{B}{G}'}
// parseHands(4,testcard,testdeck,true)


// bins: an array of bins with balls in them and maximum capacities
// numBalls: number of balls needing to be distributed
// combinations: global variable, collection of all ball-bin distributions
// combination: current combination which is being mutated

function multichoose(numBalls,bins,combinations,com = bins.copy()){
  // if out of balls, then push to combinations
  if(numBalls===0){
    combinations.push(com.copy())
  }

  // if all the bins haven't been cycled through
  else if(bins.length){

    // place balls into current bin one at a time until balls are gone or bin is full
    for(var i=0;i<=Math.min(bins[0][1]-bins[0][0],numBalls);i++){

      // set the number of balls in the current bin to the number in the origional bins plus the number of balls currently being placed (i)
      if(i) com[com.length-bins.length][0] = com[com.length-bins.length][0]+1
      // console.log(numBalls-i,com)

      // do multichoose with remaining balls on remaining bins
      multichoose(numBalls-i,bins.copy().slice(1),combinations,com.copy().slice(0))
    }
  }
}

// tests for multichoose

// let choices = []
// let bins = [[1,2,"b"],[0,3,"s"],[0,1,"a"],[0,4,"x"]]
// let com = bins.slice(0)
// multichoose(4,bins,choices)

// console.log('choices: ',choices)

// isCardPlayable returns boolean (if number of turns is sufficient to play card)

function isCardPlayable(card,draws,deck){
  // card is intended card to play
  // draws is the total number of cards drawn
  let turns = draws-7 >= card.manaCost.split('{').map(v=>v.slice(0,-1)).slice(1).reduce((a,b)=>{
    if(['B','R','W','G','U'].includes(b)) return a+1
    else return a+parseInt(b)
  },0)
  if(!turns) return false
  let cardCost = card.manaCost.split('{').slice(1).map(v=>v.slice(0,-1)).reduce((a,b)=>{
    if(Object.keys(a).includes(b)){
      a[b]++
    }else{
      if(!['B','G','W','R','U'].includes(b)) a.C = (!isNaN(parseInt(b))) ? parseInt(b) : 0
      else a[b]=1
    }
    return a
  },{})

  let manaComp = deck.reduce((a,b)=>{
    switch (b.name){
      case 'Island':
        a.U++
        break
      case 'Mountain':
        a.R++
        break
      case 'Forest':
        a.G++
        break
      case 'Swamp':
        a.B++
        break
      case 'Plains':
        a.W++
        break
    }
    return a
  },{W:0,R:0,G:0,B:0,U:0})

  for(var i=0;i<Object.keys(cardCost).length;i++){
    if(manaComp[Object.keys(cardCost)[i]]<cardCost[Object.keys(cardCost)[i]]) return false
  }
  return true
}

// tests for isCardPlayable

// let testcard = {manaCost: '{2}{B}{U}'}
// let testdraws = 11

// console.log(isCardPlayable(testcard,testdraws))

// hypergeometric gives probability for a given hand

function hypergeometric(draws,cards,deckSize){
  // starting hand size determines if enough turns have elapsed to play the necessary mana
  // draws must be the number of expected total draws
  // deckSize must be the total size of the deck
  // cards must be formatted as an array of pairs of quantities saught and quantities in deck, may also have additional entries but will have no baring on calculation
  draws = draws.toString()
  deckSize = deckSize.toString()
  cards = cards.map(v=>v.map(w=>w.toString()))
  let denomenator = nCk(deckSize,draws)
  let combinations = '1'
  for (var i=0;i<cards.length;i++){
    combinations = multiplyString(combinations,nCk(cards[i][1],cards[i][0]))
  }
  let numerator = (parseInt(draws) < cards.reduce((a,b)=>a+parseInt(b[0]),0)) ? '0' : combinations
  return divideString(numerator,denomenator,8)
}

// tests for hypergeometric

// let draws = '2'
// let cards = [['1','2','labelX'],['1','2','labelY']]
// let deck = '4'

// console.time('hypergeometric Time')
// console.log(hypergeometric(draws,cards,deck))
// console.time('hypergeometric Time')






// arithmatic helper functions for large numbers

// combinatorics

function StirlingSecond(n, k) {
  // // input check:
  // console.log('Stirling: ',n,k)
  if (greaterThan('1', n) || (n !== '0' && n === k)) return '1';
  if (greaterThan(k, n) || greaterThan('1', k)) return '0';
  if (n === '0' && k === '0') return '-1';
  result = '0';
  for (var j = 0; j <= k; j += 2) {
    result = additionString(
      result,
      multiplyString(
        nCk(k, j.toString()),
        StringPower(subtractString(k, j.toString()), n)
      )
    );
  }
  for (var i = 1; i <= k; i += 2) {
    result = subtractString(
      result,
      multiplyString(
        nCk(k, i.toString()),
        StringPower(subtractString(k, i.toString()), n)
      )
    );
  }
  return divideString(result, factorialString(k));
}

function nCk(n, k) {
  // // input check:
  // console.log('nCk',n,k)
  if (n === k || greaterThan('1', k)) return '1';
  return divideString(
    factorialString(n),
    multiplyString(factorialString(subtractString(n, k)), factorialString(k))
  );
}

function factorialString(n) {
  // // input check:
  // console.log('fact',n)
  if (greaterThan('2', n)) return '1';
  let m = n.slice(0);
  while (greaterThan(n, '1')) {
    n = subtractString(n, '1');
    m = multiplyString(m, n);
  }
  return m;
}

function StringPower(n, p) {
  // // input check:
  // console.log('pow',n,p)
  result = '1';
  while (p) {
    if (p & 1) {
      result = multiplyString(result, n);
    }
    n = multiplyString(n, n);
    p >>= 1;
  }
  return result;
}

// basic arthimatic

function multiplyString(a, b) {
  // // input check:
  // console.log('mult',a,b)
  var aa = a.split('').reverse();
  var bb = b.split('').reverse();
  var stack = [];
  for (var i = 0; i < aa.length; i++) {
    for (var j = 0; j < bb.length; j++) {
      var m = aa[i] * bb[j];
      stack[i + j] = stack[i + j] ? stack[i + j] + m : m;
    }
  }
  for (var i = 0; i < stack.length; i++) {
    var num = stack[i] % 10;
    var move = Math.floor(stack[i] / 10);
    stack[i] = num;
    if (stack[i + 1]) stack[i + 1] += move;
    else if (move != 0) stack[i + 1] = move;
  }
  return stack.reverse().join('').replace(/^(0(?!$))+/, '');
}

function divideString(a, b, d) {
  // // input check:
  // console.log('div',a,b)
  if (b === '0') return NaN
  let aa = multiplyString(a,StringPower('10',d)).split('')
  let k = aa.length
  let stack = []
  let temp, j
  for (var i = 0; i < k; i++) {
    aa[i] = aa[i].replace(/^(0(?!$))+/, '')
    j = 0
    if (greaterThan(b, aa[i])) {
      aa[i + 1] = aa[i] + aa[i + 1]
    } else {
      while (!greaterThan(b, aa[i])) {
        j++
        aa[i] = subtractString(aa[i], b)
      }
      aa[i + 1] = aa[i].replace(/^(0(?!$))+/, '') + aa[i + 1]
    }
    stack.push(j)
  }
  stack = stack.join('')
  return (d)?stack.slice(0,a.length).replace(/^(0(?!$))+/, '')+'.'+stack.slice(a.length) : stack.replace(/^(0(?!$))+/, '')
}

function additionString(n, m) {
  // // input check:
  // console.log('add',n,m)
  let nn = n.split('').reverse().map(v => parseInt(v));
  let mm = m.split('').reverse().map(v => parseInt(v));
  while (nn.length > mm.length) mm.push(0);
  while (mm.length > nn.length) nn.push(0);
  let kk = [];
  let r = 0;
  for (var i = 0; i < mm.length; i++) {
    kk.push((mm[i] + nn[i] + r) % 10);
    if (mm[i] + nn[i] + r >= 10) r = Math.floor((mm[i] + nn[i] + r) / 10);
    else r = 0;
  }
  if (r > 0) kk.push(r);
  return kk.reverse().join('').replace(/^(0(?!$))+/, '');
}

function subtractString(n, m) {
  // // input check:
  // console.log('sub',n,m)
  if (greaterThan(m, n)) return '-' + subtractString(m, n);
  let nn = n.split('').reverse();
  let mm = m.split('').reverse();
  while (nn.length > mm.length) mm.push('0');
  while (mm.length > nn.length) nn.push('0');
  let kk = [];
  for (i = 0; i < mm.length; i++) {
    if (greaterThan(mm[i], nn[i])) {
      nn[i] = (parseInt(nn[i]) + 10).toString();
      nn[i + 1] = (nn[i + 1] - 1).toString();
    }
    kk.push(nn[i] - mm[i]);
  }
  return kk.reverse().join('').replace(/^(0(?!$))+/, '');
}

//robust stringified-int comparitor

function greaterThan(x, y) {
  // // input check:
  // console.log('>: ',x,y)
  if (x[0] === '-' && y[0] !== '-') return false;
  else if (x[0] !== '-' && y[0] === '-') return true;
  x = x.replace(/^(0(?!$))+/, '');
  y = y.replace(/^(0(?!$))+/, '');
  if (x.length === y.length) return x > y;
  else return x.length > y.length;
}

// tests for arthimatic

// let x = '60';
// let y = '30';

// console.time('StirlingSecond Time');
// let result = StirlingSecond(x, y);
// console.log(result, ' Length: ', result.length);
// console.timeEnd('StirlingSecond Time');

// let a = '456'
// let b = '1234'
// let c = '2'

// console.time('StringPower Time');
// let result = StringPower(StringPower(a,b),c);
// console.log(result,'\n=',a,'^',b,'^',c, '\nLength: ', result.length);
// console.timeEnd('StringPower Time');
