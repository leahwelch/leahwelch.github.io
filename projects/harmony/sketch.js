var wave;
var button;
var slider;
var playing;
var env;

function setup() {

    cnv = createCanvas(800, 600);
    cnv.position(100,100);
    cnv.parent('sketch-holder');

    getAudioContext().suspend();
    env = new p5.Envelope();

    // env.setADSR(0.001,0.2, 0.2, 0.2);
    // env.setADSR(0.823,1.6, 0.2, 1.34);
    env.setADSR(0.05,0.2, 0.2, 0.5);
    env.setRange(0.5, 0);

    wave = new p5.Oscillator();
    wave.setType('sine');
    
    wave.amp(env);
    wave.freq(220);
    wave.start();

    button = createButton('play/pause');
    button.mousePressed(toggle);

    // slider = createSlider(100,1200,440);

    
}

function draw() {

  // wave.freq(slider.value())
  if(playing) {
    background(255,0,255);
  } else {
    background(51);
  }
}

function toggle() {
  userStartAudio();
  env.play();
  
  // if(!playing) {
  //   playing = true;
  //   wave.amp(0.5,1);
  //   userStartAudio();
    
  // } else {
  //   playing = false;
    
  //   getAudioContext().suspend();
  //   wave.amp(0.0,1);
    
  // }
}

