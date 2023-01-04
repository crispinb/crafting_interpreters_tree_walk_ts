import { readAllSync } from "https://deno.land/std@0.170.0/streams/read_all.ts";
import { writeAllSync } from "https://deno.land/std@0.170.0/streams/write_all.ts";

if (import.meta.main) {
  main(Deno.args);
}

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
  console.log(`running code:\n\n${source}`);
}
