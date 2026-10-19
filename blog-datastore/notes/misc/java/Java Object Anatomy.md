# Java Object Anatomy: What lives in Memory?

## The Object Header

Every Java object has a header consisting of:

- Mark Word (8 bytes on 64-bit): Stores the hashcode, GC age (for generational moving), and lock information (biased locking, etc.).
- Klass Pointer (4-8 bytes): A pointer to the class metadata in the Metaspace.
- Array Length (4 bytes): Only present if the object is an array.

### Memory Alignment (Padding)

The JVM aligns objects to 8-byte boundaries. If an object’s data is 21 bytes, the JVM adds 3 bytes of "padding" to make it 24.

!!! "info"
    This is why choosing primitive types over boxed types (e.g., int vs Integer) saves massive amounts of memory in high-throughput systems—it avoids the header and padding overhead.