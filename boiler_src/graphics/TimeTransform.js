import {m3} from './m3'
import { Utils } from './AppUtils'

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

        this.timeWindow = new Utils.TimeWindow( tStart0, tEnd0 );
        this.timeWindow.setOffset(0.03);

        // initial zoom, translation
        this.__zoomFactor = 1.0;
        this.__tx = 0.0;
        this.__ty = 0.0;

        // Identity Matrix
        this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        this.applyZoom(2, 1, 0);
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

        this.readjustTranslationInX();

        var translationMatrix0 = m3.translation(this.__tx, this.__ty);
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
        this.readjustTranslationInX();

        var translationMatrix = m3.translation(this.__tx - temp, 0);

        // Multiply the matrices.
        this.matrix = m3.multiply(translationMatrix, this.matrix);
    }

    verticalScroll(incrFactor)
    {
        // Compute the matrices
        var temp = this.__ty;
        this.__ty += incrFactor;
        this.readjustTranslationInY();

        var translationMatrix = m3.translation(0, this.__ty - temp);

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

    readjustTranslationInX()
    {
        var minTranslation = -(this.xLimit*this.__zoomFactor - this.xLimit);
        var maxTranslation = 0;
        if(this.__tx < minTranslation) this.__tx = minTranslation;
        else if(this.__tx > maxTranslation) this.__tx = maxTranslation;
    }

    readjustTranslationInY()
    {
        
        //var minTranslation = 0;
        var maxTranslation = 0;
        //if(this.__ty < minTranslation) this.__ty = minTranslation;
        if(this.__ty > maxTranslation) this.__ty = maxTranslation;
        
    }

    reverseX(x)
    {
        return (x/this.__zoomFactor)-(this.__tx/this.__zoomFactor);
    }

    reverseY(y)
    {
        return (y)-(this.__ty);
    }

    transformX(x)
    {
        return (x*this.__zoomFactor + this.__tx);
    }

    transformY(y)
    {
        return (y + this.__ty);
    }

    transformBox(box, fixX=false, fixY=false)
    {
        return {
            left: fixX ? box.left : this.transformX(box.left),
            right: fixX ? box.right : this.transformX(box.right),
            top: fixY ? box.top : this.transformY(box.top),
            bottom: fixY ? box.bottom : this.transformY(box.bottom),
        }
    }

    getMatrix(fixX=false, fixY=false)
    {
        let outMatrix = Utils.clone(this.matrix);
        if(fixX)
        {
            outMatrix[0] = 1;
            outMatrix[6] = 0;
        }
        if(fixY)
        {
            outMatrix[4] = 1;
            outMatrix[7] = 0;
        }
        return outMatrix;
    }

    // rough check whether a y value falls inside the viewing window
    isInsideTester(canvasHeight)
    {
        var minHeightAllowed = -this.__ty - 100;
        var maxHeightAllowed = -this.__ty + canvasHeight + 100;
        return function(yValue)
        {
            return yValue > minHeightAllowed && yValue < maxHeightAllowed;
        }
    }
}
