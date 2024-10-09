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

  let NO_OF_CHARS = 256; // Number of possible characters (ASCII)

// Helper function to find the maximum of two numbers
function max(a, b) {
  return (a > b) ? a : b;
}

// Bad character heuristic: Preprocessing to build the bad character table
function badCharHeuristic(pattern, size, badchar) {
  // Initialize all occurrences as -1
  for (let i = 0; i < NO_OF_CHARS; i++) {
    badchar[i] = -1;
  }

  // Fill the actual value of the last occurrence of a character
  for (let i = 0; i < size; i++) {
    badchar[pattern[i].charCodeAt(0)] = i;  // ASCII-based table
  }
}

// Boyer-Moore search function using bad character heuristic
export function boyerMooreSearch(text, pattern) {
  const m = pattern.length;
  const n = text.length;
  
  let badchar = new Array(NO_OF_CHARS);
  
  // Fill the bad character table for the given pattern
  badCharHeuristic(pattern, m, badchar);
  
  let s = 0;  // s is the shift of the pattern with respect to text
  const result = [];
  
  // Process the text and pattern
  while (s <= (n - m)) {
    let j = m - 1;

    // Keep reducing index j while characters of pattern and text are matching
    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
    }

    // If the pattern is found
    if (j < 0) {
      result.push(s);  // Store the index of the match
      console.log("Pattern found at index: " + s);

      // Shift pattern to align with the next character in the text
      s += (s + m < n) ? m - badchar[text[s + m].charCodeAt(0)] : 1;
    }
    else {
      // Shift the pattern so that the bad character aligns with the last occurrence in the pattern
      s += max(1, j - badchar[text[s + j].charCodeAt(0)]);
    }
  }

  return result;
}

  