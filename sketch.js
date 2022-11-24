let tree;

function setup(){
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    let point = new Point(0, 0);
    tree = new Tree(point, windowWidth/10, windowHeight/200)
}

function draw() {
    background(255)
    translate(windowWidth/2, windowHeight);
    tree.show()
    tree.grow()
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight)
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
                /*
                if (this.branches.length > 2) {
                    if (random() < (0.1/this.branches.length)) {
                        this.branches[i].grown = true
                    }
                }
                */
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
                if (random() < (0.025/this.branches.length)) {
                    let newBranchA = this.branches[i].spawnBranch(PI/8);
                    let newBranchB = this.branches[i].spawnBranch(-PI/5);
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
        fill(0, 1)
        stroke(0, 50)
        //line(this.pos.x - this.width/2, this.pos.y - this.height/2, this.pos.x - this.width/2, this.pos.y + this.height/2)
        //line(this.pos.x + this.width/2, this.pos.y - this.height/2, this.pos.x + this.width/2, this.pos.y + this.height/2)
        //line(this.pos.x - this.width/2, this.pos.y - this.height/2, this.pos.x + this.width/2, this.pos.y - this.height/2)
        //line(this.pos.x - this.width/2, this.pos.y - this.height/2, this.pos.x + this.width/2, this.pos.y - this.height/4)
        //line(this.pos.x - this.width/2, this.pos.y - this.height/4, this.pos.x + this.width/2, this.pos.y - this.height/2)
        circle(this.pos.x, this.pos.y, this.width)
        pop();
    }

    nextSlice() {
        let pos = this.pos.nextPoint(this.height, this.angle)
        return new TreeSlice(pos, this.width, this.height, this.angle);
    }

    wobble(d) {
        this.pos.x += random(-d, d)
        this.pos.y += random(-d, d)
        this.angle += random(-d*(QUARTER_PI/20), +d*(QUARTER_PI/20))
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