---
tags:
  - arrays
  - boyer-moore
  - counting
---

# Majority Element II

## Question

Given an integer array of size $n$, find all elements that appear strictly more than $\lfloor n/3 \rfloor$ times. The algorithm should run in linear time and in $O(1)$ space.

## Solution

### Pattern

**Extended Boyer-Moore Majority Vote**
Maintain exactly two candidates and two counters. When an element matches neither candidate, decrement both counters. Because there can be at most two elements appearing $> n/3$ times, they will survive the mutual cancellation.

### How to Identify

- The problem asks for elements appearing more than $\lfloor n/k \rfloor$ times (here, $k=3$).
- There is a strict requirement for $O(1)$ auxiliary space, disqualifying HashMaps.
- The algorithm requires a streaming or single/double-pass approach.

### Description

Step-by-step explanation:

1. **Mathematical Invariant:** In any array of size $N$, there can be at most **two** elements that appear strictly more than $\lfloor N/3 \rfloor$ times. (e.g., if $N=10$, threshold is $3$. You can have at most two numbers appear $4$ times: $4+4=8 \le 10$. Three numbers appearing $4$ times requires size $12$).
2. Initialize two candidates (`candidate1`, `candidate2`) and two counters (`count1`, `count2`) to $0$.
3. **Pass 1 (Finding Candidates):** Iterate through the array. For each element:
   - If it matches `candidate1`, increment `count1`.
   - Else if it matches `candidate2`, increment `count2`.
   - Else if `count1` is $0$, set `candidate1` to the current element and `count1` to $1$.
   - Else if `count2` is $0$, set `candidate2` to the current element and `count2` to $1$.
   - **Crucial Step:** If the element matches *neither* candidate and neither counter is $0$, it represents a completely different number. We "cancel out" one instance of `candidate1`, one instance of `candidate2`, and the current number. We do this by decrementing both `count1` and `count2`.
4. **Pass 2 (Verification):** Because the first pass only guarantees that the *surviving* candidates are the *most likely* majorities (it can yield false positives if there is no majority), we must reset the counters and iterate through the array again to count the actual occurrences of `candidate1` and `candidate2`.
5. If the verified count of a candidate is strictly greater than $\lfloor N/3 \rfloor$, add it to the result list.

### The Intuition

Think of this as an epic three-way battle. 
Imagine the array elements as soldiers belonging to different factions (where the number is the faction ID).
When a soldier encounters two soldiers from two *different* factions, they engage in a 3-way duel where all three instantly kill each other. 
Because the factions that have more than $\lfloor N/3 \rfloor$ soldiers are mathematically so massive, even if every single minority soldier perfectly coordinates to orchestrate these 3-way mutual destructions, the minority factions will run out of soldiers first. The only factions left standing *must* be the massive majorities.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

We iterate through the array exactly twice. All operations inside the loops are constant time $O(1)$ `if-else` evaluations. Time complexity is strictly $O(N)$.

#### Space Complexity

We only allocate four primitive integer variables (`candidate1`, `candidate2`, `count1`, `count2`) regardless of the size of the input array. The result list is not considered auxiliary space. Therefore, space complexity is strictly $O(1)$.

### Code

```java
class Solution {
    public List&lt;Integer&gt; majorityElement(int[] nums) {
        if (nums == null || nums.length == 0) return new ArrayList<>();

        int candidate1 = 0, candidate2 = 0;
        int count1 = 0, count2 = 0;

        // Pass 1: Find the top 2 candidates
        for (int num : nums) {
            // Must check matches BEFORE checking counts to prevent duplicates
            if (num == candidate1) {
                count1++;
            } else if (num == candidate2) {
                count2++;
            } else if (count1 == 0) {
                candidate1 = num;
                count1 = 1;
            } else if (count2 == 0) {
                candidate2 = num;
                count2 = 1;
            } else {
                // Tri-way cancellation
                count1--;
                count2--;
            }
        }

        // Pass 2: Verify the candidates
        count1 = 0;
        count2 = 0;
        for (int num : nums) {
            if (num == candidate1) count1++;
            else if (num == candidate2) count2++;
        }

        List&lt;Integer&gt; result = new ArrayList<>();
        int threshold = nums.length / 3;

        if (count1 > threshold) result.add(candidate1);
        if (count2 > threshold) result.add(candidate2);

        return result;
    }
}
```

## Caveats

- **Order of Evaluation:** The order of the `if-else` chain is extremely important. You MUST check if the current number matches the existing candidates *before* checking if the counts are $0$. If you check `count1 == 0` first, and the array is `[1, 1, 1]`, the second `1` might accidentally get assigned to `candidate2` if `count2 == 0`, leading to duplicate candidates and broken logic.
- **Verification is Mandatory:** Unlike finding the absolute majority ($>N/2$) where existence might be guaranteed by the prompt, finding $>N/3$ almost always requires the second pass. If the array is `[1, 2, 3, 4, 5]`, the algorithm will confidently output two candidates (e.g., `4` and `5`) even though neither meets the threshold.
- **Empty Arrays:** Always handle null/empty cases to prevent runtime exceptions.


## Concepts to Think About

- **Generalization to $N/K$:** This algorithm generalizes to finding elements appearing more than $\lfloor N/K \rfloor$ times. You need $K-1$ candidates and $K-1$ counters. When a new element matches none of the $K-1$ candidates, you decrement all $K-1$ counters.
- **HashMap Fallback:** If the $O(1)$ space constraint is removed, simply counting frequencies using a `HashMap` is much easier to read and write, achieving the same $O(N)$ time (amortized) with $O(N)$ space.
- **Streaming Data:** Boyer-Moore is exceptionally useful for data streams where you cannot store the entire dataset in memory and can only process elements one at a time.
- **Misunderstandings:** This is not a "frequency" problem (which would be $O(n)$ space). This is a "relative frequency" problem.
- **Stable vs Unstable:** This algorithm is stable in its candidate selection but order-dependent in how counters fluctuate.


## Logical Follow-up

Question: Generalize this approach. How would you design an algorithm to find all elements that appear more than $\lfloor N/K \rfloor$ times using strictly $O(K)$ space?
Solution: We use an array (or a Hash Map capped at size $K-1$) to store exactly $K-1$ candidates and their respective counts. As we iterate through the array, if the element matches an existing candidate, we increment its count. If the element doesn't match but we have less than $K-1$ candidates, we add it with a count of $1$. If the element doesn't match AND we already have $K-1$ candidates, we decrement the count of *every single* candidate in our tracker by $1$. If a candidate's count drops to $0$, we remove it to make room. Finally, we do a second pass to verify the exact counts of the surviving candidates. Time: $O(N \cdot K)$, Space: $O(K)$.

