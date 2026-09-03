# I : The Interface Segregation Principle

Make fine-grained interfaces that are client specific.

* “Fine-grained interfaces” stands for interfaces with a small amount of methods.
* “Client specific” means that interfaces should define methods that make sense from the point of view of the client that uses the interface.
* applying the _Interface Segregation_ principle has several advantages.
  * it will lead to smaller interfaces, which are relevant for a subset of all the clients.
  * an interface that needs to change less frequently is much preferable, since it will make it easier to maintain backward compatibility.

### Violation: Multiple Use Cases

* Sometimes the interface of a class contains too many methods because it serves multiple use cases.
  * Some clients of the object will call a different set of methods than other clients of the same object.
* Every existing _service container_ implementation serves as a great example of a class that has different clients, since many service containers are used both as a dependency injection (or inversion of control) container _and_ as a service locator.

```
interface ServiceContainerInterface
{
    public function get(string $name);
    public function set(string $name, callable $factory): void;
}

// $serviceContainer is an instance of ServiceContainerInterface
// configure the mailer service
$serviceContainer->set(
    'mailer',
    function () use ($serviceContainer) {
        return new Mailer(
            // a mailer needs a transport
            $serviceContainer->get('mailer.transport')
        );
    }
);

$mailer = $serviceContainer->get('mailer');
```

The creation logic is all handled by the dependency injection container. This is why such a container is often called an _Inversion of Control (IoC) container_ .

* any client that depends on `ServiceContainerInterface` can both _fetch_ previously defined services and _define_ new services.
* Most clients of `ServiceContainerInterface` only perform one of these tasks. A client either
  * configures the service container (for example, when the application is bootstrapped)
  * fetches a service from it (when the application is up and running).

#### Refactoring: Separate Interfaces and Multiple Inheritance

* The difference between clients should be reflected in the interfaces that are available;
* For instance, by splitting the interface into a `MutableServiceContainerInterface` and a `ServiceLocatorInterface`
  * one is for the part of the application that bootstraps the service container by configuring the available services.
  * other is for client that fetches a service to process a request.

```
interface MutableServiceContainerInterface
{
    public function set(string $name, callable $factory): void;
}
interface ServiceLocatorInterface
{
    public function get(string $name): object;
}
```

* each client can require its own appropriate type of service container.
* There would be a single `ServiceContainer` class, which serves both types of clients at the same time by implementing both `MutableServiceContainerInterface` _and_ `ServiceLocatorInterface`

### Violation: No Interface, Just a Class

* If the class doesn’t implement an interface the best we can do is to use the class itself as the type for the constructor argument.
* Even though there is no _explicit_ interface for the class, it still has an _implicit_ interface.
  * Each method of the class comes with a certain scope (public, protected, or private).
  * When a client depends on the class, it depends on all the public methods.
  * None of the methods with a different scope (i.e., protected or private) can be called by a client.
  * So the public methods combined form the _implicit interface_

#### Implicit Changes in the Implicit Interface

We define an `EntityManager` class that can be used to persist entities (objects) in a relational database.

The EntityManager class has some public methods — `persist()` and `flush()`—and one private method that internally makes the `UnitOfWork` object available to other methods.

we decide to add a `Query` class to ORM package. This `Query` class needs the `UnitOfWork` object that is used internally by `EntityManager`. So we turn its private `getUnitOfWork()` method into a public method. That way, the Query class may depend on the EntityManager class and use its `getUnitOfWork()`

This new public method `getUnitOfWork()` will automatically become part of the _implicit interface_ of `EntityManager`. From this moment on, all clients of EntityManager implicitly _depend_ on this method too, even though they may only use the `persist()` and `flush()` methods . Maybe some clients start using the publicly available method `getUnitOfWork()` too.

```
class EntityManager
{
    // ...
    /**
     * This method needs to be public because it's used by the
     * Query class
     */
    public function getUnitOfWork(): UnitOfWork
    {
        // ...
    }
}
class Query
                        
                        
                      
{
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    public function someMethod()
                        
                        
                        
                      
    {
        $this->entityManager->getUnitOfWork()->...
    }
}
```

One day we refactor the `Query` class and remove its dependency on the `EntityManager` class. Since none of the classes need the public `getUnitOfWork()` method anymore, make that method private again. Suddenly all the clients that use the previously public `getUnitOfWork()` method will break.

Adding methods to the implicit interface of a class is also bound to cause backward compatibility problems.

**Refactoring: Add Header and Role Interfaces**

* Solve this problem by defining an interface for each use case that the class provides.
* Martin Fowler calls these different types of interfaces role interfaces and header interfaces,
  * can determine role interfaces for a class by looking at the different clients that use the class.
  * Then group the methods that are used together in separate interfaces.
* Header interfaces are usually the easiest to define, since all to do is duplicate the public methods of the class, no thought needed

> _Clients should not be forced to depend on methods they do not use._

\\

Continuing the example above ..

```
interface PersistsEntitiesInterface {
    public function persist(object $entity): void;
    public function flush(): void;
}
interface HasUnitOfWorkInterface {
    public function getUnitOfWork(): UnitOfWork; 
}
```

* Can add a main interface that combines the two interfaces, and a class that implements the main interface.

```
interface EntityManagerInterface extends
    PersistsEntitiesInterface,
    HasUnitOfWorkInterface { ... }
class EntityManager implements EntityManagerInterface { // ... }

```

The interfaces we have defined describe the roles that a class can play: `PersistsEntitiesInterface` and `HasUnitOfWorkInterface` .

Then there is one interface that combines these roles and together constitutes a thing we know as an entity manager, which “can persist entities” and “has a unit of work”: the `EntityManagerInterface`

### Packages and the Interface Segregation Principle

When adding a small, focused interface to a class in the package, we are free to add more public methods to that class that aren’t part of the published interface.

* can even change or remove existing methods that aren’t part of the interface, giving you more freedom to redesign or refactor classes without disturbing its users.
