import { SExp, parse, beautify } from "../";

test("parse", () => {
  const parseTest = (str: string, expected: SExp) =>
    expect(parse(str)).toEqual(expected);

  parseTest("()", []);
  parseTest("(i32.const 1234)", ["i32.const", "1234"]);
  parseTest("(i32.const\n1234\n)", ["i32.const", "1234"]);
  parseTest("(i32\\ const 1234)", ["i32\\ const", "1234"]);
  parseTest(`(data "hello, world!")`, ["data", `"hello, world!"`]);
  parseTest(
    `
    (module
      (global $g (import "js" "global") (mut i32))
      (func (export "getGlobal") (result i32)
            (get_global $g))
      (func (export "incGlobal")
            (set_global $g
                (i32.add (get_global $g) (i32.const 1))))
    )
  `,
    [
      "module",
      ["global", "$g", ["import", `"js"`, `"global"`], ["mut", "i32"]],
      [
        "func",
        ["export", `"getGlobal"`],
        ["result", "i32"],
        ["get_global", "$g"]
      ],
      [
        "func",
        ["export", `"incGlobal"`],
        [
          "set_global",
          "$g",
          ["i32.add", ["get_global", "$g"], ["i32.const", "1"]]
        ]
      ]
    ]
  );
});

test("beautify", () => {
  const beautifyTest = (str: string, expected: string) =>
    expect(beautify(str)).toEqual(expected);

  beautifyTest("()", "()");
  beautifyTest("(i32.const 1234)", "(i32.const 1234)");
  beautifyTest("(i32.const\n1234\n)", "(i32.const 1234)");
  beautifyTest("(i32\\ const 1234)", "(i32\\ const 1234)");
  beautifyTest(`(data "hello, world!")`, `(data "hello, world!")`);
  beautifyTest(
    `
    (module
      (global $g (import "js" "global") (mut i32))
      (func (export "getGlobal") (result i32)
            (get_global $g))
      (func (export "incGlobal")
            (set_global $g
                (i32.add (get_global $g) (i32.const 1))))
    )
  `,
    `(module
  (global $g (import "js" "global") (mut i32))
  (func (export "getGlobal") (result i32) (get_global $g))
  (func
    (export "incGlobal")
    (set_global $g (i32.add (get_global $g) (i32.const 1)))
  )
)`
  );
});
