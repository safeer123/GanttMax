import programList from './config';

export default class GLInitializer
{

    constructor(canvasObj)
    {
        this.canvas = canvasObj.canvas;
        this.gl = canvasObj.gl;
    }
    
    init(programIdList)
    {
        this.initShaders(programIdList);

        // this.locoImage = document.getElementById('locoImg');
        // this.initTexture();
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

    initShaders(programIdList) {
        var gl = this.gl;

        let myPrograms = programList;
        if(programIdList)
        {
            myPrograms = programList.filter(prgm => prgm.programId in programIdList);
        }
        myPrograms.forEach(prgm => {
            this.createShaderProgram(prgm.programId, prgm.vertexShaderId, prgm.fragmentShaderId);
            let program = this.shaderPrograms[prgm.programId];
            prgm.attribs.forEach(attrib => {
                program.registerAttrib(this.gl, attrib.name, attrib.type);
            });

            prgm.uniforms.forEach(uniform => {
                program.registerUniform(this.gl, uniform.name, uniform.type);
            });
        });
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
        location: attrib,
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
        location: uniform,
        type: type
    };
}