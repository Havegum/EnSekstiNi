var fylker = ["Østfold", "Akershus", "Oslo", "Hedmark", "Oppland", "Buskerud",
"Vestfold", "Telemark", "Aust-Agder", "Vest-Agder", "Rogaland","Hordaland", "",
"Sogn og Fjordane", "Møre og Romsdal", "Sør-Trøndelag", "Nord-Trøndelag",
"Nordland", "Troms", "Finnmark"];
var parentURL = "";
if (location.search.split("=").length!=1) {  parentURL = "../"  };

for (var x = 0; x in fylker; x++) {
  if (x==12) {  x=13; };
  d3.select("#FylkerNav").append("a").text(fylker[x])
    .attr("href", parentURL+"fylke/fylker.html?fylke="+(fylker.indexOf(fylker[x])+1)).append("br");
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

    Sheet[1].disabled=!Sheet[1].disabled;
    Sheet[2].disabled=!Sheet[1].disabled;

    if(Sheet[2].disabled){
      // If off when press
      colorblindToggle.select('img')
      .attr('src', parentURL+"img/Fargeblind-toggle-off.svg");
      colorblindToggle.select('span').text("Fargeblind?");

    } else {
      // If on when press
      colorblindToggle.select('img')
      .attr('src', parentURL+"img/Fargeblind-toggle-on.svg");
      colorblindToggle.select('span').text("Ikke fargeblind?")
   };
});
