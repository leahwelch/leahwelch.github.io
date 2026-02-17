//Functions to set up the tabs interaction
function campus(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("campus_tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

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
    console.log(by_score)

    const xScale = d3.scaleLinear()
        .domain([0, 40])
        .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
        .domain([0, 38])
        .range([height - margin.bottom, margin.top])

    let jitterWidth = 30

    svg.selectAll(".node")
        .data(calvary)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", d => xScale(d.connection) - Math.random() * jitterWidth)
        .attr("cy", d => yScale(d.commitment) + Math.random() * jitterWidth)
        .attr("r", 3)
        // .attr("fill", "#685176")
        .attr("fill", (d) => {
            if(d.gender === "Male") {
                return "#639bab"
            } else {
                return "#d76c6a"
            }
        })
        .attr("opacity", 0.3)

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

    let selected_campus = "all"
    let selected_status = "all"
    let selected_length = "all"
    let selected_kids = "all"
    let selected_age = "all"
    let selected_gender = "all"

    let params = [
        {
            type: 'campus',
            selection: ''
        },
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
            selection: []
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
        let selection_types = d3.groups(selection_set, d => d.type).map(d => d[0])
        let filtered;

        if (selected_campus === "all" && selected_status === "all" && selected_length === "all" && selected_kids === "all" && selected_age === "all" && selected_gender === "all") {
            svg.selectAll(".node").attr("opacity", 0.25)
            filtered = calvary
        } else if (selection_types.includes('kids')) {
            let kids = selection_set.filter(d => d.type === 'kids')
            let not_kids = selection_set.filter(d => d.type != 'kids')

            if (not_kids.length == 0) {
                filtered = calvary.filter(d => d.kids.includes(kids[0].selection))
            } else if (not_kids.length == 1) {
                filtered = calvary.filter(d => d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection)
            } else if (not_kids.length == 2) {
                filtered = calvary.filter(d => d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection && d[`${not_kids[1].type}`] === not_kids[1].selection)
            } else if (not_kids.length == 3) {
                filtered = calvary.filter(d => d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection && d[`${not_kids[1].type}`] === not_kids[1].selection && d[`${not_kids[2].type}`] === not_kids[2].selection)
            } else {
                filtered = calvary.filter(d => d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection && d[`${not_kids[1].type}`] === not_kids[1].selection && d[`${not_kids[2].type}`] === not_kids[2].selection && d[`${not_kids[3].type}`] === not_kids[3].selection)
            }

            svg.selectAll(".node").attr("opacity", (d) => {
                if (not_kids.length == 0) {
                    if (d.kids.includes(kids[0].selection)) {
                        return 0.25
                    } else {
                        return 0
                    }
                } else if (not_kids.length == 1) {
                    if (d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection) {
                        return 0.25
                    } else {
                        return 0
                    }
                } else if (not_kids.length == 2) {
                    if (d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection && d[`${not_kids[1].type}`] === not_kids[1].selection) {
                        return 0.25
                    } else {
                        return 0
                    }
                } else if (not_kids.length == 3) {
                    if (d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection && d[`${not_kids[1].type}`] === not_kids[1].selection && d[`${not_kids[2].type}`] === not_kids[2].selection) {
                        return 0.25
                    } else {
                        return 0
                    }
                } else {
                    if (d.kids.includes(kids[0].selection) && d[`${not_kids[0].type}`] === not_kids[0].selection && d[`${not_kids[1].type}`] === not_kids[1].selection && d[`${not_kids[2].type}`] === not_kids[2].selection && d[`${not_kids[3].type}`] === not_kids[3].selection) {
                        return 0.25
                    } else {
                        return 0
                    }
                }
            })
        } else {
            if (selection_set.length == 1) {
                filtered = calvary.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection)
            } else if (selection_set.length == 2) {
                filtered = calvary.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection)
            } else if (selection_set.length == 3) {
                filtered = calvary.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection)
            } else if (selection_set.length == 4) {
                filtered = calvary.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection)
            } else {
                filtered = calvary.filter(d => d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection)
            }

            svg.selectAll(".node")
                .attr("opacity", (d) => {
                    if (selection_set.length == 1) {
                        if (d[`${selection_set[0].type}`] === selection_set[0].selection) {
                            return 0.3
                        } else {
                            return 0
                        }
                    } else if (selection_set.length == 2) {
                        if (d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection) {
                            return 0.3
                        } else {
                            return 0
                        }
                    } else if (selection_set.length == 3) {
                        if (d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection) {
                            return 0.3
                        } else {
                            return 0
                        }
                    } else if (selection_set.length == 4) {
                        if (d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection) {
                            return 0.3
                        } else {
                            return 0
                        }
                    } else if (selection_set.length == 5) {
                        if (d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection) {
                            return 0.3
                        } else {
                            return 0
                        }
                    } else {
                        if (d[`${selection_set[0].type}`] === selection_set[0].selection && d[`${selection_set[1].type}`] === selection_set[1].selection && d[`${selection_set[2].type}`] === selection_set[2].selection && d[`${selection_set[3].type}`] === selection_set[3].selection && d[`${selection_set[4].type}`] === selection_set[4].selection && d[`${selection_set[5].type}`] === selection_set[5].selection) {
                            return 0.3
                        } else {
                            return 0
                        }
                    }
                })
        }

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

    //apply an unknown number of filters to the nodes

    d3.selectAll(".campus_tabs").on("click", function () {
        selected_campus = d3.select(this).attr("value")

        // params.forEach(d => d.status = selected_status)
        if (selected_campus != 'all') {
            params.forEach((d) => {
                if (d.type === 'campus') {
                    d.selection = selected_campus
                }
            })
        } else {
            params.forEach((d) => {
                if (d.type === 'campus') {
                    d.selection = ''
                }
            })
        }

        apply_selections()

    })

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