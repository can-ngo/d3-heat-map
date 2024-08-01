const url ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const colorbrewer = {
   RdYlBu: {
     3: ['#fc8d59', '#ffffbf', '#91bfdb'],
     4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
     5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
     6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
     7: ['#d73027', '#fc8d59', '#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4'],
     8: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9','#74add1','#4575b4'],
     9: [
       '#d73027',
       '#f46d43',
       '#fdae61',
       '#fee090',
       '#ffffbf',
       '#e0f3f8',
       '#abd9e9',
       '#74add1',
       '#4575b4'
     ],
     10: [
       '#a50026',
       '#d73027',
       '#f46d43',
       '#fdae61',
       '#fee090',
       '#e0f3f8',
       '#abd9e9',
       '#74add1',
       '#4575b4',
       '#313695'
     ],
     11: [
       '#a50026',
       '#d73027',
       '#f46d43',
       '#fdae61',
       '#fee090',
       '#ffffbf',
       '#e0f3f8',
       '#abd9e9',
       '#74add1',
       '#4575b4',
       '#313695'
     ]
   },
   RdBu: {
     3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
     4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
     5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
     6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
     7: [
       '#b2182b',
       '#ef8a62',
       '#fddbc7',
       '#f7f7f7',
       '#d1e5f0',
       '#67a9cf',
       '#2166ac'
     ],
     8: [
       '#b2182b',
       '#d6604d',
       '#f4a582',
       '#fddbc7',
       '#d1e5f0',
       '#92c5de',
       '#4393c3',
       '#2166ac'
     ],
     9: [
       '#b2182b',
       '#d6604d',
       '#f4a582',
       '#fddbc7',
       '#f7f7f7',
       '#d1e5f0',
       '#92c5de',
       '#4393c3',
       '#2166ac'
     ],
     10: [
       '#67001f',
       '#b2182b',
       '#d6604d',
       '#f4a582',
       '#fddbc7',
       '#d1e5f0',
       '#92c5de',
       '#4393c3',
       '#2166ac',
       '#053061'
     ],
     11: [
       '#67001f',
       '#b2182b',
       '#d6604d',
       '#f4a582',
       '#fddbc7',
       '#f7f7f7',
       '#d1e5f0',
       '#92c5de',
       '#4393c3',
       '#2166ac',
       '#053061'
     ]
   }
 };


const marginLeft = 60;
const marginTop = 60;
const marginBottom = 50;

fetch(url)
   .then(res => res.json())
   .then(data => {
     
      //width of each cells
      const width = 5 * Math.ceil(data.monthlyVariance.length / 12); //Old: 1200;
      //height of each cell
      const height = 33 * 12; //Old: 550;
     
      const years = data.monthlyVariance.map(item => item.year);
   
      const description = d3.select('.container')
                        .append('h5')
                        .style('text-align','center')
                        .attr('id','description')
                        .html(
                           `${data.monthlyVariance[0].year} - 
                           ${data.monthlyVariance[data.monthlyVariance.length-1].year}:
                            base temperature ${data.baseTemperature}&#8451`
                        );

     //Create SVG container
      const svg = d3.select('.container')
                    .append('svg')
                    .attr('width', width + 150)
                    .attr('height', height + 100)

      //Scaling x settings
      const xScale = d3.scaleBand()
                       .domain(data.monthlyVariance.map( val => val.year))
                       .range([0,width])
                       .padding(0);

      const xAxis = d3.axisBottom(xScale)
                      .tickValues(
                        xScale.domain().filter( year => year % 10 === 0)
                      )
                      .tickFormat( year => {
                        const date = new Date(0);
                        date.setUTCFullYear(year);
                        return d3.utcFormat('%Y')(date)
                      })
                      .tickSize(10, 1)
      //Draw x axis
      svg.append('g')
         .call(xAxis)
         .attr('id','x-axis')
         .attr('transform',`translate(${marginLeft},${height-marginBottom})`)
      
      //Add x legend
      svg.append('text')
         .attr('x', width)
         .attr('y', height - 10)
         .attr('id','x-legend')
         .text('Years')
         .style('font-size','0.8rem')
      
      //Scaling y settings
      const yScale = d3.scaleBand()
                        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                        .range([0,height-marginBottom-marginTop]);

      const yAxis = d3.axisLeft(yScale)
                      .tickValues(yScale.domain())
                      .tickFormat( month => {
                        const date = new Date(0);
                        date.setUTCMonth(month);
                        return d3.utcFormat('%B')(date);
                      });
      
      //Draw y axis
      svg.append('g')
         .call(yAxis)
         .attr('id','y-axis')
         .attr('transform',`translate(${marginLeft},${marginTop})`)
      
      //Add y legend
      svg.append('text')
         .attr('x', marginLeft - 20)
         .attr('y', marginTop - 10)
         .text('Months')
         .style('font-size','0.8rem')

      //Legend
      const legendColors = colorbrewer.RdYlBu[11].reverse();
      const legendWidth = 400;
      const legendHeight = 300 / legendColors.length;

      const variance = data.monthlyVariance.map( val => val.variance);
      const minTemp = data.baseTemperature + Math.min.apply(null, variance);
      const maxTemp = data.baseTemperature + Math.max.apply(null, variance);

      const legendThreshold = d3
                        .scaleThreshold()
                        .domain((function(min, max, count){
                          let array = [];
                          const step = (max - min) / count;
                          const base = min;
                          for (let i = 1; i < count; i++){
                            array.push(base + i * step);
                          }
                          return array;
                        })(minTemp, maxTemp, legendColors.length))
                        .range(legendColors);

      const legendX = d3
                        .scaleLinear()
                        .domain([minTemp, maxTemp])
                        .range([0, legendWidth]);

      const legendXAxis = d3
                        .axisBottom()
                        .scale(legendX)
                        .tickSize(10,0)
                        .tickValues(legendThreshold.domain())
                        .tickFormat(d3.format('.1f'));

      const legend = svg
                        .append('g')
                        .classed('legend',true)
                        .attr('id','legend')
                        .attr('transform',`translate(${marginLeft},${height})`)

      legend.append('g')
            .selectAll('rect')
            .data(
              legendThreshold.range().map( color => {
                const d = legendThreshold.invertExtent(color);
                if (d[0] === null) {
                  d[0] = legendX.domain()[0];
                }
                if (d[1] === null) {
                  d[1] = legendX.domain()[1];
                }
                return d;
              })
            )
            .enter()
            .append('rect')
            .style('fill', d => legendThreshold(d[0]))
            .attr('x', d => legendX(d[0]))
            .attr('y', 0)
            .attr('width', d => 
              d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(null)
            )
            .attr('height', legendHeight)

      legend
            .append('g')
            .call(legendXAxis)
            .attr('transform',`translate(0,${legendHeight})`)
      
      //Tooltip
      const tooltip = d3.select('.container')
                        .append('div')
                        .attr('id','tooltip')
                        .style('opacity',0);
      const overlay = d3.select('.container')
                        .append('div')
                        .attr('class','overlay')
                        .style('opacity',0)
     
      //Heat Map
      svg
            .append('g')
            .classed('map', true)
            .attr('transform', `translate(${marginLeft},${marginTop})`)
            .selectAll('rect')
            .data(data.monthlyVariance)
            .enter()
            .append('rect')
            .attr('class','cell')
            .attr('index', (d,i) => i)
            .attr('data-month', d => d.month)
            .attr('data-year', d => d.year)
            .attr('data-temp', d => d.baseTemperature + d.variance)
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.month))
            .attr('width', d => xScale.bandwidth(d.year))
            .attr('height', d => yScale.bandwidth(d.month))
            .attr('fill', d => legendThreshold(data.baseTemperature + d.variance))
            .on('mouseover', (event, d) => {
              const i = event.currentTarget.style;
              tooltip.style('opacity', 0.9);
              tooltip.attr('data-month', d.month)
              tooltip.attr('data-year', d.year)
              const date = new Date(d.year, d.month)
              tooltip.html(
                `<span class='date'>
                  ${d3.utcFormat('%Y - %B')(date)}
                 </span><br/>
                 <span class='temperature'>
                  ${d3.format('.1f')(data.baseTemperature + d.variance)}
                  &#8451
                 </span><br/>
                 <span class='variance'>
                  ${d3.format('+.1f')(d.variance)}&#8451
                 </span>`
              )
              tooltip.style('left', event.pageX + 10 + 'px')
              tooltip.style('top', event.pageY - 60 + 'px')
              // Change stroke to black
              d3.select(event.currentTarget)
                .style('stroke','black')
                .style('stroke-width', '2px')
              
            })
            .on('mouseout', (event) => {
              tooltip.style('opacity', 0);
              //Reset stroke
              d3.select(event.currentTarget)
                .style('stroke','none')
                .style('stroke-width','0px')
              overlay.style('opacity',0);
            })

    }).catch(err => console.log(err));