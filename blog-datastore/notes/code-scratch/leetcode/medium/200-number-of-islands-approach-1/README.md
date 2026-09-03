# 200. Number of Islands (Approach 1)

## Intuition

To count the number of **disconnected islands** (connected components of '1's), we treat the grid like a graph where each land cell ('1') is a node. We perform a **DFS traversal** starting from every unvisited land cell, marking all reachable land from it as visited (by flipping '1' to '0'). Every time we initiate a DFS, we count it as a **new island**.



## Complexity

| Space Complexity | Time Complexity   |
| ---------------- | ----------------- |
| $$\text{O}(N)$$  | $$\text{O}(M*N)$$ |

## Code

```java
// Direction vectors for up, left, down, right movements
int[] deltaRow = new int[]{-1, 0, 1, 0};
int[] deltaCol = new int[]{0, -1, 0, 1};

// Depth-First Search using stack to mark all connected land
void floodFillDFS(char[][] grid, int rows, int cols, int[] start) {
    Stack&lt;int[]&gt; stack = new Stack<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        int[] currentCell = stack.pop();

        for (int d = 0; d &lt; 4; ++d) {
            int newRow = currentCell[0] + deltaRow[d];
            int newCol = currentCell[1] + deltaCol[d];

            // If neighbor is within bounds and is land
            if (newRow &gt;= 0 && newRow &lt; rows && newCol &gt;= 0 && newCol < cols && grid[newRow][newCol] == '1') {
                stack.push(new int[]{newRow, newCol});
                grid[newRow][newCol] = '0'; // mark as visited
            }
        }
    }
}

public int numIslands(char[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int islandCount = 0;

    // Traverse entire grid
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            if (grid[i][j] == '1') {
                floodFillDFS(grid, rows, cols, new int[]{i, j}); // visit full island
                islandCount++; // found a new island
            }
        }
    }

    return islandCount;
}
```
