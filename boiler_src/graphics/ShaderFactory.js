    
    
export class ShaderFactory
{

    constructor()
    {
        this.canvas = null;
        this.gl = null;
    }
    
    init(canvasObj)
    {
        this.canvas = canvasObj.canvas;
        this.gl = canvasObj.gl;

        this.locoImage = document.getElementById('locoImg');

        this.initShaders();

        this.initTexture();

        //this.initTransformationMatrices();
    }

    getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
 
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType === 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
 
        var shader;
        if (shaderScript.type === "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
 
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
 
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
 
        return shader;
    }

    initTexture()
    {
        var gl = this.gl;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        this.imageTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        // Upload the image into the texture.

        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.locoImage);
    }

    createShaderProgram(programId, vshaderId, fshaderId)
    {
        var gl = this.gl;

        if(typeof this.shaderPrograms === "undefined")
        {
            this.shaderPrograms = [];
        }
        
        var fragmentShader = this.getShader(gl, fshaderId);
        var vertexShader = this.getShader(gl, vshaderId);
 
        var shaderProgm = gl.createProgram();
        gl.attachShader(shaderProgm, vertexShader);
        gl.attachShader(shaderProgm, fragmentShader);
        gl.linkProgram(shaderProgm);
 
        if (!gl.getProgramParameter(shaderProgm, gl.LINK_STATUS)) {
            console.error("Could not create shader program: " + programId);
        }

        this.shaderPrograms[programId] = shaderProgm;
    }

    initShaders() {
        var gl = this.gl;
        
        //======== COLOR SHADER PROGRAM
        this.createShaderProgram(PROGRAMS.COLOR_SHADER, "shader-vcol", "shader-fcol");

        this.shaderPrograms[PROGRAMS.COLOR_SHADER].registerAttrib(this.gl, "a_position", "vec2");
        this.shaderPrograms[PROGRAMS.COLOR_SHADER].registerAttrib(this.gl, "a_color", "vec4");
        this.shaderPrograms[PROGRAMS.COLOR_SHADER].registerUniform(this.gl, "u_resolution", "vec2");
        this.shaderPrograms[PROGRAMS.COLOR_SHADER].registerUniform(this.gl, "u_matrix", "mat3");
 
        //======== TEXTURE SHADER PROGRAM
        this.createShaderProgram(PROGRAMS.TEXTURE_SHADER, "shader-vtex", "shader-ftex");

        this.shaderPrograms[PROGRAMS.TEXTURE_SHADER].registerAttrib(this.gl, "a_position", "vec2");
        this.shaderPrograms[PROGRAMS.TEXTURE_SHADER].registerAttrib(this.gl, "a_texCoord", "vec2");
        this.shaderPrograms[PROGRAMS.TEXTURE_SHADER].registerUniform(this.gl, "u_resolution", "vec2");
        this.shaderPrograms[PROGRAMS.TEXTURE_SHADER].registerUniform(this.gl, "u_matrix", "mat3");
        
        gl.useProgram(this.shaderPrograms[PROGRAMS.COLOR_SHADER]);
        gl.uniform2f( this.shaderPrograms[PROGRAMS.COLOR_SHADER].uniforms["u_resolution"].index, gl.canvas.width, gl.canvas.height );
        gl.useProgram(this.shaderPrograms[PROGRAMS.TEXTURE_SHADER]);
        gl.uniform2f( this.shaderPrograms[PROGRAMS.TEXTURE_SHADER].uniforms["u_resolution"].index, gl.canvas.width, gl.canvas.height );
    }
}

WebGLProgram.prototype.registerAttrib = function(gl, attribName, type)
{
    if(typeof this.attribs === "undefined")
    {
        this.attribs = {};
    }

    var attrib = gl.getAttribLocation(this, attribName);

    this.attribs[attribName] = {
        index: attrib,
        type: type
    };
}

WebGLProgram.prototype.registerUniform = function(gl, uniformName, type)
{
    if(typeof this.uniforms === "undefined")
    {
        this.uniforms = {};
    }

    var uniform = gl.getUniformLocation(this, uniformName);

    this.uniforms[uniformName] = {
        index: uniform,
        type: type
    };
}

export let PROGRAMS = {
    COLOR_SHADER: 0,
    TEXTURE_SHADER: 1,
}

export class Canvas{
    
    constructor(wrapperDiv)
    {
        this.canvas = document.createElement("canvas");
        wrapperDiv.appendChild(this.canvas);

        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = 1;
        this.canvas.width = wrapperDiv.clientWidth;
        this.canvas.height = wrapperDiv.clientHeight;

        this.initGL(); // webgl canvas

        this.shaderFac = new ShaderFactory();
        this.shaderFac.init(this);
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


