import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import useAuth from '../../hooks/useAuth';
import { predictionAPI } from '../../utils/api';

// Fallback demo data (used only if fetching fails)
const FALLBACK_YIELD_DATA = [
  { year: 2019, yield: 92, avgTemp: 24.5, rainfall: 850, cropType: 'Rice' },
  { year: 2020, yield: 128, avgTemp: 23.8, rainfall: 920, cropType: 'Rice' },
  { year: 2021, yield: 87, avgTemp: 26.2, rainfall: 680, cropType: 'Rice' },
  { year: 2022, yield: 142, avgTemp: 24.1, rainfall: 980, cropType: 'Rice' },
  { year: 2023, yield: 108, avgTemp: 25.3, rainfall: 750, cropType: 'Rice' },
  { year: 2024, yield: 156, avgTemp: 23.9, rainfall: 1020, cropType: 'Rice' }
];

const mapPredictionsToChart = (predictions = []) => {
  // predictions: array of prediction objects from backend
  // Map to { year, yield (t/ha), avgTemp, rainfall, cropType }
  const mapped = predictions
    .map((p) => {
      // Determine year: prefer mlInput.Year, then createdAt, then year field
      const mlYear = p.externalData?.mlInput?.Year;
      const createdAt = p.createdAt || p.date || p.timestamp || (p.createdAt && p.createdAt.$date) || null;
      let year = null;
      if (mlYear) {
        year = Number(mlYear);
      } else if (createdAt) {
        year = new Date(createdAt).getFullYear();
      } else if (p.year) {
        year = Number(p.year);
      } else {
        year = new Date().getFullYear();
      }

      // Determine yield per hectare (t/ha). Prefer explicit mlResponse yield (kg/ha), then yieldPerHectare, then predictedYield heuristics
      let yieldPerHa = null; // in tonnes/hectare
      const mlYieldKgHa = p.externalData?.mlResponse?.yield_kg_ha ?? null;
      if (mlYieldKgHa != null && !Number.isNaN(Number(mlYieldKgHa))) {
        yieldPerHa = Number(mlYieldKgHa) / 1000; // kg/ha -> t/ha
      } else if (p.yieldPerHectare != null && !Number.isNaN(Number(p.yieldPerHectare))) {
        yieldPerHa = Number(p.yieldPerHectare);
      } else if (p.yield_per_hectare != null && !Number.isNaN(Number(p.yield_per_hectare))) {
        yieldPerHa = Number(p.yield_per_hectare);
      } else if (p.predictedYield != null && !Number.isNaN(Number(p.predictedYield))) {
        // If predictedYield looks large (>1000) assume kg/ha; if small assume already t/ha. Use landArea when provided to normalize total -> per-ha
        let val = Number(p.predictedYield);
        const area = Number(p.landArea) || 1;
        let perHa = val;
        if (area > 0 && perHa > 10000) {
          // huge number probably total kg -> normalize and convert
          perHa = perHa / area;
        }
        // Heuristic: if perHa looks like kg/ha (>1000) convert to tonnes
        if (perHa > 1000) perHa = perHa / 1000;
        yieldPerHa = perHa;
      }

      // Average temperature: prefer weather.main.temp, then weather.temperature, then mlInput Avg_Temp_C
      const avgTemp = p.weather?.main?.temp ?? p.weather?.temperature ?? Number(p.externalData?.mlInput?.Avg_Temp_C) ?? p.avgTemp ?? null;

      // Rainfall: prefer mlInput Avg_Rainfall_mm then weather.rainfall
      const rainfall = (p.externalData?.mlInput?.Avg_Rainfall_mm != null && !Number.isNaN(Number(p.externalData.mlInput.Avg_Rainfall_mm)))
        ? Number(p.externalData.mlInput.Avg_Rainfall_mm)
        : (p.weather?.rainfall ?? p.rainfall ?? null);

      const cropType = (p.cropType || p.input?.cropType || p.externalData?.mlInput?.Crop || 'Crop');

      return {
        year: Number(year),
        yield: (yieldPerHa != null && !Number.isNaN(Number(yieldPerHa))) ? Math.round(Number(yieldPerHa) * 100) / 100 : null,
        avgTemp: (avgTemp != null && !Number.isNaN(Number(avgTemp))) ? Number(avgTemp) : null,
        rainfall: (rainfall != null && !Number.isNaN(Number(rainfall))) ? Number(rainfall) : null,
        cropType: cropType
      };
    })
    .filter(d => d.yield !== null && !Number.isNaN(d.yield));

  // sort by year
  mapped.sort((a, b) => a.year - b.year);
  return mapped;
};

const YieldTrendChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const { user, isLoading: authLoading } = useAuth();
  const [hoveredData, setHoveredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(FALLBACK_YIELD_DATA);
  const [error, setError] = useState(null);
  const [visualMode, setVisualMode] = useState('line'); // 'line' | 'bar'
  const [extrapolate, setExtrapolate] = useState(false);
  const [xField, setXField] = useState('year');
  const [yField, setYField] = useState('yield');

  // Fetch user's past predictions on mount (or when user changes)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!user?.id && !user?._id) {
          // no logged in user; use fallback
          setData(FALLBACK_YIELD_DATA);
          setIsLoading(false);
          return;
        }

        const userId = user.id || user._id;
        const resp = await predictionAPI.getUserPredictions(userId);
        console.log('YieldTrendChart fetch result:', resp);
        if (!mounted) return;
        
        // Debug: show raw API shape in console to help trace why fallback is used
        console.debug('YieldTrendChart fetch raw resp:', resp);

        // Try to locate the first array of prediction items in common nested shapes
        let items = [];
        if (resp) {
          if (Array.isArray(resp.data)) items = resp.data;
          else if (Array.isArray(resp.data?.data)) items = resp.data.data;
          else if (Array.isArray(resp.data?.data?.data)) items = resp.data.data.data;
          else if (Array.isArray(resp)) items = resp;
          else if (Array.isArray(resp?.data?.predictions)) items = resp.data.predictions;
        }

        if (items.length > 0) {
          const chartData = mapPredictionsToChart(items);
          if (chartData.length > 0) setData(chartData);
          else setData(FALLBACK_YIELD_DATA);
        } else {
          setError(resp.error || 'Failed to fetch predictions (no array found)');
          setData(FALLBACK_YIELD_DATA);
        }
      } catch (err) {
        console.error('YieldTrendChart fetch error:', err);
        setError(err.message || 'Failed to fetch predictions');
        setData(FALLBACK_YIELD_DATA);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (!authLoading) load();
    return () => { mounted = false; };
  }, [user, authLoading]);

  // Memoize handlers to prevent re-creation
  const handleMouseOver = useCallback((event, d, dots, tooltip) => {
    setHoveredData(d);

    const dotIndex = data.indexOf(d);
    const correspondingDot = d3.select(dots.nodes()[dotIndex]);
    correspondingDot
      .transition()
      .duration(200)
      .attr('r', 10)
      .attr('stroke-width', 3);

    tooltip.transition()
      .duration(200)
      .style('opacity', 1);

    tooltip.html(`
      <div style="color: #50FF9F; font-weight: bold; margin-bottom: 6px;">${d.year}</div>
      <div style="color: #e5e5e5; margin-bottom: 4px;">Yield: ${d.yield} t/ha</div>
      <div style="color: #a0a0a0; font-size: 11px; margin-bottom: 2px;">Avg Temp: ${d.avgTemp ?? '-'}°C</div>
      <div style="color: #a0a0a0; font-size: 11px; margin-bottom: 2px;">Rainfall: ${d.rainfall ?? '-'}mm</div>
      <div style="color: #a0a0a0; font-size: 11px;">Crop: ${d.cropType}</div>
    `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }, [data]);

  const handleMouseMove = useCallback((event, tooltip) => {
    tooltip
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }, []);

  const handleMouseOut = useCallback((event, d, dots, tooltip) => {
    setHoveredData(null);
    const dotIndex = data.indexOf(d);
    const correspondingDot = d3.select(dots.nodes()[dotIndex]);
    correspondingDot
      .transition()
      .duration(200)
      .attr('r', 6)
      .attr('stroke-width', 2);

    tooltip.transition()
      .duration(200)
      .style('opacity', 0);
  }, [data]);

  // derive the data used for drawing (apply extrapolation when enabled)
  const drawData = useMemo(() => {
    if (extrapolate && Array.isArray(data) && data.length === 1) {
      const d = data[0];
      const year = Number(d.year) || new Date().getFullYear();
      const base = Number(d.yield) || 0;
      const prev = { ...d, year: year - 1, yield: +(base * 0.92).toFixed(2), synthetic: true };
      const next = { ...d, year: year + 1, yield: +(base * 1.08).toFixed(2), synthetic: true };
      return [prev, { ...d, synthetic: false }, next];
    }
    // ensure sorted
    return Array.isArray(data) ? [...data].sort((a, b) => a.year - b.year) : data;
  }, [data, extrapolate]);

  // available fields to pick
  const availableFields = useMemo(() => ([
    { key: 'year', label: 'Year' },
    { key: 'cropType', label: 'Crop' },
    { key: 'rainfall', label: 'Rainfall (mm)' },
    { key: 'avgTemp', label: 'Avg Temp (°C)' },
    { key: 'yield', label: 'Yield (t/ha)' }
  ]), []);

  useEffect(() => {
    setIsLoading(true);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 640 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const container = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = container
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    // X scale depends on selected xField and whether it's numeric or categorical
    const xValuesRaw = drawData.map(d => d[xField]);
    const xValuesNumeric = xValuesRaw.map(v => (v == null ? NaN : Number(v)));
    const isXNumeric = xValuesNumeric.every(v => !Number.isNaN(v));
    let xScale;
    if (!isXNumeric) {
      // categorical
      const domain = Array.from(new Set(xValuesRaw.map(v => String(v))));
      xScale = d3.scaleBand()
        .domain(domain)
        .range([0, width])
        .padding(0.2);
    } else {
      xScale = d3.scaleLinear()
        .domain(d3.extent(xValuesNumeric))
        .range([0, width]);
    }

    const yValues = drawData.map(d => Number(d[yField] ?? 0));
    const yMax = d3.max(yValues);
    const yScale = d3.scaleLinear()
      .domain([0, (yMax || 0) + 30])
      .range([height, 0]);

    // Add grid lines
    const xGrid = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickFormat('')
      .ticks(6);

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat('')
      .ticks(5);

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(xGrid)
      .selectAll('line')
      .style('stroke', '#333C37')
      .style('stroke-opacity', 0.3)
      .style('stroke-width', 1);

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .style('stroke', '#333C37')
      .style('stroke-opacity', 0.3)
      .style('stroke-width', 1);

    // Line generator with smooth curve
    const line = d3.line()
      .x(d => isXNumeric ? xScale(Number(d[xField])) : (xScale(String(d[xField])) + xScale.bandwidth() / 2))
      .y(d => yScale(Number(d[yField] ?? 0)))
      .curve(d3.curveCardinal.tension(0.3));

    // Area generator for gradient fill
    const area = d3.area()
      .x(d => isXNumeric ? xScale(Number(d[xField])) : (xScale(String(d[xField])) + xScale.bandwidth() / 2))
      .y0(height)
      .y1(d => yScale(Number(d[yField] ?? 0)))
      .curve(d3.curveCardinal.tension(0.3));

    // Create gradient definition
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'yieldGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', height);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#50FF9F')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#50FF9F')
      .attr('stop-opacity', 0.05);

    // Add the area with gradient
    const areaPath = g.append('path')
      .datum(drawData)
      .attr('fill', 'url(#yieldGradient)')
      .attr('d', area)
      .style('opacity', 0);

    // Add the line path
    const linePath = g.append('path')
      .datum(drawData)
      .attr('fill', 'none')
      .attr('stroke', '#50FF9F')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', line)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(80, 255, 159, 0.3))')
      .style('opacity', 0);

    // Get the total length of the line for animation
  const totalLength = (visualMode === 'line') ? (linePath.node() ? linePath.node().getTotalLength() : 0) : 0;

    // Set up the line for drawing animation
    linePath
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength);

    // Animate the line drawing from start to end
    linePath.transition()
      .duration(1200)
      .ease(d3.easeCircleOut)
      .attr('stroke-dashoffset', 0)
      .style('opacity', 1)
      .on('end', () => {
        // After line animation completes, animate the area
        areaPath.transition()
          .duration(600)
          .ease(d3.easeCircleOut)
          .style('opacity', 1)
          .on('end', () => setIsLoading(false));
      });

    // Add interactive dots at data points
    const dots = g.selectAll('.dot')
      .data(drawData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => {
        if (!isXNumeric) return xScale(String(d[xField])) + xScale.bandwidth() / 2;
        return visualMode === 'bar' ? xScale(Number(d[xField])) : xScale(Number(d[xField]));
      })
      .attr('cy', d => yScale(Number(d[yField] ?? 0)))
      .attr('r', 0)
      .attr('fill', '#50FF9F')
      .attr('stroke', '#111814')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0px 2px 4px rgba(80, 255, 159, 0.4))');

    // Animate dots appearance after line animation
    dots.transition()
      .duration(400)
      .delay((d, i) => 800 + (i * 80))
      .ease(d3.easeBounceOut)
      .attr('r', 6);

    // Add invisible larger circles for better hover detection
    const hoverDots = g.selectAll('.hover-dot')
      .data(drawData)
      .enter().append('circle')
      .attr('class', 'hover-dot')
      .attr('cx', d => !isXNumeric ? (xScale(String(d[xField])) + xScale.bandwidth() / 2) : xScale(Number(d[xField])))
      .attr('cy', d => yScale(Number(d[yField] ?? 0)))
      .attr('r', 15)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer');

    // Create tooltip (reuse existing one if it exists)
    let tooltip = d3.select('.yield-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body').append('div')
        .attr('class', 'yield-tooltip')
        .style('position', 'absolute')
        .style('background', '#1a1f1d')
        .style('border', '1px solid #333C37')
        .style('border-radius', '8px')
        .style('padding', '12px')
        .style('font-size', '12px')
        .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4)')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('z-index', '1000');
    }

    // Hover interactions
    hoverDots
      .on('mouseover', function(event, d) {
        handleMouseOver(event, d, dots, tooltip);
      })
      .on('mousemove', function(event) {
        handleMouseMove(event, tooltip);
      })
      .on('mouseout', function(event, d) {
        handleMouseOut(event, d, dots, tooltip);
      });

    // X-axis
    let xAxis;
    if (!isXNumeric) {
      xAxis = d3.axisBottom(xScale).tickFormat(d => d);
    } else {
      xAxis = d3.axisBottom(xScale).tickFormat(d => d).ticks(Math.min(6, drawData.length));
    }

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', '#A0A0A0')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Y-axis
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => d + ' t/ha')
      .ticks(5);

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('fill', '#A0A0A0')
      .style('font-size', '11px');

    g.selectAll('.domain, .tick line')
      .style('stroke', '#333C37')
      .style('stroke-width', 1);

    // If in bar mode, draw bars (behind dots)
    if (visualMode === 'bar') {
      const isBand = typeof xScale.bandwidth === 'function';
      const computedBarWidth = isBand ? xScale.bandwidth() : Math.max(10, (width / Math.max(1, drawData.length)) * 0.6);

      g.selectAll('.bar')
        .data(drawData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => {
          if (isBand) return xScale(String(d[xField]));
          const xPos = xScale(Number(d[xField]));
          return xPos - (computedBarWidth / 2);
        })
        .attr('y', d => yScale(Number(d[yField] ?? 0)))
        .attr('width', computedBarWidth)
        .attr('height', d => Math.max(0, height - yScale(Number(d[yField] ?? 0))))
        .attr('fill', d => d.synthetic ? 'rgba(80,255,159,0.25)' : '#50FF9F');
    }

    // Cleanup function
    return () => {
      const tooltips = d3.selectAll('.yield-tooltip');
      if (tooltips.size() > 1) {
        tooltips.remove();
      }
    };

  }, [drawData, visualMode]); // Re-draw chart when data or mode changes

  return (
    <div className="bg-background-card p-6 rounded-lg border border-border">
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-text-primary truncate">Yield Trend Analysis</h3>
            <div className="mt-1 text-text-secondary text-xs truncate">
              {isLoading
                ? 'Loading yield data...'
                : hoveredData
                  ? `${hoveredData[xField] ?? hoveredData.year}: ${hoveredData[yField] ?? '-'} ${yField === 'yield' ? 't/ha' : ''}`
                  : (error ? `Using fallback data — ${error}` : 'Historical Yield Data - hover points for details')
              }
            </div>
            <div className="mt-2 text-text-secondary text-xs flex items-center space-x-3">
              {!isLoading ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-primary text-xs font-medium">
                      {data.length > 1 ? `${((data[data.length-1][yField] - data[0][yField]) / Math.max(1, data[0][yField]) * 100).toFixed(1)}%` : '+0%'}
                    </span>
                    <span className="text-text-secondary">trend</span>
                  </div>
                  <div>Avg: {(data.reduce((sum, d) => sum + Number(d[yField] || 0), 0) / Math.max(1, data.length)).toFixed(1)} {yField === 'yield' ? 't/ha' : ''}</div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-primary text-xs">Loading...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <select
              value={visualMode}
              onChange={(e) => setVisualMode(e.target.value)}
              className="text-sm p-1 rounded border bg-background-card"
              title="Visualization mode"
              aria-label="Visualization mode"
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
            </select>

            <select
              value={xField}
              onChange={(e) => setXField(e.target.value)}
              className="text-sm p-1 rounded border bg-background-card"
              title="X axis field"
              aria-label="X axis field"
            >
              {availableFields.map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>

            <select
              value={yField}
              onChange={(e) => setYField(e.target.value)}
              className="text-sm p-1 rounded border bg-background-card"
              title="Y axis field"
              aria-label="Y axis field"
            >
              {availableFields.map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
    </div>
  );
};

export default YieldTrendChart;
