import { readAllSync } from "https://deno.land/std@0.170.0/streams/read_all.ts";
import { writeAllSync } from "https://deno.land/std@0.170.0/streams/write_all.ts";
import Scanner from "./scanner.ts";

if (import.meta.main) {
  main(Deno.args);
}

// TODO: as a class member, or keep functional with an error return?
// static const hadError = false;

function main(args: string[]) {
  if (args.length > 1) {
    console.log("Usage: deno jlox [filename]");
    Deno.exit(64);
  } else if (args.length == 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
}

function runFile(filePath: string) {
  const source = Deno.readTextFileSync(filePath);
  run(source);
}

function runPrompt() {
  const prompt = new TextEncoder().encode("> ");
  writeAllSync(Deno.stdout, prompt);
  const buffer = readAllSync(Deno.stdin);
  const thingo: string = new TextDecoder().decode(buffer);
  run(thingo);
}

function run(source: string) {
  const scanner = new Scanner(source);
  const [_tokens, errors] = scanner.scanTokens();

  if (errors.length > 0) {
    console.error(`Errors:\n`);
    for (const error of errors) {
      console.log(`${JSON.stringify(error)}`);
    }
    Deno.exit(65);
  }
}

function _error(line: number, message: string) {
  reportError(line, "", message);
}

function reportError(line: number, where: string, message: string) {
  console.log(`Error (line ${line} at ${where}): ${message}`);
}
