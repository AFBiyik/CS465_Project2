var currentAnimation = new animation([]);
var animTime = 0;

function animation(keyframes){

    this.keyframes = keyframes;

    this.sortKeyFrames = function(){
        keyframes.sort( function (a, b) {
            return a.timeStamp - b.timeStamp;
        });
    };

    this.addKeyFrame = function (keyFrame) {

        var result = this.keyframes.findIndex(function (k) {
            return k.timeStamp === keyFrame.timeStamp;
        });

        if (result < 0) {
            this.keyframes.push(keyFrame);
        }
        else {
            this.keyframes[result] = keyFrame;
        }

        this.sortKeyFrames();
    }
}

function keyframe(jointTransforms, timeStamp){
    this.timeStamp = timeStamp;
    this.jointTransforms = jointTransforms;
}

function jointTransform(nodeID, rotation, translation){
    this.nodeID = nodeID;
    this.rotation = rotation;
    this.translation = translation;
}


function animate(animation ,realTimeStamp){
    var timeStamp = realTimeStamp;
    var frame = getFrame(animation, timeStamp);
    for(i = 0; i < frame.jointTransforms.length; i++){
        nodes[frame.jointTransforms[i].nodeID].rotation = frame.jointTransforms[i].rotation;
        nodes[frame.jointTransforms[i].nodeID].translation = frame.jointTransforms[i].translation;
    }
}

function getFrame(animation, timeStamp){
    for( i = 0; i < animation.keyframes.length; i++){
        if(animation.keyframes[i].timeStamp === timeStamp)
            return animation.keyframes[i];
        else if(animation.keyframes[i].timeStamp > timeStamp){
            if(i == 0)
                return animation.keyframes[i];
            return interpolate(timeStamp, animation.keyframes[i-1], animation.keyframes[i]);
        }
    }
}

function interpolate(timeStamp, prevKeyframe, nextKeyframe){
    var timeBetweenKeyframes = nextKeyframe.timeStamp-prevKeyframe.timeStamp
    var dTimePrev = (timeStamp-prevKeyframe.timeStamp);
    var dTimeNext = (nextKeyframe.timeStamp-timeStamp);
    var prevConst = dTimePrev/timeBetweenKeyframes;
    var nextConst = dTimeNext/timeBetweenKeyframes;
    var jointTransforms = [];
    for(i = 0; i < prevKeyframe.jointTransforms.length; i++){
        var tx = nextConst * prevKeyframe.jointTransforms[i].translation.x + prevConst * nextKeyframe.jointTransforms[i].translation.x;
        var ty = nextConst * prevKeyframe.jointTransforms[i].translation.y + prevConst * nextKeyframe.jointTransforms[i].translation.y;
        var tz = nextConst * prevKeyframe.jointTransforms[i].translation.z + prevConst * nextKeyframe.jointTransforms[i].translation.z;
        var rx = nextConst * prevKeyframe.jointTransforms[i].rotation.pitch + prevConst * nextKeyframe.jointTransforms[i].rotation.pitch;
        var ry = nextConst * prevKeyframe.jointTransforms[i].rotation.yaw + prevConst * nextKeyframe.jointTransforms[i].rotation.yaw;
        var rz = nextConst * prevKeyframe.jointTransforms[i].rotation.roll + prevConst * nextKeyframe.jointTransforms[i].rotation.roll;
        jointTransforms.push(new jointTransform(prevKeyframe.jointTransforms[i].nodeID, new RotationRadians(rx,ry,rz), new XYZ(tx, ty, tz)));
    }
    return new keyframe(jointTransforms, timeStamp);
}

function createKeyFrame(timeStamp) {
    var jointTransforms = [];

    for (var i = 0; i < nodes.length; i++){
        jointTransforms.push( new jointTransform(i, nodes[i].rotation, nodes[i].translation) );
    }

    return new keyframe(jointTransforms, timeStamp);

}