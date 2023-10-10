class Mover {
    constructor(x, y, id, links_, label_, discipline_, size_) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.name = id;
        this.links = links_;
        this.label = label_;
        this.discipline = discipline_;
        this.size = size_;
        //   this.vel.mult(2);
        this.acc = createVector(0, 0);
        this.mass = 2000;
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

    // seek(target) {
    //     let force = p5.Vector.sub(target, this.pos);
    //     force.setMag(this.maxSpeed);
    //     force.sub(this.vel);
    //     force.limit(this.maxForce);
    //     this.applyForce(force);
    // }

    // applyForce(force) {
    //     this.acc.add(force);
    // }

    show() {
        stroke(100, 255, 0);
        strokeWeight(1);
        fill(37, 47, 45);
        if(this.discipline === "LANDSCAPE") {
            ellipse(this.pos.x, this.pos.y, 10);
        } else if(this.discipline === "PLANNING") {
            square(this.pos.x, this.pos.y, 10);
        } else {
            triangle(this.pos.x - 5, this.pos.y + 5, this.pos.x + 5, this.pos.y + 5, this.pos.x, this.pos.y - 5)
        }
        
        strokeWeight(0.25)
        for (let link of this.links) {
            line(this.pos.x, this.pos.y, link.targetX, link.targetY)
        }
        noStroke();
        fill(100, 255, 0)
        textSize(8);
        textFont(fontRegular);
        text(this.label, this.pos.x + 10, this.pos.y - 5, 50);

    }

}