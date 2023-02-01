let tree;

function setup() {
    pixelDensity(2);
    createCanvas(window.innerWidth, window.innerHeight);
    let point = new Point(window.innerWidth/2, window.innerHeight*0.95)
    let size = new Size(window.innerWidth/6, window.innerWidth/6);
    let entropy = new Entropy()
    let seed = new Seed(point, size, entropy)
    tree = new Tree(seed);
    frameRate(30);
}

function draw() {
    background(250, 255);
    text("tap to generate", window.innerWidth/2, window.innerHeight/3)

    tree.show();
    tree.grow();

    if (tree.branches.length > 25) {
        noLoop()
    }
    
}

class Entropy {
    constructor(sliceWobble = PI/16, branchWobble = PI/8){
        this.branchWobble = branchWobble;
        this.sliceWobble = sliceWobble;
    }
}

class Seed {
    constructor(position, size, entropy, branchAngle = PI/8, branchProbability = 0.05, minimumBranchLength = 25){
        this.pos = position;
        this.size = size;
        this.entropy = entropy;
        this.branchAngle = branchAngle;
        this.branchProbability = branchProbability;
        this.minimumBranchLength = minimumBranchLength;
    }
    
    generateSlice() {
        let slice = new TreeSlice(this.pos, this.size, 0, this.entropy);
        return slice;
    }

    generateBranch() {
        let slice = this.generateSlice();
        let branch = new Branch(slice);
        return branch;
    }
}


class Tree {
    constructor(seed) {
        this.seed = seed;
        this.branches = [
            seed.generateBranch()
        ];
    }
    
    get entropy() {
        return this.seed.entropy;
    }

    grow() {
        for (let i in this.branches){
            let branch = this.branches[i];
            if (branch.grown != true) {
                branch.grow();
                //
                
                    if (branch.length >= this.seed.minimumBranchLength) {
                        if (probability(this.seed.branchProbability)){
                            this.spawnBranches(branch);
                        }
                    }
                    
                    if (branch.length > 50) {
                        branch.grown = true;
                        if (this.branches.length == 1) {
                            this.spawnBranches(branch);
                        }
                    }
            }
        }
    }

    show() {
        for (let i in this.branches){
            this.branches[i].show();
        }
    }

    spawnBranches(branch) {
        // get the branch angle from the seed
        let angle = this.seed.branchAngle;
        let halfWobble = this.entropy.branchWobble/2;
      
        // generate a random wobble for each branch
        let wobbleA = random(-abs(halfWobble), +abs(halfWobble));
        let wobbleB = random(-abs(halfWobble), +abs(halfWobble));
    
        // generate two branches, rotated by the given angle + wobble in opposite directions
        let branchA = branch.generateBranch(angle + wobbleA);
        let branchB = branch.generateBranch(-angle + wobbleB);
    
        branch.grown = true;
        this.branches.push(branchA, branchB);
    }
}

class Branch {
    constructor(slice) {
        // contains a non empty array of slices
        this.slices = [slice];
        this.grown = false;
    }

    // get the first slice in the array
    get start() {
        return this.slices[0];
    }
    
    // get the last slice in the array
    get end() {
        this.slices.push();
        return this.slices[this.slices.length - 1];
    }

    get length() {
        return this.slices.length;
    }

    // create and add the next slice to the array, 'grow' the branch
    grow() {
        let nextSlice = this.end.nextSlice(this.end.size.height/32);
        this.slices.push(nextSlice);
    }

    // loop over all the slices and draw each slice
    show() {
        for (let i in this.slices) {
            this.slices[i].show();
        }
    }

    generateBranch(angle = PI/4) {
        let slice = new TreeSlice(this.end.pos, this.end.size, (this.end.direction + angle), this.end.entropy);
        let generatedBranch = new Branch(slice);
        return generatedBranch;
    }
}

class TreeSlice {
    constructor(position, size, angle, entropy) {
        this.pos = position;
        this.size = size;
        this.direction = angle;
        this.entropy = entropy;
    }
    
    // generate a new slice
    nextSlice(amount = 5) {
        let wobble = this.entropy.sliceWobble
        let direction = this.direction + random(-abs(wobble/2), +abs(wobble/2))
        let slice = new TreeSlice(this.pos.offset(this.direction, amount), this.size, direction, this.entropy);
        return slice;
    }

    show() {
        // draw a circle at given position
        circle(this.pos.x, this.pos.y, this.size.width/2);
    } 
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    offset(angle, amount) {
        let xIncrement = sin(angle)*amount;
        let yIncrement = cos(angle)*amount;
        let point = new Point(this.x + xIncrement, this.y - yIncrement);
        return point;
    }

    offsetX(amount = 1){
        let point = new Point(this.x + amount, this.y);
        return point;
    }

    offsetY(amount = 1){
        let point = new Point(this.x, this.y - amount);
        return point;
    }
}

class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}



function probability(r = 0.5) {
    return (random() < r)
}

function touchStarted() {
    tree.branches = [tree.branches[0]]
    tree.branches[0].slices = [tree.branches[0].slices[0]]
    tree.branches[0].grown = false;
    loop()
}