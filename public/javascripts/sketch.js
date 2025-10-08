const numBoids = 1000; // Reasonable default
const flock = [];
let quadTree;
let borderObstacles = [];

function setup() {
    let canvas = createCanvas(windowWidth, select('#home').height);
    canvas.parent('home');
    createBorderObstacles();

    // Create reasonable number of boids
    const boidCount = Math.min(numBoids, Math.floor(windowWidth * 0.8));
    for (let i = 0; i < boidCount; i++) {
        flock.push(new Boid());
    }

    quadTree = new QuadTree(0, width, 0, height);
}

function draw() {
    background('#ff7f26');

    // Clear and rebuild quadTree
    quadTree.clear();

    for (let boid of flock) {
        quadTree.insert(boid);
    }

    for (let boid of flock) {
        boid.avoid(borderObstacles);
        boid.flock(quadTree);
        boid.update();
        boid.show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, select('#home').height);

    // Recreate quadTree with new dimensions
    quadTree = new QuadTree(0, width, 0, height);

    // Adjust boid count based on new width
    const targetCount = Math.min(numBoids, Math.floor(windowWidth * 0.8));

    if (targetCount < flock.length) {
        flock.length = targetCount; // Truncate
    } else {
        for (let i = flock.length; i < targetCount; i++) {
            flock.push(new Boid());
        }
    }

    updateBorderObstacles();
}

function createBorderObstacles() {
    borderObstacles.push(
        new BorderObstacle(0, 0, width, 0),
        new BorderObstacle(0, 0, 0, height),
        new BorderObstacle(width, 0, width, height),
        new BorderObstacle(0, height, width, height)
    );
}

function updateBorderObstacles() {
    if (borderObstacles.length === 4) {
        borderObstacles[0].start.set(0, 0);
        borderObstacles[0].end.set(width, 0);

        borderObstacles[1].start.set(0, 0);
        borderObstacles[1].end.set(0, height);

        borderObstacles[2].start.set(width, 0);
        borderObstacles[2].end.set(width, height);

        borderObstacles[3].start.set(0, height);
        borderObstacles[3].end.set(width, height);
    }
}