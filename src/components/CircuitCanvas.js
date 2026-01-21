import React from 'react';
import { useDrop } from 'react-dnd';
import CircuitDisplay from './CircuitDisplay';

const CircuitCanvas = ({ circuit, numQubits, onDropGate }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'gate',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = document.querySelector('.circuit-canvas').getBoundingClientRect();
      const relativeY = offset.y - canvasRect.top;
      const qubitIndex = Math.floor((relativeY - 10) / 60);
      
      if (qubitIndex >= 0 && qubitIndex < numQubits) {
        onDropGate(item.gateName, qubitIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="circuit-canvas" ref={drop}>
      {circuit.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#666', textAlign: 'center', padding: '40px' }}>
          Перетащи гейты сюда ↓
        </p>
      ) : (
        <CircuitDisplay circuit={circuit} numQubits={numQubits} />
      )}
      {isOver && (
        <div className="drop-zone-highlight">
          <p>🚀 Отпусти гейт здесь!</p>
        </div>
      )}
    </div>
  );
};

export default CircuitCanvas;
