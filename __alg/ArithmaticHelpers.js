// fuckJS
Array.prototype.copy = function () {
  return this.reduce((a, b) => {
    if (Array.isArray(b)) a.push(b.copy());
    else a.push(b);
    return a;
  }, []);
};

// fuckJS again
function copy(data) {
  if (Array.isArray(data)) {
    return data.slice(0).reduce((a, b) => {
      a.push(copy(b));
      return a;
    }, []);
  } else if (typeof data === 'object') {
    return Object.keys(data).reduce((a, b) => {
      a[b] = copy(data[b]);
      return a;
    }, {});
  } else return data;
}

// computes probability

export const probabilityOfPlayingCard = function(
  cardsDrawn,
  card,
  deck,
  startingHandSize = 7
) {
  if (cardPlayable(cardsDrawn, card, deck, startingHandSize)) {
    // creating abstracted hands
    let goodHands = parseHands(cardsDrawn, card, deck);

    // computing probability of each hand and adding to tally
    let P = 0;
    let deckSize = deck.length
    let memo = {};
    goodHands.forEach(hand => {
      P += parseFloat(hypergeometric(cardsDrawn, hand, deckSize, memo));
    });
    return P.toFixed(3);
  } else return 0;
}

// enumerating every possible playable-hand given a card and a deck
// *works well atm
function parseHands(numCards, card, deck) {
  // card's cost

  let cost = cardCost(card);
  let convertedManaCost = Object.keys(cost).reduce((a, b) => {
    return (a += cost[b]);
  }, 0);
  let colorCost = convertedManaCost - (cost.C || 0);

  // * place for possible adjustments
  // fetch-land adjustment
  let costCopy = copy(cost)
  deck = deck.reduce((a, b) => {
    if (b.ProducibleManaColors === 'F') {
      let f = landToFetch(costCopy, a, b.fetchOptions)
      a.push(landToFetch(costCopy, a, b.fetchOptions))

      // adjusts cost to weight unfetched lands more heavily
      Object.keys(costCopy).forEach(v => {
        if (!f.ProducibleManaColors.split(',').includes(v)) costCopy[v]++
      })
    }
    return a
  }, deck.copy()).filter(
    v => (v.ProducibleManaColors ? !(v.ProducibleManaColors === 'F') : true)
    );

  // deck bins: target, lands, other
  let deckBins = deck.reduce(
    (a, b) => {
      if (b.type.includes('Land')) {
        a.L++;
      } else if (b.name === card.name) {
        a.T++;
      } else {
        a.O++;
      }
      return a;
    },
    { O: 0, T: 0, L: 0 }
  );

  // arrafified deckBins
  let deckArray = [];
  for (var i = 0; i < Object.keys(deckBins).length; i++) {
    let q;
    switch (Object.keys(deckBins)[i]) {
      case 'L':
        q = convertedManaCost;
        break;
      case 'T':
        q = 1;
        break;
      default:
        q = 0;
        break;
    }
    deckArray.push([
      q,
      deckBins[Object.keys(deckBins)[i]],
      Object.keys(deckBins)[i],
    ]);
  }

  // landBins: each variety of different mana-producers
  let landBins = JSONmanaBase(deck);

  // multichoosing for necessary colored mana
  let necessaryManaOptions = Object.keys(cost).reduce(
    (a, b) => {
      let options = Object.keys(landBins).reduce((c, d) => {
        if (d.split(',').includes(b)) {
          c.push([0, landBins[d], d]);
        }
        return c;
      }, []);

      if (options.length) {
        let color = [];
        multichoose(cost[b], options, color);
        return color.reduce((c, d) => {
          return c.concat(a.map(v => v.concat(d)));
        }, []);
      } else return a;
    },
    [[]]
  );

  // fixing cases where multicolored lands could be used for multiple necessary color
  if (
    necessaryManaOptions
      .map(w => w.map(x => x[2]).map((v, i, a) => a.slice(i + 1).includes(v)))
      .map(w => w.reduce((a, b) => a || b, false))
      .reduce((a, b) => a || b, false)
  ) {
    necessaryManaOptions = necessaryManaOptions.reduce((a, b) => {
      // turns each hand into an object, consolidating duplicated mana-producers
      let ObjectifiedHand = b.reduce((c, d) => {
        if (c[d[2]]) c[d[2]][0] += d[0];
        else c[d[2]] = [d[0], d[1]];
        return c;
      }, {});
      //sees if object has overfilled any mana-producing type, only retains hand otherwise
      let hand = Object.keys(ObjectifiedHand).reduce((c, d) => {
        if (ObjectifiedHand[d][0] > ObjectifiedHand[d][1]) c.push(false);
        else if (!c.includes(false))
          c.push([ObjectifiedHand[d][0], ObjectifiedHand[d][1], d]);
        return c;
      }, []);
      if (!hand.includes(false)) a.push(hand);
      return a;
    }, []);
  }

  // adding remaining bins to each index of 'necessaryManaOptions'
  let binnedColors = necessaryManaOptions[0].map(v => v[2]) || [];
  let unbinnedColors = Object.keys(landBins).reduce(
    (x, y) => (!binnedColors.includes(y) ? x.concat(y) : x),
    []
  );
  necessaryManaOptions = necessaryManaOptions.map(v =>
    v.concat(
      unbinnedColors.map(w => {
        return [0, landBins[w], w];
      })
    )
  );

  // multichoosing remaining lands for colorless mana
  let ledger = {};
  let landChoices = necessaryManaOptions.reduce((a, b) => {
    let choices = [];
    multichoose(convertedManaCost - colorCost, b, choices);
    choices.forEach(v => {
      // * possibly unnecessary memoization
      // a.push(v);
      if (!ledger[v.toString()]) {
        ledger[v.toString()] = true;
        a.push(v);
      }
    });
    return a;
  }, []);

  // multichoosing between lands and nonlands
  let viableHands = [];
  multichoose(numCards - convertedManaCost - 1, deckArray, viableHands);

  // multichoosing remaining unnecessary lands
  ledger = {};
  let viable = viableHands.reduce((a, b) => {
    let hands = [];
    landChoices.forEach(v => {
      multichoose(b[b.length - 1][0] - convertedManaCost, v, hands);
    });
    hands.forEach(v => {
      let key = b.slice(0, 2).concat(v).toString();
      if (!ledger[key]) {
        ledger[key] = 1;
        a.push(b.slice(0, 2).concat(v));
      }
    });
    return a;
  }, []);

  return viable;
}

// creates JSON manaBase

function JSONmanaBase(deck) {
  return deck.reduce((a, b) => {
    if (b.ProducibleManaColors) {
      if (a[b.ProducibleManaColors]) a[b.ProducibleManaColors]++;
      else if (b.ProducibleManaColors!=='false') a[b.ProducibleManaColors] = 1;
    }
    return a;
  }, {});
}

// arrayifies manaCost

function cardCost(card) {
  return card.manaCost
    .split('{')
    .slice(1)
    .map(v => v.slice(0, -1))
    .reduce((a, b) => {
      if (Object.keys(a).includes(b)) {
        a[b]++;
      } else {
        if (!['B', 'G', 'W', 'R', 'U'].includes(b))
          a.C = !isNaN(parseInt(b)) ? parseInt(b) : 0;
        else a[b] = 1;
      }
      return a;
    }, {});
}

// best guess at land to fetch, returns a new card object
// * place for possible adjustments
// ** this is an optimization problem, expert discretion important here**
function landToFetch(manaCost, deck, fetchOptions) {
  return deck
    .filter(
    v => {
      return v.type.split(' ').includes(fetchOptions.split(',')[0]) ||
        v.type.split(' ').includes(fetchOptions.split(',')[1])
    })
    .reduce(
    (a, b) => {
      let score = 0;
      Object.keys(manaCost).forEach(v => {
        if (b.ProducibleManaColors.split(',').includes(v)) {
          // this line is the one that needs expertise
          score += manaCost[v] + b.ProducibleManaColors.length;
        }
      });
      if (score > a[0]) a = [score, copy(b)];
      return a
    },
    [0, null]
    )[1];
}

// boolean of if deck (or hand) can play card
// *works well atm
function cardPlayable(draws, card, deck, startingHandSize = 7) {
  deck = deck.copy();
  let cost = cardCost(card);
  let convertedManaCost = Object.keys(cost).reduce((a, b) => a + cost[b], 0);
  let manaBase = JSONmanaBase(deck);
  let turnCondition = draws - startingHandSize >= convertedManaCost-1;
  let manaCondition =
    Object.keys(manaBase).reduce((a, b) => a + manaBase[b], 0) >=
    convertedManaCost;
  let colorCondition = Object.keys(cost).reduce((a, b) => {
    Object.keys(manaBase).forEach(v => {
      if (v.split(',').includes(b)) {
        let min = Math.min(manaBase[v], cost[b]);
        cost[b] -= min;
        manaBase[v] -= min;
      }
    });
    return a && cost[b] <= 0;
  }, true);
  let includesCondition = deck.map(v => v.name).includes(card.name);

  // // console log that im tired of rewriting
  // console.log(deck.map(v=>(v.ProducibleManaColors)?v.ProducibleManaColors:v.name),colorCondition , manaCondition , turnCondition , includesCondition)

  return colorCondition && manaCondition && turnCondition && includesCondition;
}

// mutator function that places 'numBalls' balls into 'bins' with repitition and without exceeding the capacity of the bins

function multichoose(numBalls, bins, combinations, com = bins.copy()) {
  // if out of balls, then push to combinations
  if (numBalls === 0) {
    combinations.push(com.copy());
  } else if (bins.length) {
    // if all the bins haven't been cycled through
    // place balls into current bin one at a time until balls are gone or bin is full
    for (var i = 0; i <= Math.min(bins[0][1] - bins[0][0], numBalls); i++) {
      // set the number of balls in the current bin to the number in the origional bins plus the number of balls currently being placed (i)
      if (i)
        com[com.length - bins.length][0] = com[com.length - bins.length][0] + 1;
      // console.log(numBalls-i,com)

      // do multichoose with remaining balls on remaining bins
      multichoose(
        numBalls - i,
        bins.copy().slice(1),
        combinations,
        com.copy().slice(0)
      );
    }
  }
}

// hypergeometric gives probability for a given hand, memoized (best to pass in a memo from higher scope)

function hypergeometric(draws, cards, deckSize, memo = {}) {
  // starting hand size determines if enough turns have elapsed to play the necessary mana
  // draws must be the number of expected total draws
  // deckSize must be the total size of the deck
  // cards must be formatted as an array of pairs of quantities saught and quantities in deck, may also have additional entries but will have no baring on calculation
  draws = draws.toString();
  deckSize = deckSize.toString();
  if (!memo[deckSize + ',' + draws]) {
    memo[deckSize + ',' + draws] = nCk(deckSize, draws);
  }
  let denomenator = memo[deckSize + ',' + draws];
  let numerator = '1';
  for (var i = 0; i < cards.length; i++) {
    if (!memo[cards[i][1].toString() + ',' + cards[i][0].toString()]) {
      memo[cards[i][1].toString() + ',' + cards[i][0].toString()] = nCk(
        cards[i][1],
        cards[i][0]
      );
    }
    numerator = multiplyString(
      numerator,
      memo[cards[i][1].toString() + ',' + cards[i][0].toString()]
    );
    console.log(numerator,denomenator)
  }
  return divideString(numerator, denomenator, 8);
}

// arithmatic helper functions for large numbers

function nCk(n, k) {
  let result = '1';
  let d = 1;
  for (var i = n; i > Math.max(n - k, k); i--) {
    result = multiplyString(result, i.toString());
    result = divideString(result, d.toString());
    d++;
  }
  return result;
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
  let result = '1';
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

// third parameter is number of decimal places
function divideString(a, b, d) {
  // // input check:
  // console.log('div',a,b)
  if (b === '0') return NaN;
  let aa = multiplyString(a, StringPower('10', d)).split('');
  let k = aa.length;
  let stack = [];
  let temp, j;
  for (var i = 0; i < k; i++) {
    aa[i] = aa[i].replace(/^(0(?!$))+/, '');
    j = 0;
    if (greaterThan(b, aa[i])) {
      aa[i + 1] = aa[i] + aa[i + 1];
    } else {
      while (!greaterThan(b, aa[i])) {
        j++;
        aa[i] = subtractString(aa[i], b);
      }
      aa[i + 1] = aa[i].replace(/^(0(?!$))+/, '') + aa[i + 1];
    }
    stack.push(j);
  }
  stack = stack.join('');
  return d
    ? stack.slice(0, a.length).replace(/^(0(?!$))+/, '') +
    '.' +
    stack.slice(a.length)
    : stack.replace(/^(0(?!$))+/, '');
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
  for (var i = 0; i < mm.length; i++) {
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
