## 12-13-2017 - Notes

#### To Do List:

Abel: Handle Math and building the algo

###Components:
    * Basic Functionality
        * Build Deck:
            * Card Search:
                * state input text, have a dropdown with availble searchr results
                        * upon choosing a card, have a card stating area where user can select quantity then add to deck, or cancel card addition 
                        * on card selection, add card to current Deck List
                        * have decklist component rerender with updated deck list
                    Mana Sources:
                        - look at deckstats.net for how they handle adding basic lands to deck
                        - dont require the user to search for basic lands, just have a button -> add quantity the user desirs
                * Once deck building is complete, have deck submission button that runs manabase algo

##UX:
    * Deck Building Form:
         * start selecting cards + quantity from input field
            * then confirm addition to decklist
            * add basic lands from external land addition buttons
        * after deck building, user hits submit and algo runs and populates statistical table/charts
        * user has ability to edit deck again based on chart info
        * eventually, user can 'save' deck:
            * which adds the deck to our association tables

####Views
    * Landing/Home Page
    * Deck List
    * Deck Builder
        * Form:
            * Deck Name
            * Text Input
                * populate a drop down menu of available search results based on user input
            * Quantity
            * Submit/Cancel Button
            * Save/Calculate BUtton
                * Run algorithm
                * populate tables with propbability info
##Components:
    * DeckBuilder
        * we already have a textbox that parses cards to create a deck list
        * DeckList Component:
            * takes a list of cards and renders a unordered list of all the cards in the deck
                * try to have different lists based off of card type
                    * Card Type:
                        * Creature
                        * Spells (instant, sorcery, enchantments, etc)
                        * Artifacts
                        * Lands
                        * Sideboard
                            * allow user to swap sideboard and maindeck, and recalcuate statistics 
                                * have variable that says if card is in sideboard/maindeck
            * Card Info:
                * Name
                * Cmc
                * Quantity
                * On Hover of row, show card image preview

##React-Redux:
    * For form input/updating query, create JSON object
    * Key: 

###Component List:
    * Main
        - what gets renders to the dom
    * Home
        - attaches navbar to top
        - has the router + switch for routes
    * HomePage
    * Deck Lists
    * Deck Creator Page
        * Form
            * Alpha-Form
                * Text Area that we use to parse a CSV deck list
        * Deck Analyzer
            * gets current decklist from store
                * passes list to Decklist and Analysis Container as props                                        
            * Deck List
                * stateless
                * receives a decklist as props from Deck Analyzer
            * Analysis Container
                * stateless
                * receives a decklist as props from parent
                * runs caclulations based on deck
##Goals:
* Week of 12-13-17:
    

        
        
        
http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=430841&type=card