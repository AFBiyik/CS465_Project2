var nodes = [];
var stack = [];
var modelMatrix = null;

function degrees2Radians(degrees)
{
    return degrees * (Math.PI/180);
}

function radians2Degrees(rads){
    return rads * (180/Math.PI);
}

function Rotation(pitch, yaw, roll) {
    this.pitch = degrees2Radians( pitch);
    this.yaw = degrees2Radians( yaw);
    this.roll = degrees2Radians( roll);
}

function RotationRadians(pitch, yaw, roll) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
}

function XYZ(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function ObjectNode( mesh, pivot = new XYZ(0, 0, 0), parent = null ){
    this.id = nodes.length;
    this.mesh = mesh;
    this.pivot = pivot;
    this.rotation = new Rotation(0 ,0, 0); // TODO do with quaternions
    this.translation = new XYZ(0, 0, 0);
    this.parent = parent;
    this.children = [];

    if (parent != null) {
        nodes[parent].children.push(this.id);
    }

    this.calculateModelMatrix = function() {
        var matrix = mat4();

        if (this.parent != null) {
            matrix = modelMatrix;
        }

        matrix = mult(matrix, translate(this.pivot.x, this.pivot.y, this.pivot.z));
        matrix = mult(matrix, translate(this.translation.x, this.translation.y, this.translation.z));
        matrix = mult(matrix, quaternionToRotationMatrix( calculateQuaternion( this.rotation) ) );
        matrix = mult(matrix, translate(-this.pivot.x, -this.pivot.y, -this.pivot.z));

        return matrix;
    };

    // create buffers
    // vertex positions
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,  this.vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.mesh.vertices), gl.STATIC_DRAW);

    // vertex normals
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.mesh.vertexNormals), gl.STATIC_DRAW);

    this.render = function(){

        var modelViewMatrix = mult(viewMatrix, modelMatrix);

        gl.uniformMatrix4fv( modelViewMatrixLocation, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv( projectionMatrixLocation, false, flatten(projectionMatrix));

        // vertex positions
        gl.bindBuffer( gl.ARRAY_BUFFER,  this.vertexBuffer );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        // vertex normals
        gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuffer );
        gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vNormal );

        gl.drawArrays(gl.TRIANGLES, 0, this.mesh.vertices.length);

    };

    nodes.push(this);
}

function traverse(rootId) {
    stack = [];
    modelMatrix = null;
    traverseRec(rootId);
}

function traverseRec(nodeId) {

    stack.push(modelMatrix);

    modelMatrix = nodes[nodeId].calculateModelMatrix();
    nodes[nodeId].render();

    for (var i = 0; i < nodes[nodeId].children.length; i++){
        traverseRec( nodes[nodeId].children[i] );
        modelMatrix = stack.pop();
    }
}


function calculateQuaternion( rotation )
{
    var pitch = rotation.pitch;
    var yaw = rotation.yaw;
    var roll = rotation.roll;

    // Abbreviations for the various angular functions
    var cr = Math.cos(roll * 0.5);
    var sr = Math.sin(roll * 0.5);
    var cy = Math.cos(yaw * 0.5);
    var sy = Math.sin(yaw * 0.5);
    var cp = Math.cos(pitch * 0.5);
    var sp = Math.sin(pitch * 0.5);

    var q = [];
    q[0] = cr * cy * cp + sr * sy * sp;
    q[1] = cr * cy * sp - sr * sy * cp;
    q[2] = sr * cy * sp + cr * sy * cp;
    q[3] = sr * cy * cp - cr * sy * sp;

    return q;
}

function quaternionToRotationMatrix(q) {
    var R = mat4(
        [q[0]*q[0] + q[1]*q[1] - q[2]*q[2] - q[3]*q[3], 2*( q[1]*q[2] - q[0]*q[3] )                  , 2*( q[0]*q[2] + q[1]*q[3] )                  , 0],
        [2*( q[1]*q[2] + q[0]*q[3] )                  , q[0]*q[0] - q[1]*q[1] + q[2]*q[2] - q[3]*q[3], 2*( q[2]*q[3] - q[0]*q[1] )                  , 0],
        [2*( q[1]*q[3] - q[0]*q[2] )                  , 2*( q[0]*q[1] + q[2]*q[3] )                  , q[0]*q[0] - q[1]*q[1] - q[2]*q[2] + q[3]*q[3], 0],
        [0,0,0,1] );

    return R;
}