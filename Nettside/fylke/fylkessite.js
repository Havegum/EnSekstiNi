var Data = {};
var Partier = ["Rodt", "SV", "Ap", "Sp", "MDG", "KrF", "Venstre", "Hoyre", "Frp"];
var Fylke = location.search.split("=")[1];

if (0<=Fylke<=20 && Fylke!=13) {
  Fylke = fylker[Fylke-1];
  d3.select("title").text("Koalisjon - "+Fylke+" 2017")
  d3.select("#Tittel").text("Oppslutning i "+Fylke)
} else {
  Fylke="heleNorge";
  d3.select("title").text("Koalisjon - Nasjonal oppslutning")
  d3.select("#Tittel").text("Nasjonal oppslutning")
};


var margin = { top: 70,
               right: 55,
               bottom: 70,
               left: 55   },
    globWidth = 740 - margin.left - margin.right,
    globHeight = 700 - margin.top - margin.bottom;

var locale = d3.timeFormatLocale({
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
  "shortDays": ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
  "months": ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]
});

var globSvg = d3.select('#Oppslutning').append('svg')
        .attr("id", "vizSVG").attr("style", "background:#e5e5e5").append("defs");

function plotChartAt(plotId, range, divisor, b, t){
    // Set function height
    var height = globHeight/divisor;
    var width = globWidth;


    var heightDisplace = +d3.select('#vizSVG').attr("height");
    //Draw svg container for graph
    var svg = d3.select('#vizSVG')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.bottom + margin.top*b + heightDisplace)
                .append("g");
    heightDisplace += margin.top;

    svg.attr("transform", "translate(" + margin.left + "," + heightDisplace + ")");
    // The group is made so all objects inside respect the top-left margins ...

    d3.select('#vizSVG').select("defs").append("clipPath")
            .attr("id", "graph-mask"+plotId)
            .append("rect")
            .attr("width", width)
            .attr("height", height);


    /* Define range and domain boundries:
     *----------- RANGE  = space in pixels the axis will occupy
     *----------- Domain = data range
     */
    var  xScale = d3.scaleTime().range([0, width]).domain([d3.isoParse("2016-09-01"), d3.isoParse("2017-09-11")]);
    var  yScale = d3.scaleLinear().range([height, 0]).domain(range);

    function readyXaxis() {  return d3.axisBottom(xScale).ticks(d3.timeMonth.every(1)).tickFormat(locale.format("%b"));   };
    function readyYaxis() {  return d3.axisLeft(yScale).ticks(4);    };

    svg.append("g")
            .classed("grid", true)
            .attr("transform", "translate(0,"+height+")")
            .call(readyXaxis()
                      .ticks(d3.timeMonth.every(2))
                      .tickSize(-height, 0, 0)
                      .tickFormat(""));

    svg.append("g")
            .classed("grid", true)
            .call(readyYaxis().tickSize(-width, 0, 0).tickFormat(""));

    for (x in Partier) {    DrawPartyLines(svg, Partier[x], Data[Fylke], xScale, yScale, plotId);  };

    svg.append('g').attr("id", "yAxis").classed("yAxis", true).call(readyYaxis());
    svg.append('g').attr("id", "xAxis").classed("xAxis", true).call(readyXaxis())
                   .attr("transform", "translate(0,"+height+")");

};

DrawPartyLines = function(svg, xParty, functionData, xScale, yScale, plotId){
  // This draws the path:
  svg.append('path')
        .datum(functionData)
        .classed("Stroke", true)
        .classed(xParty+"Stroke", true)
        .attr("clip-path", "url(#graph-mask"+plotId+")")
        .attr("d", d3.line()
                 // Plot time on x axis (parse ISO)
                 .x(function(d) { return xScale(d3.isoParse(d.Date)); })
                 // Plot polling on Y axis
                 .y(function(d) { return yScale( d[xParty] ); })
                 );
};

ReadyData = function(callback){
  d3.csv(Fylke+"Polling.csv", function(error, d) {
    if (error) throw error;
    Data[Fylke]=d;
    callback(null);
  });
};

var q = d3.queue();
q.defer(ReadyData);
q.await(function(error) {
  if (error) throw error;

  plotChartAt("oTi", [0,50],  divisor=1,    b=1, t=1);
});
