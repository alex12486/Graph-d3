var width = 1280, height = 800;

var svg = d3.select('.diagram')
	.append('svg')
	.attr('width', width)
	.attr('height', height);

var simulation = d3.forceSimulation()
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("charge", d3.forceManyBody().strength(-10).distanceMax([800]))
	.force("link", d3.forceLink().id(function(d) { return d.id; }).distance(150))
	
var div = d3.select("body")
	.append("div")   
	.attr("class", "tooltip")               
	.style("opacity", 0);


d3.queue()
	.defer(d3.json, './libs/demo.json')
	.await(ready);




function ready (error, data) {

	simulation.nodes(data.nodes);
	simulation.force('link').links(data.links);
	simulation.on("tick", ticked);

var links = svg.append('g')
	.attr('class', 'links')
	.selectAll('.link')
	.data(data.links)
	.enter().append('path')
	.attr('class', 'link')
	.attr('stroke', 'black')
	.attr('opacity', 0.5)
	.attr('stroke-width', 0.5)
	.attr('fill', 'none');

var nodes = svg.append('g')
	.attr('class', 'nodes')
	.selectAll('.node')
	.data(data.nodes)
	.enter().append('circle')
	.attr('class', 'node')
	.attr('fill', 'black')
	.attr('opacity', 1)
	.on('click', clicked)
	.on("mouseover", function(d) {  
		if(this.getAttribute('opacity') == 1) {
			div.transition()        
		   .duration(200)      
	     .style("opacity", .9);      
	   	div.text(d.id)
	     .style("left", (d3.event.pageX) + "px")     
	     .style("top", (d3.event.pageY - 28) + "px");   
	     	} 
	})          
	.on("mouseout", function(d) {       
	  div.transition()        
	    .duration(500)      
	    .style("opacity", 0);   
	});

	function ticked() {
		nodes 
			.attr('cx', function(d) { return d.x })
			.attr('cy', function(d) { return d.y })
			.attr('r', 5);


		links
			.attr('d', function(d) {
	      var dx = d.target.x - d.source.x,
	          dy = d.target.y - d.source.y,
	          dr = Math.sqrt(dx * dx + dy * dy);
	      return "M" + 
	          d.source.x + "," + 
	          d.source.y + "A" + 
	          dr + "," + dr + " 0 0,1 " + 
	          d.target.x + "," + 
	          d.target.y;
	    })
	}

function clicked(d) {
	if(this.getAttribute('opacity') == 1){

		var arraySource = data.links.filter(function(value) { return value.source.id === d.id });
		var arrayTarget = data.links.filter(function(value) { return value.target.id === d.id });
		var array = arraySource.concat(arrayTarget);

		var nodesIndexSource = array.map(function (value) { return value.source.index });
		var nodesIndexTarget = array.map(function (value) { return value.target.index });
		var nodesIndex = nodesIndexSource.concat(nodesIndexTarget);

		svg.selectAll('.link')
		.each(function(d, i){
			var opacity = 0;
			array.forEach(function(value){
				if (value.index == i){
					opacity = 0.5;
				}
			})
			d3.select(this).attr('opacity', opacity);
		})

		svg.selectAll('.node')
		.each(function(d, i){
			var opacity = 0;
			nodesIndex.forEach(function(value){
				if (value == i){
					opacity = 1;
				}
			})
			d3.select(this).attr('opacity', opacity);
		})


	}
}

}

