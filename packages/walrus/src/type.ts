type testFn = (value: any) => boolean;

enum TypeEnum {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  symbol = 'symbol',
  array = 'array',
  map = 'map',
  object = 'object',
  set = 'set',
  null = 'null',
  undefined = 'undefined',
  function = 'function'
}

enum FormEnum {
  scalar = 'scalar',
  array = 'array',
  map = 'map',
  object = 'object',
  set = 'set',
  function = 'function',
  container = 'container',
  void = 'void',
}

enum TypeofEnum {
  undefined = "undefined",
  object = "object",
  boolean = "boolean",
  number = "number",
  bigint = "bigint",
  string = "string",
  symbol = "symbol",
  function = "function"
}

enum NumberEnum {
  infinite = "infinite",
  nan = "nan",
  integer = "integer",
  decimal = "decimal",
}

class TypeDef {
  constructor(public readonly type: TypeEnum, public readonly form: FormEnum,
              public readonly typeOf: TypeofEnum,
              private test?: testFn) {
  }

  /**
   * A very flat subspecies of FormEnum -- includes either 'void', 'scalar', 'function', or 'container'
   */
  get family() {
    if ([FormEnum.scalar, FormEnum.void, FormEnum.function].includes(this.form)) {
      return this.form;
    }
    return FormEnum.container;
  }

  includes(value: any, typeOf?: TypeofEnum | string): boolean {
    if (!typeOf) {
      return this.includes(value, typeof value);
    }
    if (typeOf !== this.typeOf) {
      return false;
    }
    if (this.test && !this.test(value)) {
      return false;
    }
    return true; // same type as typeof, and no test to fail OR passed test
  }
}

export const types: TypeDef[] = [
  new TypeDef(TypeEnum.undefined, FormEnum.void, TypeofEnum.undefined),
  new TypeDef(TypeEnum.null, FormEnum.void, TypeofEnum.object, (s) => s === null),
  new TypeDef(TypeEnum.boolean, FormEnum.scalar, TypeofEnum.boolean),
  new TypeDef(TypeEnum.string, FormEnum.scalar, TypeofEnum.string),
  new TypeDef(TypeEnum.number, FormEnum.scalar, TypeofEnum.number),
  new TypeDef(TypeEnum.number, FormEnum.scalar, TypeofEnum.bigint),
  new TypeDef(TypeEnum.symbol, FormEnum.scalar, TypeofEnum.symbol),
  new TypeDef(TypeEnum.function, FormEnum.function, TypeofEnum.function),
  new TypeDef(TypeEnum.array, FormEnum.array, TypeofEnum.object, (v) => Array.isArray(v)),
  new TypeDef(TypeEnum.map, FormEnum.map, TypeofEnum.object, (m) => m instanceof Map),
  new TypeDef(TypeEnum.set, FormEnum.set, TypeofEnum.object, (s) => s instanceof Set),
  new TypeDef(TypeEnum.object, FormEnum.object, TypeofEnum.object, (o) => o && (typeof o === 'object')),
]

export const describe = (value: any, reflect = false): TypeDef | TypeEnum => {
  if (reflect) {
    const t = describe(value);
    if (typeof t === 'object') {
      if (reflect === true) {
        return t.type;
      }
      if (typeof reflect === 'string') {
        return t[reflect]
      }
    }
    return t;
  }
  const type: keyof typeof TypeofEnum = typeof (value);
  for (let i = 0; i < types.length; ++i) {
    const def = types[i];
    if (def.includes(value, TypeofEnum[type])) {
      return def;
    }
  }
  console.error('describe failure to analyze', value);
  throw new Error('cannot analyze value');
}

export const describeNumber = (value: any) => {
  if (['number', 'bigint'].includes(typeof value)) {
    if (Number.isFinite(value)) {
      if (Number.isInteger(value)) {
        return NumberEnum.integer;
      } else {
        return NumberEnum.decimal;
      }
    } else {
      return NumberEnum.infinite
    }
  }
  return NumberEnum.nan;
}
