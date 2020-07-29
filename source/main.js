var gl;
var gridProgram;

var viewMatrix;
var projectionMatrix;

var gridViewProjectionMatrixLocation;

var eyePosition = vec3(0,25,-100);

var lastTime = 0;

var light = {
    lightPosition : vec4(20.0, 20.0, 40.0, 0.0 ),
    lightAmbient : vec4(0.5, 0.3, 0.3, 1.0 ),
    lightDiffuse : vec4( 1.0, 0.6, 0.6, 1.0 ),
    lightSpecular : vec4( 1.0, 0.6, 0.6, 1.0 )
};


// Grid lines
var lines = (function () {
    var l = [];
    for (var i = 0; i < 60; i++){
        l.push(vec4(-600+i*20,0,-600));
        l.push(vec4(-600+i*20,0,600));
    }

    for (i = 0; i < 60; i++){
        l.push(vec4(-600,0,-600+i*20));
        l.push(vec4(600,0,-600+i*20));
    }
    return l;
})();

/**
 * Init function
 */
window.onload = function init() {

    // Configure WebGL
    let canvas = document.getElementById("canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    projectionMatrix = perspective(60, 1, 1 , 600);
    viewMatrix = lookAt( eyePosition, vec3(0,0,0), vec3(0,1,0)); // TODO we can control camera position

    gridProgram = initShaders(gl, "grid-vertex-shader", "grid-fragment-shader");
    gridViewProjectionMatrixLocation = gl.getUniformLocation(gridProgram, "viewProjectionMatrix");

    var catProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    createCat(catProgram);

};

function render(timeStamp){
    gl.useProgram(gridProgram);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    renderGrid();

    renderCat(timeStamp- lastTime);
    lastTime = timeStamp;

    window.requestAnimationFrame(render);
}

function renderGrid() {

    var viewProjectionMatrix = mult(projectionMatrix,viewMatrix);
    // Perspective grid
    gl.uniformMatrix4fv( gridViewProjectionMatrixLocation, false, flatten(viewProjectionMatrix));

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( catProgram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawArrays(gl.LINES, 0, lines.length);
}


