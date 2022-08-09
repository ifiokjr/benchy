use cfg_if::cfg_if;
mod utils;

cfg_if! {
  if #[cfg(feature = "wasm")] {
    pub mod wasm;
  }
}

cfg_if! {
  if #[cfg(feature = "ffi")] {
    pub mod ffi;
  }
}

cfg_if! {
  if #[cfg(feature = "deno")] {
    pub mod deno;
  }
}

cfg_if! {
  if #[cfg(feature = "node")] {
    pub mod node;
  }
}
