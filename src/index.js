import { BASE } from "./code-base";
import { Program } from "./program";

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

const program = new Program(gl, BASE.vSource, BASE.fSource, true);

window.program = program;
