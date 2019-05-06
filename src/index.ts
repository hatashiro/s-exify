export interface SExp extends Array<string | SExp> {}

export function parse(input: string): SExp {
  let i = 0;

  const impl = () => {
    while (input[i].match(/\s/)) i++; // skip whitespaces
    if (input[i] === "(") {
      // drop '('
      i++;
    } else {
      throw new Error(
        `Input is not valid: unexpected '${input[i]}' at the beginning`
      );
    }

    const result: SExp = [];
    let node = "";

    while (true) {
      let c = input[i++];

      if (!c) {
        if (!node) {
          break;
        } else {
          throw new Error(
            `Input is not valid: unexpected '${node}' at the end`
          );
        }
      }

      if (c === ")") {
        if (node) result.push(node);
        break;
      } else if (c === "\\") {
        c += input[i++];
        node += c;
      } else if (c.match(/\s/)) {
        if (node) result.push(node);
        node = "";
      } else if (c === "(") {
        i--;
        result.push(impl());
      } else if (c === '"') {
        node += c;
        // parse string
        while ((c = input[i++])) {
          // skip \"
          if (c === "\\" && input[i] === '"') {
            c += input[i++];
          }
          node += c;
          if (c === '"') break;
        }
      } else {
        node += c;
      }
    }

    return result;
  };

  return impl();
}

function length(sExp: SExp): number {
  let sum = 0;
  for (const node of sExp) {
    sum += typeof node === "string" ? node.length : length(node);
  }
  return sum;
}

function indent(str: string): string {
  return str.replace(/^/gm, "  ");
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
