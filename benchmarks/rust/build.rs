#[cfg(feature="napi")]
use napi_build::setup;

fn main() {
  #[cfg(feature="napi")] setup();
}