## What the algorythm is doing
#### 1.) [Multichoose](https://en.wikipedia.org/wiki/Stars_and_bars_(combinatorics))
**Q:** what is multichoose?  
**A:** multichoose is very similar to the above-linked stars & bars combinatoric method of counting ways to place N balls in M bins with no restriction on how many balls each bin must have {min 0, max N}.  
**Q:** how is it not the same as stars & bars?  
**A:** our bins have maximum sizes. the bins represent abstracted cards, i.e. land cards, 'Island' cards, non-mana-producing-non-target cards... there is a maximum number in the deck of each of these things, we don't want to exceed it naively with a straigthforward stars & bars count  
**Q:** what exactly are we using multichoose for?  
**A:** to count the number of hands that satisfy the condition of being able to play a specific card in the deck, subject to the restrictions of mana cost, number of that card int he deck, and what turn of the game we are modeling.  
**Q:** how do we impose those restrictions?  
**A:** multilayered-multichoose! first we say, "well we know we need at least one of the target card, and the card's converted mana cost (C from here forward) number of lands". this leaves us with three bins:  
*a bin for the target card `with one ball in it initially`  
*a bin for lands `with C balls in it initially`  
*a bin for all the other cards in the deck  
however many cards we have left once we've assign C+1 of them accordingly to these three bins, thats what we do multichoose with. we use the alg to produce a hand for each different allocation of the remaining balls between these bins. then we do layer two...
at this point each hand has three bins. this isn't enough. so we take each hand and multichoose again on the lands bin the 'lands', producing a one-to-many relation between our generalized three-bin hand representations, and the more useful multichosen land bins. concatenate each of the latter with their former generalized incantation to get all the possible hands which satisfy the conditions. if additional layers of complexity aka new restrictions are to be injected into the algorythm, its likely that more layers of multichoose will be the most straightforward solution.  
**Q:** drawbacks?  
**A:** O(m^n). multichoose implements recusion and loops. still a ton faster than simulations, but third alternative might need to be explored if enough layers of restictions are added to the model  
**Q:** benefits?  
**A:** outputs data in the exact structure required for hypergeometric distribution calculations  
  
#### 2.) [Hypergeometric distribution](https://en.wikipedia.org/wiki/Hypergeometric_distribution)
**Q:** what is a hypergeometric distribution?  
**A:** a ratio of the following:  
*the ways to choose k specific things from a set of K things without replacement in no particular order  
*the ways to choose k specific things from a set of N things without replacement in no particular order 
where N >= K  
the familiar use case is computing probabilities of [poker hands](https://en.wikipedia.org/wiki/Poker_probability) (any addition or subtraction in the formulas of the table are a different principle: inclusion-exclusion)  
**Q:** how do we use hypergeometric distributions?  
**A:** given 'bins' with occupancy (number of things in them), and capacity (number of maximum thigns that can be in them), that encompass the entire population of bins we can compute a hypergeometric disribution. this is the format of the result of our multichoosing alg! each of the multichoosen hands represent mutually exclusive scenarios, thus we can simply add the probabilities of each computed by the [PMF](https://en.wikipedia.org/wiki/Probability_mass_function) of a hypergeometric distribution.  
**Q:** complications?  
**A:** large combinatoric numbers like `60!` are too big for JS. there was an easy fix for this. arithmatic helper functions were necessary, either int he form of an imported library or handwritten. we did ours ourself. problem solved!  
