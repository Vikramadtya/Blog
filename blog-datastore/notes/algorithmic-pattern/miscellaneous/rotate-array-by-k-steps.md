# Rotate array by K steps

## Simplify Rotation Amount

For an array of sized $$n$$ instead of doing $$K$$ rotation&#x20;

$$
K = n + n + n + ... + x
$$

we can simply do $$K\%n$$ rotation

$$
x = K\%n
$$

If we rotate $$K$$steps to right we need to start reading the rotated array from the last $$K\%n$$elements.

If we rotate $$K$$steps to left we need to start reading the rotated array after skipping $$K\%n$$elements from start





## Rotation



### Complexity

* **Time complexity** : $$\text{O}(n)$$
  * We iterate the whole array only once
* **Space complexity** : $$\text{O}(1)$$
  * No extra space is needed

### Code

```java
public void rotate(int[] nums, int k) { 
	k %= nums.length; 
	reverse(nums, 0, nums.length - 1); 
	reverse(nums, 0, k - 1); 
	reverse(nums, k, nums.length - 1); 
}

public void reverse(int[] nums, int start, int end) { 
	while (start < end) { 
		int temp = nums[start]; 
		nums[start] = nums[end]; 
		nums[end] = temp; 
		start++; 
		end--; 
	} 
}
```









