---
tags:
  - arrays
  - binary-search
  - two-pointers
  - master-guide
---

# The Rotated Sorted Array Master Guide

## Core Invariant: The "One Pivot" Rule

When a sorted array is rotated, it is cut into two pieces that are swapped. This creates a strict mathematical invariant: **There is exactly one "drop-off" (pivot) where the values reset from high to low.** Because there is only one drop-off, **if you cut the array in half at any `mid` point, at least one of those halves is mathematically guaranteed to be perfectly sorted.** We call this perfectly sorted half the **Safe Zone**.

### The Decision Matrix (Cheat Sheet)

The entire difficulty of rotated arrays is knowing which boundary to compare `mid` against. Memorize this table:

| Goal | What you are looking for | Comparison | Logic |
| :--- | :--- | :--- | :--- |
| **Search Target** | The **Safe Zone** (to check if target fits inside) | `mid` vs `left` | Is the left half perfectly sorted? |
| **Find Minimum** | The **Drop-off** (the rotation pivot) | `mid` vs `right` | Does the right half contain the drop-off? |

---

## Pattern 1: Search in Rotated Array (Finding a Target)

**The Intuition:** You cannot check if a target exists in a broken array. You must first use `nums[left] &lt;= nums[mid]` to identify the perfectly sorted Safe Zone. Once found, check if the target fits mathematically within its boundaries. If it does, discard the broken half. If it doesn't, discard the Safe Zone.

| Time Complexity | Space Complexity |
| :--- | :--- |
| $O(\log N)$ | $O(1)$ |

```java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        // 1. Identify the Safe Zone
        if (nums[left] <= nums[mid]) { 
            // Left is Safe
            if (target &gt;= nums[left] && target &lt; nums[mid]) {
                right = mid - 1; // Target is here
            } else {
                left = mid + 1;  // Target is in the broken right half
            }
        } else { 
            // Right is Safe
            if (target &gt; nums[mid] && target &lt;= nums[right]) {
                left = mid + 1;  // Target is here
            } else {
                right = mid - 1; // Target is in the broken left half
            }
        }
    }
    return -1;
}
```

---

## Pattern 2: Find Minimum (Finding the Pivot / Rotation Count)

**The Intuition:** The minimum element is the drop-off point. We compare `mid` to `right` to see if the drop-off happened in the right half. If `nums[mid] &gt; nums[right]`, the drop-off *must* be to the right. If `nums[mid] &lt;= nums[right]`, the right side is perfectly sorted, meaning the minimum is `mid` or somewhere to the left. 
*(Note: The index of the minimum element is exactly equal to the number of right-rotations).*

| Time Complexity | Space Complexity |
| :--- | :--- |
| $O(\log N)$ | $O(1)$ |

```java
public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    
    // Strict `<` to converge on a single element
    while (left < right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] &gt; nums[right]) {
            // Drop-off is to the right
            left = mid + 1;
        } else {
            // Right is sorted; minimum is at mid or to the left
            right = mid;
        }
    }
    return nums[left];
}
```

---

## Pattern 3: The Duplicate Trap (Binary Search Degradation)

**The Intuition:** If the array allows duplicates, you can encounter a state where `nums[left] == nums[mid] == nums[right]`. This mathematically destroys your ability to locate the drop-off or the Safe Zone. You resolve the ambiguity by slowly squeezing the edges (`left++`, `right--`) until the mathematical structure reveals itself.

| Time Complexity | Space Complexity |
| :--- | :--- |
| Average: $O(\log N)$, Worst: $O(N)$ | $O(1)$ |

```java
// Insert this block inside your while loop, right after checking if mid == target
if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
    left++;
    right--;
    continue; // Skip the rest of the logic and recalculate mid
}
```

---

## Pattern 4: The Reversal Algorithm (In-Place Rotation)

**The Intuition:** Shifting an array of size $N$ by $k$ steps in $O(1)$ space requires a math trick. Reversing the entire array moves the back elements to the front, but upside down. Reversing the front chunk ($0$ to $k-1$) and the back chunk ($k$ to $N-1$) independently fixes their internal order.

| Time Complexity | Space Complexity |
| :--- | :--- |
| $O(N)$ | $O(1)$ |

```java
public void rotate(int[] nums, int k) {
    k = k % nums.length; // Normalize k
    reverse(nums, 0, nums.length - 1); // 1. Reverse all
    reverse(nums, 0, k - 1);           // 2. Reverse first k
    reverse(nums, k, nums.length - 1); // 3. Reverse the rest
}

private void reverse(int[] nums, int start, int end) {
    while (start &lt; end) {
        int temp = nums[start];
        nums[start++] = nums[end];
        nums[end--] = temp;
    }
}
```

---

## Pattern 5: Validation (Counting Drop-offs)

**The Intuition:** A perfectly sorted array has $0$ drop-offs. A valid rotated sorted array has exactly $1$ drop-off (the pivot). If an array has more than $1$ drop-off, it was never a valid sorted array. Because the array is a conceptual circle, you must also compare the very last element to the very first element using modulo arithmetic.

| Time Complexity | Space Complexity |
| :--- | :--- |
| $O(N)$ | $O(1)$ |

```java
public boolean check(int[] nums) {
    int dropOffs = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        // (i + 1) % n loops the end of the array back to the start
        if (nums[i] &gt; nums[(i + 1) % n]) {
            dropOffs++;
        }
    }
    
    return dropOffs <= 1; 
}
```

## Caveats & Common Mistakes

- **Comparing `mid` to `left` for Minimums:** Never do this. It fails on 0-rotated (perfectly sorted) arrays. `nums[left] <= nums[mid]` is true for `[1,2,3]`, which falsely implies you should search the right half, skipping the minimum `1`. Always compare `mid` to `right` when finding the pivot.
- **The `=` Operator Trap:** In `nums[left] <= nums[mid]`, the equals sign is mandatory. When the window shrinks to size 2, integer division makes `mid` equal to `left`. If you use `<` instead of `<=`, the logic falsely assumes the left side is broken, causing failures.
- **Target Search Loop Boundary:** When searching for a target, use `while (left <= right)` so you can evaluate a window of size 1. When finding the minimum, use `while (left < right)` to gracefully converge the pointers exactly onto the pivot without an infinite loop.