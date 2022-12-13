# WALRUS

Walrus is a medley of utilities I keep on needing or using, so here I am centralizing
them for consistency.

## Text functions

### addBefore/addAfter(base: string, append: string) : string

Routines for ensuring or removing a phrase (such asd a domain) in front of or after a string

### humanize (phrase: string) => string

This is for "breaking up" parameters or SQL fields into sentence form by replacing "_-" with
single spaces

### ucFirst (phrase: string) => string

Replaces the first letter in a string with an uppercase character

### entitle (phrase: string) => string

This is a blend of humanize and ucFirst; it splits strings into sentence form then
capitalizes each word.

## Type functions: describe (value: any) => TypeDef

The 'typeof' paradigm is too coarse for some purposes and too broad for others. While
Typescript does a good job of static checking, many times, values are not fixed at design
time, so its good to know precisely what they are at runtime.

The main utility of the type library is describe(value) which takes in any value
and returns a TypeDef describer.

TypeDef has the following API:

```

{
type: string
typeOf: string
form: string
family: string
}

```

* **type** is the richest descriptor; it includes the set 'string','number','boolean','symbol','array','map','object','set','null','undefined','function'
* **typeOf** is exactly the same result as the `typeof` operator
* **form** compresses all the scalar types into the descriptor 'scalar' and undefined and null are both considered 'void'
* **family** considers all the advanced types (array, Map) to be 'container' So it has one of three values: 'scalar', 'container', 'void'.

you can extract the type of the typedef (to a string) by passing `true` to the second argument, or
you can extract a named field by passing it as a string.

**Examples:**

```
type.describe(null) =  {"type":"null","form":"void","typeOf":"object"}
type.describe(3) =  {"type":"number","form":"scalar","typeOf":"number"}
type.describe([]) =  {"type":"array","form":"array","typeOf":"object"}

type.describe(null, true) =  "null"
type.describe(3, true) =  "number"
type.describe([], true) =  "array"

type.describe(null, "family") =  "void"
type.describe(3, "family") =  "scalar"
type.describe([], "family") =  "container"
```

### describeNumber (value) => string

returns one of a possible value describing a (potentially) numeric value in detail: 'integer','decimal','infinite','nan'.
