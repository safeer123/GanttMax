import React from "react";
import AppController from '../../graphics/AppController';
import CustomPopover from '../Overlay/CustomPopover';
import { connect } from "react-redux";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.tooltipHandler = this.tooltipHandler.bind(this);

    this.state = {
      tooltipVisible: false,
      tooltipAssignment: null,
      tooltipPosition: null,
    }

    this.resizeHandler = this.resizeHandler.bind(this);
  }

  resizeHandler() {
    // console.log(this.canvasWrapper.clientWidth, this.canvasWrapper.clientHeight);
    if (this.appController) {
      this.appController.onResize();

      if (this.props.scenarioData) {
        const data = {
          plan: this.props.scenarioData.data,
          scenario: this.props.activeScenario
        };

        // init with data and integrate
        this.appController.init(data);
      }
    }
  }

  displayLoaderOnNeed() {
    return (this.props.scenarioData && this.props.scenarioData.status === 'pending') ?
      (<div className="loader"> <span>Fetching data. Please wait..</span> </div>) :
      null;
  }

  // Tooltip handler
  tooltipHandler(visibility, assignment, position) {
    this.setState({
      tooltipVisible: visibility,
      tooltipAssignment: assignment,
      tooltipPosition: position,
    });
  }

  componentDidMount() {
    console.log("Initialize graphics controller..");
    let rootDiv = document.getElementById("root");
    this.appController = new AppController(rootDiv, this.canvasWrapper, this.timelineWrapper);
    this.appController.setTooltipHandler(this.tooltipHandler);

    window.addEventListener('resize', this.resizeHandler);
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  render() {
    return (
      <div className="main-content">
        <div className="canvas-wrapper" ref={elm => (this.canvasWrapper = elm)}></div>
        <div className="timeline-wrapper" ref={elm => (this.timelineWrapper = elm)}></div>
        {this.displayLoaderOnNeed()}
        <CustomPopover
          visible={this.state.tooltipVisible}
          assignment={this.state.tooltipAssignment}
          position={this.state.tooltipPosition}
        />
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
