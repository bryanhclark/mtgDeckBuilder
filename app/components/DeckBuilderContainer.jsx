import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { fetchCards } from '../reducers/cards'
import AutoComplete from 'material-ui/AutoComplete';

class DeckBuilderContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [],
            filteredCards: []
        }
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
    }

    componentDidMount() {
        this.props.loadCards();
    }
    componentWillReceiveProps() {
        this.setState({ cards: this.props.cards })
    }
    handleUpdateInput = (value) => {
        // const filteredCardNames = []
        // this.state.cards.forEach(card => {
        //     if (card.name.slice(0, value.length) === value) {
        //         filteredCardNames.push(card.name)
        //     }
        // })
        // this.setState({ filteredCards: filteredCardNames })
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={false}
                key='1' />,
            <FlatButton
                label="Submit"
                primary={false}
                keyboardFocused={false}
                type='submit'
                key='2' />,
        ];

        return (
            <div>
                <h1>MTG DECKBUILDER, suk it </h1>
                <div>
                    <form method='GET'  >
                        <AutoComplete
                            hintText="Type anything"
                            dataSource={this.state.filteredCards}
                            maxSearchResults={5}
                            onUpdateInput={this.handleUpdateInput}
                        />
                        <div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
                            {actions}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        cards: storeState.cards
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadCards: () => {
            dispatch(fetchCards())
        },
        loadFilteredCards: (value) => {

        }
    }
}

const DeckBuilderContainerContainer = connect(mapStateToProps, mapDispatchToProps)(DeckBuilderContainer)


export default DeckBuilderContainerContainer
