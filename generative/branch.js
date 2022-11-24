class Branch {
    constructor(start, thickness, angle, sliceHeight = 20, length = 100) {
        this.start = start;
        this.end = start;
        this.thickness = thickness;
        this.sliceHeight = sliceHeight
        this.angle = angle;
        this.slices = [];
        this.grown = false;
        this.length = length;
    }

    grow() {
        if (this.slices.length == 0) {
            let firstSlice = new TreeSlice(this.start, this.thickness, this.sliceHeight, this.angle);
            this.slices.push(firstSlice);
        } else {
            let lastSlice = this.slices[this.slices.length - 1];
            let newSlice = lastSlice.nextSlice();
            newSlice.wobble(0.5);
            this.slices.push(newSlice);
            this.end = newSlice.pos;

            if (this.slices.length > 150) {
                this.grown = true
            }
    
            if (newSlice.width < 5) {
                this.grown = true
            }

            if (this.slices.length >= this.length) {
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
        return new Branch(this.end, this.thickness, this.angle + angle, this.sliceHeight);
    }
}