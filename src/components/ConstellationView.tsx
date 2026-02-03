import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { WatchNode } from '@/types/watchlist';

interface ConstellationViewProps {
  watchlist: WatchNode[];
  onRemove: (id: string) => void;
}

// Extend d3's SimulationNodeDatum to include our data properties
interface GraphNode extends d3.SimulationNodeDatum, WatchNode {}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number; // strength based on shared genres
}

export const ConstellationView = ({ watchlist, onRemove }: ConstellationViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // We use a ref to store the simulation so we can stop/restart it without losing state
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Prepare graph data
  // We memoize the calculation of links to avoid recalculating on every render unless items change
  const graphData = useMemo(() => {
    // Clone nodes to avoid mutating the original prop objects directly if d3 modifies them
    // Although d3.forceSimulation modifies the node objects (adds x, y, vx, vy)
    const nodes: GraphNode[] = watchlist.map(item => ({ ...item }));
    const links: GraphLink[] = [];

    // Create links based on shared genres
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const source = nodes[i];
        const target = nodes[j];
        
        // Count shared genres
        // Safe check for genres if undefined
        const genresA = source.genres || [];
        const genresB = target.genres || [];
        const sharedGenres = genresA.filter(g => genresB.includes(g));
        
        if (sharedGenres.length > 0) {
          links.push({
            source: source.id,
            target: target.id,
            value: sharedGenres.length
          });
        }
      }
    }
    return { nodes, links };
  }, [watchlist]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("width", "100%")
      .style("height", "100%");

    // Clear everything to ensure clean state on significant data changes
    svg.selectAll("*").remove();

    if (graphData.nodes.length === 0) {
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height / 2)
           .attr("text-anchor", "middle")
           .attr("fill", "#666")
           .text("No items in constellation");
        return;
    }
    
    // 1. Defs for circular images
    const defs = svg.append("defs");
    
    // Add patterns for images
    graphData.nodes.forEach(d => {
        defs.append("pattern")
        .attr("id", `img-${d.id.replace(/[^a-zA-Z0-9-]/g, '') }`) // sanitize ID for selector
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("href", d.posterUrl ? `https://image.tmdb.org/t/p/w200${d.posterUrl}` : "https://via.placeholder.com/200x300?text=No+Img");
    });

    // 2. Simulation Setup
    const simulation = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(graphData.links)
            .id(d => d.id)
            .distance(120)
            .strength(d => Math.min(d.value * 0.1, 0.3))
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(45));

    simulationRef.current = simulation;

    // 3. Render Links
    const link = svg.append("g")
      .attr("stroke", "#555") // brighter connection lines
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.5);

    // 4. Render Nodes
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(graphData.nodes, d => (d as GraphNode).id)
      .join(
        enter => {
          const g = enter.append("g")
            .attr("cursor", "grab");
            
          // Node Title Tooltip
          g.append("title").text(d => d.title);

          // Circle with image fill
          g.append("circle")
            .attr("r", 30)
            .attr("fill", d => `url(#img-${d.id.replace(/[^a-zA-Z0-9-]/g, '') })`)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .transition().duration(500)
            .attr("r", 30);

          // Label
          // g.append("text")
          //    .text(d => d.title.length > 15 ? d.title.substring(0, 12) + "..." : d.title)
          //    .attr("text-anchor", "middle")
          //    .attr("y", 45)
          //    .attr("fill", "#ccc")
          //    .attr("font-size", "10px");
          
          return g;
        },
        update => update,
        exit => exit.transition().duration(300).attr("opacity", 0).remove()
      );

    // Call Drag
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(event.sourceEvent.target.parentNode).attr("cursor", "grabbing");
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        d3.select(event.sourceEvent.target.parentNode).attr("cursor", "grab");
      });

    (nodeGroup as any).call(drag);

    // Pan behavior (no zoom, only pan)
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 1]) // Disable zoom by keeping scale at 1
      .on("zoom", (event) => {
         link.attr("transform", event.transform);
         nodeGroup.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    // Double click to reset pan
    svg.on("dblclick.zoom", () => {
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });

    // 5. Ticker
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, onRemove]); 

  return (
    <div className="constellation-container" ref={wrapperRef} style={{ 
        width: '100%', 
        minHeight: '100vh',
        backgroundColor: '#050505', // very dark bg
        overflow: 'hidden',
        position: 'relative',
        margin: '-60px -20px -40px -20px', // Negative margins to break out of container padding
        padding: '60px 20px 40px 20px' // Add padding back inside
    }}>
      <div style={{ position: 'absolute', top: 20, left: 30, zIndex: 10, pointerEvents: 'none' }}>
        <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>Drag nodes • Two-finger pan to navigate</p>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};
