const promises = [
    d3.csv("./data/partner_data.csv", parse),
    d3.csv("./data/pop.csv", parse_cities)
];

/* defining variables for the width and heigth of the SVG */
const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 100, left: 300, right: 300, bottom: 100 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

Promise.all(promises).then(function (data) {
    console.log(data)
    let partners = data[0]
    let cities = data[1].sort((a, b) => d3.ascending(a.pop, b.pop))

    let boulder = partners.filter(d => d.city === "Boulder")
    let boulder_by_category = d3.groups(boulder, d => d.category)

    console.log(boulder_by_category)

    let base_pop = 105898;
    let similarity = 2500;

    let similar_size = cities.filter(d => d.state === "Colorado")
    console.log(similar_size)

    similar_size.forEach((d) => {
        d.city = d.city.slice(0, -5)
    })

    let partners_similar_size = []
    for (let i = 0; i < partners.length; i++) {
        for (let j = 0; j < similar_size.length; j++) {
            if (partners[i].city === similar_size[j].city) {
                partners_similar_size.push({
                    partner: partners[i].partner,
                    city: partners[i].city,
                    state: partners[i].state,
                    category: partners[i].category,
                    church: partners[i].church,
                    city_pop: similar_size[j].pop
                })
            }
        }
    }
    console.log(boulder.length / base_pop)
    console.log(similar_size)
    console.log(partners_similar_size)
    let partners_by_city = d3.groups(partners_similar_size, d => d.city)

    partners_by_city.forEach((d) => {
        d.pop = d[1][0].city_pop
        d.per_capita_impact = (d[1].length / d[1][0].city_pop) * 100
    })
    console.log(partners_by_city)

    let boulder_partners = partners_by_city.filter(d => d[0] === "Boulder")
    console.log(boulder_partners)

    let xScale = d3.scaleLinear()
        .domain([d3.min(partners_by_city, d => d.per_capita_impact), d3.max(partners_by_city, d => d.per_capita_impact)])
        .range([margin.left, width - margin.right])

    svg.selectAll(".city_line")
        .data(partners_by_city)
        .enter()
        .append("line")
        .attr("class", "city_line")
        .attr("y1", (d) => {
            if (d[0] === "Boulder") {
                return height / 2 - 55
            } else {
                return height / 2 - 50
            }
        })
        .attr("y2", (d) => {
            if (d[0] === "Boulder") {
                return height / 2 + 55
            } else {
                return height / 2 + 50
            }
        })
        .attr("x1", d => xScale(d.per_capita_impact))
        .attr("x2", d => xScale(d.per_capita_impact))
        .attr("stroke", (d) => {
            if (d[0] === "Boulder") {
                return "#cdfee3"
            } else {
                return "#00a469"
            }
        })
        .attr("stroke-width", (d) => {
            if (d[0] === "Boulder") {
                return 4
            } else {
                return 0.5
            }
        })

    svg.selectAll(".my_city_line")
        .data(boulder_partners)
        .enter()
        .append("line")
        .attr("class", "my_city_line")
        .attr("y1", (d) => {

            return height / 2 - 55

        })
        .attr("y2", (d) => {

            return height / 2 + 55

        })
        .attr("x1", d => xScale(d.per_capita_impact))
        .attr("x2", d => xScale(d.per_capita_impact))
        .attr("stroke", (d) => {

            return "#cdfee3"

        })
        .attr("stroke-width", (d) => {

            return 4

        })


    svg.selectAll(".my_city_label")
        .data(boulder_partners)
        .enter()
        .append("text")
        .attr("class", "my_city_label")
        .attr("y", height / 2 - 65)
        .attr("x", d => xScale(d.per_capita_impact))
        .attr("fill", '#cdfee3')
        .attr("text-anchor", "middle")
        .text(d => d[0])

    svg.selectAll(".my_value_label")
        .data(boulder_partners)
        .enter()
        .append("text")
        .attr("class", "my_value_label")
        .attr("y", height / 2 + 70)
        .attr("x", d => xScale(d.per_capita_impact))
        .attr("fill", '#cdfee3')
        .attr("text-anchor", "middle")
        .text(d => d.per_capita_impact.toFixed(2))

    svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", margin.left)
        .attr("y", height / 2 + 95)
        .attr("fill", "#00a469")
        // .attr("text-anchor", "end")
        .text("Impact Per Capita");


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

function parse_cities(d) {
    return {
        city: d.City,
        state: d.state.slice(1),
        pop: +d.pop
    }
}
