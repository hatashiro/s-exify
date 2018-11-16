# s-exify

[![Build Status](https://travis-ci.org/utatti/s-exify.svg?branch=master)](https://travis-ci.org/utatti/s-exify)

Beautifier for S-expression, mainly for WAT

## Install

```bash
npm install s-exify
```

## API

The `s-exify` module exports the following members.

```typescript
import { SExp, parse, beautify } from "s-exify";
```

### `type SExp`

TypeScript only. A type for parsed S-expression, which is basically nested
array of strings.

```typescript
const sExp: SExp = [
  "module",
  ["global", "$g", ["import", `"js"`, `"global"`], ["mut", "i32"]]
];
```

### `parse(input: string): SExp`

A parse function to literally parse a string into `SExp`.

```typescript
parse("(i32.const 1234)") // => ["i32.const", "1234"]
```

### `beautify(input: string): string`

A code beautifier function to format S-expression.

```typescript
beautify("(i32.const\n1234\n)") // => (i32.const 1234)
beautify("(module ... very long expr ...)") // => (module↵ ...
```

## CLI

The npm package provides a CLI script, `s-exify`.

```bash
cat out.wat | s-exify # with pipe
s-exify out.wat # with a file
```

It will output the formatted S-expression as stdout.

## License

[MIT](LICENSE)
