import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, Button, StyleSheet} from 'react-native';

import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    gameScore: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
    onNextPlay: PropTypes.func.isRequired,
  };
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
    score: this.props.gameScore,
  };
  gameStatus = 'PLAYING';
  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(
    () => 1 + Math.floor(10 * Math.random())
  );
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.inervalId = setInterval(() => {
      this.setState(
        (prevState) => {
          return { remainingSeconds: prevState.remainingSeconds - 1 };
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.inervalId);
          }
        }
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.inervalId);
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };
  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };
  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.inervalId);
      }
    }
  }
  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };
  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={styles.remainSec}>
          Remaining Time: {this.state.remainingSeconds}
        </Text>
        <Text style={styles.target}>
          Score: {this.state.score}
        </Text>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameStatus == 'LOST' && (
          <Button title="Play Again" onPress={this.props.onPlayAgain} />
        )}
        {this.gameStatus == 'WON' && (
          <Button title="Next" onPress={this.props.onNextPlay} />
        )}
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },

  remainSec: {
    color: 'green',
    fontSize: 20,
    textAlign:'right',
    marginTop: '15%',
    marginRight: '5%',
  },

  target: {
    fontSize: 50,
    margin: 50,
    textAlign: 'center',
  },

  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
