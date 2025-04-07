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
    let similarity = 10000;

    let similar_size = cities.filter(d => d.pop > base_pop - similarity && d.pop < base_pop + similarity)
    // let similar_size = cities.filter(d => d.state === "Colorado")

    similar_size.forEach((d) => {
        d.city = d.city.slice(0, -5)
    })
    console.log(similar_size)

    let partners_similar_size = []
    for (let i = 0; i < partners.length; i++) {
        for (let j = 0; j < similar_size.length; j++) {
            if (partners[i].city === similar_size[j].city) {
                // if (partners[i].city === similar_size[j].city && partners[i].state === "CO") {
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
        d.per_capita_impact = (d[1].length / d[1][0].city_pop)
    })

    partners_by_city.sort((a, b) => d3.descending(a.per_capita_impact, b.per_capita_impact))
    console.log(partners_by_city)

    let boulder_partners = partners_by_city.filter(d => d[0] === "Boulder")
    console.log(boulder_partners)

    let xScale = d3.scaleLinear()
        .domain([d3.min(partners_by_city, d => d.per_capita_impact), d3.max(partners_by_city, d => d.per_capita_impact)])
        .range([margin.left, width - margin.right])

    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height / 2 + 125})`)
        .call(d3.axisBottom()
            .scale(xScale)
            .tickSize((-height / 2 + 100))
            .tickFormat(d3.format(".2%")))

    let simulation = d3.forceSimulation(partners_by_city)
        .force("x", d3.forceX((d) => {
            return xScale(+d["per_capita_impact"])
        }).strength(0.1))
        .force("y", d3.forceY((height / 2)).strength(0.1))
        .force("collide", d3.forceCollide((d) => {
            return 7
        }))

    for (let i = 0; i < partners_by_city.length; i++) {
        simulation.tick(10);
    }

    //define the tooltip
    let tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    //select all of the elements in the DOM that meet the criteria of having the class name of "nodes"
    let points = svg.selectAll(".nodes")
        //bind those elements to our dataset using the country dimension as the key
        // .data(partners_by_city, (d) => d.country)
        .data(partners_by_city)

    //the enter function creates the elements we need
    points.enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("fill", (d) => {
            if (d[0] === "Boulder") {
                return "#00a469"
            } else {
                return "#cbcbcb"
            }
        })
        //merge with any existing points that have the same key
        .merge(points)
        //now set the attributes of the merged points, including the radius
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", (d) => {
            if (d[0] === "Boulder") {
                return 6
            } else {
                return 5
            }
        })
        //tooltip interactivity
        .on("mouseover", function (d, e) { /*d is referencing each of the cirlces*/
            //grab the position of the node that we're hovering on    
            var cx = +d3.select(this).attr("cx") + 10;
            var cy = +d3.select(this).attr("cy") - 15;
            //make the tooltip visible
            tooltip.style("visibility", "visible")
                .style("left", cx + "px")
                .style("top", cy + "px")
                .text(e[0] + ": " + e[1].length + " partners"); //the text that shows up in the tooltip
            //all other circles fall away slightly
            //the cirlce we're hovering on comes into focus
            d3.select(this)
                .attr("fill", "black")
        }).on("mouseout", function () {
            //tooltip goes away
            tooltip.style("visibility", "hidden");
            //all circles return to full opacity
            d3.selectAll("circle")
                .attr("fill", (d) => {
                    if (d[0] === "Boulder") {
                        return "#00a469"
                    } else {
                        return "#cbcbcb"
                    }
                })

        });

    // svg.selectAll(".my_city_label")
    //     .data(boulder_partners)
    //     .enter()
    //     .append("text")
    //     .attr("class", "my_city_label")
    //     .attr("y", height / 2 - 65)
    //     .attr("x", d => xScale(d.per_capita_impact))
    //     .attr("fill", '#cdfee3')
    //     .attr("text-anchor", "middle")
    //     .text(d => d[0])

    // svg.selectAll(".my_value_label")
    //     .data(boulder_partners)
    //     .enter()
    //     .append("text")
    //     .attr("class", "my_value_label")
    //     .attr("y", height / 2 + 70)
    //     .attr("x", d => xScale(d.per_capita_impact))
    //     .attr("fill", '#cdfee3')
    //     .attr("text-anchor", "middle")
    //     .text(d => d.per_capita_impact.toFixed(2))

    // svg.append("text")
    //     .attr("class", "axisLabel")
    //     .attr("x", margin.left)
    //     .attr("y", height / 2 + 95)
    //     .attr("fill", "#00a469")
    //     // .attr("text-anchor", "end")
    //     .text("Impact Per Capita");




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
