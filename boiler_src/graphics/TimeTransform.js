import {m3} from './m3'

export class TimeTransform
{
    constructor(tStart0, tEnd0, xLimit)
    {
        this.tStart0 = tStart0;
        this.tEnd0 = tEnd0;

        this.xLimit = xLimit;

        // initial values
        this.tStart = tStart0;
        this.tEnd = tEnd0;

        // initial zoom
        this.__zoomFactor = 1.0;
        this.__tx = 0.0;

        // Identity Matrix
        this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    applyZoom(zoomIncrFactor, wheelDelta, x0)
    {
        var newZoomFactor = 1;
        if(wheelDelta > 0)
        {
            newZoomFactor = Math.min(this.__zoomFactor + zoomIncrFactor, 5.0);
        }
        else
        {
            newZoomFactor = Math.max(this.__zoomFactor - zoomIncrFactor, 1.0);
        }

        this.__tx = (x0-this.__tx)*(this.__zoomFactor-newZoomFactor)/this.__zoomFactor + this.__tx;
        this.__zoomFactor = newZoomFactor;

        this.readjustTranslation();

        var translationMatrix0 = m3.translation(this.__tx, 0);
        var scaleMatrix = m3.scaling(this.__zoomFactor, 1);

        // Multiply the matrices.
        this.matrix = m3.multiply(translationMatrix0, scaleMatrix);
        
        // console.log("x0: " + x0);
        // console.log("this.__tx: " + this.__tx);
        // console.log("zoomFactor: " + this.__zoomFactor);
    }

    applyPan(panIncrFactor)
    {
        // Compute the matrices
        var temp = this.__tx;
        this.__tx += panIncrFactor;
        this.readjustTranslation();

        var translationMatrix = m3.translation(this.__tx - temp, 0);

        // Multiply the matrices.
        this.matrix = m3.multiply(translationMatrix, this.matrix);
    }

    applyNewTimeWindow(t1, t2)
    {

    }

    getZoomFactor()
    {
        return this.__zoomFactor;
    }

    readjustTranslation()
    {
        var minTranslation = -(this.xLimit*this.__zoomFactor - this.xLimit);
        var maxTranslation = 0;
        if(this.__tx < minTranslation) this.__tx = minTranslation;
        else if(this.__tx > maxTranslation) this.__tx = maxTranslation;
    }

    reverseX(x)
    {
        return (x/this.__zoomFactor)-(this.__tx/this.__zoomFactor);
    }

    transformX(x)
    {
        return (x*this.__zoomFactor + this.__tx);
    }
}