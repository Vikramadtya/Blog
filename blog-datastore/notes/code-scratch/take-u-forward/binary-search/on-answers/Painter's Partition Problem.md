---
tags:
  - binary-search
  - greedy
  - arrays
---

# Painter's Partition Problem

## Question

Given $A$ painters and an array $C$ representing the lengths of $N$ contiguous boards. Each painter takes $B$ units of time to paint 1 unit of board. Assign contiguous segments of boards to painters such that no board is split. 
Minimize the total time required to paint all boards and return the result modulo $10000003$.

## Solution

### Pattern

**Binary Search on Answer (Min-Max Pattern)**
We cannot easily compute the exact contiguous partitions. However, the optimal "maximum length" any single painter must paint exists within a strict mathematical range. We binary search this range. For a guessed length, we use a greedy algorithm to simulate the assignment. If the assignment uses $\le A$ painters, the guess is valid, and we try to find a smaller valid guess.

### How to Identify

- The problem explicitly asks to **minimize a maximum** (minimize the maximum time taken by any single painter).
- The items must remain **contiguous** (subarrays).
- Simulating the process for a fixed "guessed" limit takes $O(N)$ linear time.

### Description

Step-by-step explanation:

1. **Decouple Length from Time:** Ignore the time multiplier $B$ and the modulo constraint entirely. Solve the core problem first: *What is the minimum maximum contiguous length of boards we can assign to any single painter?*
2. **Establish Bounds (using `long`):** - **Lower Bound (`low`):** The absolute smallest max length any painter must handle is the maximum single board in $C$. (Even with 100 painters, one is stuck painting the longest board).
   - **Upper Bound (`high`):** The absolute largest max length is the sum of all boards in $C$. (If there is only 1 painter, they paint everything).
3. **Binary Search:** Loop while `low &lt;= high`. Calculate `mid` as the guessed maximum allowed length.
4. **Greedy Simulation:** Pass `mid` to a helper function. 
   - Iterate through $C$. Assign boards to a painter until adding the next board exceeds `mid`. 
   - If it exceeds, allocate a new painter.
   - If total painters allocated $&gt; A$, the guess `mid` was too strict (too small). Return false.
5. **Adjust Bounds:**
   - If valid: `mid` works. Record it implicitly by throwing away the upper half `high = mid - 1` to search for a more optimal (smaller) limit.
   - If invalid: `mid` is too small. Throw away the lower half `low = mid + 1`.
6. **Final Computation:** When the loop breaks, `low` holds the optimal minimum max-length. Multiply by the time factor $B$, apply `% 10000003`, and cast to `int`.

### The Intuition

Imagine you have 3 painters and a fence of varying panel widths. The job finishes only when the *slowest* painter finishes. You want to divide the work as equally as possible, avoiding giving anyone a massive contiguous section.
You guess a quota: "No painter can paint more than 50 total units of width." You walk along the fence, assigning panels to Painter 1 until they hit 50. Then you assign to Painter 2. 
If you run out of painters before you run out of fence, your quota of 50 was too small. You binary search this quota until you find the exact lowest number that perfectly utilizes your painters.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log S)$  | $O(N \log S)$    |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Let $S$ be the sum of all elements in array $C$. The size of the search space is $S - \max(C)$. We halve this space logarithmically, taking $\approx \log_2(S)$ steps. During each step, the helper function iterates the array of size $N$. Total time is $O(N \log S)$.

#### Space Complexity

Only primitive pointers (`low`, `high`, `mid`) are allocated. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int paint(int paintersCount, int timePerUnit, int[] boards) {
        if (boards == null || boards.length == 0 || paintersCount == 0) return -1;
        
        long low = 0;
        long high = 0;
        
        // Bounds must be long to prevent integer overflow on summation
        for (int b : boards) {
            low = Math.max(low, b);
            high += b;
        }
        
        while (low &lt;= high) {
            long mid = low + (high - low) / 2;
            
            if (canPartition(boards, paintersCount, mid)) {
                high = mid - 1; // Valid, but try to find a tighter fit
            } else {
                low = mid + 1;  // Too small, requires too many painters
            }
        }
        
        // Calculate total time and apply modulo at the very end
        return (int) ((low * timePerUnit) % 10000003);
    }
    
    private boolean canPartition(int[] boards, int maxPainters, long maxLengthAllowed) {
        long currentLength = 0;
        int paintersUsed = 1;
        
        for (int b : boards) {
            if (currentLength + b &gt; maxLengthAllowed) {
                paintersUsed++;
                currentLength = b;
                
                // Fast-fail to save iterations
                if (paintersUsed > maxPainters) {
                    return false;
                }
            } else {
                currentLength += b;
            }
        }
        return true;
    }
}
```

## Caveats

- **Integer Overflow:** The sum of all boards can easily exceed $2^{31}-1$. If `high` is an `int`, it will overflow into negative numbers, breaking the binary search instantly. Always use `long` when summing arrays for binary search bounds.
- **Modulo Placement:** Do *not* apply the modulo during the binary search or during the greedy validation. Modulo arithmetic creates "wrap-arounds" which destroy the strict monotonicity required for Binary Search. Only apply modulo to the final mathematical result.

## Concepts to Think About

- **The Master Template:** This problem is identical to LeetCode 410 (*Split Array Largest Sum*) and LeetCode 1011 (*Capacity To Ship Packages Within D Days*). Recognizing the "Minimize Maximum of Contiguous Subarrays" phrasing allows you to deploy this template universally.
- **Lower Bound Logic:** If you set `low = 0`, the greedy function fails immediately when encountering a board larger than `mid`, because a single board cannot be split. The minimum possible answer is always the largest single element.

## Logical Follow-up

Question: If painters were allowed to paint *non-contiguous* boards (e.g., Painter 1 paints board 0 and board 5), how would the optimal solution change?
Solution: This transforms the problem into the **Multiprocessor Scheduling Problem** (a variation of the Partition Problem), which is NP-Hard. A greedy binary search no longer works because you must evaluate combinations. You would sort the array descending and use Backtracking/DFS with Branch and Bound to find the optimal assignment, degrading time complexity to $O(K^N)$ bounds, or use DP with bitmasking if $N \le 20$.