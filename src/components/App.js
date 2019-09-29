import React from 'react';
import Game from './Game';


class App extends React.Component {
  state = {
    gameId: 1,
    score: 0,
  };
  resetGame = () => {
    this.setState((prevState) => {
      return { gameId: prevState.gameId + 1, score: 0 };
    });
  };
  nextGame = () => {
    this.setState((prevState) => {
      return { gameId: prevState.gameId + 1, score: prevState.score + 1 };
    });
  };

  render() {
    alert(this.state.gameId)
    return (
      <Game
        key={this.state.gameId}
        onPlayAgain={this.resetGame}
        onNextPlay={this.nextGame}
        randomNumberCount={6}
        initialSeconds={100}
        gameScore={this.state.score}
      />
    );
  }
}

export default App;