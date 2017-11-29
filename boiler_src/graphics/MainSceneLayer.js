import Geometry0 from "./ObjectGroup0/objects";
import renderConfig0 from "./ObjectGroup0/renderConfig";

import { PROGRAMS } from "./ShaderFactory";
import { Utils } from "./AppUtils";
import { Base } from "./GraphicsLayer";
import { m4 } from "./lib/m4";
import ObjectRenderer from "./lib/ObjectRenderer";
import { SHADER_VARS } from "./ShaderFactory/constants";

// MainSceneLayer Layer
export class MainSceneLayer extends Base {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);

    this.objRenderer0 = new ObjectRenderer(
      this.gl,
      this.shaderFac.shaderPrograms,
      renderConfig0
    );
  }

  updateBuffers() {
    //this.hashLookup.clear();
    this.objRenderer0.clearObjects();

    var quad3d = new Geometry0.Quad3D(
      [-0.5, 0.2, -0.5],
      [-0.5, -0.2, -0.5],
      [0.5, -0.2, -0.5],
      [0.5, 0.2, -0.5]
    );

    this.objRenderer0.addObject(quad3d);
    // this.hashLookup.insertObj(assignmentObj);

    this.objRenderer0.createBuffers();

    this.objRenderer0.setUniformGetter(function(uniformName) {
      switch (uniformName) {
        case SHADER_VARS.u_matrix: {
          let matrix = m4.translation(0, 0, 0);
          return matrix;
        }
      }
      console.error("UniformGetter: requested bad uniform - " + uniformName);
      return null;
    });
  }

  render() {
    this.objRenderer0.render();
  }
}
