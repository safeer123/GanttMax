import {Geometry} from './ObjectFactory'
import {PROGRAMS} from './ShaderFactory'
import {Utils} from './AppUtils'
import {Base} from './GraphicsLayer'

// Timeline Layer
export class TimelineLayer extends Base
{

    // Construct canvas and webgl context
    constructor(wrapperElem, canvas)
    {
        super(wrapperElem, canvas);

        this.shaderProgram = this.shaderFac.shaderPrograms[PROGRAMS.COLOR_SHADER];
        this.positionAttrib = this.shaderProgram.attribs["a_position"].index;
        this.colorAttrib = this.shaderProgram.attribs["a_color"].index;
        this.matrixUniform = this.shaderProgram.uniforms["u_matrix"].index;

        this.timeLabels = [];

        this.timeStep = 12;
    }

    updateBuffers()
    {
        this.objectList = [];

        var gl = this.gl;

        if(!this.buffers)
        {
            this.buffers = {};
        }
        else
        {
            if(this.buffers.bgLineBuffer && this.buffers.bgLineBuffer.buffer)
            {
                gl.deleteBuffer(this.buffers.bgLineBuffer.buffer);
            }
        }

        this.buffers.bgLineBuffer = Utils.createBufferObj();
        this.buffers.bgLineBuffer.buffer = gl.createBuffer();

        this.bgLinesList = [];

        var dateVar = new Date(this.timeWindow.startTime);
        dateVar.setMinutes(0);
        dateVar.setSeconds(0);
        dateVar.setHours(0);

        Geometry.TEXT.appTimeTransform = this.appTimeTransform;

        this.timeLabels.length = 0;

        while(dateVar < this.timeWindow.endTime)
        {
            var xPos = this.timeWindow.getPositionOnTimeScale(dateVar);
            if(! isNaN(xPos))
            {
                var newLine = new Geometry.LineSegment(xPos*this.canvas.width,this.canvas.height-5, xPos*this.canvas.width, this.canvas.height);
                newLine.color = [1, 1, 1, 1];
                this.bgLinesList.push(newLine);

                var dateText = "";
                
                if(dateVar.getHours() === 0)
                {
                    var dayStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateVar.getDay()];
                    dateText = dayStr + " " + dateVar.getDate();
                }
                else if(dateVar.getHours() === 3) dateText = "3:00 AM";
                else if(dateVar.getHours() === 6) dateText = "6:00 AM";
                else if(dateVar.getHours() === 9) dateText = "9:00 AM";
                else if(dateVar.getHours() === 12) dateText = "12:00 PM";
                else if(dateVar.getHours() === 15) dateText = "3:00 PM";
                else if(dateVar.getHours() === 18) dateText = "6:00 PM";
                else if(dateVar.getHours() === 21) dateText = "9:00 PM";

                this.timeLabels.push({
                    x: newLine.x1,
                    y: newLine.y1-10,
                    text: dateText,
                    color: "rgba(200,200,200,1)",
                });
            }
            dateVar.setHours( dateVar.getHours() + this.timeStep );
        }

        var bgLineBuffer = this.buffers.bgLineBuffer;

        for(var i in this.bgLinesList)
        {
            var arrayObj = this.bgLinesList[i].toArrayBuffer();
            bgLineBuffer.data.push.apply(bgLineBuffer.data, arrayObj.lineData);
            bgLineBuffer.numItems += arrayObj.lineItems;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, bgLineBuffer.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bgLineBuffer.data), gl.STATIC_DRAW);
    }

    updateTimeLabels()
    {
        var currentTimeStep = 12;
        var zoomFac = this.appTimeTransform.getZoomFactor();
        if(zoomFac >= 4) currentTimeStep = 3;
        else if(zoomFac >= 2) currentTimeStep = 6;
        
        
        if(this.timeStep !== currentTimeStep)
        {
            this.timeStep = currentTimeStep;
            this.updateBuffers();
        }
    }

    render()
    {
        var gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.renderBgLines();

        this.canvas2D.ctx.clearRect(0, 0, this.canvas2D.canvas.width, this.canvas2D.canvas.height);
        for(var i in this.timeLabels)
        {
            Geometry.TEXT.renderAt(this.canvas2D.ctx, this.timeLabels[i].text, this.timeLabels[i].x, this.timeLabels[i].y, this.timeLabels[i].color);
        }
    }

    renderBgLines()
    {
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
        gl.uniformMatrix3fv(this.matrixUniform, false, this.appTimeTransform.matrix);

        gl.drawArrays(gl.LINES, 0, bgLineBuffer.numItems);
    }

    getTimeLabels()
    {
        return this.timeLabels;
    }
}