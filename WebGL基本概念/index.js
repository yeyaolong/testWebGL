// Get A WebGL context
let canvas = document.getElementById("canvas");
let gl = canvas.getContext("experimental-webgl");
function draw() {
	if (!gl) {
		alert('你不能使用WebGL')
		return false;
	}
	// setup a GLSL program
	let program = createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
	gl.useProgram(program);
	
	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	
	// create a buffer and put a single clipspace rectangle in
	// it (2 triangles)
	
	let buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
					-1.0, -1.0,
					1.0, -1.0,
					-1.0,  1.0,
					-1.0,  1.0,
					1.0, -1.0,
					1.0,  1.0
			]),
			gl.STATIC_DRAW
	);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	
	// draw
	gl.drawArrays(gl.TRIANGLES, 0, 6);
		
}

draw();

