const url ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const colorbrewer = {
   RdYlBu: {
     3: ['#fc8d59', '#ffffbf', '#91bfdb'],
     4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
     5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
     6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
     7: [
       '#d73027',
       '#fc8d59',
       '#fee090',
       '#ffffbf',
       '#e0f3f8',
       '#91bfdb',
       '#4575b4'
     ],
     8: [
       '#d73027',
       '#f46d43',
       '#fdae61',
       '#fee090',
       '#e0f3f8',
       '#abd9e9',
       '#74add1',
       '#4575b4'
     ],
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

//Function that convert month number format to Date object
const monthToDate = month => new Date(1970,month-1,1);

const timeFormat = d3.timeFormat('%B');

fetch(url)
   .then(res => res.json())
   .then(data => {
     
      //width of each cells
      const width = 5 * Math.ceil(data.monthlyVariance.length / 12); //Old: 1200;
      //height of each cell
      const height = 33 * 12; //Old: 550;
     
      const monthDomain = [1,2,3,4,5,6,7,8,9,10,11,12].map(item=>monthToDate(item));
     
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
                    .attr('width', width + 100)
                    .attr('height', height + 100)

      //Scaling x settings
      const xScale = d3.scaleLinear()
                       .domain([d3.min(years),d3.max(years)])
                       .range([0,width]);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(20,'s');
      
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
                        .domain(monthDomain)
                        .range([0,height-marginBottom-marginTop]);

      const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
      
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
           
    }).catch(err => console.log(err));