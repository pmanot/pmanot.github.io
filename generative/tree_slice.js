class TreeSlice {
    constructor(pos, width, height, angle) {
        this.angle = angle
        this.pos = pos;
        this.width = width;
        this.height = height;
    }

    show() {
        stroke(0, 20)
        fill(0, 0)
        circle(this.pos.x, this.pos.y, this.width/3)
        //circle(this.pos.x - this.width/2, this.pos.y + this.height/2, 2)
        //circle(this.pos.x + this.width/2, this.pos.y - this.height/2, 2)
        //circle(this.pos.x - this.width/2, this.pos.y - this.height/2, 5)
        //circle(this.pos.x + this.width/2, this.pos.y + this.height/2, 5)

        //this.wobble(0.1)
    }

    nextSlice() {
        let pos = this.pos.nextPoint(this.height*2, this.angle)
        return new TreeSlice(pos, this.width, this.height, this.angle);
    }

    wobble(d) {
        this.pos.x += random(-d, d)
        this.pos.y += random(-d*2, d)
        this.angle += random(-d*(QUARTER_PI/2), +d*(QUARTER_PI/2))
    }
}

