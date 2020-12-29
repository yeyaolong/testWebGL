"use strict"

function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);    // 6组位置数据

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl); // 6组颜色数据

    var translation = [200, 150];
    var angleInRadians = 0;
    var scale = [1, 1];


    drawScene();

    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width});
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {value: angleInRadians, slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        }
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        // 位置放到ARRAY_BUFFER;
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);


        // 颜色放到ARRAY_BUFFER
        gl.enableVertexAttribArray(colorLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        var size = 4;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);

    }

    
}

function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -150, -100,
            150, -100,
            -150, 100,
            150, -100,
            -150, 100,
            150, 100
        ]),
        gl.STATIC_DRAW
    );
}

function setColors(gl) {
    var r1 = Math.random();
    var b1 = Math.random();
    var g1 = Math.random();

    var r2 = Math.random();
    var b2 = Math.random();
    var g2 = Math.random();

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
            [
                r1, b1, g1, 1,
                r1, b1, g1, 1,
                r1, b1, g1, 1,
                r2, b2, g2, 1,
                r2, b2, g2, 1,
                r2, b2, g2, 1
            ]
        ),
        gl.STATIC_DRAW
    );
}

main();