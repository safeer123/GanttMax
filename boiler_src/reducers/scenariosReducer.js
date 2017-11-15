import {actionTypes} from '../actions/constants';

export default function scenariosReducer(state = null, action)
{
    // console.log(action.type);

    switch(action.type)
    {
        case actionTypes.GET_SCENARIOS + "_PENDING":
        {
            return "pending";
            break;
        }
        case actionTypes.GET_SCENARIOS + "_FULFILLED":
        {
            return action.payload.data;
            break;
        }
        case actionTypes.GET_SCENARIOS + "_REJECTED":
        {
            return "error";
            break;
        }
    }
    return state;
}