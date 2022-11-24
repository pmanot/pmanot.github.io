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