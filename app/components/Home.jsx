import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import VirtualizedSelect from 'react-virtualized-select'
import '!style-loader!css-loader!react-select/dist/react-select.css'
// both js and css
import Select, { styles } from 'react-select';

///home rules
//home rules part 2

// import Data from '../data/cardList'

const ourOptions = [
    { Name: "Adorable Kitten", Value: 439390 },
    { "Name": "Aerial Toastmaster", "Value": 439391 },
    { "Name": "Amateur Auteur", "Value": 439392 },
    { "Name": "By Gnome Means", "Value": 439393 },
    { "Name": "Chivalrous Chevalier", "Value": 439394 },
    { "Name": "Do-It-Yourself Seraph", "Value": 439395 },
    { "Name": "Gimme Five", "Value": 439396 },
    { "Name": "GO TO JAIL", "Value": 439397 },
    { "Name": "Half-Kitten, Half-", "Value": 439398 },
    { "Name": "Humming-", "Value": 439399 },
    { "Name": "Jackknight", "Value": 439400 },
    { "Name": "Knight of the Kitchen Sink", "Value": 439401 },
    { "Name": "Knight of the Widget", "Value": 439402 }, { "Name": "Midlife Upgrade", "Value": 439403 }, { "Name": "Oddly Uneven", "Value": 439404 }, { "Name": "Old Guard", "Value": 439405 }, { "Name": "Ordinary Pony", "Value": 439406 }, { "Name": "Rhino-", "Value": 439407 }, { "Name": "Riveting Rigger", "Value": 439408 }, { "Name": "Rules Lawyer", "Value": 439409 }, { "Name": "Sacrifice Play", "Value": 439410 }, { "Name": "Shaggy Camel", "Value": 439411 },
    { "Name": "Side Quest", "Value": 439412 },
    { "Name": "Success!", "Value": 439413 },
    { "Name": "Teacher's Pet", "Value": 439414 },
    { "Name": "Animate Library", "Value": 439415 },
    { "Name": "Blurry Beeble", "Value": 439416 }, { "Name": "Chipper Chopper", "Value": 439417 }, { "Name": "Clocknapper", "Value": 439418 }, { "Name": "Crafty Octopus", "Value": 439419 }, { "Name": "Crow Storm", "Value": 439420 }, { "Name": "Defective Detective", "Value": 439421 }, { "Name": "Five-Finger Discount", "Value": 439422 }, { "Name": "Graveyard Busybody", "Value": 439423 },
    { "Name": "Half-Shark, Half-", "Value": 439424 }]
export default class Home extends Component {
    state = {
        selectedOption: '',
    }
    handleChange = (selectedOption) => {
        if (!selectedOption) {
            selectedOption = ''
        }
        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.Name}`);
    }
    render() {
        return (
            <div id='mainSelect'>
                <VirtualizedSelect
                    labelKey='Name'
                    valueKey='Value'
                    value={this.state.selectedOption.Value}
                    onChange={this.handleChange}
                    options={ourOptions}>
                </VirtualizedSelect>
            </div>
        )
    }
}