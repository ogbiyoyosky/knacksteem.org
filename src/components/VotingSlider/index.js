import React, { Component } from 'react';
import {connect} from 'react-redux';
import './index.css';
import store from '../../store';
import {votePowerChange} from '../../actions/votingSlider';
import { Slider, Icon, Button } from 'antd';
import {upvoteElement} from '../../actions/articles';
import getVoteWorth from './getVoteWorth';


const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
};
class VotingSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      votePower: store.getState().votingSlider.value,
      voteWorth: 0,
      maxVoteWorth: 0
    };
  }

  async componentDidMount() {
    await this.setState({
      maxVoteWorth: await getVoteWorth({
        isMaxVote: true
      }),
      voteWorth: await getVoteWorth({
        isMaxVote: false
      }),
    });
  }
  handleChange = async (e) => {
    const value = Number(e);
    store.dispatch(votePowerChange(value * 100));
    await this.setState({
      votePower: value * 100,
      voteWorth: await getVoteWorth({
        isMaxVote: false
      })
    });
  }
  handleTip = () => {
    return `${this.state.votePower / 100}% $${this.state.voteWorth}`;
  }

  //upvote article or comment
  onUpvoteClick = async () => {


    const {data, dispatch, onUpdate} = this.props;
    

    //if already voted, immediately return - maybe implement unvoting later, if needed
    if (data.isVoted) {
      
      return;
    }
    //upvote with 10000 - which equals 100%
    try {
      
      await dispatch(upvoteElement(data.author, data.permlink, this.state.votePower ));
      //on successful update, reload article or article list
      onUpdate();
      console.log(data)

      
    } catch (err) {
      //error handled in upvoteElement action
    }
  };

  render() {
    const {onCancelSlider} = this. props
    return (
      <div className="voting-container">
        <div className="voting-header-container">
          <span>
            <button onClick={e => this.onUpvoteClick()} className="voting-button-header"><Icon style={{color: '#22419c'}} type="check-circle" /> Confirm</button>
            <button onClick={(e)=> onCancelSlider()} className="voting-button-header"><Icon type="close-circle" /> Cancel</button>
          </span>
          <span>{this.state.voteWorth === 0 ? <div className="loader"/> : `$${this.state.maxVoteWorth}`}</span>
        </div>
        <Slider disabled={this.state.maxVoteWorth === 0 ? true : false} onChange={this.handleChange} max={100} min={0} marks={marks} defaultValue={100} value={this.state.votePower / 100} tipFormatter={this.handleTip}/>
        <div className="voting-buttons-container">
          {Object.keys(marks).map(key => {
            return <Button className="voting-button" disabled={this.state.maxVoteWorth === 0 ? true : false} key={key} onClick={() => this.handleChange(key)}>{key}%</Button>;
          })}
        </div>
        <div className="voting-worth-information">
          Your vote will be worth: ${this.state.voteWorth}.
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    metaBottom: state.metaBottom 
  }
}

export default connect(mapStateToProps)(VotingSlider);
