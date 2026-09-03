---
tags:
  - arrays
  - dynamic-programming
  - math
  - prefix-sum
---

# Maximum Product Subarray

## Question

Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return that product. 

## Solution

### Pattern

**Prefix and Suffix Accumulation**
Compute the running product from left-to-right (prefix) and right-to-left (suffix). Reset the running product to $1$ whenever a $0$ is encountered. The global maximum will always be found during one of these two traversals.

### How to Identify

- The problem asks for the maximum/minimum of a **contiguous subarray**.
- The operation is **multiplication**, which behaves non-monotonically (a negative times a negative becomes positive).
- Sliding Window fails because shrinking the window doesn't predictably increase or decrease the product due to negative numbers and zeroes.

### Description

Step-by-step explanation:

1. Validate the input (handle null/empty arrays).
2. Initialize `prefix` and `suffix` trackers to $1$.
3. Initialize `maxProduct` to the first element of the array. (Using `double` for these trackers is highly recommended in languages like Java/C++ to prevent silent integer overflow during intermediate calculations).
4. Iterate through the array. In the same loop, update the `prefix` using `nums[i]` and the `suffix` using `nums[n - 1 - i]`.
5. If either `prefix` or `suffix` becomes $0$ (because we multiplied by a $0$ in the array), we will evaluate that $0$ against `maxProduct`, and then immediately reset the tracker back to $1$ to evaluate the next independent segment of the array.
6. Continuously update `maxProduct` with the maximum of itself, the current `prefix`, and the current `suffix`.
7. Cast `maxProduct` back to an `int` and return it.

### The Intuition

This solution relies on the mathematical properties of parity (even/odd) regarding negative numbers.
Imagine an array with no zeroes: `[a, b, c, d]`.
- **Case 1: Even number of negatives.** The product of the entire array is positive. Therefore, the maximum product *is* the entire array. Both the prefix and suffix passes will eventually calculate this total product.
- **Case 2: Odd number of negatives.** The product of the entire array is negative. To maximize the product, we must "remove" exactly one negative number. We can only do this by chopping off a prefix (up to the first negative) or a suffix (down to the last negative). 
  - If we remove the *last* negative number, the maximal subarray is a **prefix** of the array.
  - If we remove the *first* negative number, the maximal subarray is a **suffix** of the array.
Therefore, the optimal subarray *must* touch either the left boundary or the right boundary. By calculating all prefixes and all suffixes, we mathematically guarantee finding it. Zeroes simply act as "walls" that reset this logic for independent sub-segments.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

We iterate through the array of size $N$ exactly once. Inside the loop, we perform $O(1)$ constant-time multiplications and comparisons. Total time is strictly $O(N)$.

#### Space Complexity

We use exactly three primitive variables (`prefix`, `suffix`, `maxProduct`). No auxiliary arrays are allocated. Total space is $O(1)$.

### Code

```java
class Solution {
    public int maxProduct(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int n = nums.length;
        double prefix = 1;
        double suffix = 1;
        double maxProduct = nums[0]; 

        for (int i = 0; i < n; i++) {
            if (prefix == 0) prefix = 1;
            if (suffix == 0) suffix = 1;

            prefix *= nums[i];
            suffix *= nums[n - 1 - i];

            maxProduct = Math.max(maxProduct, Math.max(prefix, suffix));
        }

        return (int) maxProduct;
    }
}
```

## Caveats

- **Intermediate Integer Overflow:** Multiplying many numbers can quickly exceed the 32-bit limit of `int`.  Subarray products grow much faster than sums. In Java, `long` or `double` might be needed for intermediate calculations, though the result usually fits in `int` based on standard competitive constraints.
- **Sliding Window Anti-Pattern:** Never use sliding window for subarray products with negative numbers. The loss of monotonicity means the left pointer doesn't mathematically know whether to shrink or stay to maximize the value.
- **Single Element 0:** If the array is `[-2, 0, -1]`, the answer is 0. The initialization to `MIN_VALUE` and the reset logic handle this.

## Concepts to Think About

- **Kadane's Algorithm Adaptation (DP):** Another $O(1)$ space solution exists where you track both `currentMax` and `currentMin` at every step. When you encounter a negative number, you swap `currentMax` and `currentMin`. This is the canonical DP approach, but the Prefix/Suffix approach is generally considered easier to intuit mathematically.
- **Sub-segment Independence:** Recognizing that a $0$ acts as a reset wall is a foundational concept for many array algorithms. It allows you to break a complex global problem down into independent local problems.
- **Logarithmic Transformation:** Could you turn this into a Max Subarray Sum problem using `log(abs(x))`? (Think about signs!).
- **Sign Tracking:** The parity of negative numbers determines if the whole segment is positive or negative.
- **Zero as a Reset:** Why does a zero break the "chain"?
- **Handling Large Numbers:** Does `double` provide enough precision for integer products? (In most interview cases, yes, but worth mentioning).


## Logical Follow-up

Question: Explain how you would solve this using Kadane's dynamic programming pattern instead of the prefix/suffix method. Is one better than the other?
Solution: We maintain a `currentMax` and `currentMin`. At each step, if `nums[i]` is negative, multiplying it by our `currentMax` makes it very small, and multiplying it by our `currentMin` makes it very big. So, if `nums[i] < 0`, we swap `currentMax` and `currentMin`. Then, we update `currentMax = max(nums[i], currentMax * nums[i])` and `currentMin = min(nums[i], currentMin * nums[i])`. We update our global max with `currentMax`. Both approaches take $O(N)$ time and $O(1)$ space. The Prefix/Suffix approach is slightly easier to mathematically prove during an interview, while Kadane's requires slightly less branching logic.


Question: What if the array contains fractional numbers between 0 and 1?
Solution: The product logic stays the same, but the "maximum" might not involve more elements; multiplying by a fraction makes the product smaller. Kadane's variation handles this more robustly than prefix/suffix.

Question: What if you need to return the actual subarray, not just the product?
Solution: Store the indices whenever `maxProduct` is updated during the prefix/suffix scan.