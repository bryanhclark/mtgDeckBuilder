import React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { removeCardFromDeck, updateCardInDeck } from '../reducers/Deck.js'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentClear from 'material-ui/svg-icons/content/clear';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import { probabilityOfPlayingCard } from '../../__alg/ArithmaticHelpers'


class DeckList extends Component {
    constructor(props){
        super(props)
        this.state = {
            calculating: false
        }
    }

    render(){

        const convertToList = (deck) => {
            return deck.reduce((a,b)=>{
                for(var i=0;i<b.quantity;i++){
                    a.push(Object.assign({},b))
                }
                return a
            },[])
        }

        if (this.props){
            return (
                <div className="DeckListContainer">
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
                                                style={{ width: '25%' }}
                                                onHover={()=>{
                                                    return(
                                                        <img src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
                                                    )
                                                }}
                                            >{card.name}</TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>{card.quantity}</TableRowColumn>
                                            <TableRowColumn style={{ width: '9%' }}>
                                                <FloatingActionButton
                                                    disabled={card.quantity>3 && !card.type.includes('Basic Land')}
                                                    backgroundColor={"green"}
                                                    mini={true}
                                                    onClick={() => this.props.updateCardQuant(card.uniqueName, card.quantity + 1)}>
                                                    <ContentAdd />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '9%' }}>
                                                <FloatingActionButton
                                                    disabled={card.quantity < 1}
                                                    backgroundColor={"blue"}
                                                    mini={true}
                                                    onClick={() => this.props.updateCardQuant(card.uniqueName, card.quantity - 1)}>
                                                    <ContentRemove />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '9%' }}>
                                                <FloatingActionButton
                                                    backgroundColor={"red"}
                                                    mini={true}
                                                    onClick={() => this.props.removeCard(card.uniqueName)}>
                                                    <ContentClear />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(7,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(8,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(9,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(10,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(11,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(12,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(13,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>
                                                {(typeof card.manaCost!=='string')?'':probabilityOfPlayingCard(14,card,convertToList(this.props.deck))}
                                            </TableRowColumn>
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


// const testCard = {
//     manaCost: "{3}{R}{R}",
//     multiverseid: 234702,
//     name:"Fire Servant",
//     set:"Premium Deck Series: Fire and Lightning",
//     text:"If a red instant or sorcery spell you control would deal damage, it deals double that damage instead.",
//     uniqueName:"Fire Servant (Premium Deck Series: Fire and Lightning) #234702"
//     }

//     < div id= 'deckList' >
//         {
//             props.deckList.map(card =>
//                 (
//                     <div key={card.multiverseid} className='cardView'>
//                         <img src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`} />
//                         <p >{card.name}</p>
//                     </div>
//                 ))
//         }
//         </div >
