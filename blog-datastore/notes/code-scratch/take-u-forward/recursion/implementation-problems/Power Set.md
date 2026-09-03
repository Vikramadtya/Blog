---
tags:
  - cc
  - backtracking
  - recursion
  - bit-manipulation
---

# Subsets (The Power Set)

## Question

Given an integer array $nums$ of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.

## Solution

### Pattern

**Backtracking (Decision Tree)**
The problem follows the "Pick or Don't Pick" pattern. For every element in the array, we have a binary choice: either include it in the current subset or exclude it.

### How to Identify

- The problem asks for "All Possible" configurations (subsets, permutations, combinations).
- The input size $n$ is small (typically $n &lt; 20$), as the result grows exponentially.
- The problem involves building a result incrementally by making a series of choices.

### Description

We use a recursive helper function to explore a decision tree.

1. **The Choice:** At each index $i$ in the array, we decide:
   - **Path A:** Include $nums[i]$ in the current subset and move to $i+1$.
   - **Path B:** Do not include $nums[i]$ and move to $i+1$.
2. **Base Case:** When our current index reaches $nums.length$, it means we have made a choice for every element. We take a "snapshot" of our current subset and add it to our global result list.
3. **Backtracking:** To ensure Path B doesn't contain elements from Path A, we must remove the element we just added before returning from the recursive call. This "cleans up" the state.

### The Intuition

Think of the Power Set as a **Binary String** of length $n$.

- Each bit represents an element in the array.
- A `1` means "Included," and a `0` means "Excluded."
- Since there are $2^n$ possible binary strings of length $n$, there are $2^n$ subsets.

This mental model helps you realize that the subsets problem is actually a search through the space of all possible $n$-bit combinations.

### Complexity

| Label            | Worst            | Average          |
| :--------------- | :--------------- | :--------------- |
| Time Complexity  | $O(n \cdot 2^n)$ | $O(n \cdot 2^n)$ |
| Space Complexity | $O(n \cdot 2^n)$ | $O(n \cdot 2^n)$ |

#### Time Complexity

There are $2^n$ subsets. For each subset, we spend $O(n)$ time to create a copy of the current list and add it to the result.

#### Space Complexity

The output requires $O(n \cdot 2^n)$ space. The recursion stack depth is $O(n)$, and the temporary list used for backtracking also takes $O(n)$.

### Code

```java
class Solution {
    public List&lt;List<Integer&gt;&gt; subsets(int[] nums) {
        List&lt;List&lt;Integer&gt;&gt; result = new ArrayList<>();
        // Start backtracking from index 0
        backtrack(result, new ArrayList<>(), nums, 0);
        return result;
    }

    private void backtrack(List&lt;List&lt;Integer&gt;&gt; result, List&lt;Integer&gt; current, int[] nums, int index) {
        // Base Case: We've considered all elements
        if (index == nums.length) {
            // Must create a new copy because current is modified in place
            result.add(new ArrayList<>(current));
            return;
        }

        // Decision 1: Include the current element
        current.add(nums[index]);
        backtrack(result, current, nums, index + 1);

        // Decision 2: Exclude the current element (Backtrack)
        current.remove(current.size() - 1);
        backtrack(result, current, nums, index + 1);
    }
}
```

### Concepts to Think About

- **Bitmasking**: You can generate subsets by iterating from $0$ to $2^n - 1$ and using the bit representation of the counter to pick elements.
- **Lexicographical Order**: The recursive approach naturally generates subsets in a specific order (DFS order).
- **Copying Overhead**: $O(n)$ copying at the base case is unavoidable if you want to return a list of lists.
- **Space Optimization**: If you only need to _process_ subsets rather than return them, space drops to $O(n)$.
- **Gray Code**: A specialized sequence of $2^n$ bitstrings where each adjacent string differs by only one bit. This can be used to generate subsets by adding/removing exactly one element at a time.

### Logical Follow-up

**Question: Subsets II: What if the input array `nums` contains duplicates? How do you ensure the power set contains no duplicate subsets?**

**Solution:**

1.  **Sort the array**: This brings duplicates together.
2.  **Handle Duplicates in Backtracking**: When choosing _not_ to include an element, you must skip all subsequent occurrences of that same element.
    - **Logic**: `while (index + 1 &lt; nums.length && nums[index] == nums[index + 1]) index++;`
    - This ensures you don't start a new decision branch with a value you've already rejected for that specific position.

**Question: Memory Constraints: If $n = 30$, $2^{30}$ is over a billion. You cannot return this in a `List`. How would you handle this in a real system?**

**Solution**: At a Google scale, we would use an **Iterator pattern** or a **Generator**. Instead of storing all subsets, we provide a `next()` method that calculates the next subset on the fly (perhaps using the bitmasking approach). This keeps space at $O(n)$.

## Solution (Bit Masking Approach)

### Pattern

**Bit Manipulation (Binary Mapping)** Treat each subset as a binary number of length $n$, where the $j^{th}$ bit represents whether $nums[j]$ is included in the subset.

### How to Identify

- You need to generate all combinations of a set.
- The total number of results is exactly $2^n$.
- Each element has a simple binary state: Included ($1$) or Excluded ($0$).
- You want to avoid the overhead of a recursive call stack.

### Description

We iterate through every possible integer from $0$ up to $2^n - 1$.

1. **The Loop:** For an array of size $n$, there are $2^n$ total subsets. We run a loop from $i = 0$ to $2^n - 1$.
2. **The Mask:** Each value of $i$ is a "mask." For example, if $n=3$, the mask $5$ is `101` in binary.
3. **Bit Checking:** For each mask, we check every bit position $j$ (from $0$ to $n-1$):
   - If the $j^{th}$ bit is set ($1$), we include $nums[j]$ in the current subset.
   - If the $j^{th}$ bit is not set ($0$), we skip it.
4. **Efficiency:** We use bitwise shifts `1 &lt;< n` to calculate $2^n$ and `(i &gt;&gt; j) & 1` to check bits.

### The Intuition

Imagine $n$ light switches. Each configuration of switches (on/off) represents a unique subset. Since each switch has $2$ states, $n$ switches have $2^n$ configurations.
If we count from $0$ to $2^n - 1$ in binary, we are essentially cycling through every possible configuration of those light switches. We are simply "reading" the binary state of the counter to decide what goes into our "suitcase."

### Complexity

| Label            | Worst            | Average          |
| :--------------- | :--------------- | :--------------- |
| Time Complexity  | $O(n \cdot 2^n)$ | $O(n \cdot 2^n)$ |
| Space Complexity | $O(1)$           | $O(1)$           |

#### Time Complexity

The outer loop runs $2^n$ times. The inner loop runs $n$ times to check each bit. Total: $O(n \cdot 2^n)$.

#### Space Complexity

Excluding the space for the result list, the auxiliary space is $O(1)$ because we only use a few integer variables. There is no recursion stack.

### Code

```java
class Solution {
    public List&lt;List&lt;Integer&gt;&gt; subsets(int[] nums) {
        List&lt;List&lt;Integer&gt;&gt; result = new ArrayList<>();
        int n = nums.length;

        // Total subsets = 2^n
        int totalSubsets = 1 &lt;&lt; n;

        for (int i = 0; i < totalSubsets; i++) {
            List<Integer&gt; currentSubset = new ArrayList<&gt;();

            // Check each bit of the current number 'i'
            for (int j = 0; j &lt; n; j++) {
                // If the j-th bit is set, include nums[j]
                if (((i &gt;> j) & 1) == 1) {
                    currentSubset.add(nums[j]);
                }
            }
            result.add(currentSubset);
        }

        return result;
    }
}
```

### When to AVOID Bitmasking

Even though it's "cleaner," an experienced developer knows when to stick to backtracking:

- **If $n > 30$**: An `int` only has 31 usable bits. If $n = 40$, you need a `long`. If $n = 100$, bitmasking is impossible.
- **If there are Duplicates**: Handling "Subsets II" (unique subsets from a duplicate array) is very natural in backtracking but requires complex hash-sets or logic in bitmasking.
- **If Pruning is needed**: If the problem is "Subsets that sum to $K$," backtracking can stop early if the current sum exceeds $K$. Bitmasking **must** check all $2^n$ possibilities regardless.

### Concepts to Think About

- **Power of Two**: `1 &lt;&lt; n` is an extremely fast way to calculate $2^n$.
- **Bitwise AND**: `(i & (1 << j))` is an alternative to `(i &gt;&gt; j) & 1` for checking if the $j^{th}$ bit is set.
- **Limit of int**: This approach only works if $n < 31$. If $n \geq 31$, $2^n$ will overflow a 32-bit `int`. You would need a `long` (up to $n = 63$) or `BigInteger`.
- **Lexicographical Order**: Bitmasking generates subsets in a different order than DFS-based backtracking. Backtracking is usually "depth-first," while bitmasking is "numerical order" of the masks.
- **Cache Locality**: Iterative solutions are often more cache-friendly than recursive ones because they don't jump around the memory stack as much.

### Logical Follow-up

**Question: Constant Space Processing**: If you are asked to print all subsets but are forbidden from using more than $O(n)$ space total (no result list), how does Bitmasking help?

**Solution**: Since Bitmasking is iterative, you can generate and print each subset one by one in the inner loop. Once a subset is printed, you can clear the `currentSubset` list or just print directly from the array. This keeps the total space complexity at $O(n)$ for the temporary storage, compared to $O(n \cdot 2^n)$ if you were forced to store them all.

**Question: Subset of a Specific Size**: How would you modify the bitmask approach to only return subsets of size $k$?

**Solution**: Inside the inner loop, you would use `Integer.bitCount(i)` to check if the current mask has exactly $k$ bits set to 1. If it does, you process it; otherwise, you skip it. Note that while this works, it is less efficient than a specialized backtracking approach because you still iterate $2^n$ times.
