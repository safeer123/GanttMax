import GLInitializer from './GLInitializer';

export class Canvas{
    
    constructor(wrapperDiv, programIdList=null)
    {
        this.canvas = document.createElement("canvas");
        wrapperDiv.appendChild(this.canvas);

        this.canvas.style.position = "absolute";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = 1;
        this.canvas.width = wrapperDiv.clientWidth;
        this.canvas.height = wrapperDiv.clientHeight;

        this.initGL(); // webgl canvas

        this.shaderFac = new GLInitializer(this);
        this.shaderFac.init(programIdList);
    }

    initGL() {
        try {
            this.gl = this.canvas.getContext("experimental-webgl");
            this.gl.viewportWidth = this.gl.drawingBufferWidth;
            this.gl.viewportHeight = this.gl.drawingBufferHeight;
        } catch (e) {
        }
        if (!this.gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }
}

export class Canvas2D{
    
    constructor(wrapperDiv)
    {
        this.canvas = document.createElement("canvas");
        wrapperDiv.appendChild(this.canvas);

        this.canvas.style.position = "absolute";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = 1;
        this.canvas.width = wrapperDiv.clientWidth;
        this.canvas.height = wrapperDiv.clientHeight;
        this.canvas.style.pointerEvents = "none";

        this.initGL(); // 2d canvas
    }

    initGL() {
        try {
            this.ctx = this.canvas.getContext("2d");
            this.ctx.viewportWidth = this.ctx.drawingBufferWidth;
            this.ctx.viewportHeight = this.ctx.drawingBufferHeight;
        } catch (e) {
        }
        if (!this.ctx) {
            alert("Could not initialise 2D canvas, sorry :-(");
        }
    }
}