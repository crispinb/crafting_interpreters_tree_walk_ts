export function isToken(val: unknown): val is Token {
  return val instanceof Token;
}

export default class Token {
  type: TokenType;
  line: number;
  literal: Literal | null;
  lexeme: string;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: Literal | null,
    line: number,
  ) {
    // initialisations in constructor are required by 'strict', which deno defaults to
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}
export type Literal = string | number;

export type TokenType =
  // Single-character tokens.
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "LEFT_BRACE"
  | "RIGHT_BRACE"
  | "COMMA"
  | "DOT"
  | "MINUS"
  | "PLUS"
  | "SEMICOLON"
  | "SLASH"
  | "STAR"
  // One or two character tokens.
  | "BANG"
  | "BANG_EQUAL"
  | "EQUAL"
  | "EQUAL_EQUAL"
  | "GREATER"
  | "GREATER_EQUAL"
  | "LESS"
  | "LESS_EQUAL"
  // Literals.
  | "IDENTIFIER"
  | "STRING"
  | "NUMBER"
  // Keywords.
  | "AND"
  | "CLASS"
  | "ELSE"
  | "FALSE"
  | "FUN"
  | "FOR"
  | "IF"
  | "NIL"
  | "OR"
  | "PRINT"
  | "RETURN"
  | "SUPER"
  | "THIS"
  | "TRUE"
  | "VAR"
  | "WHILE"
  | "EOF";

export const keywords = new Map<string, TokenType>([
  ["and", "AND"],
  ["class", "CLASS"],
  ["else", "ELSE"],
  ["false", "FALSE"],
  ["fun", "FUN"],
  ["for", "FOR"],
  ["if", "IF"],
  ["nil", "NIL"],
  ["or", "OR"],
  ["print", "PRINT"],
  ["return", "RETURN"],
  ["super", "SUPER"],
  ["this", "THIS"],
  ["true", "TRUE"],
  ["var", "VAR"],
  ["while", "WHILE"],
  ["eof", "EOF"],
  ["eof", "EOF"],
]);
