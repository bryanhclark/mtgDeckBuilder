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
            searchBarId: '',
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleReq = this.handleReq.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUpdateInput = (value) => {
        console.log('update!')
        if (value.length){
            this.props.loadFilteredCards(value)
        }
        if (this.state.searchBarId !== '' && document.activeElement.id !== this.state.searchBarId){
            document.getElementById(this.state.searchBarId).focus()
        }
    };

    handleReq = (value) => {
        console.log('request!',value)
        if (Object.keys(this.props.selectedCard).length) {

            // set timeout is hacky. purpose is to make sure when you hit enter while selecting an element in the drop down that you actually add that card, rather than set that card to the selected card, THEN add the card to the deck, as opposed to trying to add the selected card and update the selected card simaltaneously -> causing race contition -> adding wrong card

            setTimeout(() => {
                this.props.addNewCard(this.props.selectedCard);
                document.getElementById(this.state.searchBarId).value = ''
            }, 100);
        }
    }

    // // handle submit is redundant because handle new request is bound to onclick and enter key

    // handleSubmit = (event) => {
    //     console.log('submit!')
    //     event.preventDefault()
    //     if (Object.keys(this.props.selectedCard).length){
    //         setTimeout(()=>{
    //             this.props.addNewCard(this.props.selectedCard);
    //             document.getElementById(this.state.searchBarId).value = ''
    //         }, 100);
    //     }
    // }

    render() {
        return (
            <div>
                <h1>MTG DECKBUILDER, suk it </h1>
                <div>
                    <form method='POST' onSubmit={(e)=>{
                        e.preventDefault()
                        this.handleReq()
                        }} >
                        <AutoComplete
                            hintText="Type anything, just don't expect much"
                            dataSource={this.props.filteredCards.map(v => v.uniqueName)}
                            onUpdateInput={this.handleUpdateInput}
                            onSelect={()=>{
                                if(!this.state.searchBarId) this.setState({searchBarId: document.activeElement.id})
                            }}
                            onNewRequest={(v)=>{
                                this.handleReq(v)
                            }}
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
