import React from "react";
import { connect } from "react-redux";
import { SplitButton, MenuItem } from 'react-bootstrap';
//import axios from 'axios';
import { getScenarios, selectScenario, getScenarioData } from '../../actions'
import { bindActionCreators } from 'redux';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.scenarioSelectionHandler = this.scenarioSelectionHandler.bind(this);
  }

  scenarioSelectionHandler(id) {
    //console.log("selected:" + id);
    const scenarios = this.props.scenarioList;
    if (scenarios) {
      let selectedScenario = scenarios.filter(s => s.ScenarioID === id)[0];
      this.props.selectScenario(selectedScenario);
      this.props.getScenarioData(id);
    }
  }

  createScenarioDropDown() {
    return (
      <SplitButton bsSize="small" bsStyle="primary" title="scenario #" id="scenarioDropdown" onSelect={this.scenarioSelectionHandler}>
        {this.props.scenarioList.map(scenario => {
          return (
            <MenuItem eventKey={scenario.ScenarioID} key={scenario.ScenarioID}>
              {scenario.ScenarioID}
            </MenuItem>
          );
        })}
      </SplitButton>
    );
  }

  // Create Scenario details to display
  createScenarioDetails() {
    return this.props.activeScenario ?
      (<b> SID: {this.props.activeScenario.ScenarioID}, NAME: {this.props.activeScenario.Name} </b>) :
      null;
  }

  componentWillMount() {
    this.props.getScenarios();
  }

  render() {
    let headerItems = null;

    const scenarios = this.props.scenarioList;
    if (!scenarios || scenarios === "pending" || scenarios === "error") {
      headerItems = null;
    }
    else {
      headerItems = <div className="header-items">
        Select: {this.createScenarioDropDown()}
        {this.createScenarioDetails()}
      </div>
    }

    return <div className="main-header">
      {headerItems}
    </div>;
  }

}

function mapStateToProps({ scenarioList, activeScenario }) {
  return {
    scenarioList,
    activeScenario,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getScenarios,
    selectScenario,
    getScenarioData,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);
