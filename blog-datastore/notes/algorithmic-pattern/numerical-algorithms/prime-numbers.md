# Prime Numbers

A _prime number_ (or simply _prime_) is a counting number (an integer greater than 0) greater than 1 whose only factors are 1 and itself.&#x20;



## Finding Prime Factors

An obvious way to find a number's prime factors is to try dividing the number by all of the numbers between 2 and 1 less than the number. When a possible factor divides the number evenly, save the factor, divide the number by it, and continue trying more possible factors.



```java
List&lt;Integer&gt; findFactors(int num) {
    List&lt;Integer&gt; factors = new ArrayList<>();
    
    // check for 2
    if(num%2 == 0) {
        factors.add(2);
        while(num%2 == 0) num/= 2;
    }
    
    int upperBound = Maths.sqrt(num);
    
    // only check for odd numbers
    for (int i = 3; i &lt; upperBound; ) {
        if(num%i == 0){
            factors.add(i);
            while(num%i == 0) num/=i;
            upperBound = Maths.sqrt(num);
        }
        i+=2;
    }
    
    // If there's anything left of the number, it is a factor, too.
    if(num &gt; 1) factors.add(num)
    return factors;
}
```

Try the same factor again before moving on in case the number contains more than one copy of the factor.



Some optimisation

* don't need to test whether the number is divisible by any even number other than 2 because, if it is divisible by any even number, it is also divisible by 2.
* only need to check for factors up to the square root of the number.&#x20;
  * if $$n=p*q$$ , then either $$p$$ or $$q$$must be less than or equal to $$\sqrt{n}$$. (If both are greater than $$\sqrt{n}$$ , then their product is greater than $$n$$.
*   Every time dividing the number by a factor, update the upper bound on the possible factors that need to be checked.



This prime factoring algorithm has run time $$\text{O}(\sqrt{n})$$



!!! info
    The method of trying all the possible factors smaller than a number is called _trial division_. There are other factoring methods, such as _wheel factorization_ and various field sieves.



## Finding Primes <a href="#head-3-11" id="head-3-11"></a>

The _sieve of Eratosthenes_ is a simple method to find all of the primes up to a given limit.



Idea is to make a table with one entry for each of the numbers between 2 and the upper limit.&#x20;

* Cross out all of the multiples of 2 (not counting 2 itself).&#x20;
* Then, starting at 2, look through the table to find the next number that is not crossed out (3 in this case).&#x20;
* Cross out all multiples of that value (not counting the value itself).&#x20;
  * Note that some of the values may already be crossed out because they were also a multiple of 2.&#x20;
* Repeat this step, finding the next value that is not crossed out and crossing out its multiples until you reach the square root of the upper limit.&#x20;
* At the end any numbers that are not crossed out are prime.

This algorithm has run time $$\text{O}(n*\log{(\log{n}))}$$ , but that is beyond the scope of this book.

It requires a table with entries for every number that is considered. Therefore uses an unreasonable amount of memory if the numbers are too large.



## Testing for Primality

A way to determine whether a number is prime is to use finding prime factors algorithm to try to factor it and if the algorithm doesn't find any factors, then the number is prime.



Fermat's “little theorem” states that if $$p$$ is prime and $$1 \le n \le p$$, then $$n^{p-1}\%p = 1$$&#x20;

* it is possible for $$n^{p-1}\%p = 1$$ , even if $$p$$ is not prime in such case, the value $$n$$ is called a _Fermat liar_ because it incorrectly implies that $$p$$ is prime.
* If $$n^{p-1}\%p = 1$$, then n is called a _Fermat witness_ because it proves that $$p$$ is not prime.

for a natural number , at least half of the numbers between 1 and $$p$$ are Fermat witnesses. On repeating the test many times, can increase the chances to pick a witness if one exists.

* there is a 50% chance to pick a Fermat wintess.
* So, if $$p$$ passes $$k$$ tests, there is a chance of picking Fermat liars every time. In other words, there is a $$\frac{1}{2^{k}}$$ chance that it is actually a composite number pretending to be prime.



!!! info
    This is an example of a probabilistic algorithm—one that produces a correct result with a certain probability.





