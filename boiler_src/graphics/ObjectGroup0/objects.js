let Geometry = {

//====== Customizable Basic Objects =====================================//
//====== These objects can be re-used, can be used to create complex objects

Triangle3D: class {
    constructor(p1, p2, p3) {
        this.p1 = p1; this.p2 = p2; this.p3 = p3;
        this.color = [72 / 256, 162 / 256, 219 / 256, 1];
    }

    toArrayBuffer() {
        function toVertices(p1, p2, p3, color) {
            var dataObj = new Geometry.VertexData();
            var posArray = [
                ...p1, 
                ...p2, 
                ...p3,
            ]; 

            var vertexNum = parseInt(posArray.length / 3, 10);

            // Pos vertices and Color in the buffer
            for (var i = 0; i < vertexNum; i++) {
                dataObj.trglData.push(posArray[3 * i + 0]);
                dataObj.trglData.push(posArray[3 * i + 1]);
                dataObj.trglData.push(posArray[3 * i + 2]);
                dataObj.trglData.push.apply(dataObj.trglData, color);
            }
            dataObj.trglItems += vertexNum;
            return dataObj;
        }
        return toVertices(this.p1, this.p2, this.p3, this.color);
    }
},

Quad3D: class {
    constructor(p1, p2, p3, p4) {
        this.triangle1 = new Geometry.Triangle3D(p1, p2, p3);
        this.triangle2 = new Geometry.Triangle3D(p1, p3, p4);
        this.color = [72 / 256, 162 / 256, 219 / 256, 1]; // default
    }

    toArrayBuffer() {
        this.triangle1.color = this.color;
        this.triangle2.color = this.color;
        let arrayBuffer = this.triangle1.toArrayBuffer()
            .concat(this.triangle2.toArrayBuffer());
        return arrayBuffer;
    }
},

VertexData: class {
    constructor() {
        this.lineData = []; this.trglData = [];
        this.lineItems = 0; this.trglItems = 0;
    }

    concat(vertexData2) {
        this.lineData = this.lineData.concat(vertexData2.lineData);
        this.trglData = this.trglData.concat(vertexData2.trglData);
        this.lineItems += vertexData2.lineItems;
        this.trglItems += vertexData2.trglItems;
        return this;
    }
}

};

export default Geometry;