let movers = [];
let attractors = [];
let size_attractors = [];

const width = 400;
const height = 600;

const degrowth_coords = [(width - 100) / 2, (height) / 4]
const methods_coords = [(width - 100) / 4, (3 * (height - 100)) / 4]
const becoming_coords = [(3 * (width - 100)) / 4, (3 * (height - 100)) / 4]

function preload() {
    json = loadJSON("./data/data.json");
    fontRegular = loadFont('assets/TTFirsNeue-Regular.otf');
    fontMedium = loadFont('assets/TTFirsNeue-Medium.otf');
}

function setup() {
    frameRate(20)
    let canvas = createCanvas(1500,1000);
    canvas.position(0, 0);

    json.projects.forEach((d) => {
        d.xCoord = (d.degrowth / 10 * degrowth_coords[0] + d.methods / 10 * methods_coords[0] + d.becoming / 10 * becoming_coords[0]) + Math.random(-1, 1) * 100
        d.yCoord = (d.degrowth / 10 * degrowth_coords[1] + d.methods / 10 * methods_coords[1] + d.becoming / 10 * becoming_coords[1]) + Math.random(-1, 1) * 100
    })

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
        console.log(link_list)
        movers.push(new Mover(json.projects[i].xCoord, json.projects[i].yCoord, json.projects[i].primary, link_list, json.projects[i].id, json.projects[i].discipline, json.projects[i].size));
    }

    attractors.push(new Attractor(degrowth_coords[0], degrowth_coords[1], 50))
    attractors.push(new Attractor(methods_coords[0], methods_coords[1], 50))
    attractors.push(new Attractor(becoming_coords[0], becoming_coords[1], 50))

    for (let i = 0; i < 11; i++) {
        size_attractors.push(new Attractor(map(i, 0, 10, 50, width - 50), height / 2, 50))
    }
    console.log(size_attractors)

}

function draw() {
    background(37, 47, 45);
    translate(250,250);

    noStroke();
    // fill(170, 117, 56);
    fill(255);
    textSize(14);
    textFont(fontMedium);
    text('Degrowth, Regrowth', degrowth_coords[0] + 5, degrowth_coords[1] + 5, 100);
    text('Methods, Standards, Protocols', methods_coords[0] -80, methods_coords[1] + 5, 100);
    text('Continuously-Becoming Design', becoming_coords[0] +5 , becoming_coords[1] + 5, 100);
    for (let attractor of attractors) {
        attractor.show();
    }

    for (let mover of movers) {
        mover.update();
        mover.show();
        if (mover.name === "degrowth") {
            attractors[0].attract(mover)
        } else if (mover.name === "methods") {
            attractors[1].attract(mover)
        } else {
            attractors[2].attract(mover)
        }
    }

    

}

