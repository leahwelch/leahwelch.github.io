
var promises = [
    d3.csv("./data/eras.csv"), 
    d3.csv("./data/Wardrobe.csv")
];
window.createGraphic = function(graphicSelector) {
    
    var graphicEl = d3.select('.graphic')
    var graphicVisEl = graphicEl.select('.graphic__vis')
    var graphicProseEl = graphicEl.select('.graphic__prose')

    var sticky = graphicVisEl.offsetTop;

    var viewHeight = document.querySelector(".graphic").clientHeight;
    var sHeight = document.querySelector(".graphic__prose").scrollHeight;   
    
    console.log(viewHeight);
    console.log(sHeight);
Promise.all(promises).then(function(wardrobedata) {

    var eras = wardrobedata[0];
    var wardrobe = wardrobedata[1];

        var era_start = [];
    for(i = 0; i < eras.length; i++) {
        era_start.push(eras[i].start);
    }
    console.log(era_start);
    var width = document.querySelector(".graphic__vis").clientWidth;
    var widthT = document.querySelector(".graphic__prose").clientWidth;
    var heightT = document.querySelector(".graphic__prose").clientHeight;
    var marginT = {top: 0, left: 10, right: 0, bottom: 0};
    
    var svgT = d3.select(".graphic__prose")
        .append("svg")
        .attr("width", widthT)
        .attr("height", heightT);
    var yScaleT = d3.scaleLinear()
        .domain([1, 60])
        .range([0, heightT]);
    
    var yAxisGenerator = d3.axisRight(yScaleT)
        .tickSize(-14)
        .ticks(60);
    
    var yAxis = svgT.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${marginT.left + 7},0)`)
        .call(yAxisGenerator);
    
    yAxis.selectAll(".tick text")
        .attr("class", "sideLabels")
        .style("visibility", "hidden");
    
    var lineT = svgT.append("line")
        .attr("x1", marginT.left)
        .attr("x2", marginT.left)
        .attr("y1", function() {
            return yScaleT(1);
        })
        .attr("y2", function() {
            return yScaleT(60);
        })
        .attr("stroke", "#a08875");
    

    
    d3.select(".graphic__prose")
        .selectAll(".trigger")
        .data(eras)
        .join("div")
        .attr("class", function(d) {
            if(d.start == 1 || d.end == 60) {
                return "notTrigger";
            } else {
                return "trigger";
            }
        })
        .attr("id", function(d) {
            return d.start;
        })
        .attr('data-step', function(d,i) {
            if(d.start !== 1 && d.end !== 60) {
                return i;
            } 
            
        })
        
        .style("top", function(d) { return yScaleT(d.start) + 26 + "px"; }) //this is the problem right here
        .style("left", d => width + widthT/2 - 14 + "px")
        .style("visibility", function(d) {
            if(d.start == 1 || d.end == 60) {
                return "hidden";
            } else {
                return "visible";
            }
        })
        .style(
        "height", 8 + "px")
        // d =>
        //     (d.start >= d.end
        //     ? 0
        //     : yScaleT(d.end) - yScale(d.start)) +
        //     2 +
        //     "px"
        // )
        .html(
            d => `<div class='timeline_date'>${d.start_year}</div>
                <div class='timeline_loc'>${d.location}</div>
            `
        
        );

        var nyu = document.getElementById("3");
        var nyuTop = nyu.getBoundingClientRect().top;

    console.log(wardrobe);

    var tops = wardrobe.filter(function(d) {
        return d.Category === "Tops";
    });

    console.log(tops);

    var maxItems = tops.length;
    console.log(maxItems);

    var bottoms = wardrobe.filter(function(d) {
        return d.Category === "Bottoms";
    });

    console.log(bottoms);

    var dresses = wardrobe.filter(function(d) {
        return d.Category === "Dresses & Jumpsuits";
    });

    console.log(dresses);

    var outerwear = wardrobe.filter(function(d) {
        return d.Category === "Outwear";
    });

    console.log(outerwear);

    var sets = wardrobe.filter(function(d) {
        return d.Category === "Sets";
    });

    console.log(sets);

    

    var width = document.querySelector(".graphic__vis").clientWidth;
    var height = document.querySelector(".graphic__vis").clientHeight;
    var margin = {top: 0, left: 0, right: 0, bottom: 100};
    
    var svg = d3.select(".graphic__vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleBand()
        .domain(wardrobe.map(function(d) { return d.Category; }))
        .range([width-margin.right, width/2])
        .padding(1);
    
    var yScale = d3.scaleLinear()
        .domain([0, maxItems])
        .range([height-margin.bottom, margin.top]);



    // var triggerEls = [];
    // for(i = 0; i < era_start.length; i++) {
    //     var flagTop = document.getElementById(era_start[i])
    //     triggerEls.push(flagTop.getBoundingClientRect().top);
            
    // }
    // console.log(triggerEls);
          

    var topsG = svg.append("g").attr("class", "topsG")

    topsG.selectAll("rect").data(tops)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Tops")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
        .attr("height", 10)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);
        //.style("opacity", 0.2);

    var bottomsG = svg.append("g").attr("class", "bottomsG")

    bottomsG.selectAll("rect").data(bottoms)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Bottoms")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
        .attr("height", 10)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);
        //.style("opacity", 0.2);

    var dressesG = svg.append("g").attr("class", "dressesG")

    dressesG.selectAll("rect").data(dresses)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Dresses & Jumpsuits")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
        .attr("height", 10)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);
        //.style("opacity", 0.2);

    var setsG = svg.append("g").attr("class", "setsG")

    setsG.selectAll("rect").data(sets)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Sets")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
        .attr("height", 10)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);
        //.style("opacity", 0.2);

    var outerwearG = svg.append("g").attr("class", "outerwearG")

    outerwearG.selectAll("rect").data(outerwear)
        .enter()
        .append("rect")
        .attr("x", function() {
            return xScale("Outwear")
        })
        .attr("y", function(d) { return yScale(d.ypos); })
        .attr("width", 40)
        .attr("height", 10)
        .attr("fill", function(d) { return d.Primary_Color; })
        .attr("rx", 2)								
		.attr("ry", 2);
        //.style("opacity", 0.2);

        var steps = [
            function step0() {
                
            },
            function step1() {
                console.log("yo");
            },
            function step2() {
    
            },
            function step3() {
    
            },
            function step4() {
    
            },
            function step5() {
    
            },
            function step6() {
    
            },
            function step7() {
    
            },
            function step8() {
    
            },
            function step9() {
                console.log("chart is updating");
            },
            function step10() {
    
            },
            function step11() {
    
            }
        ]
    
        // update our chart
        function update(step) {
            steps[step].call()
        }
        
        function setupProse() {
            var height = window.innerHeight * 0.5
            graphicProseEl.selectAll('.trigger')
                .style('height', height + 'px')
        }
        
        function init() {
            //setupProse()
            update(0)
        }
        
        init()
        
        return {
            update: update,
        }
    



});

window.addEventListener("scroll", function() { 
        
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > nyuTop) {
            console.log("nyu");
        }
});
}