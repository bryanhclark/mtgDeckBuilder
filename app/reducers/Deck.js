


const ADD_CARD_TO_DECK = 'ADD_CARD_TO_DECK'




export const addCardToDeck = (newCard) => {
    return {
        type: ADD_CARD_TO_DECK,
        newCard
    }
}




const deckReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_CARD_TO_DECK:
            return [...state, action.newCard]
        default:
            return state
    }
}

export default deckReducer;
