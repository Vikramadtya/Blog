# Design pattern

best way to use patterns is to _load yourself_ with them and then _recognise places_ in designs and existing applications where to _apply them_.

*
  * Instead of _code_ reuse, with patterns we get _experience_ reuse.
* Using inheritance hasn’t worked out very well, since the behaviour can change across the subclasses, and it’s not appropriate for _all_ subclasses to have those behaviours.
* The interface seemed promising as only objects that really do have behaviour will implement them.
  * This would cause duplication of code across all objects as Java interfaces typically have no implementation code, so no code reuse (`default` enabled writing default implementation) .
    * To modify a behaviour, often forced to track down and change it in all the different subclasses where that behaviour is defined.

> _**Take the parts that vary and encapsulate them, so that later you can alter or extend the parts that vary without affecting those that don’t.**_

* If some aspect of code is changing with every new requirement pull iy out and separated from all the stuff that doesn’t change.
  * Fewer unintended consequences from code changes and more flexibility to systems.
* Create new classes by extracting the varying behaviour into its own class.
  * the set of classes whose entire reason for living is to represent a behavior
* Include behavior setter methods in the main classes so that we can _change_ the behavior _at runtime_.

> _**Program to an interface, not an implementation.**_

* use an interface to represent each behavior
* It’s the _behavior_ class, rather than the main class, that will implement the behavior interface.
* With new design, the _behavior_ subclasses will use a behavior represented by an interface, so that the actual implementation of the behavior (in other words, the specific concrete behavior coded in the class that implements the _behavior_ ) won’t be locked into the behavior subclass.
