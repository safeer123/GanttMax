import { actionTypes } from '../actions/constants';

export default function selectScenarioReducer(state=null, action)
{
    switch(action.type)
    {
        case actionTypes.SELECT_SCENARIO:
        {
            return action.payload;
            break;
        }
    }

    return state;
}