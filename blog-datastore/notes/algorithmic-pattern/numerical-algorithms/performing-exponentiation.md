# Performing Exponentiation

Method is based on the fact that can quickly calculate powers of a number that are themselves powers of 2.

$$
A^8 = A^4*A^4 \\ A^4 = A^2*A^2
$$



## Fast Modulo Multiplication

For two numbers **base** and **exp**, to compute $$\text{base}^{\text{exp}}$$ under Modulo $$10^9+7$$&#x20;

```java
static long exponentiation(long base, long exp) {
    long t = 1L;
    while (exp > 0) {

        // for cases where exponent
        // is not an even value
        if (exp % 2 != 0)
            t = (t * base) % N;

        base = (base * base) % N;
        exp /= 2;
    }
    return t % N;
}
```

* **Time Complexity =** $$\text{O}(\log{exp})$$
* **Space Complexity =** $$\text{O}(1)$$

## Bit-Manipulation Method

The basis for the fast exponentiation algorithm is to build bigger and bigger powers of A and use the binary digits of the exponent to decide which of those should be multiplied into the final result.



The steps of the algorithm are as follows&#x20;

1. Initialize a result variable to 1, and a base variable to the given base value.    &#x20;
2. Iterate over the bits of the binary representation of the exponent, from right to left.&#x20;
   1. For each bit, square the current value of the base.
   2. If the current bit is 1, multiply the result variable by the current value of the base.
   3. Continue the iteration until all bits of the exponent have been processed.

&#x20; 3\. Return the result variable modulo the given modulus value.



One limitation of this algorithm is that values raised to large powers grow extremely large.&#x20;

Reducing each number with the modulus makes each step slightly slower, but can calculate values of practically unlimited size.









\


