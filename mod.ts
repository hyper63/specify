type U = { ([x, string]: any): any };

type Valid = {
  ["@@type"]: "Valid";
  isFail: boolean;
  x: any;
  fold: { (f: U, g: U): any };
  concat: { (other: Valid): Valid };
};

type ValidationObject = {
  run: { (key: string, value: any): Valid };
  concat: { (other: ValidationObject): ValidationObject };
};

type ValidationFn = { (key: string, value: any): Valid };

const concat = (a: any, b: any): any => a.concat(b);
const foldMap = (fn: U, initial: any, list: any[]): any =>
  list.map(fn).reduce(concat, initial);

export const Success = (x: any): Valid => ({
  ["@@type"]: "Valid",
  isFail: false,
  x,
  fold: (f: U, g: U): any => g(x),
  concat: (other: Valid): Valid => other.isFail ? other : Success(x),
});

export const Fail = (x: any): Valid => ({
  ["@@type"]: "Valid",
  isFail: true,
  x,
  fold: (f: U, g: U): any => f(x),
  concat: (other: Valid): Valid =>
    other.isFail ? Fail(x.concat(other.x)) : Fail(x),
});

export const Validation = (run: ValidationFn): ValidationObject => ({
  run,
  concat: (other: ValidationObject): ValidationObject =>
    Validation(
      (k: string, v: any): Valid => run(k, v).concat(other.run(k, v)),
    ),
});

type Spec = {
  [x: string]: ValidationObject;
};

type AnyObject = {
  [x: string]: any;
};

export const validate = (spec: Spec, obj: AnyObject): Valid =>
  foldMap(
    (key: string): Valid => spec[key].run(key, obj[key]),
    Success(obj),
    Object.keys(spec),
  );

export const and = (...vs: ValidationObject[]): ValidationObject =>
  vs.reduce(concat);
export const or = (
  a: ValidationObject,
  b: ValidationObject,
): ValidationObject =>
  Validation((k: string, v: any): Valid => {
    const resultA = a.run(k, v);
    const resultB = b.run(k, v);
    return (resultA.isFail && resultB.isFail)
      ? Fail([resultA.x.concat(resultB.x).join(" or ")])
      : Success(v);
  });
