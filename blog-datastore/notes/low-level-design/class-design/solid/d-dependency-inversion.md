# D : Dependency Inversion

Focuses on class dependencies

> Depend on abstractions, not on concretions.

without following this principle we would depend on concretions, not on abstractions. The principle tells us to invert that direction: we should always depend on abstractions.

“Abstraction” means “taking away the details” what remains is a concept that can we can use to group all the specific things from which the abstraction has been created, and a name for what’s essential to all these specific things, ignoring the little differences.

**Making the FizzBuzz Class Open for Extension**

We write a program thats

* Generates a list of numbers from 1 to n.
* Numbers that are divisible by 3 should be replaced with Fizz.
* Numbers that are divisible by 5 should be replaced with Buzz.
* Numbers that are both divisible by 3 _and_ by 5 should be replaced with FizzBuzz.

Applying these rules, the resulting list would become:

```
1, 2, Fizz, 4, Buzz … 13, 14, FizzBuzz, 16, 17 …
```

implementation for this would be

```
class FizzBuzz
{
    public function generateList(int $limit): array
    {
        $list = [];
        for ($number = 1; $number &lt;= $limit; $number++) {
            $list[] = $this-&gt;generateElement($number);
        }
        return $list;
    }
    private function generateElement(int $number): string
    {
        if ($number % 3 === 0 && $number % 5 === 0) {
            return 'FizzBuzz';
        }
        if ($number % 3 === 0) {
            return 'Fizz';
        }
        if ($number % 5 === 0) {
            return 'Buzz';
        }
        return (string)$number;
    }
}
$fizzBuzz = new FizzBuz();
$list = $fizzBuzz->generateList(100);
```

Now It should be possible to add an extra rule _without modifying_ the FizzBuzzclass.

The FizzBuzz class is not open for extension, nor closed for modification.

* If numbers divisible by 7 should one day be replaced with Whizz, it will be impossible tochange without actually modifying the code of the FizzBuzz class.

The FizzBuzz class has two responsibilities: it generates lists of numbers, and it replaces certain numbers with something else, based on the FizzBuzz rules.

Since the `FizzBuzz` rules are liable to change, we can extract the rules into their own classes and use them in `generateElement()`

```
class FizzBuzz
{
    public function generateList(int $limit): array
    {
        // ...
    }
    private function generateElement(int $number): string
    {
        $fizzBuzzRule = new FizzBuzzRule();
        if ($fizzBuzzRule->matches($number)) {
            return $fizzBuzzRule->getReplacement();
        }
        $fizzRule = new FizzRule();
        if ($fizzRule->matches($number)) {
            return $fizzRule->getReplacement();
        }
        $buzzRule = new BuzzRule();
        if ($buzzRule->matches($number)) {
            return $buzzRule->getReplacement();
        }
        return (string)$number;
    }
}
```

the details about the rules can be found in the specific rule classes, but the rules will still represented by (very specific) class names, and adding a new rule would still require a modification of the `generateElement()` method, so we haven’t exactly made the class _open for extension_ yet.

We can remove this specificness from the `FizzBuzz` class by introducing an interface for the rule classes and allowing multiple rules to be injected into a FizzBuzzinstance.

```
interface RuleInterface
{
    public function matches($number): bool;
    public function getReplacement(): string;
}
class FizzBuzz
{
    private $rules = [];
    public function addRule(RuleInterface $rule): void
    {
        $this->rules[] = $rule;
    }
    public function generateList($limit): array
    {
        // ...
    }
    private function generateElement(int $number): string
    {
        foreach ($this->rules as $rule) {
            if ($rule->matches($number)) {
                return $rule->getReplacement();
            }
        }
        return $number;
    }
}
```

we need to make sure that every specific rule class implements the RuleInterface and then the FizzBuzz class can be used to generate lists of numbers with varying rules.

we have a highly generic piece of code, the `FizzBuzz` class, which “generates a list of numbers, replacing certain numbers with strings, based on a flexible set of rules”.

The initial implementation of the `FizzBuzz` class, had an abstract task to generate a list of numbers, only the rules were highly detailed (being divisible by 3, by 5, etc.).

* To use the words from the _Dependency Inversion_ principle: an abstraction depended on concrete things.
* This caused the FizzBuzz class to be closed for extension, as it was impossible to add another rule without modifying it.

By introducing the `RuleInterface` and adding specific rule classes that implemented this interface, we fixed the dependency direction. The `FizzBuzz` class started to depend on more abstract things, called “rules” .

_Abstractions should not depend upon details. Details should depend upon abstractions._

### Violation: A High-Level Class Depends on a Low-Level Class

* Arises from mixing different levels of abstraction.
* Every class has two levels of abstraction:
  * the first is the one perceived by clients.
    * By definition, a class or an interface is going to hide some implementation details for its client, meaning that the clients will perceive it to be more abstract, while the class internally is more concrete.
  * the second is the one that’s going on inside.
    * A class’s internals are always more concrete than the abstraction that the class represents.
* When a class depends on some other class, it should again depend on something that is abstract, not concrete. That way, the class itself becomes a client of something abstract and can safely ignore all the underlying details of how that dependency works under the hood.

Both the Single Responsibility principle and the Open/Closed principle have been violated in this class.

```
class Authentication
{
    private $connection;
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    public function checkCredentials(
        string $username,
        string $password
    ): void {
        $user = $this->connection->fetchAssoc(
            'SELECT * FROM users WHERE username = ?',
            [$username]
        );
        if ($user === null) {
            throw new InvalidCredentialsException(
                'User not found’
            );
        }
        // validate password
    }
}
```

* the class is not only concerned about the authentication mechanism itself, but also about the actual storage of the user data.
* it’s impossible to reconfigure the class to look in a different place for user data.
  * the underlying reason for these issues is that the Dependency Inversion principle has been violated too: the Authentication class itself is a high-level abstraction.
* it depends on a very low-level concretion the database connection.
* impossible for the class to fetch user data from any other place than the database.

#### Refactoring: Abstractions and Concretions Both Depend on Abstractions

* Refactoring the high-level `Authentication` class to follow the Dependency Inversion principle means first remove the dependency on the low-level Connection class.
  * add a higher-level dependency on something that provides the user data, the `UserProvider` class.
    * provide an interface `UserProviderInterface` for any class that wants to be a user provider.
      * so its easy to switch between different user provider implementations.
* the high-level class `Authentication` does not depend on low-level, concrete classes like `Connection` anymore.
  * Instead, it depends on another high-level, abstract thing `UserProviderInterface` . Both are conceptually on more or less the same level. Lower-level operations like reading from a file and fetching data from a database are performed by lower-level classes—the concrete user providers. This completely conforms to the Dependency Inversion principle, which states that: High-level modules should not depend upon low-level modules. Both should depend upon abstractions

### Simply Depending on an Interface is not enough

Adding an interface to a class is not always sufficient to fix all problems related to dependencies.\\

interface UserProviderInterface &#123;

public function findUser(string $username): array;

public function getTableName(): string;

&#125;

This is not a helpful interface at all, not all classes that implement this interface will be able to be good substitutes for it.

* If one implementation doesn’t use a database table for storing user data, it most certainly won’t be able to return a sensible value when someone calls `getTableName()` on it.
* The `UserProviderInterface` mixes different levels of abstraction and combines something high-level like “finding a user” with something low-level like “the name of a database table”.
* `UserProviderInterface` mixes different levels of abstraction and combines something high-level like “finding a user” with something low-level like “the name of a database table”.

even if we would introduce this interface to make the Authentication class depend on an abstraction instead of concretion, that goal won’t be reached. In fact, the Authentication class will still depend on something concrete and low-level: a user provider that is table-based.\\

### Violation: Vendor Lock-In

* coupling the package to a specific 3rd party implementation, makes it harder or impossible to just use the package in a project that uses a different 3rd party implementation.
* Introducing such a dependency to your package is known as “vendor lock-in”; it will only work with third-party code from a specific vendor.

#### Add an Abstraction and Remove the Dependency Using Composition

* depending on a concrete class can be problematic all by itself because it makes it hard for users to switch between implementations of that dependency.
* we should introduce our own interface, which decouples this class from any concrete event dispatcher implementation.
  * this abstraction is not framework-specific.
* fully decoupled from the framework it uses its own implementation, which is quite generic and contains the least amount of details possible.
  * by introducing the abstraction , we have cleared the way for users of other frameworks to implement their own adapter classes.
  * these adapter classes only have to conform to the public API defined by our interface.
  * under the hood they can use their own specific type of implementation

An example to use interface to decouple from 3rd part implementation

### Packages and the Dependency Inversion Principle

* The Dependency Inversion principle resonates strongly at a package level, packages themselves should also depend in the direction of abstractness

#### Depending on Third-Party Code: Is It Always Bad?

**In which cases should we allow ourselves to depend on third-party code and which cases definitely call for dependency inversion ?**

Frameworks follow the _Hollywood_ principle “Don’t call us, we’ll call you”.

To extract part of the user-land code and publish it as a package, should only take out the part of the code that isn’t coupled to the framework. \\

The remaining part of the userland code that is coupled to the framework can be extracted into a framework-specific package, often known as a “**bridge**” package.

Can start applying the Dependency Inversion principle on the framework-independent code that has been extracted to a package. Introduce interfaces and adapter code for concrete classes from libraries that the package use

The package can be used with framework X, but it should be easy to create another bridge package and make it work with framework Y too. The same goes for library A, for which an adapter is already available. It implements an interface from the package, making it easy to provide a second adapter that will make the package work with library B.

Classes that can be used as they are will be the classes that do one thing and do it well.

#### When to Publish an Explicit Interface for a Class

which classes actually need an interface, not every class needs an interface some case where we do need

**If Not All Public Methods Are Meant to be Used by Regular Clients**

* A class always has an implicit interface, consisting of all its public methods.
* An implicit interface can easily be turned into an explicit one by collecting all those public methods (except for the constructor, which should not be considered a regular method), stripping the method bodies, and copying the remaining method signatures into an interface file.

**If the Class Uses I/O**

* If a class makes call that uses I/O (the network, the filesystem, the system’s source of randomness, or the system clock), should definitely provide an interface for it.
  * In a test scenario, to replace that class with a test double will need an interface for creating that test double.

**If the Class Depends on Third-Party Code**

* If some third-party code (e.g., from a package you don’t maintain yourself) is used in class, it can be wise to isolate the integration of code with this third-party code and hide the details behind an interface.
  * Good reasons to do so are:
    * The (implicit) interface wouldn’t be how you would’ve designed it yourself.
      * You’re not sure if the package is safe to rely on.
* The advantage of this approach is that can always switch to a different library, without changing the bulk of the code.
  * Only the adapter class needs to be rewritten to use that other library.

A good old _Façade_ might be an option here too since it would hide the use of the third-party implementation.

**If You Want to Introduce an Abstraction for Multiple Specific Things**

* to treat different, specific classes in some way that is the same for every one of them, should introduce an interface that covers their common ground.
* Such an interface is often called an “abstraction,” because it abstracts away the details that don’t matter to the client of that interface

**If You Foresee That the User Wants to Replace Part of the Object Hierarchy**

* If building up a hierarchy of objects, should introduce an interface for every class.
* That way the user can replace a particular piece of logic somewhere in that hierarchy with their own logic.
* Adding an interface for collaborating objects also helps the user _decorate_ existing implementations of the interface by using object composition.

**For Everything Else: Stick to a Final Class**

* The advantage of marking a class as “final” is that subclassing is no longer an officially supported way of modifying the behavior of a class.
  * This saves from a lot of trouble later on when changing that class as a package maintainer.
*   Classes that almost never need an interface are:

    * Classes that model some concept from your domain (entities and value objects).
    * Classes that otherwise represent stateful objects (as opposed to classes that represent stateless services).
    * Classes that represent a particular piece of business logic, or a calculation.

    What these types of classes have in common is that it’s not at all needed nor desirable to swap their implementations out.
