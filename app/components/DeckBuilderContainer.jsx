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
        this.state={
            searchBarId: ''
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUpdateInput = (value) => {
        this.setState({input:value})
        if (value.length) {
            this.props.loadFilteredCards(value)
        }
        setTimeout(()=>{
            document.getElementById(this.state.searchBarId).focus()
        },200)
    };

    handleSubmit = (event) => {
        event.preventDefault()
        if (Object.keys(this.props.selectedCard).length) this.props.addNewCard(this.props.selectedCard);
    }

    render() {
        return (
            <div>
                <h1>MTG DECKBUILDER, suk it </h1>
                <div>
                    <form method='POST' onSubmit={this.handleSubmit}>
                        <AutoComplete
                            hintText="Type anything, just don't expect much"
                            dataSource={this.props.filteredCards.map(v => v.uniqueName)}
                            onUpdateInput={this.handleUpdateInput}
                            onSelect={(e)=>{
                                    e.preventDefault()
                                    this.setState({searchBarId: document.activeElement.id}
                                )}}
                            style={{width: 500}}
                            fullWidth={true}
                            filter={AutoComplete.caseInsensitiveFilter}
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
        deckList: storeState.deckReducer,
        selectedCard: storeState.selectedCardReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
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
