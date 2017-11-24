import { Geometry } from './ObjectFactory'
import { PROGRAMS } from './ShaderFactory'
import { Utils } from './AppUtils'
import { Base } from './GraphicsLayer'


// GanttChartLayer Layer
export class GanttChartLayer extends Base {

    // Construct canvas and webgl context
    constructor(wrapperElem, canvas) {
        super(wrapperElem, canvas);

        this.shaderProgram = this.shaderFac.shaderPrograms[PROGRAMS.COLOR_SHADER];
        this.positionAttrib = this.shaderProgram.attribs["a_position"].index;
        this.colorAttrib = this.shaderProgram.attribs["a_color"].index;
        this.matrixUniform = this.shaderProgram.uniforms["u_matrix"].index;
        this.resolutionUniform = this.shaderProgram.uniforms["u_resolution"].index;

        this.assignmentPlans = [];
        this.sideLabelList = [];
        this.waitingLabelList = [];

        this.MOUSE = {
            offsetX: 0,
            offsetY: 0,
            isDown: false,
            startX: 0,
            startY: 0,
            netPanningX: 0,
            netPanningY: 0,
            isDrag: false
        };

        this.canvas.onmousemove = function (e) {

            if (!this.appTimeTransform) return;

            var mouseX = e.offsetX;
            var mouseY = e.offsetY;

            if (this.MOUSE.isDown) {
                // tell the browser we're handling this event
                e.preventDefault();
                e.stopPropagation();

                // dx & dy are the distance the mouse has moved since
                // the last mousemove event
                var dx = mouseX - this.MOUSE.startX;
                var dy = mouseY - this.MOUSE.startY;

                // reset the vars for next mousemove
                this.MOUSE.startX = mouseX;
                this.MOUSE.startY = mouseY;

                // console.log(dx);

                if (Math.abs(dx) > Math.abs(dy)) {
                    this.appTimeTransform.applyPan(dx);
                }
                else {
                    this.appTimeTransform.verticalScroll(dy);
                }

                this.renderAll();
            }
            else {
                mouseX = this.appTimeTransform.reverseX(mouseX);
                mouseY = this.appTimeTransform.reverseY(mouseY);
                var objs = this.hashLookup.getObjectsAt({ x: mouseX, y: mouseY });
                //console.log(objs);

                if (objs) {
                    var box = objs.getBoundingBox();

                    box.left = this.appTimeTransform.transformX(box.left);
                    box.right = this.appTimeTransform.transformX(box.right);
                    box.top = this.appTimeTransform.transformY(box.top);
                    box.bottom = this.appTimeTransform.transformY(box.bottom);

                    var offset = Utils.cumulativeOffset(this.wrapperElem);
                    this.tooltip.emptyList();
                    this.tooltip.addItem(objs.wrappedObj.BusName);
                    //this.tooltip.addItem("Vessel Type: " + objs.wrappedObj.vessel.IncoTerms);
                    //this.tooltip.addItem("Laycan Range: " + objs.wrappedObj.vessel.LaycanStart + " - " +  objs.wrappedObj.LaycanEnd);
                    //this.tooltip.addItem("SVP date: " + objs.wrappedObj.vessel.Eta);

                    var tooltipLeft = box.left;
                    if (box.left < 0) tooltipLeft = 0;
                    else if (box.right >= this.canvas.width) tooltipLeft = this.canvas.width - 220;

                    //this.tooltip.showAt(offset.left + tooltipLeft + 10, offset.top + box.top + 10);
                    this.tooltipHandler(true, objs.wrappedObj, { x: tooltipLeft + 10, y: box.top + 10 });
                }
                else {
                    //this.tooltip.hide();
                    this.tooltipHandler(false);
                }
            }

        }.bind(this);


        this.canvas.onmousedown = function (e) {
            if (!this.appTimeTransform) return;
            //console.log("Mouse Down");
            //console.log(e);

            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();

            // calc the starting mouse X,Y for the drag
            this.MOUSE.startX = parseInt(e.offsetX, 10);
            this.MOUSE.startY = parseInt(e.offsetY, 10);

            // set the isDragging flag
            this.MOUSE.isDown = true;

            this.MOUSE.isDrag = false;

            this.tooltipHandler(false);
        }.bind(this);

        this.canvas.onmouseup = function (e) {
            if (!this.appTimeTransform) return;
            //console.log("Mouse Up");
            //console.log(e);

            if (!this.MOUSE.isDrag) {
                //this.MOUSE.mouseClick(e);
            }

            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();

            // clear the isDragging flag
            this.MOUSE.isDown = false;
        }.bind(this);

        this.canvas.onmouseout = function (e) {
            if (!this.appTimeTransform) return;
            //console.log("Mouse Out");
            //console.log(e);

            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();

            // clear the isDragging flag
            this.MOUSE.isDown = false;
        }.bind(this);

        this.canvas.onmousewheel = function (e) {
            if (!this.appTimeTransform) return;
            // console.log(e.wheelDelta);
            var offset = Utils.cumulativeOffset(this.wrapperElem);
            this.appTimeTransform.applyZoom(0.05, e.wheelDelta, e.clientX - offset.left);
            this.renderAll();
        }.bind(this);

        // setTimeout(()=>{ console.log(this); }, 5000);
    }

    updateBuffers() {
        this.objectList = [];
        this.assignmentPlans = this.dataObject.plan;
        this.sideLabelList = [];
        this.waitingLabelList = [];

        var gl = this.gl;

        if (!this.buffers) {
            this.buffers = {
                rectBuffer: Utils.createBufferObj(),
                lineBuffer: Utils.createBufferObj(),
            }

            this.buffers.rectBuffer.buffer = gl.createBuffer();
            this.buffers.lineBuffer.buffer = gl.createBuffer();
        }
        else {
            if (this.buffers.rectBuffer && this.buffers.rectBuffer.buffer) {
                gl.deleteBuffer(this.buffers.rectBuffer.buffer);
            }

            if (this.buffers.lineBuffer && this.buffers.lineBuffer.buffer) {
                gl.deleteBuffer(this.buffers.lineBuffer.buffer);
            }

            this.buffers.rectBuffer = Utils.createBufferObj();
            this.buffers.lineBuffer = Utils.createBufferObj();
            this.buffers.rectBuffer.buffer = gl.createBuffer();
            this.buffers.lineBuffer.buffer = gl.createBuffer();
        }

        var chartHeight = 37;
        var yTop = 20;
        var yBottom = yTop + chartHeight;
        let timeWindow = this.appTimeTransform.timeWindow;
        this.hashLookup.clear();

        this.assignmentPlans.forEach((assignmentPlan, i) => {
            let busId = assignmentPlan.BusID;
            let busName = assignmentPlan.BusName;
            yBottom = yTop + chartHeight;

            let waitingStartTime = null;

            assignmentPlan.Plan.forEach((assignment, j) => {
                let startDate = Utils.strToDate(assignment.ScheduleStartTime);
                let endDate = Utils.strToDate(assignment.ScheduleEndTime);
                let xLeft = this.canvas.width * timeWindow.getPositionOnTimeScale(startDate);
                if (isNaN(xLeft)) return;
                let xRight = this.canvas.width * timeWindow.getPositionOnTimeScale(endDate);
                if (isNaN(xRight)) xRight = this.canvas.width;

                var assignmentObj = new Geometry.AssignmentBox(assignment, xLeft, yTop, xRight, yBottom);
                // var assignmentObj = new Geometry.AssignmentBox(assignment, 0, 300, 50, 350);
                this.objectList.push(assignmentObj);

                // Adding the waiting time label
                if(waitingStartTime)
                {
                    let waitingTime = Utils.getTimeDiffInMin(waitingStartTime.endDate, startDate);
                    let waitingTimeLabel = new Geometry.Label({ labelText: waitingTime }, waitingStartTime.xRight, yTop, xLeft, yBottom);
                    this.waitingLabelList.push(waitingTimeLabel);
                }

                this.hashLookup.insertObj(assignmentObj);

                waitingStartTime = { endDate, xRight };
            });

            let sideLabel = new Geometry.SideLabel({ busId, busName }, 0, yTop, 80, yBottom);
            this.sideLabelList.push(sideLabel);

            yTop += (chartHeight + 8);
        });

        var rectBuffer = this.buffers.rectBuffer;
        var lineBuffer = this.buffers.lineBuffer;

        for (let i in this.objectList) {
            var arrayObj = this.objectList[i].toArrayBuffer();
            rectBuffer.data.push.apply(rectBuffer.data, arrayObj.rectData);
            rectBuffer.numItems += arrayObj.rectItems;
            lineBuffer.data.push.apply(lineBuffer.data, arrayObj.lineData);
            lineBuffer.numItems += arrayObj.lineItems;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectBuffer.data), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineBuffer.data), gl.STATIC_DRAW);

        // console.log(this.objectList);
        // super.updateBgLineBuffer();
    }

    render() {

        if (this.bgLineCount && this.bgLineCount === this.timeLabels.length) {
            // skip
        }
        else {
            this.bgLineCount = this.timeLabels.length;
            super.updateBgLineBuffer();
        }

        this.renderBgLines();

        var gl = this.gl;
        var rectBuffer = this.buffers.rectBuffer;

        if (rectBuffer.numItems > 0) {
            gl.useProgram(this.shaderProgram);

            gl.enableVertexAttribArray(this.colorAttrib);

            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer.buffer);
            gl.vertexAttribPointer(this.colorAttrib, 4, gl.FLOAT, false, 24, 8);

            gl.enableVertexAttribArray(this.positionAttrib);

            // Bind the position buffer.
            gl.vertexAttribPointer(this.positionAttrib, 2, gl.FLOAT, false, 24, 0);

            // Add transformation matrix here
            // TODO: Update it only if necessary
            gl.uniformMatrix3fv(this.matrixUniform, false, this.appTimeTransform.getMatrix());
            gl.uniform2f( this.resolutionUniform, this.canvas.width, this.canvas.height);

            // Draw the rectangle.
            gl.drawArrays(gl.TRIANGLES, 0, rectBuffer.numItems);
        }


        var lineBuffer = this.buffers.lineBuffer;

        if (lineBuffer.numItems > 0) {
            gl.useProgram(this.shaderProgram);

            gl.enableVertexAttribArray(this.colorAttrib);

            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer.buffer);
            gl.vertexAttribPointer(this.colorAttrib, 4, gl.FLOAT, false, 24, 8);

            gl.enableVertexAttribArray(this.positionAttrib);

            // Bind the position buffer.
            gl.vertexAttribPointer(this.positionAttrib, 2, gl.FLOAT, false, 24, 0);

            // Add transformation matrix here
            // TODO: Update it only if necessary
            gl.uniformMatrix3fv(this.matrixUniform, false, this.appTimeTransform.getMatrix());
            gl.uniform2f( this.resolutionUniform, this.canvas.width, this.canvas.height);

            gl.drawArrays(gl.LINES, 0, lineBuffer.numItems);
        }

        Geometry.TEXT.appTimeTransform = this.appTimeTransform;
        this.renderTexts();
    }

    renderTexts() {
        var isInViewCheck = this.appTimeTransform.isInsideTester(this.canvas.height);
        this.canvas2D.ctx.clearRect(0, 0, this.canvas2D.canvas.width, this.canvas2D.canvas.height);
        this.objectList.forEach(gObj => {
            if (gObj instanceof Geometry.AssignmentBox) {
                if (isInViewCheck(gObj.getBoundingBox().top)) {
                    gObj.renderTexts(this.canvas2D.ctx);
                }
            }
        });

        this.waitingLabelList.forEach((waitingTimeLabel) => {
            if (isInViewCheck(waitingTimeLabel.getBoundingBox().top)) {
                waitingTimeLabel.renderTexts(this.canvas2D.ctx);
            }
        });

        this.sideLabelList.forEach((sideLabel) => {
            if (isInViewCheck(sideLabel.getBoundingBox().top)) {
                sideLabel.renderTexts(this.canvas2D.ctx);
            }
        });
    }

    renderBgLines() {
        var gl = this.gl;

        gl.useProgram(this.shaderProgram);

        var bgLineBuffer = this.buffers.bgLineBuffer;

        gl.useProgram(this.shaderProgram);

        gl.enableVertexAttribArray(this.colorAttrib);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, bgLineBuffer.buffer);
        gl.vertexAttribPointer(this.colorAttrib, 4, gl.FLOAT, false, 24, 8);

        gl.enableVertexAttribArray(this.positionAttrib);

        // Bind the position buffer.
        gl.vertexAttribPointer(this.positionAttrib, 2, gl.FLOAT, false, 24, 0);

        // Add transformation matrix here
        // TODO: Update it only if necessary
        gl.uniformMatrix3fv(this.matrixUniform, false, this.appTimeTransform.getMatrix(false, true));
        gl.uniform2f( this.resolutionUniform, this.canvas.width, this.canvas.height);

        gl.drawArrays(gl.LINES, 0, bgLineBuffer.numItems);
    }

    isCollidingWithOtherVessels(vesselObj) {
        var box = vesselObj.getBoundingBox();
        // Check collision
        var yMid = (box.top + box.bottom) / 2;
        var objs = this.hashLookup.getObjectsAt({ x: box.left - 10, y: yMid });
        if (objs) return true;

        objs = this.hashLookup.getObjectsAt({ x: (box.left + box.right) / 2, y: yMid });
        if (objs) return true;

        objs = this.hashLookup.getObjectsAt({ x: box.right + 10, y: yMid });
        if (objs) return true;

        return false;
    }
}