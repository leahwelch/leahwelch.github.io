let movers = [];
let lagranges = [];
let l1;
let l2;
let l3;
let l4;
let l5;
let sun;
let sunX;
let e;
let earthX;
let cnv;
let labelColor;
let fillColor;
let nextButton;
let prevButton;
let dist;
let slider;

function centerCanvas() {
  let canvasX = (windowWidth - width) / 2;
  let canvasY;
  cnv.position(canvasX, canvasY);
}

function setup() {
    let canvasX = (windowWidth - width) / 2;
    let canvasY;

    labelColor=255;
    fillColor = color(8,8,45);

    nextButton = select("#next");
    prevButton = select("#prev");
    slider = select("#myRange");
    fillColor=255;
    
    // button.mousePressed(update1);

    cnv = createCanvas(800, 600);
    cnv.position(canvasX, canvasY);
    cnv.parent('sketch-holder');

    for (let i = 0; i < 20; i++) {
      let x = random(width);
      let y = random(height);
      let m = random(1, 5);
      movers[i] = new Mover(x, y, m, 220,20,255);
    }

    
    sunX = width / 2 - 100;
    earthX = 2*(width/3) + 50;
    dist = earthX - sunX;
    
    sun = new Attractor(sunX, height / 2, 3000,50, 249, 244, 189);
    e = new Attractor(earthX, height / 2, 1,10, 27, 244, 189);
    // update1();

    l2 = new Lagrange(earthX - (dist/10), height/2);
    l3 = new Lagrange(sunX - dist, height/2);
    l4 = new Lagrange(earthX-(dist/2), height/2-sqrt(sq(dist) - sq(dist/2)));
    l5 = new Lagrange(earthX-(dist/2), height/2+sqrt(sq(dist) - sq(dist/2)));
    l1 = new Lagrange(earthX + (dist/10), height/2);

    nextButton.mousePressed(update1);
    

    // background(8,8,45);
}

function draw() {
  background(8,8,45);
  sun.show();
  e.show();
  for (let mover of movers) {
    mover.update();
    mover.show();
    sun.attract(mover);
  }

  fill(labelColor);
  textSize(12);
  textFont('Arial Narrow');
  text('SUN', sunX - 10, height / 2 - 60)
  text('EARTH', earthX - 16, height / 2 - 20)

  fill(255,0)
  stroke(255,100);
  strokeWeight(1)
  ellipse(earthX + (dist/10), height/2, 10, 10);
  ellipse(earthX - (dist/10), height/2, 10, 10);
  ellipse(sunX - dist, height/2, 10, 10);
  ellipse(earthX-(dist/2), height/2+sqrt(sq(dist) - sq(dist/2)), 10, 10);
  ellipse(earthX-(dist/2), height/2-sqrt(sq(dist) - sq(dist/2)), 10, 10);
  
  l1.show();
  l2.show();
  l3.show();
  l4.show();
  l5.show();
}

function update1() {
  // labelColor = color(8,8,45);
  fillColor=color(8,8,45);
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
      let G = slider.value()/4000;
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

  class Lagrange {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.mass = 3;
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
      let c = fillColor;
      stroke(255);
      strokeWeight(0);
      fill(c);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }
  