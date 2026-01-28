"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type Constellation = {
  id: string;
  name: string;
  genreTags: string[];
  center: { x: number; y: number };
  nodes: { id: string; x: number; y: number }[];
  links: { source: string; target: string }[];
};

export type WatchItem = {
  id: number;
  title: string;
  posterPath: string | null;
  genres: string[];
  year: string;
  type: "movie" | "tv";
  constellationId: string;
  position: { x: number; y: number };
};

type Props = {
  constellations: Constellation[];
  items: WatchItem[];
  onSelect: (item: WatchItem | null) => void;
  selectedId?: number | null;
};

type PhysicsNode = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
};

type MoviePhysicsNode = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
};

const SPRING = 0.012;
const DAMPING = 0.9;

export function ConstellationScene({ constellations, items, onSelect, selectedId }: Props) {
  const [camera, setCamera] = useState({ x: -200, y: -200 });
  const [, setFrame] = useState(0);
  const animationRef = useRef<number>();
  const dragRef = useRef<{ startX: number; startY: number; camX: number; camY: number } | null>(null);

  const constellationNodesRef = useRef<Record<string, PhysicsNode>>({});
  const movieNodesRef = useRef<Record<number, MoviePhysicsNode>>({});

  const links = useMemo(() => {
    return constellations.flatMap(constellation =>
      constellation.links.map(link => ({
        ...link,
        key: `${constellation.id}-${link.source}-${link.target}`,
        constellationId: constellation.id
      }))
    );
  }, [constellations]);

  useEffect(() => {
    const nodes: Record<string, PhysicsNode> = {};
    constellations.forEach(constellation => {
      constellation.nodes.forEach(node => {
        const baseX = constellation.center.x + node.x;
        const baseY = constellation.center.y + node.y;
        nodes[`${constellation.id}-${node.id}`] = {
          id: `${constellation.id}-${node.id}`,
          x: baseX + (Math.random() - 0.5) * 4,
          y: baseY + (Math.random() - 0.5) * 4,
          vx: 0,
          vy: 0,
          baseX,
          baseY
        };
      });
    });
    constellationNodesRef.current = nodes;
  }, [constellations]);

  useEffect(() => {
    const next: Record<number, MoviePhysicsNode> = { ...movieNodesRef.current };
    items.forEach(item => {
      if (!next[item.id]) {
        next[item.id] = {
          id: item.id,
          x: item.position.x + (Math.random() - 0.5) * 6,
          y: item.position.y + (Math.random() - 0.5) * 6,
          vx: 0,
          vy: 0,
          baseX: item.position.x,
          baseY: item.position.y
        };
      } else {
        next[item.id].baseX = item.position.x;
        next[item.id].baseY = item.position.y;
      }
    });
    Object.keys(next).forEach(id => {
      if (!items.find(item => item.id === Number(id))) {
        delete next[Number(id)];
      }
    });
    movieNodesRef.current = next;
  }, [items]);

  useEffect(() => {
    const step = () => {
      const constellationNodes = constellationNodesRef.current;
      Object.values(constellationNodes).forEach(node => {
        const ax = (node.baseX - node.x) * SPRING + (Math.random() - 0.5) * 0.1;
        const ay = (node.baseY - node.y) * SPRING + (Math.random() - 0.5) * 0.1;
        node.vx = (node.vx + ax) * DAMPING;
        node.vy = (node.vy + ay) * DAMPING;
        node.x += node.vx;
        node.y += node.vy;
      });

      const movieNodes = movieNodesRef.current;
      const movieList = Object.values(movieNodes);
      movieList.forEach(node => {
        const ax = (node.baseX - node.x) * 0.02 + (Math.random() - 0.5) * 0.12;
        const ay = (node.baseY - node.y) * 0.02 + (Math.random() - 0.5) * 0.12;
        node.vx = (node.vx + ax) * 0.85;
        node.vy = (node.vy + ay) * 0.85;
        node.x += node.vx;
        node.y += node.vy;
      });

      for (let i = 0; i < movieList.length; i += 1) {
        for (let j = i + 1; j < movieList.length; j += 1) {
          const a = movieList[i];
          const b = movieList[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 50) {
            const push = (50 - dist) * 0.005;
            a.vx += (dx / dist) * push;
            a.vy += (dy / dist) * push;
            b.vx -= (dx / dist) * push;
            b.vy -= (dy / dist) * push;
          }
        }
      }

      setFrame(value => value + 1);
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      camX: camera.x,
      camY: camera.y
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return;
    }
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    setCamera({ x: dragRef.current.camX + dx, y: dragRef.current.camY + dy });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const constellationNodes = constellationNodesRef.current;
  const movieNodes = movieNodesRef.current;

  return (
    <div
      className="scene"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg className="sky" viewBox="0 0 1600 1400">
        <g transform={`translate(${camera.x} ${camera.y})`}>
          <g className="constellations">
            {links.map(link => {
              const source = constellationNodes[`${link.constellationId}-${link.source}`];
              const target = constellationNodes[`${link.constellationId}-${link.target}`];
              if (!source || !target) {
                return null;
              }
              return (
                <line
                  key={link.key}
                  className="constellation-link"
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                />
              );
            })}
            {Object.values(constellationNodes).map(node => (
              <circle
                key={node.id}
                className="constellation-node"
                cx={node.x}
                cy={node.y}
                r={2.2}
              />
            ))}
          </g>
          <g className="movie-nodes">
            {items.map(item => {
              const node = movieNodes[item.id];
              if (!node) {
                return null;
              }
              return (
                <g
                  key={item.id}
                  className={`movie-node ${selectedId === item.id ? "selected" : ""}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => onSelect(item)}
                  role="button"
                  tabIndex={0}
                >
                  <circle className="movie-glow" r={24} />
                  <circle className="movie-core" r={5} />
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
