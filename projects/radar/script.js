//Options for the Radar chart, other than default
var cfg = {
    w: 675,
    h: 675,
    maxValue: 10,
    levels: 10,
   opacityArea: 0.20,
    radius:5,
    radians: 2 * Math.PI,
    factor:1,
    factorLegend: 0.85,
  ToRight: 5,
  TranslateX: 100,
   TranslateY:60,
   ExtraWidthX: 700,
   ExtraWidthY: 200,
   duration:200
};

//Will need this for the drag update, not sure how to pass it back and forth
var maxAxisValues = [];

function init(){
  cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.skills.map(function(o){return o.value;}));}));
  var allAxis = (d[0].skills.map(function(i, j){return i.axis;}));
  var total = allAxis.length;
  var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
  d3.select("#chart").select("svg").remove();
  
  var g = d3.select("#chart")
              .append("svg")
              .attr("width", cfg.w+cfg.ExtraWidthX)
              .attr("height", cfg.h+cfg.ExtraWidthY)
            .append("g")
              .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
                .attr("id","chartArea");
  
  for(var j=0; j<cfg.levels; j++){

    var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);

    //Web
      g.selectAll(".levels")
             .data(allAxis)
             .enter()
             .append("svg:line")
             .attr("x1", function(d, i){
                 return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
             .attr("y1", function(d, i){
                 return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
             .attr("x2", function(d, i){
                 return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
             .attr("y2", function(d, i){
                 return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
             .attr("class", "web")
             .style("stroke", "grey")
             .style("stroke-opacity", "0")
             .style("stroke-width", "0.3px")
             .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");

      //Text labels along 12 0'clock axis [1-10]
      g.selectAll(".levels")
          .data([1]) //dummy data
             .enter()
             .append("svg:text")
             .attr("x", function(d){
                 return levelFactor*(1-cfg.factor*Math.sin(0));})
             .attr("y", function(d){
                 return levelFactor*(1-cfg.factor*Math.cos(0));})
             .attr("class", "skill-value")
             .style("font-family", "sans-serif")
             .style("font-size", "10px")
             .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
             .attr("fill", "#737373")
             .text((j+1)*cfg.maxValue/cfg.levels);
  }
  
  series = 0;
  var maxAxisValues = [];
    function drawAxis(){

      var axis = g.selectAll(".axis")
                    .data(allAxis)
                    .enter()
                  .append("g")
                    .attr("class", "axis")
                    .attr("id",function(d){return d;});

        //Axis lines
      axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(j, i){
              maxAxisValues[i] = {x:cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total)), y:0};
              return maxAxisValues[i].x;
            })
            .attr("y2", function(j, i){
              maxAxisValues[i].y = cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
              return maxAxisValues[i].y;
            })
            .attr("class", "line").style("stroke", "grey").style("stroke-width", "1px");

      //Axis labels
      axis.append("text")
          .attr("class", "skill-legend")
          .text(function(d){return d;})
          .style("font-family", "sans-serif")
          .style("font-size", "11px")
          .style("cursor","pointer")
          .attr("text-anchor", "middle")
          .attr("dy", "1.5em")
          .attr("transform", function(d, i){return "translate(0, -10)";})
          .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-80*Math.sin(i*cfg.radians/total);})
          .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

  }

drawAxis();
initPolygon();

   //Fill Areas
  function initPolygon(){
    
        d.forEach(function(y, x){
          dataValues = [];
              
              g.selectAll(".nodes")
                .data(y.skills, function(j, i){
                      dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                  ]);
            });
          
          dataValues.push(dataValues[0]);
          
          g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("polygon")
             .attr("class", "radar-chart-series"+series)
             .attr("id","radar-chart-area-"+y.name.replace(" ","-"))
             .style("stroke-width", "2px")
             .style("stroke", y.color)
             .attr("points",function(d) {
                 var str="";
                 for(var pti=0;pti<d.length;pti++){
                     str=str+d[pti][0]+","+d[pti][1]+" ";
                 }
                 return str;
              })
             .style("fill", function(j, i){return y.color;})
             .style("fill-opacity", cfg.opacityArea);

          series++;

        });
    }

  series=0;

  var drag = d3.drag()
            .on("drag",move)
            .on("end",dragend);

  function dragend(){
        d3.select(".updatevalue.skill") 
                    .style("display","block")
                    .style("text-align","center")
                    .style("margin-top","13px")
                    .style("font-size","14px")
                    .transition().duration(500)
                    .text("Drag a Point to Edit");
        d3.select(".updatevalue.value").style("visibility","hidden");
  }


  function move(dobj, i){
      this.parentNode.appendChild(this);
      var dragTarget = d3.select(this);

      var oldData = dragTarget.data()[0];
      var oldX = parseFloat(dragTarget.attr("cx")) - cfg.w/2;
      var oldY = cfg.h/2 - parseFloat(dragTarget.attr("cy"));

      //Bug for vector @ 270deg -Infinity/Infinity slope
      oldX=(Math.abs(oldX)<0.0000001)?0:oldX;
      oldY=(Math.abs(oldY)<0.0000001)?0:oldY;

      var newY = 0, newX = 0, newValue = 0;
      var maxX = maxAxisValues[i].x - cfg.w/2;
      var maxY = cfg.h/2 - maxAxisValues[i].y;

      if(oldX === 0) {

        newY = oldY - d3.event.dy;
       
          if(Math.abs(newY) > Math.abs(maxY)) {
            newY = maxY;
          }
          newValue = ((newY/oldY) * oldData.value).toFixed(2);
      }
      else {
          var slope = oldY / oldX;
          
          newX = d3.event.dx + parseFloat(dragTarget.attr("cx")) - cfg.w/2;
          
          if(Math.abs(newX) > Math.abs(maxX)) {
            newX = maxX;
          }
          newY = newX * slope;

          var ratio = newX / oldX;
          newValue = (ratio * oldData.value).toFixed(2);
      }

      //Bound the drag behavior to the max and min of the axis, not by pixels but by value calc (easier)
      if(newValue >=1 && newValue<= cfg.levels){

        dragTarget
              .attr("cx", function(){return newX + cfg.w/2 ;})
              .attr("cy", function(){return cfg.h/2 - newY;});

        //Updating the data set with the new value
        (dragTarget.data()[0]).value = newValue;

        //center display for value
        d3.select(".updatevalue.skill").text((dragTarget.data()[0]).axis)
                                        .style("display","block")
                                        .style("font-size","12px")
                                        .style("text-align","center")
                                        .style("margin","20px 0 5px 0");
                               

        d3.select(".updatevalue.value").text(newValue)
                                      .style("display","block")
                                      .style("text-align","center")
                                      .style("visibility","visible");
                                     
       
        //reCalculatePoints();
        //drawPoly();'
        updatePoly();


      }

      //Release the drag listener on the node if you hit the min/max values
      //https://github.com/mbostock/d3/wiki/Drag-Behavior
      else{
          if(newValue <=0){newValue =0;}
          else if(newValue >=cfg.levels){newValue = cfg.levels;}
          dragTarget.on("drag",null);
      }
  }

function updatePoly(){
  d.forEach(function(y, x){
          dataValues = [];
              
              g.selectAll(".nodes")
                .data(y.skills, function(j, i){
                      dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                  ]);
            });  

            dataValues = [dataValues];
          
          g.selectAll("#radar-chart-area-Data-Set")
             .data(dataValues)
             .attr("points",function(d) {
                 console.log(d);
                 var str="";
                 for(var pti=0;pti<d.length;pti++){
                     str=str+d[pti][0]+","+d[pti][1]+" ";
                 }
                 return str;
              });
        });
}

//Put circles on the polygon at inflection points
  d.forEach(function(y, x){
    g.selectAll(".nodes")
      .data(y.skills).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-series"+series)
      .attr("id","radar-chart-points-"+y.name.replace(" ","-"))
      .attr('r', cfg.radius)
      .attr("alt", function(j){return Math.max(j.value, 0);})
      .attr("cx", function(j, i){
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
      return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
      })
      .attr("cy", function(j, i){
        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
      })
      .attr("data-id", function(j){return j.axis;})
      .style("fill", y.color)
      .style("fill-opacity", 0.75)
  .style("z-index",12)
  .style("cursor","pointer")
      .call(drag);

    series++;
  });
}//end init()
init();



function updateEditable(){
  var group = $('.comparision-pool .avatar .name');
  if(group.length ===1){
      d3.select(".edit-btn").transition().duration(500).style("opacity",1).text("Edit "+group[0].innerText).style("visibility","visible");
  }
  else{
      d3.select(".edit-btn").transition().duration(200).style("opacity",0).style("visibility","hidden");
      //Update bar chart data with newly modified polygon value
  }
}

function editSet(){
  var button = d3.select(".edit-btn");
  //Hard coded for now
  var name = d[0].name;
  var centerDisplay = d3.select(".update-value");
  if(button[0][0].innerText.includes("Edit")){
      button.text("Save Changes");

      
      centerDisplay.append("g").attr("class","updatevalue skill") 
                                  .style("display","block")
                                  .style("text-align","center")
                                  .style("margin-top","13px")
                                  .text("Drag a Point to Edit");

      centerDisplay.append("g").attr("class","updatevalue value");


      centerDisplay.transition().duration(500).style("opacity",1).style("visibility","visible");

      // d3.select("#radar-chart-area-"+name.replace(" ","-")).transition().duration(500).style("opacity",0);
      // d3.select("#radar-chart-area-"+name.replace(" ","-")).style("visibility","hidden");

      d3.selectAll("#radar-chart-points-"+name.replace(" ","-"))
          .transition().duration(750).attr("r",15);

      d3.select(".point-value").style("visibility","hidden");
  }
  else if(button[0][0].innerText.includes("Save")){
      button.text("Edit "+name);
  

      d3.selectAll(".updatevalue").remove();
      centerDisplay.transition().duration(500).style("opacity",0).style("visibility","hidden");

        // init();

// 		d3.select('#radar-chart-area-'+name.replace(" ","-"))
      // 		.style("opacity",0);
      // d3.selectAll('#radar-chart-points-'+name.replace(" ","-"))
      // 		.style("opacity",0);

      //http://stackoverflow.com/questions/13136355/d3-js-remove-force-drag-from-a-selection
      d3.selectAll("#radar-chart-points-"+name.replace(" ","-"))
          .transition().duration(750).attr("r",5);

      // d3.select('#radar-chart-area-'+name.replace(" ","-"))
      // 		.transition().duration(750).style("opacity",1);
      // d3.selectAll('#radar-chart-points-'+name.replace(" ","-"))
      // 		.transition().duration(750).style("opacity",1);
  }
}


d3.select(".edit-btn").on("click",editSet);