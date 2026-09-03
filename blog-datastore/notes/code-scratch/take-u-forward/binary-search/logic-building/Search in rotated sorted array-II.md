---
tags:
  - cc
  - array
  - binary-search
  - duplicates
  - worst-case-analysis
---

# Search in Rotated Sorted Array II (With Duplicates)

## Question
An integer array `nums` is sorted in ascending order (contains duplicates) and rotated at an unknown pivot. Given a target `k`, return `true` if it exists, `false` otherwise.

## Solution

### Pattern
**Binary Search with Linear Shrinkage**

#### How to Identify
* The array is rotated and sorted.
* The array **contains duplicates**.
* You need to find if a value exists, but standard $O(\log n)$ logic is thwarted by "ambiguous" boundaries.

### Description
In the distinct version, `nums[left] &lt;= nums[mid]` perfectly identified the sorted half. With duplicates, if `nums[left] == nums[mid] == nums[right]`, we cannot tell which side is sorted. We handle this by incrementing `left` and decrementing `right` until the ambiguity is resolved, then resuming standard binary search.


#### The "Strict Skepticism" Pattern
In a distinct array, `nums[left] <= nums[mid]` guarantees a sorted left half. With duplicates, this condition is a "liar." If `nums[left]==nums[mid]`, the pivot "drop" could be hiding inside that plateau.

##### The Ambiguity Scenarios

###### Scenario A: Triple Equality `(nums[L]=nums[M]=nums[R])`

We are completely blind. We cannot tell if the drop is to the left or right because all three reference points look identical.

Action: Shrink both ends (`left++`,`right−−`).

###### Scenario B: Double Equality `(nums[L]=nums[M] but nums[M] != nums[R])`

We are "partially blind," but the right side provides information.

Why it functions: The code attempts the left-half range check: `target &gt;= nums[L] && target &lt; nums[M]`. Since `L=M`, this is mathematically impossible for any target not already found. The code defaults to searching the right half, which is exactly where the answer must be if the left is just a flat plateau.

!!! "note"
    Binary search depends on information entropy. Each comparison should provide 1 bit of information (go left or go right). Duplicates "steal" this information. When we are blind (`L=M=R`), we must use linear shrinkage to find a point where information exists again.


**Why `nums[left] == nums[mid] && nums[mid] != nums[right]` is a Plateau, The Invariant: The "One-Drop" Rule**

To understand why this logic works, you must visualize the array as two strictly increasing "slopes" separated by exactly **one drop** (the pivot).

In a valid rotated sorted array, once you "drop" from the high slope to the low slope, you can **never climb back up** to your original height. 

- **If $nums[left] == nums[mid]$:** It is mathematically impossible for a "drop" to be between them *unless* every element in between is also the same value. 
- **Proof:** If there were a drop, you’d be at a lower value. To get back to the value at `left`, you'd have to "climb" back up, which violates the sorted-rotation property.

### The Intuition

Imagine a mountain range where some peaks are actually flat plateaus. If you're standing on a flat spot and the start and end of your range look exactly like where you're standing, you don't know if the "drop" is to your left or your right. You have to walk (linear search) until the ground changes before you can use your map (binary search) again.

### Complexity

| Label | Worst | Average |
| :--- | :--- | :--- |
| Time Complexity | $O(n)$ | $O(\log n)$ |
| Space Complexity | $O(1)$ | $O(1)$ |

&gt; **L5 Warning:** The worst case occurs when the array is filled with nearly identical values, forcing the algorithm to skip duplicates one by one.

### Code (L5 Refined)

```java
class Solution {
    public boolean search(int[] nums, int target) {
        if (nums == null || nums.length == 0) return false;

        int left = 0, right = nums.length - 1;

        while (left &lt;= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return true;

            // AMBIGUITY CHECK: The L5 critical section
            if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
                left++;
                right--;
                continue; // Skip the rest and recalculate mid
            }

            // Standard Rotated Logic
            if (nums[left] <= nums[mid]) {
                if (target &gt;= nums[left] && target &lt; nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (target &gt; nums[mid] && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return false;
    }
}
```

## Concepts to Think About

- Worst-Case vs. Average-Case: In Google interviews, we care about the worst case for security (preventing Complexity Attacks) but average case for user performance.
- Total vs. Unique Elements: The complexity is actually O(log(unique_elements)) if you don't count the linear skips.
- Is Binary Search worth it? If an array is 99% duplicates, a simple linear search might actually be faster due to CPU Branch Prediction and cache locality.
- Information Theory: Binary search requires 1 bit of information (Left/Right) per comparison. Duplicates "zero out" that information, forcing a linear fallback.
- CPU Optimization: On a plateau, a linear search is often faster than binary search in real-time because the CPU's Branch Predictor perfectly anticipates the next element.
- Strict vs. Non-Strict: Why do we use <=? Even after handling plateaus, the = handles the final 2-element case where left=mid.

## Logical Follow-up

**Question:** "Can we still find the **Minimum Element** in $O(\log n)$ in a rotated array if duplicates are allowed?"

**Answer:** No. Just like searching for a target, finding the minimum (the pivot) also degrades to $O(n)$ in the worst case. For example: `[1, 1, 1, 0, 1]`. You cannot determine where the `0` is without potentially checking every `1`.

**Question:**  "If we use the triple-equality check, do we still need to use nums[left] <= nums[mid] later in the code, or can we just use nums[left] &lt; nums[mid]?"

**Answer:** You still need <=. Even if the triple-equality is handled, you can still have a case where left=mid (a 2-element array). As we discussed before, the = in <= handles that final base case to ensure the algorithm doesn't get confused about which side is sorted when only one element remains in the sub-range.

**Question (The Data Distribution Challenge):** "Suppose we are receiving these rotated arrays as part of a high-speed data stream. We notice that $90\%$ of the arrays contain no duplicates, but $10\%$ are 'malicious' arrays designed to trigger the $O(n)$ worst-case. How would you modify your system to ensure that these malicious arrays don't cause a **Service Denial (DoS)** by exhausting CPU threads?"

**Solution:**

This is a **System Resilience** question.

1. **Heuristic Pre-check:** Before running the full search, check `nums[left] == nums[mid] == nums[right]`. If true, flag the data as "potential worst-case."
2. **Time-Boxing / Quotas:** Set a "CPU cycle budget" for the search. If the search takes more than $X$ microseconds, move it to a lower-priority background thread pool so it doesn't block "healthy" requests.
3. **Data Pre-processing:** If we own the data pipeline, we could store a metadata flag `is_unique: true` at the time of rotation. If `is_unique` is true, we can safely use the $O(\log n)$ algorithm without the duplicate-skipping logic.
4. **Alternative Indexing:** For the $10\%$ malicious cases, we could use a **Bloom Filter** to check for existence in $O(1)$ before even starting the binary search.
