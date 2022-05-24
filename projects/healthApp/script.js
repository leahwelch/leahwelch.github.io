
d3.xml("./data/export.xml").then(function (data) {

    var x, i, txt, array;
    xml = data;
    txt = "";
    array = [];
    x = xml.getElementsByTagName('Record');

    for (i = 0; i < x.length; i++) {
        array.push({
            date: new Date(x[i].getAttribute('startDate')),
            year: new Date(x[i].getAttribute('startDate')).getFullYear(),
            value: +x[i].getAttribute('value')
        })


    }

    console.log(array)


})
