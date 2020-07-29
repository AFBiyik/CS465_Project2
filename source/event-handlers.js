var frameTime = 0;
var startAnimation = false;
var timeRange;
var timeLabel;
var keyFramesSelect;
var selectedFrame = null;

function moveTimeRange(timeMilis){

    var minutes = Math.floor(timeMilis / 60000);
    var seconds = Math.floor((timeMilis % 60000) / 1000);
    var milis = Math.floor( timeMilis % 1000);

    timeLabel.value =  minutes + ":" + (seconds < 10 ? '0' : '') + seconds + ":" + milis;

    timeRange.value = timeMilis;
}

function updateKeyFramesSelect() {

    var options = "";

    function getOption(keyFrame, value){
        return "<option value='" + i + "'>" + keyFrame.timeStamp + "</option>";
    }

    for (var i = 0; i < currentAnimation.keyframes.length; i++){
        options += getOption( currentAnimation.keyframes[i] );
    }

    keyFramesSelect.innerHTML = options;

    
}

function adjustSliders(keyframe){
    var ids = [
        bodyId,
        neckId,
        headId,
        frontUpLeftId,
        frontDownLeftId,
        frontUpRightId,
        frontDownRightId,
        backUpLeftId,
        backDownLeftId,
        backUpRightId,
        backDownRightId,
        tail_1Id,
        tail_2Id,
        tail_3Id,
        tail_4Id
    ];

    var p = [
        "bodyRotationP",
        "neckRotationP",
        "headRotationP",
        "FLUP",
        "FLBP",
        "FRUP",
        "FRBP",
        "BLUP",
        "BLBP",
        "BRUP",
        "BRBP",
        "tail_1P",
        "tail_2P",
        "tail_3P",
        "tail_4P"
    ];
    var pLabels = [
        "bodyRotationPLabel",
        "neckRotationPLabel",
        "headRotationPLabel",
        "FLUPLabel",
        "FLBPLabel",
        "FRUPLabel",
        "FRBPLabel",
        "BLUPLabel",
        "BLBPLabel",
        "BRUPLabel",
        "BRBPLabel",
        "tail_1PLabel",
        "tail_2PLabel",
        "tail_3PLabel",
        "tail_4PLabel"
    ];
    var y = [
        "bodyRotationY",
        "neckRotationY",
        "headRotationY",
        "FLUY",
        "FLBY",
        "FRUY",
        "FRBY",
        "BLUY",
        "BLBY",
        "BRUY",
        "BRBY",
        "tail_1Y",
        "tail_2Y",
        "tail_3Y",
        "tail_4Y"
    ];
    var yLabels = [
        "bodyRotationYLabel",
        "neckRotationYLabel",
        "headRotationYLabel",
        "FLUYLabel",
        "FLBYLabel",
        "FRUYLabel",
        "FRBYLabel",
        "BLUYLabel",
        "BLBYLabel",
        "BRUYLabel",
        "BRBYLabel",
        "tail_1YLabel",
        "tail_2YLabel",
        "tail_3YLabel",
        "tail_4YLabel"
    ];
    var r = [
        "bodyRotationR",
        "neckRotationR",
        "headRotationR",
        "FLUR",
        "FLBR",
        "FRUR",
        "FRBR",
        "BLUR",
        "BLBR",
        "BRUR",
        "BRBR",
        "tail_1R",
        "tail_2R",
        "tail_3R",
        "tail_4R"
    ];
    var rLabels = [
        "bodyRotationRLabel",
        "neckRotationRLabel",
        "headRotationRLabel",
        "FLURLabel",
        "FLBRLabel",
        "FRURLabel",
        "FRBRLabel",
        "BLURLabel",
        "BLBRLabel",
        "BRURLabel",
        "BRBRLabel",
        "tail_1RLabel",
        "tail_2RLabel",
        "tail_3RLabel",
        "tail_4RLabel"
    ];
    var jtArray = keyframe.jointTransforms;
    document.getElementById("bodyTransformX").value = jtArray[0].translation.x;
    document.getElementById("bodyTransformY").value = jtArray[0].translation.y;
    document.getElementById("bodyTransformZ").value = jtArray[0].translation.z;
    for(var i = 0; i < jtArray.length; i++){
        if(i >= 0 && i <= 2){
            document.getElementById(p[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.pitch));
            document.getElementById(pLabels[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.pitch));
            document.getElementById(y[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.yaw));
            document.getElementById(yLabels[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.yaw));
        }
        if(i >= 11 && i <= 14){
            document.getElementById(y[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.yaw));
            document.getElementById(yLabels[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.yaw));
        }
        document.getElementById(r[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.roll));
        document.getElementById(rLabels[i]).value = Math.floor(radians2Degrees(jtArray[i].rotation.roll));

    }
}


function setEventHandlers(){

    var ids = [
        bodyId,
        neckId,
        headId,
        frontUpLeftId,
        frontDownLeftId,
        frontUpRightId,
        frontDownRightId,
        backUpLeftId,
        backDownLeftId,
        backUpRightId,
        backDownRightId,
        tail_1Id,
        tail_2Id,
        tail_3Id,
        tail_4Id
    ];

    var p = [
        "bodyRotationP",
        "neckRotationP",
        "headRotationP",
        "FLUP",
        "FLBP",
        "FRUP",
        "FRBP",
        "BLUP",
        "BLBP",
        "BRUP",
        "BRBP",
        "tail_1P",
        "tail_2P",
        "tail_3P",
        "tail_4P"
    ];
    var pLabels = [
        "bodyRotationPLabel",
        "neckRotationPLabel",
        "headRotationPLabel",
        "FLUPLabel",
        "FLBPLabel",
        "FRUPLabel",
        "FRBPLabel",
        "BLUPLabel",
        "BLBPLabel",
        "BRUPLabel",
        "BRBPLabel",
        "tail_1PLabel",
        "tail_2PLabel",
        "tail_3PLabel",
        "tail_4PLabel"
    ];
    var y = [
        "bodyRotationY",
        "neckRotationY",
        "headRotationY",
        "FLUY",
        "FLBY",
        "FRUY",
        "FRBY",
        "BLUY",
        "BLBY",
        "BRUY",
        "BRBY",
        "tail_1Y",
        "tail_2Y",
        "tail_3Y",
        "tail_4Y"
    ];
    var yLabels = [
        "bodyRotationYLabel",
        "neckRotationYLabel",
        "headRotationYLabel",
        "FLUYLabel",
        "FLBYLabel",
        "FRUYLabel",
        "FRBYLabel",
        "BLUYLabel",
        "BLBYLabel",
        "BRUYLabel",
        "BRBYLabel",
        "tail_1YLabel",
        "tail_2YLabel",
        "tail_3YLabel",
        "tail_4YLabel"
    ];
    var r = [
        "bodyRotationR",
        "neckRotationR",
        "headRotationR",
        "FLUR",
        "FLBR",
        "FRUR",
        "FRBR",
        "BLUR",
        "BLBR",
        "BRUR",
        "BRBR",
        "tail_1R",
        "tail_2R",
        "tail_3R",
        "tail_4R"
    ];
    var rLabels = [
        "bodyRotationRLabel",
        "neckRotationRLabel",
        "headRotationRLabel",
        "FLURLabel",
        "FLBRLabel",
        "FRURLabel",
        "FRBRLabel",
        "BLURLabel",
        "BLBRLabel",
        "BRURLabel",
        "BRBRLabel",
        "tail_1RLabel",
        "tail_2RLabel",
        "tail_3RLabel",
        "tail_4RLabel"
    ];
    keyFramesSelect = document.getElementById("keyFramesSelect");
    keyFramesSelect.onchange = function(){

        selectedFrame = this.selectedIndex;

        if (!startAnimation) {
            var timeVal = currentAnimation.keyframes[selectedFrame].timeStamp;
            moveTimeRange(timeVal);
            adjustSliders(currentAnimation.keyframes[selectedFrame]);
            frameTime = timeVal;

            animate(currentAnimation, frameTime);
        }
    };

    document.getElementById("animate").onclick = function(){

        if (currentAnimation.keyframes.length > 1){
            startAnimation = !startAnimation;
            this.value = startAnimation ? "Stop Animation": "Start Animation";
            animTime = 0;
            timeRange.max = startAnimation ? currentAnimation.keyframes[currentAnimation.keyframes.length - 1].timeStamp : 60000;
        }
    };

    document.getElementById("addKeyFrame").onclick = function(){
        if (currentAnimation.keyframes.length < 1){
            timeRange.disabled = false;
        }

        var keyFrame = createKeyFrame(frameTime);
        currentAnimation.addKeyFrame(keyFrame);

        updateKeyFramesSelect();
    };

    document.getElementById("deleteKeyFrame").onclick = function(){

        if (selectedFrame != null && selectedFrame !== 0){
            currentAnimation.keyframes.splice(selectedFrame,1);
        }

        updateKeyFramesSelect();
    };

    timeRange = document.getElementById("time");
    timeLabel = document.getElementById("timeLabel");
    timeRange.oninput = function(){

        if (!startAnimation){
            moveTimeRange(this.value)

            frameTime = this.value
        }

    };


     document.getElementById("bodyTransformX")
.oninput = function(){
        document.getElementById("bodyTransformXLabel").value = this.value;

        var translation = nodes[0].translation;
        nodes[0].translation = new XYZ( parseInt(this.value), translation.y, translation.z);
    };


     document.getElementById("bodyTransformY")
.oninput = function(){
        document.getElementById("bodyTransformYLabel").value = this.value;

        var translation = nodes[0].translation;
        nodes[0].translation = new XYZ( translation.x, parseInt(this.value), translation.z);
    };

    document.getElementById("bodyTransformZ")
.oninput = function(){
        document.getElementById("bodyTransformZLabel").value = this.value;

        var translation = nodes[0].translation;
        nodes[0].translation = new XYZ( translation.x, translation.y, parseInt(this.value));

        console.log(nodes[0]);
    };

    document.getElementById(p[0])
.oninput = function(){
        document.getElementById(pLabels[0]).value = this.value;
        rotatePitch(ids[0], parseInt(this.value));
    };

    document.getElementById(y[0])
.oninput = function(){
        document.getElementById(yLabels[0]).value = this.value;
        rotateYaw(ids[0], parseInt(this.value));
    };

    document.getElementById(r[0])
.oninput = function(){
        document.getElementById(rLabels[0]).value = this.value;
        rotateRoll(ids[0], parseInt(this.value));
    };

    document.getElementById(p[1])
.oninput = function(){
        document.getElementById(pLabels[1]).value = this.value;
        rotatePitch(ids[1], parseInt(this.value));
    };

    document.getElementById(y[1])
.oninput = function(){
        document.getElementById(yLabels[1]).value = this.value;
        rotateYaw(ids[1], parseInt(this.value));
    };

    document.getElementById(r[1])
.oninput = function(){
        document.getElementById(rLabels[1]).value = this.value;
        rotateRoll(ids[1], parseInt(this.value));
    };

    document.getElementById(p[2])
.oninput = function(){
        document.getElementById(pLabels[2]).value = this.value;
        rotatePitch(ids[2], parseInt(this.value));
    };

    document.getElementById(y[2])
.oninput = function(){
        document.getElementById(yLabels[2]).value = this.value;
        rotateYaw(ids[2], parseInt(this.value));
    };

    document.getElementById(r[2])
.oninput = function(){
        document.getElementById(rLabels[2]).value = this.value;
        rotateRoll(ids[2], parseInt(this.value));
    };

    document.getElementById(r[3])
.oninput = function(){
        document.getElementById(rLabels[3]).value = this.value;
        rotateRoll(ids[3], parseInt(this.value));
    };

    document.getElementById(r[4])
.oninput = function(){
        document.getElementById(rLabels[4]).value = this.value;
        rotateRoll(ids[4], parseInt(this.value));
    };

    document.getElementById(r[5])
.oninput = function(){
        document.getElementById(rLabels[5]).value = this.value;
        rotateRoll(ids[5], parseInt(this.value));
    };

    document.getElementById(r[6])
.oninput = function(){
        document.getElementById(rLabels[6]).value = this.value;
        rotateRoll(ids[6], parseInt(this.value));
    };

    document.getElementById(r[7])
.oninput = function(){
        document.getElementById(rLabels[7]).value = this.value;
        rotateRoll(ids[7], parseInt(this.value));
    };

    document.getElementById(r[8])
.oninput = function(){
        document.getElementById(rLabels[8]).value = this.value;
        rotateRoll(ids[8], parseInt(this.value));
    };

    document.getElementById(r[9])
.oninput = function(){
        document.getElementById(rLabels[9]).value = this.value;
        rotateRoll(ids[9], parseInt(this.value));
    };

    document.getElementById(r[10])
.oninput = function(){
        document.getElementById(rLabels[10]).value = this.value;
        rotateRoll(ids[10], parseInt(this.value));
    };

    document.getElementById(y[11])
.oninput = function(){
        document.getElementById(yLabels[11]).value = this.value;
        rotateYaw(ids[11], parseInt(this.value));
    };

    document.getElementById(r[11])
.oninput = function(){
        document.getElementById(rLabels[11]).value = this.value;
        rotateRoll(ids[11], parseInt(this.value));
    };

    document.getElementById(y[12])
.oninput = function(){
        document.getElementById(yLabels[12]).value = this.value;
        rotateYaw(ids[12], parseInt(this.value));
    };

    document.getElementById(r[12])
.oninput = function(){
        document.getElementById(rLabels[12]).value = this.value;
        rotateRoll(ids[12], parseInt(this.value));
    };

    document.getElementById(y[13])
.oninput = function(){
        document.getElementById(yLabels[13]).value = this.value;
        rotateYaw(ids[13], parseInt(this.value));
    };

    document.getElementById(r[13])
.oninput = function(){
        document.getElementById(rLabels[13]).value = this.value;
        rotateRoll(ids[13], parseInt(this.value));
    };

    document.getElementById(y[14])
.oninput = function(){
        document.getElementById(yLabels[14]).value = this.value;
        rotateYaw(ids[14], parseInt(this.value));
    };

    document.getElementById(r[14])
.oninput = function(){
        document.getElementById(rLabels[14]).value = this.value;
        rotateRoll(ids[14], parseInt(this.value));
    };

    document.getElementById("saveAnimation").onclick = function(){
        var saveObject = currentAnimation.keyframes;
        var data = JSON.stringify(saveObject);
        var a = document.createElement("a");
        var file = new Blob([data], {type:"application/json"});
        a.href = URL.createObjectURL(file);
        a.download = "animation.json";
        a.click();
    };
    document.getElementById("loadAnimation").onchange = function(){
        var file = document.getElementById("loadAnimation").files[0];
        var reader = new FileReader();
        reader.onload = function(e){
            startAnimation = false;
            this.value =  "Start Animation";
            animTime = 0;
            timeRange.max = 60000;

            currentAnimation.keyframes = JSON.parse(e.target.result);
            //document.getElementById("loadAnimation").value = "";
            // Reset to no file

            updateKeyFramesSelect();

            var timeVal = currentAnimation.keyframes[0].timeStamp;
            moveTimeRange(timeVal);
            adjustSliders(currentAnimation.keyframes[0]);
            frameTime = timeVal;

            animate(currentAnimation, frameTime);
        };
        reader.readAsText(file);

        this.value = this.defaultValue;
    };
}

function rotatePitch(id, value) {
    var rotation = nodes[id].rotation;
    nodes[id].rotation = new RotationRadians( degrees2Radians( value ), rotation.yaw, rotation.roll);
}

function rotateYaw(id, value) {
    var rotation = nodes[id].rotation;
    nodes[id].rotation = new RotationRadians( rotation.pitch, degrees2Radians( value ), rotation.roll);
}

function rotateRoll(id, value) {
    var rotation = nodes[id].rotation;
    nodes[id].rotation = new RotationRadians( rotation.pitch, rotation.yaw, degrees2Radians( value ));
}