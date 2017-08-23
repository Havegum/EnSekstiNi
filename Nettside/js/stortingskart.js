var Partier = ["Rodt", "SV", "Ap", "Sp", "MDG", "KrF", "Venstre", "Hoyre", "Frp"];
var pTetrisMargins = ["280px", "138px", "201px", "217px", "150px", "177px", "260px", "272px", "183px"];
var PartyFullName = {'Ap':'Arbeiderpartiet', 'Hoyre':'Høyre', 'Frp':'Fremskrittspartiet',
                    'SV':'Sosialistisk Venstreparti', 'Sp':'Senterpartiet', 'KrF':'Kristelig Folkeparti',
                    'Venstre':'Venstre','MDG':'Miljøpartiet De Grønne', 'Rodt':'Rødt'};

var Mandater = {};
var MandaterRisky = {};
var MandaterGainy = {};
for (x in Partier) {
  Mandater[Partier[x]]=0;
  MandaterRisky[Partier[x]]=0;
  MandaterGainy[Partier[x]]=0;
};
var gainy1;   var gainy2;   var gainy3;

var ClickedStortingskart = {bool:false, id:""};

DrawHexes = function(callback) {
  d3.json("js/stortinget.hexjson", function(error, hexjson) {

  	// Set the size and margins of the svg
  	var margin = {top: 10, right: 10, bottom: 10, left: 10},
  		width = 500 - margin.left - margin.right,
  		height = 400 - margin.top - margin.bottom;

  	// Create the svg element
  	var svg = d3
  		.select("#stortingskart")
  		.append("svg")
  		.attr("id", "stortingskartSVG")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
  		.attr("id", "hexGroupStortingskart")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("fill", "#CCC");

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

    var defs = d3.select("#stortingskartSVG").append("defs")
    for (x in Partier){
      var hatch = defs.append('pattern');
      hatch
        .attr("id", Partier[x]+"hatched")
        .attr("width", "10").attr("height", "10")
        .attr("patternContentUnits", "objectBoundingBox");
      hatch.append("rect")
        .attr("width", "10").attr("height", "10").classed(Partier[x], true);
      hatch.append("line")
        .attr("x1", "0").attr("y1", "0.85").attr("x2", "5.5").attr("y2", "-3")
        .attr("style", "stroke:#CCC; stroke-width:.25");

      var cross = defs.append('pattern');
      cross
        .attr("id", Partier[x]+"cross")
        .attr("width", "1").attr("height", "1")
        .attr("patternContentUnits", "objectBoundingBox");
      cross.append("rect")
        .attr("width", "10").attr("height", "10").attr("style", "fill:white");
      cross.append("line")
        .attr("x1", ".5").attr("y1", ".2").attr("x2", ".5").attr("y2", ".8")
        .attr("style", "stroke-width:.2").classed(Partier[x]+"Stroke",true);
        cross.append("line")
          .attr("x1", ".2").attr("y1", ".5").attr("x2", ".8").attr("y2", ".5")
          .attr("style", "stroke-width:.2").classed(Partier[x]+"Stroke",true);


    };


    callback(null);
  });
};

ReadCSV = function(callback){
  d3.csv("Mandater-ny.csv", function(error, data) {

      Mandater.arr = Object.values(data[0]);  MandaterRisky.arr  = Object.values(data[1]);
      Mandater.arr.shift();                   MandaterRisky.arr.shift();
      gainy1 = Object.values(data[2]);    gainy2 = Object.values(data[3]);    gainy3 = Object.values(data[4]);
      gainy1.shift();                     gainy2.shift();                     gainy3.shift();

      for (x in Partier) {
      for (y in Mandater.arr) {
          if(Mandater.arr[y] == Partier[x]) {
            Mandater[Partier[x]]++;

          } else if(MandaterRisky.arr[y] == Partier[x]) {
            MandaterRisky[Partier[x]]++;

          } else if(gainy1[y]==Partier[x]  ||  gainy2[y]==Partier[x]  || gainy3[y]==Partier[x] ) {
            MandaterGainy[Partier[x]]++;

      };  };  };
      callback(null);
    });
};

GroupMandates = function(callback){
  var seteNummer = 0;

  for (x in Partier) {
    let xParty = Partier[x];
    let partiSeter = Mandater[xParty];
    var seatBinding = d3
          .select("#hexGroupStortingskart").append("g")
          .attr("class", "hex").classed(xParty, true)
          .attr("id", "mandatgruppe"+xParty);

    for (var i=0; i<partiSeter+MandaterRisky[xParty]; i++) {

      seteNummer++;
      if(i<partiSeter) {
      var sete = d3.select("#Sete"+seteNummer).remove();
      seatBinding.append(function() { return sete.node(); });

      } else {
      var sete = d3.select("#Sete"+seteNummer).attr("fill", "url(#"+xParty+"hatched)").remove();
      seatBinding.append(function() { return sete.node(); });

      };
    };
  };
  callback(null);
};

clickableBlocs = function(){
  var hexes = d3.selectAll(".hex");

  hexes
  .on("mouseover", function(){
      if(!ClickedStortingskart.bool){
        //  If no group ClickedStortingskart, fade all but mouseover object
        hexes.classed("semifadehex", true);
        d3.select(this).classed("semifadehex", false);
      } else {
        // Otherwise, leave all faded, except ClickedStortingskart, and mouseover object.
        hexes.classed("semifadehex", false);
        d3.select(this).classed("semifadehex", true);
        d3.select("#"+ClickedStortingskart.id).classed("semifadehex", false);
      };
    });

    hexes
    .on("mouseout", function(){
      if(!ClickedStortingskart.bool){
        //If no group ClickedStortingskart, mouseout clears semifade
        hexes.classed("semifadehex", false);
      } else {
        //If ClickedStortingskart, clear
        hexes.classed("semifadehex", false);
        d3.select("#"+ClickedStortingskart.id).classed("fadehex", false).classed("semifadehex", false);
      };
    });

    hexes
    .on("click", function () {
      if(ClickedStortingskart.id == this.id){
        ClickedStortingskart.bool = false;
        ClickedStortingskart.id = "";
        hexes.classed("semifadehex", true)
             .classed("fadehex", false);
        d3.select(this).classed("semifadehex", false);
        d3.select("#infogroup").remove();


      } else {
        ClickedStortingskart.bool = true;
        ClickedStortingskart.id = this.id;
        hexes.classed("fadehex", true)
                            .classed("semifadehex", false);
        d3.select(this).classed("fadehex", false);
        showInfo(ClickedStortingskart.id.slice(12));
      };
    });
};

showInfo = function(partyName){
  d3.select("#infogroup").remove();
  var infogroup = d3.select("#stortingskartSVG").append("g")
    .attr("id", "infogroup")
    .attr("transform", "translate(138 274)");

  infogroup.append("polygon")
    .attr("points", "300,150 225,280 75,280 0,150 75,20 225,20")
    .attr("transform", "rotate(30 150 150), scale(.29)")
    .classed("Stroke", true).classed(partyName+"Stroke", true);

  infogroup.append("text").append("tspan").attr("text-anchor", "middle")
    .attr("x", 111).attr("y", 19).text(Mandater[partyName]+MandaterRisky[partyName])
    .attr("font-size", "44px").attr("font-weight", "900").classed(partyName, true);

  infogroup.append("text").append("tspan").attr("text-anchor", "middle")
    .attr("x", 111).attr("y", 85).text(PartyFullName[partyName])
    .attr("font-size", "18px").classed(partyName, true);

  infogroup.append("text").style("opacity", ".6").append("tspan").attr("text-anchor", "middle")
    .attr("x", 111).attr("y", 105).text("-"+MandaterRisky[partyName]+" +"+MandaterGainy[partyName])
    .attr("font-size", "18px").classed(partyName, true);

};
