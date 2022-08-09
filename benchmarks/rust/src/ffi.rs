use crate::utils;

#[no_mangle]
pub extern "C" fn noop() {
  // do nothing
}

#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// # Safety
///
/// Not really safe.
#[no_mangle]
pub unsafe extern "C" fn hash(ptr: *const u8, length: u32) -> u32 {
  return utils::hash(std::slice::from_raw_parts(ptr, length as usize));
}

