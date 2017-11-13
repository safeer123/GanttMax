import React from "react";
import AppController from '../../graphics/AppController';

export default class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("Main content loading starts..");
    let rootDiv = document.getElementById("root");
    this.appController = new AppController(rootDiv, this.canvasWrapper, this.timelineWrapper);
    this.appController.init();
  }

  render() {
    return (
      <div className="main-content" ref={elm => (this.canvasWrapper = elm)}>
        <div className="timelineWrapper" ref={elm => (this.timelineWrapper = elm)}></div>
      </div>
    );
  }
}
