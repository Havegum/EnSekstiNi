var Partier = ["Rodt", "SV", "Ap", "Sp", "MDG", "KrF", "Venstre", "Hoyre", "Frp"];
var pTetrisMargins = ["280px", "136px", "200px", "217px", "150px", "175px", "258px", "271px", "180px"];
var PartyColors = {'Ap':'#F02844', 'Hoyre':'#34A4E2', 'Frp':'#2B4AAF',
          'SV':'#F962D9', 'Sp':'#7D8000', 'KrF':'#FFBD0E', 'Venstre':'#00663C',
          'MDG':'#52BC25', 'Rodt':'#9E0037'};
var PartyFullName = {'Ap':'Arbeiderpartiet', 'Hoyre':'Høyre', 'Frp':'Fremskrittspartiet',
                    'SV':'Sosialistisk Venstreparti', 'Sp':'Senterpartiet', 'KrF':'Kristelig Folkeparti', 'Venstre':'Venstre',
                    'MDG':'Miljøpartiet De Grønne', 'Rodt':'Rødt'};

var Mandater;
var MandaterRisky;
var MandaterGainy;

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
      var pattern = defs.append('pattern');
      pattern
        .attr("id", Partier[x]+"hatched")
        .attr("width", "13").attr("height", "13")
        .attr("patternTransform", "rotate(30 0 0)")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("style", "fill:black;");
      pattern.append("rect")
        .attr("width", "14").attr("height", "14").classed(Partier[x], true);
      pattern.append("line")
        .attr("x1", "0").attr("y1", "0").attr("x2", "0").attr("y2", "14")
        .attr("style", "stroke:#CCC; stroke-width:10");
    };


    callback(null);
  });
};

ReadCSV = function(callback){
  d3.csv("Mandater.csv", function(d) {
      return {
        Ap : +d.Ap,
        Hoyre : +d.Hoyre,
        Frp : +d.Frp,
        SV : +d.SV,
        Sp : +d.Sp,
        KrF : +d.KrF,
        Venstre : +d.Venstre,
        MDG : +d.MDG,
        Rodt : +d.Rodt
      };
    },
    function(error, data) {
      Mandater      = data[0];
      MandaterRisky = data[1];
      MandaterGainy = data[2];
      callback(null);
    });
};

GroupMandates = function(callback){
  var seteNummer = 0;
  for (x in Partier) {
    let partiSeter = Mandater[Partier[x]];
    var seatBinding = d3
          .select("#hexGroupStortingskart").append("g")
          .attr("class", "hex").classed(Partier[x], true)
          .attr("id", "mandatgruppe"+Partier[x]);

    for (var i=0; i<partiSeter; i++) {
      seteNummer++;
      var sete = d3.select("#Sete"+seteNummer).remove();
      seatBinding.append(function() { return sete.node(); });
    };

    for (var i=0; i<MandaterRisky[Partier[x]]; i++){
      seatBinding.select("#Sete"+(seteNummer-i)).attr("fill", "url(#"+Partier[x]+"hatched)")
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
    .attr("x", 111).attr("y", 19).text(Mandater[partyName])
    .attr("font-size", "44px").attr("font-weight", "900").classed(partyName, true);

  infogroup.append("text").append("tspan").attr("text-anchor", "middle")
    .attr("x", 111).attr("y", 85).text(PartyFullName[partyName])
    .attr("font-size", "18px").classed(partyName, true);

  infogroup.append("text").style("opacity", ".6").append("tspan").attr("text-anchor", "middle")
    .attr("x", 111).attr("y", 105).text("-"+MandaterRisky[partyName]+" +"+MandaterGainy[partyName])
    .attr("font-size", "18px").classed(partyName, true);

};

var queue = d3.queue(1)
          .defer(ReadCSV)
          .defer(DrawHexes)
          .defer(GroupMandates)
          .await(clickableBlocs);
