# 189. Rotate Array (Approach 1 )

## Intitution

To rotate an array to the right by `k` steps, we essentially want to **move each element `k` positions to the right**, with the elements at the end wrapping around to the beginning.

A neat trick is to **simulate a circular array**:

* If we **duplicate the original array**, appending it to itself, we create a structure that behaves like an infinite loop of the array.
* Then, to get the rotated version, we can just extract a **subarray of length `n`** (original length) starting from the right offset.

This avoids doing complicated index arithmetic or multiple reversals.



## Complexity

| Space Complexity | Time Complexity |
| ---------------- | --------------- |
| $$\text{O}(n)$$  | $$\text{O}(n)$$ |



## Code

```java
public void rotate(int[] nums, int k) {
    k = k % nums.length; // Handle cases where k >= nums.length

    if (k == 0) return; // No need to rotate

    // Step 1: Duplicate the array (simulate circular behavior)
    int[] numsDuplicated = new int[2 * nums.length];
    for (int i = 0; i < nums.length; ++i) {
        numsDuplicated[i] = nums[i];
        numsDuplicated[nums.length + i] = nums[i]; // Append the same array
    }

    // Step 2: Copy the rotated portion back into the original array
    for (int i = 0; i < nums.length; ++i) {
        nums[i] = numsDuplicated[nums.length - k + i];
    }
}
```



