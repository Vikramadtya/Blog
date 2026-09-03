# GCD of two numbers

The Greatest Common Divisor (GCD), or Highest Common Factor (HCF), is the largest number that divides two numbers without a remainder.

## Calculating Greatest Common Divisors <a href="#head-3-8" id="head-3-8"></a>

A naive approach to this is to iterate from all numbers between 1 to $$\text{min}(m,n)$$ and return the biggest number that divides them

```java
int gcd(int m, int n) {
	int maxDivisor = 1;
	for (int i = 1; i &lt; min(m,n); ++i) {
		if(m%i == 0 && n%i ==0) {
			maxDivisor = i;	
		}
	}
	return i;
}
```



!!! info
    The GCD is always positive irrespective of the sign of the input numbers. If the given number is negative, we will simply ignore its `-` sign using the `abs()` function

To find the GCD of two numbers using recursion, we will be using the principle $$\text{GCD}(a,b) = \text{GCD}(a,b−a)$$

&lt;figure&gt;<img src="/notes-assets/Screenshot%202024-05-03%20at%205.59.35%E2%80%AFPM.png" alt="" width="375" /&gt;<figcaption></figcaption></figure>



### Steps of the Algorithm

1. Check if `a==0`, if yes, return `b`.
2. Check if `b==0`, if yes, return `a`.
3. Check if `a==b`, if yes, return `a`.
4. Check if `a>b` if yes, call `GCD()` function using the arguments `a−b` and `b` recursively, otherwise call `GCD()` function using the arguments `a` and

#### Implementation

```java
int gcd(int a , int b) {
  if(a == 0) return b;
  if(b == 0) return a;
  return  a > b ? gcd(a-b,b) : gcd(a,b-a);
}
```

### **Complexity Analysis**

#### Time Complexity

$$\text{O}(\text{max}(a,b))$$ In this algorithm, the number of steps are linear, for e.g. $$GCD(x,1)$$ in which we will subtract $$1$$ from $$x$$ in each recursion, so the time complexity will be  $$\text{O}(\text{max}(a,b))$$

#### Space Complexity

The space complexity here is $$\text{O}(\text{max}(a,b))$$ because the space complexity in a recursive function is equal to the maximum depth of the call stack.



***

