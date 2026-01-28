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

const radius = (width - margin.left - margin.right) / 2
const rect_width = ((radius - radius / 4) / 2)

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// svg.append("circle")
//     .attr("class", "outer_ring")
//     .attr("cx", (width - margin.left - margin.right) / 2 + margin.left)
//     .attr("cy", (height - margin.top - margin.bottom) / 2 + margin.top)
//     .attr("r", radius)
//     .attr("stroke", "black")
//     .attr("fill", "none")

// svg.append("rect")
//     .attr("class", "vertical_rect")
//     .attr("x", (width - margin.left - margin.right) / 2 + margin.left - radius / 4)
//     .attr("y", (height - margin.top - margin.bottom) / 2 + margin.top - radius)
//     .attr("height", radius * 2)
//     .attr("width", radius / 2)
//     .attr("stroke", "black")
//     .attr("fill", "none")

// svg.append("rect")
//     .attr("class", "horizontal_rect")
//     .attr("x", (width - margin.left - margin.right) / 2 + margin.left - radius)
//     .attr("y", (height - margin.top - margin.bottom) / 2 + margin.top - radius / 4)
//     .attr("width", radius * 2)
//     .attr("height", radius / 2)
//     .attr("stroke", "black")
//     .attr("fill", "none")

// svg.append("circle")
//     .attr("class", "inner_ring")
//     .attr("cx", (width - margin.left - margin.right) / 2 + margin.left)
//     .attr("cy", (height - margin.top - margin.bottom) / 2 + margin.top)
//     .attr("r", radius / 4)
//     .attr("stroke", "black")
//     .attr("fill", "none")

d3.csv("./data/numeric.csv", parse).then(function (data) {
    console.log(data)
    data.forEach((d) => {

    })

    //connection
    const xScale = d3.scaleLinear()
        .domain([0, 10])
        .range([margin.left, width - margin.right])

    //commitment
    const yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
        .domain(["Steady", "Reliable", "Tentative", "Detached", "Hopeful",
            "Stuck", "Frayed", "Fickle", "Strong", "Broken", "Estranged", "Thriving", "Shallow"])
        .range(["#b99988", "#b0bbc8", "#b0bbc8", "#b0bbc8", "#b0bbc8",
            "rgba(0,0,0,0.6)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.6)",
            "#d1b977", "#d1b977", "#d1b977", "#d1b977"
        ])

    let simulation = d3.forceSimulation(data)
        .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
        .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
        .force("collide", d3.forceCollide(5.5))

    function draw_circles(dataset) {
        let node = svg.selectAll(".node")
            .data(dataset)

        node.enter()
            .append("circle")
            .attr("class", "node")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .merge(node)
            .transition()
            .duration(500)
            .attr("r", 5)
            .attr("fill", d => colorScale(d.score))

        node.exit()
            .transition()
            .duration(500)
            .remove()
    }
    draw_circles(data)

    simulation.on("tick", function () {
        svg.selectAll(".node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    })



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

        let filtered

        if (selected_status === "all" && selected_length === "all" && selected_kids === "all" && selected_age === "all" && selected_gender === "all") {
            filtered = data
            draw_circles(filtered)

            let simulation_update = d3.forceSimulation(filtered)
                .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
                .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
                .force("collide", d3.forceCollide(5.5))

            simulation_update.on("tick", function () {
                svg.selectAll(".node")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            })
        } else {
            if (selection_set.length == 1) {
                filtered = data.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)

                draw_circles(filtered)

                let simulation_update = d3.forceSimulation(filtered)
                    .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
                    .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
                    .force("collide", d3.forceCollide(5.5))

                simulation_update.on("tick", function () {
                    svg.selectAll(".node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })

            } else if (selection_set.length == 2) {
                filtered = data.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)

                draw_circles(filtered)

                let simulation_update = d3.forceSimulation(filtered)
                    .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
                    .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
                    .force("collide", d3.forceCollide(5.5))

                simulation_update.on("tick", function () {
                    svg.selectAll(".node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })
            } else if (selection_set.length == 3) {
                filtered = data.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)

                draw_circles(filtered)

                let simulation_update = d3.forceSimulation(filtered)
                    .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
                    .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
                    .force("collide", d3.forceCollide(5.5))

                simulation_update.on("tick", function () {
                    svg.selectAll(".node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })
            } else if (selection_set.length == 4) {
                filtered = data.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
                draw_circles(filtered)

                let simulation_update = d3.forceSimulation(filtered)
                    .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
                    .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
                    .force("collide", d3.forceCollide(5.5))

                simulation_update.on("tick", function () {
                    svg.selectAll(".node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })
            } else {
                filtered = data.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
                draw_circles(filtered)

                let simulation_update = d3.forceSimulation(filtered)
                    .force("x", d3.forceX().x(d => xScale(d.connection)).strength(1))
                    .force("y", d3.forceY().y(d => yScale(d.commitment)).strength(1))
                    .force("collide", d3.forceCollide(5.5))

                simulation_update.on("tick", function () {
                    svg.selectAll(".node")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                })
            }
        }

        //RE-RUN THE SIMULATION HERE!
    }

    //apply an unknown number of filters to the nodes

    //////We're going to need a way to store these selections
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

        console.log(params)

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

function parse(d) {
    return {
        // name: d.name,
        status: d.status,
        length: d.length,
        kids: d.kids,
        age: d.age,
        gender: d.gender,
        connection: +d.connection,
        commitment: +d.commitment,
        score: d.score
    }
}