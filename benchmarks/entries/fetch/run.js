/**
 * @param {import('./setup.ts').Setup} props
 */
export async function json(props) {
  const response = await fetch(`http://localhost:${props.port}/json`);
  return await response.json();
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function text(props) {
  const response = await fetch(`http://localhost:${props.port}/text`);
  return await response.text();
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function formData(props) {
  const response = await fetch(`http://localhost:${props.port}/form`);
  return await response.formData();
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function error(props) {
  const response = await fetch(`http://localhost:${props.port}/fail`);
  return response.status;
}
