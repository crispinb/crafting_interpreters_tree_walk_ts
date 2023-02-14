// import { _assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import Scanner, { Error } from "./scanner.ts";
import Token from "./token.ts";

Deno.test(function basicScan() {
  const source = Deno.readTextFileSync("./temp_test.lox");
  const scanner = new Scanner(source);

  const [tokens, errors] = scanner.scanTokens();

  console.log("\nTokens: \n");
  display_arr(tokens);
  console.log("\nErrors: \n");
  display_arr(errors);

  // length has to account for extra EOF token
  // assertEquals(tokens.length, 7);
  // assertEquals(errors.length, 5);
});

function display_arr(tokens: Array<Token> | Array<Error>) {
  for (const token of tokens) {
    console.log(`${JSON.stringify(token)}`);
  }
}
