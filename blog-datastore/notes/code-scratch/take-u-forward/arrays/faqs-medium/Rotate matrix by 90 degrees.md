---
tags:
  - math
  - arrays
  - matrix
---

# Rotate Image

## Question

Given an $n \times n$ 2D matrix representing an image, rotate the image by $90^\circ$ (clockwise) strictly in-place. Do not allocate a new 2D matrix.

## Solution

### Pattern

**Matrix Transformation (Linear Algebra Composition)**
A $90^\circ$ clockwise rotation can be achieved by combining two simple matrix operations: a Main Diagonal Transpose followed by a Left-Right Reflection (Row Reversal).

### How to Identify

- The problem asks to rotate, flip, or mirror a grid.
- There is an explicit constraint for $O(1)$ space (in-place modification).
- A direct 4-way cell swap is possible but often prone to off-by-one errors; compositional math operations are cleaner.

### Description

Step-by-step explanation:

1. **Transpose the Matrix:** Convert all rows into columns. This is done by iterating through the upper triangle of the matrix (where `j > i`) and swapping `matrix[i][j]` with `matrix[j][i]`. 
2. **Reverse the Rows:** At this point, the matrix is rotated but mirrored horizontally. We iterate through each row independently. For each row, we use a standard two-pointer approach to reverse the elements left-to-right.
3. The combination of these two transformations mathematically guarantees a perfect $90^\circ$ clockwise rotation.

### The Intuition

If you imagine a square piece of paper with an upward arrow drawn on it:
1. Flipping the paper diagonally (transposing) makes the arrow point to the right, but the image is now mirrored (text would be backward).
2. Flipping the paper horizontally (reversing the rows) fixes the mirror effect. The arrow still points to the right. 
This is much easier to code than trying to simultaneously move 4 corners of the paper in a circular motion (the "4-way swap" method) because each sub-step involves simple, standard array operations.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N^2)$       | $O(N^2)$         |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Transposing the matrix touches roughly $\frac{N^2}{2}$ elements. Reversing the rows touches roughly $\frac{N^2}{2}$ elements. Total operations scale strictly with the total number of cells in the matrix, yielding $O(N^2)$.

#### Space Complexity

All swaps are performed in-place using a single primitive integer `temp`. No auxiliary scaling structures are allocated, resulting in strictly $O(1)$ space.

### Code

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        
        // 1. Transpose: Swap matrix[i][j] with matrix[j][i]
        for (int i = 0; i &lt; n; i++) {
            for (int j = i + 1; j &lt; n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        
        // 2. Reverse: Swap elements within each row left-to-right
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}
```

### Caveats

- **Non-Square Matrices:** This in-place $O(1)$ algorithm only works for strictly square $n \times n$ matrices. Transposing an $M \times N$ matrix in-place requires complex cycle-leader algorithms or $O(M \times N)$ auxiliary space.
- **Alternative 4-Way Swap:** You can rotate by picking a cell, and swapping it in a 4-step circle `(top-left -&gt; top-right -&gt; bottom-right -> bottom-left)`. This only requires one pass, but the loop boundaries are notoriously difficult to write bug-free under interview pressure. The Transpose + Reverse method is much safer.

### Concepts to Think About

- **Cache Locality:** Memory in Java 2D arrays is stored row-by-row. Transposing + Row Reversal is generally more cache-friendly than Up-Down Flip + Transpose because Row Reversal iterates through contiguous blocks of memory, minimizing L1/L2 cache misses. When transposing, you are jumping between rows and columns. How does this affect the CPU Cache? (Hint: Accessing matrix[j][i] when the outer loop is i causes cache misses because 2D arrays are stored row-major in Java).
- **Composability:** Complex grid transformations can almost always be broken down into sequences of transposes, horizontal reflections, and vertical reflections.
- **One-Pass (4-Way Swap):** You can rotate the matrix in a single pass by moving elements in "four-way cycles." An element at (i,j) moves to (j,n−1−i), which moves to (n−1−i,n−1−j), and so on. This is more efficient but much harder to code without bugs.
- **Other Rotations**: * 90° Counter-Clockwise: Transpose + Vertical Reflection (Reverse each column).
- **180° Rotation**: Horizontal Reflection + Vertical Reflection (or just reverse the whole matrix as a flat 1D array).
- **Non-Square Matrices**: Why is an in-place rotation impossible for an M×N matrix where $M!=N$ ? (Hint: The memory layout/dimensions of the array itself would need to change).
- **Linear Algebra**: In mathematical terms, a rotation is a linear transformation. A 90° clockwise rotation is equivalent to a transpose followed by a reflection across the y-axis.

### Logical Follow-up

Question: How would you rotate the image $90^\circ$ **anti-clockwise**?
Solution: You apply the exact same mathematical composability, just in a different sequence. To rotate anti-clockwise, you first **Transpose** the matrix, and then **Reverse the Columns** (flip up-down) instead of the rows. Alternatively, you can Reverse the Rows first, and *then* Transpose.

Question: What if the matrix is too large to fit in memory (e.g., a 100GB image file), and is stored on disk?
Solution: This becomes a systems problem. You cannot load it into RAM. You would read the image from disk in chunks (sub-grids) that fit into memory, transpose and rotate those small blocks individually in RAM, and write them to their newly calculated offset positions in a new file on disk. This requires careful disk I/O management.
