export let Scenario1 = {
    "ScenarioId": "23801",
    "StartTime": "2017-11-10T12:00:19.9139893Z",
	"EndTime": "2017-11-17T12:00:19.9139893Z",
    "Buses": [
        {
            "Name": "driver1",
            "BudId": "12-234",
        },
        {
            "Name": "driver2",
            "BudId": "12-456",
        },
        {
            "Name": "driver3",
            "BudId": "12-156",
        },
    ],
    "AssignmentPlan": [
        {
            "BusId": "12-234",
            "Assignments": [
                {
                    "ScheduleStartTime": "2017-11-10T12:00:19.9193Z",
                    "ScheduleEndTime": "2017-11-11T00:20:19.893Z",
                },
                {
                    "ScheduleStartTime": "2017-11-11T01:50:19.9139Z",
                    "ScheduleEndTime": "2017-11-11T11:50:19.9139Z",
                },
                {
                    "ScheduleStartTime": "2017-11-11T12:50:19.9139Z",
                    "ScheduleEndTime": "2017-11-10T20:10:19.91Z",
                },
                {
                    "ScheduleStartTime": "2016-09-14T19:10:19.9139893Z",
                    "ScheduleEndTime": "2016-09-21T21:44:59Z",
                }
            ],
        },
        {
            "BusId": "12-456",
            "Assignments": [
                {
                    "ScheduleStartTime": "2017-11-11T12:00:19.9193Z",
                    "ScheduleEndTime": "2017-11-11T14:20:19.893Z",
                },
                {
                    "ScheduleStartTime": "2017-11-11T14:50:19.9139Z",
                    "ScheduleEndTime": "2017-11-11T18:00:19.9139893Z",
                },
                {
                    "ScheduleStartTime": "2017-11-11T18:00:19.913Z",
                    "ScheduleEndTime": "2017-11-11T19:10:19.91Z",
                },
                {
                    "ScheduleStartTime": "2017-11-11T21:00:19.913Z",
                    "ScheduleEndTime": "2017-11-11T23:10:19.91Z",
                }
            ]
        }
    ]
}