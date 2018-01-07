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
        // this.state = {
        //     selectedCard: '',
        //     input:''
        // }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this)
    }

    handleUpdateInput = (value) => {

        this.setState({input:value})
        if (value.length) {
            this.props.loadFilteredCards(value)
        }

        // if (this.props.filteredCards.map(v=>v.uniqueName).includes(value)){
        //     this.setState({selectedCard: value})
        // }
        // else if (this.props.filteredCards.length && this.props.filteredCards[0].uniqueName.indexOf(this.state.input) > -1){
        //     this.setState({selectedCard: this.props.filteredCards[0].uniqueName})
        // }
    };

    handleSubmit = (event) => {
        event.preventDefault()
        // console.log('this.props.filteredCards', this.props.filteredCards)
        // let selected = this.props.filteredCards.filter(v => v.uniqueName === this.state.selectedCard)[0] || false
        // let defaulted = this.props.filteredCards.filter(v => v.uniqueName === this.state.input)[0] || false

        // let cardToSubmit = (selected)?selected:(defaulted)?defaulted:false
        console.log(this.props.selectedCard)

        if (this.props.selectedCard) this.props.addNewCard(this.props.selectedCard);
    }

    handleSelect = (event) => {
        event.preventDefault()
        console.log(this.state)
        // console.log('handle select: ', event.target.value)
        // this.setState({ selectedCard: event.target.value })
        // console.log('handled select',this.state)
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
                            /* onSelect={this.handleSelect} */
                            style={{width: 400}}
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
        // loadCards: () => {
        //     dispatch(fetchCards())
        // },
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
