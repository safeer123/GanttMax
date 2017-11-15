import {combineReducers} from 'redux';
import scenariosReducer from './scenariosReducer';
import selectScenarioReducer from './selectScenarioReducer';
import scenarioDataReducer from './scenarioDataReducer';

let allReducers = combineReducers(
    {
        scenarioList: scenariosReducer,
        activeScenario: selectScenarioReducer,
        scenarioData: scenarioDataReducer,
    }
);

export default allReducers;