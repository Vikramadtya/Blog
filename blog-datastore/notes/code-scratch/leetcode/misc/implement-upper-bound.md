# Implement Upper Bound

## Intuition

The **upper bound** of a number `x` in a sorted array is the **index of the first element that is strictly greater than `x`**. If all elements are less than or equal to `x`, the upper bound is the index `n` (i.e., where `x` would go if appended to the array).

## Complexity

| Space Complexity | Time Complexity       |
| ---------------- | --------------------- |
| $$\text{O}(1)$$  | $$\text{O}(\log{N})$$ |

## Code

```java
public static int upperBound(int[] sortedArray, int target, int arrayLength) {
    int left = 0, right = arrayLength - 1;

    while (left &lt;= right) {
        int mid = (left + right) &gt;> 1;  // Calculate mid index

        // If element equals target, move right to find strictly greater value
        if (sortedArray[mid] == target) {
            while (mid < arrayLength && sortedArray[mid] == target) mid++;
            return mid;
        }

        // If middle element is less than or equal to target, move right
        if (sortedArray[mid] < target) {
            left = mid + 1;
        } else {
            // Current mid might be the upper bound, search in left half
            right = mid - 1;
        }
    }

    // If no greater element exists, return insertion point (arrayLength)
    return left;
}

```
