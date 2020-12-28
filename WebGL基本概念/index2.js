
/**
 * 创建着色器方法
 * @param {*} gl webgl上下文
 * @param {VERTEX_SHADER | FRAGMENT_SHADER} type 类型 顶点着色器 片段着色器
 * @param {*} source 着色器数据(代码)源
 */
function createShader(gl, type, source) {
	let shader = gl.createShader(type); // 创建着色器对象
	gl.shaderSource(shader, source);	// 提供数据源
	gl.compileShader(shader); // 编译 -> 生成着色器
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	// 创建失败 删除着色器对象
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);

}


/**
 * 将两个着色器 link到 一个program (着色器)
 * @param {*} gl 
 * @param {*} vertexShader 顶点着色器
 * @param {*} fragmentShader 片段着色器
 */
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}





function main() {
	let canvas = document.getElementById("canvas");
	let gl = canvas.getContext("experimental-webgl");

  if (!gl) {
    return;
	}

	let vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
	let fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);  // 一个顶点着色器
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);  // 一个片段着色器
	
	let program = createProgram(gl, vertexShader, fragmentShader); // 创建着色程序

	let positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // 获取属性 attribute
	// 创建一个缓存
	let positionBuffer = gl.createBuffer();
	// 将这个缓存绑定到 gl.ARRAY_BUFFER 上
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// 创建数据，并把数据放到 gl.ARRAY_BUFFER 里.这样，WebGL就能从指定缓存中拿数据
	let positions = [
			0, 0,
			0, 0.5,
			0.7, 0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	/***********************************渲染程序开始**********************************/
	/**
 		* 传递当前画布尺寸
 		*/
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // 将裁剪空间 gl_Position对应到画布像素坐标
	
	// 清空画布
	gl.clearColor(0, 0, 0, 0) // r, g, b, alpha
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program); // 告诉它用我们之前写好的着色器

	gl.enableVertexAttribArray(positionAttributeLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// 告诉属性怎么从positionBuffer中读取数据(实际是从ARRAY_BUFFER中读取数据,只不过上面代码gl.bindBuffer是将positionBuffer与ARRAY_BUFFER绑定了.)
	let size = 2;	// 每次迭代运行提取两个单位数据(作为a_position.x, a_position.y)
	let type = gl.FLOAT;	// 每个单位的数据类型是32位浮点型
	let normalize = false; // 不需要归一化数据
	let stride = 0; // 步进值 0 = 移动单位数量 * 每个单位占用内存(sizeof(type))
	let offset = 0;

	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);	// 将属性绑定到当前的ARRAY_BUFFER

	let primitiveType = gl.TRIANGLES;
	let offset2 = 0;
	let count = 3;
	gl.drawArrays(primitiveType, offset2, count);	// 运行三次.

	/***********************************渲染程序结束**********************************/
}

main();








