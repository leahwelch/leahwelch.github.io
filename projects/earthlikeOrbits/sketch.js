let movers = [];
let sun;
let e;

let cnv;

function centerCanvas() {
  let canvasX = (windowWidth - width) / 2;
  let canvasY;
  cnv.position(canvasX, canvasY);
}

function setup() {
    let canvasX = (windowWidth - width) / 2;
    let canvasY;
    
    cnv = createCanvas(800, 800);
    cnv.position(canvasX, canvasY);
    cnv.parent('sketch-holder');
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let m = random(5, 10);
    movers[i] = new Mover(x, y, m, 220,20,255);
  }
  sun = new Attractor(width / 2 - 100, height / 2, 3000,50, 249, 244, 189);
  e = new Attractor(2*(width/3)-100, height / 2, 1,10, 27, 244, 189);
  background(8,8,45);
}

// function windowResized() {
//     centerCanvas();
//   }

function draw() {
  background(8,8,45);
  sun.show();
  e.show();
  for (let mover of movers) {
    mover.update();
    mover.show();
    sun.attract(mover);
  }
//   if (mouseIsPressed) {
//     attractor.pos.x = mouseX;
//     attractor.pos.y = mouseY;
//   }
  
}

class Attractor {
    constructor(x, y, m,r, c1, c2, c3) {
      this.pos = createVector(x, y);
      this.mass = m;
      this.c1 = c1;
      this.c2 = c2;
      this.c3 = c3;
      this.r = r;
    }
  
    attract(mover) {
      let force = p5.Vector.sub(this.pos, mover.pos);
      let distanceSq = constrain(force.magSq(), 100, 1000);
      let G = 0.01;
      let strength = (G * (this.mass * mover.mass)) / distanceSq;
      force.setMag(strength);
      mover.applyForce(force);
    }
  
    show() {
      noStroke();
      fill(this.c1,this.c2,this.c3);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }

  class Mover {
    constructor(x, y, m, c1, c2, c3) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D();
      //this.vel.mult(5);
      this.acc = createVector(0, 0);
      this.mass = m;
      this.c1 = c1;
      this.c2 = c2;
      this.c3 = c3;
      this.r = sqrt(this.mass) * 2;
    }
  
    applyForce(force) {
      let f = p5.Vector.div(force, this.mass);
      this.acc.add(f);
    }
  
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  
    show() {
      stroke(255);
      strokeWeight(0);
      fill(this.c1, this.c2, this.c3);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }
  