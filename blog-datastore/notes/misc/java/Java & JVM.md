# Java/JVM architecture



## Phase 1: The Compilation Phase: Bytecode & Platform Independence

The journey begins with your `.java` file. Java uses a two-step execution process. While languages like C++ compile directly to machine code, Java compiles to an intermediate representation.

### Source to Bytecode

`javac` (the Java Compiler) converts .java files into .class files. These contain Bytecode, which is essentially an instruction set for a non-existent, virtual processor.

- **Frontend Compilation (`javac`):** The Java Compiler parses your source into an **Abstract Syntax Tree (AST)**. It performs semantic analysis (type checking, scope resolution) and generates **Bytecode**—an instruction set for a virtual, stack-based processor.
- **The Constant Pool:** The compiler creates a "Constant Pool" within the `.class` file. This is a lookup table containing literal values (strings, numbers) and symbolic references to other classes and methods. 
- **Compile-time Optimizations:** `javac` does very little optimization (e.g., constant folding) to keep the bytecode simple, deferring heavy lifting to the JIT compiler.

The Magic of Bytecode: This is the "Write Once, Run Anywhere" (WORA) layer. The bytecode is the same whether it was compiled on Mac, Windows, or Linux. The JVM is what provides the platform-specific translation.

!!! "JVM Initialization"
    When you run `java MyProgram`, the OS starts the JVM process (a C++ application). The JVM allocates its memory areas (Heap, Metaspace) and starts the **Prime Threads** (VM Thread, GC Threads).

## Phase 2: The Class Loader Subsystem (Dynamic Loading)

The JVM doesn't load all classes into memory at once. It loads them on-demand. The `ClassLoader` finds and reads the `.class` file, converting it into a `java.lang.Class` object in the **Metaspace**. Class loaders follow a strict hierarchy. When a class needs to be loaded, a loader "delegates" the request to its parent. If a class is not found in the parent, the child attempts to load it. This prevents "Class Shadowing" of core APIs.


> It uses a hierarchy (Bootstrap -> Platform -> System)

1. Bootstrap Class Loader: Loads core Java APIs (found in rt.jar or java.base module). It is written in native code (C/C++) and acts as the root.
2. Platform (Extension) Class Loader: Loads classes from standard extension directories.
3. System/Application Class Loader: Loads classes from your application's CLASSPATH.

!!! "Why delegation?"
    Security. It prevents a malicious user from "shadowing" a core class (like java.lang.Object) with a custom, compromised version, because the Bootstrap loader will always be checked first.



## Phase 3: The Linking & Initialization Process
  
  
### Linking
Once a .class file is found, it goes through three sub-steps:

#### Verification

The JVM checks if the bytecode is valid and doesn't violate security constraints (e.g., jumping to invalid memory addresses). This is why Java is "memory safe as this step ensures bytecode is safe (no stack underflows, valid jumps).

#### Preparation

Memory is allocated for static variables, and they are assigned default values (e.g., int becomes 0, boolean becomes false).

#### Resolution

Symbolic references (names of classes/methods in the bytecode) are replaced with direct memory pointers.


### Initialization

This is the final stage where static blocks are executed and static variables are assigned their actual values defined in your code.

The `&lt;clinit&gt;` method runs the variables get their **assigned** values, and static blocks execute. This is guaranteed to be thread-safe.


## Phase 4: JVM Memory Architecture (Runtime Data Areas)

The JVM divides memory based on thread ownership and data lifetime.


### Thread-Shared Areas (The Heap & Metaspace)

#### Metaspace

Stores class metadata, method structures, and the constant pool. In modern Java (8+), this is storedin **"Metaspace" (native memory)** (outside the Heap) which grows automatically to avoid OutOfMemoryError: PermGen.

!!! "warning"
    If your app uses heavy reflection or dynamic proxy generation (like Spring or Hibernate), the Metaspace can grow indefinitely, causing an OutOfMemoryError on the OS level, not the JVM level.

#### Heap

The "land of objects." where all objects live. Every object created via new lives here. It is the primary target for Garbage Collection (GC).

#### The TLAB Optimization

In a multi-threaded application, "Newing" up objects could be a bottleneck due to contention on the Heap. Small chunks of the Young Gen reserved for specific threads to allow "lock-free" object allocation.

- TLAB (Thread Local Allocation Buffer): To solve this, the JVM gives each thread its own small "buffer" inside the Eden Space.
- A thread can allocate objects in its TLAB without locking the entire Heap.
- Only when the TLAB is full does the thread synchronize with the Global Heap to get a new buffer.
  
#### Code Cache

A native memory area where the JIT compiler stores compiled machine code. f this fills up, the JIT stops compiling, and your application's performance will suddenly tank as it reverts to the slow Interpreter.

### Thread-Private Areas (The Stack)

 Every method call pushes a **Frame**:

#### JVM Stack

Each thread has its own **JVM Stack**. Every time a thread calls a method, a Stack Frame is created. It contains local variables and partial results. Once the method returns, the frame is destroyed.

#### PC (Program Counter) Register

Holds the address of the current JVM instruction being executed.

#### Native Method Stack

Used for methods written in C/C++ (accessed via JNI).

#### Operand Stack 

A LIFO workspace for executing instructions (e.g., loading two numbers to add them).


## Phase 5: The Execution Engine: Why Java is Fast

Java starts as an interpreted language but ends as a compiled one.


### Interpreter 

It reads bytecode and executes it instruction-by-instruction. It's fast to start but slow to run repeatedly.

### JIT (Just-In-Time) Compiler 

The JVM monitors your code. If a method is called frequently (a "Hot Spot"), the JIT compiles that bytecode into native machine code.

#### Tiered JIT Compilation

Modern JVMs use different levels of JIT:

- C1 Compiler: Optimized for quick startup (Client side). Compiles "hot" code quickly with basic optimizations (Inlining).
- C2 Compiler: Optimized for long-term performance and deep optimizations (Server side) for "blazing hot" code.. Performs aggressive optimizations like **Escape Analysis** (stack allocation instead of heap) and **Loop Unrolling**.

#### Deoptimization

If the JIT makes a "speculative" optimization (e.g., assuming a class will never be subclassed) and a new class is loaded that breaks that rule, the JVM discards the native code and falls back to the interpreter.\


### Code Cache 

This is where the compiled native code is stored. Subsequent calls to that "hot" method run at native speed, bypassing the interpreter entirely.



## Phase 6: Garbage Collection (GC) - The L5 Differentiator

The JVM manages memory automatically to prevent leaks and dangling pointers. Java uses a Generational Strategy

###  The Heap Deep Dive (Generational Management) 

Most objects die young. Therefore, the Heap is split into **Young Gen** (Eden + Survivor spaces) and **Old Gen**.

#### Young Generation (Eden + Survivor Spaces)

Most objects die young. GC here is frequent and fast (Minor GC).


- Eden Space: Where new objects are born.
- Survivor Spaces (S0 and S1): When Eden is full, a Minor GC occurs. Live objects are moved to one of the survivor spaces.
- The "Copying" Algorithm: Minor GC uses a "Copy" strategy. It moves live objects from Eden/S0 to S1 and wipes Eden/S0 clean. This is extremely fast because it doesn't "delete"—it just "moves and resets."

#### Old Generation

This is for long-lived objects. Objects that survive several Minor GCs (usually 15, controlled by -XX:MaxTenuringThreshold) it is "promoted" to the Old Gen. GC here is more expensive (Major/Full GC).


### Object Lifecycle

1. New objects are born in **Eden**.
2. **Minor GC:** When Eden is full, live objects move to a **Survivor** space.
3. **Promotion:** Objects that survive multiple Minor GCs move to the **Old Gen**.
4. **Major/Full GC:** Cleans the Old Gen. This is typically the most expensive operation.


### GC Roots

To determine "liveness," the GC starts from "Roots" (Stack variables, Static fields, JNI references) and traverses the object graph. Anything unreachable is reclaimed.

### Modern Collectors to mention

| GC Algorithm           | Philosophy                                                                                         | Use Case                                                     |
| :--------------------- | :------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
| **G1 (Garbage First)** | Divides heap into regions. Targets a specific pause time (e.g., "don't stop for more than 200ms"). | General purpose, balanced latency/throughput.                |
| **ZGC / Shenandoah**   | Concurrent GC. Performs almost all work while threads are running.                                 | Ultra-low latency (&lt;1ms pauses) for massive heaps (TB scale) |
| **Parallel GC**        | Uses all CPU cores to clean as fast as possible, but stops the world.                              | High-throughput batch processing where pauses don't matter.  |

#### G1 (Garbage First) - Default

Designed for large heaps with predictable pause times.

- Region-based: Instead of two giant blocks (Young/Old), G1 splits the heap into thousands of small regions.
- Predictability: It tracks which regions have the most "garbage" and clears those first to meet a user-defined pause time goal (e.g., "don't stop for more than 200ms").
- R-Sets (Remembered Sets): G1 maintains R-Sets to track references between regions so it doesn't have to scan the whole heap to find live objects.

#### ZGC (Z Garbage Collector) - Ultra-Low Latency

Ultra-low latency GC perform GC concurrently (while the application is running) to minimize "Stop-the-World" pauses.

- Colored Pointers: Uses bits in the memory address itself to track object state.
- Concurrent: Unlike G1, which has "Stop-the-World" (STW) pauses to move objects, ZGC moves objects while the application threads are still running.
- Scale: Designed for heaps ranging from 8MB to 16 Terabytes with pause times consistently under 1ms.


### Safe Points: The "Stop-the-World" Mechanism

The JVM cannot stop a thread anywhere. It must wait until the thread reaches a "Safe Point" where the object references are in a known state. The JVM places "safe point" checks in your code (usually at the end of loops or method returns).


When a GC is needed, the JVM sets a flag. When your threads reach a safe point, they check the flag and "park" themselves.

### Write Barriers

G1 and ZGC use "barriers"—tiny snippets of code injected into every object write—to track references between regions and ensure the GC knows which objects are still alive.

## Phase 6: Exit & Shutdown
A Java program doesn't just "stop." It follows a teardown protocol.

1.  **Termination Triggers:**
    * All non-daemon threads finish (the `main` thread is non-daemon).
    * `System.exit()` is called.
    * The OS sends a signal (SIGTERM).
2.  **Shutdown Hooks:** The JVM executes any threads registered via `Runtime.getRuntime().addShutdownHook()`. Use these for cleaning up file handles or closing network sockets.
3.  **Finalization:** (Deprecated) The JVM used to run `finalize()` methods, but this is now avoided due to unpredictability. Use `try-with-resources` (AutoCloseable) instead.
4.  **Native Resource Release:** The JVM returns allocated memory to the OS and exits with a status code (0 for success).