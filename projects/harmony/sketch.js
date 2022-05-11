var wave;
var button;
var playing;

function setup() {

    cnv = createCanvas(800, 600);
    cnv.position(100,100);
    cnv.parent('sketch-holder');

    getAudioContext().suspend();

    wave = new p5.Oscillator();
    wave.setType('sine');
    wave.start();
    wave.amp(0.5);
    wave.freq(440);

    button = createButton('play/pause');
    button.mousePressed(toggle);

    
}

function draw() {
  if(playing) {
    background(255,0,255);
  } else {
    background(51);
  }
}

function toggle() {
  if(!playing) {
    playing = true;
    userStartAudio();
  } else {
    playing = false;
    getAudioContext().suspend();
  }
}

