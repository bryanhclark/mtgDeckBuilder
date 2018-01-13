import axios from 'axios'
import { getSelectedCard, unselectCard } from './selectedCard'


//action typec
const GET_ALL_CARDS = 'GET_ALL_CARDS'
const GET_FILTERED_CARDS = 'GET_FILTERED_CARDS'



//action creator
// export const getAllCards = (cards) => {
//     return {
//         type: GET_ALL_CARDS,
//         cards
//     }
// }



export const getFilteredCards = (filteredCards) => {
    return {
        type: GET_FILTERED_CARDS,
        filteredCards
    }
}

// export const fetchCards = () => {
//     return function thunk(dispatch) {
//         axios.get('/api/cards/allcards')
//             .then(res => {
//                 console.log('in response')
//                 dispatch(getAllCards(res.data))
//             })
//             .catch(console.error)
//     }
// }

export const fetchFilteredCards = (value) => {
    return function thunk(dispatch) {
        axios.get('api/cards/filteredcards/' + value)
            .then(res => {
                let cards = res.data
                dispatch(getFilteredCards(cards))
                return cards
            })
            .then(cards => {
                console.log(value)
                return dispatch(getSelectedCard(value,cards))
            })
            .catch(console.error)
    }
}


//sub reducer

const cardReducer = (state = [], action) => {
    switch (action.type) {
        case GET_FILTERED_CARDS:
            return action.filteredCards
        default:
            return state
    }
}

export default cardReducer
