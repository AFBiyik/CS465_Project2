var catProgram;
var modelViewMatrixLocation;
var projectionMatrixLocation;
var vPosition;
var vNormal;

var bodyId;
var neckId;
var headId;
var backUpLeftId;
var backUpRightId;
var backDownLeftId;
var backDownRightId;
var frontUpLeftId;
var frontUpRightId;
var frontDownLeftId;
var frontDownRightId;
var tail_1Id;
var tail_2Id;
var tail_3Id;
var tail_4Id;

var bodyMesh;
var neckMesh;
var headMesh;
var backUpLeftMesh;
var backUpRightMesh;
var backDownLeftMesh;
var backDownRightMesh;
var frontUpLeftMesh;
var frontUpRightMesh;
var frontDownLeftMesh;
var frontDownRightMesh;
var tail_1Mesh;
var tail_2Mesh;
var tail_3Mesh;
var tail_4Mesh;

var catMaterial = {
    materialAmbient : vec4( 0.5, 0.5, 0.5, 1.0 ),
    materialDiffuse : vec4( 0.9, 0.9, 0.9, 1.0 ),
    materialSpecular : vec4( 0.1, 0.1, 0.1, 1.0 ),
    materialShininess : 2000.0
};

function createCat(program ){

    catProgram = program;

    setTimeout( loadMeshes);
    setTimeout( initNodes, 800);

    setLocations();
    setMaterialProperties(light);

}

function setLocations() {

    modelViewMatrixLocation = gl.getUniformLocation(catProgram, "modelViewMatrix");
    projectionMatrixLocation = gl.getUniformLocation(catProgram, "projectionMatrix");
    vPosition = gl.getAttribLocation(catProgram, "vPosition");
    vNormal = gl.getAttribLocation(catProgram, "vNormal");

}

function setMaterialProperties(){

    var ambientProduct;
    var diffuseProduct;
    var specularProduct;

    ambientProduct = mult(light.lightAmbient, catMaterial.materialAmbient);
    diffuseProduct = mult(light.lightDiffuse, catMaterial.materialDiffuse);
    specularProduct = mult(light.lightSpecular, catMaterial.materialSpecular);

    gl.useProgram(catProgram);
    gl.uniform4fv( gl.getUniformLocation(catProgram, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(catProgram, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(catProgram, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(catProgram, "lightPosition"),flatten(light.lightPosition) );
    gl.uniform3fv( gl.getUniformLocation(catProgram, "eyePosition"),flatten(eyePosition) );
    gl.uniform1f( gl.getUniformLocation(catProgram, "shininess"), catMaterial.materialShininess );
}

async function loadMeshes(){
    bodyMesh = new Mesh("../source/Cat/body.obj" );
    neckMesh = new Mesh("../source/Cat/neck.obj" );
    headMesh = new Mesh("../source/Cat/head.obj" );

    frontUpLeftMesh = new Mesh("../source/Cat/frontUpLeft.obj" );
    frontDownLeftMesh = new Mesh("../source/Cat/frontDownLeft.obj" );
    frontUpRightMesh = new Mesh("../source/Cat/frontUpRight.obj" );
    frontDownRightMesh = new Mesh("../source/Cat/frontDownRight.obj" );

    backUpLeftMesh = new Mesh("../source/Cat/backUpLeft.obj" );
    backDownLeftMesh = new Mesh("../source/Cat/backDownLeft.obj" );
    backUpRightMesh = new Mesh("../source/Cat/backUpRight.obj" );
    backDownRightMesh = new Mesh("../source/Cat/backDownRight.obj" );

    tail_1Mesh = new Mesh("../source/Cat/tail_1.obj" );
    tail_2Mesh = new Mesh("../source/Cat/tail_2.obj" );
    tail_3Mesh = new Mesh("../source/Cat/tail_3.obj" );
    tail_4Mesh = new Mesh("../source/Cat/tail_4.obj" );
}

async function initNodes() {
    // body neck head
    bodyId = new ObjectNode( bodyMesh , new XYZ(-0.7406,20.7269,0)).id;
    neckId = new ObjectNode( neckMesh, new XYZ(14.2805,22.6944,0), bodyId).id;
    headId = new ObjectNode( headMesh, new XYZ(17.6959,24.5213,0), neckId).id;

    // legs
    // front
    frontUpLeftId = new ObjectNode( frontUpLeftMesh, new XYZ(8.6804,13.9267,-5.1191), bodyId).id;
    frontDownLeftId = new ObjectNode( frontDownLeftMesh, new XYZ(7.8331,5.1092,-2.2987), frontUpLeftId).id;
    frontUpRightId = new ObjectNode( frontUpRightMesh, new XYZ(8.6804,13.9267,5.1191), bodyId).id;
    frontDownRightId = new ObjectNode( frontDownRightMesh, new XYZ(7.8331,5.1092,2.2987), frontUpRightId).id;

    // back
    backUpLeftId = new ObjectNode( backUpLeftMesh, new XYZ(-13.0013,14.4333,-5.0818), bodyId).id;
    backDownLeftId = new ObjectNode( backDownLeftMesh, new XYZ(-15.5735,7.1422,-3.2271), backUpLeftId).id;
    backUpRightId = new ObjectNode( backUpRightMesh, new XYZ(-13.0013,14.4333,5.0818), bodyId).id;
    backDownRightId = new ObjectNode( backDownRightMesh, new XYZ(-15.5735,7.1422,-3.2271), backUpRightId).id;

    // tails
    tail_1Id = new ObjectNode( tail_1Mesh, new XYZ(-19.1835,23.9008,0), bodyId).id;
    tail_2Id = new ObjectNode( tail_2Mesh, new XYZ(-25.6679,23.6486,0), tail_1Id).id;
    tail_3Id = new ObjectNode( tail_3Mesh, new XYZ(-34.0714,23.1722,0), tail_2Id).id;
    tail_4Id = new ObjectNode( tail_4Mesh, new XYZ(-40.6427,23.2205,0), tail_3Id).id;

    setEventHandlers();

    window.requestAnimationFrame(render);
}

function renderCat(deltaTime) {
    // nodes

    gl.useProgram(catProgram);

    if (startAnimation && currentAnimation.keyframes.length > 0) {
        animTime += deltaTime;

        if (currentAnimation.keyframes[currentAnimation.keyframes.length - 1].timeStamp < animTime){
            animTime = 0;
        }

        animate(currentAnimation, animTime);
        moveTimeRange(animTime);
    }

    traverse(bodyId);
}





