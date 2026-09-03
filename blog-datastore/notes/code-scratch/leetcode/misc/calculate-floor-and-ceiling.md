---
description: Ceil The Floor
---

# Calculate Floor & Ceiling

Since the array is **sorted**, we can use **binary search** to efficiently find:

* **Floor** → greatest number ≤ `x`.
* **Ceiling** → smallest number ≥ `x`.

Binary search helps narrow down both floor and ceiling in **O(log n)** time.



**Steps**

1. Initialize `floor = -1` and `ceiling = -1`.
2. Use binary search on the array:
   * If `a[mid] == x`, both floor and ceiling are `x`.
   * If `a[mid] &lt; x`, update `floor = a[mid]` and move right.
   * If `a[mid] &gt; x`, update `ceiling = a[mid]` and move left.
3. Once the loop ends, return `[floor, ceiling]`.

## Complexity

| Space Complexity | Time Complexity       |
| ---------------- | --------------------- |
| $$\text{O}(1)$$  | $$\text{O}(\log{N})$$ |

## Code

```java
public static int[] getFloorAndCeil(int[] sortedArray, int size, int target) {
    int floor = -1, ceiling = -1;

    int left = 0, right = size - 1;

    // Binary search loop
    while (left &lt;= right) {
        int mid = (left + right) &gt;> 1; // Same as (left + right) / 2

        // If exact match found, floor and ceiling are the same
        if (sortedArray[mid] == target) {
            return new int[]{target, target};
        }

        // If mid element is less than target, it's a floor candidate
        if (sortedArray[mid] < target) {
            floor = sortedArray[mid];
            left = mid + 1;
        } 
        // If mid element is greater than target, it's a ceiling candidate
        else {
            ceiling = sortedArray[mid];
            right = mid - 1;
        }
    }

    // Return the best floor and ceiling found
    return new int[]{floor, ceiling};
}

```
