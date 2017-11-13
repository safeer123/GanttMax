import {Utils} from './AppUtils'

export let SpatialHash =  {};

SpatialHash.Lookup = class
{
    constructor(cellWidth, cellHeight)
    {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.lookupTable = [];
    }

    clear()
    {
        this.lookupTable = [];
    }

    insertObj(obj)
    {
        var boundingBox = obj.getBoundingBox();
        if(boundingBox)
        {
            var xStart = parseInt(boundingBox.left/this.cellWidth, 10);
            var xEnd = parseInt(boundingBox.right/this.cellWidth, 10);
            var yStart = parseInt(boundingBox.top/this.cellHeight, 10);
            var yEnd = parseInt(boundingBox.bottom/this.cellHeight, 10);

            for(var i=xStart; i<=xEnd; i++)
            {
                for(var j=yStart; j<=yEnd; j++)
                {
                    this.add(i, j, obj);
                }
            }
        }
    }

    add(i, j, obj)
    {
        if(typeof this.lookupTable[i] === "undefined")
        {
            this.lookupTable[i] = [];
        }

        if(typeof this.lookupTable[i][j] === "undefined")
        {
            this.lookupTable[i][j] = [];
        }

        this.lookupTable[i][j].push(obj);
    }

    getObjectsAt(point)
    {
        var i = parseInt(point.x/this.cellWidth, 10);
        var j = parseInt(point.y/this.cellHeight, 10);

        if(this.lookupTable[i] && this.lookupTable[i][j])
        {
            var objList = this.lookupTable[i][j];
            for(var k in objList)
            {
                var boundingBox = objList[k].getBoundingBox();
                if( Utils.isInsideBox(boundingBox, point) )
                {
                    return objList[k];
                }
            }
        }

        return null;
    }
}