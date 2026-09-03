---
tags:
  - arrays
  - hash-table
  - two-pointers
---

# Two Sum

## Question

Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Solution

### Pattern

**Complement Search via Hash Map**
Store elements in a Hash Map as you iterate. For each element, calculate its "complement" (target - current element) and check if it already exists in the map.

### How to Identify

- The problem asks for "pairs" that satisfy a mathematical condition (sum, difference).
- You need to optimize an $O(n^2)$ nested-loop brute force search into a linear sequence.
- The solution requires returning *indices*, rendering sorting (which destroys original indices) less viable unless paired with extra space.

### Description

Step-by-step explanation:

1. Create an empty Hash Map. This will map the integer values we see to their indices in the array (`Value -> Index`).
2. Iterate through the array `nums` sequentially using a single pointer `i`.
3. At each step, calculate the `complement`, which is `target - nums[i]`. This is the exact number we need to find to complete our pair.
4. Check the Hash Map. Does the `complement` already exist as a key? 
   - If **yes**, we are done. We retrieve the index of the complement from the map, and return it alongside our current index `i`.
   - If **no**, we haven't seen the needed number yet. We insert our current number `nums[i]` and its index `i` into the Hash Map so it can potentially act as a complement for future numbers.
5. If the loop terminates without returning, no valid pair exists (though the problem guarantees one).

### The Intuition

Think of this like a "Wanted Poster" mental model. 
Imagine you are walking down a line of people holding random amounts of money. You need exactly $10 total between two people.
When you meet Alice, she has $3. She looks at the "Wanted" board for someone with $7, but the board is empty. So, Alice puts her *own* name and amount ($3) on the board and waits. 
Next, you meet Bob, who has $7. Bob looks at the board, sees Alice is looking for a partner to make $10. Bob realizes *he* is the $7 she needs. Match found! By recording what we have, we instantly know when we find what we need.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n^2)$       | $O(n)$           |
| Space Complexity | $O(n)$         | $O(n)$           |

#### Time Complexity

On average, inserting and searching in a Hash Map takes $O(1)$ time. Since we iterate through the array of size $n$ exactly once, the average time complexity is $O(n)$. The worst-case is theoretically $O(n^2)$ if every hash insertion results in a collision (though modern Java uses balanced trees for heavy collisions, bringing it to $O(n \log n)$).

#### Space Complexity

We use a Hash Map to store previously seen elements. In the worst-case scenario (the pair is at the very end of the array), we will store $n-1$ key-value pairs in the Hash Map, resulting in $O(n)$ auxiliary space.

### Code

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Map stores seen numbers and their original indices: &lt;Number, Index&gt;
        Map&lt;Integer, Integer&gt; numToIndex = new HashMap<>();
        
        for (int i = 0; i &lt; nums.length; i++) {
            int complement = target - nums[i];
            
            // Check if we've already processed the required complement
            if (numToIndex.containsKey(complement)) {
                return new int[] {numToIndex.get(complement), i};
            }
            
            // Add the current number to the "seen" map
            numToIndex.put(nums[i], i);
        }
        
        throw new IllegalArgumentException("No pair found matching the target.");
    }
}

```

## Caveats

- **Memory Constraints:**  
  If working in an embedded system or processing terabytes of data, an `O(n)` memory overhead for a Hash Map might trigger Out-Of-Memory errors.

- **Sorted Data:**  
  If the input array is already sorted, using a Hash Map is a waste of memory. A Two-Pointer approach from both ends of the array achieves `O(n)` time and `O(1)` space.

---

## Concepts to Think About

- **Hash Collisions:** Understand how your language handles underlying map collisions (e.g., Separate Chaining vs. Open Addressing).
- **Sorting Trade-offs:** If we didn't need to return indices (e.g., returning the values themselves), sorting the array (`O(n log n)`) + two pointers (`O(n)`) yields `O(1)` space.
- **Handling Duplicates:** If the array allows multiple pairs and you need to return all unique pairs, the logic gets substantially more complex.
- **One-pass vs Two-pass:** A two-pass hash map approach is easier to write initially but fails if an element is exactly half the target and appears only once (e.g., `target = 6`, `nums = [3]`, it might match `3` with itself). One-pass naturally avoids this.
- **Data Locality:** Hash maps have poor CPU cache locality compared to contiguous arrays. For very small `n`, a brute-force `O(n²)` double loop might actually benchmark faster than a Hash Map due to caching.
- Sorted vs. Unsorted: If the array were sorted, could we do better? (Hint: Two Pointers, O(1) space).
- Memory Constraints: What if the array has 10 billion numbers and won't fit in memory? (Hint: Sharding or External Merge Sort).
- Collision Handling: How does your language of choice handle Hash Map collisions? (Java uses Linked Lists, then converts to Red-Black Trees for O(logn) worst-case).
- Duplicate Values: Does the Hash Map approach handle duplicates like nums = [3, 3], target = 6? (Yes, because the first 3 is stored before the second 3 is checked).


## Logical Follow-up

**Question:** What if the input array is sorted in ascending order? Can you solve it using `O(1)` space?
**Solution:** Yes. We use the Two Pointer technique. Place a `left` pointer at index `0` and a `right` pointer at `n - 1`.

Calculate:

```text
sum = nums[left] + nums[right]
```

- If `sum == target`, return the indices.
- If `sum < target`, increment `left` to increase the sum.
- If `sum &gt; target`, decrement `right` to decrease the sum.

This runs in `O(n)` time and strictly `O(1)` space.


**Question:** What if we are designing a data structure to receive a stream of numbers and answer "Two Sum" queries on demand? (Two Sum III)
**Solution:** We must balance `add()` and `find()` operations.

- If `find()` is called frequently:
  - Store all pairwise sums in a `HashSet` during `add()`
  - Complexity:
    - `add()` → `O(n)`
    - `find()` → `O(1)`

- If `add()` is frequent but `find()` is rare:
  - Maintain a standard frequency map
  - During `find()`, iterate through the keys and search for complements
  - Complexity:
    - `add()` → `O(1)`
    - `find()` → `O(n)`


**Question:** How would you extend this to find 3 numbers that sum to a target? (3Sum)
**Solution:** First, sort the array:

```text
O(n log n)
```

Then iterate through the array, treating `nums[i]` as a fixed value.

The remaining problem becomes a Two Sum search with target:

```text
target - nums[i]
```

Since the array is sorted, solve this using the `O(1)` space Two Pointer technique in `O(n)` time.

Overall complexity:

```text
O(n²)
```
