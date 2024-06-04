let video, bodypose, pose, keypoint, detector;
let poses = [];
let earOffset = 0;
let wristOffset = 0;
const earSpeed = 2; // 移動速度
const wristSpeed = 2; // 移動速度

function preload() {
  carImg = loadImage("car.gif");
}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];
    let leftWrist = pose.keypoints[9];
    let rightWrist = pose.keypoints[10];

    // 繪製左右耳朵上的 GIF 並從左向右移動
    if (leftEar.score > 0.1) {
      image(carImg, leftEar.x + earOffset, leftEar.y - 25, 50, 50);
         push()
      textSize(40)
      scale(-1,1)
      text("41273045,林昱睿",partA.x-width,partA.y-100)
     pop()
         
    }
    if (rightEar.score > 0.1) {
      image(carImg, rightEar.x + earOffset, rightEar.y - 25, 50, 50);
    }

    // 更新耳朵的偏移量
    earOffset += earSpeed;
    if (earOffset > width) {
      earOffset = -50; // 重置偏移量，讓 GIF 從左邊重新開始
    }

    // 繪製左右手腕上的 GIF 並從右向左移動
    if (leftWrist.score > 0.1) {
      image(carImg, leftWrist.x - wristOffset, leftWrist.y, 50, 50);
    }
    if (rightWrist.score > 0.1) {
      image(carImg, rightWrist.x - wristOffset, rightWrist.y, 50, 50);
    }

    // 更新手腕的偏移量
    wristOffset += wristSpeed;
    if (wristOffset > width) {
      wristOffset = -50; // 重置偏移量，讓 GIF 從右邊重新開始
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left knee
  14 right knee
  15 left foot
  16 right foot
*/
