import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { fetchCards, fetchFilteredCards } from '../reducers/cards'
import AutoComplete from 'material-ui/AutoComplete';

class DeckBuilderContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [],
            names: []
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.getCardNames = this.getCardNames.bind(this);
    }

    componentWillReceiveProps() {
        // this.setState({ cards: this.props.cards })
        this.getCardNames(this.props.cards)
    }
    handleUpdateInput = (value) => {
        if (value) {
            this.props.loadFilteredCards(value);
        }
    };

    getCardNames = (cards) => {
        let names = cards.map(card => {
            return card.name
        })
        this.setState({ names: names })
    }


    render() {
        console.log(this.state.cards);
        return (
            <div>
                <h1>MTG DECKBUILDER, suk it </h1>
                <div>

                    <AutoComplete
                        hintText="Type anything"
                        dataSource={this.state.names}
                        onUpdateInput={this.handleUpdateInput}
                    />

                </div>
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        cards: storeState.cards,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadCards: () => {
            dispatch(fetchCards())
        },
        loadFilteredCards: (value) => {
            dispatch(fetchFilteredCards(value))
        }
    }
}

const DeckBuilderContainerContainer = connect(mapStateToProps, mapDispatchToProps)(DeckBuilderContainer)


export default DeckBuilderContainerContainer
