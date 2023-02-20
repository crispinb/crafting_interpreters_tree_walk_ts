import { assertEquals } from "http://deno.land/std/testing/asserts.ts";
import Printer from "./ast_printer.ts";
import { Binary, Grouping, Literal, Unary } from "./classes.ts";
import Token from "../token.ts";

Deno.test(function testExpression() {
  const expression = new Binary(
    new Unary(
      new Token("MINUS", "-", null, 1),
      new Literal(123),
    ),
    new Token("STAR", "*", null, 1),
    new Grouping(new Literal(45.67)),
  );

  const printer = new Printer();

  assertEquals(printer.print(expression), "(* (- 123) (group 45.67))");
});
