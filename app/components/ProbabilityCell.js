import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';

export class ProbCell extends Component {
  constructor(props) {
    super(props)
    this.state={
      P: '',
      cardColor:''
    }
  }

  // blue #0D47A1
  // red #C62828
  // green #2E7D32
  // white #FFE57F
  // black #212121

  componentWillReceiveProps(nextProps){
    let color
    if (nextProps.card.manaCost){
      if (nextProps.card.manaCost.includes('W')) color = '#FFE57F'
      if (nextProps.card.manaCost.includes('B')) color = '#212121'
      if (nextProps.card.manaCost.includes('G')) color = '#2E7D32'
      if (nextProps.card.manaCost.includes('U')) color = '#0D47A1'
      if (nextProps.card.manaCost.includes('R')) color = '#C62828'
    }
    else{
      if (nextProps.card.ProducibleManaColors.includes('W')) color = '#FFE57F'
      if (nextProps.card.ProducibleManaColors.includes('B')) color = '#212121'
      if (nextProps.card.ProducibleManaColors.includes('G')) color = '#2E7D32'
      if (nextProps.card.ProducibleManaColors.includes('U')) color = '#0D47A1'
      if (nextProps.card.ProducibleManaColors.includes('R')) color = '#C62828'
    }

    this.setState({cardColor:color})
    if(nextProps.card.manaCost && nextProps.calculating){
      this.setState({ P: 'loading' })
      axios.post('api/alg', ({ draws: nextProps.draws, card: nextProps.card, deck: nextProps.deck }))
      .then(res => {
        this.setState({ P: res.data })
      });
    }
  }

  render() {
    if (this.state.P !== 'loading') return (
      <div>
        {`${(this.state.P *100).toFixed(1)}%`}
      </div>
    )
    else return (
      <div>
        <CircularProgress size={20} color={this.state.cardColor}/>
      </div>
    )
  }
}
