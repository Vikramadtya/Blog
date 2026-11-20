# Java Utility Method

## Collections
Java provides the Collections utility class for common operations.

```
Collections.sort(list);
Collections.reverse(list);
Collections.max(list);
Collections.min(list);
Collections.frequency(list, value);
Collections.max(list);                   // Maximum element
Collections.min(list);                   // Minimum element
Collections.swap(list, i, j);             // Swap elements
```

## Arrays
For arrays, use Arrays:

```
Arrays.sort(arr);
Arrays.binarySearch(arr, target);
Arrays.fill(dp, -1);
```

For immutable or fixed-size collections:
- `Arrays.asList()` returns a fixed-size list backed by the array.
- `List.of()` returns an unmodifiable list.

```
List<Integer> fixed = Arrays.asList(1, 2, 3);
List<Integer> immutable = List.of(1, 2, 3);
```

## StringBuilder	
Efficient string construction

```java
StringBuilder sb = new StringBuilder();
sb.append("hello");             // Append string
sb.insert(0, "Hi ");            // Insert at index
sb.delete(0, 2);                // Delete range [start, end)
sb.deleteCharAt(0);             // Delete character
sb.reverse();                   // Reverse string
sb.charAt(0);                   // Get character
sb.setCharAt(0, 'H');           // Modify character
sb.setLength(0);                // Clear builder
sb.toString();                  // Convert to String
```

## Math
Common mathematical utility methods.

```java
Math.max(a, b);                 // Maximum
Math.min(a, b);                 // Minimum
Math.abs(x);                    // Absolute value
Math.pow(a, b);                 // Power
Math.sqrt(x);                   // Square root
Math.ceil(x);                   // Round up
Math.floor(x);                  // Round down
Math.round(x);                  // Round to nearest integer
Math.log(x);                    // Natural logarithm
Math.random();                  // Random double in [0.0, 1.0)
```



## String
Common string operations.

```
str.length();                   // Length
str.charAt(i);                  // Character at index
str.substring(start, end);      // Substring [start, end)
str.contains("abc");             // Check substring
str.equals(other);              // Compare content
str.equalsIgnoreCase(other);    // Case-insensitive comparison
str.compareTo(other);           // Lexicographical comparison
str.toCharArray();              // Convert to char array
str.toLowerCase();              // Lowercase
str.toUpperCase();              // Uppercase
str.trim();                     // Remove leading/trailing <= U+0020
str.split(",");                 // Split by regex
String.join(",", list);         // Join strings
String.valueOf(value);          // Convert value to String
```


## Map
Common HashMap operations.

```
map.put(key, value);            // Insert/update
map.get(key);                   // Get value (null if absent)
map.getOrDefault(key, 0);       // Get with default
map.containsKey(key);           // Check key
map.containsValue(value);       // Check value
map.putIfAbsent(key, value);    // Insert only if absent
map.remove(key);                // Remove key
map.size();                     // Number of entries
map.isEmpty();                  // Check empty
map.keySet();                   // All keys
map.values();                   // All values
map.entrySet();                 // All key-value pairs
map.merge(key, 1, Integer::sum);// Increment frequency
map.computeIfAbsent(key, k -> new ArrayList<>()); // Initialize if absent
```

## Set
Common HashSet operations.

```
set.add(value);                 // Add element
set.remove(value);              // Remove element
set.contains(value);            // Check existence
set.size();                     // Number of elements
set.isEmpty();                  // Check empty
set.addAll(other);              // Union
set.retainAll(other);           // Intersection
set.removeAll(other);           // Difference
```

## Comparator

Useful for custom sorting.

```java
list.sort(Comparator.comparingInt((Person p) -> p.age)
                    .thenComparing(p -> p.name));
```

## Bit Manipulation

Common bitwise operations.

```java
Integer.bitCount(n);            // Count set bits
Integer.numberOfLeadingZeros(n);// Leading zeros
Integer.numberOfTrailingZeros(n);// Trailing zeros
Integer.highestOneBit(n);       // Highest set bit
Integer.lowestOneBit(n);        // Lowest set bit
Integer.toBinaryString(n);      // Binary representation
```

## Character
Useful character checks and conversions.

```java
Character.isDigit(c);           // Check digit
Character.isLetter(c);          // Check letter
Character.isLetterOrDigit(c);   // Check alphanumeric
Character.isUpperCase(c);       // Check uppercase
Character.isLowerCase(c);       // Check lowercase
Character.toLowerCase(c);       // Convert to lowercase
Character.toUpperCase(c);       // Convert to uppercase
```