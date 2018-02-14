import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';

export class ProbCell extends Component {
  constructor(props) {
    super(props)
    this.state={
      P: '',
      cardColor:'',
      manapic: ''
    }
    this.blue = '#2693C7'
    this.red = '#FC6621'
    this.green = '#2BC749'
    this.white = '#FDEA6D'
    this.black = '#A8A39A'
  }

  componentWillMount(){
    let color
    if (this.props.card.manaCost) {
      color = ''
      if (this.props.card.manaCost.includes('W')) color += 'W'
      if (this.props.card.manaCost.includes('B')) color += 'B'
      if (this.props.card.manaCost.includes('G')) color += 'G'
      if (this.props.card.manaCost.includes('U')) color += 'U'
      if (this.props.card.manaCost.includes('R')) color += 'R'
      color = color[Math.floor(Math.random() * color.length)]
      if (color === 'W') color = this.white
      else if (color === 'B') color = this.black
      else if (color === 'G') color = this.green
      else if (color === 'U') color = this.blue
      else if (color === 'R') color = this.red
      this.setState({ cardColor: color })
    }

    if (this.props.card.type.includes('Land')) {
      let manapic = (this.props.card.ProducibleManaColors.includes('C') || this.props.card.ProducibleManaColors.includes('F')) ? 'Cmana.png' : (this.props.card.ProducibleManaColors.split(',').join('').slice(0, Math.min(this.props.card.ProducibleManaColors.length, 2)) + 'mana.png')
      if (this.props.card.ProducibleManaColors.split(',').join('') === 'BGRUW') manapic = 'BGRUWmana.png'
      this.setState({ manapic })
    }

    if (!this.props.card.type.includes('Land') && this.props.card.manaCost && this.props.calculating) {
      this.setState({ P: 'loading' })
      axios.post('api/alg', ({ draws: this.props.draws, card: this.props.card, deck: this.props.deck }))
        .then(res => {
          this.setState({ P: res.data })
        });
    }
  }

  componentWillReceiveProps(nextProps){
    let color
    if (this.props.card.manaCost) {
      color = ''
      if (nextProps.card.manaCost.includes('W')) color += 'W'
      if (nextProps.card.manaCost.includes('B')) color += 'B'
      if (nextProps.card.manaCost.includes('G')) color += 'G'
      if (nextProps.card.manaCost.includes('U')) color += 'U'
      if (nextProps.card.manaCost.includes('R')) color += 'R'
      color = color[Math.floor(Math.random() * color.length)]
      if (color === 'W') color = this.white
      else if (color === 'B') color = this.black
      else if (color === 'G') color = this.green
      else if (color === 'U') color = this.blue
      else if (color === 'R') color = this.red
      this.setState({ cardColor: color })
    }

    if (nextProps.card.type.includes('Land')) {
      let manapic = (nextProps.card.ProducibleManaColors.includes('C') || nextProps.card.ProducibleManaColors.includes('F')) ? 'Cmana.png' : (nextProps.card.ProducibleManaColors.split(',').join('').slice(0, Math.min(nextProps.card.ProducibleManaColors.length, 2)) + 'mana.png')
      if (nextProps.card.ProducibleManaColors.split(',').join('') === 'BGRUW') manapic = 'BGRUWmana.png'
      this.setState({ manapic })
    }

    if (!nextProps.card.type.includes('Land') && nextProps.card.manaCost && nextProps.calculating){
      this.setState({ P: 'loading' })
      axios.post('api/alg', ({ draws: nextProps.draws, card: nextProps.card, deck: nextProps.deck }))
      .then(res => {
        this.setState({ P: res.data })
      });
    }
  }

  render() {
    if (this.state.P !== 'loading' && !this.props.card.type.includes('Land')) return (
      <div>
        {`${(this.state.P *100).toFixed(1)}%`}
      </div>
    )
    else if (this.props.card.type.includes('Land')) return (
      <div>
        <img src={`./Manapix/${this.state.manapic}`} style={{width: '25px', height:'25px'}}/>
      </div>
    )
    else return (
      <div>
        <CircularProgress size={25} color={this.state.cardColor}/>
      </div>
    )
  }
}
