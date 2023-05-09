import { Attribute } from "./attribute";
import { BASE } from "./code-base";
import { DrawCall } from "./draw-call";
import { Program } from "./program";
import { Uniform } from "./uniform";

function createContext() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    document.body.appendChild(canvas);
    return gl;
}

function main() {
    const gl = createContext();
    gl.clearColor(0, 0, 0, 0);
    const program = new Program(gl, BASE.vSource, BASE.fSource, true);
    const position = new Attribute(
        'position',
        [
            0, 0,
            0, 0.5,
            0.7, 0,
        ],
        2,
    );
    const color = new Uniform(
        'color',
        [1, 0, 0, 1],
        'VEC4'
    );
    const attributes = {};
    const uniforms = {};
    attributes[position.name] = position;
    uniforms[color.name] = color;
    const drawCall = new DrawCall(
        gl,
        program,
        attributes,
        uniforms,
    )
    drawCall.upload();
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    drawCall.draw();
    // const p = program.program;
    // gl.useProgram(p);
    // const buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position.data), gl.STATIC_DRAW);
    // gl.vertexAttribPointer(
    //     0,
    //     2,
    //     gl.FLOAT,
    //     false,
    //     0,
    //     0
    // );
    // gl.enableVertexAttribArray(0);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.program = program;
}

main();
