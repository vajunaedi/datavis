// URL: https://observablehq.com/@18emilyhung/project_map
// Title: project_map
// Author: Tsz Yan Hung (@18emilyhung)
// Version: 721
// Runtime version: 1

const m0 = {
  id: "8d56ed4b3942aaf5@721",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# project_map`
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@5")
)})
    },
    {
      name: "topojson",
      inputs: ["require"],
      value: (function(require){return(
require("topojson-client@3")
)})
    },
    {
      name: "data",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json ('https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json')
)})
    },
    {
      name: "country",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv ('https://raw.githubusercontent.com/18emilyhung/map-visualization/master/data_2.csv')
)})
    },
    {
      name: "relationship",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv ('https://raw.githubusercontent.com/18emilyhung/map-visualization/master/relationship_2.csv')
)})
    },
    {
      name: "sector",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv('https://raw.githubusercontent.com/18emilyhung/map-visualization/master/sector.csv')
)})
    },
    {
      name: "width",
      value: (function(){return(
960
)})
    },
    {
      name: "height",
      value: (function(){return(
800
)})
    },
    {
      inputs: ["d3","width","height"],
      value: (function(d3,width,height)
{
// Create SVG
let svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

// Append empty placeholder g element to the SVG
// g will contain geometry elements
let g = svg.append( "g" );

return svg.node();
}
)
    },
    {
      name: "projection",
      inputs: ["d3","width","height"],
      value: (function(d3,width,height){return(
d3.geoMercator()
    .center([0, 15])
    .translate([width / 2, height / 2])
)})
    },
    {
      name: "path",
      inputs: ["d3","projection"],
      value: (function(d3,projection){return(
d3.geoPath()
    .projection( projection )
)})
    },
    {
      name: "countryMap",
      inputs: ["d3","country"],
      value: (function(d3,country){return(
d3.map(country, (d) => d.CountryCode)
)})
    },
    {
      name: "sectorMap",
      inputs: ["d3","sector"],
      value: (function(d3,sector){return(
d3.map(sector, (d) => d.CountryCode)
)})
    },
    {
      name: "viewof countryselection",
      inputs: ["select","country"],
      value: (function(select,country){return(
select({
  title: 'Choose the country of its loan relationship:',
  options: country.map(country => country.CountryName),
  value: country[0].CountryName
})
)})
    },
    {
      name: "countryselection",
      inputs: ["Generators","viewof countryselection"],
      value: (G, _) => G.input(_)
    },
    {
      name: "kivamap",
      inputs: ["d3","DOM","width","height","d3tip","data","sectorMap","colorsector","path","mutable countrychoice","country","getColor","projection","relationship","countryselection","linkColor","legendOrdinal"],
      value: (function(d3,DOM,width,height,d3tip,data,sectorMap,colorsector,path,$0,country,getColor,projection,relationship,countryselection,linkColor,legendOrdinal)
{
let svg = d3.select(DOM.svg(width, height));

const tooltip = d3tip()
    .style('background-color', '#d3d3d3')
    //.style('border-radius', '10px')
    .style('float', 'left')
    .style('opacity', 0.3)
    .style ('font-size', '10px')
    .style('font-family', 'sans-serif')
    .html(d => `
      <div style='float: right'>
        Country: ${d.CountryName} <br/>
        GDP: ${d.GDPperCapita} <br/>
      </div>`) 
svg.call(tooltip)
 

function freeZoom() {
    svg.attr("transform", d3.event.transform);
}
var mapZoom = d3.zoom().on("zoom", freeZoom);
svg.call(mapZoom)
d3.select("#zoom_in").on("click", function() {
    mapZoom.scaleBy(svg.transition().duration(500), 1.1);
}); 

d3.select("#zoom_out").on("click", function() {
    mapZoom.scaleBy(svg.transition().duration(500), 0.9);
});

const routetooltip = d3tip()
    .style('background-color', 'lightsteelblue')
    .style('border-radius', '8px')
    .style('float', 'left')
    .style('fill', 0.3)
    .style ('font-size', '12px')
    .style('font-family', 'sans-serif')
    .html(d => `
      <div style='float: left'>
        Origin      : ${d.OriginName} <br/>
        Destination : ${d.DestName} <br/>
        Loans_Lended: ${d.NumOfLoan} <br/>
      </div>`) 
svg.call(routetooltip)

let g = svg.append("g");
g.selectAll( "path" )
    .data( data.features )
    .enter()
    .append( "path" )
    .attr("fill", (d) => {
      const rate = sectorMap.get(d.properties.postal);
      if (rate) {
        return colorsector(rate.MajorSector);
      } else {
        return "#f5f5dc"
      }
    })
    .attr ("opacity", "0.8")
    .attr( "stroke", "#808080")
    .style("stroke-dasharray", "1,1")
    .attr( "d", path )
    .attr ("class", "country")
    .attr ("id", "map")
    .on ("mouseover", function (d) {
        d3.select (this). style ("fill", "#8b0000").style ("opacity", 0.5);})
    .on ("mouseout", function (d) {
        d3.select (this). style ("fill", (d) => {
      const rate = sectorMap.get(d.properties.postal);
      if (rate) {
        return colorsector(rate.MajorSector);
      } else {
        return "#f5f5dc"
      }
    })
          .style ("opacity",  0.8);})
    .attr ("cursor", "pointer")
    .on("click",function (d) { $0.value=d.properties.name}) //integration with task 2 on country
  ;
  
g. selectAll ("countrycircle")
   .data(country)
   .enter()
   .append ("circle")
   .attr( "fill", function (d){
     return getColor(d.GDPperCapita)})
   .attr( "opacity", "0.4")
   .attr( "stroke", "#5f9ea0" )
   .attr( "stroke-width", "3" )
   .attr( "r" , function (d){
      return (d.GDPperCapita/5000);})    //the sizing of bubble represents GDPperCapita
   .attr ("cx", function (d) {
      return (projection([d.LONGITUDE, d.LATITUDE])[0]);})
   .attr ("cy", function (d) {
      return (projection([d.LONGITUDE, d.LATITUDE])[1]);})
   .attr ("cursor", "pointer")
   .on ("mouseover",tooltip.show)
   .on ("mouseout", tooltip.hide);

g. selectAll ("countrylabel") //country code label shown on the map
  .data (country)
  .enter()
  .append ("text")
  .attr ("x", function (d) {
      return (projection([d.LONGITUDE, d.LATITUDE])[0]);})
  .attr ("y", function (d) {
      return (projection([d.LONGITUDE, d.LATITUDE])[1]);})
  .text (function (d) {return d.CountryCode})
  .style ('font-size', '10px')
  .style('font-family', 'Yanone Kaffeesatz')
  .style ('fill', '#696969');
  
g. selectAll ("route")      //borrowing-lending relationship
  .data (relationship.filter (function (d) {
  if (countryselection == "All") {return d.OriginName;}  
  else {return d.OriginName == countryselection;}})) 
  .enter()
  .append ("path")
  .attr ("stroke-width",function(d) { 
        return (d.NumOfLoan/400);
      })
  .attr ("d", function (d) {
        return path ({ 
        type:"LineString",
        coordinates: [[d.Origin_Long,d.Origin_Lat],[d.Dest_Long, d.Dest_Lat]]
        });})
  .style ("stroke", function (d) {     //color differ by NumofLoan to solve the clustering illusion
   return linkColor(d.NumOfLoan)})
  .style ("fill", "none")
  .style ("opacity", 0.5)
  .on ("mouseover",routetooltip.show)
  .on ("mouseout", routetooltip.hide);

  
//call the legend of sector coloring 
   svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(50,550)")
    .style("font-size","13px")
    .style('font-family', 'Yanone Kaffeesatz');
  svg.select(".legendOrdinal")
    .call(legendOrdinal);
  

return svg.node();
}
)
    },
    {
      name: "viewof ch",
      inputs: ["checkbox","sectorKey"],
      value: (function(checkbox,sectorKey){return(
checkbox(sectorKey)
)})
    },
    {
      name: "ch",
      inputs: ["Generators","viewof ch"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof ct",
      inputs: ["checkbox","countryKey"],
      value: (function(checkbox,countryKey){return(
checkbox(countryKey)
)})
    },
    {
      name: "ct",
      inputs: ["Generators","viewof ct"],
      value: (G, _) => G.input(_)
    },
    {
      name: "kivatimeseries",
      inputs: ["width","d3","DOM","kiva","triangles","mutable month","month","angles","months_text","date_indicater","sectorKey","myColor","sectorchoice","countrychoice","mutable sectorchoice","year_text"],
      value: (function(width,d3,DOM,kiva,triangles,$0,month,angles,months_text,date_indicater,sectorKey,myColor,sectorchoice,countrychoice,$1,year_text)
{

 const height = width 
  const svg = d3.select(DOM.svg(width, height))
 
  
  const margin = { left: 80, top: 80, right: 80, bottom: 80 }
 
  const xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([
      d3.min([-2300,d3.min(kiva,function (d) { return d.x })]),
      d3.max([2300,d3.max(kiva,function (d) { return d.x })])
      ])

  const yScale = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([
      d3.min([-2300,d3.min(kiva,function (d) { return d.y })]),
      d3.max([2300,d3.max(kiva,function (d) { return d.y })])
      ])
 
  
  const radScale = d3.scalePow()
    .exponent(0.9)
    .range([0, 90])
    .domain([
      d3.min([d3.min(kiva,function (d) { return d.LOAN_AMOUNT })]),
      15000
      ])  

      const xScale3 = d3.scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([-2080,2080])
  
  const yScale3 = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([-2080,2080])
  
  svg.selectAll("polygon")
    .data(triangles)
    .enter().append("polygon")
    .attr("points",function(d) { 
          return d.points.map(function(d) { return [xScale(d.x),yScale(d.y)].join(","); }).join(" ");} )
       .attr("fill", "white") 
  .on('click', function (d) {
       
    if ($0.value.indexOf(d.name) > -1) { 
      {$0.value.splice($0.value.indexOf(d.name), 1)}
    }else{
            {$0.value.push(d.name)}
    }
       $0.value = month

       })
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
  //angle line
    svg.selectAll('path')
    .data([angles])
    .enter()
    .append('path')
      .attr('d', d => line(d))
      .attr('fill', 'none')
      .attr('stroke', '#ff6347')
      .attr('opacity', '.8')
      .style("stroke-dasharray", "2,10")
 
  //month legend
  svg.selectAll("text")
  .data(months_text)
  .enter().append("text")
  .attr("x", function (d) { return xScale3(d.x) })
  .attr("y", function (d) { return yScale3(d.y) })
  .attr("text-anchor", "middle")
  .attr("font-family", "Yanone Kaffeesatz")
  .attr("alignment-baseline", "alphabetic")
  .style ('fill', '#808080')
  .style ('font-size', '12px')
  .text(function (d) { return d.name })
 

  // Line generator, scaling x and y to fill the width and height

  //year line
    svg.selectAll('path2')
    .data([date_indicater])
    .enter()
    .append('path')
      .attr('d', d => line(d))
      .attr('fill', 'none')
      .attr('stroke-width',3)
      .attr('stroke', '#191970')
      .style("stroke-dasharray", ".5,5")


// sector legend   
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 100)
    .attr('transform', 'translate(10,20)');

legend.selectAll('rect')
    .data(sectorKey)
    .enter()
    .append("circle")
    .attr("cx", 20)
    .attr("cy", function (d, i) {
    return i * 16+3;
})
    .attr("r", 5)
   // .attr("height", 10)
    .style("fill", function (d) {
    return myColor(d);
});

legend.selectAll('text')
    .data(sectorKey)
    .enter()
    .append("text")
    .attr("x", 30)
    .attr("font-size", 13)
    .attr("y", function (d, i) {
    return i * 16 + 7;
})
    .text(function (d) {return d});
    
//sector in circle
svg.selectAll('circle')
      .data(kiva.filter(function(d){
  if (sectorchoice.indexOf("All")>-1) {return countrychoice.indexOf(d.COUNTRY_NAME) > -1}
  else {return ($1.value.indexOf(d.SECTOR_NAME) > -1 && countrychoice.indexOf(d.COUNTRY_NAME) > -1)}}))   //d.COUNTRY_NAME == countrychoice
      .enter()
      .append('circle')
      .attr('cx',function (d) { return xScale(d.x) })
      .attr('cy',function (d) { return yScale(d.y) })
      .attr('r',function (d) { return radScale(d.LOAN_AMOUNT) })
      .attr('stroke', 'white')
      .attr('opacity', '.8')
      .attr('stroke-width',3)
      .attr('fill', function(d){return myColor(d.SECTOR_NAME) })

      .on('mouseover', function (d) {
          d3.select(this)
          .transition()
          .duration(500)
          .attr('r', function (d) { return radScale(d.LOAN_AMOUNT) * 1.5 })
          .attr('stroke-width',1)

  })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r', function (d) { return radScale(d.LOAN_AMOUNT)})
          .attr('stroke-width',1)
      })

   .append('title').text(function(d){return d.COUNTRY_CODE_x + "    "+d.SECTOR_NAME + "    "  +d.LOAN_AMOUNT})

//year legend  
svg.selectAll("abc")
  .data(year_text)
  .enter().append("text")
  .attr("x", function (d) { return xScale(d.x)})
  .attr("y", function (d) { return yScale(d.y)-5 })
  .attr("text-anchor", "left")
  .attr("font-family", "Yanone Kaffeesatz")
  .attr("alignment-baseline", "alphabetic")
  .style ('fill', '#808080')
  .style ('font-size', '12px')
  .text(function (d) { return d.name })
 

  return svg.node()
}
)
    },
    {
      name: "d3tip",
      inputs: ["require"],
      value: (function(require){return(
require('d3-tip')
)})
    },
    {
      name: "getColor",
      value: (function(){return(
function getColor(d) {
    return d > 70000  ? '#034e7b' :
           d > 60000  ? '#0570b0' :
           d > 50000  ? '#3690c0' :
           d > 40000  ? '#74a9cf' :
           d > 30000  ? '#a6bddb' :
           d > 20000  ? '#d0d1e6' :
           d > 10000  ? '#ece7f2' :
                      '#fff7fb';
}
)})
    },
    {
      name: "linkColor",
      value: (function(){return(
function linkColor (d) {
  return d > 1000  ? '#8b4513' :
         d > 800   ? '#a0522d' :
         d > 600   ? '#cd853f' :
         d > 400   ? '#d2b48c' :
         d > 200   ? '#deb887' :
                '#f5deb3';
}
)})
    },
    {
      from: "@jashkenas/inputs",
      name: "select",
      remote: "select"
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      name: "color",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleThreshold()
    .domain([10000,20000,30000,40000,50000,60000,70000,80000])
    .range(["#20b2aa", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"])
)})
    },
    {
      name: "colorsector",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleOrdinal()
   .domain (["Agriculture", "Retail", "Services", "Education", "Food", "Clothing", "Construction", "Personal Use", "Housing"])
   .range (["#ed8e83", "#4c1659", "#c5af98", "#F3D03E", "#66a89f", "#1f2a44", "#b24242", "#fccde5", "#d9d9d9"])
)})
    },
    {
      name: "d3Legend",
      inputs: ["require"],
      value: (function(require){return(
require('d3-svg-legend')
)})
    },
    {
      name: "legendOrdinal",
      inputs: ["d3Legend","d3","colorsector"],
      value: (function(d3Legend,d3,colorsector){return(
d3Legend.legendColor()
    .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
    .shapePadding(16)
    .scale(colorsector)
)})
    },
    {
      value: (function(){return(
"Task 2 - Loan Sector Overview'"
)})
    },
    {
      name: "kiva",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv('https://gist.githubusercontent.com/isabella618033/c42867d61766307594aed06a6cd76516/raw/da3eeafaf12c5be31a35508f0a8172f422cc1eb4/kiva.csv',d3.autoType)
)})
    },
    {
      name: "angles",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv('https://gist.githubusercontent.com/isabella618033/1ee520b8934de9d1e447610832e8667d/raw/0ff5d3fe1a8b9103152254d574b41338ba374ffb/angles.csv',d3.autoType)
)})
    },
    {
      name: "months_text",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv('https://gist.githubusercontent.com/isabella618033/8e72066582e9fb20aa186d3b651db319/raw/f1426c7f95cd5193af3ee332335903788c15ff33/months_text.csv',d3.autoType)
)})
    },
    {
      name: "year_text",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv('https://gist.githubusercontent.com/isabella618033/4008e19fb86e4b7ceca756364add935c/raw/5855b262cdc9bbf265b67fab3a5c82bd23103f7d/year_text.csv',d3.autoType)
)})
    },
    {
      name: "date_indicater",
      inputs: ["d3"],
      value: (function(d3){return(
d3.csv('https://gist.githubusercontent.com/isabella618033/25dddffcb5d0e5c991a6fea6eddec840/raw/96e9cfe186dd0372d6ed76f31b4257f49a5a427b/date_indicater.csv',d3.autoType)
)})
    },
    {
      name: "triangles",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json('https://gist.githubusercontent.com/isabella618033/bbd7618a80680da2f0cb2bad9d4c57b9/raw/e2a9ebd7b0faddc921515eb94ca1a1baca706a73/triangles.json',d3.autoType)
)})
    },
    {
      inputs: ["d3","kiva"],
      value: (function(d3,kiva){return(
d3.keys(kiva[1])
)})
    },
    {
      name: "sectorKey",
      inputs: ["d3","kiva"],
      value: (function(d3,kiva){return(
d3.map(kiva, function(d){return d.SECTOR_NAME;}).keys()
)})
    },
    {
      inputs: ["sectorKey"],
      value: (function(sectorKey){return(
sectorKey.push ("All")
)})
    },
    {
      name: "countryKey",
      inputs: ["d3","kiva"],
      value: (function(d3,kiva){return(
d3.map(kiva, function(d){return d.COUNTRY_NAME;}).keys()
)})
    },
    {
      name: "myColor",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleOrdinal()
   .domain (["Agriculture", "Retail", "Services", "Education", "Food", "Clothing", "Construction", "Personal Use", "Housing", "Manufacturing", "Entertainment", "Health", "Arts", "Transportation", "Wholesale"])
   .range (["#ed8e83", "#4c1659", "#c5af98", "#F3D03E", "#66a89f", "#1f2a44", "#b24242", "#fccde5", "#d9d9d9", "#8b4513", "#ff7f50", "#b0e0e6", "#98fb98", "#708090", "#ff00ff"])
)})
    },
    {
      from: "@rohscx/inputs",
      name: "checkbox",
      remote: "checkbox"
    },
    {
      name: "initial countrychoice",
      inputs: ["ct"],
      value: (function(ct){return(
ct
)})
    },
    {
      name: "mutable countrychoice",
      inputs: ["Mutable","initial countrychoice"],
      value: (M, _) => new M(_)
    },
    {
      name: "countrychoice",
      inputs: ["mutable countrychoice"],
      value: _ => _.generator
    },
    {
      name: "initial sectorchoice",
      inputs: ["ch"],
      value: (function(ch){return(
ch
)})
    },
    {
      name: "mutable sectorchoice",
      inputs: ["Mutable","initial sectorchoice"],
      value: (M, _) => new M(_)
    },
    {
      name: "sectorchoice",
      inputs: ["mutable sectorchoice"],
      value: _ => _.generator
    },
    {
      name: "initial month",
      value: (function(){return(
[12, 1, 2, 3, 4, 5, 6, 8, 7, 9, 10, 11]
)})
    },
    {
      name: "mutable month",
      inputs: ["Mutable","initial month"],
      value: (M, _) => new M(_)
    },
    {
      name: "month",
      inputs: ["mutable month"],
      value: _ => _.generator
    }
  ]
};

const m1 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "select",
      inputs: ["input","html"],
      value: (function(input,html){return(
function select(config = {}) {
  let {
    value: formValue,
    title,
    description,
    submit,
    multiple,
    size,
    options
  } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "object" ? o : { value: o, label: o })
  );
  const form = input({
    type: "select",
    title,
    description,
    submit,
    getValue: input => {
      const selected = Array.prototype.filter
        .call(input.options, i => i.selected)
        .map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${
          multiple ? `multiple size="${size || options.length}"` : ""
        }>
          ${options.map(({ value, label }) => Object.assign(html`<option>`, {
              value,
              selected: Array.isArray(formValue)
                ? formValue.includes(value)
                : formValue === value,
              textContent: label
            }))}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, getValue, format, display, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  if (!getValue) getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range", title, description, submit, format, display,
    attributes: {min, max, step, value},
    getValue
  });
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  const wrapper = html`<div></div>`;
  if (!form)
    form = html`<form>
  <input name=input type=${type} />
  </form>`;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) form.input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
    );
  if (format) format = typeof format === "function" ? format : d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
      ? "onclick"
      : type == "checkbox" || type == "radio"
      ? "onchange"
      : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(form.input) : form.input.value;
      if (form.output) {
        const out = display ? display(value) : format ? format(value) : value;
        if (out instanceof window.Element) {
          while (form.output.hasChildNodes()) {
            form.output.removeChild(form.output.lastChild);
          }
          form.output.append(out);
        } else {
          form.output.value = out;
        }
      }
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  while (form.childNodes.length) {
    wrapper.appendChild(form.childNodes[0]);
  }
  form.append(wrapper);
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format@1")
)})
    }
  ]
};

const m2 = {
  id: "@rohscx/inputs",
  variables: [
    {
      name: "checkbox",
      inputs: ["input","html"],
      value: (function(input,html){return(
function checkbox(config = {}) {
  let {value: formValue, title, description, submit, options} = config;
  if (Array.isArray(config)) options = config;
  options = options.map(o => typeof o === "string" ? {value: o, label: o} : o);
  const form = input({
    type: "checkbox", title, description, submit, 
    getValue: input => {
      if (input.length) return Array.prototype.filter.call(input, i => i.checked).map(i => i.value);
      return input.checked ? input.value : undefined;
    }, 
    form: html`
      <form>
        ${options.map(({value, label}) => `
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           <input type=checkbox name=input value=${value || "on"} ${(formValue || []).indexOf(value) > -1 ? 'checked' : ''} style="vertical-align: baseline;" />
           ${label}
          </label>
        `)}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html"],
      value: (function(html){return(
function input(config) {
  let {form, type = "text", attributes = {}, action, getValue, title, description, submit, options} = config;
  if (!form) form = html`<form>
  <input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit) form.append(html`<input name=submit type=submit style="margin: 0 0.75em" value="${typeof submit == 'string' ? submit : 'Submit'}" />`);
  form.append(html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`);
  if (title) form.prepend(html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`);
  if (description) form.append(html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`);
  if (action) {
    action(form);
  } else {
    const verb = submit ? "onsubmit" : type == "button" ? "onclick" : type == "checkbox" || type == "radio" ? "onchange" : "oninput";
    form[verb] = (e) => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output) form.output.value = value;
      form.value = value;
      if (verb !== "oninput") form.dispatchEvent(new CustomEvent("input"));
    };
    if (verb !== "oninput") input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = (e) => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    }
  ]
};

const notebook = {
  id: "8d56ed4b3942aaf5@721",
  modules: [m0,m1,m2]
};

export default notebook;