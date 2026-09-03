---
tags:
  - cc
  - matrix
  - simulation
---

# Spiral Matrix Traversal

## Question
Given an $M \times N$ matrix, return all elements of the matrix in a clockwise spiral manner in a single-dimensional array.

## Solution

### Pattern
**Boundary Simulation (Shrinking Rectangle)**

#### How to Identify
* The problem involves a 2D grid/matrix.
* The traversal is non-linear (spiral, zigzag, diagonal).
* The path has specific "turning points" at the edges of the unvisited area.

### Description
The algorithm uses four pointers: `top`, `bottom`, `left`, and `right`. These represent the current boundaries of the "unvisited" matrix. We perform four distinct linear traversals (Right, Down, Left, Up). After each side is completed, we "shrink" that boundary (e.g., `top++` after moving right) until the boundaries cross.



### The Intuition
Imagine a rectangular field of grass. You want to mow it in a spiral. You mow the top edge, then you can't mow that row again, so you move your "fence" down. Then you mow the right edge and move your "fence" left. You keep doing this until the fences meet in the middle and there is no grass left to mow.

### Complexity

| Label | Worst | Average |
| :--- | :--- | :--- |
| Time Complexity | $O(M \times N)$ | $O(M \times N)$ |
| Space Complexity (Aux) | $O(1)$ | $O(1)$ |

> Note: $M$ = rows, $N$ = columns. We visit each element exactly once.

### Code

```java
class Solution {
    public List&lt;Integer&gt; spiralOrder(int[][] matrix) {
        List&lt;Integer&gt; res = new ArrayList<>();
        // Guardrail: Always check for null or empty at Google
        if (matrix == null || matrix.length == 0) return res;

        int left = 0, right = matrix[0].length - 1;
        int top = 0, bottom = matrix.length - 1; 

        while (top &lt;= bottom && left &lt;= right) {
            
            // 1. Move Right: Constant 'top', varying column 'i'
            for (int i = left; i <= right; ++i) {
                res.add(matrix[top][i]);
            }
            top++;

            // 2. Move Down: Constant 'right', varying row 'j'
            for (int j = top; j <= bottom; ++j) {
                res.add(matrix[j][right]);
            }
            right--;

            // 3. Move Left: Check needed to ensure row hasn't been finished
            if (top <= bottom) {
                for (int i = right; i &gt;= left; --i) {
                    res.add(matrix[bottom][i]);
                }
                bottom--;
            }

            // 4. Move Up: Check needed to ensure column hasn't been finished
            if (left &lt;= right) {
                for (int j = bottom; j &gt;= top; --j) {
                    res.add(matrix[j][left]);
                }
                left++;
            }
        }

        return res;
    }
}
```

## Concepts to Think About

- Direction Arrays: Another way to solve this is using a direction array dr = &#123;0, 1, 0, -1&#125; and dc = &#123;1, 0, -1, 0&#125; to cycle through Right, Down, Left, and Up. When would this be better than the boundary approach? (Hint: Useful for complex paths like "Spiral II" or "Spira III").
- The Non-Square Case: Why do we need the if (top &lt;= bottom) check inside the loop? (Hint: For a 3×1 or 1×3 matrix, the boundaries might cross mid-cycle, causing the code to process the same elements in reverse).
- Recursive vs Iterative: Could you solve this recursively? What would be the impact on the Stack Space? (Hint: O(min(M,N)) recursion depth).
- In-Place Modification: If the problem asked you to generate a spiral matrix from 1 to n$^2$ in O(1) auxiliary space, how would the logic change?
- Matrix Transpose: Is there a way to solve this by repeatedly "rotating" the matrix? (Look up the Pythonic one-liner: matrix.pop(0) + spiralOrder(zip(*matrix)[::-1])). While cool, why is this inefficient in Java?
- The Single-Row/Column Case: How does your code handle a 1×5 matrix? (The if(top <= bottom) check prevents the "Move Left" loop from re-processing the only row already processed by "Move Right").
- Spiral Matrix II: A common follow-up is being given an integer n and having to generate an n×n matrix filled with elements from 1 to $n^2$ in spiral order. Could you adapt this logic to write instead of read?
- Directional Vectors: In more complex simulations (like a 3D spiral), we use a directions array: `int[][] dirs = {% raw %}{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}{% endraw %}`. This allows you to handle the "turn" with a simple (dirIndex + 1) % 4.
- Layer-by-layer Recursion: Could this be solved recursively? What would the base case be? (Usually when left &gt; right or top &gt; bottom).
