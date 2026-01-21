import { complex, multiply, matrix } from 'mathjs';

class QuantumSimulator {
  constructor(numQubits) {
    this.numQubits = numQubits;
    this.stateVector = this.initializeState();
  }

  initializeState() {
    const size = Math.pow(2, this.numQubits);
    const state = new Array(size).fill(complex(0, 0));
    state[0] = complex(1, 0);
    return matrix(state);
  }

  applyGate(gateName, targetQubit, controlQubit = null) {
    const gateMatrix = this.getGateMatrix(gateName, targetQubit, controlQubit);
    this.stateVector = multiply(gateMatrix, this.stateVector);
  }

  getGateMatrix(gateName, target, control = null) {
    const gates = {
      'H': this.hadamardGate(),
      'X': this.pauliXGate(),
      'Y': this.pauliYGate(),
      'Z': this.pauliZGate()
    };

    if (control !== null && gateName === 'CNOT') {
      return this.cnotGate(control, target);
    }

    return this.expandGate(gates[gateName], target);
  }

  hadamardGate() {
    const sqrt2 = Math.sqrt(2);
    return matrix([
      [complex(1/sqrt2, 0), complex(1/sqrt2, 0)],
      [complex(1/sqrt2, 0), complex(-1/sqrt2, 0)]
    ]);
  }

  pauliXGate() {
    return matrix([
      [complex(0, 0), complex(1, 0)],
      [complex(1, 0), complex(0, 0)]
    ]);
  }

  pauliYGate() {
    return matrix([
      [complex(0, 0), complex(0, -1)],
      [complex(0, 1), complex(0, 0)]
    ]);
  }

  pauliZGate() {
    return matrix([
      [complex(1, 0), complex(0, 0)],
      [complex(0, 0), complex(-1, 0)]
    ]);
  }

  expandGate(gate2x2, targetQubit) {
    let fullGate = this.identityMatrix(1);
    for (let i = 0; i < this.numQubits; i++) {
      if (i === targetQubit) {
        fullGate = this.kroneckerProduct(fullGate, gate2x2);
      } else {
        fullGate = this.kroneckerProduct(fullGate, this.identityMatrix(2));
      }
    }
    return fullGate;
  }

  cnotGate(control, target) {
    const size = Math.pow(2, this.numQubits);
    let gate = [];
    
    for (let i = 0; i < size; i++) {
      gate[i] = [];
      for (let j = 0; j < size; j++) {
        const controlBit = (i >> (this.numQubits - 1 - control)) & 1;
        if (controlBit === 1) {
          const flipped = i ^ (1 << (this.numQubits - 1 - target));
          gate[i][j] = (flipped === j) ? complex(1, 0) : complex(0, 0);
        } else {
          gate[i][j] = (i === j) ? complex(1, 0) : complex(0, 0);
        }
      }
    }
    return matrix(gate);
  }

  identityMatrix(size) {
    const id = [];
    for (let i = 0; i < size; i++) {
      id[i] = [];
      for (let j = 0; j < size; j++) {
        id[i][j] = (i === j) ? complex(1, 0) : complex(0, 0);
      }
    }
    return matrix(id);
  }

  kroneckerProduct(A, B) {
    const aData = A.toArray();
    const bData = B.toArray();
    const aRows = aData.length;
    const aCols = aData[0].length;
    const bRows = bData.length;
    const bCols = bData[0].length;

    const result = [];
    for (let i = 0; i < aRows * bRows; i++) {
      result[i] = [];
      for (let j = 0; j < aCols * bCols; j++) {
        const aRow = Math.floor(i / bRows);
        const aCol = Math.floor(j / bCols);
        const bRow = i % bRows;
        const bCol = j % bCols;
        result[i][j] = multiply(aData[aRow][aCol], bData[bRow][bCol]);
      }
    }
    return matrix(result);
  }

  measure() {
    const state = this.stateVector.toArray();
    const probabilities = {};

    for (let i = 0; i < state.length; i++) {
      const amplitude = state[i];
      const probability = Math.pow(amplitude.re, 2) + Math.pow(amplitude.im, 2);
      
      if (probability > 1e-10) {
        const binaryState = i.toString(2).padStart(this.numQubits, '0');
        const littleEndian = binaryState.split('').reverse().join('');
        probabilities[`|${littleEndian}⟩`] = (probability * 100).toFixed(2) + '%';
      }
    }
    return probabilities;
  }
}

export default QuantumSimulator;
