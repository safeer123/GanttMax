const actionTypes = {
    GET_SCENARIOS: 'GET_SCENARIOS',
    SELECT_SCENARIO: 'SELECT_SCENARIO',
    FETCH_SCENARIO_DATA: 'FETCH_SCENARIO_DATA',
}

const apiUrls = {
    FETCH_SCENARIO_DATA: 'http://localhost:8090/api/schedules?scenarioId=',
    GET_SCENARIOS: 'http://localhost:8090/api/scenarios',
}


const otherConst = {
    dummyAPIresponseEnabled: true,
}

export { actionTypes, apiUrls, otherConst }