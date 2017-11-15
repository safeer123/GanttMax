import {actionTypes} from '../actions/constants';

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
    }
    return out;
}