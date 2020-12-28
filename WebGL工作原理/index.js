"use strict"
// Get A WebGL context

function main() {
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl");

    if (!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    var martrixLocation = gl.getUniformLocation(program, "u_matrix");

    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setGeometry(gl);

    var translation = [200, 150];
    var angleInRadians = 0;
    var scale = [1, 1];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width});
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height });
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        }
    }

    function updateAngle(event, ui) {
        var angleDegrees = 360 - ui.value;
        angleInRadians = angleDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset
        );

        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);

        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        gl.uniformMatrix3fv(martrixLocation, false, matrix);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}

function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, -100,
            150, 125,
            -175, 100
        ]),
        gl.STATIC_DRAW
    )
}

main();




