var width = 960,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height);

var locationData;

// Parse data and get map set up
d3.json('us.json', function(error, json) {
  if (error) return console.error(error);

  svg.append('path')
    .datum(topojson.feature(json, json.objects.land))
    .attr('d', path)
    .attr('class', "us");

  svg.append('path')
    .datum(topojson.mesh(json, json.objects.counties, function(a,b){
      return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)
    }))
    .attr('d', path)
    .attr('class', 'counties');

  svg.append("path")
    .datum(topojson.mesh(json, json.objects.states, function(a, b){
      return a !== b;
    }))
    .attr("d", path)
    .attr("class", "states");

  // Shooting Data
  d3.csv("data.csv")
    .row(function(d) {
      return {
        case: d.Case,
        lat: parseFloat(d.latitude),
        lng: parseFloat(d.longitude),
        date: parseFloat(d.Year),
        injured: parseFloat(d.Injured),
        fatalities: parseFloat(d.Fatalities)
      }})
    .get(function(err, rows) {
      if (err) return console.error(err);
      locationData = rows;
      // console.log(locationData);
    });
});

// Set up circle creation
var displayLocations = function(data) {
  var locations = svg.selectAll('.location')
    .data(data, function(d){
      return d.case
    })

  locations.enter()
    .append('circle')
      .attr('class', 'location')
      .attr("transform", function(d) {
        return "translate(" + projection([d.lng,d.lat]) + ")";
      })
      .attr('r', 1)
      .transition().duration(400)
        .attr("r", 5);

  locations.exit()
    .transition().duration(200)
      .attr("r",1)
      .remove();
};


// Set up text creation
var displayText = function(data) {
  d3.select('#injured')
    .selectAll('span')
    .data(data)
    .enter()
    .append('span')
    .text(function(d){
      return d.injured;
    })
};


// Slider
d3.select('#slider').call(d3.slider()
  .axis(true).min(1980).max(2020)
  .on("slide", function(evt, val) {
    console.log(val);
    d3.select('#year').text(val.toFixed(0))

    var newData = locationData.filter(function(d){
      return d.date < val
    })

    var textData = locationData.filter(function(d){
      return d.injured < 300
    })
    displayLocations(newData)
    displayText(textData)
  })
)
