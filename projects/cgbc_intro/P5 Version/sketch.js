const width = 800;
const height = 800;

const degrowth_coords = [width / 2, height / 4]
const methods_coords = [width / 4, (3 * height) / 4]
const becoming_coords = [(3 * width) / 4, (3 * height) / 4]

let walkers = [];
let links = [];

function preload() {
    json = loadJSON("./data/data.json");
}

function setup() {
    canvas = createCanvas(width, height);
    canvas.position(0, 0);
    // frameRate(10);
    json.projects.forEach((d) => {
        d.xCoord = (d.degrowth / 10 * degrowth_coords[0] + d.methods / 10 * methods_coords[0] + d.becoming / 10 * becoming_coords[0]) + Math.random(-1,1) * 100
        d.yCoord = (d.degrowth / 10 * degrowth_coords[1] + d.methods / 10 * methods_coords[1] + d.becoming / 10 * becoming_coords[1]) + Math.random(-1,1) * 100
    })
   
    for(let i = 0; i < json.projects.length; i++) {
        walkers.push(new Walker(json.projects[i].xCoord, json.projects[i].yCoord));
    }

    for(let i = 0; i < json.projects.length; i++) {
        //source
        //target
        if(json.projects[i].degrowth != 0) {
            links.push({
                sourceX: json.projects[i].xCoord,
                sourceY: json.projects[i].yCoord,
                targetX: degrowth_coords[0],
                targetY: degrowth_coords[1]
            })
        }

        if(json.projects[i].methods != 0) {
            links.push({
                sourceX: json.projects[i].xCoord,
                sourceY: json.projects[i].yCoord,
                targetX: methods_coords[0],
                targetY: methods_coords[1]
            })
        }

        if(json.projects[i].becoming != 0) {
            links.push({
                sourceX: json.projects[i].xCoord,
                sourceY: json.projects[i].yCoord,
                targetX: becoming_coords[0],
                targetY:becoming_coords[1]
            })
        }
    }

}

function draw() {
    background(255);

    fill(0);
    noStroke();
    circle(degrowth_coords[0], degrowth_coords[1], 5);
    circle(methods_coords[0], methods_coords[1], 5);
    circle(becoming_coords[0], becoming_coords[1], 5);
    
    for(let w of walkers) {
        w.show();
        w.update();
    }

    // for(let link of links) {
    //     stroke(0,0,0,80)
    //     line(link.sourceX, link.sourceY, link.targetX, link.targetY)
    // }
   
   

}