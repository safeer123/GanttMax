const SHADER_VARS = {
  a_position: "a_position",
  a_color: "a_color",
  u_matrix: "u_matrix",
  u_resolution: "u_resolution",
  a_texCoord: "a_texCoord"
};

const PROGRAMS = {
  COLOR_SHADER: 0,
  TEXTURE_SHADER: 1,
  COLOR_SHADER_3D: 2
};

const DATA_TYPES = {
    float32: 0,
    uInt8: 1,
}

export { PROGRAMS, SHADER_VARS, DATA_TYPES };
