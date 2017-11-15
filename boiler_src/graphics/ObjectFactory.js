import { m3 } from './m3';
import { AssignmentBoxConfig } from './config';

export let Geometry = {}

// Basic objects
Geometry.Rectangle = class {
    constructor(left, top, width, height) {
        this.top = top; this.left = left; this.width = width; this.height = height;
        this.color = [0.5, 0.5, 1, 1];
    }

    toArrayBuffer() {
        function toRectVertices(x1, y1, x2, y2, color) {
            var dataObj = new Geometry.VertexData();
            var posArray = [
                x1, y1, x2, y1, x1, y2,
                x1, y2, x2, y1, x2, y2];

            var vertexNum = parseInt(posArray.length / 2, 10);

            // Pos vertices and Color in the buffer
            for (var i = 0; i < vertexNum; i++) {
                dataObj.rectData.push(posArray[2 * i]);
                dataObj.rectData.push(posArray[2 * i + 1]);
                dataObj.rectData.push.apply(dataObj.rectData, color);
            }
            dataObj.rectItems += vertexNum;
            return dataObj;
        }

        var x1 = this.left;
        var y1 = this.top;
        var x2 = this.left + this.width;
        var y2 = this.top + this.height;
        return toRectVertices(x1, y1, x2, y2, this.color);
    }

    getBoundingBox() {
        return {
            top: this.top,
            left: this.left,
            bottom: this.top + this.height,
            right: this.left + this.width
        }
    }
}

Geometry.LineSegment = class {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
        this.color = [0.5, 1, 0.5, 1];
    }

    toArrayBuffer() {

        function toRectVertices(x1, y1, x2, y2, color) {
            var dataObj = new Geometry.VertexData();
            var posArray = [
                x1, y1, x2, y2];

            var vertexNum = parseInt(posArray.length / 2, 10);

            // Pos vertices and Color in the buffer
            for (var i = 0; i < vertexNum; i++) {
                dataObj.lineData.push(posArray[2 * i]);
                dataObj.lineData.push(posArray[2 * i + 1]);
                dataObj.lineData.push.apply(dataObj.lineData, color);
            }
            dataObj.lineItems += vertexNum;
            return dataObj;
        }

        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2;
        var y2 = this.y2;
        return toRectVertices(x1, y1, x2, y2, this.color);
    }
}

// Complex objects from primitives

Geometry.ScheduleRect = class {
    constructor(left, top, width, height, activity) {
        this.bgRectangle = new Geometry.Rectangle(left, top, width, height);
        this.activity = activity;

        var color = ProductColors[activity.ProductCode];
        if (color) {
            this.bgRectangle.color = color;
        }
        else {
            this.bgRectangle.color = [0.7, 0.4, 0.4, 1];
        }
    }

    toArrayBuffer() {
        return this.bgRectangle.toArrayBuffer();
    }
}

Geometry.AssignmentBox = class {

    constructor(wrappedObj, left, top, right, bottom) {
        this.wrappedObj = wrappedObj;
        this.rectangle1 = new Geometry.Rectangle(left, top, right - left, bottom - top);
        this.rectangle1.color = AssignmentBoxConfig.bgcolor;
        this.rightEdge = this.rectangle1.left + this.rectangle1.width;
        this.productRects = [];

        this.lines = [];
        this.lines.push(new Geometry.LineSegment(left, top, left, bottom));
        this.lines.push(new Geometry.LineSegment(right, top, right, bottom));
    }

    renderTexts(ctx) {
        return;
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.font = "10px Arial";
        var box1 = this.rectangle1.getBoundingBox();
        Geometry.TEXT.render(ctx, this.wrappedObj.vessel.VesselName, Geometry.Alignment.TopLeft, box1, 3);


        var products = this.wrappedObj.nomination.NominationItems;
        for (var i in products) {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.font = "11px Verdana";
            box1 = this.productRects[i * 2].getBoundingBox();
            Geometry.TEXT.render(ctx, products[i].ProductCode, Geometry.Alignment.RightCenter, box1, 3);

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.font = "11px Verdana";
            box1 = this.productRects[i * 2 + 1].getBoundingBox();
            Geometry.TEXT.render(ctx, products[i].Tonnage.toString(), Geometry.Alignment.RightCenter, box1, 3);
        }
    }

    toArrayBuffer() {
        var dataObj = this.rectangle1.toArrayBuffer();
        for (let i in this.productRects) {
            dataObj.concat(this.productRects[i].toArrayBuffer());
        }

        for (let i in this.lines) {
            this.lines[i].color = VesselBorderColor;
            dataObj.concat(this.lines[i].toArrayBuffer());
        }

        return dataObj;
    }

    addProducts(nomination) {
        var products = nomination.NominationItems;
        for (var i in products) {
            var color = ProductColors[products[i].ProductCode];

            var newRectHeader = new Geometry.Rectangle(this.rightEdge, this.rectangle1.top, this.rectangle1.width / 2, this.rectangle1.height / 2);
            var newRectBody = new Geometry.Rectangle(this.rightEdge, this.rectangle1.top + this.rectangle1.height / 2, this.rectangle1.width / 2, this.rectangle1.height / 2);

            if (color) {
                newRectHeader.color = color;
            }
            else {
                newRectHeader.color = [0.2, 0.3, 0.4, 1];
            }
            newRectBody.color = [0.99, 0.99, 0.99, 1];
            // products[i].InputTonnage;

            this.productRects.push(newRectHeader);
            this.productRects.push(newRectBody);

            this.lines.push(new Geometry.LineSegment(this.rightEdge, this.rectangle1.top, this.rightEdge, this.rectangle1.top + this.rectangle1.height));

            this.rightEdge = newRectHeader.left + newRectHeader.width;
        }
    }

    updateY(yTop) {
        var yIncrement = yTop - this.rectangle1.top;

        this.rectangle1.top += yIncrement;
        for (let i in this.productRects) {
            this.productRects[i].top += yIncrement;
        }

        for (let i in this.lines) {
            this.lines[i].y1 += yIncrement;
            this.lines[i].y2 += yIncrement;
        }
    }

    getBoundingBox() {
        return {
            top: this.rectangle1.top,
            left: this.rectangle1.left,
            bottom: this.rectangle1.top + this.rectangle1.height,
            right: this.rightEdge
        }
    }
}

Geometry.Quad = class {
    constructor(p1, p2, p3, p4) {
        this.p1 = p1; this.p2 = p2; this.p3 = p3; this.p4 = p4;
        this.color = [72 / 256, 162 / 256, 219 / 256, 1];
    }

    toArrayBuffer() {
        function toVertices(p1, p2, p3, p4, color) {
            var dataObj = new Geometry.VertexData();
            var posArray = [
                p1.x, p1.y, p2.x, p2.y, p3.x, p3.y,
                p1.x, p1.y, p3.x, p3.y, p4.x, p4.y];

            var vertexNum = parseInt(posArray.length / 2, 10);

            // Pos vertices and Color in the buffer
            for (var i = 0; i < vertexNum; i++) {
                dataObj.rectData.push(posArray[2 * i]);
                dataObj.rectData.push(posArray[2 * i + 1]);
                dataObj.rectData.push.apply(dataObj.rectData, color);
            }
            dataObj.rectItems += vertexNum;
            return dataObj;
        }
        return toVertices(this.p1, this.p2, this.p3, this.p4, this.color);
    }
}

Geometry.AssetLabelPanel = class {
    constructor() {
        this.labelList = [];
        this.panelWidth = 50;
    }

    addLabel(text, height) {
        this.labelList.push({ text: text, height: height });
    }

    render(ctx) {
        ctx.font = "12px Arial";
        ctx.fillStyle = 'rgba(66, 88, 102, 1)';
        ctx.fillRect(0, 0, this.panelWidth, ctx.canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        for (let i in this.labelList) {
            var text = this.labelList[i].text + "-";
            ctx.fillText(text, this.panelWidth - ctx.measureText(text).width, this.labelList[i].height + 4);
        }
    }
}

Geometry.VertexData = class {
    constructor() {
        this.lineData = []; this.rectData = [];
        this.lineItems = 0; this.rectItems = 0;
    }

    concat(vertexData2) {
        this.lineData = this.lineData.concat(vertexData2.lineData);
        this.rectData = this.rectData.concat(vertexData2.rectData);
        this.lineItems += vertexData2.lineItems;
        this.rectItems += vertexData2.rectItems;
    }
}

var ProductColors = {
    "NHGF": [255 / 256, 193 / 256, 3 / 256, 1],
    "YNDF": [242 / 256, 140 / 256, 140 / 256, 1],
    "MACF": [170 / 256, 130 / 256, 255 / 256, 1],
    "JMBF": [52 / 256, 176 / 256, 159 / 256, 1],
    "NBLL": [51 / 256, 122 / 256, 255 / 256, 1],
    "NHGL": [200 / 256, 140 / 256, 0 / 256, 1],
    "YNDL": [190 / 256, 90 / 256, 90 / 256, 1],
    "MACL": [120 / 256, 80 / 256, 200 / 256, 1],
    "JMBL": [2 / 256, 120 / 256, 109 / 256, 1],
    "NBLLU": [51 / 256, 122 / 256, 255 / 256, 1],
    "NBLLRSF": [51 / 256, 122 / 256, 255 / 256, 1],
}

Geometry.Alignment = {
    TopLeft: 0,
    TopRight: 1,
    BottomLeft: 2,
    BottomRight: 3,
    Center: 4,
    RightCenter: 5,
}

Geometry.TextRenderer = class {

    constructor() {
        this.appTimeTransform = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    renderAt(ctx, text, x, y, color) {
        var textWidth = ctx.measureText(text).width;
        let x0 = this.appTimeTransform.transformX(x) - textWidth / 2;
        let y0 = y + 4;
        ctx.font = "13px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text, Math.round(x0), Math.round(y0));
    }

    render(ctx, text, alignment, box, offset) {
        var boxLeft = this.appTimeTransform.transformX(box.left);
        var boxRight = this.appTimeTransform.transformX(box.right);

        var textWidth = ctx.measureText(text).width;
        var toBeShortened = (textWidth >= boxRight - boxLeft);

        if (toBeShortened) {
            text = text.substring(0, 10) + "...";
            textWidth = ctx.measureText(text).width;
        }

        switch (alignment) {
            case Geometry.Alignment.TopLeft:
                {
                    let x0 = boxLeft + offset;
                    let y0 = box.top + offset + 10;
                    ctx.fillText(text, Math.round(x0), Math.round(y0));
                }
                break;
            case Geometry.Alignment.TopRight:
                {
                    let x0 = boxRight - textWidth - offset;
                    let y0 = box.top + offset + 9;
                    ctx.fillText(text, Math.round(x0), Math.round(y0));
                }
                break;
            case Geometry.Alignment.RightCenter:
                {
                    let x0 = boxRight - textWidth - offset;
                    let y0 = (box.top + box.bottom) / 2 + 9 / 2;
                    ctx.fillText(text, Math.round(x0), Math.round(y0));
                }
                break;
            default: break;
        }
    }

    _transform(x, y) {
        return m3.multiplyVec(this.appTimeTransform.matrix, [x, y, 1]);
    }
}

Geometry.TEXT = new Geometry.TextRenderer();

const VesselBorderColor = [142 / 256, 156 / 256, 165 / 256, 1];
