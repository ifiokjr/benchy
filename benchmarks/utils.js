class AssertionError extends Error {
  name = "AssertionError";
  constructor(message) {
    super(message);
  }
}

/**
 * @param {unknown} value
 * @returns {asserts value}
 */
export function assert(value) {
  if (!value) {
    throw new AssertionError(`The value provided: '${value}' is not truthy.`);
  }
}
