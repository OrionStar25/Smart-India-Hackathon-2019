function bubbleChart1() {
  var width = 1400;
  var height = 800;

  var tooltip = floatingTooltip('gates_tooltip', 240);
  // var center = { x: width / 2, y: height / 2 };

  var yearCenters = {
    Dermatology: { x: width / 5, y: height / 2 },
    AntiInfective: { x: 2*width / 5, y: height / 2 },
    Respiratory: { x: 3* width / 5, y: height / 2 },
  };

  var yearsTitleX = {
    Dermatology: 200,
    AntiInfective: 500,
    Respiratory: 850,
  };

  var damper = 0.102;
  var svg = null;
  var bubbles = null;
  var nodes = [];

  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);

  var fillColor1 = d3.scale.ordinal()
    .domain(['low', 'lowmedium', 'medium', 'mediumhigh', 'high'])
    .range(['#7CD3FF', '#49C2FF', '#16B1FF', '#008BD1', '#003C5A']);

  var fillColor2 = d3.scale.ordinal()
    .domain(['low', 'lowmedium', 'medium', 'mediumhigh', 'high'])
    .range(['#34FFBB', '#00EF9F', '#00BC7D', '#00895B', '#00452E']);

  var fillColor3 = d3.scale.ordinal()
    .domain(['low', 'lowmedium', 'medium', 'mediumhigh', 'high'])
    .range(['#F4FFAB', '#E6FF34', '#D1EF00', '#D1EF00', '#A4BC00']);

  var fillColor4 = d3.scale.ordinal()
    .domain(['low', 'lowmedium', 'medium', 'mediumhigh', 'high'])
    .range(['#9F8CD0', '#6D50B7', '#573E96', '#2D204E', '#2D204E']);

  // var radiusScale = d3.scale.pow()
  //   .exponent(4)
  //   .range([2, 50]);

  function createNodes(rawData) {
    var myNodes = rawData.map(function (d) {
      return {
        document_id: d.document_id,
        radius: 23,
        topic: d.topic,
        group: d.group,
        link: d.link,
        class_type: d.class_type,
        x: Math.random() * 1000,
        y: Math.random() * 900,
      };
    });

    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  var chart = function chart(selector, rawData) {
    // console.log(rawData);
    // var maxAmount = d3.max(rawData, function (d) { return +d.total_amount; });
    // radiusScale.domain([0, maxAmount]);

    nodes = createNodes(rawData);
    force.nodes(nodes);
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.document_id; });
    
    // let result = rawData.map(a => a.therapy);
    // console.log(result);

    // for (var i=0; i<result.length; i++) {
    //   if (result[i] === "Dermitology") {
    //     bubbles.enter().append('circle')
    //       .classed('bubble', true)
    //       .attr('r', 0)
    //       .attr('fill', function (d) { return fillColor1(d.group); })
    //       .attr('stroke', function (d) { return d3.rgb(fillColor1(d.group)).darker(); })
    //       .attr('stroke-width', 0.5)
    //       .on('mouseover', showDetail)
    //       .on('mouseout', hideDetail);
    //   }
    // }

    // if(function(d) { console.log(d.therapy); return d.therapy==="Dermitology" })
    // {
    //   bubbles.enter().append('circle')
    //   .classed('bubble', true)
    //   .attr('r', 0)
    //   .attr('fill', function (d) { return fillColor1(d.group); })
    //   .attr('stroke', function (d) { return d3.rgb(fillColor1(d.group)).darker(); })
    //   .attr('stroke-width', 0.5)
    //   .on('mouseover', showDetail)
    //   .on('mouseout', hideDetail);
    // }
    // else
    // if(function(d) { return d.therapy==="AntiInfective"})
    // {
    //   bubbles.enter().append('circle')
    //   .classed('bubble', true)
    //   .attr('r', 0)
    //   .attr('fill', function (d) { return fillColor2(d.group); })
    //   .attr('stroke', function (d) { return d3.rgb(fillColor2(d.group)).darker(); })
    //   .attr('stroke-width', 0.5)
    //   .on('mouseover', showDetail)
    //   .on('mouseout', hideDetail);
    // }
    // else
    // if(function(d) { return d.therapy==="PainManagement"})
    // {
    //   bubbles.enter().append('circle')
    //   .classed('bubble', true)
    //   .attr('r', 0)
    //   .attr('fill', function (d) { return fillColor3(d.group); })
    //   .attr('stroke', function (d) { return d3.rgb(fillColor3(d.group)).darker(); })
    //   .attr('stroke-width', 0.5)
    //   .on('mouseover', showDetail)
    //   .on('mouseout', hideDetail);
    // }
    // else
    // {
    //   bubbles.enter().append('circle')
    //   .classed('bubble', true)
    //   .attr('r', 0)
    //   .attr('fill', function (d) { return fillColor4(d.group); })
    //   .attr('stroke', function (d) { return d3.rgb(fillColor4(d.group)).darker(); })
    //   .attr('stroke-width', 0.5)
    //   .on('mouseover', showDetail)
    //   .on('mouseout', hideDetail);
    // }
    

    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('href', function(d) { return d.link; })
      .attr('fill', function (d) { 
        if(d.class_type==="Dermatology")
          return fillColor1(d.group); 
        else
        if(d.class_type==="AntiInfective")
          return fillColor2(d.group); 
        else
        if(d.class_type==="Respiratory")
          return fillColor3(d.group); 
        else
        return fillColor4(d.group); 
      })
      .attr('stroke', function (d) { return d3.rgb(fillColor1(d.group)).darker(); })
      .attr('stroke-width', 0.5)
      .on('mouseover', showDetail)
      .on('mousedown', function(d) { window.open(d.link, '_blank'); win.focus(); })
      .on('mouseout', hideDetail);

    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    splitBubbles();
  };

  // function groupBubbles() {
  //   hideYears();

  //   force.on('tick', function (e) {
  //     bubbles.each(moveToCenter(e.alpha))
  //       .attr('cx', function (d) { return d.x; })
  //       .attr('cy', function (d) { return d.y; });
  //   });

  //   force.start();
  // }

  // function moveToCenter(alpha) {
  //   return function (d) {
  //     d.x = d.x + (center.x - d.x) * damper * alpha;
  //     d.y = d.y + (center.y - d.y) * damper * alpha;
  //   };
  // }

  function splitBubbles() {
    showYears();

    force.on('tick', function (e) {
      bubbles.each(moveToYears(e.alpha))
        .attr('cx', function (d) { return (d.x - 70); })
        .attr('cy', function (d) { return (d.y - 170) });
    });

    force.start();
  }

  function moveToYears(alpha) {
    return function (d) {
      var target = yearCenters[d.class_type];
      // console.log(target);
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  // function hideYears() {
  //   svg.selectAll('.year').remove();
  // }

  function showYears() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);
    // console.log(years);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Title: </span><span class="value">' +
                  d.topic +
                  '</span><br/>' +
                  '</span>';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'year') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

var myBubbleChart1 = bubbleChart1();

function display1(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart1('#vis', data);
}

// function setupButtons() {
//   d3.select('#toolbar')
//     .selectAll('.button')
//     .on('click', function () {
//       // Remove active class from all buttons
//       d3.selectAll('.button').classed('active', false);
//       // Find the button just clicked
//       var button = d3.select(this);

//       // Set it as the active button
//       button.classed('active', true);

//       // Get the id of the button
//       var buttonId = button.attr('id');

//       // Toggle the bubble chart based on
//       // the currently clicked button.
//       console.log(buttonId);
//       myBubbleChart1.toggleDisplay('year');
//     });
// }

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas1(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('data/reddy_final.csv', display1);
// myBubbleChart1.toggleDisplay('year');
// setup the buttons.
// setupButtons();