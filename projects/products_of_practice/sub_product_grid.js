const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 10, left: 10, right: 10, bottom: 10 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom);

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

const medievalBtn = d3.select("#medieval");
const renBtn = d3.select("#renaissance");
const frenchBtn = d3.select("#frenchRev");
const industrialBtn = d3.select("#industrial");
const modernBtn = d3.select("#modern");
const contemporaryBtn = d3.select("#contemporary");


d3.csv("./data/sub_products.csv", parse).then(function (data) {
    // data.sort((a,b) => a.value - b.value)
    console.log(data)

    let nested = d3.nest()
        .key(d => d.year)
        .rollup()
        .entries(data)

    console.log(nested)

    let miniData4 = [];
    nested.forEach(d => {
        for (let i = 0; i < d.values.length; i++) {
            for (let j = 0; j < d.values[i].value; j++) {
                miniData4.push({
                    period: d.key,
                    id: d.values[i].sub_product,
                    color: d.values[i].color,
                    innovation: d.values[i].innovation
                })
            }
        }
    })
    console.log(miniData4)

    let renData = miniData4.filter(d => d.period === "1500")
    let contemporaryData = miniData4.filter(d => d.period === "2020")

    // let medievalData = miniData3[0].sub_products;
    // let renData = miniData3[1].sub_products;
    const gridHeight = 40;

    function showViz(dataset) {
        let expandedData = [];
        for (let m = 0; m < gridHeight; m++) {
            for (let j = m; j < dataset.length; j += gridHeight) {
                expandedData.push({
                    id: dataset[j].id,
                    color: dataset[j].color,
                    y: m,
                    innovation: dataset[j].innovation
                })
            }
        }
        let nested = d3.nest()
            .key(d => d.y)
            .rollup()
            .entries(expandedData)
        nested.forEach((d) => {
            d.key = +d.key;
            for (let i = 0; i < d.values.length; i++) {
                d.values[i].x = i;
            }
        })
        console.log(nested)
        

        let yScale = d3.scaleBand()
            .domain(d3.map(nested, d => d.key))
            .range([margin.top, height-margin.top-margin.bottom])
            .padding(0.1)

        let xScale = d3.scaleBand()
            .domain(d3.map(nested[0].values, d => d.x))
            .range([margin.left, width - margin.right - margin.left])
            .padding(0.1)

        //  d3.selectAll().data(nested).attr("transform", (d) => `translate(0,${yScale(d.key)})`)

        let grouping = svg.selectAll(".barGroup").data(nested)

        grouping
            .enter()
            .append("g")
            .attr("class", "barGroup")
            .merge(grouping)
            .attr("transform", (d) => `translate(0,${yScale(d.key)})`)

        grouping.exit()
            .remove();

        let bars = d3.selectAll(".barGroup").selectAll("rect").data(d => d.values)

        bars.enter()
            .append("rect")
            .attr("x", function (p) { return xScale(p.x); })
            // .attr("width", 10)
            // .attr("height", 10)
            .attr("opacity", 0)
            .merge(bars)

            .transition()
            .duration(500)
            .attr("x", function (p) { return xScale(p.x); })
            // .attr("width", function(p) { return xScale.bandwidth() * p.innovation} )
            .attr("width", function(p) {
                if(p.innovation < 0.5) {
                    return xScale.bandwidth() * 0.4;
                } else {
                    return xScale.bandwidth();
                }
                
            } )
            .attr("height", yScale.bandwidth())
            .attr("opacity", 1)
            .attr("fill", p => p.color)


        bars.exit()
            .transition()
            .remove();
    }

    showViz(renData);

    // medievalBtn.on("click", function () {
    //     showViz(medievalData);
    // });
    renBtn.on("click", function () {
        showViz(renData);
    });
    contemporaryBtn.on("click", function () {
        showViz(contemporaryData);
    });

})

function parse(d) {
    return {
        year: d.year,
        product: d.product,
        sub_product: d.sub_product,
        color: d.color,
        value: +d.value,
        innovation: +d.innovation
    }
}
