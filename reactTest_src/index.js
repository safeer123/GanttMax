import React from "react";
import ReactDOM from "react-dom";

import {Button, Overlay} from 'react-bootstrap';

class CustomPopover extends React.Component{
  render() {
    return (
      <div
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: '#EEE',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          marginLeft: -5,
          marginTop: 5,
          padding: 10,
          left: 50,
          top: 100,
        }}
      >
        <strong>Holy guacamole!</strong> 
        <br/>Check this info.
        <br/>Info 2.
      </div>
    );
  },
}

const Example = React.createClass({
  getInitialState() {
    return { show: true };
  },

  toggle() {
    this.setState({ show: !this.state.show });
  },

  render() {
    return (
      <div style={{ height: 100, position: 'relative' }}>
          <CustomPopover />
      </div>
    );
  },
});

const mountNode = document.getElementById("root");

ReactDOM.render(<Example />, mountNode);