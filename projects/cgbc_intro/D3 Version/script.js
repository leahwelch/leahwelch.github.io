const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
// const width = 1000;
// const height = 1000;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


const degrowth_coords = [width / 2, 100]
const methods_coords = [width / 4, (3 * height) / 4]
const becoming_coords = [(3 * width) / 4, (3 * height) / 4]

console.log(degrowth_coords)
console.log(methods_coords)
console.log(becoming_coords)

d3.json("./data/data.json").then(function (data) {

    data.projects.forEach((d) => {
        d.xCoord = (d.degrowth / 10 * degrowth_coords[0] + d.methods / 10 * methods_coords[0] + d.becoming / 10 * becoming_coords[0]) + Math.random(-1,1) * 100
        d.yCoord = (d.degrowth / 10 * degrowth_coords[1] + d.methods / 10 * methods_coords[1] + d.becoming / 10 * becoming_coords[1]) + Math.random(-1,1) * 100
    })
    console.log(data.projects)

    let links = []
    for(let i = 0; i < data.projects.length; i++) {
        //source
        //target
        if(data.projects[i].degrowth != 0) {
            links.push({
                sourceX: data.projects[i].xCoord,
                sourceY: data.projects[i].yCoord,
                targetX: degrowth_coords[0],
                targetY: degrowth_coords[1]
            })
        }

        if(data.projects[i].methods != 0) {
            links.push({
                sourceX: data.projects[i].xCoord,
                sourceY: data.projects[i].yCoord,
                targetX: methods_coords[0],
                targetY: methods_coords[1]
            })
        }

        if(data.projects[i].becoming != 0) {
            links.push({
                sourceX: data.projects[i].xCoord,
                sourceY: data.projects[i].yCoord,
                targetX: becoming_coords[0],
                targetY:becoming_coords[1]
            })
        }
    }

    console.log(links)


    svg.append("circle")
        .attr("cx", degrowth_coords[0])
        .attr("cy", degrowth_coords[1])
        .attr("r", 5)

    svg.append("circle")
        .attr("cx", methods_coords[0])
        .attr("cy", methods_coords[1])
        .attr("r", 5)

    svg.append("circle")
        .attr("cx", becoming_coords[0])
        .attr("cy", becoming_coords[1])
        .attr("r", 5)

    svg.selectAll(".node")
        .data(data.projects)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("cx", d => d.xCoord)
        .attr("cy", d => d.yCoord)

    svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke", "black")
        // .attr("d", function(d) {
        //     start = d.sourceX   
        //     end = d.targetX  
        //     return ["M", start, d.sourceY,    
        //       "A",                           
        //       (start - end)/1.5, ",",    
        //       (start - end)/1.5, 0, 0, ",",
        //       start < end ? 1 : 0, end, ",", d.targetY] 
        //       .join(" ");
        //   })
        .attr("x1", d => d.sourceX)
        .attr("x2", d => d.targetX)
        .attr("y1", d => d.sourceY)
        .attr("y2", d => d.targetY)
        .attr("opacity", 0.5)
        .style("stroke-width", 0.5)
        .style("fill", "none")


})