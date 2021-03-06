var KTetris = {};
KTetris.aktivePartier = [];
KTetris.GainySeats = 0;
for (x in Partier) {  KTetris[Partier[x]]         = 0;
                      KTetris[Partier[x]+"risky"] = 0;
                      KTetris[Partier[x]+"gainy"] = 0;
                      KTetris[Partier[x]+"bool"]  = false;   };

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
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("fill", "#ccc");

  	// Render the hexes
  	var hexes = d3.renderHexJSON(hexjson, width, height);

    var hexbg = svg
        .append("g").attr("id", "tetrisBG")
    		.selectAll("g")
    		.data(hexes)
    		.enter()
    		.append("g")
    		.attr("transform", function(hex) {return "translate(" + hex.x + "," + hex.y + ")";});

    	// Draw the polygons around each hex's centre
    hexbg
    		.append("polygon")
    		.attr("points", function(hex) {return hex.points;})
    		.attr("stroke", "white")
    		.attr("stroke-width", ".6");

    var group = document.querySelector("#tetrisBG");
    var bgNodes = group.getElementsByTagName("g");
    for (var i=85; i<169; i++) {
        d3.select(bgNodes[i]).attr("fill", "white");
    };


  	// Bind the hexes to g elements of the svg and position them
  	var hexmap = svg
      .append("g")
  		.attr("id", "hexGroupTetris")
  		.selectAll("g")
  		.data(hexes)
  		.enter()
  		.append("g")
  		.attr("id", function(hex) {return hex.key;})
  		.attr("transform", function(hex) {return "translate(" + hex.x + "," + hex.y + ")";})
  		.attr("style", "opacity:0; -webkit-transition: opacity 200ms; transition: opacity 200ms;");


  	// Draw the polygons around each hex's centre
  	hexmap
  		.append("polygon")
  		.attr("points", function(hex) {return hex.points;})
  		.attr("stroke", "white")
  		.attr("stroke-width", ".6");

    svg.select("#hexGroupTetris").append("g").attr("id", "whiteGroup");
    for (var i=86; i<=169; i++) {
      let removed = svg.select("#hexGroupTetris").select("#Tetris-s"+i).attr("fill", "white").remove();
      svg.select("#whiteGroup").append(function() { return removed.node(); });
    };
    callback(null);
  });
};

DrawTetrisBtns = function (callback) {
  let tetrisBtns = d3.select("#koalisjonstetris").insert("div", ":first-child")
  .attr("id", "TetrisBtns");
  for (x in Partier) {
    // LATER, SORT THIS BY PARLAMENTARY SEATS #TODO
    let xParty = Partier[x];
    let xPartyName = PartyFullName[xParty];
    let tetrisBtn = tetrisBtns.append("label").attr('height', '70px')
        .classed("tetrisSwitch", true).attr("for", "Tetris"+xParty+"Btn");

    // Draw input and label
    tetrisBtn.append("input").attr("id", "Tetris"+xParty+"Btn").attr("type", "checkbox");
    tetrisBtn.append("label").attr("for", "Tetris"+xParty+"Btn")
             .append("h3").text(xPartyName).style("display", "inline-block")
             .classed("nodrag", true).classed(xParty+"txt", true);

    tetrisBtn.select("label")
    .append("span").attr("style", "float: right; margin: 5px auto; cursor: pointer;").classed(xParty+"txt", true).classed("nodrag", true)
    .text(Mandater[xParty]+MandaterRisky[xParty]);

    tetrisBtn.select('input').on('change', function(){  ColorSeats(xParty); });
  }; // End of for-loop
  callback(null);
}; // End of DrawTetrisBtns

ColorSeats = function (party) {
  // party is based on which button called this function
  // The following block handles button styling:
  var thisText = d3.select("#TetrisBtns").select("."+party+'txt');
  d3.select("#TetrisBtns").select("#Tetris"+party+'Btn').property('checked', !KTetris[party+"bool"]);
  thisText.classed('checked', !thisText.classed('checked'));
  if (thisText.classed('checked')){

    thisText.style("-webkit-transform", "translate("+pTetrisMargins[Partier.indexOf(party)]+",0)");
    thisText.style("-moz-transform", "translate("+pTetrisMargins[Partier.indexOf(party)]+",0)");
    thisText.style("transform", "translate("+pTetrisMargins[Partier.indexOf(party)]+",0)");
    thisText.select(function() { return this.parentNode; })
    .select(function() { return this.parentNode; }).classed(party+'bg', true);

  } else {

    thisText.style("-webkit-transform", "translate(0,0)");
    thisText.style("-moz-transform", "translate(0,0)");
    thisText.style("transform", "translate(0,0)");
    thisText.select(function() { return this.parentNode; })
    .select(function() { return this.parentNode; }).classed(party+'bg', false);
  }

  // Update bool, if party active, push to list, otherwise splice out from array
  KTetris[party+"bool"] = !KTetris[party+"bool"];
  if (KTetris[party+"bool"]) {
    KTetris.aktivePartier.push(party);
  } else {
    KTetris.aktivePartier.splice( KTetris.aktivePartier.indexOf(party), 1 );
  }

  //  setTimeout(RecolorTetris, 50)
  RecolorTetris();
};

RecolorTetris = function() {
  let tGroup = d3.select("#hexGroupTetris");
  let active = KTetris.aktivePartier;
  KTetris.GainySeats = 0;
  var seteNummer = 0;

  // Reset numbers
  for (x in Partier) {
    KTetris[Partier[x]] = 0;
    KTetris[Partier[x]+"risky"] = 0;
    KTetris[Partier[x]+"gainy"] = 0;
  }

  // Go through each seat, and add most secure seat:
  for (var x=0; x<=169; x++) {

      var indx = active.indexOf(Mandater.arr[x]);
      if (indx != -1) {
        KTetris[active[indx]]++;
      } else {
          indx = active.indexOf(MandaterRisky.arr[x]);
          if (indx != -1) {
            KTetris[active[indx]+"risky"]++;
          } else {
            indx = active.indexOf(gainy1[x]);
            if (indx != -1) {
              KTetris[active[indx]+"gainy"]++;
            } else {
              indx = active.indexOf(gainy2[x]);
              if (indx != -1) {
                KTetris[active[indx]+"gainy"]++;
              } else {
                indx = active.indexOf(gainy3[x]);
                if (indx != -1) {
                  KTetris[active[indx]+"gainy"]++;
    }  }  }  }  }  }

  // re-paint tiles
  setTimeout( function() {
    // Remove paint on all
    tGroup.selectAll('.hatched').attr("fill", "CCC").classed("hatched", false);
    tGroup.selectAll('g').attr("class", "").style("opacity", "0");
    tGroup.select("#whiteGroup").style("opacity", "1").selectAll("g").attr("fill", "white");

    for (x in active) {
      let xParty = active[x];
      let partiSeter = KTetris[xParty];

      for (var i=0; i<partiSeter+KTetris[xParty+"risky"]; i++) {
        seteNummer++;

        if (i<partiSeter) {
          tGroup.select("#Tetris-s"+seteNummer)
          .classed(xParty, true).style("opacity", "1");

        } else {
          tGroup.select("#Tetris-s"+seteNummer)
          .attr("fill", "url(#"+xParty+"hatched)" ).style("opacity", "1").classed("hatched", true);
      }  }  // End of safe/risky seats bool & for-loop

      for (var j=0; j<KTetris[xParty+"gainy"]; j++){
        tGroup.select("#Tetris-s"+(169-KTetris.GainySeats))
              .attr("fill", "url(#"+xParty+"cross)").style("opacity", "1");
        KTetris.GainySeats++;
      } // End of gainy seats for-loop
    } // End of party for-loop
  }, 250);

  // Update text under:
  setTimeout(function(){
      if (seteNummer == 0) {
          d3.select("#ktetrisText").style("opacity", "0")
            .select(function() { return this.parentNode; }).select("#ktetrisTextPadding").style("height", "0px");
      } else {
        d3.select("#ktetrisText").style("opacity", "1")
          .select(function() { return this.parentNode; }).select("#ktetrisTextPadding").style("height", "40px");
        if (seteNummer<85) {
          d3.select("#ktetrisText").text("Du mangler "+(85-seteNummer)+" mandater for flertall");
          if (seteNummer == 84) {
            d3.select("#ktetrisText").text("Du mangler kun et mandat for flertall!")
          }
        } else {
          d3.select("#ktetrisText").text("Denne koalisjonen har "+(seteNummer-85)+" mandater over flertall");
      }  }
  }, 350);

}; // End of function
