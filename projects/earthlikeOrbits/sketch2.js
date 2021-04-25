let bubble1;
let bubble2;
let sun;
let earth;
let movers = [];
let G = 5;

function setup() {
  createCanvas(1600, 800);
  bubble1 = new Bubble(200,150);
  bubble2 = new Bubble(100,100);
  sun = new Attractor(width/2-100,333000,100,249,244);
  earth = new Attractor(2*(width/3)-100,1,20,27,244);
  for (let i = 0; i < 20; i++) {
    movers.push(new Mover(random(800), random(600),220,20,255));
  }
}

function draw() {
  background(8,8,45);
//   bubble1.move();
//   bubble1.show();
//   bubble2.move();
//   bubble2.show();
  sun.show();
  earth.show();
  for (let i = 0; i < movers.length; i++) {
    let sunForce = sun.attract(movers[i]);
    movers[i].applyForce(sunForce);
    movers[i].update();
    movers[i].show();
  }
}

class Bubble {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
  }

  move() {
    this.x = this.x + random(-5, 5);
    this.y = this.y + random(-5, 5);
  }

  show() {
    stroke(255);
    strokeWeight(4);
    noFill();
    ellipse(this.x, this.y, 24, 24);
  }
}

class Attractor {
    constructor(xpos, mm, r, c1, c2) {
      this.xpos = xpos;
      this.mm = mm;
      this.r = r;
      this.c1 = c1;
      this.c2 = c2;
      let position= createVector(this.xpos, height/2)
    }
    
    // centripetal(m) {
    //   let acc = createVector.sub(position,m.position); 
    //   let r = sqrt(pow(width/2 - m.position.x, 2)
    //             +pow(height/2 - m.position.y, 2));
    //   let d = pow(omega,2)*r;
    //   acc.normalize();
    //   acc.mult(d);
    //   acc.mult(m.mass);

    //   return acc;
    // }
    
    attract(m) {
      let force = p5.Vector.sub(this.position,m.position);
      let distanceSq = constrain(force.magSq(), 5, 25);
      force.normalize();
      let strength = (G * (this.mm * m.mass)) / distanceSq;
      force.setMag(strength);
      m.applyForce(force);
    }
    
    show() {
      ellipseMode(CENTER);
      stroke(0);
      strokeWeight(0);
      fill(this.c1,this.c2,189);
      ellipse(this.xpos,height/2,this.r,this.r);
    }
    
  } 

  class Mover {
 
    Mover(xpos, ypos, c1, c2, c3) {
      this.xpos = xpos;
      this.ypos = ypos;
      this.c1 = c1;
      this.c2 = c2;
      this.c3 = c3;
      let position = createVector(this.x, this.y);
      let velocity = createVector(0,0);
      let acceleration = createVector();
      const mass = 0.05;
    }
    
    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
      }
    
    // negForce(force) {
    //   let f = p5.Vector.div(force,mass);
    //   acceleration.sub(f);
    // }
    
    update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity); 
      this.acceleration.mult(0);
    }
    
    show() {
    //   let angle = this.velocity.heading();
    //   pushMatrix();
    //   translate(this.xpos,this.ypos);
    //   rotate(angle);
      ellipseMode(CENTER);
      stroke(0);
      strokeWeight(0);
      fill(this.c1,this.c2,this.c3);
      ellipse(300,400,10,10);
    //   popMatrix();
    }
    
  }
