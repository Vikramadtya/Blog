
---
tags:
  - cc
  - array
  - linear-search
---

# Linear Search

## Question

Given an array of integers $nums$ and an integer $target$, find the smallest index (0-indexed) where the $target$ appears. If the $target$ is not present, return $-1$.

$nums = [2, 3, 4, 10, 40]$, $target = 10 \rightarrow \text{Output: } 3$

## Solution

### Pattern

**Linear Scan**
The algorithm checks each element of the sequence sequentially until a match is found or the end of the sequence is reached.

### How to Identify

- When the data is **unsorted**.
- When you need to find the **first occurrence** of an element.
- When the input size is small enough that $O(n)$ is acceptable.
- When no additional data structures (like HashMaps) are allowed.

### Description

Step-by-step explanation:

1.  **Boundary Check:** First, ensure the input array is not null or empty.
2.  **Traversal:** Start from the first element (index $0$).
3.  **Comparison:** Compare the current element $nums[i]$ with the $target$.
4.  **Early Exit:** If $nums[i] == target$, immediately return $i$ as the result. This ensures we find the *smallest* index.
5.  **Exhaustion:** If the loop completes and the end of the array is reached without a match, return $-1$.



### The Intuition

Think of Linear Search as looking for a specific book on a messy shelf. You don't know the order, so you must look at every spine one by one, starting from the left. You stop as soon as you find it. If you reach the right end of the shelf without seeing it, you conclude the book isn't there.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n/2)$         |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
In the worst case, the target is the last element or not present, requiring $n$ comparisons. Average case finds it in $n/2$ steps.

#### Space Complexity
The algorithm is performed in-place with a constant amount of auxiliary memory ($O(1)$).

### Code

```java
class Solution {
    /**
     * Finds the first occurrence of target in nums.
     * Uses a standard for-loop for maximum readability and thread safety.
     */
    public int linearSearch(int[] nums, int target) {
        // Handle edge cases
        if (nums == null || nums.length == 0) {
            return -1;
        }

        // Standard linear scan
        for (int i = 0; i < nums.length; i++) {
            // Return index as soon as target is matched
            if (nums[i] == target) {
                return i;
            }
        }

        // Target not found after full traversal
        return -1;
    }
}
```

## Caveats

- **Performance:** For very large datasets requiring frequent searches, $O(n)$ is inefficient. Use a `HashSet` or sort the data for $O(1)$ or $O(\log n)$ search.
- **Data Types:** For objects (e.g., `String`), use `.equals()` instead of `==`.
- **Concurrency:** Modifying the array during a search (Sentinel method) is dangerous in multi-threaded environments.

## Concepts to Think About

- **Cache Locality:** Linear search is cache-friendly because it accesses elements contiguously in memory.
- **Search vs. Selection:** Linear search is $O(n)$, but finding the $k$-th smallest element (Selection) is a different problem usually solved by QuickSelect.
- **Early Exit Strategy:** Always return immediately upon finding the result to optimize the average case.
- **Sorted Data:** If the array were sorted, would you still use Linear Search? Think about why **Binary Search** ($O(\log n)$) would be vastly superior for sorted datasets.
- **Search for All:** How would the code change if the question asked for **all** indices where the target appears? (Hint: You would need a dynamic collection like a `List` to store results instead of returning immediately).
- **Sentinel Search:** There is a variation called "Sentinel Linear Search" where you place the target at the very end of the array manually. Why would this reduce the number of comparisons made inside the loop?
    - Sentinel Linear Search is an optimized version of the basic search. By placing the target at the end of the array (the "sentinel"), we guarantee the loop will always find the target. This allows us to remove the boundary check (`i < length`) from the loop header, saving one comparison per iteration.
    - Imagine walking through a long hallway of doors looking for a specific person. Usually, you have to check two things at every door: "Is this the person?" AND "Have I reached the end of the hallway?" To save time, you put a clone of the person you're looking for at the very end of the hallway. Now, you only have to ask one question: "Is this the person?" When you find them, you just check if you're at the very last door to see if it was a real find or just your clone.
        ```java
        class Solution {
            public int linearSearch(int[] nums, int target) {
                // Guardrail for empty arrays
                if (nums == null || nums.length == 0) return -1;

                int n = nums.length;
                int lastElement = nums[n - 1];

                // Place sentinel
                nums[n - 1] = target;
                int i = 0;

                // Optimized loop: No boundary check (i < n) required!
                while (nums[i] != target) {
                    i++;
                }

                // Restore the original last element
                nums[n - 1] = lastElement;

                // If we found the target before the last element, or if the 
                // original last element was actually the target, return the index.
                if (i < n - 1 || lastElement == target) {
                    return i;
                }

                return -1;
            }
        }
        ```

- **Order of Operations:** If you are going to search the same unsorted array 1,000 times, is it better to do 1,000 Linear Searches, or sort the array once and do 1,000 Binary Searches? (Think about the $O(n^2)$ total cost vs $O(n \log n + k \log n)$).
- **2D Linear Search:** If you were given a matrix instead of a flat array, what would the Time Complexity be? ($O(rows \times columns)$).

## Logical Follow-up

Question: If the array were **sorted**, how would you improve this?
Solution: Use **Binary Search**. By repeatedly halving the search space, the complexity drops from $O(n)$ to $O(\log n)$.

Question: How would you search for a target in a **2D Matrix**?
Solution: You can still use linear search (visiting every cell $O(N \times M)$), but if the matrix is sorted, you can optimize by starting from the top-right or bottom-left corner ($O(N+M)$).