# L : The Liskov Substitution Principle

_Derived classes must be substitutable for their base classes._

* A _derived class_ is a class that extends some other class: the _base class_.
* The Liskov Substitution principle says that if we create a class that extends another class or implements an interface, it has to behave as expected.
* Pointing out violations of the _Liskov Substitution_ principle can be pretty hard due to the vague “behaving as expected”
* We can point out some general bad practices that can prevent classes from being good substitutes for their parent classes or from being good implementations of an interface.

### Violation: A Derived Class Does Not Have an Implementation for All Methods

* a class does not have a proper implementation for all the methods of its parent class (or its interface for that matter), this results in a clear violation of the _Liskov Substitution_ principle.
* It is bad behavior of substitutes to not do everything they are _supposed_ to do.

```java
interface FileInterface
{
    public void rename(String name);
    public void changeOwner(String user, String group);
}

class DropboxFile implements FileInterface
{
    public void rename(String name) {
        // ...
    }
    public void changeOwner(String user, String group) {
        throw new BadMethodCallException(
            'Not implemented for Dropbox files'
        );
    }
}
```

* If for some reason changing the owner is not possible for a given type of file, it should be clear by its contract.
  * its interface should not offer a method that makes it seem like this is possible.
* &lt;mark style="background-color:yellow;"&gt;The best solution would be to split the interface&lt;/mark&gt;

```java
interface FileInterface {
    public void rename(String name);
}

interface FileWithOwnerInterface extends FileInterface {
    public void changeOwner(String user, String group);
}

class DropboxFile implements FileInterface
{
    public void rename(String name)
    {
        // ...
    }
}
```

* All the derived classes (`DropboxFile` and `LocalFile`) behave well as substitutes for their base classes (`FileInterface` and `FileWithOwnerInterface`) , and all of the methods of the base classes are properly implemented in the derived classes.

**Leaky Abstraction**

> _All non-trivial abstractions, to some degree, are leaky._

* We want to treat a specific thing as a more general thing.
* Doing this consistently, we can later fearlessly replace any specific thing with some other specific thing.
  * The system will not break because every part of it depends only on abstract things and doesn't care about the specifics.
* The problem with most (all?) abstractions, as the _Law of_ _Leaky Abstractions_ states, is that they are _leaky_, which means that it will never be possible to abstract away every underlying specificness.
  * Some underlying detail is bound to pop up and get in our way.
* &lt;mark style="background-color:yellow;"&gt;Just make sure the abstraction serves the purpose, and don’t try to fit every possible specific thing in the world into abstraction&lt;/mark&gt;\\

> _Essentially, all models are wrong, but some are useful._

### Violation: Different Substitutes Return Things of Different Types

* This violation applies in particular to programming languages that are not strictly typed.
  * If a programming language has no way to pin down the type of the return value of a method, a common solution is to mention it inside the docblock of the method.
* The solution to the problem is to define the type of the return value more strictly and to not allow for accidental deviations from the expected type.
* Interfaces and abstract classes should always document their return values in a strict way, using specific types

**More Specific Return Types Are Allowed**

* The Liskov Substitution principle does not allow for wrong or unspecific return types. Still, derived classes are allowed to return values that are a subtype of the type prescribed by the base class.

### Violation: A Derived Class Is Less Permissive with Regard to Method Arguments

* When it comes to method arguments, a substitute needs to be equally or more permissive than the contract defines.

```java
interface MassMailerInterface
{
    public void sendMail(TransportInterface $ransport, Message $message, Recipients $recipients);
}

class SmtpMassMailer implements MassMailerInterface
{
    public void sendMail(TransportInterface transport, Message message, Recipients recipients ) {
        if (!($transport instanceof SmtpTransport)) {
            throw new InvalidArgumentException(
                'SmtpMassMailer only works with SMTP'
            );
        }
        // ...
    }
}
```

* By restricting the set of allowed arguments—from all instances of TransportInterface to only instances of SmtpTransport—the SmtpMassMailer violates the _Liskov Substitution_ principle.
  * As a substitute of the base class MassMailerInterface, it’s supposed to work with _any_ mail transport, as long as it’s an object of type TransportInterface.
* The only way to fix this is to make sure that the contract of the base class reflects the needs of derived classes in a better way

Whenever we reason about class design like this, we need to keep an eye on phrases like: not every … is a … not every … can be used as a … They usually indicate that there is something wrong with the type hierarchy of our classes.

* Redefining our class hierarchy, we might define a generic `TransportInterface` and one specialized `TransportWithMassMailSupportInterface` that extends `TransportInterface`
* we can change the expected type of the `transport` argument to `TransportWithMassMailSupportInterface` to prevent the wrong type of transport from being provided to the `sendMail()` method
* Depending on the particular situation, it may not be justifiable to introduce this extra layer of abstraction. Maybe you are trying to redefine things in an abstract way but they are really just concrete things. Or maybe you are trying to find similarities that can’t be found because they don’t exist.

### Violation: Secretly Programming Against a More Specific Type

* Base classes like interfaces are used to expose an explicit public API.
* Sometimes derived classes have additional public methods these methods constitute its implicit public API.

```
interface HttpKernelInterface
{
    public Response handle(Request request);
}
class HttpKernel implements HttpKernelInterface
{
    public Response handle(Request $request){ .... }
    public String getEnvironment(){ .... }
}

```

* The `getEnvironment()` method is not defined in `HttpKernelInterface` so to use this method, have to explicitly depend on the `HttpKernel` class.

```
class CachedHttpKernel implements HttpKernelInterface
{
    public function __construct(HttpKernelInterface $kernel)
    {
        if ($kernel->getEnvironment() === 'dev') {
            // ...
        }
    }
    // ...
}
```

* The `CachedKernel` pretends to be part of a hierarchy of substitutable classes, while in fact it isn’t. It breaks the tradition of implementing and requiring just the `handle()` method of `KernelInterface` and thereby it violates the Liskov Substitution principle.
* The solution to this problem is to be more careful about respecting the contracts of the base class Or we could split the interface, so we can require more specific types of objects.

```
interface HttpKernelInterface
{
    public function handle(Request $request): Response;
}
interface HttpKernelWithEnvInterface
    extends HttpKernelInterface
{
    public function getEnvironment(): string;
}
class CachedHttpKernel implements HttpKernelInterface
{
    public function __construct(
        HttpKernelWithEnvironmentInterface $kernel
    ) {
        // ...
    }
}
```

### Packages and the Liskov Substitution Principle

* The Liskov Substitution principle is relevant in two ways:
  * when package defines an interface (or base class)
  * when package provides an implementation of some interface (or base class), potentially one from a different package.
* When providing a new interface, ensure it makes sense for a user to provide alternative implementations, which can still be proper substitutes for that interface.
  * That is, get your abstractions right and don’t force users to implement methods that don’t make sense in _their_ context.
* Make it easier for implementers to write good substitutes for the interface introduced by being specific about the types of arguments and return values.
  * This is particularly true when the programming language’s built-in types aren’t useful or specific enough, or if it doesn’t even support proper typing at all levels.
* If package contains a class that implements some interface, make sure this class adheres to the contract communicated by that interface and its accompanying documentation.
* always consider the option not to provide an interface or base class for the user to implement or derive from.
  * It may reduce the flexibility or extensibility of your package, but it will also make your package more opinionated.
  * This often has the effect of making the package easier to understand and work with.
  * Some things shouldn’t be replaced by users
