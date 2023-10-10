let movers = [];
let targets = [];
// let size_attractors = [];

const width = 1000;
const height = 1000;

const degrowth_coords = [(width - 100) / 2, (height - 100) / 4]
const methods_coords = [(width - 100) / 4, (3 * (height - 100)) / 4]
const becoming_coords = [(3 * (width - 100)) / 4, (3 * (height - 100)) / 4]

function preload() {
    json = loadJSON("./data/data.json");
}

function setup() {
    frameRate(20)
    let canvas = createCanvas(width, height);
    canvas.position(0, 0);

    json.projects.forEach((d) => {
        d.xCoord = (d.degrowth / 10 * degrowth_coords[0] + d.methods / 10 * methods_coords[0] + d.becoming / 10 * becoming_coords[0]) + Math.random(-1, 1) * 100
        d.yCoord = (d.degrowth / 10 * degrowth_coords[1] + d.methods / 10 * methods_coords[1] + d.becoming / 10 * becoming_coords[1]) + Math.random(-1, 1) * 100
    })


    targets.push(createVector(degrowth_coords[0], degrowth_coords[1]))
    targets.push(createVector(methods_coords[0], methods_coords[1]))
    targets.push(createVector(becoming_coords[0], becoming_coords[1]))

    for (let i = 0; i < json.projects.length; i++) {
        let link_list = []
        if (json.projects[i].degrowth != 0) {
            link_list.push({
                targetX: degrowth_coords[0],
                targetY: degrowth_coords[1]
            })
        }

        if (json.projects[i].methods != 0) {
            link_list.push({
                targetX: methods_coords[0],
                targetY: methods_coords[1]
            })
        }

        if (json.projects[i].becoming != 0) {
            link_list.push({
                targetX: becoming_coords[0],
                targetY: becoming_coords[1]
            })
        }
        // console.log(link_list)
        movers.push(new Mover(100,100, json.projects[i].primary, link_list, json.projects[i].id, json.projects[i].discipline, json.projects[i].size));
    }

    // attractors.push(new Attractor(degrowth_coords[0], degrowth_coords[1], 50))
    // attractors.push(new Attractor(methods_coords[0], methods_coords[1], 50))
    // attractors.push(new Attractor(becoming_coords[0], becoming_coords[1], 50))

    // for (let i = 0; i < 11; i++) {
    //     size_attractors.push(new Attractor(map(i, 0, 10, 50, width - 50), height / 2, 50))
    // }
    // console.log(size_attractors)

}

function draw() {
    background(255);
    for(let target of targets) {
        fill(0)
        noStroke()
        circle(target.x, target.y, 5)
    }
    // for (let attractor of attractors) {
    //     attractor.show();
    // }

    for (let mover of movers) {
       
        if (mover.name === "degrowth") {
            mover.seek(targets[0])
            // attractors[0].attract(mover)
        } else if (mover.name === "methods") {
            mover.seek(targets[1])
            // attractors[1].attract(mover)
        } else {
            mover.seek(targets[2])
            // attractors[2].attract(mover)
        }
        mover.update();
        mover.show();
    }

}

