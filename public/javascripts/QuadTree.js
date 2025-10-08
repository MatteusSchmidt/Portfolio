class QuadTree {
    constructor(xMin, xMax, yMin, yMax) {
        this.root = null;
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
    }

    insert(boid) {
        this.root = this._insert(this.root, boid, this.xMin, this.xMax, this.yMin, this.yMax);
    }

    _insert(node, boid, xMin, xMax, yMin, yMax) {
        if (node == null) {
            return new Nodes(boid);
        }

        const xMid = (xMin + xMax) / 2;
        const yMid = (yMin + yMax) / 2;

        if (boid.position.x >= xMid) {
            if (boid.position.y >= yMid) {
                node.NE = this._insert(node.NE, boid, xMid, xMax, yMid, yMax);
            } else {
                node.SE = this._insert(node.SE, boid, xMid, xMax, yMin, yMid);
            }
        } else {
            if (boid.position.y >= yMid) {
                node.NW = this._insert(node.NW, boid, xMin, xMid, yMid, yMax);
            } else {
                node.SW = this._insert(node.SW, boid, xMin, xMid, yMin, yMid);
            }
        }
        return node;
    }

    queryRange(xMin, xMax, yMin, yMax) {
        const found = [];
        this._queryRange(this.root, xMin, xMax, yMin, yMax, this.xMin, this.xMax, this.yMin, this.yMax, found);
        return found;
    }

    _queryRange(node, xMin, xMax, yMin, yMax, curXMin, curXMax, curYMin, curYMax, found) {
        if (node === null) {
            return;
        }

        if (node.boid.position.x >= xMin && node.boid.position.x <= xMax && node.boid.position.y >= yMin && node.boid.position.y <= yMax) {
            found.push(node.boid);
        }

        const xMid = (curXMin + curXMax) / 2;
        const yMid = (curYMin + curYMax) / 2;

        if (xMin < xMid && yMin < yMid) {
            this._queryRange(node.SW, xMin, xMax, yMin, yMax, curXMin, xMid, curYMin, yMid, found);
        }
        if (xMin < xMid && yMax >= yMid) {
            this._queryRange(node.NW, xMin, xMax, yMin, yMax, curXMin, xMid, yMid, curYMax, found);
        }
        if (xMax >= xMid && yMin < yMid) {
            this._queryRange(node.SE, xMin, xMax, yMin, yMax, xMid, curXMax, curYMin, yMid, found);
        }
        if (xMax >= xMid && yMax >= yMid) {
            this._queryRange(node.NE, xMin, xMax, yMin, yMax, xMid, curXMax, yMid, curYMax, found);
        }
    }

    clear() {
        this.root = null;
    }
}

class Nodes {
    constructor(boid) {
        this.boid = boid;
        this.NE = null;
        this.NW = null;
        this.SE = null;
        this.SW = null;
    }
}
