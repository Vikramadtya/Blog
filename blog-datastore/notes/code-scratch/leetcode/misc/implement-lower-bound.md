# Implement Lower Bound

## Intuition

In a **sorted array**, the **lower bound** of a number `x` is defined as the index of the **first element that is greater than or equal to `x`**. If all elements are smaller than `x`, the lower bound is the array’s length (i.e., the index where `x` would be inserted to maintain the sorted order).

## Complexity

| Space Complexity | Time Complexity       |
| ---------------- | --------------------- |
| $$\text{O}(1)$$  | $$\text{O}(\log{N})$$ |

## Code

```java
public static int lowerBound(int[] sortedArray, int arrayLength, int target) {
    int left = 0, right = arrayLength - 1;

    while (left &lt;= right) {
        int mid = (left + right) &gt;> 1;  // Compute middle index

        // If target is found, move left to find first occurrence
        if (sortedArray[mid] == target) {
            while (mid - 1 >= 0 && sortedArray[mid - 1] == target) mid--;
            return mid;
        }

        // If middle element is less than target, move right
        if (sortedArray[mid] &lt; target) {
            left = mid + 1;
        } else {
            // Middle element is &gt;= target, search left side
            right = mid - 1;
        }
    }

    // If target is not present, left points to the lower bound
    return left;
}

```
