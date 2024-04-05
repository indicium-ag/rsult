export type Option<T> = OptionSome<T> | OptionNone<T>;

export interface IOptionCheck<T> {
    /**
     * Determines if the Option is Some.
     * @returns true if the Option is Some, otherwise false.
     *
     * Usage Example:
     * const myOption = Some(5);
     * if (myOption.is_some()) {
     *   console.log("It's Some!");
     * }
     */
    is_some(): this is OptionSome<T>;

    /**
     * Determines if the Option is Some and the contained value meets a condition.
     * @param f The condition to apply to the contained value if it's Some.
     * @returns true if the Option is Some and the condition returns true, otherwise false.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const isGreaterThanThree = myOption.is_some_and(x => x > 3); // true
     */
    is_some_and(f: (arg: T) => boolean): boolean;

    /**
     * Determines if the Option is None.
     * @returns true if the Option is None, otherwise false.
     *
     * Usage Example:
     * const myOption = None();
     * if (myOption.is_none()) {
     *  console.log("It's None!");
     * }
     */
    is_none(): boolean;
}

export interface IOptionExpect<T> {
    /**
     * Extracts the value from a Some, throwing an error if it is None.
     * @param msg The error message to throw if the Option is None.
     * @returns The contained value if the Option is Some.
     * @throws Error with provided message if the Option is None.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const value = myOption.expect("Expected a value!"); // 5
     */
    expect(msg: string): T | never;
}

export interface IOptionTransform<T> {
    /**
     * Transforms the contained value of a Some with a provided function. Returns None if this Option is None.
     * @param fn The mapping function to apply to the contained value.
     * @returns An Option containing the result of applying fn to the original value if it was Some, else None.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const newOption = myOption.map(x => x * 2); // Some(10)
     */
    map<U>(fn: (arg: T) => U): Option<U>;

    /**
     * Applies a function to the contained value if Some, otherwise returns a provided default.
     * @param defaultVal The default value to return if the Option is None.
     * @param fn The function to apply to the contained value if Some.
     * @returns The result of applying fn to the contained value if this Option is Some, else defaultVal.
     *
     * Usage Example:
     * const myOption = None();
     * const value = myOption.map_or(0, x => x * 2); // 0
     */
    map_or<U>(defaultVal: U, fn: (arg: T) => U): U;
}

export interface IOptionCombine<T> {
    /**
     * Returns the passed Option if this Option is Some, else returns None.
     * @param opt The Option to return if this Option is Some.
     * @returns The passed Option if this Option is Some, else None.
     *
     * Usage Example:
     * const opt1 = Some(5);
     * const opt2 = Some(10);
     * const result = opt1.and(opt2); // Some(10)
     */
    and<U>(opt: Option<U>): Option<U>;

    /**
     * Returns the result of applying a function to the contained value if Some, otherwise returns None.
     * @param fn The function to apply to the contained value.
     * @returns An Option containing the result of applying fn to the original value if it was Some, else None.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const newOption = myOption.and_then(x => Some(x * 2)); // Some(10)
     */
    and_then<U>(fn: (arg: T) => Option<U>): Option<U>;

    /**
     * Returns the passed Option if this Option is None, else returns this Option.
     * @param opt The alternative Option to return if this Option is None.
     * @returns This Option if it is Some, otherwise the passed Option.
     *
     * Usage Example:
     * const opt1 = None();
     * const opt2 = Some(10);
     * const result = opt1.or(opt2); // Some(10)
     */
    or<U>(opt: Option<U>): Option<T> | Option<U>;

    /**
     * Returns the result of applying a function if this Option is None, else returns this Option.
     * @param fn The function that produces an Option to return if this Option is None.
     * @returns This Option if it is Some, otherwise the Option produced by fn.
     *
     * Usage Example:
     * const opt1 = None();
     * const result = opt1.or_else(() => Some(10)); // Some(10)
     */
    or_else<U>(fn: () => Option<U>): Option<T> | Option<U>;

    /**
     * Returns None if both this and the passed Option are Some. Otherwise returns the Option that is Some.
     * @param optb The other Option to compare with.
     * @returns None if both Options are Some, otherwise the Option that is Some.
     *
     * Usage Example:
     * const opt1 = Some(5);
     * const opt2 = None();
     * const result = opt1.xor(opt2); // Some(5)
     */
    xor(optb: Option<T>): Option<T>;
}

export interface IOptionUtility<T> {
    /**
     * Unwraps the Option, returning the contained value, or throws an error if the Option is None.
     * @returns The contained value if this Option is Some.
     * @throws Error if this Option is None.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const value = myOption.unwrap(); // 5
     */
    unwrap(): T | never;

    /**
     * Returns the contained value if Some, else returns a provided alternative.
     * @param optb The alternative value to return if this Option is None.
     * @returns The contained value if this Option is Some, else optb.
     *
     * Usage Example:
     * const myOption = None();
     * const value = myOption.unwrap_or(10); // 10
     */
    unwrap_or(optb: T): T;

    /**
     * Returns the contained value if Some, else computes a value from a provided function.
     * @param fn The function to compute the alternative value from if this Option is None.
     * @returns The contained value if this Option is Some, else the result of fn.
     *
     * Usage Example:
     * const myOption = None();
     * const value = myOption.unwrap_or_else(() => 10); // 10
     */
    unwrap_or_else(fn: () => T): T;

    /**
     * Returns the contained value if Some, otherwise the default value for the type.
     * @returns The contained value if Some, else the type’s default value.
     *
     * Usage Example:
     * const myOption is None<number>();
     * const value = myOption.unwrap_or_default(); // 0
     */
    unwrap_or_default(): T | null;
}

export interface IOptionMutate<T> {
    /**
     * Takes the contained value out of the Option, leaving a None in its place.
     * @returns The Option containing the original value before it was taken.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const takenValue = myOption.take(); // Some(5), myOption is now None
     */
    take(): Option<T>;

    /**
     * Takes the contained value out of the Option if it satisfies a predicate, leaving a None in its place.
     * @param predicate The predicate to apply to the contained value.
     * @returns The Option containing the original value if the predicate returns true, otherwise None.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const takenValue = myOption.take_if(x => x > 3); // Some(5), myOption is now None
     */
    take_if(predicate: (arg: T) => boolean): Option<T>;

    /**
     * Replaces the contained value with another, returning the old value wrapped in an Option.
     * @param value The new value to put in the Option.
     * @returns An Option containing the old value.
     * 
     * Usage Example:
     * const myOption = Some(5);
     * const oldValue = myOption.replace(10); // Some(5), myOption now contains 10
     * 
    */
    replace(value: T): Option<T>;
}

export interface IOptionZip<T> {
    /**
     * Combines two Option values into a single Option containing a tuple of their values if both are Some, otherwise returns None.
     * @param other The other Option to zip with.
     * @returns An Option containing a tuple of the two Option values if both are Some, otherwise None.
     *
     * Usage Example:
     * const opt1 = Some(5);
     * const opt2 = Some("hello");
     * const zipped = opt1.zip(opt2); // Some([5, "hello"])
     */
    zip<U>(other: Option<U>): Option<[T, U]>;

    /**
     * Combines two Option values by applying a function if both are Some, otherwise returns None.
     * @param other The other Option to zip with.
     * @param f The function to apply to the values if both Options are Some.
     * @returns An Option containing the result of the function if both Options are Some, otherwise None.
     *
     * Usage Example:
     * const opt1 = Some(5);
     * const opt2 = Some(10);
     * const added = opt1.zip_with(opt2, (a, b) => a + b); // Some(15)
     */
    zip_with<U, R>(other: Option<U>, f: (val: T, other: U) => R): Option<R>;
}
export interface IOptionFilter<T> {
    /**
     * Applies a predicate to the contained value if Some, returns None if the predicate does not hold or if this Option is None.
     * @param predicate The predicate function to apply.
     * @returns The original Option if it is Some and the predicate holds, else None.
     *
     * Usage Example:
     * const myOption = Some(5);
     * const filteredOption = myOption.filter(x => x > 3); // Some(5)
     */
    filter(predicate: (arg: T) => boolean): Option<T>;
}

export interface IOptionFlatten<T> {
    /**
     * Flattens a nested Option, if the Option contains another Option, returning the inner Option if it's Some.
     * @returns The contained Option if this is an Option of an Option and the inner Option is Some, otherwise None.
     *
     * Usage Example:
     * const opt = Some(Some(5));
     * const flattened = opt.flatten(); // Some(5)
     */
    flatten<T extends Option<T>>(): Option<T>;
}

export interface IOption<T> extends
    IOptionCheck<T>,
    IOptionExpect<T>,
    IOptionTransform<T>,
    IOptionCombine<T>,
    IOptionUtility<T>,
    IOptionMutate<T>,
    IOptionZip<T>,
    IOptionFilter<T>,
    IOptionFlatten<T> { }

export class OptionSome<T> implements IOption<T> {
    readonly _tag = 'Some' as const;
    readonly _T!: T;

    constructor(readonly value: T) { }

    is_some(): this is OptionSome<T> {
        return true;
    }

    is_some_and(f: (arg: T) => boolean): boolean {
        return f(this.value);
    }

    is_none(): this is never {
        return false;
    }

    expect(_msg: string): T {
        return this.value;
    }

    map<U>(fn: (arg: T) => U): Option<U> {
        return new OptionSome<U>(fn(this.value));
    }

    map_or<U>(_defaultVal: U, fn: (arg: T) => U): U {
        return fn(this.value);
    }

    and<U>(opt: Option<U>): Option<U> {
        return opt;
    }

    and_then<U>(fn: (arg: T) => Option<U>): Option<U> {
        return fn(this.value);
    }

    filter(predicate: (arg: T) => boolean): Option<T> {
        if (predicate(this.value)) {
            return this;
        }

        return None<T>();
    }

    or<U>(_opt: Option<U>): Option<T> {
        return this as any;
    }

    or_else<U>(_fn: () => Option<U>): Option<T> {
        return this as any;
    }

    xor(optb: Option<T>): Option<T> {
        if (optb.is_some()) {
            return None<T>();
        }

        return this;
    }

    unwrap(): T {
        return this.value;
    }

    unwrap_or(optb: T): T {
        return this.value;
    }

    unwrap_or_else(_fn: () => T): T {
        return this.value;
    }

    unwrap_or_default(): T | null {
        return this.value;
    }

    take(): Option<T> {
        const value = this.value;
        // @ts-ignore "administrative override" :-)
        this.value = undefined as any;
        return new OptionSome<T>(value);
    }

    take_if(predicate: (arg: T) => boolean): Option<T> {
        if (predicate(this.value)) {
            return this.take();
        }

        return None<T>();
    }

    replace(value: T): Option<T> {
        const oldValue = this.value;
        // @ts-ignore "administrative override" :-)
        this.value = value;
        return new OptionSome<T>(oldValue);
    }

    zip<U>(other: Option<U>): Option<[T, U]> {
        if (other.is_some()) {
            return new OptionSome<[T, U]>([this.value, other.unwrap()]);
        }

        return new OptionNone<[T, U]>();
    }

    zip_with<U, R>(other: Option<U>, f: (val: T, other: U) => R): Option<R> {
        if (other.is_some()) {
            return new OptionSome<R>(f(this.value, other.unwrap()));
        }

        return new OptionNone<R>();
    }

    flatten<T extends Option<T>>(): Option<T> {
        if (this.value instanceof OptionSome) {
            // If the value is an OptionSome, we return it directly.
            return this.value;
        } else {
            // If the value is not an OptionSome (meaning it's an OptionNone or another type),
            // we return None<T>(). This assumes that None<T>() creates an OptionNone<T> instance.
            return None<T>();
        }
    }
}

export class OptionNone<T> implements IOption<T> {
    private readonly _tag: 'None' = 'None';
    private readonly _T!: T;

    is_some(): this is never {
        return false;
    }

    is_some_and(_f: (arg: T) => boolean): boolean {
        return false;
    }

    is_none(): this is OptionNone<T> {
        return true;
    }

    expect(msg: string): never {
        throw new Error(msg);
    }

    map<U>(_fn: (arg: any) => U): Option<U> {
        return this as any;
    }

    map_or<U>(defaultVal: U, _fn: (arg: T) => U): U {
        return defaultVal;
    }

    and<U>(_opt: Option<U>): Option<U> {
        return this as any;
    }

    and_then<U>(_fn: (arg: any) => Option<U>): Option<U> {
        return this as any;
    }

    filter(_predicate: (arg: T) => boolean): Option<T> {
        return this as any;
    }

    or<U>(opt: Option<U>): Option<U> {
        return opt;
    }

    or_else<U>(fn: () => Option<U>): Option<U> {
        return fn();
    }

    xor(optb: Option<T>): Option<T> {
        return optb;
    }

    unwrap(): never {
        throw new Error('Called Option.unwrap() on a None value');
    }

    unwrap_or(optb: any): any {
        return optb;
    }

    unwrap_or_else(fn: () => any): any {
        return fn();
    }

    unwrap_or_default(): T | null {
        return null as any;
    }

    take(): Option<T> {
        return this;
    }

    take_if(_predicate: (arg: T) => boolean): Option<T> {
        return this;
    }

    replace(value: T): Option<T> {
        return new OptionSome<T>(value);
    }

    zip<U>(other: Option<U>): Option<[T, U]> {
        return None<[T, U]>();
    }

    zip_with<U, R>(_other: Option<U>, _f: (val: T, other: U) => R): Option<R> {
        return None<R>();
    }

    flatten<T extends Option<T>>(): Option<T> {
        return this as any;
    }
}

export const Some = <T>(val: T): Option<T> => {
    return new OptionSome<T>(val);
};

export const None = <T>(): Option<T> => {
    return new OptionNone<T>();
};

export const option_from_nullable =
    <T>(val: T | null | undefined): Option<T> => {
        if (val === null || val === undefined) {
            return None<T>();
        }

        return Some(val);
    };

export const option_from_promise =
    <T>(promise: Promise<T>): Promise<Option<T>> =>
        promise.then(Some).catch(() => None<T>());