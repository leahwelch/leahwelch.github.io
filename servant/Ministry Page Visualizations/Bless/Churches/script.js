const promises = [
    d3.csv("./data/churches.csv", parse_churches),
    d3.json("./data/gz_2010_us_040_00_20m.json")
];

function showVis(evt) {
    // Declare all variables
    var i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

let prayer_button = d3.select("#prayer_button");
let light_button = d3.select("#light_button");
let listen_button = d3.select("#listen_button");
let eat_button = d3.select("#eat_button");
let serve_button = d3.select("#serve_button");
let story_button = d3.select("#story_button");

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 50, right: 50, bottom: 50 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

Promise.all(promises).then(function (data) {
    const churches = data[0]
    const usa = data[1]

    console.log(churches)

    const projection = d3.geoAlbers()
        .translate([width / 2, height / 2])
        .scale(width - margin.left - margin.right);

    // The d3.geoPath() generator will convert our GeoJSON into SVG path elements

    let path = d3.geoPath().projection(projection);

    // Draw the paths (outlines for the states)

    svg.selectAll("path")
        .data(usa.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path);

    let rScale = d3.scaleSqrt()
        .domain([d3.min(churches, d => d.prayers), d3.max(churches, d => d.prayers)])
        .range([1, 25]);

    svg.selectAll(".church_nodes")
        .data(churches)
        .enter()
        .append("circle")
        .attr("class", "church_nodes")
        .attr("cx", (d) => {
            let proj = projection([d.lon, d.lat])
            return proj[0]
        })
        .attr("cy", (d) => {
            let proj = projection([d.lon, d.lat])
            return proj[1]
        })
        .attr("fill", "#00a469")
        .attr("r", 0)
        .attr("opacity", 0.4)
        .attr("mix-blend-mode", "multiply")
        .transition()
        .duration(500)
        .attr("r", d => rScale(d.prayers))

    prayer_button.on("click", function () {
        rScale.domain([d3.min(churches, d => d.prayers), d3.max(churches, d => d.prayers)])
        svg.selectAll(".church_nodes")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.prayers))
    })

    light_button.on("click", function () {
        rScale.domain([d3.min(churches, d => d.lights), d3.max(churches, d => d.lights)])
        svg.selectAll(".church_nodes")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.lights))
    })

    listen_button.on("click", function () {
        rScale.domain([d3.min(churches, d => d.listen), d3.max(churches, d => d.listen)])
        svg.selectAll(".church_nodes")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.listen))
    })

    eat_button.on("click", function () {
        rScale.domain([d3.min(churches, d => d.eat), d3.max(churches, d => d.eat)])
        svg.selectAll(".church_nodes")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.eat))
    })

    serve_button.on("click", function () {
        rScale.domain([d3.min(churches, d => d.serve), d3.max(churches, d => d.serve)])
        svg.selectAll(".church_nodes")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.serve))
    })

    story_button.on("click", function () {
        rScale.domain([d3.min(churches, d => d.story), d3.max(churches, d => d.story)])
        svg.selectAll(".church_nodes")
            .transition()
            .duration(500)
            .attr("r", d => rScale(d.story))
    })

});

function parse_churches(d) {
    return {
        id: d.ID,
        org: d.ORGANIZATION_NAME,
        type: d.ORGANIZATION_TYPE,
        address: d.STREET_ADDRESS,
        city: d.CITY,
        state: d.STATE,
        zip: d.ZIP,
        lat: +d.LATITUDE,
        lon: +d.LONGITUDE,
        lights: +d.NUMBER_OF_LIGHTS,
        prayers: +d.PRAYERS,
        listen: +d.LISTEN_EVENTS,
        eat: +d.EAT_EVENTS,
        serve: +d.SERVE_EVENTS,
        story: +d.SHARE_YOUR_STORY_EVENTS,
        account_type: d.ACCOUNT_TYPE

    }
}