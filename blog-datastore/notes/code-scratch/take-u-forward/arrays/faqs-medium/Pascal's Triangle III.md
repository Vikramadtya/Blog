---
tags:
  - cc
  - dynamic-programming
  - array
---

# Generate Pascal's Triangle (Full)

## Question
Given an integer $n$, return the first $n$ rows of Pascal's triangle. Each value is the sum of the two elements directly above it.



## Solution

### Pattern
**Dynamic Programming (Tabulation)**

#### How to Identify
* The problem requires generating an entire structure where each level depends on the previous one.
* There is a clear recurrence relation provided: $P(r, c) = P(r-1, c-1) + P(r-1, c)$.
* You are asked for "all" elements, making a full traversal necessary.

### Description
We use an iterative approach to build the triangle row by row. We initialize the first row as `[1]`. For every subsequent row $i$, we start with a `1`, calculate the middle elements by summing the two elements from row $i-1$, and finally cap the row with another `1`.

### The Intuition
Imagine building a pyramid of bricks from the top down. Each brick is supported by two bricks directly above it. To know the weight on any specific brick, you simply look at its two "parents." By the time you reach the bottom, you've used the previous results to calculate everything without ever repeating a calculation.



### Complexity

| Label | Worst | Average |
| :--- | :--- | :--- |
| Time Complexity | $O(n^2)$ | $O(n^2)$ |
| Space Complexity | $O(n^2)$ | $O(n^2)$ |

> **Note:** The total number of elements in $n$ rows is $\frac{n(n+1)}{2}$, which is $O(n^2)$. Since we must generate each element, this is the optimal time complexity.

### Code

```java
class Solution {
    public List&lt;List&lt;Integer&gt;&gt; generate(int n) {
        List&lt;List&lt;Integer&gt;&gt; triangle = new ArrayList<>();
        
        // Edge case: Google interviewers love seeing n=0 handled
        if (n &lt;= 0) return triangle;

        // Base case: The first row is always [1]
        triangle.add(new ArrayList&lt;&gt;(List.of(1)));

        for (int i = 1; i &lt; n; i++) {
            List<Integer&gt; prevRow = triangle.get(i - 1);
            List&lt;Integer&gt; currentRow = new ArrayList<&gt;();

            // Every row starts with 1
            currentRow.add(1);

            // Fill the interior elements
            for (int j = 1; j < i; j++) {
                currentRow.add(prevRow.get(j - 1) + prevRow.get(j));
            }

            // Every row ends with 1
            currentRow.add(1);

            triangle.add(currentRow);
        }

        return triangle;
    }
}
```

### Concepts to Think About

* **Space Complexity Nuance:** In this problem, the output itself is $O(n^2)$. Usually, we distinguish between "Auxiliary Space" (extra memory used to solve the problem) and "Output Space." Here, the Auxiliary Space is actually $O(n)$ if you only consider the memory needed to store a single previous row while building the next.
* **Memory Efficiency:** If you were asked to only return the $n^{th}$ row (and not the whole triangle), you could optimize space to $O(n)$ by overwriting a single array instead of keeping all previous lists.
* **Immutable vs. Mutable Lists:** In Java, `Arrays.asList()` or `List.of()` have different properties regarding mutability. Be careful when adding elements to lists returned by these methods.
* **Combinatorial Alternative:** While we used DP here because we need *all* rows, you could theoretically use the $\binom{n}{k}$ formula to find every element. However, that would be $O(n^3)$ (calculating $n^2$ elements where each takes $O(n)$ time), which is significantly worse than this DP approach.
* **Parallelization:** Could you calculate rows in parallel? (Hint: No, because row $i$ is strictly dependent on row $i-1$. This is a "sequential" DP problem).