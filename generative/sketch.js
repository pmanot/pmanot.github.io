let tree;

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER);
    let point = new Point(0, 0);
    tree = new Tree(point, window.innerWidth/5, window.innerWidth/1000);
}

function draw() {
    background(245)
    translate(window.innerWidth/2, window.innerHeight);
    tree.show();
    tree.grow();
}

function mousePressed() {
    tree.grow()
    print(tree.branches)
}

function keyPressed() {
    tree.branch()
}