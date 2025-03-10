const promises = [
    d3.csv("./data/partner_data.csv", parse)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 100, right: 100, bottom: 30 };
const radius = 200

const rScale = d3.scaleLinear()
    .domain([0, 4.25])
    .range([0, radius])

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

Promise.all(promises).then(function (data) {
    const one_city = data[0].filter(d => d.city === "Boston")
    console.log(one_city)

    let by_partner_by_category = d3.groups(one_city, d => d.partner, d => d.category)
    let by_category = d3.groups(one_city, d => d.category).sort((a, b) => d3.ascending(a[1], b[1]))
    let keys = by_category.map(d => d[0])
    console.log(by_category)
    console.log(by_partner_by_category)

    let partners = []
    for (let i = 0; i < by_category.length; i++) {
        let category = by_category[i][0]
        let val = by_category[i][1].length
        let category_children = []
        for (let j = 0; j < by_category[i][1].length; j++) {
            category_children.push({
                name: by_category[i][1][j].partner,
                value: 1,
                category: category
            })
        }
        partners.push({
            category: category,
            value: val,
            children: category_children
        })
    }

    let children = {
        "value": one_city.length,
        "children": partners
    }

    const cluster = d3.cluster()
        .size([360, radius - 60]);  // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

    // Give the data to this cluster layout:
    const root = d3.hierarchy(children, function (d) {
        return d.children;
    });
    cluster(root);

    // Features of the links between nodes:
    const linksGenerator = d3.linkRadial()
        .angle(function (d) { return d.x / 180 * Math.PI; })
        .radius(function (d) { return d.y; })

    // Add the links between nodes:
    svg.selectAll('path')
        .data(root.links())
        .join('path')
        .attr("d", linksGenerator)
        .style("fill", 'none')
        .attr("opacity", 0.4)
        .attr("stroke", '#00A469')

    console.log(root.descendants())
    let nodeScale = d3.scaleSqrt()
        .domain([1, d3.max(root.descendants(), d => d.data.value)])
        .range([1, 10])

    // Add a circle for each node.
    svg.selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", function (d) {
            return `rotate(${d.x - 90})
          translate(${d.y})`;
        })
        .append("circle")
        .attr("r", (d) => {
            if (d.data.value) {
                return nodeScale(d.data.value)
            } else {
                return 1.5
            }
        })
        .style("fill", "#00A469")

    let faith_points = root.descendants().filter(d => d.data.category === "Faith-Based Initiatives")
    let faith_angles = [
        d3.min(faith_points, d => d.x),
        d3.max(faith_points, d => d.x)
    ]

    let faith_arc_generator = d3.arc()
        .innerRadius(rScale(3.2))
        .outerRadius(rScale(3.25))
        .startAngle(faith_angles[0] / 180 * Math.PI)
        .endAngle(faith_angles[1] / 180 * Math.PI)

    let faith_arc = svg.append("path")
        .attr("transform", "translate(0,0)")
        .attr("id", "faith_arc")
        .attr("d", faith_arc_generator)
        .attr("fill", "#00A469")

    // let faithLabel = d3.select("#chart")
    //     .append("div")
    //     .attr("class", "label")
    //     .style("left", width / 2 + faith_arc_generator.centroid()[0] + 10 + "px")
    //     .style("top", height / 2 + faith_arc_generator.centroid()[1] - 10 + "px")
    //     .html("Faith-Based Initiatives")

    svg.append("text")
        .attr("x", faith_arc_generator.centroid()[0] + 10)
        .attr("y", faith_arc_generator.centroid()[1] - 10)
        .attr("class", "arcLabel")
        .attr("fill", "#00A469")
        .text("Faith-Based Initiatives")

    //make arc generators for other arcs
    //make other div-based arc labels
    //send to coworkers

    let education_points = root.descendants().filter(d => d.data.category === "Educational and Leadership Development")
    let education_angles = [
        d3.min(education_points, d => d.x),
        d3.max(education_points, d => d.x)
    ]

    let education_arc_generator = d3.arc()
        .innerRadius(rScale(3.2))
        .outerRadius(rScale(3.25))
        .startAngle(education_angles[0] / 180 * Math.PI)
        .endAngle(education_angles[1] / 180 * Math.PI)

    let education_arc = svg.append("path")
        .attr("transform", "translate(0,0)")
        .attr("id", "education_arc")
        .attr("d", education_arc_generator)
        .attr("fill", "#00A469")

    // let educationLabel = d3.select("#chart")
    //     .append("div")
    //     .attr("class", "label")
    //     .style("left", width / 2 + education_arc_generator.centroid()[0] + 10 + "px")
    //     .style("top", height / 2 + education_arc_generator.centroid()[1] - 10 + "px")
    //     .html("Educational and Leadership Development")

    svg.append("text")
        .attr("x", education_arc_generator.centroid()[0] + 10)
        .attr("y", education_arc_generator.centroid()[1] - 10)
        .attr("class", "arcLabel")
        .attr("fill", "#00A469")
        .text("Educational and Leadership Development")


    let arts_points = root.descendants().filter(d => d.data.category === "Arts, Culture, and Media")
    let arts_angles = [
        d3.min(arts_points, d => d.x),
        d3.max(arts_points, d => d.x)
    ]

    let arts_arc_generator = d3.arc()
        .innerRadius(rScale(3.2))
        .outerRadius(rScale(3.25))
        .startAngle(arts_angles[0] / 180 * Math.PI)
        .endAngle(arts_angles[1] / 180 * Math.PI)

    let arts_arc = svg.append("path")
        .attr("transform", "translate(0,0)")
        .attr("id", "arts_arc")
        .attr("d", arts_arc_generator)
        .attr("fill", "#00A469")

    // let artsLabel = d3.select("#chart")
    //     .append("div")
    //     .attr("class", "artsLabel")
    //     .style("left", width / 2 + arts_arc_generator.centroid()[0] + 10 + "px")
    //     .style("top", height / 2 + arts_arc_generator.centroid()[1] - 10 + "px")
    //     .html("Arts, Culture, and Media")

    svg.append("text")
        .attr("x", arts_arc_generator.centroid()[0] - 10)
        .attr("y", arts_arc_generator.centroid()[1] - 10)
        .attr("class", "arcLabel")
        .attr("fill", "#00A469")
        .text("Arts, Culture, and Media")
        .attr("text-anchor", "end")

    let community_points = root.descendants().filter(d => d.data.category === "Community Support and Advocacy")
    let community_angles = [
        d3.min(community_points, d => d.x),
        d3.max(community_points, d => d.x)
    ]

    let community_arc_generator = d3.arc()
        .innerRadius(rScale(3.2))
        .outerRadius(rScale(3.25))
        .startAngle(community_angles[0] / 180 * Math.PI)
        .endAngle(community_angles[1] / 180 * Math.PI)

    let community_arc = svg.append("path")
        .attr("transform", "translate(0,0)")
        .attr("id", "community_arc")
        .attr("d", community_arc_generator)
        .attr("fill", "#00A469")

    svg.append("text")
        .attr("x", community_arc_generator.centroid()[0] - 10)
        .attr("y", community_arc_generator.centroid()[1] + 10)
        .attr("class", "arcLabel")
        .attr("fill", "#00A469")
        .text("Community Support and Advocacy")
        .attr("text-anchor", "end")

    // svg.append("text")
    //     .attr("transform", (d) => {
    //         return `rotate(${((community_angles[0] - 90) + (community_angles[1] - 90)) / 2})translate(${rScale(3.35)})`
    //     })
    //     .attr("class", "arcLabel")
    //     .attr("fill", "#00A469")
    //     .text("Community Support and Advocacy")

    let health_points = root.descendants().filter(d => d.data.category === "Health and Counseling Services")
    let health_angles = [
        d3.min(health_points, d => d.x),
        d3.max(health_points, d => d.x)
    ]

    let health_arc_generator = d3.arc()
        .innerRadius(rScale(3.2))
        .outerRadius(rScale(3.25))
        .startAngle(health_angles[0] / 180 * Math.PI)
        .endAngle(health_angles[1] / 180 * Math.PI)

    let health_arc = svg.append("path")
        .attr("transform", "translate(0,0)")
        .attr("id", "health_arc")
        .attr("d", health_arc_generator)
        .attr("fill", "#00A469")

    svg.append("text")
        .attr("x", health_arc_generator.centroid()[0] + 10)
        .attr("y", health_arc_generator.centroid()[1] + 10)
        .attr("class", "arcLabel")
        .attr("fill", "#00A469")
        .text("Health and Counseling Services")

    // svg.append("text")
    //     .attr("transform", (d) => {
    //         return `rotate(${((health_angles[0] - 90) + (health_angles[1] - 90)) / 2})translate(${rScale(3.35)})`
    //     })
    //     .attr("class", "arcLabel")
    //     .attr("fill", "#00A469")
    //     .text("Health and Counseling Services")

    let international_points = root.descendants().filter(d => d.data.category === "International Outreach and Development")
    let international_angles = [
        d3.min(international_points, d => d.x),
        d3.max(international_points, d => d.x)
    ]

    let international_arc_generator = d3.arc()
        .innerRadius(rScale(3.2))
        .outerRadius(rScale(3.25))
        .startAngle(international_angles[0] / 180 * Math.PI)
        .endAngle(international_angles[1] / 180 * Math.PI)

    let international_arc = svg.append("path")
        .attr("transform", "translate(0,0)")
        .attr("id", "international_arc")
        .attr("d", international_arc_generator)
        .attr("fill", "#00A469")

    svg.append("text")
        .attr("x", international_arc_generator.centroid()[0] - 10)
        .attr("y", international_arc_generator.centroid()[1] + 10)
        .attr("class", "arcLabel")
        .attr("fill", "#00A469")
        .text("International Outreach and Development")
        .attr("text-anchor", "end")


    // svg.append("text")
    //     .attr("transform", (d) => {
    //         return `rotate(${((international_angles[0] - 90) + (international_angles[1] - 90)) / 2})translate(${rScale(3.35)})`
    //     })
    //     .attr("class", "arcLabel")
    //     .attr("fill", "#00A469")
    //     .text("International Outreach and Development")

})

function parse(d) {
    return {
        partner: d.PARTNER,
        church: d.CHURCH,
        category: d.MINISTRY_CATEGORY,
        city: d.CITY,
        state: d.STATE,
        zip: +d.ZIP_CODE,
        lat: +d.LAT,
        lon: +d.LNG
    }
}