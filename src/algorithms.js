// Z-Algorithm step-by-step generator
export function* zAlgorithmSteps(S) {
    const Z = Array(S.length).fill(0);  // Initialize Z-array with zeros
    let L = 0, R = 0;  // Initialize [L, R] window
  
    for (let i = 1; i < S.length; i++) {
      if (i > R) {
        L = R = i;
        while (R < S.length && S[R - L] === S[R]) {
          R++;
          yield { Z, i, L, R };  // Yield the current state
        }
        Z[i] = R - L;
        R--;
        yield { Z, i, L, R };  // Yield the state after updating Z[i]
      } else {
        let k = i - L;
        if (Z[k] < R - i + 1) {
          Z[i] = Z[k];
          yield { Z, i, L, R };  // Yield the state after copying Z[k]
        } else {
          L = i;
          while (R < S.length && S[R - L] === S[R]) {
            R++;
            yield { Z, i, L, R };  // Yield while extending the window
          }
          Z[i] = R - L;
          R--;
          yield { Z, i, L, R };  // Yield the state after updating Z[i]
        }
      }
    }
  }

// Z-Algorithm to compute the final Z-array for a given string
export function zAlgorithm(S) {
    const Z = Array(S.length).fill(0);  // Initialize Z-array with zeros
    let L = 0, R = 0;  // Initialize [L, R] window
  
    for (let i = 1; i < S.length; i++) {
      if (i > R) {
        L = R = i;
        while (R < S.length && S[R - L] === S[R]) R++;
        Z[i] = R - L;
        R--;
      } else {
        let k = i - L;
        if (Z[k] < R - i + 1) {
          Z[i] = Z[k];
        } else {
          L = i;
          while (R < S.length && S[R - L] === S[R]) R++;
          Z[i] = R - L;
          R--;
        }
      }
    }
    return Z;
  }
  
  