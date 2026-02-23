//Functions to set up the tabs interaction

function status(evt) {
    // Declare all variables
    let i, tablinks;

    // // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("status_tabs");

    if (evt.currentTarget.id != "status_all") {
        for (i = 0; i < tablinks.length; i++) {
            if (tablinks[i].id === "status_all") {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
        }
    } else {
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function length(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("length_tabs");

    if (evt.currentTarget.id != "length_all") {
        for (i = 0; i < tablinks.length; i++) {
            if (tablinks[i].id === "length_all") {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
        }
    } else {
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function kids(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("kids_tabs");
    if (evt.currentTarget.id != "kids_all") {
        for (i = 0; i < tablinks.length; i++) {
            if (tablinks[i].id === "kids_all") {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
        }
    } else {
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function age(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("age_tabs");
    if (evt.currentTarget.id != "age_all") {
        for (i = 0; i < tablinks.length; i++) {
            if (tablinks[i].id === "age_all") {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
        }
    } else {
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

function gender(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("gender_tabs");
    if (evt.currentTarget.id != "gender_all") {
        for (i = 0; i < tablinks.length; i++) {
            if (tablinks[i].id === "gender_all") {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
        }
    } else {
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

const width = 630,
    height = 630

const margin = {
    top: 55,
    right: 55,
    bottom: 25,
    left: 25
}

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

svg.append("svg:image")
    .attr('x', 25)
    .attr('y', 15)
    .attr('width', width - margin.right)
    .attr('height', height - margin.bottom)
    .attr("xlink:href", "./assets/image.png")

d3.csv("./data/all_data.csv", parse).then(function (data) {
    console.log(data)

    // FILTERING TO 1 CHURCH
    let calvary = data.filter(d => d.church === "calvary-chapel-star")
    console.log(calvary)

    const scores = ["Steady", "Reliable", "Tentative", "Detached", "Hopeful",
        "Stuck", "Frayed", "Fickle", "Strong", "Broken", "Estranged", "Thriving", "Shallow"]

    let by_score = d3.groups(calvary, d => d.score)

    for (let i = 0; i < scores.length; i++) {
        for (let j = 0; j < by_score.length; j++) {
            if (by_score[j][0] != scores[i]) {
                by_score.push(
                    [
                        scores[i],
                        []
                    ]
                )
            }
        }
    }

    by_score.forEach((d) => {
        d.percent = ((d[1].length / calvary.length) * 100).toFixed(1) + "%"
    })
    const xScale = d3.scaleLinear()
        .domain([0, 40])
        .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
        .domain([0, 38])
        .range([height - margin.bottom, margin.top])

    let jitterWidth = 30

    function draw_nodes(dataset) {
        let nodes = svg.selectAll(".node")
            .data(dataset)

        nodes.enter()
            .append("circle")
            .attr("class", "node")
            .attr("cx", d => xScale(d.connection) - Math.random() * jitterWidth)
            .attr("cy", d => yScale(d.commitment) + Math.random() * jitterWidth)
            .merge(nodes)
            .transition()
            .duration(500)
            .attr("r", 3)
            // .attr("fill", "#685176")
            .attr("fill", (d) => {
                if (d.gender === "Male") {
                    return "#639bab"
                } else {
                    return "#d76c6a"
                }
            })
            .attr("opacity", 0.3)

        nodes.exit()
            .transition()
            .duration(500)
            .remove()
    }

    draw_nodes(calvary)


    //Steady
    svg.append("text")
        .attr("x", xScale(21))
        .attr("y", yScale(16))
        .attr("class", "label")
        .text("Steady")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(21))
        .attr("y", yScale(15))
        .attr("class", "percent_label steady_percent")
        .text(by_score.filter(d => d[0] === "Steady")[0].percent)
        .attr("text-anchor", "middle")

    //Reliable
    svg.append("text")
        .attr("x", xScale(20.7))
        .attr("y", yScale(38))
        .attr("class", "label")
        .text("Reliable")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(20.7))
        .attr("y", yScale(37))
        .attr("class", "percent_label reliable_percent")
        .text(by_score.filter(d => d[0] === "Reliable")[0].percent)
        .attr("text-anchor", "middle")

    //Tentative
    svg.append("text")
        .attr("x", xScale(20.7))
        .attr("y", yScale(2))
        .attr("class", "label")
        .text("Tentative")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(20.7))
        .attr("y", yScale(1))
        .attr("class", "percent_label tentative_percent")
        .text(by_score.filter(d => d[0] === "Tentative")[0].percent)
        .attr("text-anchor", "middle")

    //Detached
    svg.append("text")
        .attr("x", xScale(1))
        .attr("y", yScale(20.5))
        .attr("class", "label")
        .text("Detached")

    svg.append("text")
        .attr("x", xScale(1))
        .attr("y", yScale(19.5))
        .attr("class", "percent_label detached_percent")
        .text(by_score.filter(d => d[0] === "Detached")[0].percent)

    //Hopeful
    svg.append("text")
        .attr("x", xScale(40.5))
        .attr("y", yScale(20.5))
        .attr("class", "label")
        .text("Hopeful")
        .attr("text-anchor", "end")

    svg.append("text")
        .attr("x", xScale(40.5))
        .attr("y", yScale(19.5))
        .attr("class", "percent_label hopeful_percent")
        .text(by_score.filter(d => d[0] === "Hopeful")[0].percent)
        .attr("text-anchor", "end")

    //Stuck
    svg.append("text")
        .attr("x", xScale(2))
        .attr("y", yScale(25))
        .attr("class", "label")
        .text("Stuck")

    svg.append("text")
        .attr("x", xScale(2))
        .attr("y", yScale(24))
        .attr("class", "percent_label stuck_percent")
        .text(by_score.filter(d => d[0] === "Stuck")[0].percent)

    //Frayed
    svg.append("text")
        .attr("x", xScale(2))
        .attr("y", yScale(15.5))
        .attr("class", "label")
        .text("Frayed")

    svg.append("text")
        .attr("x", xScale(2))
        .attr("y", yScale(14.5))
        .attr("class", "percent_label frayed_percent")
        .text(by_score.filter(d => d[0] === "Frayed")[0].percent)

    //Strong
    svg.append("text")
        .attr("x", xScale(39.5))
        .attr("y", yScale(25))
        .attr("class", "label")
        .text("Strong")
        .attr("text-anchor", "end")

    svg.append("text")
        .attr("x", xScale(39.5))
        .attr("y", yScale(24))
        .attr("class", "percent_label strong_percent")
        .text(by_score.filter(d => d[0] === "Strong")[0].percent)
        .attr("text-anchor", "end")

    //Fickle
    svg.append("text")
        .attr("x", xScale(39.5))
        .attr("y", yScale(15.5))
        .attr("class", "label")
        .text("Fickle")
        .attr("text-anchor", "end")

    svg.append("text")
        .attr("x", xScale(39.5))
        .attr("y", yScale(14.5))
        .attr("class", "percent_label fickle_percent")
        .text(by_score.filter(d => d[0] === "Fickle")[0].percent)
        .attr("text-anchor", "end")

    //Broken
    svg.append("text")
        .attr("x", xScale(6))
        .attr("y", yScale(1))
        .attr("class", "label")
        .text("Broken")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(6))
        .attr("y", yScale(0))
        .attr("class", "percent_label broken_percent")
        .text(by_score.filter(d => d[0] === "Broken")[0].percent)
        .attr("text-anchor", "middle")

    //Estranged
    svg.append("text")
        .attr("x", xScale(6))
        .attr("y", yScale(37.5))
        .attr("class", "label")
        .text("Estranged")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(6))
        .attr("y", yScale(36.5))
        .attr("class", "percent_label estranged_percent")
        .text(by_score.filter(d => d[0] === "Estranged")[0].percent)
        .attr("text-anchor", "middle")

    //Shallow
    svg.append("text")
        .attr("x", xScale(34))
        .attr("y", yScale(1))
        .attr("class", "label")
        .text("Shallow")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(34))
        .attr("y", yScale(0))
        .attr("class", "percent_label shallow_percent")
        .text(by_score.filter(d => d[0] === "Shallow")[0].percent)
        .attr("text-anchor", "middle")

    //Thriving
    svg.append("text")
        .attr("x", xScale(34))
        .attr("y", yScale(37.5))
        .attr("class", "label")
        .text("Thriving")
        .attr("text-anchor", "middle")

    svg.append("text")
        .attr("x", xScale(34))
        .attr("y", yScale(36.5))
        .attr("class", "percent_label thriving_percent")
        .text(by_score.filter(d => d[0] === "Thriving")[0].percent)
        .attr("text-anchor", "middle")

    let selected_status = "all"
    let selected_length = "all"
    let selected_kids = "all"
    let selected_age = "all"
    let selected_gender = "all"

    let status_arr = []
    let length_arr = []
    let kids_arr = []
    let age_arr = []
    let gender_arr = []
    let map = new Map()
    map.set('status', status_arr)
    map.set('length', length_arr)
    map.set('kids', kids_arr)
    map.set('age', age_arr)
    map.set('gender', gender_arr)

    let filter_set = []

    let filter_types = []
    let filtered;
    function apply_selections() {

        let uniq = [...new Set(filter_types)]
        if (uniq.includes('kids')) {
            let kids = filter_set.filter(d => d.kids)
            let not_kids = filter_set.filter(d => !d.kids)

            if (not_kids.length == 0) {
                if (kids.length == 1) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids))
                } else if (kids.length == 2) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids))
                } else if (kids.length == 3) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids))
                } else if (kids.length == 4) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids))
                } else {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids) || d.kids.includes(kids[4].kids))
                }

            } else if (not_kids.length == 1) {
                if (kids.length == 1) {
                    //filter for kids
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids))
                } else if (kids.length == 2) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids))
                } else if (kids.length == 3) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids))
                } else if (kids.length == 4) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids))
                } else {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids) || d.kids.includes(kids[4].kids))
                }
                //filter for everything else
                filtered = filtered.filter(item => not_kids
                    .map(x => x[uniq[0]])
                    .includes(item[uniq[0]]))
            } else if (not_kids.length == 2) {
                if (kids.length == 1) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids))
                } else if (kids.length == 2) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids))
                } else if (kids.length == 3) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids))
                } else if (kids.length == 4) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids))
                } else {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids) || d.kids.includes(kids[4].kids))
                }

                let filteredA = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                })
            } else if (not_kids.length == 3) {
                if (kids.length == 1) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids))
                } else if (kids.length == 2) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids))
                } else if (kids.length == 3) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids))
                } else if (kids.length == 4) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids))
                } else {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids) || d.kids.includes(kids[4].kids))
                }

                let filteredA = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                let filteredC = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[2]])
                        .includes(item[uniq[2]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                }).filter((o1) => {
                    return filteredC.some((o2) => o2[uniq[2]] === o1[uniq[2]])
                })
            } else {
                if (kids.length == 1) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids))
                } else if (kids.length == 2) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids))
                } else if (kids.length == 3) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids))
                } else if (kids.length == 4) {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids))
                } else {
                    filtered = calvary.filter(d => d.kids.includes(kids[0].kids) || d.kids.includes(kids[1].kids) || d.kids.includes(kids[2].kids) || d.kids.includes(kids[3].kids) || d.kids.includes(kids[4].kids))
                }

                let filteredA = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                let filteredC = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[2]])
                        .includes(item[uniq[2]]))

                let filteredD = filtered
                    .filter(item => filter_set
                        .map(x => x[uniq[3]])
                        .includes(item[uniq[3]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                }).filter((o1) => {
                    return filteredC.some((o2) => o2[uniq[2]] === o1[uniq[2]])
                }).filter((o1) => {
                    return filteredD.some((o2) => o2[uniq[3]] === o1[uniq[3]])
                })
            }
        } else {
            if (uniq.length == 1) {
                filtered = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))
            } else if (uniq.length == 2) {
                let filteredA = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                })
            } else if (uniq.length == 3) {
                let filteredA = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                let filteredC = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[2]])
                        .includes(item[uniq[2]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                }).filter((o1) => {
                    return filteredC.some((o2) => o2[uniq[2]] === o1[uniq[2]])
                })
            } else if (uniq.length == 4) {
                let filteredA = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                let filteredC = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[2]])
                        .includes(item[uniq[2]]))

                let filteredD = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[3]])
                        .includes(item[uniq[3]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                }).filter((o1) => {
                    return filteredC.some((o2) => o2[uniq[2]] === o1[uniq[2]])
                }).filter((o1) => {
                    return filteredD.some((o2) => o2[uniq[3]] === o1[uniq[3]])
                })
            } else {
                let filteredA = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[0]])
                        .includes(item[uniq[0]]))

                let filteredB = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[1]])
                        .includes(item[uniq[1]]))

                let filteredC = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[2]])
                        .includes(item[uniq[2]]))

                let filteredD = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[3]])
                        .includes(item[uniq[3]]))

                let filteredE = calvary
                    .filter(item => filter_set
                        .map(x => x[uniq[4]])
                        .includes(item[uniq[4]]))

                filtered = filteredA.filter((o1) => {
                    return filteredB.some((o2) => o2[uniq[1]] === o1[uniq[1]])
                }).filter((o1) => {
                    return filteredC.some((o2) => o2[uniq[2]] === o1[uniq[2]])
                }).filter((o1) => {
                    return filteredD.some((o2) => o2[uniq[3]] === o1[uniq[3]])
                }).filter((o1) => {
                    return filteredE.some((o2) => o2[uniq[4]] === o1[uniq[4]])
                })
            }
        }
        svg.selectAll(".node").remove()
        svg.selectAll(".node")
            .data(filtered)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("cx", d => xScale(d.connection) - Math.random() * jitterWidth)
            .attr("cy", d => yScale(d.commitment) + Math.random() * jitterWidth)
            .transition()
            .duration(500)
            .attr("r", 3)
            // .attr("fill", "#685176")
            .attr("fill", (d) => {
                if (d.gender === "Male") {
                    return "#639bab"
                } else if (d.gender === "Female") {
                    return "#d76c6a"
                }
            })
            .attr("opacity", 0.3)

            let filtered_scores = d3.groups(filtered, d => d.score)

            for (let i = 0; i < scores.length; i++) {
                for (let j = 0; j < filtered_scores.length; j++) {
                    if (filtered_scores[j][0] != scores[i]) {
                        filtered_scores.push(
                            [
                                scores[i],
                                []
                            ]
                        )
                    }
                }
            }

            filtered_scores.forEach((d) => {
                d.percent = ((d[1].length / filtered.length) * 100).toFixed(1) + "%"
            })

            svg.selectAll(".steady_percent")
                .text(filtered_scores.filter(d => d[0] === "Steady")[0].percent)

            svg.selectAll(".reliable_percent")
                .text(filtered_scores.filter(d => d[0] === "Reliable")[0].percent)

            svg.selectAll(".tentative_percent")
                .text(filtered_scores.filter(d => d[0] === "Tentative")[0].percent)

            svg.selectAll(".detached_percent")
                .text(filtered_scores.filter(d => d[0] === "Detached")[0].percent)

            svg.selectAll(".hopeful_percent")
                .text(filtered_scores.filter(d => d[0] === "Hopeful")[0].percent)

            svg.selectAll(".stuck_percent")
                .text(filtered_scores.filter(d => d[0] === "Stuck")[0].percent)

            svg.selectAll(".frayed_percent")
                .text(filtered_scores.filter(d => d[0] === "Frayed")[0].percent)

            svg.selectAll(".strong_percent")
                .text(filtered_scores.filter(d => d[0] === "Strong")[0].percent)

            svg.selectAll(".fickle_percent")
                .text(filtered_scores.filter(d => d[0] === "Fickle")[0].percent)

            svg.selectAll(".broken_percent")
                .text(filtered_scores.filter(d => d[0] === "Broken")[0].percent)

            svg.selectAll(".estranged_percent")
                .text(filtered_scores.filter(d => d[0] === "Estranged")[0].percent)

            svg.selectAll(".shallow_percent")
                .text(filtered_scores.filter(d => d[0] === "Shallow")[0].percent)

            svg.selectAll(".thriving_percent")
                .text(filtered_scores.filter(d => d[0] === "Thriving")[0].percent)

    }

    d3.selectAll(".status_tabs").on("click", function () {
        selected_status = d3.select(this).attr("value")
        filter_set.push({
            status: selected_status
        })

        filter_types.push('status')

        apply_selections()
    })

    d3.selectAll(".length_tabs").on("click", function () {
        selected_length = d3.select(this).attr("value")

        filter_set.push({
            length: selected_length
        })

        filter_types.push('length')

        apply_selections()
    })

    d3.selectAll(".kids_tabs").on("click", function () {
        selected_kids = d3.select(this).attr("value")

        filter_set.push({
            kids: selected_kids
        })

        filter_types.push('kids')

        apply_selections()
    })

    d3.selectAll(".age_tabs").on("click", function () {
        selected_age = d3.select(this).attr("value")
        filter_set.push({
            age: selected_age
        })
        filter_types.push('age')

        apply_selections()
    })

    d3.selectAll(".gender_tabs").on("click", function () {
        selected_gender = d3.select(this).attr("value")
        filter_set.push({
            gender: selected_gender
        })
        filter_types.push('gender')

        apply_selections()
    })

})

function parse(d) {
    return {
        chart_type: d['Relationship Status'],
        status: d['Relationship Status:  (label)'],
        length: d['How long have you been together? '],
        kids: d['Kids (check all that apply)'].split(', '),
        age: d['Your Age'],
        gender: d['Gender'],
        church: d['Church Slug'],
        commitment: d['38-pt COMMITMENT'],
        connection: d['40-pt CONNECTION'],
        score: d['Relationship STATE']
    }
}