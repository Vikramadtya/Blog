---
tags:
  - cc
  - backtracking
  - recursion
---

# Subset Sums

## Question

Given an array `nums` of $n$ integers, find the sum of all its $2^n$ subsets. The result can be returned in any order.

## Solution

### Pattern

**Recursive Backtracking (Include/Exclude)**
This problem utilizes the Power Set generation pattern. Each element in the array represents a binary decision point in the recursion tree.

### How to Identify

- The problem asks for "all subsets" or "all combinations."
- The input size $n$ is small (typically $n \le 20$), as $2^{20} \approx 10^6$.
- Every element has a binary choice: it either contributes to a specific subset or it does not.

### Description

Step-by-step explanation:

- **Initialize:** Create a result list. If $n$ is known, pre-allocate $2^n$ slots to optimize memory.
- **Base Case:** When the `index` reaches the length of the input array, we have made a decision for every element. Add the `currentSum` to the result list.
- **Recursive Step (Choice 1 - Include):** Call the function for the next index, adding the current element `nums[index]` to the `currentSum`.
- **Recursive Step (Choice 2 - Exclude):** Call the function for the next index without modifying the `currentSum`.
- **Flow:** This branching creates a binary tree of depth $n$, where each leaf represents one of the $2^n$ possible subset sums.

]

### The Intuition

Think of the problem as a **Decision Tree**. At every level of the tree (for every number in the array), you decide whether to "pick" that number for your current bag or "skip" it. 

- If you start with an empty bag (sum 0) and an array `[1, 2]`:
- Level 1 (Number 1): You have two bags: `{1}` and `{}`.
- Level 2 (Number 2): For each existing bag, you either add 2 or don't.
    - `{1}` becomes `{1, 2}` and `{1}`.
    - `{}` becomes `{2}` and `{}`.
The sums are the contents of these final bags at the leaf nodes.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(2^n)$       | $O(2^n)$         |
| Space Complexity | $O(n)$         | $O(n)$           |

#### Time Complexity
There are $2^n$ total subsets. The algorithm visits each subset exactly once. Total time is $O(2^n)$.

#### Space Complexity
The auxiliary space is $O(n)$ due to the maximum depth of the recursion stack. The space to store the output is $O(2^n)$, but this is usually excluded from auxiliary space complexity calculations.

### Code

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List&lt;Integer&gt; subsetSums(int[] nums) {
        int n = nums.length;
        // Optimization: Pre-allocate 2^n space for the result list
        List&lt;Integer&gt; result = new ArrayList<>(1 &lt;&lt; n);
        
        generateSums(0, 0, nums, result);
        return result;
    }

    private void generateSums(int index, int currentSum, int[] nums, List<Integer&gt; result) {
        // Base case: All elements processed
        if (index == nums.length) {
            result.add(currentSum);
            return;
        }

        // Choice 1: Include the current element
        generateSums(index + 1, currentSum + nums[index], nums, result);

        // Choice 2: Exclude the current element
        generateSums(index + 1, currentSum, nums, result);
    }
}
```

## Caveats

- **Stack Overflow:** For very large $n$ (e.g., $n &gt; 1000$), recursion will cause a stack overflow. However, since $2^n$ would be too large to compute anyway, this pattern is only intended for small $n$.
- **Duplicates:** If the input array has duplicate numbers, this algorithm will produce duplicate sums (which is correct for "Subset Sums I").
- **Order:** This specific recursion order generates sums in a specific depth-first sequence, but the problem allows any order.

## Concepts to Think About

- **Power Set:** The set of all subsets.
- **Bit Manipulation Approach:** You can also solve this iteratively using a loop from $0$ to $2^n - 1$. Each bit in the loop counter represents whether an element is included.
- **Space-Time Tradeoff:** Recursion is cleaner but has stack overhead; bitmasking is iterative and avoids the stack.
- **Tail Recursion:** Can this be optimized for languages that support tail-call optimization?

## Logical Follow-up

Question: What if the array contains **duplicates** and we only want **unique** subset sums?
Solution: You can either use a `HashSet` to store results, or better, sort the array and use a more advanced backtracking pattern (Subset Sum II) where you skip duplicate elements at the same recursion level.

Question: Can you solve this without recursion using **Bit Manipulation**?

Solution: Yes. Iterate from $i = 0$ to $(2^n - 1)$. For each $i$, the $j$-th bit tells you if `nums[j]` is in the subset. Total time $O(n \cdot 2^n)$.