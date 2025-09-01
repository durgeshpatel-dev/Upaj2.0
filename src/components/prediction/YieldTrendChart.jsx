import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';

// Move data outside component to prevent re-creation on every render
const YIELD_DATA = [
  { year: 2019, yield: 92, avgTemp: 24.5, rainfall: 850, cropType: 'Rice' },
  { year: 2020, yield: 128, avgTemp: 23.8, rainfall: 920, cropType: 'Rice' },
  { year: 2021, yield: 87, avgTemp: 26.2, rainfall: 680, cropType: 'Rice' },
  { year: 2022, yield: 142, avgTemp: 24.1, rainfall: 980, cropType: 'Rice' },
  { year: 2023, yield: 108, avgTemp: 25.3, rainfall: 750, cropType: 'Rice' },
  { year: 2024, yield: 156, avgTemp: 23.9, rainfall: 1020, cropType: 'Rice' }
];

const YieldTrendChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [hoveredData, setHoveredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // More realistic agricultural yield data with seasonal variations and trends
  const data = useMemo(() => YIELD_DATA, []);

  // Memoize hover handlers to prevent re-creation
  const handleMouseOver = useCallback((event, d, dots, tooltip) => {
    setHoveredData(d);
    
    // Find the corresponding dot by data index
    const dotIndex = data.indexOf(d);
    const correspondingDot = d3.select(dots.nodes()[dotIndex]);
    
    // Highlight the dot
    correspondingDot
      .transition()
      .duration(200)
      .attr("r", 10)
      .attr("stroke-width", 3);

    // Show tooltip
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);

    tooltip.html(`
      <div style="color: #50FF9F; font-weight: bold; margin-bottom: 6px;">${d.year}</div>
      <div style="color: #e5e5e5; margin-bottom: 4px;">Yield: ${d.yield} tonnes/hectare</div>
      <div style="color: #a0a0a0; font-size: 11px; margin-bottom: 2px;">Avg Temp: ${d.avgTemp}°C</div>
      <div style="color: #a0a0a0; font-size: 11px; margin-bottom: 2px;">Rainfall: ${d.rainfall}mm</div>
      <div style="color: #a0a0a0; font-size: 11px;">Crop: ${d.cropType}</div>
    `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
  }, [data]);

  const handleMouseMove = useCallback((event, tooltip) => {
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
  }, []);

  const handleMouseOut = useCallback((event, d, dots, tooltip) => {
    setHoveredData(null);
    
    // Find the corresponding dot by data index
    const dotIndex = data.indexOf(d);
    const correspondingDot = d3.select(dots.nodes()[dotIndex]);
    
    // Reset the dot
    correspondingDot
      .transition()
      .duration(200)
      .attr("r", 6)
      .attr("stroke-width", 2);

    // Hide tooltip
    tooltip.transition()
      .duration(200)
      .style("opacity", 0);
  }, [data]);

  useEffect(() => {
    setIsLoading(true);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
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
      .domain([0, d3.max(data, d => d.yield) + 30])
      .range([height, 0]);

    // Add grid lines
    const xGrid = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickFormat("")
      .ticks(6);

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat("")
      .ticks(5);

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(xGrid)
      .selectAll("line")
      .style("stroke", "#333C37")
      .style("stroke-opacity", 0.3)
      .style("stroke-width", 1);

    g.append("g")
      .attr("class", "grid")
      .call(yGrid)
      .selectAll("line")
      .style("stroke", "#333C37")
      .style("stroke-opacity", 0.3)
      .style("stroke-width", 1);

    // Line generator with smooth curve
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.yield))
      .curve(d3.curveCardinal.tension(0.3));

    // Area generator for gradient fill
    const area = d3.area()
      .x(d => xScale(d.year))
      .y0(height)
      .y1(d => yScale(d.yield))
      .curve(d3.curveCardinal.tension(0.3));

    // Create gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "yieldGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 0).attr("y2", height);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#50FF9F")
      .attr("stop-opacity", 0.3);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#50FF9F")
      .attr("stop-opacity", 0.05);

    // Add the area with gradient
    const areaPath = g.append("path")
      .datum(data)
      .attr("fill", "url(#yieldGradient)")
      .attr("d", area)
      .style("opacity", 0);

    // Add the line path
    const linePath = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#50FF9F")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("d", line)
      .style("filter", "drop-shadow(0px 2px 4px rgba(80, 255, 159, 0.3))")
      .style("opacity", 0);

    // Get the total length of the line for animation
    const totalLength = linePath.node().getTotalLength();

    // Set up the line for drawing animation
    linePath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength);

    // Animate the line drawing from start to end
    linePath.transition()
      .duration(2000)
      .ease(d3.easeCircleOut)
      .attr("stroke-dashoffset", 0)
      .style("opacity", 1)
      .on("end", () => {
        // After line animation completes, animate the area
        areaPath.transition()
          .duration(800)
          .ease(d3.easeCircleOut)
          .style("opacity", 1)
          .on("end", () => setIsLoading(false));
      });

    // Add interactive dots at data points
    const dots = g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.yield))
      .attr("r", 0)
      .attr("fill", "#50FF9F")
      .attr("stroke", "#111814")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0px 2px 4px rgba(80, 255, 159, 0.4))");

    // Animate dots appearance after line animation
    dots.transition()
      .duration(600)
      .delay((d, i) => 2000 + (i * 100)) // Start after line animation
      .ease(d3.easeBounceOut)
      .attr("r", 6);

    // Add invisible larger circles for better hover detection
    const hoverDots = g.selectAll(".hover-dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "hover-dot")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.yield))
      .attr("r", 15)
      .attr("fill", "transparent")
      .style("cursor", "pointer");

    // Create tooltip (reuse existing one if it exists)
    let tooltip = d3.select(".yield-tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div")
        .attr("class", "yield-tooltip")
        .style("position", "absolute")
        .style("background", "#1a1f1d")
        .style("border", "1px solid #333C37")
        .style("border-radius", "8px")
        .style("padding", "12px")
        .style("font-size", "12px")
        .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.4)")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", "1000");
    }

    // Hover interactions
    hoverDots
      .on("mouseover", function(event, d) {
        handleMouseOver(event, d, dots, tooltip);
      })
      .on("mousemove", function(event) {
        handleMouseMove(event, tooltip);
      })
      .on("mouseout", function(event, d) {
        handleMouseOut(event, d, dots, tooltip);
      });

    // X-axis
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"))
      .ticks(6);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#A0A0A0")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Y-axis
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => d + " t/ha")
      .ticks(5);

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("fill", "#A0A0A0")
      .style("font-size", "11px");

    g.selectAll(".domain, .tick line")
      .style("stroke", "#333C37")
      .style("stroke-width", 1);

    // Cleanup function
    return () => {
      // Only remove tooltip if component is unmounting
      const tooltips = d3.selectAll(".yield-tooltip");
      if (tooltips.size() > 1) {
        tooltips.remove();
      }
    };
    
  }, []); // Empty dependency array since data is memoized

  return (
    <div className="bg-background-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-text-primary">Yield Trend Analysis</h3>
          <p className="text-text-secondary text-sm">
            {isLoading 
              ? "Loading yield data..." 
              : hoveredData 
                ? `${hoveredData.year}: ${hoveredData.yield} tonnes/hectare` 
                : "Historical Yield Data (2019-2024) - Hover for details"
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-primary text-sm font-medium">
                  {data.length > 1 ? 
                    `${((data[data.length-1].yield - data[0].yield) / data[0].yield * 100).toFixed(1)}%` : 
                    '+0%'
                  } trend
                </span>
              </div>
              <div className="text-text-secondary text-xs">
                Avg: {(data.reduce((sum, d) => sum + d.yield, 0) / data.length).toFixed(1)} t/ha
              </div>
            </>
          )}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-primary text-sm">Loading...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
    </div>
  );
};

export default YieldTrendChart;
