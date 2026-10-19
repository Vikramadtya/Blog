# S : The Single Responsibility Principle

_A class should have one, and only one, reason to change._

#### A Class with Too Many Responsibilities

* each responsibility is also a reason to change\_.\_
* For a class with multiple responsibilities when one of the responsibilities requires a change, the _entire_ class needs to be opened and modified, while most of it may have nothing to do with the requested change itself.
* Changing existing code needs to minimised and responsibilities are reasons to change, try to minimise the number of responsibilities of each class.
  * This would minimise the chance that the class has to be opened for modification.
* A class with no responsibilities is a useless class so reduce it to one.

**Recognising Violations of the&#x20;**_**Single Responsibility**_**&#x20;Principle**

* Symptoms of a class violating the _Single Responsibility_ principle:
  * The class has many instance variables.
  * The class has many public methods.
  * Each method of the class uses different instance variables.
  * Specific tasks are delegated to private methods.
  * it is likely to have many _dependencies_ .
    * It probably gets many objects injected as constructor arguments to be able to fulfill its goal.

#### Refactoring: Using Collaborator Classes

* The way we can refactor a class with multiple responsibility is by extracting collaborator classes.

**Example**

class `ConfirmationMailMailer` has dependencies a templating engine for rendering the body of the email message, a translator for translating the message’s subject, and a mailer for sending the message

it has responsibilty to _create_ a confirmation mail and to _send_ it.

Since the class is a “mailer,” it should have responsibility of _sending the message_ to the user.

Extract the responsibility of _creating the message,_ he creation logic of the confirmation mail has been placed inside `ConfirmationMailFactor`y

### Advantages of Having a Single Responsibility

* A side effect of the refactoring to single responsibilities, is easier testing. Test each responsibility separately.
  * Having a single responsibility will make a class smaller, so will have to write fewer tests to keep that class covered.
  * Small classes will have fewer private methods with effects that need to be verified in a unit test.
* smaller classes are simpler to maintain.
  * It is easier to grasp their purpose and all the implementation details are where they belong: in the classes responsible for them.

#### Packages and the Single Responsibility Principle

* In the context of package design, “having only one reason to change” becomes “being closed against the same kind of changes”.
  * The corresponding package principle is called the _Common Closure_ principle
* When a package has many dependencies, it is tightly coupled to each of them, which means that a change in one of the dependencies will likely require a change in the package too.
* Applying the Common Closure principle to a package means reducing the number of reasons for a package to change.
  * Removing dependencies, or deferring them to other packages, is one way to accomplish this.
