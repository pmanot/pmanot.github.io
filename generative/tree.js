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
                this.branch(i);
            }
        }
    }

    show() {
        for (let i in this.branches) {
            this.branches[i].show();
        }
    }

    branch(i = 0) {
        if (!this.branches[i].grown) {
            if (random() < (0.095/this.branches.length)) {
                let newBranchA = this.branches[i].spawnBranch(PI/15);
                let newBranchB = this.branches[i].spawnBranch(-PI/15);
                this.branches.push(newBranchA);
                this.branches.push(newBranchB);
            }
        }
    }
}