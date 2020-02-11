function waypoints(){
    var sources = document.getElementById("intropics")
    
    var waypoints = triggerEls.map(function(el) {
        var step = +el.getAttribute('data-step')
    })
    return new Waypoint({
        element: el,
        handler: function(direction) {
            var nextStep = direction === 'down' ? step : Math.max(0, step - 1)
            sources.update(nextStep)
        },
        offset: '50%',
    })
}
waypoints()