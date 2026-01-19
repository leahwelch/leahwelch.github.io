//COLORS
// #b0bbc8, #b99988, #d1b977

// from https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        var intX = p0_x + (t * s1_x);
        var intY = p0_y + (t * s1_y);
        return {
            x: intX,
            y: intY
        };
    }
    return false;
}

const width = 650,
    height = 650

const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

const radius = width / 2 - margin.left - margin.right
const rect_width = ((radius - radius / 4) / 2)

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// svg.append("circle")
//     .attr("class", "outer_ring")
//     .attr("cx", width / 2 + margin.left)
//     .attr("cy", height / 2 + margin.top)
//     .attr("r", radius)
//     .attr("stroke", "#b0bbc8")
//     .attr("fill", "none")

// svg.append("rect")
//     .attr("class", "vertical_rect")
//     .attr("x", width / 2 + margin.left - radius / 4)
//     .attr("y", height / 2 + margin.top - radius)
//     .attr("height", radius * 2)
//     .attr("width", radius / 2)
//     .attr("stroke", "#b0bbc8")
//     .attr("fill", "none")

// svg.append("rect")
//     .attr("class", "horizontal_rect")
//     .attr("x", width / 2 + margin.left - radius)
//     .attr("y", height / 2 + margin.top - radius / 4)
//     .attr("width", radius * 2)
//     .attr("height", radius / 2)
//     .attr("stroke", "#b0bbc8")
//     .attr("fill", "none")

// svg.append("circle")
//     .attr("class", "inner_ring")
//     .attr("cx", width / 2 + margin.left)
//     .attr("cy", height / 2 + margin.top)
//     .attr("r", radius / 4)
//     .attr("stroke", "#b0bbc8")
//     .attr("fill", "none")

const xScale = d3.scaleOrdinal()
    .domain(["Steady", "Reliable", "Tentative", "Detached", "Hopeful",
        "Stuck", "Frayed", "Fickle", "Strong", "Broken", "Estranged", "Thriving", "Shallow"])
    .range([
        width / 2 + margin.left, //STEADY
        width / 2 + margin.left, //RELIABLE
        width / 2 + margin.left, //TENATATIVE
        width / 2 + margin.left - radius / 4 - rect_width + 40, //DETACHED
        width / 2 + margin.left + radius / 4 + rect_width + 80, //HOPEFUL
        width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius / 4)), //STUCK
        width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius / 4)), //FRAYED
        width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius / 4)), //FICKLE
        width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius / 4)), //STRONG
        width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius * .75)), //BROKEN
        width / 2 + margin.left - (Math.cos(Math.PI / 4) * (rect_width + radius * .75)), //ESTRANGED
        width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius * .75)), //THRIVING
        width / 2 + margin.left + (Math.cos(Math.PI / 4) * (rect_width + radius * .75)) //SHALLOW
    ])

const yScale = d3.scaleOrdinal()
    .domain(["Steady", "Reliable", "Tentative", "Detached", "Hopeful",
        "Stuck", "Frayed", "Fickle", "Strong", "Broken", "Estranged", "Thriving", "Shallow"])
    .range([
        height / 2 + margin.top, //STEADY
        height / 2 + margin.top - radius / 4 - rect_width + 30, //RELIABLE
        height / 2 + margin.top + radius / 4 + rect_width + 60, //TENATATIVE
        height / 2 + margin.top, //DETACHED
        height / 2 + margin.top, //HOPEFUL
        height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius / 4)), //STUCK
        height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius / 4)), //FRAYED
        height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius / 4)), //FICKLE
        height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius / 4)), //STRONG
        height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius * .75)), //BROKEN
        height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius * .75)), //ESTRANGED
        height / 2 + margin.top - (Math.sin(Math.PI / 4) * (rect_width + radius * .75)), //THRIVING
        height / 2 + margin.top + (Math.sin(Math.PI / 4) * (rect_width + radius * .75)), //SHALLOW
    ])

d3.csv("./data/data.csv").then(function (data) {
    console.log(data)

    //Steady
    let steady = data.filter(d => d.name === "Steady")

    let steady_sim = d3.forceSimulation(steady)
        .force("x", d3.forceX().x(d => xScale(d.name)))
        .force("y", d3.forceY().y(d => yScale(d.name)))
        .force("collide", d3.forceCollide(3.5))

    let steady_node = svg.append("g")
        .selectAll("steady_node")
        .data(steady)
        .enter()
        .append("circle")
        .attr("class", "steady_node")
        .attr("r", 3)
        .attr("fill", "#b99988")

    steady_sim.on("tick", function () {
        steady_node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })

    svg.append("text")
        .attr("class", "category_label")
        .attr("x", width / 2 + margin.left)
        .attr("y", height / 2 + margin.top - radius / 4 + 20)
        .attr("fill", "#b99988")
        .text("Steady")
        .attr("text-anchor", "middle")

    //Reliable
    let reliable = data.filter(d => d.name === "Reliable")

    let reliable_sim = d3.forceSimulation(reliable)
        .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
        .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.03))
        .force("collide", d3.forceCollide(3.5))

    let reliable_node = svg.append("g")
        .selectAll(".reliable_node")
        .data(reliable)
        .enter()
        .append("circle")
        .attr("class", "reliable_node")
        .attr("r", 3)
        .attr("fill", "#b0bbc8")

    reliable_sim.on("tick", function () {
        reliable_node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })

    svg.append("text")
        .attr("class", "category_label")
        .attr("x", width / 2 + margin.left)
        .attr("y", height / 2 + margin.top - radius / 4 - 10)
        .attr("fill", "#b0bbc8")
        .text("Reliable")
        .attr("text-anchor", "middle")

    //Tentative
    let tentative = data.filter(d => d.name === "Tentative")

    let tentative_sim = d3.forceSimulation(tentative)
        .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
        .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.03))
        .force("collide", d3.forceCollide(3.5))

    let tentative_node = svg.append("g")
        .selectAll(".tentative_node")
        .data(tentative)
        .enter()
        .append("circle")
        .attr("class", "tentative_node")
        .attr("r", 3)
        .attr("fill", "#b0bbc8")

    tentative_sim.on("tick", function () {
        tentative_node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })

    svg.append("text")
        .attr("class", "category_label")
        .attr("x", width / 2 + margin.left)
        .attr("y", height / 2 + margin.top + radius / 4 + 20)
        .attr("fill", "#b0bbc8")
        .text("Tentative")
        .attr("text-anchor", "middle")

    //Detached
    let detached = data.filter(d => d.name === "Detached")

    let detached_sim = d3.forceSimulation(detached)
        .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.03))
        .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
        .force("collide", d3.forceCollide(3.5))

    let detached_node = svg.append("g")
        .selectAll(".detached_node")
        .data(detached)
        .enter()
        .append("circle")
        .attr("class", "detached_node")
        .attr("r", 3)
        .attr("fill", "#b0bbc8")

    detached_sim.on("tick", function () {
        detached_node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })

    svg.append("text")
        .attr("class", "category_label")
        .attr("x", width / 2 + margin.left - radius + 30)
        .attr("y", height / 2 + margin.top + radius / 4 - 10)
        .attr("fill", "#b0bbc8")
        .text("Detached")

    //Hopeful
    let hopeful = data.filter(d => d.name === "Hopeful")
    console.log(hopeful)

    let hopeful_sim = d3.forceSimulation(hopeful)
        .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.03))
        .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
        .force("collide", d3.forceCollide(3.5))

    let hopeful_node = svg.append("g")
        .selectAll(".hopeful_node")
        .data(hopeful)
        .enter()
        .append("circle")
        .attr("class", "hopeful_node")
        .attr("r", 3)
        .attr("fill", "#b0bbc8")

    hopeful_sim.on("tick", function () {
        hopeful_node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })

    svg.append("text")
        .attr("class", "category_label")
        .attr("x", width / 2 + margin.left + radius - 30)
        .attr("y", height / 2 + margin.top + radius / 4 - 10)
        .attr("fill", "#b0bbc8")
        .text("Hopeful")
        .attr("text-anchor", "end")

    //Stuck
    let stuck = data.filter(d => d.name === "Stuck")
    const stuck_triangle = [
        [width / 2 + margin.left - radius / 4, height / 2 + margin.left - radius],
        [width / 2 + margin.left - radius, height / 2 + margin.top - radius / 4],
        [width / 2 + margin.left - radius / 4, height / 2 + margin.top - radius / 4]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", stuck_triangle.join(" ")); // x,y points 

    const stuck_cent = d3.polygonCentroid(stuck_triangle)

    let stuck_force = d3.forceSimulation(stuck)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let stuck_node = svg.append("g")
        .selectAll(".stuck_node")
        .data(stuck)
        .enter()
        .append("circle")
        .attr("class", "stuck_node")
        .attr("r", 3)
        .attr("fill", "rgba(0,0,0,0.6)")

    stuck_force.on('tick', function (e) {
        stuck_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - stuck_cent[0])),
                y = (d.y - (0 - stuck_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(stuck_triangle[0][0], stuck_triangle[0][1],
                    stuck_triangle[1][0], stuck_triangle[1][1], stuck_cent[0], stuck_cent[1], x, y) ||
                getLineIntersection(stuck_triangle[1][0], stuck_triangle[1][1],
                    stuck_triangle[2][0], stuck_triangle[2][1], stuck_cent[0], stuck_cent[1], x, y) ||
                getLineIntersection(stuck_triangle[0][0], stuck_triangle[0][1],
                    stuck_triangle[2][0], stuck_triangle[2][1], stuck_cent[0], stuck_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    // svg.append("path")
    //     .attr("id", "stuck")
    //     .attr("d", `M ${height / 2 + margin.top - radius + 20},${width / 2 + margin.left + 40} a ${radius},${radius} 0 0,1 ${radius},${radius * -1 - 24}`)
    //     // .attr("stroke", "black")
    //     .attr("fill", "none")

    // svg.append("text")
    //     .attr("class", "category_label")
    //     .append("textPath")
    //     .attr("xlink:href", "#stuck")
    //     .style("text-anchor", "middle")
    //     .attr("startOffset", "50%")
    //     .text("Stuck")
    svg.append("text")
        .attr("class", "category_label")
        // .attr("x", width / 2 + margin.left - radius / 4 - 10)
        .attr("x", width / 2 + margin.left - radius + 30)
        .attr("y", height / 2 + margin.top - radius / 4 - 10)
        // .attr("text-anchor", "end")
        .text("Stuck")

    //Frayed
    let frayed = data.filter(d => d.name === "Frayed")
    const frayed_triangle = [
        [width / 2 + margin.left - radius / 4, height / 2 + margin.left + radius],
        [width / 2 + margin.left - radius, height / 2 + margin.top + radius / 4],
        [width / 2 + margin.left - radius / 4, height / 2 + margin.top + radius / 4]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", frayed_triangle.join(" ")); // x,y points 

    const frayed_cent = d3.polygonCentroid(frayed_triangle)

    let frayed_force = d3.forceSimulation(frayed)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let frayed_node = svg.append("g")
        .selectAll(".frayed_node")
        .data(frayed)
        .enter()
        .append("circle")
        .attr("class", "frayed_node")
        .attr("r", 3)
        .attr("fill", "rgba(0,0,0,0.6)")

    frayed_force.on('tick', function (e) {
        frayed_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - frayed_cent[0])),
                y = (d.y - (0 - frayed_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(frayed_triangle[0][0], frayed_triangle[0][1],
                    frayed_triangle[1][0], frayed_triangle[1][1], frayed_cent[0], frayed_cent[1], x, y) ||
                getLineIntersection(frayed_triangle[1][0], frayed_triangle[1][1],
                    frayed_triangle[2][0], frayed_triangle[2][1], frayed_cent[0], frayed_cent[1], x, y) ||
                getLineIntersection(frayed_triangle[0][0], frayed_triangle[0][1],
                    frayed_triangle[2][0], frayed_triangle[2][1], frayed_cent[0], frayed_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    svg.append("text")
        .attr("class", "category_label")
        // .attr("x", width / 2 + margin.left - radius / 4 - 10)
        .attr("x", width / 2 + margin.left - radius + 30)
        .attr("y", height / 2 + margin.top + radius / 4 + 20)
        // .attr("text-anchor", "end")
        .text("Frayed")

    //Fickle
    let fickle = data.filter(d => d.name === "Fickle")
    const fickle_triangle = [
        [width / 2 + margin.left + radius / 4, height / 2 + margin.left + radius],
        [width / 2 + margin.left + radius, height / 2 + margin.top + radius / 4],
        [width / 2 + margin.left + radius / 4, height / 2 + margin.top + radius / 4]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", fickle_triangle.join(" ")); // x,y points 

    const fickle_cent = d3.polygonCentroid(fickle_triangle)

    let fickle_force = d3.forceSimulation(fickle)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let fickle_node = svg.append("g")
        .selectAll(".fickle_node")
        .data(fickle)
        .enter()
        .append("circle")
        .attr("class", "fickle_node")
        .attr("r", 3)
        .attr("fill", "rgba(0,0,0,0.6)")

    fickle_force.on('tick', function (e) {
        fickle_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - fickle_cent[0])),
                y = (d.y - (0 - fickle_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(fickle_triangle[0][0], fickle_triangle[0][1],
                    fickle_triangle[1][0], fickle_triangle[1][1], fickle_cent[0], fickle_cent[1], x, y) ||
                getLineIntersection(fickle_triangle[1][0], fickle_triangle[1][1],
                    fickle_triangle[2][0], fickle_triangle[2][1], fickle_cent[0], fickle_cent[1], x, y) ||
                getLineIntersection(fickle_triangle[0][0], fickle_triangle[0][1],
                    fickle_triangle[2][0], fickle_triangle[2][1], fickle_cent[0], fickle_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    svg.append("text")
        .attr("class", "category_label")
        // .attr("x", width / 2 + margin.left - radius / 4 - 10)
        .attr("x", width / 2 + margin.left + radius - 30)
        .attr("y", height / 2 + margin.top + radius / 4 + 20)
        .attr("text-anchor", "end")
        .text("Fickle")

    //Strong
    let strong = data.filter(d => d.name === "Strong")
    const strong_triangle = [
        [width / 2 + margin.left + radius / 4, height / 2 + margin.left - radius - 40],
        [width / 2 + margin.left + radius + 40, height / 2 + margin.top - radius / 4],
        [width / 2 + margin.left + radius / 4, height / 2 + margin.top - radius / 4]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", strong_triangle.join(" ")); // x,y points 

    const strong_cent = d3.polygonCentroid(strong_triangle)

    let strong_force = d3.forceSimulation(strong)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let strong_node = svg.append("g")
        .selectAll(".strong_node")
        .data(strong)
        .enter()
        .append("circle")
        .attr("class", "strong_node")
        .attr("r", 3)
        .attr("fill", "rgba(0,0,0,0.6)")

    strong_force.on('tick', function (e) {
        strong_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - strong_cent[0])),
                y = (d.y - (0 - strong_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(strong_triangle[0][0], strong_triangle[0][1],
                    strong_triangle[1][0], strong_triangle[1][1], strong_cent[0], strong_cent[1], x, y) ||
                getLineIntersection(strong_triangle[1][0], strong_triangle[1][1],
                    strong_triangle[2][0], strong_triangle[2][1], strong_cent[0], strong_cent[1], x, y) ||
                getLineIntersection(strong_triangle[0][0], strong_triangle[0][1],
                    strong_triangle[2][0], strong_triangle[2][1], strong_cent[0], strong_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    svg.append("text")
        .attr("class", "category_label")
        // .attr("x", width / 2 + margin.left - radius / 4 - 10)
        .attr("x", width / 2 + margin.left + radius - 30)
        .attr("y", height / 2 + margin.top - radius / 4 - 10)
        .attr("text-anchor", "end")
        .text("Strong")

    //Broken
    let broken = data.filter(d => d.name === "Broken")
    const broken_triangle = [
        [width / 2 + margin.left - radius / 4 - 50, height / 2 + margin.left + radius],
        [width / 2 + margin.left - radius, height / 2 + margin.top + radius / 4 + 50],
        [width / 2 + margin.left - radius, height / 2 + margin.top + radius]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", broken_triangle.join(" ")); // x,y points 

    const broken_cent = d3.polygonCentroid(broken_triangle)

    let broken_force = d3.forceSimulation(broken)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let broken_node = svg.append("g")
        .selectAll(".broken_node")
        .data(broken)
        .enter()
        .append("circle")
        .attr("class", "broken_node")
        .attr("r", 3)
        .attr("fill", "#d1b977")

    broken_force.on('tick', function (e) {
        broken_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - broken_cent[0])),
                y = (d.y - (0 - broken_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(broken_triangle[0][0], broken_triangle[0][1],
                    broken_triangle[1][0], broken_triangle[1][1], broken_cent[0], broken_cent[1], x, y) ||
                getLineIntersection(broken_triangle[1][0], broken_triangle[1][1],
                    broken_triangle[2][0], broken_triangle[2][1], broken_cent[0], broken_cent[1], x, y) ||
                getLineIntersection(broken_triangle[0][0], broken_triangle[0][1],
                    broken_triangle[2][0], broken_triangle[2][1], broken_cent[0], broken_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    //d="M20,40 a20,20 0 0,1 -20,-20"
    svg.append("path")
        .attr("id", "broken")
        .attr("d", `M ${(height / 2 + margin.top - 12)},${(width / 2 + margin.left + 12) + radius} a ${radius},${radius} 0 0,1 ${radius * -1},${radius * -1 + 24}`)
        //.attr("stroke", "black")
        .attr("fill", "none")

    svg.append("text")
        .attr("class", "category_label")
        .append("textPath")
        .attr("xlink:href", "#broken")
        .style("text-anchor", "middle")
        .attr("startOffset", "75%")
        .text("Broken")
        .attr("fill", "#d1b977")

    //Estranged
    let estranged = data.filter(d => d.name === "Estranged")
    const estranged_triangle = [
        [width / 2 + margin.left - radius / 4 - 50, height / 2 + margin.left - radius],
        [width / 2 + margin.left - radius, height / 2 + margin.top - radius / 4 - 50],
        [width / 2 + margin.left - radius, height / 2 + margin.top - radius]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", estranged_triangle.join(" ")); // x,y points 

    const estranged_cent = d3.polygonCentroid(estranged_triangle)

    let estranged_force = d3.forceSimulation(estranged)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let estranged_node = svg.append("g")
        .selectAll(".estranged_node")
        .data(estranged)
        .enter()
        .append("circle")
        .attr("class", "estranged_node")
        .attr("r", 3)
        .attr("fill", "#d1b977")

    estranged_force.on('tick', function (e) {
        estranged_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - estranged_cent[0])),
                y = (d.y - (0 - estranged_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(estranged_triangle[0][0], estranged_triangle[0][1],
                    estranged_triangle[1][0], estranged_triangle[1][1], estranged_cent[0], estranged_cent[1], x, y) ||
                getLineIntersection(estranged_triangle[1][0], estranged_triangle[1][1],
                    estranged_triangle[2][0], estranged_triangle[2][1], estranged_cent[0], estranged_cent[1], x, y) ||
                getLineIntersection(estranged_triangle[0][0], estranged_triangle[0][1],
                    estranged_triangle[2][0], estranged_triangle[2][1], estranged_cent[0], estranged_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })
    //d="M0,20 a20,20 0 0,1 20,-20"
    svg.append("path")
        .attr("id", "estranged")
        .attr("d", `M ${height / 2 + margin.top - radius - 12},${width / 2 + margin.left + 12} a ${radius},${radius} 0 0,1 ${radius},${radius * -1 - 24}`)
        // .attr("stroke", "black")
        .attr("fill", "none")

    svg.append("text")
        .attr("class", "category_label")
        .append("textPath")
        .attr("xlink:href", "#estranged")
        .style("text-anchor", "middle")
        .attr("startOffset", "75%")
        .text("Estranged")
        .attr("fill", "#d1b977")

    //Thriving 
    let thriving = data.filter(d => d.name === "Thriving")
    const thriving_triangle = [
        [width / 2 + margin.left + radius / 4 + 50, height / 2 + margin.left - radius],
        [width / 2 + margin.left + radius, height / 2 + margin.top - radius / 4 - 50],
        [width / 2 + margin.left + radius, height / 2 + margin.top - radius]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", thriving_triangle.join(" ")); // x,y points

    const thriving_cent = d3.polygonCentroid(thriving_triangle)

    let thriving_force = d3.forceSimulation(thriving)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let thriving_node = svg.append("g")
        .selectAll(".thriving_node")
        .data(thriving)
        .enter()
        .append("circle")
        .attr("class", "thriving_node")
        .attr("r", 3)
        .attr("fill", "#d1b977")

    thriving_force.on('tick', function (e) {
        thriving_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - thriving_cent[0])),
                y = (d.y - (0 - thriving_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(thriving_triangle[0][0], thriving_triangle[0][1],
                    thriving_triangle[1][0], thriving_triangle[1][1], thriving_cent[0], thriving_cent[1], x, y) ||
                getLineIntersection(thriving_triangle[1][0], thriving_triangle[1][1],
                    thriving_triangle[2][0], thriving_triangle[2][1], thriving_cent[0], thriving_cent[1], x, y) ||
                getLineIntersection(thriving_triangle[0][0], thriving_triangle[0][1],
                    thriving_triangle[2][0], thriving_triangle[2][1], thriving_cent[0], thriving_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    // d="M20,0 a20,20 0 0,1 20,20"
    svg.append("path")
        .attr("id", "thriving")
        .attr("d", `M ${width / 2 + margin.left + 12},${height / 2 + margin.top - radius - 12} a ${radius},${radius} 0 0,1 ${radius},${radius}`)
        // .attr("stroke", "black")
        .attr("fill", "none")

    svg.append("text")
        .attr("class", "category_label")
        .append("textPath")
        .attr("xlink:href", "#thriving")
        .style("text-anchor", "middle")
        .attr("startOffset", "25%")
        .text("Thriving")
        .attr("fill", "#d1b977")

    //Shallow
    let shallow = data.filter(d => d.name === "Shallow")
    const shallow_triangle = [
        [width / 2 + margin.left + radius / 4 + 50, height / 2 + margin.left + radius],
        [width / 2 + margin.left + radius, height / 2 + margin.top + radius / 4 + 50],
        [width / 2 + margin.left + radius, height / 2 + margin.top + radius]
    ];

    //DEBUGGER TRIANGLE
    // svg.append("polygon") // attach a polygon
    //     .style("stroke", "red") // colour the line
    //     .style("fill", "none") // remove any fill colour
    //     .attr("points", shallow_triangle.join(" ")); // x,y points 

    const shallow_cent = d3.polygonCentroid(shallow_triangle)

    let shallow_force = d3.forceSimulation(shallow)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    let shallow_node = svg.append("g")
        .selectAll(".shallow_node")
        .data(shallow)
        .enter()
        .append("circle")
        .attr("class", "shallow_node")
        .attr("r", 3)
        .attr("fill", "#d1b977")

    shallow_force.on('tick', function (e) {
        shallow_node.attr('transform', function (d) {
            // change focus to the center of the triangle
            let x = (d.x - (0 - shallow_cent[0])),
                y = (d.y - (0 - shallow_cent[1]));

            // test intersections on all 3 edges
            let i =
                getLineIntersection(shallow_triangle[0][0], shallow_triangle[0][1],
                    shallow_triangle[1][0], shallow_triangle[1][1], shallow_cent[0], shallow_cent[1], x, y) ||
                getLineIntersection(shallow_triangle[1][0], shallow_triangle[1][1],
                    shallow_triangle[2][0], shallow_triangle[2][1], shallow_cent[0], shallow_cent[1], x, y) ||
                getLineIntersection(shallow_triangle[0][0], shallow_triangle[0][1],
                    shallow_triangle[2][0], shallow_triangle[2][1], shallow_cent[0], shallow_cent[1], x, y) ||
                false;

            // set it to intersection
            if (i) {
                x = i.x;
                y = i.y;
            }

            return "translate(" + x + "," + y + ")";
        });
    })

    // d="M40,20 a20,20 0 0,1 -20,20"
    svg.append("path")
        .attr("id", "shallow")
        .attr("d", `M ${(width / 2 + margin.left + 12) + radius},${(height / 2 + margin.top - 12)} a ${radius},${radius} 0 0,1 ${radius * -1},${radius + 24}`)
        // .attr("stroke", "black")
        .attr("fill", "none")

    svg.append("text")
        .attr("class", "category_label")
        .append("textPath")
        .attr("xlink:href", "#shallow")
        .style("text-anchor", "middle")
        .attr("startOffset", "30%")
        .text("Shallow")
        .attr("fill", "#d1b977")

})






