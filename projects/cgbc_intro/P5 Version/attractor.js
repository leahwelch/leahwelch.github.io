class Attractor {
  
    constructor(x,y,m) {
      this.pos = createVector(x,y);
      this.mass = m;
      this.r = sqrt(this.mass)*2;
    }
    
    attract(mover) {
      let force = p5.Vector.sub(this.pos, mover.pos);
      let distanceSq = constrain(force.magSq(), 1000, 10000);
      let G = 1;
      let strength = G * (this.mass * mover.mass) / distanceSq;
      force.setMag(strength);
      mover.applyForce(force);
    }
    
    
    show() {
      noStroke();
      // fill(170, 117, 56);
      fill(255);
      ellipse(this.pos.x, this.pos.y, 5);    
    }
  }