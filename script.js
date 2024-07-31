

const url ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

//SVG basic dimensions
const width = 1200;
const height = 550;
const marginLeft = 60;
const marginTop = 60;
const marginBottom = 50;

//Create SVG container
const svg = d3.select('.container')
              .append('svg')
              .attr('width', width + 100)
              .attr('height', height)

//Function that convert month number format to Date object
const monthToDate = month => new Date(1970,month-1,1);

const timeFormat = d3.timeFormat('%B');



fetch(url)
    .then(res => res.json())
    .then(data => {
        // console.log(data.monthlyVariance[0].month)
        // console.log(data.monthlyVariance[0].year)

        const monthsDate = data.monthlyVariance.map(item => monthToDate(item.month));
        const monthMax = d3.max(monthsDate);
              monthMax.setDate(monthMax.getDate()+15);      
        const monthMin = d3.min(monthsDate);
              monthMin.setDate(monthMin.getDate()-15)
        
        console.log(d3.extent(monthsDate));

        console.log(monthMax);

        const years = data.monthlyVariance.map(item => item.year);
        

        //Scaling x settings
        const xScale = d3.scaleLinear().domain([d3.min(years),d3.max(years)])
                                       .range([0,width]);
        
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(20,'s');

        //Draw x axis
        svg.append('g')
           .call(xAxis)
           .attr('id','x-axis')
           .attr('transform',`translate(${marginLeft},${height-marginBottom})`)

        //Add x legend
        svg.append('text')
           .attr('x', width - 30)
           .attr('y', height - 10)
           .attr('id','x-legend')
           .text('Years')
           .style('font-size','0.8rem')

        //Scaling y settings
        const yScale = d3.scaleTime().domain([monthMin,monthMax])
                                     .range([0,height-marginBottom-marginTop]);
                                     
        const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat).tickPadding(3);
        
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
    })