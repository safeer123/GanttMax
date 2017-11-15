import { actionTypes, apiUrls } from './constants';
import axios from 'axios';

export const getScenarios = () => {
    //console.log("getScenarios");
    return dispatch => {
        dispatch({
            type: actionTypes.GET_SCENARIOS,
            payload: {
                promise: axios.get(apiUrls.GET_SCENARIOS)
            },
        });
    }
}

export const getScenarioData = (id) => {
    //console.log("getScenarioData");
    return dispatch => {
        dispatch({
            type: actionTypes.FETCH_SCENARIO_DATA,
            payload: {
                promise: axios.get(apiUrls.FETCH_SCENARIO_DATA + id)
            },
        });
    }
}

export const selectScenario = (id) => {
    console.log("selectedScenario");
    return {
        type: actionTypes.SELECT_SCENARIO,
        payload: id,
    }
}