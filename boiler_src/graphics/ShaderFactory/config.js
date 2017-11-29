import {PROGRAMS} from './constants';

let programList = [
    {
        programId: PROGRAMS.COLOR_SHADER_3D,
        vertexShaderId: "shader-vcol3d",
        fragmentShaderId: "shader-fcol3d",
        attribs: [
            {name: "a_position", type: "vec3"},
            {name: "a_color", type: "vec4"},
        ],
        uniforms: [
            {name: "u_matrix", type: "mat4"},
        ],
    }
];

export default programList;
