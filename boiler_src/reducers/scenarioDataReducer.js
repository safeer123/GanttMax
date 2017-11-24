import {actionTypes} from '../actions/constants';
var dummyScenarioData = require('./responseBackup/scenario2.json');

export default function scenarioDataReducer(state = null, action)
{
    let out = { status: "", scenarioData: null };

    switch(action.type)
    {
        case actionTypes.FETCH_SCENARIO_DATA + "_PENDING":
        {
            out.status = "pending";
            break;
        }
        case actionTypes.FETCH_SCENARIO_DATA + "_FULFILLED":
        {
            out.status = "fulfilled";
            out.data = action.payload.data;
            break;
        }
        case actionTypes.FETCH_SCENARIO_DATA + "_REJECTED":
        {
            out.status = "rejected";
            break;
        }
        case actionTypes.FETCH_SCENARIO_DATA:
        {
            out.status = "fulfilled";
            out.data = dummyScenarioData;
            break;
        }
    }
    return out;
}