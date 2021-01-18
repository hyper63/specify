<h1 align="center">Specify</h1>
<p align="center">A lightweight spec framework</p>

---

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Getting Started

Specify is a validation framework based on functional principals. This barebones validation framework gives you the building
blocks to create simple validations or create your own validation library. The goal of this project is just to contain the
building blocks of a validation library and not all of the validations, so it has no validations actually in the project. Specify just contains the data types to create a schema validation library using a functional approach.

Specify contains a validate method that takes a spec definition object and a value object, this validate function compares the
spec defintion object and the value object and returns a data type with a fold method, this fold method takes two functions as 
arguments, the first function is invoked if the validation fails and the second function is invoked if the validation passes.

The result in the first fold function is an array of error messages, the result in the second fold function is the object that 
is being evaluated.

``` js
const spec = {
  name: isPresent,
  email: isEmail
}

const obj = {
  name: 'Wilbur',
  email: 'wilbur@email.com'
}

validate(spec, obj).fold(msgs => console.log(msgs), obj => console.log(obj))
```
### Creating your own validations

This module contains the building blocks to create your own validation functions, these functions need to be modeled in 
the `Validation` data type and the function should return either a Fail or Success data type. 

```js
const isPresent = Validation((key, value) =>
  !!value ? Success(value) : Fail([`${key} should be present`])
```

As you can see in this validation, we return the `Validation` type and we create that type by passing in a function with the
arguments `key` and `value`, these are the arguments that get passed to the function when it is evaluating an object. Then as a result of the function, a `Success` or `Fail` type should be returned. Finally, the value in the Fail type should be enclosed in
an array so that all the failures can be concatenated together in a single array list.


## Installation

deps.js

``` js
export { Validation, Success, Fail, validate, and, or } from 'https://x.nest.land/specify@0.0.1/mod.js'
```


## Features

#### validate(spec, obj).fold(console.error, console.log)

`validate` is the main function that takes a spec object and a value object. The function then applies the spec to the value and returns a `Validation` instance that contains a `fold` method, the fold method has two arguments which are handler functions. The first argument gets called if the spec validation failed the second argument gets called if the spec validation passes.

#### Validation((key, value) => check ? Success(value) : Fail([`${key} something failied`]) 

This type is how you create validations for specify.

The Validation constructor takes a function, this function takes two arguments a key and value, and returns a Success or Fail type. The success type should include the value in its method call, and the Fail type should return an array with one or more strings.

#### Success and Fail

Be sure to import both the Success and Fail types to you validation project, each validation definition must return the `Fail` or `Success` data type.

#### and,or are two helper methods

`and`, `or`, are two Validation functions that make specify a little easier to combine Validations.

Example:

``` js
const spec = {
  name: and(isString, isPresent, maxLength(50)),
  email: and(isString, isPresent, isEmail),
  description: or(maxLength(255), optional()) 
}
```

The and helper, makes sure every validation passes, and the or helper one or the other can pass but both can not fail.

## Contributing

Bug fixes are welcome

## License

MIT

## Acknowledgements

The initial core of this library was a result of the Frontend Masters course Hardcore JS Patterns with Brian Lonsdorf aka Dr Boolean. For more details about how Monoids, foldMap and other functional concepts work, check out this couses: https://frontendmasters.com/courses/hardcore-js-patterns/
