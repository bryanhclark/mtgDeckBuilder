import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import VirtualizedSelect from 'react-virtualized-select'
import '!style-loader!css-loader!react-select/dist/react-select.css'
import Select, { styles } from 'react-select';

// import Data from '../data/cardList'

export default class DeckBuilderContainer extends Component {
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