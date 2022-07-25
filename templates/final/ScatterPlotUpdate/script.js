//Function to set up the tabs interaction
function showVis(evt) {
    // Declare all variables
    let i, tablinks;

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " active";
}

const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;
const margin = { top: 50, left: 150, right: 50, bottom: 150 };


const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const initialBtn = d3.select("#initialData");
const updateBtn = d3.select("#updatedData");

d3.csv("data/gapminder.csv").then(function (data) {

    console.log(data);

    //Filtering the data for 1957//
    const filtered_data1957 = data.filter((d) => d.year == 1957);

    //Filtering the data to 2007//
    const filtered_data2007 = data.filter((d) => d.year == 2007);

    let xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`);


    let yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`);

    const xAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 2)
        .text("Life Expectancy");

    const yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin.left / 2)
        .text("GDP Per Capita");




    //this function handles setting the scales and drawing the data-driven elements
    function draw(dataset) {
        let lifeExp = {
            min: d3.min(dataset, (d) => +d.lifeExp),
            max: d3.max(dataset, (d) => +d.lifeExp)
        };

        let gdpPercap = {
            min: d3.min(dataset, (d) => +d.gdpPercap),
            max: d3.max(dataset, (d) => +d.gdpPercap)
        };

        let pop = {
            min: d3.min(dataset, (d) => +d.pop),
            max: d3.max(dataset, (d) => +d.pop)
        }

        let xScale = d3.scaleLinear()
            .domain([lifeExp.min, lifeExp.max])
            .range([margin.left, width - margin.right]);

        let yScale = d3.scaleLinear()
            .domain([gdpPercap.min, gdpPercap.max])
            .range([height - margin.bottom, margin.top]);

        let rScale = d3.scaleSqrt()
            .domain([pop.min, pop.max])
            .range([3, 25]);

        function zeroState(selection) {
            selection
                .attr('r', 0)
        }

        let points = svg.selectAll(".nodes")
            .data(dataset, (d) => d.country)

        points.enter()
            .append("circle")
            .attr("class", "nodes")
            .attr("cx", function (d) { return xScale(d.lifeExp); })
            .attr("cy", function (d) { return yScale(d.gdpPercap); })
            .attr("fill", function (d) { return colorScale(d.continent); })
            .call(zeroState)
            .merge(points)
            .transition()
            .duration(500)
            .attr("cx", function (d) { return xScale(d.lifeExp); })
            .attr("cy", function (d) { return yScale(d.gdpPercap); })
            .attr("fill", function (d) { return colorScale(d.continent); })
            .attr("r", function (d) { return rScale(d.pop); });

        points.exit()
            .transition()
            .duration(500)
            .call(zeroState)
            .remove();

        xAxis.transition().duration(500).call(d3.axisBottom().scale(xScale));
        yAxis.transition().duration(500).call(d3.axisLeft().scale(yScale));
    }
    //initialize with the 1957 dataset
    draw(filtered_data1957);

    //buttons handles switching between datasets
    initialBtn.on("click", function () {
        draw(filtered_data1957);
    });
    updateBtn.on("click", function () {
        draw(filtered_data2007);
    });

});
