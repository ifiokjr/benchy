#![allow(clippy::not_unsafe_ptr_arg_deref)]

use deno_bindgen::deno_bindgen;
use crate::utils;

#[deno_bindgen]
fn noop() {
  // do nothing
}

#[deno_bindgen]
fn add(a: i32, b: i32) -> i32 {
  a + b
}

#[deno_bindgen]
fn hash(buffer: &[u8]) -> u32 {
  utils::hash(buffer)
}
