class Mover {
    constructor(x, y, id, links_, label_, discipline_, size_) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 4;
        this.maxForce = 0.25;
        this.r = 16;
        this.name = id;
        this.links = links_;
        this.label = label_;
        this.discipline = discipline_;
        this.size = size_;
    }

    seek(target) {
        let force = p5.Vector.sub(target, this.pos);
        force.setMag(this.maxSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show() {
        stroke(255);
        strokeWeight(2);
        fill(255);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        if (this.discipline === "LANDSCAPE") {
            ellipse(this.pos.x, this.pos.y, 10);
        } else if (this.discipline === "PLANNING") {
            square(this.pos.x, this.pos.y, 10);
        } else {
            triangle(this.pos.x - 5, this.pos.y + 5, this.pos.x + 5, this.pos.y + 5, this.pos.x, this.pos.y - 5)
        }

        //     strokeWeight(0.25)
        //     for (let link of this.links) {
        //         line(this.pos.x, this.pos.y, link.targetX, link.targetY)
        //     }
        //     noStroke();
        //     fill(0)
        //     text(this.label, this.pos.x + 10, this.pos.y - 5, 50);
        pop();
    }




}