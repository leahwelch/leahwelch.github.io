

var width = document.querySelector("#chart").clientWidth;
var height = document.querySelector("#chart").clientHeight;
var margin = {top: 350, left: 250, right: 250, bottom: 350};

// console.log(width);
// console.log(height);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


d3.csv("./data/wearlog.csv", parse).then(function(data) {
    console.log(data);

    var dateNest = d3.nest()
        .key(function(d) { return d.date; })
        .entries(data)

    console.log(dateNest)

    var filteredNest = dateNest.filter(function(d,i) {
        return i == 236;
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
        .domain([new Date("2020-10-05"), new Date("2021-05-29")])
        .range([margin.left, width-margin.right])

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

    

    // var filtered_by_date = data.filter(function(d) {
    //     return d.date === testDate;
    // })
    // console.log(filtered_by_date)

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
        //   .offset(stacks[stack]) // *this is how you apply the custom function*
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)(one_outfit)
        .map(d => {
            return d.forEach(v => (v.key = d.key)), d;
        })
    
    console.log(series)

    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(["steelblue", "lightblue", "darkred"])
        .unknown("#ccc")

    var yScale = d3.scaleLinear()
        .domain([0, 12])
        .range([height - margin.bottom, margin.top]);

    console.log(d3.max(series, d => d3.max(d, d => d[1])));

    
    svg
        .selectAll("path")
        .data(series)
        .enter()
        .append("path")
          .style("fill", d => color(d.key))
          .attr("d", d3.area()
            .x(function(d, i) { return scaleDate(d.data.date); })
            .y0(function(d) { return yScale(d[0]); })
            .y1(function(d) { return yScale(d[1]); })
            .curve(d3.curveBasis)
        )
    

});

function parse(d) {

    return {
        date: new Date(d.date),
        description: (d.Brand + " ").concat((d.Description + " ")).concat(d.Sub_Category),
        id: d.garmentId,
        group: d.group
    }
    
}