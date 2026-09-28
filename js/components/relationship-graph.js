/**
 * RelationshipGraph Component
 * Interactive SVG network visualizer displaying semantic connections
 * between mythical beings (parents, siblings, allies, adversaries).
 */

import { api } from '../api-client.js';
import { resolveLocalized } from '../i18n.js';

export async function renderRelationshipGraph(container, slug) {
  container.innerHTML = `
    <div style="padding: 1.5rem; text-align: center; color: var(--gold-500); font-family: var(--font-display);">
      ✦ MEMBUKA GRAF JEJARING RELASI MITOLOGI... ✦
    </div>
  `;

  try {
    const graphData = await api.getRelationshipGraph(slug);
    if (!graphData || !graphData.nodes || graphData.nodes.length <= 1) {
      container.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          Belum ada jejaring relasi silang yang terdokumentasi untuk entitas ini.
        </div>
      `;
      return;
    }

    const width = 760;
    const height = 360;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 130;

    const primaryNode = graphData.nodes[0];
    const relatedNodes = graphData.nodes.slice(1);
    const count = relatedNodes.length;

    // Calculate node coordinates in a circular radial layout
    const positionedNodes = [
      { ...primaryNode, x: centerX, y: centerY, r: 38 }
    ];

    relatedNodes.forEach((node, i) => {
      const angle = (2 * Math.PI / count) * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positionedNodes.push({ ...node, x, y, r: 28 });
    });

    // Color by relation type
    function getRelationColor(type) {
      switch (type) {
        case 'enemy': return '#f43f5e';
        case 'ally': return '#10b981';
        case 'sibling':
        case 'parent':
        case 'child': return '#38bdf8';
        case 'counterpart': return '#a855f7';
        default: return '#d4af37';
      }
    }

    let edgesSvg = '';
    graphData.edges.forEach(edge => {
      const source = positionedNodes.find(n => n.id === edge.source);
      const target = positionedNodes.find(n => n.id === edge.target);
      if (source && target) {
        const strokeColor = getRelationColor(edge.relation_type);
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const label = edge.relation_type?.toUpperCase() || 'RELASI';

        edgesSvg += `
          <g class="graph-edge">
            <line 
              x1="${source.x}" y1="${source.y}" 
              x2="${target.x}" y2="${target.y}" 
              stroke="${strokeColor}" 
              stroke-width="2" 
              stroke-dasharray="4,4"
              opacity="0.75"
            />
            <rect x="${midX - 35}" y="${midY - 9}" width="70" height="18" rx="4" fill="var(--bg-card)" stroke="${strokeColor}" stroke-width="0.8"/>
            <text x="${midX}" y="${midY + 4}" text-anchor="middle" font-size="9" font-family="var(--font-mono)" font-weight="600" fill="${strokeColor}">
              ${label}
            </text>
          </g>
        `;
      }
    });

    let nodesSvg = '';
    positionedNodes.forEach(node => {
      const isPrimary = node.type === 'primary';
      const fill = isPrimary ? 'var(--gold-500)' : 'var(--bg-card)';
      const stroke = isPrimary ? '#fef08a' : '#d4af37';
      const textColor = isPrimary ? '#0a0b0e' : 'var(--text-primary)';
      const cursor = isPrimary ? 'default' : 'pointer';

      nodesSvg += `
        <g class="graph-node" data-slug="${node.id}" style="cursor: ${cursor};">
          <circle 
            cx="${node.x}" cy="${node.y}" r="${node.r}" 
            fill="${fill}" 
            stroke="${stroke}" 
            stroke-width="${isPrimary ? 3 : 1.5}"
            filter="${isPrimary ? 'drop-shadow(0 0 10px rgba(212,175,55,0.4))' : 'none'}"
          />
          <text 
            x="${node.x}" y="${node.y + 4}" 
            text-anchor="middle" 
            font-size="${isPrimary ? 12 : 10}" 
            font-weight="700" 
            font-family="var(--font-display)" 
            fill="${textColor}"
          >
            ${node.label.slice(0, 12)}
          </text>
        </g>
      `;
    });

    container.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; overflow-x: auto;">
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px; height: auto; display: block; margin: 0 auto;">
          <defs>
            <radialGradient id="graphGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="var(--gold-glow)" stop-opacity="1"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="${centerX}" cy="${centerY}" r="160" fill="url(#graphGlow)"/>
          ${edgesSvg}
          ${nodesSvg}
        </svg>

        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; font-size: 0.78rem;">
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: #f43f5e;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #f43f5e;"></span> Lawan / Antagonis
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: #10b981;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span> Sekutu / Pasangan
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: #38bdf8;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #38bdf8;"></span> Saudara / Garis Keturunan
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: var(--gold-500);">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--gold-500);"></span> Terkait Tradisi
          </span>
        </div>
      </div>
    `;

    // Attach click listeners on non-primary nodes
    container.querySelectorAll('.graph-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const targetSlug = nodeEl.getAttribute('data-slug');
        if (targetSlug && targetSlug !== slug) {
          window.location.hash = `#/creature/${targetSlug}`;
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div style="color: var(--accent-crimson); font-size: 0.85rem;">Gagal merender graf: ${err.message}</div>`;
  }
}
