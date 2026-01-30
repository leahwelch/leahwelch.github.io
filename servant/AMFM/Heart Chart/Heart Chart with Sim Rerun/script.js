//Function to set up the tabs interaction
function status(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("status_tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function length(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("length_tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function kids(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("kids_tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function age(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("age_tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function gender(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("gender_tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function zeroState(selection) {
    selection.attr('r', 0);
}

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

const married_btn = d3.select("#married")

const radius = width / 2 - margin.left - margin.right
const rect_width = ((radius - radius / 4) / 2)

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

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
console.log(yScale("Tentative"))

d3.csv("./data/data_detailed.csv").then(function (data) {
    console.log(data)

    //Steady
    let steady = data.filter(d => d.name === "Steady")

    let steady_sim = d3.forceSimulation(steady)
        .force("x", d3.forceX().x(d => xScale(d.name)))
        .force("y", d3.forceY().y(d => yScale(d.name)))
        .force("collide", d3.forceCollide(3.5))

    function run_steady(dataset) {
        let steady_node = svg.selectAll(".steady_node")
            .data(dataset)

        steady_node.enter()
            .append("circle")
            .attr("class", "node steady_node")
            .call(zeroState)
            .merge(steady_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#b99988")

        steady_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_steady(steady)

    steady_sim.on("tick", function () {
        svg.selectAll(".steady_node")
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

    function run_reliable(dataset) {
        let reliable_node = svg.selectAll(".reliable_node")
            .data(dataset)

        reliable_node.enter()
            .append("circle")
            .attr("class", "node reliable_node")
            .call(zeroState)
            .merge(reliable_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#b0bbc8")

        reliable_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_reliable(reliable)

    reliable_sim.on("tick", function () {
        svg.selectAll(".reliable_node")
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
        .force("y", d3.forceY().y(d => yScale("Tentative")).strength(0.03))
        .force("collide", d3.forceCollide(3.5))

    function run_tentative(dataset) {
        let tentative_node = svg.selectAll(".tentative_node")
            .data(dataset)

        tentative_node.enter()
            .append("circle")
            .attr("class", "node tentative_node")
            .call(zeroState)
            .merge(tentative_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#b0bbc8")

        tentative_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_tentative(tentative)

    tentative_sim.on("tick", function () {
        svg.selectAll(".tentative_node")
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

    function run_detached(dataset) {
        let detached_node = svg.selectAll(".detached_node")
            .data(dataset)

        detached_node.enter()
            .append("circle")
            .attr("class", "node detached_node")
            .call(zeroState)
            .merge(detached_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#b0bbc8")

        detached_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_detached(detached)

    detached_sim.on("tick", function () {
        svg.selectAll(".detached_node")
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

    let hopeful_sim = d3.forceSimulation(hopeful)
        .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.03))
        .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
        .force("collide", d3.forceCollide(3.5))

    function run_hopeful(dataset) {
        let hopeful_node = svg.selectAll(".hopeful_node")
            .data(dataset)

        hopeful_node.enter()
            .append("circle")
            .attr("class", "node hopeful_node")
            .call(zeroState)
            .merge(hopeful_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#b0bbc8")

        hopeful_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_hopeful(hopeful)

    hopeful_sim.on("tick", function () {
        svg.selectAll(".hopeful_node")
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

    function run_stuck(dataset) {
        let stuck_node = svg.selectAll(".stuck_node")
            .data(dataset)

        stuck_node.enter()
            .append("circle")
            .attr("class", "node stuck_node")
            .call(zeroState)
            .merge(stuck_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "rgba(0,0,0,0.6)")

        stuck_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_stuck(stuck)

    stuck_force.on('tick', function (e) {
        svg.selectAll(".stuck_node").attr('transform', function (d) {
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

    const frayed_cent = d3.polygonCentroid(frayed_triangle)

    let frayed_force = d3.forceSimulation(frayed)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    function run_frayed(dataset) {
        let frayed_node = svg.selectAll(".frayed_node")
            .data(dataset)

        frayed_node.enter()
            .append("circle")
            .attr("class", "node frayed_node")
            .call(zeroState)
            .merge(frayed_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "rgba(0,0,0,0.6)")

        frayed_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }
    run_frayed(frayed)

    frayed_force.on('tick', function (e) {
        svg.selectAll(".frayed_node").attr('transform', function (d) {
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
        .attr("x", width / 2 + margin.left - radius + 30)
        .attr("y", height / 2 + margin.top + radius / 4 + 20)
        .text("Frayed")

    //Fickle
    let fickle = data.filter(d => d.name === "Fickle")
    const fickle_triangle = [
        [width / 2 + margin.left + radius / 4, height / 2 + margin.left + radius],
        [width / 2 + margin.left + radius, height / 2 + margin.top + radius / 4],
        [width / 2 + margin.left + radius / 4, height / 2 + margin.top + radius / 4]
    ];

    const fickle_cent = d3.polygonCentroid(fickle_triangle)

    let fickle_force = d3.forceSimulation(fickle)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    function run_fickle(dataset) {
        let fickle_node = svg.selectAll(".fickle_node")
            .data(dataset)

        fickle_node.enter()
            .append("circle")
            .attr("class", "node fickle_node")
            .call(zeroState)
            .merge(fickle_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "rgba(0,0,0,0.6)")

        fickle_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_fickle(fickle)

    fickle_force.on('tick', function (e) {
        svg.selectAll(".fickle_node").attr('transform', function (d) {
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

    const strong_cent = d3.polygonCentroid(strong_triangle)

    function run_strong(dataset) {
        let strong_node = svg.selectAll(".strong_node")
            .data(dataset)

        strong_node.enter()
            .append("circle")
            .attr("class", "node strong_node")
            .call(zeroState)
            .merge(strong_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "rgba(0,0,0,0.6)")

        strong_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_strong(strong)

    let strong_force = d3.forceSimulation(strong)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    strong_force.on('tick', function (e) {
        svg.selectAll(".strong_node").attr('transform', function (d) {
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

    const broken_cent = d3.polygonCentroid(broken_triangle)

    function run_broken(dataset) {
        let broken_node = svg.selectAll(".broken_node")
            .data(dataset)

        broken_node.enter()
            .append("circle")
            .attr("class", "node broken_node")
            .call(zeroState)
            .merge(broken_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#d1b977")

        broken_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_broken(broken)

    let broken_force = d3.forceSimulation(broken)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    broken_force.on('tick', function (e) {
        svg.selectAll(".broken_node").attr('transform', function (d) {
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

    const estranged_cent = d3.polygonCentroid(estranged_triangle)

    function run_estranged(dataset) {
        let estranged_node = svg.selectAll(".estranged_node")
            .data(dataset)

        estranged_node.enter()
            .append("circle")
            .attr("class", "node estranged_node")
            .call(zeroState)
            .merge(estranged_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#d1b977")

        estranged_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_estranged(estranged)

    let estranged_force = d3.forceSimulation(estranged)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    estranged_force.on('tick', function (e) {
        svg.selectAll(".estranged_node").attr('transform', function (d) {
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

    const thriving_cent = d3.polygonCentroid(thriving_triangle)

    function run_thriving(dataset) {
        let thriving_node = svg.selectAll(".thriving_node")
            .data(dataset)

        thriving_node.enter()
            .append("circle")
            .attr("class", "node thriving_node")
            .call(zeroState)
            .merge(thriving_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#d1b977")

        thriving_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_thriving(thriving)

    let thriving_force = d3.forceSimulation(thriving)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    thriving_force.on('tick', function (e) {
        svg.selectAll(".thriving_node").attr('transform', function (d) {
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

    const shallow_cent = d3.polygonCentroid(shallow_triangle)

    function run_shallow(dataset) {
        let shallow_node = svg.selectAll(".shallow_node")
            .data(dataset)

        shallow_node.enter()
            .append("circle")
            .attr("class", "node shallow_node")
            .call(zeroState)
            .merge(shallow_node)
            .transition()
            .duration(500)
            .attr("r", 3)
            .attr("fill", "#d1b977")

        shallow_node.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove()
    }

    run_shallow(shallow)

    let shallow_force = d3.forceSimulation(shallow)
        .force("collide", d3.forceCollide(3.5))
        .force("charge", d3.forceManyBody().strength(1))

    shallow_force.on('tick', function (e) {
        svg.selectAll(".shallow_node").attr('transform', function (d) {
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

    let selected_status = "all"
    let selected_length = "all"
    let selected_kids = "all"
    let selected_age = "all"
    let selected_gender = "all"

    let params = [
        {
            type: 'status',
            selection: ''
        },
        {
            type: 'length',
            selection: ''
        },
        {
            type: 'kids',
            selection: ''
        },
        {
            type: 'age',
            selection: ''
        },
        {
            type: 'gender',
            selection: ''
        }
    ]

    function apply_selections() {
        let selection_set = []
        for (let i = 0; i < params.length; i++) {
            if (params[i].selection != '') {
                selection_set.push(params[i])
            }
        }

        let filtered_steady, filtered_reliable, filtered_tentative, filtered_detached, filtered_hopeful, filtered_stuck, filtered_frayed
        let filtered_fickle, filtered_strong, filtered_broken, filtered_estranged, filtered_thriving, filtered_shallow
        if (selected_status === "all" && selected_length === "all" && selected_kids === "all" && selected_age === "all" && selected_gender === "all") {

            filtered_steady = steady
            filtered_reliable = reliable
            filtered_tentative = tentative
            filtered_detached = detached
            filtered_hopeful = hopeful
            filtered_stuck = stuck
            filtered_frayed = frayed
            filtered_fickle = fickle
            filtered_strong = strong
            filtered_broken = broken
            filtered_estranged = estranged
            filtered_thriving = thriving
            filtered_shallow = shallow

            run_steady(filtered_steady)
            let steady_sim_update = d3.forceSimulation(filtered_steady)
                .force("x", d3.forceX().x(d => xScale(d.name)))
                .force("y", d3.forceY().y(d => yScale(d.name)))
                .force("collide", d3.forceCollide(3.5))

            steady_sim_update.on("tick", function () {
                svg.selectAll(".steady_node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            })

            run_reliable(filtered_reliable)
            let reliable_sim_update = d3.forceSimulation(filtered_reliable)
                .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                .force("y", d3.forceY().y(d => yScale(d.name) - 50).strength(0.03))
                .force("collide", d3.forceCollide(3.5))

            reliable_sim_update.on("tick", function () {
                svg.selectAll(".reliable_node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            })

            run_tentative(filtered_tentative)
            let tentative_sim_update = d3.forceSimulation(filtered_tentative)
                .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                .force("y", d3.forceY().y(d => yScale(d.name) - 50).strength(0.03))
                .force("collide", d3.forceCollide(3.5))

            tentative_sim_update.on("tick", function () {
                svg.selectAll(".tentative_node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            })

            run_detached(filtered_detached)
            let detached_sim_update = d3.forceSimulation(filtered_detached)
                .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                .force("collide", d3.forceCollide(3.5))

            detached_sim_update.on("tick", function () {
                svg.selectAll(".detached_node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            })

            run_hopeful(filtered_hopeful)
            let hopeful_sim_update = d3.forceSimulation(filtered_hopeful)
                .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                .force("collide", d3.forceCollide(3.5))

            hopeful_sim_update.on("tick", function () {
                svg.selectAll(".hopeful_node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            })

            run_stuck(filtered_stuck)
            let stuck_force_update = d3.forceSimulation(filtered_stuck)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            stuck_force_update.on('tick', function (e) {
                svg.selectAll(".stuck_node").attr('transform', function (d) {
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

            run_frayed(filtered_frayed)
            let frayed_force_update = d3.forceSimulation(filtered_frayed)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            frayed_force_update.on('tick', function (e) {
                svg.selectAll(".frayed_node").attr('transform', function (d) {
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

            run_fickle(filtered_fickle)
            let fickle_force_update = d3.forceSimulation(filtered_fickle)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            fickle_force_update.on('tick', function (e) {
                svg.selectAll(".fickle_node").attr('transform', function (d) {
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

            run_strong(filtered_strong)
            let strong_force_update = d3.forceSimulation(filtered_strong)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            strong_force_update.on('tick', function (e) {
                svg.selectAll(".strong_node").attr('transform', function (d) {
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

            run_broken(filtered_broken)
            let broken_force_update = d3.forceSimulation(filtered_broken)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            broken_force_update.on('tick', function (e) {
                svg.selectAll(".broken_node").attr('transform', function (d) {
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

            run_estranged(filtered_estranged)
            let estranged_force_update = d3.forceSimulation(filtered_estranged)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            estranged_force_update.on('tick', function (e) {
                svg.selectAll(".estranged_node").attr('transform', function (d) {
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

            run_thriving(filtered_thriving)
            let thriving_force_update = d3.forceSimulation(filtered_thriving)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            thriving_force_update.on('tick', function (e) {
                svg.selectAll(".thriving_node").attr('transform', function (d) {
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

            run_shallow(filtered_shallow)
            let shallow_force_update = d3.forceSimulation(filtered_shallow)
                .force("collide", d3.forceCollide(3.5))
                .force("charge", d3.forceManyBody().strength(1))

            shallow_force_update.on('tick', function (e) {
                svg.selectAll(".shallow_node").attr('transform', function (d) {
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

        } else {
            if (selection_set.length == 1) {
                filtered_steady = steady.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_steady(filtered_steady)

                let steady_sim_update = d3.forceSimulation(filtered_steady)
                    .force("x", d3.forceX().x(d => xScale(d.name)))
                    .force("y", d3.forceY().y(d => yScale(d.name)))
                    .force("collide", d3.forceCollide(3.5))

                steady_sim_update.on("tick", function () {
                    svg.selectAll(".steady_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_reliable = reliable.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_reliable(filtered_reliable)

                let reliable_sim_update = d3.forceSimulation(filtered_reliable)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name) - 50).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                reliable_sim_update.on("tick", function () {
                    svg.selectAll(".reliable_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_tentative = tentative.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_tentative(filtered_tentative)

                let tentative_sim_update = d3.forceSimulation(filtered_tentative)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale("Tentative") - 100).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                tentative_sim_update.on("tick", function () {
                    svg.selectAll(".tentative_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_detached = detached.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_detached(filtered_detached)
                let detached_sim_update = d3.forceSimulation(filtered_detached)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                detached_sim_update.on("tick", function () {
                    svg.selectAll(".detached_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_hopeful = hopeful.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_hopeful(filtered_hopeful)
                let hopeful_sim_update = d3.forceSimulation(filtered_hopeful)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                hopeful_sim_update.on("tick", function () {
                    svg.selectAll(".hopeful_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_stuck = stuck.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_stuck(filtered_stuck)
                let stuck_force_update = d3.forceSimulation(filtered_stuck)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                stuck_force_update.on('tick', function (e) {
                    svg.selectAll(".stuck_node").attr('transform', function (d) {
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

                filtered_frayed = frayed.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_frayed(filtered_frayed)
                let frayed_force_update = d3.forceSimulation(filtered_frayed)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                frayed_force_update.on('tick', function (e) {
                    svg.selectAll(".frayed_node").attr('transform', function (d) {
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

                filtered_fickle = fickle.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_fickle(filtered_fickle)
                let fickle_force_update = d3.forceSimulation(filtered_fickle)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                fickle_force_update.on('tick', function (e) {
                    svg.selectAll(".fickle_node").attr('transform', function (d) {
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

                filtered_strong = strong.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_strong(filtered_strong)
                let strong_force_update = d3.forceSimulation(filtered_strong)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                strong_force_update.on('tick', function (e) {
                    svg.selectAll(".strong_node").attr('transform', function (d) {
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

                filtered_broken = broken.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_broken(filtered_broken)
                let broken_force_update = d3.forceSimulation(filtered_broken)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                broken_force_update.on('tick', function (e) {
                    svg.selectAll(".broken_node").attr('transform', function (d) {
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

                filtered_estranged = estranged.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_estranged(filtered_estranged)
                let estranged_force_update = d3.forceSimulation(filtered_estranged)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                estranged_force_update.on('tick', function (e) {
                    svg.selectAll(".estranged_node").attr('transform', function (d) {
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

                filtered_thriving = thriving.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_thriving(filtered_thriving)
                let thriving_force_update = d3.forceSimulation(filtered_thriving)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                thriving_force_update.on('tick', function (e) {
                    svg.selectAll(".thriving_node").attr('transform', function (d) {
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

                filtered_shallow = shallow.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
                run_shallow(filtered_shallow)
                let shallow_force_update = d3.forceSimulation(filtered_shallow)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(3))

                shallow_force_update.on('tick', function (e) {
                    svg.selectAll(".shallow_node").attr('transform', function (d) {
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
            } else if (selection_set.length == 2) {
                filtered_steady = steady.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_steady(filtered_steady)

                let steady_sim_update = d3.forceSimulation(filtered_steady)
                    .force("x", d3.forceX().x(d => xScale(d.name)))
                    .force("y", d3.forceY().y(d => yScale(d.name)))
                    .force("collide", d3.forceCollide(3.5))

                steady_sim_update.on("tick", function () {
                    svg.selectAll(".steady_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_reliable = reliable.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_reliable(filtered_reliable)

                let reliable_sim_update = d3.forceSimulation(filtered_reliable)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                reliable_sim_update.on("tick", function () {
                    svg.selectAll(".reliable_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_tentative = tentative.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_tentative(filtered_tentative)

                let tentative_sim_update = d3.forceSimulation(filtered_tentative)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name) - 100).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                tentative_sim_update.on("tick", function () {
                    svg.selectAll(".tentative_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_detached = detached.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_detached(filtered_detached)
                let detached_sim_update = d3.forceSimulation(filtered_detached)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                detached_sim_update.on("tick", function () {
                    svg.selectAll(".detached_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_hopeful = hopeful.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_hopeful(filtered_hopeful)
                let hopeful_sim_update = d3.forceSimulation(filtered_hopeful)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                hopeful_sim_update.on("tick", function () {
                    svg.selectAll(".hopeful_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_stuck = stuck.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_stuck(filtered_stuck)
                let stuck_force_update = d3.forceSimulation(filtered_stuck)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                stuck_force_update.on('tick', function (e) {
                    svg.selectAll(".stuck_node").attr('transform', function (d) {
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

                filtered_frayed = frayed.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_frayed(filtered_frayed)
                let frayed_force_update = d3.forceSimulation(filtered_frayed)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                frayed_force_update.on('tick', function (e) {
                    svg.selectAll(".frayed_node").attr('transform', function (d) {
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

                filtered_fickle = fickle.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_fickle(filtered_fickle)
                let fickle_force_update = d3.forceSimulation(filtered_fickle)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                fickle_force_update.on('tick', function (e) {
                    svg.selectAll(".fickle_node").attr('transform', function (d) {
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

                filtered_strong = strong.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_strong(filtered_strong)
                let strong_force_update = d3.forceSimulation(filtered_strong)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                strong_force_update.on('tick', function (e) {
                    svg.selectAll(".strong_node").attr('transform', function (d) {
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

                filtered_broken = broken.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_broken(filtered_broken)
                let broken_force_update = d3.forceSimulation(filtered_broken)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                broken_force_update.on('tick', function (e) {
                    svg.selectAll(".broken_node").attr('transform', function (d) {
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

                filtered_estranged = estranged.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_estranged(filtered_estranged)
                let estranged_force_update = d3.forceSimulation(filtered_estranged)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                estranged_force_update.on('tick', function (e) {
                    svg.selectAll(".estranged_node").attr('transform', function (d) {
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

                filtered_thriving = thriving.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_thriving(filtered_thriving)
                let thriving_force_update = d3.forceSimulation(filtered_thriving)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                thriving_force_update.on('tick', function (e) {
                    svg.selectAll(".thriving_node").attr('transform', function (d) {
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

                filtered_shallow = shallow.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
                run_shallow(filtered_shallow)
                let shallow_force_update = d3.forceSimulation(filtered_shallow)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                shallow_force_update.on('tick', function (e) {
                    svg.selectAll(".shallow_node").attr('transform', function (d) {
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
            } else if (selection_set.length == 3) {
                filtered_steady = steady.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_steady(filtered_steady)

                let steady_sim_update = d3.forceSimulation(filtered_steady)
                    .force("x", d3.forceX().x(d => xScale(d.name)))
                    .force("y", d3.forceY().y(d => yScale(d.name)))
                    .force("collide", d3.forceCollide(3.5))

                steady_sim_update.on("tick", function () {
                    svg.selectAll(".steady_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_reliable = reliable.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_reliable(filtered_reliable)

                let reliable_sim_update = d3.forceSimulation(filtered_reliable)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                reliable_sim_update.on("tick", function () {
                    svg.selectAll(".reliable_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_tentative = tentative.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_tentative(filtered_tentative)

                let tentative_sim_update = d3.forceSimulation(filtered_tentative)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name) - 100).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                tentative_sim_update.on("tick", function () {
                    svg.selectAll(".tentative_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_detached = detached.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_detached(filtered_detached)
                let detached_sim_update = d3.forceSimulation(filtered_detached)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                detached_sim_update.on("tick", function () {
                    svg.selectAll(".detached_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_hopeful = hopeful.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_hopeful(filtered_hopeful)
                let hopeful_sim_update = d3.forceSimulation(filtered_hopeful)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                hopeful_sim_update.on("tick", function () {
                    svg.selectAll(".hopeful_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_stuck = stuck.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_stuck(filtered_stuck)
                let stuck_force_update = d3.forceSimulation(filtered_stuck)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                stuck_force_update.on('tick', function (e) {
                    svg.selectAll(".stuck_node").attr('transform', function (d) {
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

                filtered_frayed = frayed.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_frayed(filtered_frayed)
                let frayed_force_update = d3.forceSimulation(filtered_frayed)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                frayed_force_update.on('tick', function (e) {
                    svg.selectAll(".frayed_node").attr('transform', function (d) {
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

                filtered_fickle = fickle.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_fickle(filtered_fickle)
                let fickle_force_update = d3.forceSimulation(filtered_fickle)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                fickle_force_update.on('tick', function (e) {
                    svg.selectAll(".fickle_node").attr('transform', function (d) {
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

                filtered_strong = strong.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_strong(filtered_strong)
                let strong_force_update = d3.forceSimulation(filtered_strong)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                strong_force_update.on('tick', function (e) {
                    svg.selectAll(".strong_node").attr('transform', function (d) {
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

                filtered_broken = broken.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_broken(filtered_broken)
                let broken_force_update = d3.forceSimulation(filtered_broken)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                broken_force_update.on('tick', function (e) {
                    svg.selectAll(".broken_node").attr('transform', function (d) {
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

                filtered_estranged = estranged.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_estranged(filtered_estranged)
                let estranged_force_update = d3.forceSimulation(filtered_estranged)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                estranged_force_update.on('tick', function (e) {
                    svg.selectAll(".estranged_node").attr('transform', function (d) {
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

                filtered_thriving = thriving.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_thriving(filtered_thriving)
                let thriving_force_update = d3.forceSimulation(filtered_thriving)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                thriving_force_update.on('tick', function (e) {
                    svg.selectAll(".thriving_node").attr('transform', function (d) {
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

                filtered_shallow = shallow.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
                run_shallow(filtered_shallow)
                let shallow_force_update = d3.forceSimulation(filtered_shallow)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                shallow_force_update.on('tick', function (e) {
                    svg.selectAll(".shallow_node").attr('transform', function (d) {
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
            } else if (selection_set.length == 4) {
                filtered_steady = steady.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_steady(filtered_steady)

                let steady_sim_update = d3.forceSimulation(filtered_steady)
                    .force("x", d3.forceX().x(d => xScale(d.name)))
                    .force("y", d3.forceY().y(d => yScale(d.name)))
                    .force("collide", d3.forceCollide(3.5))

                steady_sim_update.on("tick", function () {
                    svg.selectAll(".steady_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_reliable = reliable.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_reliable(filtered_reliable)

                let reliable_sim_update = d3.forceSimulation(filtered_reliable)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                reliable_sim_update.on("tick", function () {
                    svg.selectAll(".reliable_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_tentative = tentative.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_tentative(filtered_tentative)

                let tentative_sim_update = d3.forceSimulation(filtered_tentative)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name) - 100).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                tentative_sim_update.on("tick", function () {
                    svg.selectAll(".tentative_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_detached = detached.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_detached(filtered_detached)
                let detached_sim_update = d3.forceSimulation(filtered_detached)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                detached_sim_update.on("tick", function () {
                    svg.selectAll(".detached_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_hopeful = hopeful.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_hopeful(filtered_hopeful)
                let hopeful_sim_update = d3.forceSimulation(filtered_hopeful)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                hopeful_sim_update.on("tick", function () {
                    svg.selectAll(".hopeful_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_stuck = stuck.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_stuck(filtered_stuck)
                let stuck_force_update = d3.forceSimulation(filtered_stuck)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                stuck_force_update.on('tick', function (e) {
                    svg.selectAll(".stuck_node").attr('transform', function (d) {
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

                filtered_frayed = frayed.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_frayed(filtered_frayed)
                let frayed_force_update = d3.forceSimulation(filtered_frayed)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                frayed_force_update.on('tick', function (e) {
                    svg.selectAll(".frayed_node").attr('transform', function (d) {
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

                filtered_fickle = fickle.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_fickle(filtered_fickle)
                let fickle_force_update = d3.forceSimulation(filtered_fickle)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                fickle_force_update.on('tick', function (e) {
                    svg.selectAll(".fickle_node").attr('transform', function (d) {
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

                filtered_strong = strong.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_strong(filtered_strong)
                let strong_force_update = d3.forceSimulation(filtered_strong)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                strong_force_update.on('tick', function (e) {
                    svg.selectAll(".strong_node").attr('transform', function (d) {
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

                filtered_broken = broken.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_broken(filtered_broken)
                let broken_force_update = d3.forceSimulation(filtered_broken)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                broken_force_update.on('tick', function (e) {
                    svg.selectAll(".broken_node").attr('transform', function (d) {
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

                filtered_estranged = estranged.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_estranged(filtered_estranged)
                let estranged_force_update = d3.forceSimulation(filtered_estranged)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                estranged_force_update.on('tick', function (e) {
                    svg.selectAll(".estranged_node").attr('transform', function (d) {
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

                filtered_thriving = thriving.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_thriving(filtered_thriving)
                let thriving_force_update = d3.forceSimulation(filtered_thriving)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                thriving_force_update.on('tick', function (e) {
                    svg.selectAll(".thriving_node").attr('transform', function (d) {
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

                filtered_shallow = shallow.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                run_shallow(filtered_shallow)
                let shallow_force_update = d3.forceSimulation(filtered_shallow)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                shallow_force_update.on('tick', function (e) {
                    svg.selectAll(".shallow_node").attr('transform', function (d) {
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

            } else {
                filtered_steady = steady.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_steady(filtered_steady)

                let steady_sim_update = d3.forceSimulation(filtered_steady)
                    .force("x", d3.forceX().x(d => xScale(d.name)))
                    .force("y", d3.forceY().y(d => yScale(d.name)))
                    .force("collide", d3.forceCollide(3.5))

                steady_sim_update.on("tick", function () {
                    svg.selectAll(".steady_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_reliable = reliable.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_reliable(filtered_reliable)

                let reliable_sim_update = d3.forceSimulation(filtered_reliable)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                reliable_sim_update.on("tick", function () {
                    svg.selectAll(".reliable_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_tentative = tentative.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_tentative(filtered_tentative)

                let tentative_sim_update = d3.forceSimulation(filtered_tentative)
                    .force("x", d3.forceX().x(d => xScale(d.name)).strength(0.1))
                    .force("y", d3.forceY().y(d => yScale(d.name) - 100).strength(0.03))
                    .force("collide", d3.forceCollide(3.5))

                tentative_sim_update.on("tick", function () {
                    svg.selectAll(".tentative_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_detached = detached.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_detached(filtered_detached)
                let detached_sim_update = d3.forceSimulation(filtered_detached)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                detached_sim_update.on("tick", function () {
                    svg.selectAll(".detached_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_hopeful = hopeful.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_hopeful(filtered_hopeful)
                let hopeful_sim_update = d3.forceSimulation(filtered_hopeful)
                    .force("x", d3.forceX().x(d => xScale(d.name) - 50).strength(0.03))
                    .force("y", d3.forceY().y(d => yScale(d.name)).strength(0.1))
                    .force("collide", d3.forceCollide(3.5))

                hopeful_sim_update.on("tick", function () {
                    svg.selectAll(".hopeful_node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

                filtered_stuck = stuck.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_stuck(filtered_stuck)
                let stuck_force_update = d3.forceSimulation(filtered_stuck)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                stuck_force_update.on('tick', function (e) {
                    svg.selectAll(".stuck_node").attr('transform', function (d) {
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

                filtered_frayed = frayed.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_frayed(filtered_frayed)
                let frayed_force_update = d3.forceSimulation(filtered_frayed)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                frayed_force_update.on('tick', function (e) {
                    svg.selectAll(".frayed_node").attr('transform', function (d) {
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

                filtered_fickle = fickle.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_fickle(filtered_fickle)
                let fickle_force_update = d3.forceSimulation(filtered_fickle)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                fickle_force_update.on('tick', function (e) {
                    svg.selectAll(".fickle_node").attr('transform', function (d) {
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

                filtered_strong = strong.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_strong(filtered_strong)
                let strong_force_update = d3.forceSimulation(filtered_strong)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                strong_force_update.on('tick', function (e) {
                    svg.selectAll(".strong_node").attr('transform', function (d) {
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

                filtered_broken = broken.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_broken(filtered_broken)
                let broken_force_update = d3.forceSimulation(filtered_broken)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                broken_force_update.on('tick', function (e) {
                    svg.selectAll(".broken_node").attr('transform', function (d) {
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

                filtered_estranged = estranged.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_estranged(filtered_estranged)
                let estranged_force_update = d3.forceSimulation(filtered_estranged)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                estranged_force_update.on('tick', function (e) {
                    svg.selectAll(".estranged_node").attr('transform', function (d) {
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

                filtered_thriving = thriving.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_thriving(filtered_thriving)
                let thriving_force_update = d3.forceSimulation(filtered_thriving)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                thriving_force_update.on('tick', function (e) {
                    svg.selectAll(".thriving_node").attr('transform', function (d) {
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

                filtered_shallow = shallow.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                run_shallow(filtered_shallow)
                let shallow_force_update = d3.forceSimulation(filtered_shallow)
                    .force("collide", d3.forceCollide(3.5))
                    .force("charge", d3.forceManyBody().strength(2))

                shallow_force_update.on('tick', function (e) {
                    svg.selectAll(".shallow_node").attr('transform', function (d) {
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
            }

        }
    }

    d3.selectAll(".status_tabs").on("click", function () {
        selected_status = d3.select(this).attr("value")

        // params.forEach(d => d.status = selected_status)
        if (selected_status != 'all') {
            params.forEach((d) => {
                if (d.type === 'status') {
                    d.selection = selected_status
                }
            })
        } else {
            params.forEach((d) => {
                if (d.type === 'status') {
                    d.selection = ''
                }
            })
        }

        apply_selections()

    })

    d3.selectAll(".length_tabs").on("click", function () {
        selected_length = d3.select(this).attr("value")

        if (selected_length != "all") {
            params.forEach((d) => {
                if (d.type === 'length') {
                    d.selection = selected_length
                }
            })
        } else {
            params.forEach((d) => {
                if (d.type === 'length') {
                    d.selection = ''
                }
            })
        }

        apply_selections()
    })

    d3.selectAll(".kids_tabs").on("click", function () {
        selected_kids = d3.select(this).attr("value")

        if (selected_kids != "all") {
            params.forEach((d) => {
                if (d.type === 'kids') {
                    d.selection = selected_kids
                }
            })
        } else {
            params.forEach((d) => {
                if (d.type === 'kids') {
                    d.selection = ''
                }
            })
        }

        apply_selections()
    })

    d3.selectAll(".age_tabs").on("click", function () {
        selected_age = d3.select(this).attr("value")

        if (selected_age != "all") {
            params.forEach((d) => {
                if (d.type === 'age') {
                    d.selection = selected_age
                }
            })
        } else {
            params.forEach((d) => {
                if (d.type === 'age') {
                    d.selection = ''
                }
            })
        }

        apply_selections()
    })

    d3.selectAll(".gender_tabs").on("click", function () {
        selected_gender = d3.select(this).attr("value")

        if (selected_gender != "all") {
            params.forEach((d) => {
                if (d.type === 'gender') {
                    d.selection = selected_gender
                }
            })
        } else {
            params.forEach((d) => {
                if (d.type === 'gender') {
                    d.selection = ''
                }
            })
        }

        apply_selections()
    })

})

