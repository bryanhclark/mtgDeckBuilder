#MTG DATABASE

##Things Accomplished
-1)Got mtgjson object in folder and can now access data within it
##Things to do
-1)Identify which set properties we want to pay attention to
-2)Make sure each set has all of those properties
-3)start creating tables based on sets
-4) format of card/deck info on DOM after query? - check out gatherer format
-

##GOALS
-deckbuilder/mana calculator
--create deckbuilding functionality
--implement mana calculator
--use magic api to get card images

--use card's multiverse id with this api to get card images
http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=190420&type=card


##Things to Do
-re seed database with AllSets.json
    -so we have access to multiverseID

## Card Info
* Set Info Keys:
    * name
    * code
    * gathererCode
    * magicCardsInfoCode
    * releaseDate
    * border
    * type
    * block
    * booster
    * translations
    * mkm_name
    * mkm_id
    * cards
    * magicRaritiesCodes
    * oldCode
    * onlineOnly
    * alternativeNames

* Card Info Keys
    * artist - string
    * border - string
    * cmc - number
    * colorIdentity - array 
    * colors - array
    * flavor - flavor
    * hand - number
    * id - long string 
    * imageName - string
    * layout - string
    * life - number
    * loyalty - string
    * manaCost - string
    * mciNumber - string
    * multiverseid - number
    * name - string
    * names - array
    * number - string
    * power - string
    * rarity - string
    * reserved - boolean
    * releaseDate - string
    * starter - boolean
    * subtypes - array
    * supertypes - array
    * text - long string
    * timeshifted - boolean
    * toughness - string
    * type - string
    * types - array
    * variations - array of numbers pertaining to multiVerse (variations in the same set, )
    * watermark - string

* Mana Codes
    * {B} - Black
    * {G} - Green
    * {R} - Red
    * {U} - Blue
    * {W} - White

    4 Island, 


inputs deckName and cardList
deckName -> Deck model
cardList -> decks_cards
(one to many)
    -deckId   -cardId 


