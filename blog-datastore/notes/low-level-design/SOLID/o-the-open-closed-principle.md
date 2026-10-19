# O : The Open/Closed Principle

_You should be able to extend a class’s behavior without modifying it._

* A unit of code can be considered “open for extension” when i&lt;mark style="background-color:yellow;"&gt;ts behaviour can be easily changed&lt;/mark&gt; _&lt;mark style="background-color:yellow;"&gt;without&lt;/mark&gt;_ &lt;mark style="background-color:yellow;"&gt;modifying it&lt;/mark&gt;.
* The fact that &lt;mark style="background-color:yellow;"&gt;no actual modification is needed to change the behaviour of a unit of code&lt;/mark&gt; makes it “closed” for modification.

Being able to extend a class’s behaviour doesn’t mean to actually extend that class by creating a subclass for it. Extension of a class means to influence its behavior from the outside and leave the class, or the entire class hierarchy, untouched.

#### Example

* `GenericEncoder` class the branching inside the `encodeToFormat()` method is needed to choose the right encoder based on the value of the `format` argument.

```
class GenericEncoder
{
    public function encodeToFormat($data, string $format): string
    {
        if ($format === 'json') {
            $encoder = new JsonEncoder();
        } elseif ($format === 'xml') {
            $encoder = new XmlEncoder();
        } else {
            throw new InvalidArgumentException('Unknown format');
        }
        $data = $this->prepareData($data, $format);
        return $encoder->encode($data);
    }
}
```

* to use the `GenericEncoder` to encode data to the Yaml format, an obious solution would be to create a `YamlEncoder` class for this purpose and then add an extra condition inside the existing `encodeToFormat()` method
* each time to add another format-specific encoder, the `GenericEncoder` class itself needs to be modified. We cannot change behaviour without modifying code. This is why the `GenericEncoder` class cannot be considered _open for extension_ and _closed for modification_.

**Recognising Classes that Violate the Open/Closed Principle**

* It contains conditions to determine a strategy.
  * Conditions using the same variables or constants are recurring inside the class or related classes.
* The class contains hard-coded references to other classes or class names.
* Inside the class, objects are being created using the new operator.
* The class has protected properties or methods, to allow changing its behavior by overriding state or behavior.

#### Refactoring: Abstract Factory

* Delegate the responsibility of resolving the right encoder for the format to some other class.
* This new class can be an implementation of the Abstract Factory design pattern.
* The abstractness is represented by the fact that its `create()` method is bound to return an instance of a given interface.
* We don’t care about its actual class only want to retrieve an object with an `encode($data)` method. So we need an interface for such format-specific encoders.
* Ensure that the `GenericEncoder` class does not create any format-specific encoders anymore.
  * It should delegate this job to the `EncoderFactory` class, which it receives as a constructor argument
* `EncoderFactory` class has the creation logic of format-specific encoders

```
class EncoderFactory
{
    public function createForFormat(
        string $format
    ) : EncoderInterface {
        if ($format === 'json') {
            return new JsonEncoder();
        } elseif ($format === 'xml') {
            return new XmlEncoder();
        } elseif (...) {
            // ...
        }
        throw new InvalidArgumentException('Unknown format');
    }
}
```

* There is still a hard-coded list of supported formats and their corresponding encoders. Since class names are still hard-coded. The EncoderFactory is closed against extension, its behavior can’t be extended without modifying its code.

#### Refactoring: Making the Abstract Factory Open for Extension

* Apply the _Dependency Inversion_ principle by defining an interface for encoder factories.
* The EncoderFactory we already have should implement this new interface
* the constructor argument of the GenericEncoder should have the interface as its type\\

#### Replacing or Decorating the Encoder Factory

* By making `GenericEncoder` depend on an interface instead of a class, we have added a first extension point to it.
* Users of this class can replace the encoder factory, which is now a proper dependency.
* For example, to fetch the encoder for a given format from a service locator and fall back on the default EncoderFactory in case of an unknown format.
  * Using the interface, they can compose a new factory, which implements the required interface, but receives the original EncoderFactory as a constructor argument.

```
class MyCustomEncoderFactory implements EncoderFactoryInterface
{
    private $fallbackFactory;
    private $serviceLocator;
    
    public function createForFormat($format): EncoderInterface
    {
        if ($this->serviceLocator->has($format . '.encoder') {
            return $this->serviceLocator
                        ->get($format . '.encoder');
        }
        return $this->fallbackFactory->createForFormat($format);
    }
}
```

* The new factory “wraps” the old one, technical term for this is “**decoration**”

**Making EncoderFactory Itself Open for Extension**

* When a new format comes along, to keep using the same old `EncoderFactory`, without touching the code of the class itself is not possible because the creation logic of each of the encoders is hard-coded in the EncoderFactory class.
  * it’s impossible to extend or change the behavior of the `EncoderFactory` class without modifying the logic by which the encoder factory decides which encoder it should create and how it should do that for any given format can’t be changed from the outside.
* A way to solve this is by injecting specialized factories into the `EncoderFactory`

```
class EncoderFactory implements EncoderFactoryInterface
{
    private $factories = [];
    /**
     * Register a callable that returns an instance of
     * EncoderInterface for the given format.
     *
     * @param string $format
     * @param callable $factory
     */
    public function addEncoderFactory(
        string $format,
        callable $factory
    ): void {
        $this->factories[$format] = $factory;
    }
    public function createForFormat(
        string $format
    ): EncoderInterface {
        $factory = $this->factories[$format];
        // the factory is a callable
        $encoder = $factory();
        return $encoder;
    }
}
```

* For each format it is possible to inject a callable.
  * This dynamic and extensible implementation allows to add as many format-specific encoders as needed.
* Introducing **callable factories**, have relieved the `EncoderFactory` from the responsibility of providing the right constructor arguments for each encoder.

**Prefer Immutable Services**

* `EncoderFactory` became a mutable service on adding `addEncoderFactory()` method to it.
* A convenient thing to do, but in practice it’ll be a smart to design a service to be immutable.

Apply the following rule to achieve this:

* After instantiation, it shouldn’t be possible to change any of a service’s properties.
* The biggest advantage of a service being immutable is that its behavior won’t change on subsequent calls.
* It will be fully configured before its first usage.
* It will be impossible to somehow get different results upon subsequent calls.
* If still prefer having separate methods to configure an object, make sure to not make these methods part of the published interface for the class. They are there only for clients that need to configure the object, not for clients actually using the objects.

#### Refactoring: Polymorphism

* `GenericEncoder` class has the switch statement for preparing the data before it is encoded but this responsibility should be on the format-specific encoders as they know everything about encoding data to their own format.

```
class GenericEncoder
{
    private function prepareData($data, string $format)
    {
        switch ($format) {
            case 'json':
                $data = $this->forceArray($data);
                $data = $this->fixKeys($data);
                // fall through
            case 'xml':
                $data = $this->fixAttributes($data);
                break;
            default:
                throw new InvalidArgumentException(
                    'Format not supported'
                );
        }
        return $data;
    }
}
```

* delegate the “prepare data” logic to the specific encoders by adding a method called `prepareData($data)` to the EncoderInterface and calling it in the `encodeToFormat()`
* not a great solution as it introduces “**temporal coupling**”: before calling `encode()` always call `prepareData()`
* Make preparing the data part of the actual encoding process inside the format-specific encoder.

```
class JsonEncoder implements EncoderInterface
{
    public function encode($data): string
    {
        $data = $this->prepareData($data);
        return json_encode($data);
    }
    private function prepareData($data)
    {
        // ...
        return $data;
    }
}
```

#### Packages and the Open/Closed Principle

* Applying the Open/Closed principle to classes will greatly benefit in the implementation of future requirements (or changed requirements).
* When the behaviour of a class can be changed from the outside, without modifying its code, people will feel safe to do so.
* A package will be used in many different projects and in many different circumstances.
  * the classes in a package should not be too specific and leave room for the details to be implemented in different ways.
  * when behavior has to be specific (at some point a package has to be opinionated about something), it should be possible to change that behavior without actually modifying the code.
* The Open/Closed principle is highly useful and should be applied widely and generously when designing classes that are bound to end up in a reusable package.
  * In practice, it means allowing classes to be configured by injecting different constructor arguments.
  * For collaborating objects extracted while applying the Single Responsibility principle, ensure these objects have a published interface, which allows users to decorate existing classes.
* Applying the Open/Closed principle will make it possible to change the behaviour of any class in package by switching out or decorating constructor arguments only.
  * Since users should never have to rely on subclassing to override a class’s behavior anymore, this gives you the powerful option to mark all of them as final.
  * This decreases the number of possible use cases to consider when making a change to the class.
  * It will help keeping backward compatibility in the future, and give all the freedom to change any implementation detail of the class.
*
