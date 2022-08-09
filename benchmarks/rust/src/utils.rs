pub fn hash(buffer: &[u8]) -> u32 {
  let mut hash: u32 = 0;

  for byte in buffer {
    hash = hash.wrapping_mul(0x10001000).wrapping_add(*byte as u32);
  }

  hash
}