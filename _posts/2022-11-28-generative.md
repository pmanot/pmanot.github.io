---
layout: post
title:  "Gen"
categories: post
---

# Introduction
Nature is fascinating.

My first introduction to generative art was through this captivating blog post by Anders Hoff - [On Generative Algorithms](https://inconvergent.net/generative/). This post is inspired by his [visualisation of trees](https://inconvergent.net/generative/trees/), which I immediately tried to recreate in Swift.

Recently, something rekindled that spark and I decided to learn how to use P5.js, a javascript library for creative coding. It seemed like a good excuse to get more comfortable with coding in javascript - partly in an effort to expand my skillset and partly because I wanted to create my own generative art pieces that I could show off on my blog.

I came to know about Processing and P5.js through Daniel Shiffman's absolutely brilliant and wholesome YouTube channel, [The Coding Train](https://www.youtube.com/@TheCodingTrain) - where he teaches creative coding on subjects ranging from the basics of programming languages to algorithmic art, machine learning, simulation, and more. I highly recommend checking out his channel if you haven't before.


# Growth

There's something truly mesmerising about watching a process that slowly develops and unfolds over time. It's like seeing a puzzle that slowly assembles itself, and although each piece might seem unremarkable on its own, they can come together to create something much bigger. And the way they come together can be governed by simple rules (such as matching edges for a jigsaw).

...

# Creating the tree

Let's start by defining our smallest building block. We'll give it a position and a size.

```js
class TreeSlice {
    constructor(position, size) {
        this.pos = position;
        this.size = size;
    }
}
```

Right now this class doesn't do much, so let's add a function to show a representation of it at the given position on the screen. Let's keep it simple for now, and have it draw a circle. We can tweak this later.

```js
show() {
  // draw a circle at given position
  circle(this.pos.x, this.pos.y, this.size.width/3)
}     
```

And Voilá! We now have a circle.

<center>
<img src="\assets\images\circle.png" width="60%"/>
</center>

It doesn't look like much now, but we can build a branch by drawing multiple slices in succession. The position of each slice will be offset by a given amount to generate the next one.

```js
// generate a new slice, whose position is offset by the given amount
nextSlice(amount = 5) {
    let slice = new TreeSlice(this.pos.offsetY(amount));
    return slice;
}
```

Here we are simply offsetting the y-coordinate, moving each slice upwards by a small amount. 

<center>
<img src="\assets\images\branch.png" width="60%"/>
</center>

Let's create a branch class to store multiple slices in an array.
```js
class Branch {
    constructor(slice) {
        // contains a non empty array of slices
        this.slices = [slice];
    }

    // get the first slice in the array
    get start() {
        return this.slices[0];
    }
    
    // get the last slice in the array
    get end() {
        this.slices.push()
        return this.slices[this.slices.length - 1];
    }

    // create and add the next slice to the array, 'grow' the branch
    grow() {
        let nextSlice = this.end.nextSlice();
        this.slices.push(nextSlice);
    }

    // loop over all the slices and draw each slice
    show() {
        for (let i in this.slices) {
            this.slices[i].show()
        }
    }
}
```

Currently our branch will only grow straight up. Although that might mimic the trunk, we need a way to grow branches at an angle. Let's see how we can achieve this.

Going back to our function to generate new slices, lets add a new angle parameter.

```js
// generate a new slice, whose position is offset by the given amount
nextSlice(angle = PI/4, amount = 5) {
    // currently only the y coordinate is being changed
    let slice = new TreeSlice(this.pos.offsetY(amount));
    return slice;
}
```

Now we need some way to move by a particular amount in the direction of a particular angle. This can be done very easily with a little bit of trigonometry.

```js
offset(angle, amount) {
    let xIncrement = sin(angle)*amount;
    let yIncrement = cos(angle)*amount;
    let point = new Point(this.x + xIncrement, this.y - yIncrement);
    return point;
}
```

<center>
<img src="\assets\images\angledrawing.jpg" width="80%"/>
</center>


Updating our function, we now have:

```js
// generate a new slice, whose position is offset by the given amount, towards the given angle
nextSlice(angle = PI/4, amount = 5) {
    // changing both the x and y coordinates
    let slice = new TreeSlice(this.pos.offset(angle, amount));
    return slice;
}
```

Let's make the angle a property instead.

```js
class TreeSlice {
    constructor(position, size, angle) {
        this.pos = position;
        this.size = size;
        this.direction = angle
    }
    
    // generate a new slice, whose position is offset by the given amount, towards the given angle
    nextSlice(amount = 5) {
        let slice = new TreeSlice(this.pos.offset(this.direction, amount), this.size, this.direction);
        return slice;
    }

    show() {
        // draw a circle at given position
        circle(this.pos.x, this.pos.y, this.size.width/2);
    } 
}
```


Just like we combined slices to make a branch, we can now combine branches to make a tree.

Let's initialise our tree using a seed. 

```js
class Seed {
    constructor(position, size){
        this.pos = position;
        this.size = size;
    }
    
    generateSlice() {
        let slice = new TreeSlice(this.pos, this.size, 0);
        return slice;
    }

    generateBranch() {
        let slice = this.generateSlice();
        let branch = new Branch(slice);
        return branch;
    }
}
```

```js
class Tree {
    constructor(seed) {
        this.seed = seed;
        this.branches = [
            seed.generateBranch()
        ];
    }

    grow() {
        print(this.branches)
        for (let i in this.branches){
            this.branches[i].grow();
        }
    }

    show() {
        for (let i in this.branches){
            this.branches[i].show();
        }
    }
}
```

Currently our tree only contains a single branch. We need a way to generate new branches.

<center>
<img src="\assets\images\generatebranches.jpg" width="80%"/>
</center>

Let's add a function to our branch class to generate a new branch object, rotated by a given angle.

```js
generateBranch(angle = PI/4) {
    let pos = this.end.pos;
    let slice = new TreeSlice(this.end.pos, this.end.size, (this.end.direction + angle));
    let generatedBranch = new Branch(slice);
    return generatedBranch;
}
```

We can then add a function to our tree class

```js
spawnBranches(branch, angle) {
    // generate two branches, rotated by the given angle in opposite directions
    let branchA = branch.generateBranch(angle);
    let branchB = branch.generateBranch(-angle);

    this.branches.push(branchA, branchB);
}
```

This lets us split a branch into two new branches. Here's a demo of what it looks like _(tap to animate)_
<center>
<iframe src="\assets\p5js\Tree\index.html" height=500 width="100%" title="tree" style="border:none">
</iframe>
</center>

However, you might've noticed there's a small issue. Even after splitting, the original branch keeps growing. Fortunately, we can fix this pretty easily by adding a new property to our branch which tells us when we should stop growing it.

```js
constructor(slice) {
    // contains a non empty array of slices
    this.slices = [slice];
    // tells us whether a branch is done growing or not
    this.grown = false
}
```

Now we can update the `grow` method on our tree

```js
grow() {
    print(this.branches)
    for (let i in this.branches){
        let branch = this.branches[i]
        
        // check if the branch is done growing
        if (branch.grown != true) {
            branch.grow();
        }
    }
}
```

This will ensure that a branch will stop growing once the `grown` property is set to true. We can do that in our `spawnBranches` method.

```js
spawnBranches(branch, angle) {
    // generate two branches, rotated by the given angle in opposite directions
    let branchA = branch.generateBranch(angle);
    let branchB = branch.generateBranch(-angle);
    
    // set the grown property to true after splitting from the branch
    branch.grown = true
    this.branches.push(branchA, branchB);
}
```

<center>
<iframe src="\assets\p5js\Tree-grown\index.html" height="500" width="100%" title="tree" style="border:none">
</iframe>
</center>

It works! So far we've been hardcoding when to generate new branches. Let's try automating that process instead, by spawning new branches after each reaches a set length.

Let's first add a `length` property to our branch class, which will simply return the number of slices in the array.

```js
get length() {
    return this.slices.length;
}
```

Now we can change the `grow` method in our `Tree` class to call the `spawnBranches` method when a branch is of a certain length. 

```js
grow() {
    print(this.branches)
    for (let i in this.branches){
        let branch = this.branches[i]
        if (branch.grown != true) {
            branch.grow();
            if (branch.length > window.innerWidth/25){
                this.spawnBranches(branch, PI/5)
            }
        }
    }
}
```

This will actually keep generating new branches, so let's add a constraint to make sure this doesn't loop forever.

```js
if (tree.branches.length > 16) {
    noLoop()
}
```

<center>
<iframe src="\assets\p5js\More-branches\index.html" title="tree" style="border:none" width="100%" height=500>
</iframe>
</center>
Pretty cool, right? As you can see, our structure looks more like a tree now. It's not perfect yet, but we're getting somewhere.

One of the ways we can make this look more organic is by introducing some chaos into this system. Systems in nature rarely grow in perfect straight lines, at exact angles. One of the easiest way to generate noise is using random numbers. When we spawn new branches, let's "wobble" them by changing the angle of their generation slightly.

Let's create a new `Entropy` class to store values related to randomness that we need to introduce. Creating classes like these help reduce clutter in our code, and also make it easier to understand.

```javascript
class Entropy {
    constructor(branchWobble = PI/4){
        this.branchWobble = branchWobble
    }
}
```

We can then add an entropy property to our `Seed` class.

```javascript
constructor(position, size, entropy){
    this.pos = position;
    this.size = size;
    this.entropy = entropy
}
```

Conceptually, you can think of the seed as a neat little way to encapsulate all the starting condiitons and information about the tree into a single object.

Let's also encode the branch angle in the seed

```javascript
constructor(position, size, entropy, branchAngle){
    this.pos = position;
    this.size = size;
    this.entropy = entropy;
    this.branchAngle = angle
}
```



We can then apply this `branchWobble` to our `spawnBranches` function

```javascript
spawnBranches(branch) {
    // get the branch angle from the seed
    let angle = this.seed.branchAngle;
  
    // generate a random wobble for each branch
    let wobbleA = random(-abs(entropy.branchWobble/2), +abs(entropy.branchWobble/2));
    let wobbleB = random(-abs(entropy.branchWobble/2), +abs(entropy.branchWobble/2));

    // generate two branches, rotated by the given angle + wobble in opposite directions
    let branchA = branch.generateBranch(angle + wobbleA);
    let branchB = branch.generateBranch(-angle + wobbleB);

    branch.grown = true;
    this.branches.push(branchA, branchB);
}
```



<center>
<iframe src="\assets\p5js\Adding-branch-wobble\index.html" height=500 width="100%" title="tree" style="border:none">
</iframe>
</center>

Now we've succesfully varied the angles of the branches! As you can see yourself by clicking on the tree, the angles aren't the same for each generation anymore. This let's us produce unique results each time - while still maintaining some control over the final outcome,

We can take this a step further and also add a directional wobble to each slice itself.

Let's first update our `Entropy` class

```javascript
constructor(sliceWobble = PI/20, branchWobble = PI/4){
    // add a sliceWobble, set to a much lower value, because new slicees are generated repeatedly
    this.sliceWobble = sliceWobble 
    this.branchWobble = branchWobble
}
```

Now we can pass this down to the `TreeSlice` class

```javascript
constructor(position, size, angle, entropy) {
    this.pos = position;
    this.size = size;
    this.direction = angle;
    // add an entropy property
    this.entropy = entropy;
}
```

```javascript
generateSlice() {
    // pass in the entropy from the Seed class
    let slice = new TreeSlice(this.pos, this.size, 0, this.entropy);
    return slice;
}
```



We can update the `nextSlice` function to now use this wobble

```javascript
nextSlice(amount = 5) {
    // get wobble from entropy
    let wobble = this.entropy.sliceWobble
    
    // calculate direction with wobble
    let direction = this.direction + random(-abs(wobble/2), +abs(wobble/2))
    
    let slice = new TreeSlice(this.pos.offset(this.direction, amount), this.size, direction, this.entropy);
    return slice;
}
```

Since we're passing in the entropy as an argument to the `TreeSlice` class, we need to update all subsequent functions where we create new `TreeSlice` objects. Since entropy does not need to vary between slices, we can simply pass it on from the previous slice to the next.

Our slices now have wobble! The tree is no longer perfect straight lines, and now curves and twists - making it look much more natural.

<center>
<iframe src="\assets\p5js\Adding-slice-wobble\index.html" height=500 width="100%" title="tree" style="border:none">
</iframe>
</center>

There's still one arbitrary rule hanging over us. The tree always branches after a particular branch reaches an exact length. This behaviour is quite unrealistic and predictable. Not every branch has to branch out, and some branches should be longer than others. Let's change this by using a probabilistic model instead - where at each instance of growth, a branch has a certain probability to spawn new branches.

Let's first implement a simple `probability` function

```javascript
function probability(r = 0.5) {
    return (random() < r)
}
```

Before we encode the probability in our seed class, we need to consider some edge cases.
Because we're relying on a probability based algorithm, there is a chance that we won't have any branches at all, where the first (trunk) branch can keep growing without ever spawning new branches. This probably isn't the behaviour we want, so 

```javascript
constructor(position, size, entropy, branchProbability = 0.05, minimumBranchLength = 15){
    this.pos = position;
    this.size = size;
    this.entropy = entropy;
    this.branchProbability = 0.05;
    this.minimumBranchLength = minimumBranchLength;
}
```


Now we can change the grow function

```javascript
grow() {
    for (let i in this.branches){
        let branch = this.branches[i];
        let branchSpawnProbability = (this.seed.branchProbability/this.branches.length)
        if (branch.grown != true) {
            branch.grow();
            //
            if (probability(branchSpawnProbability)){
                this.spawnBranches(branch, PI/5)
            }
        }
    }
}
```

<center>
<iframe src="\assets\p5js\Adding-probability\index.html" height=1000 width="100%" title="tree" style="border:none">
</iframe>
</center>
