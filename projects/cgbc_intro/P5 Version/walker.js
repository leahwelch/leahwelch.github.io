let x, y, tx, ty;
let angle, distance, orbitSpeed;
class Walker {
    constructor(xPos_, yPos_) {
        this.x = xPos_;
        this.y = yPos_;
        this.tx = random(100);
        this.ty = random(10000);
    }

    update() {

        // this.x = map(noise(this.tx),0,1,this.x-10,this.x+10);
        // this.y = map(noise(this.ty),0,1,this.y-10,this.x+10);

        // this.tx += 0.01;
        // this.ty += 0.01;
        // this.x += random(-0.1, 0.1);
        // this.y += random(-0.1, 0.1);
    }

    show() {
        // push();
        // translate(this.x,this.y)
        fill(255);
        stroke(0);
        circle(this.x, this.y, 8);
        // pop();
    }
}