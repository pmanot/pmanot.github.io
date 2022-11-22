let tree;

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER);
    let point = new Point(0, 0);
    tree = new Tree(point, 100, 5)
}

function draw() {
    background(245)
    translate(window.innerWidth/2, window.innerHeight);
    tree.show()
    tree.grow()
}


class Tree {
    constructor(start, width, sliceHeight) {
        this.start = start
        this.branches = []
        this.width = width
        this.sliceHeight = sliceHeight
    }

    grow() {
        if (this.branches.length == 0) {
            let trunk = new Branch(this.start, this.width, 0, this.sliceHeight)
            this.branches.push(trunk)
        }
        for (let i in this.branches) {
            if (!this.branches[i].grown) {
                this.branches[i].grow();
                this.branch()
                if (this.branches.length > 2) {
                    if (random() < (0.1/this.branches.length)) {
                        this.branches[i].grown = true
                    }
                }
            }
        }
    }

    show() {
        for (let i in this.branches) {
            this.branches[i].show();
        }
    }

    branch() {
        for (let i in this.branches) {
            if (!this.branches[i].grown) {
                if (random() < (0.1/this.branches.length)) {
                    let newBranchA = this.branches[i].spawnBranch(PI/8);
                    let newBranchB = this.branches[i].spawnBranch(-PI/8);
                    this.branches.push(newBranchA);
                    this.branches.push(newBranchB);
                }
            }
        }
    }
}

class TreeSlice {
    constructor(pos, width, height, angle) {
        this.angle = angle
        this.pos = pos;
        this.width = width;
        this.height = height;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        translate(-this.pos.x, -this.pos.y);
        stroke(0, 25)
        line(this.pos.x - this.width/2, this.pos.y - this.height/2, this.pos.x + this.width/2, this.pos.y + this.height/2)
        pop();
        this.wobble(0.1)
    }

    nextSlice() {
        let pos = this.pos.nextPoint(this.height, this.angle)
        return new TreeSlice(pos, this.width, this.height, this.angle);
    }

    wobble(d) {
        this.pos.x += random(-d, d)
        this.pos.y += random(-d*2, d)
        this.angle += random(-d*(QUARTER_PI/25), +d*(QUARTER_PI/25))
    }
}

class Branch {
    constructor(start, thickness, angle, sliceHeight = 20) {
        this.start = start;
        this.end = start;
        this.thickness = thickness;
        this.sliceHeight = sliceHeight
        this.angle = angle;
        this.slices = [];
        this.grown = false
    }

    grow() {
        if (this.slices.length == 0) {
            let firstSlice = new TreeSlice(this.start, this.thickness, this.sliceHeight, this.angle);
            this.slices.push(firstSlice);
        } else {
            let lastSlice = this.slices[this.slices.length - 1];
            let newSlice = lastSlice.nextSlice();
            newSlice.wobble(2)
            this.slices.push(newSlice);
            this.end = newSlice.pos

            if (this.slices.length > 150) {
                this.grown = true
            }
    
            if (newSlice.width < 5) {
                this.grown = true
            }
        }
    }

    show() {
        for (let i in this.slices) {
            this.slices[i].show();
        }
    }

    spawnBranch(angle) {
        this.grown = true
        return new Branch(this.end, this.thickness/1.5, this.angle + angle, this.sliceHeight/1.2);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    nextPoint(d, angle) {
        let xIncrement = sin(angle)*d;
        let yIncrement = cos(angle)*d;
        let point = new Point(this.x + xIncrement, this.y - yIncrement);
        return point;
    }

    shifted(offset = 0.5) {
        let point = new Point(this.x + offset, this.y);
        return point;
    }
}

function mousePressed() {
    tree.grow()
    print(tree.branches)
}

function keyPressed() {
    tree.branch()
}