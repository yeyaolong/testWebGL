"use strict"

function main() {
  let canvas = document.querySelector("#canvas");
	let gl = canvas.getContext("webgl");

	if (!gl) {
		return;
	}

	let program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d_2", "fragment-shader-2d"]);

	let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

	let positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	let positions = [
		10, 20,
		80, 20,
		10, 30,
		10, 30,
		80, 20,
		80, 30,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	gl.enableVertexAttribArray(positionAttributeLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	let size = 2;
	let type = gl.FLOAT;
	let normalize = false;
	let stride = 0;
	let offset = 0;

	gl.vertexAttribPointer(
		positionAttributeLocation, size, type, normalize, stride, offset
	);

	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	let primitiveType = gl.TRIANGLES;
	let offset2 = 0;
	let count = 6;	// 一个矩形由2个三角形组成, 需要6个顶点
	gl.drawArrays(primitiveType, offset2, count);
}

main();