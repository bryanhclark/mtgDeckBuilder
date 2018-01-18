import React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { removeCardFromDeck, updateCardInDeck } from '../reducers/Deck.js'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentClear from 'material-ui/svg-icons/content/clear';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { ProbCell } from './ProbabilityCell'
import Drawer from 'material-ui/Drawer';

  // blue #0D47A1
  // red #C62828
  // green #2E7D32
  // white #FFE57F
  // black #212121

class DeckList extends Component {
    constructor(props){
        super(props)
        this.state = {
            drawer: false,
            selectedCard:{}
        }
        this.convertToList = this.convertToList.bind(this)
    }

    convertToList(deck) {
        return deck.reduce((a, b) => {
            for (var i = 0; i < b.quantity; i++) {
                a.push(Object.assign({}, b))
            }
            return a
        }, [])
    }

    // now renders when it is first mounted, doesnt rerender when props are updated

    render(){
        if (this.props){
            return (
                <div className="DeckListContainer">
                    <Drawer
                        open={this.state.drawer}
                        openSecondary={true}
                        docked={true}
                        width={"72%"}
                    >
                        <div>
                        <div>
                            <img
                                style={{width:300,height:'auto'}}
                                src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.state.selectedCard.multiverseid}&type=card`}
                            />
                        </div>
                        <FloatingActionButton
                            style={{ transform: 'translate(130px, 10px)'}}
                            disabled={!this.state.drawer}
                            label={''}
                            backgroundColor={"#FFE57F"}
                            mini={true}
                            onClick={(e) => this.setState({ drawer: !this.state.drawer })}>
                            <RemoveRedEye />
                        </FloatingActionButton>
                        </div>
                    </Drawer>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={{ width: '25%' }}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>Quantity</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '9%' }}>Inc</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '9%' }}>Dec</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '9%' }}>Remove</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>1</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>2</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>3</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>4</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>5</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>6</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>7</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>8</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                this.props.deckList.map(card=>{
                                    return(
                                        <TableRow>
                                            <TableRowColumn
                                                style={{ width: '20%'}}
                                                >
                                                {card.name}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    disabled={this.state.drawer}
                                                    label={''}
                                                    backgroundColor={"#FFE57F"}
                                                    mini={true}
                                                    onClick={(e) => this.setState({ drawer: !this.state.drawer, selectedCard: card })}>
                                                    <RemoveRedEye />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>{card.quantity}</TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    disabled={card.quantity>3 && !card.type.includes('Basic Land')}
                                                    backgroundColor={"#2E7D32"}
                                                    mini={true}
                                                    onClick={() => this.props.updateCardQuant(card.uniqueName, card.quantity + 1)}>
                                                    <ContentAdd />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    disabled={card.quantity < 1}
                                                    backgroundColor={"#0D47A1"}
                                                    mini={true}
                                                    onClick={() => {
                                                        this.props.updateCardQuant(card.uniqueName, card.quantity - 1)
                                                        }
                                                    }>
                                                    <ContentRemove />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    backgroundColor={"#C62828"}
                                                    mini={true}
                                                    onClick={() => this.props.removeCard(card.uniqueName)}>
                                                    <ContentClear />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            {
                                                [0,1,2,3,4,5,6,7].map(v=>{
                                                    return (
                                                        <TableRowColumn style={{ width: '5%' }}>
                                                            <ProbCell
                                                                draws={7 + v}
                                                                card={card}
                                                                deck={this.convertToList(this.props.deckList)}
                                                            />
                                                        </TableRowColumn>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            )
        }
    }
}

function mapStateToProps(storeState) {
    return {
        deck: storeState.deckReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCardQuant: (uniqueName,value) => {
            dispatch(updateCardInDeck(uniqueName,{quantity: value}))
        },
        removeCard: (cardUniqName) => {
            dispatch(removeCardFromDeck(cardUniqName));
        }
    }
}

const DeckListView = connect(mapStateToProps, mapDispatchToProps)(DeckList)

export default DeckListView;

// // // IMAGE URLS ARE OF THE FOLLOWING FORM
// <img src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
