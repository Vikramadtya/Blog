# Number of occurrence

## Intuition

Since the array is **sorted**, all occurrences of the number `x` will appear **contiguously**.\
To count how many times `x` appears, we can:

1. Find the **first occurrence** of `x`.
2. Find the **last occurrence** of `x`.
3. The total count is then simply `lastIndex - firstIndex + 1`.

We can find both occurrences in **O(log n)** time using **binary search**.

## Complexity

| Space Complexity | Time Complexity       |
| ---------------- | --------------------- |
| $$\text{O}(1)$$  | $$\text{O}(\log{N})$$ |

## Code

```java
// Helper function to find first or last occurrence of 'x' using binary search
static int findFirstOrLastOccurrence(int[] arr, int target, boolean searchFirst) {
    int left = 0, right = arr.length - 1;
    int result = -1;

    while (left &lt;= right) {
        int mid = (left + right) &gt;> 1;

        if (arr[mid] == target) {
            result = mid;  // potential answer found
            if (searchFirst) {
                right = mid - 1; // search in left half for earlier occurrence
            } else {
                left = mid + 1;  // search in right half for later occurrence
            }
        } else if (arr[mid] < target) {
            left = mid + 1;  // move right
        } else {
            right = mid - 1; // move left
        }
    }

    return result;
}

// Main function to count occurrences of 'x'
public static int count(int[] arr, int n, int x) {
    int firstIndex = findFirstOrLastOccurrence(arr, x, true);

    if (firstIndex == -1) return 0;  // 'x' not found

    int lastIndex = findFirstOrLastOccurrence(arr, x, false);

    return lastIndex - firstIndex + 1;  // total occurrences
}

```
