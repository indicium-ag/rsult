import { Option, None, Some } from './option.ts';

export type Result<T, E> =
    ResultOk<T, E> | ResultErr<T, E>;

export interface IResultCore<T, E> {
    /**
     * Checks if the result is an instance of `ResultOk`.
     * @returns true if the result is `ResultOk`, otherwise false.
     *
     * Usage Example:
     * const result = Ok(5);
     * if (result.is_ok()) {
     *   console.log("Result is Ok");
     * }
     */
    is_ok(): this is ResultOk<T, E>;

    /**
     * Checks if the result is an instance of `ResultErr`.
     * @returns true if the result is `ResultErr`, otherwise false.
     *
     * Usage Example:
     * const result = Err(new Error("Error"));
     * if (result.is_err()) {
     *   console.log("Result is Err");
     * }
     */
    is_err(): this is ResultErr<T, E>;

    /**
     * Retrieves the value from `ResultOk`, wrapped in an `Option`.
     * @returns `Some` containing the value if the result is `ResultOk`, otherwise `None`.
     *
     * Usage Example:
     * const result = Ok(5);
     * const value = result.ok();
     * if (value.is_some()) {
     *   console.log("Value:", value.unwrap());
     * }
     */
    ok(): Option<T>;

    /**
     * Retrieves the error from `ResultErr`, wrapped in an `Option`.
     * @returns `Some` containing the error if the result is `ResultErr`, otherwise `None`.
     *
     * Usage Example:
     * const result = Err(new Error("Error"));
     * const error = result.err();
     * if (error.is_some()) {
     *   console.log("Error:", error.unwrap());
     * }
     */
    err(): Option<E>;

    /**
     * Returns the contained `ResultOk` value, but throws an error with a provided message if
     * the result is a `ResultErr`.
     * @param msg The message to throw with if the result is an error.
     * @returns The contained `ResultOk` value.
     *
     * Usage Example:
     * const result = Ok(5);
     * console.log(result.expect("This should not fail"));
     */
    expect(msg: string): T;

    /**
     * Unwraps a `ResultOk`, yielding the contained value.
     * @returns The `ResultOk` value.
     * @throws Throws if the result is `ResultErr`.
     *
     * Usage Example:
     * const result = Ok(5);
     * console.log(result.unwrap());
     */
    unwrap(): T;

    /**
     * Returns the contained `ResultErr` error, but throws an error with a provided message if
     * the result is a `ResultOk`.
     * @param msg The message to throw with if the result is Ok.
     * @returns The contained `ResultErr` error.
     *
     * Usage Example:
     * const result = Err(new Error("Failure"));
     * console.log(result.expect_err("Expected an error"));
     */
    expect_err(msg: string): E;

    /**
     * Unwraps a `ResultErr`, yielding the contained error.
     * @returns The `ResultErr` error.
     * @throws Throws if the result is `ResultOk`.
     *
     * Usage Example:
     * const result = Err(new Error("Failure"));
     * console.log(result.unwrap_err());
     */
    unwrap_err(): E;

    /**
     * Converts from `IResultCore<T, E>` to `T`.
     * @returns The contained `ResultOk` value.
     * @throws Throws if the result is `ResultErr`.
     *
     * Usage Example:
     * const result = Ok(5);
     * console.log(result.into_ok());
     */
    into_ok(): T;

    /**
     * Converts from `IResultCore<T, E>` to `E`.
     * @returns The contained `ResultErr` error.
     * @throws Throws if the result is `ResultOk`.
     *
     * Usage Example:
     * const result = Err(new Error("Failure"));
     * console.log(result.into_err());
     */
    into_err(): E;
}

export interface IResultExt<T, E> extends IResultCore<T, E> {
    /**
     * Checks if the result is Ok and the contained value passes a specified condition.
     * @param f A predicate to apply to the contained value if the result is Ok.
     * @returns true if the result is Ok and the predicate returns true, otherwise false.
     *
     * Usage Examples:
     * const result = Ok(5);
     * if (result.is_ok_and(x => x > 3)) {
     *   console.log("Result is Ok and greater than 3");
     * }
     *
     * const result = Ok(2);
     * if (!result.is_ok_and(x => x > 3)) {
     *   console.log("Result is not Ok or not greater than 3");
     * }
     */
    is_ok_and(f: (value: T) => boolean): boolean;

    /**
     * Checks if the result is Err and the contained error passes a specified condition.
     * @param f A predicate to apply to the contained error if the result is Err.
     * @returns true if the result is Err and the predicate returns true, otherwise false.
     *
     * Usage Examples:
     * const result = Err(new Error("Network failure"));
     * if (result.is_err_and(e => e.message.includes("Network"))) {
     *   console.log("Network error occurred");
     * }
     */
    is_err_and(f: (value: E) => boolean): boolean;

    /**
     * Transforms the result via a mapping function if it is Ok.
     * @param fn A function to transform the Ok value.
     * @returns A new Result where the Ok value has been transformed.
     *
     * Usage Example:
     * const result = Ok(5);
     * const mapped = result.map(x => x * 2);
     *
     * const result = Err("Error");
     * const mapped = result.map(x => x * 2); // remains Err
     */
    map<U>(fn: (arg: T) => U): Result<U, E>;

    /**
     * Transforms the result via a mapping function if it is Ok, otherwise returns a default value.
     * @param defaultVal A default value to return if the result is Err.
     * @param f A function to transform the Ok value.
     * @returns The transformed Ok value or the default value.
     *
     * Usage Example:
     * const result = Ok(5);
     * const value = result.map_or(0, x => x * 2);
     *
     * const result = Err("Error");
     * const value = result.map_or(0, x => x * 2); // 0
     */
    map_or<U>(defaultVal: U, f: (arg: T) => U): U;

    /**
     * Transforms the result via a mapping function if it is Ok, otherwise computes a default value using a function.
     * @param defaultFunc A function to compute a default value if the result is Err.
     * @param f A function to transform the Ok value.
     * @returns The transformed Ok value or the computed default value.
     *
     * Usage Example:
     * const result = Ok(5);
     * const value = result.map_or_else(() => 0, x => x * 2);
     *
     * const result = Err("Error");
     * const value = result.map_or_else(() => 0, x => x * 2); // 0
     */
    map_or_else<U>(defaultFunc: (err: E) => U, f: (arg: T) => U): U;

    /**
     * Maps a `Result<T, E>` to `Result<T, U>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
     * @param fn A function to transform the Err value.
     * @returns A new Result where the Err has been transformed.
     *
     * Usage Example:
     * const result = Err("Error");
     * const mappedErr = result.map_err(e => new Error(e));
     */
    map_err<U>(fn: (arg: E) => U): Result<T, U>;

    /**
     * Applies a function to the contained value (if Ok), then returns the unmodified Result.
     * @param f A function to apply to the Ok value.
     * @returns The original Result.
     *
     * Usage Example:
     * const result = Ok(5);
     * result.inspect(x => console.log(`Value: ${x}`));
     */
    inspect(f: (val: T) => void): Result<T, E>;

    /**
     * Applies a function to the contained error (if Err), then returns the unmodified Result.
     * @param f A function to apply to the Err value.
     * @returns The original Result.
     *
     * Usage Example:
     * const result = Err("Error");
     * result.inspect_err(e => console.log(`Error: ${e}`));
     */
    inspect_err(f: (val: E) => void): Result<T, E>;

    /**
     * Returns `res` if the result is Ok, otherwise returns the Err value of `self`.
     * @param res The result to return if `self` is Ok.
     * @returns Either `res` or the original Err.
     *
     * Usage Example:
     * const result = Ok(5);
     * const other = Ok("Hello");
     * const finalResult = result.and(other); // Ok("Hello")
     */
    and<U>(res: Result<U, E>): Result<U, E>;

    /**
     * Calls `fn` if the result is Ok, otherwise returns the Err value of `self`.
     * @param fn A function to apply to the Ok value.
     * @returns The result of `fn` if the original result is Ok, otherwise the Err.
     *
     * Usage Example:
     * const result = Ok(5);
     * const finalResult = result.and_then(x => Ok(x * 2)); // Ok(10)
     */
    and_then<U>(fn: (arg: T) => Result<U, E>): Result<U, E>;

    /**
     * Returns `res` if the result is Err, otherwise returns the Ok value of `self`.
     * @param res The result to return if `self` is Err.
     * @returns Either `res` or the original Ok.
     *
     * Usage Example:
     * const result = Err("Error");
     * const other = Ok(5);
     * const finalResult = result.or(other); // Ok(5)
     */
    or<U>(res: Result<U, E>): Result<U, E>;

    /**
     * Calls `fn` if the result is Err, otherwise returns the Ok value of `self`.
     * @param fn A function to apply to the Err value.
     * @returns The result of `fn` if the original result is Err, otherwise the Ok.
     *
     * Usage Example:
     * const result = Err("Error");
     * const finalResult = result.or_else(e => Ok(`Handled ${e}`)); // Ok("Handled Error")
     */
    or_else<U>(fn: (arg: E) => Result<T, U>): Result<T, U>;

    /**
     * Returns the contained Ok value or a provided default.
     * @param defaultVal The default value to return if the result is Err.
     * @returns The Ok value or the default.
     *
     * Usage Example:
     * const result = Ok(5);
     * console.log(result.unwrap_or(0)); // 5
     *
     * const result = Err("Error");
     * console.log(result.unwrap_or(0)); // 0
     */
    unwrap_or(defaultVal: T): T;

    /**
     * Returns the contained Ok value or computes it from a function.
     * @param fn A function to compute the default value if the result is Err.
     * @returns The Ok value or the computed one.
     *
     * Usage Example:
     * const result = Err("Error");
     * console.log(result.unwrap_or_else(() => 5)); // 5
     */
    unwrap_or_else(fn: (arg: E) => T): T;
}

type UnwrapResult<T> = T extends Result<infer U, any> ? U : T;

export interface IResultIteration<T, E> extends IResultCore<T, E> {
    /**
     * Returns an iterator over the potentially contained value.
     * @returns An iterator which yields the contained value if it is `ResultOk<T, E>`.
     *
     * Usage Example:
     * const okResult = Ok(5);
     * for (const value of okResult.iter()) {
     *   console.log(value); // prints 5
     * }
     *
     * const errResult = Err(new Error("error"));
     * for (const value of errResult.iter()) {
     *   // This block will not be executed.
     * }
     */
    iter(): IterableIterator<T>;

    /**
     * Attempts to transpose a `Result` of a `Promise` into a `Promise` of a `Result`.
     * @returns A Promise of a Result if the inner value is a Promise, null otherwise.
     *
     * Usage Example:
     * async function example() {
     *   const resultPromise = Ok(Promise.resolve(5));
     *   const transposed = resultPromise.transpose(); // Result<Promise<5>, E> -> Promise<Result<5, E>> | null
     *   console.log(await transposed); // Prints Ok(5) if the promise resolves successfully.
     * }
     */
    transpose(): Result<T, E>;

    /**
     * Flattens a nested `Result` if the contained value is itself a `Result`.
     * @returns A single-layer `Result`, by stripping one layer of `Result` container.
     *
     * Usage Example:
     * const nestedOk = Ok(Ok(5));
     * const flattened = nestedOk.flatten(); // Results in Ok(5)
     *
     * const nestedErr = Ok(Err(new Error("error")));
     * const flattenedError = nestedErr.flatten(); // Results in Err(new Error("error"))
     */
    flatten(): Result<UnwrapResult<T>, E>;
}

export interface IResult<T, E> extends
    IResultCore<T, E>,
    IResultExt<T, E>,
    IResultIteration<T, E> {}

export const isResultOk = <T, E>(val: any): val is ResultOk<T, E> => {
    return val instanceof ResultOk;
}

export const isResultErr = <T, E>(val: any): val is ResultErr<T, E> => {
    return val instanceof ResultErr;
}

export class ResultOk<T, E> implements IResult<T, E> {
    private readonly _tag = 'Ok' as const;
    // @ts-ignore
    private readonly _T: T;
    // @ts-ignore
    private readonly _E: E;

    constructor(readonly value: T) {
    }

    is_ok(): this is ResultOk<T, E> {
        return true;
    }

    is_err(): this is never {
        return false;
    }

    is_ok_and(f: (value: T) => boolean): boolean {
        return f(this.value);
    }

    is_err_and(_f: (value: E) => boolean): boolean {
        return false;
    }

    ok(): Option<T> {
        return Some(this.value);
    }

    err(): Option<E> {
        return None();
    }

    map<U>(fn: (arg: T) => U): Result<U, E> {
        return new ResultOk<U, E>(fn(this.value));
    }

    map_or<U>(_d: U, f: (arg: T) => U): U {
        return f(this.value);
    }

    map_or_else<U>(_d: (e: E) => U, f: (arg: T) => U): U {
        return f(this.value);
    }

    map_err<U>(_fn: (arg: E) => U): Result<T, U> {
        return this as any;
    }

    inspect(f: (val: T) => void): Result<T, E> {
        f(this.value);

        return this;
    }

    inspect_err(_f: (val: E) => void): Result<T, E> {
        return this;
    }

    iter(): IterableIterator<T> {
        return [this.value][Symbol.iterator]();
    }

    expect(_msg: string): T {
        return this.value;
    }

    unwrap(): T {
        return this.value;
    }

    //unwrap_or_default(): T {
    //    ! not implemented
    //}

    expect_err(msg: string): E {
        throw new Error(msg);
    }

    unwrap_err(): never {
        throw new Error('Called Result.unwrap_err() on an Ok value: ' + this.value);
    }

    and<U>(res: Result<U, E>): Result<U, E> {
        return res;
    }

    and_then<U>(fn: (arg: T) => Result<U, E>): Result<U, E> {
        return fn(this.value);
    }

    or<U>(_res: Result<U, E>): Result<U, E> {
        return this as any;
    }

    or_else<U>(fn: (arg: E) => Result<T, U>): Result<T, U> {
        return this as any;
    }

    unwrap_or(_optb: T): T {
        return this.value;
    }

    unwrap_or_else(_fn: (arg: E) => T): T {
        return this.value;
    }

    transpose(): Result<T, E> {
        return new ResultOk<T, E>(this.value);
    }

    flatten(): Result<UnwrapResult<T>, E> {
        if (this.value instanceof ResultOk || this.value instanceof ResultErr) {
            return this.value;
        } else {
            // This case should not happen if T is always a Result,
            // but it's here to satisfy TypeScript's type checker.
            return new ResultOk<UnwrapResult<T>, E>(this.value as UnwrapResult<T>);
        }
    }

    into_ok(): T {
        return this.value;
    }

    into_err(): never {
        throw new Error('Called Result.into_err() on an Ok value: ' + this.value);
    }
}

export class ResultErr<T, E> implements IResult<T, E> {
    private readonly _tag: 'Err' = 'Err';
    // @ts-ignore
    private readonly _T: T;
    // @ts-ignore
    private readonly _E: E;

    constructor(readonly value: E) {
    }

    is_ok(): this is never {
        return false;
    }

    is_err(): this is ResultErr<T, E> {
        return true;
    }

    is_ok_and(_f: (value: T) => boolean): boolean {
        return false;
    }

    is_err_and(f: (value: E) => boolean): boolean {
        return f(this.value);
    }

    ok(): Option<T> {
        return None();
    }

    err(): Option<E> {
        return Some(this.value);
    }

    map<U>(_fn: (arg: T) => U): Result<U, E> {
        return this as any;
    }

    map_or<U>(d: U, _f: (arg: T) => U): U {
        return d;
    }

    map_or_else<U>(d: (e: E) => U, _f: (arg: T) => U): U {
        return d(this.value);
    }

    map_err<U>(fn: (arg: E) => U): Result<T, U> {
        return new ResultErr<T, U>(fn(this.value));
    }

    inspect(_f: (val: T) => void): Result<T, E> {
        return this;
    }

    inspect_err(f: (val: E) => void): Result<T, E> {
        f(this.value);
        return this;
    }

    iter(): IterableIterator<T> {
        return [][Symbol.iterator]();
    }

    expect(msg: string): never {
        throw new Error(msg);
    }

    unwrap(): never {
        throw new Error('Called Result.unwrap() on an Err value: ' + this.value);
    }

    //unwrap_or_default(): never {
    //    // ! not implemented
    //}

    expect_err(_msg: string): E {
        return this.value;
    }

    unwrap_err(): E {
        return this.value;
    }

    and<U>(_res: Result<U, E>): Result<U, E> {
        return this as any;
    }

    and_then<U>(_fn: (arg: T) => Result<U, E>): Result<U, E> {
        return this as any;
    }

    or<U>(res: Result<U, E>): Result<U, E> {
        return res;
    }

    or_else<U>(fn: (arg: E) => Result<T, U>): Result<T, U> {
        return fn(this.value);
    }

    unwrap_or(optb: T): T {
        return optb;
    }

    unwrap_or_else(fn: (arg: E) => T): T {
        return fn(this.value);
    }

    transpose(): Result<T, E> {
        return new ResultErr<T, E>(this.value);
    }

    flatten(): Result<UnwrapResult<T>, E> {
        return this.transpose() as Result<never, E>;
    }

    into_ok(): T {
        throw new Error('Called Result.into_ok() on an Err value: ' + this.value);
    }

    into_err(): E {
        return this.value;
    }
}
export const Ok = <T, E>(val: T): Result<T, never> => {
    return new ResultOk<T, E>(val) as Result<T, never>;
};

export const Err = <T, E>(val: E): Result<never, E> => {
    return new ResultErr<T, E>(val) as Result<never, E>;
};

export const try_catch =
    <T, E = Error>(
        fn: () => T,
    ): Result<T, E> => {
        try {
            return Ok(fn());
            // @ts-ignore (error is nominally of type any / unknown, not Error)
        } catch (error: Error) {
            return Err(error);
        }
    };

export const result_from_promise =
    async <T, E = Error>(
        val: Promise<T>,
    ): Promise<Result<T, E>> => {
        try {
            return new ResultOk<T, never>(await val);
        } catch (error: unknown) {
            return new ResultErr<never, E>(error as E);
        }
    };