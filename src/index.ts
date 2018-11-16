export interface SExp extends Array<string | SExp> {}

export function parse(input: string | Array<string>): SExp {
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

  const result: SExp = [];
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

function length(sExp: SExp): number {
  return sExp.reduce(
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

function stringify(node: string | SExp) {
  return typeof node === "string" ? node : beautify(node);
}

export function beautify(sExp: string | SExp): string {
  sExp = typeof sExp === "string" ? parse(sExp) : sExp;

  if (length(sExp) < 50) {
    return `(${sExp.map(stringify).join(" ")})`;
  } else {
    return (
      `(${sExp[0]}\n` +
      sExp
        .slice(1)
        .map(stringify)
        .map(indent)
        .join("\n") +
      "\n)"
    );
  }
}
