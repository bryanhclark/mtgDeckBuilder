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
            cards: [],
            names: [],
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.getCardNames = this.getCardNames.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps() {
        this.getCardNames(this.props.filteredCards)
    }
    handleUpdateInput = (value) => {
        console.log(value);
        if (value) {
            this.props.loadFilteredCards(value);
            this.setState({ cards: this.props.filteredCards });
        }
    };

    getCardNames = (cards) => {
        let names = cards.map(card => {
            return card.name
        })
        this.setState({ names: names, cards: cards })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.addNewCard(this.props.filteredCards[0]);

    }



    render() {
        return (
            <div>
                <h1>MTG DECKBUILDER, suk it </h1>
                <div>
                    <form method='POST' onSubmit={this.handleSubmit}>
                        <AutoComplete
                            hintText="Type anything"
                            dataSource={this.state.names}
                            onUpdateInput={this.handleUpdateInput}
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
            console.log(card);
            dispatch(addCardToDeck(card));
        }
    }
}

const DeckBuilderContainerContainer = connect(mapStateToProps, mapDispatchToProps)(DeckBuilderContainer)


export default DeckBuilderContainerContainer
