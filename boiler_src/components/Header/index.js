import React from "react";
import { connect } from "react-redux";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  createScenarioDropDown() {
    return (
      <select>
        {this.props.scenarioList.map(scenario => {
          return (
            <option value={scenario.scenarioId} key={scenario.scenarioId}>
              {scenario.scenarioId}
            </option>
          );
        })}
      </select>
    );
  }

  render() {
    return <div className="main-header">Select Scenario: {this.createScenarioDropDown()}</div>;
  }
}

function mapStateToProps({ scenarioList }) {
  return {
    scenarioList: scenarioList
  };
}

export default connect(mapStateToProps)(Header);
