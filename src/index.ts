export interface WAT extends Array<string | WAT> {}

export function parse(input: string | Array<string>): WAT {
  // convert input to an array of characters
  input = typeof input === "string" ? Array.from(input) : input;

  while (input[0].match(/\s/)) input.shift(); // skip whitespaces
  if (input[0] === "(") {
    // drop '('
    input.shift();
  } else {
    throw new Error(
      `Input is not valid: unexpected '${input[0]}' at the beginning`
    );
  }

  const result: WAT = [];
  let node = "";

  while (true) {
    let c = input.shift();

    if (!c) {
      if (!node) {
        break;
      } else {
        throw new Error(`Input is not valid: unexpected '${node}' at the end`);
      }
    }

    if (c === ")") {
      if (node) result.push(node);
      break;
    } else if (c === "\\") {
      c += input.shift();
      node += c;
    } else if (c.match(/\s/)) {
      if (node) result.push(node);
      node = "";
    } else if (c === "(") {
      input.unshift(c);
      result.push(parse(input));
    } else if (c === '"') {
      node += c;
      // parse string
      while ((c = input.shift())) {
        // skip \"
        if (c === "\\" && input[0] === '"') {
          c += input.shift();
        }
        node += c;
        if (c === '"') break;
      }
    } else {
      node += c;
    }
  }

  return result;
}

function length(wat: WAT): number {
  return wat.reduce(
    (res, node) =>
      res + (typeof node === "string" ? node.length : length(node)),
    0
  );
}

function indent(str: string): string {
  return str
    .split("\n")
    .map(s => "  " + s)
    .join("\n");
}

function stringify(node: string | WAT) {
  return typeof node === "string" ? node : beautify(node);
}

export function beautify(wat: string | WAT): string {
  wat = typeof wat === "string" ? parse(wat) : wat;

  if (length(wat) < 50) {
    return `(${wat.map(stringify).join(" ")})`;
  } else {
    return (
      `(${wat[0]}\n` +
      wat
        .slice(1)
        .map(stringify)
        .map(indent)
        .join("\n") +
      "\n)"
    );
  }
}
