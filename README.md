# AlgoViz – String Algorithms Visualizer

**AlgoViz** is an interactive web-based tool designed to help users visualize and understand string matching algorithms like the **Z-algorithm** and **Boyer-Moore algorithm**. It provides step-by-step demonstrations with real-time updates and dynamic visual elements, making it easier to follow along and grasp the underlying logic of these algorithms.

## Features

- **Z-algorithm visualization**: Demonstrates how the Z-algorithm computes the Z-array and uses it for pattern matching.
- **Boyer-Moore visualization** (in progress): Illustrates the Boyer-Moore algorithm's two heuristics: the bad character rule and the good suffix rule.
- **Real-time interactivity**: Users can input their own patterns and text, seeing immediate visual feedback as the algorithm processes the data.
- **Dynamic visuals**: Clean, intuitive UI that highlights key algorithm steps, making the learning experience engaging and easy to follow.
- **Step-by-step breakdown**: Detailed explanations accompany each step, giving users a deeper understanding of how the algorithm works at each stage.
- **Input customization**: Users can input custom text and patterns for the algorithms to process.

## Installation

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/algoviz.git
   ```

2. Navigate to the project directory:
   ```bash
   cd algoviz
   ```

3. Install the necessary dependencies (if any):
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npm start
   ```

## Usage

1. Open the application in your browser.
2. Choose between the **Z-algorithm** or **Boyer-Moore algorithm** from the home screen.
3. Input a **text** and a **pattern**.
4. Follow the visualization as the algorithm processes your input step-by-step.
5. Read the accompanying explanations that explain each step of the algorithm.

## Algorithms Supported

### Z-algorithm

The Z-algorithm constructs a **Z-array** for a given string. It is often used for pattern matching and can compute the longest common prefix efficiently.

- Time Complexity: O(n)
- Use cases: Pattern matching, string compression, and computational biology.

### Boyer-Moore Algorithm (in progress)

Boyer-Moore is a powerful string-searching algorithm that uses two main heuristics: the **bad character rule** and the **good suffix rule**. It is particularly efficient for long texts.

- Time Complexity: O(n/m) on average
- Use cases: Text search, document indexing, and computational linguistics.

## Future Enhancements

- **Additional Algorithms**: Plans to add support for more string matching algorithms such as Knuth-Morris-Pratt (KMP) and Rabin-Karp.
- **Performance Metrics**: Add real-time performance measurements to compare algorithm efficiency for different input sizes.
- **Mobile Compatibility**: Improve responsiveness for mobile and tablet users.
