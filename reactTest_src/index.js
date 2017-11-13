import React from "react";
import ReactDOM from "react-dom";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class MyComponent extends React.Component {
  render() {
    console.log(this.props);
    return <h2> {this.props.text}</h2>;
  }
}

class MyClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: new Date() };
  }

  componentDidMount()
  {
    this.timerId = setInterval(()=>this.setState({time: new Date()}), 1000);
  }

  componentWillUnmount()
  {
      clearInterval(this.timerId);
  }

  render() {
    return <h3>{this.state.time.toLocaleTimeString()}</h3>;
  }
}

const App = ({ name }) => (
  <div style={styles}>
    <MyComponent text="Some text here :) " />
    <MyClock time={new Date()} />
  </div>
);

ReactDOM.render(<App name="safeer" />, document.getElementById("app"));
