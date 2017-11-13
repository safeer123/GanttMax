import {combineReducers} from 'redux';
import scenariosReducer from './scenariosReducer';

let allReducers = combineReducers(
    {
        scenarioList: scenariosReducer,
    }
);

export default allReducers;