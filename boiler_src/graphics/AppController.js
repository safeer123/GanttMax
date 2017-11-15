
import {Utils} from './AppUtils'

import {GanttChartLayer} from './GanttChartLayer'
import {TimelineLayer} from './TimelineLayer'

import {Canvas} from './ShaderFactory';

import {Tooltip} from './Tooltip'
import {TimeTransform} from './TimeTransform'

// Sample input Data that we use
import {Scenario1} from './data/inputData1'

export default class AppController
{
    constructor(baseDiv, ganttChartDiv, timelineDiv)
    {
        this.canvasObj2 = new Canvas(ganttChartDiv);
        this.canvasObj4 = new Canvas(timelineDiv);

        this.layers = [];

        this.layers[1] = new GanttChartLayer(ganttChartDiv, this.canvasObj2);
        this.layers[3] = new TimelineLayer(timelineDiv, this.canvasObj4);

        this.layers[1].addCanvas2D();
        this.layers[3].addCanvas2D();

        var newTooltip = new Tooltip(baseDiv);
        newTooltip.hide();

        this.layers[1].tooltip = newTooltip;

        this.loadInputScenarios();
    }

    init(dataObj)
    {
        if(!dataObj) return;

        window.onwheel = function(){ return false; }

        this.dataObject = dataObj;

        var startDate = new Date( Utils.strToDate(this.dataObject.scenario.ScenarioStartTime) );
        var endDate = new Date( Utils.strToDate(this.dataObject.scenario.ScenarioEndTime) );
        var timeWindow = new Utils.TimeWindow( startDate, endDate );
        timeWindow.setOffset(0.03);

        this.appTimeTransform = new TimeTransform(startDate, endDate, this.canvasObj2.canvas.width);
        
        this.layers[1].setTimeLabels(this.layers[3].timeLabels );

        for(let i in this.layers)
        {
            // set params
            this.layers[i].timeWindow = timeWindow;
            this.layers[i].appTimeTransform = this.appTimeTransform;
            this.layers[i].dataObject = this.dataObject;

            this.layers[i].renderAll = this.renderAll.bind(this);
            this.layers[i].updateBuffers();
        }

        this.renderAll();
    }

    renderAll()
    {
        this.layers[3].updateTimeLabels();

        for(let i in this.layers)
        {
            this.layers[i].render();
        }
    }

    clearAll()
    {
        this.layers.forEach(layer => {
            layer.clear();
        });
    }

    loadInputScenarios()
    {
        this.scenarioList = {
            "scenario1" : { input: Scenario1}
        };
        
        return;
        this.selectScenarioInput = document.getElementById("select-scenario");
        
        for(let scenario in this.scenarioList)
        {
            var option = document.createElement('option');
            option.text = option.value = scenario;
            this.selectScenarioInput.add(option, 0);
        }

        this.selectScenarioInput.onchange = function()
        {
            var value = this.selectScenarioInput.value;
            console.log(value);

            this.init( this.scenarioList[value] );

        }.bind(this);
    }


    // TODO: 
    // Input Output methods to be implemented
}
