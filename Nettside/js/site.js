//var toggleBTN = document.getElementById('test');

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
      .attr('src', "Fargeblind-toggle-off.svg");
      colorblindToggle.select('span').text("Fargeblind?")

    } else {
      // If on when press
      Sheet[2].disabled=false;
      Sheet[1].disabled=true;
      colorblindToggle.select('img')
      .attr('src', "Fargeblind-toggle-on.svg");
      colorblindToggle.select('span').text("Ikke fargeblind?")
   };
});
