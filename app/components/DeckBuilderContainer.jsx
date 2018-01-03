import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { fetchCards, fetchFilteredCards } from '../reducers/cards'
import { addCardToDeck } from '../reducers/Deck'
import AutoComplete from 'material-ui/AutoComplete';
import DeckList from './DeckList';

class DeckBuilderContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCard: ''
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this)
    }

    handleUpdateInput = (value) => {
        if (value.length && value.indexOf('#') === -1) {
            console.log(value)
            this.props.loadFilteredCards(value)
        }
        // console.log('stop shitting yourself')
        // console.log(this.props.filteredCards[0])
        // console.log('here here' + (this.props.filteredCards.length) ? this.props.filteredCards[0].uniqueName() : 'empty')
    };

    handleSubmit = (event) => {
        event.preventDefault()
        console.log('this.props.filteredCards', this.props.filteredCards)
        this.props.addNewCard(this.props.filteredCards.filter(v => v.multiverseid === this.state.selectedCard)[0]);

    }
    handleSelect = (event) => {
        event.preventDefault()
        console.log(event.target.value.slice(event.target.value.indexOf('#') + 1))
        this.setState({ selectedCard: event.target.value.slice(event.target.value.indexOf('#') + 1) })
        // console.log(this.setState.cards[0].UniqueName)
    }



    render() {
        return (
            <div>
                <h1>MTG DECKBUILDER, suk it </h1>
                <div>
                    <form method='POST' onSubmit={this.handleSubmit}>
                        <AutoComplete
                            hintText="Type anything"
                            dataSource={this.props.filteredCards.map(v => v.name + ' (' + v.set + ') #' + v.multiverseid)}
                            onUpdateInput={this.handleUpdateInput}
                            onSelect={this.handleSelect}
                        />
                        <FlatButton label="Submit" primary={true} type='submit' />
                    </form>
                </div>
                <div id='cardViewContainer'>
                    <DeckList deckList={this.props.deckList} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        filteredCards: storeState.filteredCards,
        deckList: storeState.deckReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadCards: () => {
            dispatch(fetchCards())
        },
        loadFilteredCards: (value) => {
            dispatch(fetchFilteredCards(value))
        },
        addNewCard: (card) => {
            dispatch(addCardToDeck(card));
        }
    }
}

const DeckBuilderContainerContainer = connect(mapStateToProps, mapDispatchToProps)(DeckBuilderContainer)


export default DeckBuilderContainerContainer
