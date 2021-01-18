/**
 *
 * concats two values together
 */
const concat = (a, b) => a.concat(b);
/**
 * foldMap is map then reduce which concats
 * two values
 */
const foldMap = (fn, initial, list) => list.map(fn).reduce(concat, initial);

export const Success = (x) => ({
  isFail: false,
  x,
  fold: (f, g) => g(x),
  concat: (other) => other.isFail ? other : Success(x),
});

export const Fail = (x) => ({
  isFail: true,
  x,
  fold: (f, g) => f(x),
  concat: (other) => other.isFail ? Fail(x.concat(other.x)) : Fail(x),
});

export const Validation = (run) => ({
  run,
  concat: (other) => Validation((k, v) => run(k, v).concat(other.run(k, v))),
});

export const validate = (spec, obj) =>
  foldMap(
    (key) => spec[key].run(key, obj[key]),
    Success(obj),
    Object.keys(spec),
  );

export const and = (...vs) => vs.reduce(concat);

export const or = (a, b) =>
  Validation((k, v) => {
    const resultA = a.run(k, v);
    const resultB = b.run(k, v);
    return (resultA.isFail && resultB.isFail)
      ? Fail([resultA.x.concat(resultB.x).join(" or ")])
      : Success(v);
  });
