"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type WatchNode = {
  id: string;
  type: string;
  priority: number;
  tags: string[];
};

type WatchLink = {
  source: string;
  target: string;
  strength: number;
};

declare global {
  interface Window {
    d3: typeof import("d3");
  }
}

const defaultNodes: WatchNode[] = [
  {
    id: "Arrival",
    type: "Film",
    priority: 5,
    tags: ["sci-fi", "emotive", "space"]
  },
  {
    id: "The Expanse",
    type: "Series",
    priority: 4,
    tags: ["sci-fi", "political", "space"]
  },
  {
    id: "Spirited Away",
    type: "Film",
    priority: 3,
    tags: ["fantasy", "animated"]
  },
  {
    id: "Dark",
    type: "Series",
    priority: 5,
    tags: ["mystery", "time", "dark"]
  },
  {
    id: "Severance",
    type: "Series",
    priority: 4,
    tags: ["mystery", "corporate", "dark"]
  },
  {
    id: "Soul",
    type: "Film",
    priority: 2,
    tags: ["animated", "emotive"]
  }
];

const storageKey = "watchlist-constellation";

function buildLinks(nodes: WatchNode[]): WatchLink[] {
  const links: WatchLink[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const sharedTags = nodes[i].tags.filter(tag => nodes[j].tags.includes(tag));
      const sharedType = nodes[i].type === nodes[j].type;
      if (sharedTags.length || sharedType) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          strength: sharedTags.length + (sharedType ? 1 : 0)
        });
      }
    }
  }
  return links;
}

export default function Home() {
  const [nodes, setNodes] = useState<WatchNode[]>([]);
  const [selected, setSelected] = useState<WatchNode | null>(null);
  const [d3Ready, setD3Ready] = useState(false);
  const graphRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setNodes(JSON.parse(stored) as WatchNode[]);
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(defaultNodes));
      setNodes(defaultNodes);
    }
  }, []);

  useEffect(() => {
    if (!d3Ready || nodes.length === 0 || !graphRef.current) {
      return;
    }

    const d3 = window.d3;
    const container = graphRef.current;
    const { width, height } = container.getBoundingClientRect();
    const existing = container.querySelector("svg");
    if (existing) {
      existing.remove();
    }

    const links = buildLinks(nodes);

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const defs = svg.append("defs");
    nodes.forEach(node => {
      const glow = defs
        .append("radialGradient")
        .attr("id", `glow-${node.id.replace(/\s+/g, "-")}`);

      glow.append("stop").attr("offset", "0%").attr("stop-color", "#d6f4ff").attr("stop-opacity", 0.9);
      glow.append("stop").attr("offset", "60%").attr("stop-color", "#5ac8fa").attr("stop-opacity", 0.35);
      glow.append("stop").attr("offset", "100%").attr("stop-color", "#061a2b").attr("stop-opacity", 0);
    });

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "link");

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .on("mouseenter", (_, d) => {
        link.classed("visible", l => l.source.id === d.id || l.target.id === d.id);
      })
      .on("mouseleave", () => {
        link.classed("visible", false);
      })
      .on("click", (_, d) => setSelected(d));

    node
      .append("circle")
      .attr("class", "glow")
      .attr("r", d => 28 + d.priority * 4)
      .attr("fill", d => `url(#glow-${d.id.replace(/\s+/g, "-")})`)
      .attr("opacity", d => 0.25 + d.priority * 0.12);

    node
      .append("circle")
      .attr("r", d => 4 + d.priority * 1.2)
      .attr("fill", "#f5fbff")
      .attr("opacity", d => 0.5 + d.priority * 0.1);

    node
      .append("text")
      .attr("class", "node-label")
      .attr("dy", 24)
      .text(d => d.id);

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink(links).id(d => d.id).distance(120))
      .force("collision", d3.forceCollide().radius(d => 40 + d.priority * 4));

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    const handleResize = () => {
      const bounds = container.getBoundingClientRect();
      svg.attr("viewBox", [0, 0, bounds.width, bounds.height]);
      simulation.force("center", d3.forceCenter(bounds.width / 2, bounds.height / 2));
      simulation.alpha(0.6).restart();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
    };
  }, [d3Ready, nodes]);

  return (
    <main>
      <Script src="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" />
      <Script
        src="https://cdn.jsdelivr.net/npm/d3@7"
        onLoad={() => setD3Ready(true)}
      />
      <div className="header">
        <h1>WatchList</h1>
        <p>Hover to reveal the constellation threads. Click a star to focus.</p>
      </div>
      <div className="app">
        <div id="graph" ref={graphRef} />
        <aside className={`panel ${selected ? "" : "hidden"}`}>
          <small>Selection</small>
          <h2>{selected ? selected.id : "Pick a star"}</h2>
          <div className="meta">
            <div>
              Type: <span>{selected ? selected.type : "-"}</span>
            </div>
            <div>
              Priority: <span>{selected ? `${selected.priority} / 5` : "-"}</span>
            </div>
          </div>
          <div>
            {selected?.tags.map(tag => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="actions">
            <button type="button">Add to tonight</button>
            <button type="button">Mark as watched</button>
            <button type="button">Share constellation</button>
          </div>
          <p className="hint">Data lives locally in your browser. Brightness reflects priority.</p>
        </aside>
      </div>
    </main>
  );
}
