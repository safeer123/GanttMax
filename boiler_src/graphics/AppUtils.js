export let Utils = {}

Utils.clone = function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = Utils.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Utils.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

Utils.createBufferObj = function()
{
    return {
        data: [],
        numItems: 0,
        buffer: null,
    }
}

Utils.TimeWindow = class TimeWindow
{
    constructor(startTime, endTime)
    {
        this.startTime = startTime;
        this.endTime = endTime;
        this.offset = 0;
    }

    getPositionOnTimeScale(inputTime)
    {
        var result = NaN;
        if(inputTime >= this.startTime && inputTime <= this.endTime )
        {
            result = (inputTime - this.startTime)/(this.endTime - this.startTime);
        }
        return this.offset + (1 - this.offset) * result;
    }

    setOffset(offset)
    {
        this.offset = offset;
    }
}

Utils.convertDateTime = function(dateString)
{
    var strList = dateString.split(" ");
    var year = strList[0].split("/");
    return year[2] + "/" + year[1] + "/" + year[0] + " " + strList[1];
}

Utils.strToDate = function(dateStr)
{
	dateStr = dateStr.replace("T", " ");
	dateStr = dateStr.replace("-", "/");
	dateStr = dateStr.replace("Z", "");
	return new Date(dateStr);
}

Utils.isInsideBox = function(boundingBox, point)
{
    if( point.x >= boundingBox.left &&
        point.x <= boundingBox.right &&
        point.y >= boundingBox.top &&
        point.y <= boundingBox.bottom)
        {
            return true;
        }

    return false;
}

Utils.cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};