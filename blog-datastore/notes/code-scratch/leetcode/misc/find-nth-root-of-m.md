# Find Nth Root Of M

## Intuition

We know that raising a number to a power grows steadily (monotonically). This makes it perfect for binary search. Instead of checking every number, we can narrow down the possible root quickly using this method.

## Complexity

| Space Complexity | Time Complexity       |
| ---------------- | --------------------- |
| $$\text{O}(1)$$  | $$\text{O}(\log{N})$$ |

## Code

```java
public static int NthRoot(int n, int m) {
    int left = 1, right = m, possibleRoot = 1;

    // Binary search to find potential nth root
    while (left <= right) {
        int mid = left + (right - left) / 2;

        long powerResult = mid;
        for (int i = 1; i < n; ++i) {
            powerResult *= mid;
        }

        if (powerResult <= m) {
            // mid is a possible root; try to find a larger one
            possibleRoot = mid;
            left = mid + 1;
        } else {
            // mid^n is too large
            right = mid - 1;
        }
    }

    // Verify if the found root actually satisfies the condition
    long finalCheck = possibleRoot;
    for (int i = 1; i < n; ++i) {
        finalCheck *= possibleRoot;
    }

    return finalCheck == m ? possibleRoot : -1;
}

```
