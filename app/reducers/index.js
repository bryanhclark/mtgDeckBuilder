import { combineReducers } from 'redux'
import filteredCards from './cards'
import deckReducer from './Deck'



const rootReducer = combineReducers({
    filteredCards,
    deckReducer
})


export default rootReducer