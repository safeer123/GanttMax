import React from "react";
import AppController from '../../graphics/AppController';
import { connect } from "react-redux";

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  displayLoaderOnNeed() {
    return (this.props.scenarioData && this.props.scenarioData.status === 'pending') ?
      (<div className="loader"> <span>Fetching data. Please wait..</span> </div>) :
      null;
  }

  componentDidMount() {
    console.log("Main content loading starts..");
    let rootDiv = document.getElementById("root");
    this.appController = new AppController(rootDiv, this.canvasWrapper, this.timelineWrapper);
  }

  componentWillReceiveProps(nextProps) {
    console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
    if (nextProps.scenarioData.status === 'pending') {
      this.appController.clearAll();
    }
    else if (nextProps.scenarioData.status === 'fulfilled') {
      // Update buffer and rerender
      // Gather required data for rendering
      const data = {
        plan: nextProps.scenarioData.data,
        scenario: nextProps.activeScenario
      };

      // init with data and integrate
      this.appController.init(data);

    }
  }

  render() {
    return (
      <div className="main-content">
        <div className="canvas-wrapper" ref={elm => (this.canvasWrapper = elm)}></div>
        <div className="timeline-wrapper" ref={elm => (this.timelineWrapper = elm)}></div>
        {this.displayLoaderOnNeed()}
      </div>
    );
  }
}

function mapStateToProps({ activeScenario, scenarioData }) {
  return {
    activeScenario,
    scenarioData,
  };
}

export default connect(mapStateToProps)(Content);
