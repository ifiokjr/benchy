use napi::bindgen_prelude::Buffer;
use napi_derive::napi;
use crate::utils;

#[napi]
pub fn noop() {
  // do nothing
}

#[napi]
pub fn add(a: i32, b: i32) -> i32 {
  a + b
}

#[napi]
pub fn hash(buffer: Buffer) -> u32 {
  utils::hash(&buffer)
}
