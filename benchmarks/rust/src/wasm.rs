use wasm_bindgen::prelude::wasm_bindgen;


use crate::utils;

#[wasm_bindgen]
pub fn noop() {
  // do nothing
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  a + b
}

#[wasm_bindgen]
pub fn hash(buffer: &[u8]) -> u32 {
  utils::hash(buffer)
}
