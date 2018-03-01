var width = 960,
    height = 500;

var projection = d3.geoAlbersUsa()
   .translate([width/2, height/2])
   .scale([1000])

var path = d3.geoPath()
   .projection(projection)

var svg = d3.select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

d3.json('scripts/us.json', function(json){

  svg.append('g')
    .selectAll('path')
    .data(json.features)
    .enter()
    .append('path')
      .attr('d', path)
      .style('stroke', 'black')
      .style('stroke-width', .5)
      .style('fill', 'white')


  // load and display the cities
  d3.csv("data.csv", function(data) {

    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('r', 5)
      .attr("transform", function(d) {
        return "translate(" + projection([d.longitude,d.latitude]) + ")";
      })
  });
});

// d3.select('#slider').call(d3.slider().scale(d3.time.scale().domain([new Date(1982,1,1), new Date(2018,1,1)])).axis(d3.svg.axis()));
