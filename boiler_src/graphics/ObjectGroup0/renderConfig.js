import { PROGRAMS, SHADER_VARS, DATA_TYPES } from "../ShaderFactory/constants";

let attribPtrDetails = [
  {
    attribName: SHADER_VARS.a_position,
    size: 3, // no of typed data per vertex
    type: WebGLRenderingContext.FLOAT,
    normalize: false, // whether to normalize to fall in 0-1
    stride: 28, // bytes to skip, sumAll(size*sizeof(type))
    offset: 0 // offset from the beginning in bytes
  },
  {
    attribName: SHADER_VARS.a_color,
    size: 4, // no of typed data per vertex
    type: WebGLRenderingContext.FLOAT,
    normalize: false,
    stride: 28, // bytes to skip, sumAll(size*sizeof(type))
    offset: 12 // offset from the beginning in bytes
  }
];

let config = {
  programId: PROGRAMS.COLOR_SHADER_3D,
  bufferDetails: {
    triangleBfrPtrConfig: attribPtrDetails,
    lineBfrPtrConfig: attribPtrDetails
  },
  enableDepthTest: true,
  enableCulling: false
};

export default config;
