export function basic() {
  class A {}
  return new A();
}

export function inheritance() {
  class A {}
  class B extends A {}
  class C extends B {}
  class D extends C {}
  class E extends D {}
  class F extends E {}
  class G extends F {}
  class H extends G {}
  class I extends H {}
  class J extends I {}
  class K extends J {}
  class L extends K {}
  class M extends L {}
  class N extends M {}
  class O extends N {}
  class P extends O {}
  class Q extends P {}
  class R extends Q {}
  class S extends R {}
  class T extends S {}
  class U extends T {}
  class V extends U {}
  class W extends V {}
  class X extends W {}
  class Y extends X {}
  class Z extends Y {}
  return new Z();
}

export function staticProperties() {
  class A {
    static bar = "bar";
    static foo() {
      return "foo";
    }
  }

  return new A();
}

export function kitchenSink() {
  class A {}
  class B extends A {
    static bar = "bar";
    static foo() {
      return "foo";
    }
    static get getter() {
      return "getter";
    }

    #z = "z";
    q = {};
    get z() {
      return "z";
    }

    constructor(a, b) {
      super();
      this.a = a;
      this.b = b;
    }

    foo = () => {
      return this.a;
    };

    bar() {
      return this.b;
    }

    #other() {
      return this.#z;
    }
  }

  return new B();
}
