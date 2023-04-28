//https://medium.com/@jamischarles/what-is-debouncing-2505c0648ff1
//We use debouncing to do a quick pinch click interaction
//We wait for a few milliseconds before "clicking" / pinching
//This helps with noisy input, like losing tracking of the fingers

let handpose;
let video;
let predictions = [];
let pinchTimeout;
let pinchStarted = false;
let randColor;
const timeToWait = 400;//400 millis, keep it small but not to small

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  randColor = pickRandomColor();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  doPinch();

  //L1
  fill(randColor);
  noStroke();
    // Face
  ellipse(110, 110, 200, 200); 
  // Eyes
  fill(0); 
  stroke(0); 
  strokeWeight(5); 
  line(60, 90, 80, 90); // L
  line(140, 90, 160, 90); // R
  // Mouth
  noFill(); 
  stroke(0); 
  strokeWeight(5); 
  arc(110, 130, 100, 80, 0, PI);

  //L2
  fill(randColor);
  noStroke();
    //Face
  ellipse(110, 370, 200, 200); 
  // Eyes
  fill(0); 
  stroke(0); 
  strokeWeight(5); 
  line(60, 350, 80, 350); // L
  line(140, 350, 160, 350); //R
  //Mouth
  noFill(); 
  stroke(0); 
  strokeWeight(5); 
  arc(110, 390, 100, 80, 0, PI); 

  //R1
  fill(randColor);
  noStroke();
  //Face
  ellipse(530, 110, 200, 200);
  //Eyes
  fill(0); 
  stroke(0); 
  strokeWeight(5); 
  line(480, 90, 500, 90); // L
  line(560, 90, 580, 90); // R
  //Mouth
  noFill(); 
  stroke(0); 
  strokeWeight(5); 
  arc(530, 130, 100, 80, 0, PI); 

  //R2
  fill(randColor);
  noStroke();
  //Face
  ellipse(530, 370, 200, 200); 
  // Eyes
  fill(0); 
  stroke(0); 
  strokeWeight(5); 
  line(480, 350, 500, 350); // L
  line(560, 350, 580, 350); // R
  // Mouth
  noFill(); 
  stroke(0); 
  strokeWeight(5); 
  arc(530, 390, 100, 80, 0, PI);
}

//draw pinch
function doPinch() {
  if(predictions.length > 0){
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];
      //get our thumb and index finger
      const indexF = prediction.annotations.indexFinger[3];
      const thumb = prediction.annotations.thumb[3];

      //draw top of thumb and index finger circle
      fill(255, 255, 0);
      noStroke();
      ellipse(indexF[0], indexF[1], 10, 10);
      fill(255, 0, 0);
      ellipse(thumb[0], thumb[1], 10, 10);

      //each digit is represented by an array of 4 sets of xyz coordinates, e.g.
      //x -> thumb[0]
      //y -> thumb[1]
      //z -> thumb[2]
      //get distance between x & y coordinates of thumb & finger
      let pinchDist = dist(thumb[0], thumb[1],indexF[0], indexF[1]);
      //the z position from camera is a bit noisy, but this scales the distance to check against by z pos
      let zOffset = map(thumb[2],20,-50,20,100);
      //console.log(zOffset,thumb[2] );

      if( pinchDist < zOffset){
        pinchStarted = true;
        if(pinchTimeout) clearTimeout(pinchTimeout);
        
        // draw pinch debug circle
        fill(0, 0, 255);
        ellipse(thumb[0], thumb[1], 20, 20);
      }else if(pinchStarted){
        pinchStarted = false;
        
        //start pinch timeout on release of fingers
        pinchTimeout = window.setTimeout(pinch,timeToWait);
        console.log("click");
      }
    }

  }else{
    //clear our click if we lose tracking of hand
    pinchStarted = false;
    if(pinchTimeout) clearTimeout(pinchTimeout);
  }
}

function pinch(){
  //do something more interesting here

  randColor = pickRandomColor();


}

function pickRandomColor(){
  let c = color(random(255),random(255),random(255));
  return c;
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}
