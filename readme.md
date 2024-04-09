<p align="center">
  <img src="https://github.com/indicium-ag/rsult/raw/master/rsult.svg" width="300px"/><br/>
  <img src="https://github.com/indicium-ag/rsult/raw/master/rsult-test.svg" width="450px"/>
</p>

<hr/>

<h5 align="center">
Bring the benefits of Rust's error handling and optional types to your TypeScript projects.
<br/>
Reduce the need for null checks and write safer, more expressive code.
<br/>
<br/> 
rsult offers a collection of practical utilities for handling `Option` and `Result` types,
<br/>
helping you create more robust and maintainable codebases.
</h5>

<hr/>

```bash
$ pnpm add rsult
```

```typescript
import { Option, Result, Some, None, Ok, Err } from 'rsult';
```

### tl;dr

- rsult is inspired by Rust's `Option` and `Result` types.
- It helps you handle optional values and results, eliminating `null` and `undefined` checks.
- You can wrap values in `Some`, `None`, `Ok`, or `Err`, and use handy functions to transform, combine, and handle errors expressively.
- It's a friendly sidekick that makes your code safer and more predictable. ✨

### tl;dr

rsult makes your code safer and more predictable.

## Usage

### Option

The `Option` type is used for values that may or may not be present. It can be either `Some` or `None`.

#### Creating an Option

```typescript
const someValue: Option<number> = Some(5);
const noneValue: Option<number> = None();
```

#### Checking if an Option is Some or None

```typescript
if (someValue.is_some()) {
 console.log("It's Some!");
}

if (noneValue.is_none()) {
 console.log("It's None!");
}
```

#### Transforming the Value Inside an Option

```typescript
const transformedValue = someValue.map(x => x * 2); // Some(10)
```

#### Handling Options with Default Values

```typescript
const valueWithDefault = noneValue.unwrap_or(0); // 0
```

### Result

The `Result` type is used for operations that can succeed or fail. It can be either `Ok` or `Err`.

#### Creating a Result

```typescript
const okResult: Result<number, string> = Ok(5);
const errResult: Result<number, string> = Err("An error occurred");
```

#### Checking if a Result is Ok or Err

```typescript
if (okResult.is_ok()) {
 console.log("It's Ok!");
}

if (errResult.is_err()) {
 console.log("It's Err!");
}
```

#### Transforming the Value Inside a Result

```typescript
const transformedResult = okResult.map(x => x * 2); // Ok(10)
```

#### Handling Results with Default Values

```typescript
const valueWithDefault = errResult.unwrap_or(0); // 0
```

## Advanced Usage

### Advanced Usage: Option

#### Advanced Option Transformations

Applying multiple transformations consecutively demonstrates the power of composable operations.

```typescript
const option = Some(10);
const transform = option
  .map(x => x * 2)
  .and_then(x => x > 15 ? Some(x) : None())
  .unwrap_or(0);

console.log(transform); // 20
```

This example showcases converting a numeric option to a string if it meets a condition, providing a default otherwise.

#### Combining Multiple Options

When dealing with multiple optional values, `Option` can elegantly handle combinations, making sure all values are present.

```typescript
const option1: Option<number> = Some(10);
const option2: Option<string> = Some("twenty");

const combinedOption = option1.and_then(num =>
  option2.map(str => `${num} and ${str}`)
);

console.log(combinedOption.unwrap_or("Missing value")); // "10 and twenty"
```

This demonstrates combining numerical and string options into a single descriptive string if both are present.

#### Filtering and Conditional Access

Filter out options that don't satisfy a certain condition, effectively allowing conditional access to `Some` values.

```typescript
const numberOption: Option<number> = Some(42);
const filteredOption = numberOption.filter(x => x > 100);

console.log(filteredOption.is_none()); // true
```

Only values satisfying the condition remain, others turn into `None`.

### Advanced Usage: Result

#### Chaining Result Operations

By chaining operations, you can handle complex data manipulation and error handling with ease.

```typescript
const processResult: Result<number, string> = Ok(5);

const chainedResult = processResult.map(x => x * 2)
  .and_then(x => x > 5 ? Ok(x.toString()) : Err("Value too small"))
  .map_err(err => `Error encountered: ${err}`);

console.log(chainedResult.unwrap_or("Default value")); // "10"
```

This transformation sequence demonstrates error handling and conditional mapping in a powerful, readable manner.

#### Error Recovery

Perform error recovery by providing alternative workflows in case of errors.

```typescript
enum ErrorType {
  NotFound,
  Invalid,
  Unrecoverable,
}

const riskyOperation: Result<number, ErrorType> = Err(ErrorType.NotFound);

const recoveryAttempt = riskyOperation.or_else(err =>
  err !== ErrorType.Unrecoverable ? Ok(0) : Err("Unrecoverable error")
);

console.log(recoveryAttempt.unwrap()); // 0
```

This example shows a simple mechanism for recovering from specific errors, providing a fallback result.

#### Combining Results with Different Types

Use case-driven transformations to work with results of varying types, demonstrating flexibility in handling operations that might fail.

```typescript
const fetchResource: () => Result<string, Error> = () => Ok("Resource content");

const parseResource: (content: string) => Result<object, string> = content =>
  content.length > 0 ? Ok({ parsed: content }) : Err("Empty content");

const result = fetchResource()
  .and_then(parseResource)
  .map(parsed => `Parsed content: ${JSON.stringify(parsed)}`)
  .unwrap_or("Default content");

console.log(result); // "Parsed content: {"parsed":"Resource content"}"
```

## API Reference

### Option

#### Check Methods
- `is_some()`: Checks if the Option is Some.
- `is_none()`: Checks if the Option is None.
- `is_some_and(f: (arg: T) => boolean)`: Determines if the Option is Some and the contained value meets a condition.

#### Transform Methods
- `map(fn: (arg: T) => U)`: Transforms the contained value of a Some with a provided function. Returns None if this Option is None.
- `map_or<U>(defaultVal: U, fn: (arg: T) => U)`: Applies a function to the contained value if Some, otherwise returns a provided default.

#### Expect and Unwrap Methods
- `expect(msg: string)`: Extracts the value from a Some, throwing an error if it is None.
- `unwrap()`: Unwraps the Option, returning the contained value, or throws an error if the Option is None.
- `unwrap_or(defaultVal: T)`: Returns the contained value if Some, else returns a provided alternative.
- `unwrap_or_else(fn: () => T)`: Returns the contained value if Some, else computes a value from a provided function.
- `unwrap_or_default()`: Returns the contained value if Some, otherwise the default value for the type.

#### Combine Methods
- `and<U>(opt: Option<U>)`: Returns the passed Option if this Option is Some, else returns None.
- `and_then<U>(fn: (arg: T) => Option<U>)`: Returns the result of applying a function to the contained value if Some, otherwise returns None.
- `or<U>(opt: Option<U>)`: Returns the passed Option if this Option is None, else returns this Option.
- `or_else<U>(fn: () => Option<U>)`: Returns the result of applying a function if this Option is None, else returns this Option.
- `xor(optb: Option<T>)`: Returns None if both this and the passed Option are Some. Otherwise returns the Option that is Some.

#### Mutate Methods
- `take()`: Takes the contained value out of the Option, leaving a None in its place.
- `take_if(predicate: (arg: T) => boolean)`: Takes the contained value out of the Option if it satisfies a predicate, leaving a None in its place.
- `replace(value: T)`: Replaces the contained value with another, returning the old value wrapped in an Option.

#### Zip Methods
- `zip<U>(other: Option<U>)`: Combines two Option values into a single Option containing a tuple of their values if both are Some, otherwise returns None.
- `zip_with<U, R>(other: Option<U>, f: (val: T, other: U) => R)`: Combines two Option values by applying a function if both are Some, otherwise returns None.

#### Filter Method
- `filter(predicate: (arg: T) => boolean)`: Applies a predicate to the contained value if Some, returns None if the predicate does not hold or if this Option is None.

#### Flatten Method
- `flatten()`: Flattens a nested Option, if the Option contains another Option, returning the inner Option if it's Some.

### Result

#### Basic Methods
- `is_ok()`: Checks if the Result is Ok.
- `is_err()`: Checks if the Result is Err.
- `ok()`: Retrieves the value from `ResultOk`, wrapped in an `Option`.
- `err()`: Retrieves the error from `ResultErr`, wrapped in an `Option`.

#### Retrieval Methods
- `expect(msg: string)`: Returns the contained `ResultOk` value, but throws an error with a provided message if the result is a `ResultErr`.
- `unwrap()`: Unwraps a `ResultOk`, yielding the contained value.
- `expect_err(msg: string)`: Returns the contained `ResultErr` error, but throws an error with a provided message if the result is a `ResultOk`.
- `unwrap_err()`: Unwraps a `ResultErr`, yielding the contained error.

#### Conversion Methods
- `into_ok()`: Converts from `IResultCore<T, E>` to `T`.
- `into_err()`: Converts from `IResultCore<T, E>` to `E`.
- `transmute()`: Changes the type of `Result<T, E>` to `Result<T, never>` or `Result<never, E>`, respectively. This is particularly useful when trying to forward a `ResultErr` returned by a function whose error type overlaps with the returned error type of the current function, but whose value type does not.

#### Checking and Transforming Methods
- `is_ok_and(f: (value: T) => boolean)`: Checks if the result is Ok and the contained value passes a specified condition.
- `is_err_and(f: (value: E) => boolean)`: Checks if the result is Err and the contained error passes a specified condition.
- `map<U>(fn: (arg: T) => U)`: Transforms the result via a mapping function if it is Ok.
- `map_or<U>(defaultVal: U, f: (arg: T) => U)`: Transforms the result via a mapping function if it is Ok, otherwise returns a default value.
- `map_or_else<U>(defaultFunc: (err: E) => U, f: (arg: T) => U)`: Transforms the result via a mapping function if it is Ok, otherwise computes a default value using a function.
- `map_err<U>(fn: (arg: E) => U)`: Maps a `Result<T, E>` to `Result<T, U>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.

#### Inspection Methods
- `inspect(f: (val: T) => void)`: Applies a function to the contained value (if Ok), then returns the unmodified Result.
- `inspect_err(f: (val: E) => void)`: Applies a function to the contained error (if Err), then returns the unmodified Result.

#### Combination Methods
- `and<U>(res: Result<U, E>)`: Returns `res` if the result is Ok, otherwise returns the Err value of `self`.
- `and_then<U>(fn: (arg: T) => Result<U, E>)`: Calls `fn` if the result is Ok, otherwise returns the Err value of `self`.
- `or<U>(res: Result<U, E>)`: Returns `res` if the result is Err, otherwise returns the Ok value of `self`.
- `or_else<U>(fn: (arg: E) => Result<T, U>)`: Calls `fn` if the result is Err, otherwise returns the Ok value of `self`.

#### Unwrap Methods with Defaults
- `unwrap_or(defaultVal: T)`: Returns the contained Ok value or a provided default.
- `unwrap_or_else(fn: (arg: E) => T)`: Returns the contained Ok value or computes it from a function.

#### Iteration and Flattening Methods
- `iter()`: Returns an iterator over the potentially contained value.
- `flatten()`: Flattens a nested `Result` if the contained value is itself a `Result`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

rsult is licensed under the MIT License.