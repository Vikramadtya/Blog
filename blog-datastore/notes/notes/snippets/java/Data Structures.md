# Data Structures

## Queue
To create a queue 

```java
Queue&lt;object_type&gt; queue = new LinkedList<>();
```

to insert an element 

```java
queue.add(object);
```

to see the head

```java
queue.peek();
```

to remove the head 

```java
object_type object = queue.poll();
```

## Stack

To create a stack 

```java
Stack&lt;object_type&gt; stack = new Stack<>();
```

to insert an element

```java
stack.push(object);
```

to remove an element on top

```java
object_type object = stack.pop();
```

to see the top of the stack

```java
object_type object = stack.peek();
```

## Heap

The PriorityQueue is based on the Priority Heap

```java
// Priority Queue Min Type by deafault
PriorityQueue&lt;object_type&gt; heap = new PriorityQueue<>();

// Priority Queue Max Type use comparator 
PriorityQueue&lt;object_type&gt; heap = new PriorityQueue<>(Collections.reverseOrder());
```

to add an element

```java
heap.add(o);
```

to see the top of the queue

```java
object_type o = heap.peek();
```

to remove the top element

```java
object_type o = heap.poll();
```

to remove object o  from the queue

```java
object_type o = heap.remove(o);
```