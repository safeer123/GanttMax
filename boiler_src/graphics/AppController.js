
import {Utils} from './AppUtils'

import {MainSceneLayer} from './MainSceneLayer'

import {Canvas} from './ShaderFactory/Canvas';

export default class AppController
{
    constructor(baseDiv, wrapperDiv, timelineDiv)
    {
        this.canvasObj2 = new Canvas(wrapperDiv);

        this.layers = [];

        this.layers[1] = new MainSceneLayer(wrapperDiv, this.canvasObj2);
    }

    init(dataObj)
    {
        if(!dataObj) return;

        // window.onwheel = function(){ return false; }

        this.dataObject = dataObj;

        for(let i in this.layers)
        {
            // set params
            this.layers[i].dataObject = this.dataObject;

            this.layers[i].renderAll = this.renderAll.bind(this);
            this.layers[i].updateBuffers();
        }

        this.renderAll();
    }

    renderAll()
    {
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

    onResize()
    {
        this.layers.forEach(layer => {
            layer.onResize();
        });
    }

    setTooltipHandler(tooltipHandler)
    {
        this.layers[1].tooltipHandler = tooltipHandler;
    }
}
