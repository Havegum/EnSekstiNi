var KTetris = {};
KTetris["aktivePartier"] = [];
for (x in Partier) {  KTetris[Partier[x]] = false; };

DrawTetris = function(callback) {
  d3.json("js/koalisjonstetris.hexjson", function(error, hexjson) {

  	// Set the size and margins of the svg
  	var margin = {top: 10, right: 10, bottom: 10, left: 10},
  		width = 200 - margin.left - margin.right,
  		height = 600 - margin.top - margin.bottom;

  	// Create the svg element
  	var svg = d3
  		.select("#koalisjonstetris")
      .insert("div", ":first-child").style("float", "right")
  		.append("svg")
  		.attr("id", "tetrisSVG")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
  		.attr("id", "hexGroupTetris")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("fill", "#ccc");

  	// Render the hexes
  	var hexes = d3.renderHexJSON(hexjson, width, height);

  	// Bind the hexes to g elements of the svg and position them
  	var hexmap = svg
  		.selectAll("g")
  		.data(hexes)
  		.enter()
  		.append("g")
  		.attr("id", function(hex) {return hex.key;})
  		.attr("transform", function(hex) {return "translate(" + hex.x + "," + hex.y + ")";});

  	// Draw the polygons around each hex's centre
  	hexmap
  		.append("polygon")
  		.attr("points", function(hex) {return hex.points;})
  		.attr("stroke", "white")
  		.attr("stroke-width", ".6");

    // For queue, uncomment this:
    // callback(null);
  });
};

DrawTetrisBtns = function (callback) {
  let tetrisBtns = d3.select("#koalisjonstetris").insert("div", ":first-child")
  .attr("id", "TetrisBtns");
  for (x in Partier) {
    // LATER, SORT THIS BY PARLAMENTARY SEATS #TODO
    let xParty = Partier[x];
    let xPartyName = PartyFullName[xParty];
    let tetrisBtn = tetrisBtns.append("div").attr('height', '70px')
        .classed("tetrisSwitch", true);

    // Draw input and label
    tetrisBtn.append("input").attr("id", "Tetris"+xParty+"Btn").attr("type", "checkbox");
    tetrisBtn.append("label").attr("for", "Tetris"+xParty+"Btn")
             .append("h2").text(xPartyName)
             .classed("nodrag", true).classed(xParty+"txt", true);

    tetrisBtn.on('click', function(){ ColorSeats(xParty);} );
    tetrisBtn.select('label').on('click', function(){ ColorSeats(xParty, this);} );
  }; // End of for-loop
}; // End of DrawTetrisBtns

ColorSeats = function (party) {
  var thisText = d3.select("#TetrisBtns").select("."+party+'txt');
  thisText.classed('checked', !thisText.classed('checked'));

  if (thisText.classed('checked')){
    thisText.style("margin-left", pTetrisMargins[Partier.indexOf(party)]);
    thisText.select(function() { return this.parentNode; })
    .select(function() { return this.parentNode; }).classed(party+'bg', true);
  } else {
    thisText.style("margin-left", "0");
    thisText.select(function() { return this.parentNode; })
    .select(function() { return this.parentNode; }).classed(party+'bg', false);
  };



  if (KTetris[party]) {
    KTetris[party] = false;    KTetris.aktivePartier = [];
    for (x in Partier) {
      if(KTetris[Partier[x]]) {    KTetris.aktivePartier.push(Partier[x]);    };
    };    // 1: Toggle off party  2: Empty array  3: Refill array
  } else {
    KTetris[party] = true;    KTetris.aktivePartier.push(party);
  };

  RecolorTetris();
};

RecolorTetris = function() {
  let tGroup = d3.select("#hexGroupTetris");    var seteNummer = 0;

  // Remove paint on all
  for (x in Partier){    tGroup.selectAll('g').classed(Partier[x], false);    };

  // re-paint tiles
  for (x in KTetris.aktivePartier) {
    let partiSeter = Mandater[KTetris.aktivePartier[x]];
    // For each active party, get seats
    for (var i=0; i<partiSeter; i++) {
      seteNummer++;
      tGroup.select("#Tetris-s"+seteNummer).classed(KTetris.aktivePartier[x], true);
    }; // End of seat for-loop
  }; // End of party for-loop
}; // End of function

DrawTetris();
DrawTetrisBtns();
