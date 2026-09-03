# Randomising Data

* _Randomization_ plays an important role in many applications.
* First step in any randomized algorithm is generating random numbers.

## Generating Random Values <a href="#head-3-4" id="head-3-4"></a>

* because _true random-number generators_ (TRNGs) are relatively complicated and slow, most applications use a faster _pseudorandom number generator_ (PRNG) instead.
  * for many applications, if the numbers are in some sense “random enough,” a program can still make use of them and get good results.

!!! info
    To get truly unpredictable randomness,  need to use a source other than a computer program.
    
    For example, use a radiation detector that measures particles coming out of a radioactive sample to generate random numbers. Because no one can predict exactly when the particles will emerge, this is truly random.



* common method of creating pseudorandom numbers is a _linear congruential generator_, which uses the following relationship to generate numbers, in which $$\text{A,B}$$ and $$\text{M}$$ are constants.

$$
X_{n+1} = ( A *  X_n + B)\text{Mod M}
$$

* The value $$X_{0}$$initializes the generator so that different values for $$X_{0}$$ produce different sequences of numbers.
* $$\text{A}$$ value that is used to initialise the pseudorandom number generator, such as $$X_{0}$$ in this case, is called the _seed_.
* Because all the values in the number sequence are taken modulo $$\text{A}$$ , after at most M numbers, the generator produces a number it produced before, and the sequence of numbers repeats from that point.
* Some PRNG algorithms use multiple linear congruential generators with different constants and then select from among the values generated at each step to make the numbers seem more random and to increase the sequence's repeat period.
* Using a particular seed value to generate the same sequence of “random” values repeatedly can make some programs much easier to debug.
* Being able to repeat sequences of numbers also lets some applications store complex data in a very compact form.



!!! info
    * Any linear congruential generator has a period over which it repeats making it unusable for cryptographic purposes.
    * A _cryptographically secure pseudorandom number generator_ (CSPRNG) uses more complicated algorithms to generate numbers that are harder to predict and to produce much longer sequences without entering a loop.&#x20;
      * They typically have much larger seed values.
      * They are complicated so slower than simpler algorithms.

_**Ensuring Fairness**_

* programs need to use a fair PRNG.&#x20;
* A _fair PRNG_ is one that produces all of its possible outputs with the same probability.
*   To transform the PRNG's values into a specific range, be careful to do so in a fair way.

    * programming languages have methods that produce random numbers within any desired range.&#x20;
    * better approach is to convert the value produced by the PRNG into a fraction between 0 and 1 and then multiply that by the desired range

    \


    <figure><img src="/notes-assets/c02-disp-0006.png" alt="" /><figcaption></figcaption></figure>



    * Another method of converting from one range to another is simply to ignore any results that fall outside the desired range.



#### Randomizing Arrays <a href="#head-3-5" id="head-3-5"></a>

* following algorithm shows one way to randomise an array, it has a run time of $$\text{O}(n)$$
  * repeating this algorithm does not make the array “more random.”

```
RandomizeArray(String: array[])
    Integer: max_i = &lt;Upper bound of array&gt;
    For i = 0 To max_i - 1
        // Pick the item for position i in the array.
        Integer: j = &lt;random number between i and max_i&gt;
        &lt;Swap array[i] and array[j]&gt;
    Next i
```

!!! danger
    A task similar to randomizing an array is picking a certain number of random items from an array without duplication
    
    * Can use the _linear congruential generator to get the indices_
    * Iterate over the array and select based on the random fraction generated $$\gt\ 0.5$$



### Making Random Walks <a href="#head-3-7" id="head-3-7"></a>

* a _random walk_ is a path generated at random.&#x20;
* Usually the path consists of steps with a fixed length that move the path along some sort of lattice, such as a rectangular or hexagonal grid.

```
Point[]: MakeWalk(Integer: num_points)
    Integer: x = &lt;X coordinate of starting point&gt;
    Integer: y = &lt;Y coordinate of starting point&gt;
    List Of Point: points
    points.Add(x, y)
    For i = 1 To num_points – 1
        direction = random(0, 3)
        If (direction == 0) Then        // Up
            y -= step_size
        Else If (direction == 1) Then   // Right
            x += step_size
        Else If (direction == 2) Then   // Down
            y += step_size
        Else                            // Left
            x -= step_size
        End If
 
        points.Add(x, y)
    Next i
 
    Return points
End MakeWalk 
```

_**Making Self-Avoiding Walks**_

* &#x20;is also called a _non-self-intersecting walk_, is a random walk that is not allowed to intersect itself.&#x20;
  * the walk continues on a finite lattice until no more moves are possible.
* algorithm is similar to the one used to build a random walk, except it only allows the walk to move to unvisited lattice points

```
Point[]: SelfAvoidingWalk(Integer: num_points)
    Integer: x = &lt;X coordinate of starting point&gt;
    Integer: y = &lt;Y coordinate of starting point&gt;
 
    List Of Point: points
    Points.Add(x, y)
 
    For i = 1 To num_points – 1
        List Of Point: neighbors = &lt;unvisited neighbors of (x, y)&gt;
        If (neighbors Is Empty) Then Return points
        &lt;Move to a random unvisited neighboring point&gt;
    Next i
 
    Return points
End SelfAvoidingWalk 
```

* At each step, the algorithm makes a list of the points that are neighbors to the walk's most recent point.&#x20;
* If the neighbor list is empty, then the walk cannot continue, so the method returns the walk so far.&#x20;
* If the neighbor list is not empty, the algorithm moves to a random neighbor and continues.



_**Making Complete Self-Avoiding Walks**_

* A _complete random self-avoiding walk_ is a walk that visits every node in a finite lattice.
* Depending on the size of the lattice and the starting point, it may be impossible to find a complete self-avoiding walk.
* Trickier than building any old random walk because many paths lead to dead ends where the walk cannot be extended.
* To avoid getting stuck in a dead end, the algorithm must be able to unwind bad decisions.
  * able to undo previous moves so that it can return to a state where a complete walk is possible.
