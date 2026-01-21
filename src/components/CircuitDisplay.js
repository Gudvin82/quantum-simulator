import React from 'react';

const GATE_SIZE = 40;
const WIRE_HEIGHT = 60;
const START_X = 60;

const CircuitDisplay = ({ circuit, numQubits }) => {
  const svgWidth = Math.max(800, START_X + circuit.length * 60 + 50);
  const svgHeight = numQubits * WIRE_HEIGHT + 40;

  return (
    <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', padding: '20px' }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* Линии кубитов */}
        {Array.from({ length: numQubits }).map((_, i) => (
          <g key={`wire-${i}`}>
            <text x="10" y={i * WIRE_HEIGHT + 30 + 5} style={{ font: '14px monospace', fill: '#666' }}>
              Q{i}
            </text>
            <line
              x1={START_X}
              y1={i * WIRE_HEIGHT + 30}
              x2={svgWidth}
              y2={i * WIRE_HEIGHT + 30}
              stroke="#ccc"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Гейты */}
        {circuit.map((step, idx) => {
          const x = START_X + idx * 60;
          const y = step.target * WIRE_HEIGHT + 30;

          // CNOT (особый случай)
          if (step.gate === 'CNOT') {
            const yControl = step.control * WIRE_HEIGHT + 30;
            return (
              <g key={idx}>
                <line x1={x + GATE_SIZE/2} y1={y} x2={x + GATE_SIZE/2} y2={yControl} stroke="#333" strokeWidth="2" />
                <circle cx={x + GATE_SIZE/2} cy={yControl} r="5" fill="#333" />
                <circle cx={x + GATE_SIZE/2} cy={y} r="15" fill="none" stroke="#333" strokeWidth="2" />
                <line x1={x + GATE_SIZE/2} y1={y - 15} x2={x + GATE_SIZE/2} y2={y + 15} stroke="#333" strokeWidth="2" />
              </g>
            );
          }

          // Обычные гейты
          return (
            <g key={idx}>
              <rect
                x={x}
                y={y - GATE_SIZE / 2}
                width={GATE_SIZE}
                height={GATE_SIZE}
                fill={getGateColor(step.gate)}
                rx="4"
                stroke="#333"
                strokeWidth="1"
              />
              <text
                x={x + GATE_SIZE / 2}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                style={{ fontSize: '16px', fontWeight: 'bold', pointerEvents: 'none' }}
              >
                {step.gate}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const getGateColor = (gate) => {
  switch (gate) {
    case 'H': return '#f59e0b'; // Orange
    case 'X': return '#10b981'; // Green
    case 'Y': return '#ef4444'; // Red
    case 'Z': return '#8b5cf6'; // Purple
    default: return '#3b82f6';  // Blue
  }
};

export default CircuitDisplay;
