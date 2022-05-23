
d3.xml("./data/export.xml").then(function(data) {
    // console.log(data.getElementsByTagName("Record")[0].getAttribute("stateDate"))
    function myFunction(xml) {
        var x, i, txt, array;
        xml = xml;
        txt = "";
        array = [];
        x = xml.getElementsByTagName('Record');
        // console.log(x)
        for (i = 0; i < x.length; i++) { 
            array.push({date: new Date(x[i].getAttribute('startDate')), value: +x[i].getAttribute('value')})
            // txt += x[i].getAttribute('startDate') + "<br>";

        }
        // document.getElementById("chart").innerHTML = txt; 
        console.log(array)
    }

    myFunction(data)

})
