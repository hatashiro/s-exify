import { beautify } from "./";
import { readFile } from "fs";
import { promisify } from "util";

const read = promisify(readFile);

async function readFromPipe(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const stdin = process.openStdin();

    let data = "";
    stdin.on("data", chunk => {
      data += chunk.toString("utf-8");
    });

    stdin.on("error", err => reject(err));
    stdin.on("end", () => resolve(data));
  });
}

async function main(input?: string) {
  let str;

  if (input) {
    str = await read(input, "utf-8");
  } else {
    str = await readFromPipe();
  }

  console.log(beautify(str));
}

main(process.argv[2]).catch(err => {
  console.error(err);
  process.exit(1);
});
