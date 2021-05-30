

var margin = {top: 150, left: 150, right: 150, bottom: 150};
const diameter = Math.min(innerWidth, innerHeight);
let width = diameter - margin.left - margin.right;
let height = diameter - margin.top - margin.bottom;
let innerRadius = width / 11;
let outerRadius = width / 2 - 50;


var svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    // var filtered_data = data.filter(function(d) {
    //     return d.id == "405";
    // });

    // console.log(filtered_data);
    var dateNest = d3.nest()
        .key(function(d) { return d.date; })
        .entries(data)

    console.log(dateNest)

    var filteredNest = dateNest.filter(function(d,i) {
        return i == 234;
    });

    console.log(filteredNest)

    var filtered_data = [];
    var keys = [];
    for(var i = 0; i < filteredNest[0].values.length; i++) {
        var key = filteredNest[0].values[i].id;
        var arr = data.filter(function(d) {
            return d.id === key
        })
        for(var j = 0; j < arr.length; j++) {
            filtered_data.push(arr[j]);
        }
        keys.push(key);
        
    }
    console.log(filtered_data);

    var scaleDate = d3.scaleTime()
        .domain([new Date("2020-10-05"), new Date("2021-10-04")])

    var histogramValues = d3.histogram()
        .value(function(d) {return d.date})
        .domain(scaleDate.domain())
        .thresholds(scaleDate.ticks(31))

    var bins = histogramValues(data)
    console.log(bins)

    by_id = d3.groups(data, d => d.id)
    console.log(by_id)

    var id_filtered = d3.groups(filtered_data, d => d.id)
    console.log(id_filtered)

    var bins_by_id = [];
        for(var i = 0; i < by_id.length; i++) {
            var key = by_id[i][0]
            var arr = histogramValues(by_id[i][1])
            for(var j = 0; j < arr.length; j++) {
                var date = arr[j].x0;
                var value = arr[j].length;
                bins_by_id.push({key: key, date: date, value: value})
            }
        }
    console.log(bins_by_id);

    var by_date = aq
        .from(bins_by_id) // create an arquero table from the data
        .groupby('date') // group by date
        .pivot("key", "value") // create a key for each state, populated with the # of new cases
        .objects() // return JavaScript objects

    console.log(by_date)

    var filtered_bins = [];
        for(var i = 0; i < id_filtered.length; i++) {
            var key = id_filtered[i][0]
            var arr = histogramValues(id_filtered[i][1])
            for(var j = 0; j < arr.length; j++) {
                var date = arr[j].x0;
                var value = arr[j].length;
                filtered_bins.push({key: key, date: date, value: value})
            }
        }

    var one_outfit = aq.from(filtered_bins) // create an arquero table from the data
        .groupby('date') // group by date
        .pivot("key", "value") // create a key for each state, populated with the # of new cases
        .objects() // return JavaScript objects

    console.log(one_outfit)

    var series = d3.stack()
        // .offset(d3.stackOffsetSilhouette) //*this is how you make it intro a stream graph
        .keys(keys)(one_outfit)
        .map(d => {
            return d.forEach(v => (v.key = d.key)), d;
        })

    console.log(series)

    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(["black", "midnightblue", "steelblue"])
        .unknown("#ccc")

    

    // var histogramValues = d3.histogram()
    //     .value(function(d) {return d.date})
    //     .domain(scaleDate.domain())
    //     .thresholds(scaleDate.ticks(31))

    // bins = histogramValues(filtered_data);
    // console.log(bins)

    const radiusScale = d3.scaleLinear()
        .domain([0, 20])
        .range([innerRadius, outerRadius])

    scaleDate.range([0, Math.PI * 2]);

    let area = d3.areaRadial()
        .curve(d3.curveBasisClosed)
        .angle(d => scaleDate(d.data.date))

    svg.selectAll("path")
        .data(series)
        .enter()
        .append("path")
        .style("fill", d => color(d.key))
        .attr("d", area
            .innerRadius(d => radiusScale(d[0]))
            .outerRadius(d => radiusScale(d[1])));
        
});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group
    }
    
}