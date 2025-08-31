import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const YieldTrendChart = () => {
  const svgRef = useRef();

  // Sample data matching the design
  const data = [
    { year: 2019, yield: 95 },
    { year: 2020, yield: 125 },
    { year: 2021, yield: 85 },
    { year: 2022, yield: 135 },
    { year: 2023, yield: 105 },
    { year: 2024, yield: 155 }
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 640 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const container = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = container
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.yield) + 20])
      .range([height, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.yield))
      .curve(d3.curveBasis); // Smooth curve like in the design

    // Add the line path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#50FF9F") // Using our primary color
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add dots at data points
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.yield))
      .attr("r", 4)
      .attr("fill", "#50FF9F");

    // X-axis
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"))
      .ticks(6);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#A0A0A0") // Using text-secondary
      .style("font-size", "12px");

    g.selectAll(".domain, .tick line")
      .style("stroke", "#333C37"); // Using border color

    // Remove y-axis as per design
    
  }, [data]);

  return (
    <div className="bg-background-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary">Yield Trend</h3>
          <p className="text-text-secondary text-sm">Historical Yield Data (2019-2024)</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-primary text-sm font-medium">+10%</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
    </div>
  );
};

export default YieldTrendChart;
