import React from 'react';
import { useDrag } from 'react-dnd';

// Отдельный компонент для одного гейта
const DraggableGate = ({ gate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'gate',
    item: { gateName: gate.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`gate-item ${isDragging ? 'dragging' : ''}`}
      style={{ backgroundColor: gate.color }}
    >
      <strong>{gate.name}</strong>
      <small>{gate.label}</small>
    </div>
  );
};

// Главный компонент панели
const GateToolbar = () => {
  const gates = [
    { name: 'H', label: 'Hadamard', color: '#f59e0b' },
    { name: 'X', label: 'NOT', color: '#10b981' },
    { name: 'Y', label: 'Y', color: '#ef4444' },
    { name: 'Z', label: 'Z', color: '#8b5cf6' },
    { name: 'CNOT', label: 'CNOT', color: '#f97316' }
  ];

  return (
    <div className="gate-toolbar">
      <h3>🛠️ Гейты (перетаскивай):</h3>
      <div className="gate-list">
        {gates.map((gate) => (
          <DraggableGate key={gate.name} gate={gate} />
        ))}
      </div>
    </div>
  );
};

export default GateToolbar;
