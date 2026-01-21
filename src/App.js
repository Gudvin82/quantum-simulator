import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import QuantumSimulator from './engine/QuantumSimulator';
import GateToolbar from './components/GateToolbar';
import CircuitCanvas from './components/CircuitCanvas';
import './App.css';

function App() {
  const [numQubits, setNumQubits] = useState(2);
  const [results, setResults] = useState(null);
  const [circuit, setCircuit] = useState([]);

  const handleDropGate = (gateName, targetQubit) => {
    const controlQubit = gateName === 'CNOT' ? Math.max(0, targetQubit - 1) : null;
    setCircuit([...circuit, { 
      gate: gateName, 
      target: targetQubit, 
      control: controlQubit 
    }]);
  };

  const handleRun = () => {
    const sim = new QuantumSimulator(numQubits);
    circuit.forEach(({ gate, target, control }) => {
      sim.applyGate(gate, target, control);
    });
    const probabilities = sim.measure();
    setResults(probabilities);
  };

  const handleClear = () => {
    setCircuit([]);
    setResults(null);
  };

  const loadBellState = () => {
    setNumQubits(2);
    setCircuit([
      { gate: 'H', target: 0, control: null },
      { gate: 'CNOT', target: 1, control: 0 }
    ]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header>
          <h1>⚛️ Quantum Simulator v0.5</h1>
          <p>Drag-and-drop квантовый редактор</p>
        </header>

        <div className="main-layout">
          <div className="sidebar">
            <div className="num-qubits">
              <label>
                Кубиты: 
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={numQubits} 
                  onChange={(e) => setNumQubits(parseInt(e.target.value))}
                />
              </label>
            </div>

            <GateToolbar />
            
            <div className="action-buttons">
              <button className="run-btn" onClick={handleRun}>▶️ Run</button>
              <button className="clear-btn" onClick={handleClear}>🗑️ Clear</button>
              <button className="example-btn" onClick={loadBellState}>📚 Bell State</button>
            </div>
          </div>

          <div className="main-area">
            <h3 style={{ color: 'white', marginBottom: '10px' }}>Квантовая цепь:</h3>
            <CircuitCanvas 
              circuit={circuit} 
              numQubits={numQubits} 
              onDropGate={handleDropGate}
            />

            {results && (
              <div className="results">
                <h3>📊 Результаты измерения:</h3>
                <ul>
                  {Object.entries(results).map(([state, prob]) => (
                    <li key={state}>
                      <strong>{state}</strong>: {prob}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
