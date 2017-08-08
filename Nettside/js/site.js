var queue = d3.queue(1)
          .defer(ReadCSV)
          .defer(DrawHexes)
          .defer(GroupMandates)
          .defer(DrawTetrisBtns)
          .defer(DrawTetris)
          .await(clickableBlocs);


fylker = ["Østfold", "Akershus", "Oslo", "Hedmark", "Oppland", "Buskerud",
"Vestfold", "Telemark", "Aust-Agder", "Vest-Agder", "Rogaland","Hordaland",
"Sogn og Fjordane", "Møre og Romsdal", "Sør-Trøndelag", "Nord-Trøndelag",
"Nordland", "Troms", "Finnmark",];
for (x in fylker) {
  d3.select("#FylkerNav").append("a").text(fylker[x])
    .attr("href", "hordaland/").append("br");
};

// Enforce NODRAG!
for (var i = 0; i<document.getElementsByClassName('nodrag').length; i++){
  document.getElementsByClassName('nodrag')[i].ondragstart = function() {
    return false;
  };
};

// Colorblind toggle
colorblindToggle = d3.select('#fargeblindToggle');
colorblindToggle
.on('mouseover', function(){
    colorblindToggle.select('span')
            .style('transition', 'opacity 30ms')
            .style('opacity', 1);
})
.on('mouseout', function(){
    colorblindToggle.select('span')
            .style('transition', 'opacity 150ms')
            .style('opacity', 0.65);
})
.on('click', function(){
    var Sheet=document.styleSheets;

    if(Sheet[1].disabled){
      // If off when press
      Sheet[1].disabled=false;
      Sheet[2].disabled=true;
      colorblindToggle.select('img')
      .attr('src', "img/Fargeblind-toggle-off.svg");
      colorblindToggle.select('span').text("Fargeblind?");

    } else {
      // If on when press
      Sheet[2].disabled=false;
      Sheet[1].disabled=true;
      colorblindToggle.select('img')
      .attr('src', "img/Fargeblind-toggle-on.svg");
      colorblindToggle.select('span').text("Ikke fargeblind?")
   };
});
