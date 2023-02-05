import Token, { isToken, KEYWORDS, Literal, TokenType } from "./token.ts";

export default class Scanner {
  start = 0;
  current = 0;
  line = 1;
  source: string;
  tokens: Array<Token> = [];
  errors: Array<Error> = [];

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): [Array<Token>, Array<Error>] {
    while (!this.atEOF()) {
      this.start = this.current;
      this.pushTokenOrError(this.nextTokenCandidate());
    }

    this.pushTokenOrError(new Token("EOF", "", null, this.line));
    return [this.tokens, this.errors];
  }

  private pushTokenOrError(t: Token | Error | "NOOP") {
    if (t === "NOOP") return;
    if (isToken(t)) {
      this.tokens.push(t);
    } else {
      this.errors.push(t);
    }
  }

  private nextTokenCandidate(): Token | Error | "NOOP" {
    const c = this.advance();
    let tokenType: TokenType;
    let literal = null;
    switch (c) {
      case "(":
        tokenType = "LEFT_PAREN";
        break;
      case ")":
        tokenType = "RIGHT_PAREN";
        break;
      case "{":
        tokenType = "LEFT_BRACE";
        break;
      case "}":
        tokenType = "RIGHT_BRACE";
        break;
      case ",":
        tokenType = "COMMA";
        break;
      case ".":
        tokenType = "DOT";
        break;
      case "-":
        tokenType = "MINUS";
        break;
      case "+":
        tokenType = "PLUS";
        break;
      case ";":
        tokenType = "SEMICOLON";
        break;
      case "*":
        tokenType = "STAR";
        break;
      case "!":
        tokenType = this.match("=") ? "BANG_EQUAL" : "BANG";
        break;
      case "=":
        tokenType = this.match("=") ? "EQUAL_EQUAL" : "EQUAL";
        break;
      case "<":
        tokenType = this.match("=") ? "LESS_EQUAL" : "LESS";
        break;
      case ">":
        tokenType = this.match("=") ? "GREATER_EQUAL" : "GREATER";
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() != "\n") this.advance();
          return "NOOP";
        } else {
          tokenType = "SLASH";
        }
        break;
      case " ":
      case "\r":
      case "\t":
        return "NOOP";
      case "\n":
        this.line++;
        return "NOOP";
      case '"': {
        const tokenOrError = this.scanString();
        if (tokenOrError instanceof Error) return tokenOrError;
        [tokenType, literal] = tokenOrError;
        break;
      }
      default:
        if (isDigit(c)) {
          [tokenType, literal] = this.scanNumber();
          // identifiers / reserved words
        } else if (isAlphaNumeric(c)) {
          tokenType = this.scanIdentifierOrKeyword();
        } else return new Error(this.line, `${c} is not a valid lox token`);
    }

    return new Token(
      tokenType,
      this.source.substring(this.start, this.current),
      literal,
      this.line,
    );
  }

  private scanIdentifierOrKeyword(): TokenType {
    while (isAlphaNumeric(this.peek())) this.advance();
    const lexeme = this.source.substring(this.start, this.current)
      .toLowerCase();
    const keywordCandidate = KEYWORDS.get(lexeme);
    return keywordCandidate ?? "IDENTIFIER";
  }

  private scanString(): [TokenType, string] | Error {
    while (this.peek() != '"' && !this.atEOF()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }
    if (this.atEOF()) return new Error(this.line, "Unterminated string");
    this.advance();

    return ["STRING", this.source.substring(this.start + 1, this.current - 1)];
  }

  private scanNumber(): [TokenType, Literal] {
    while (isDigit(this.peek())) this.advance();
    if (this.peek() == "." && isDigit(this.peeknext())) {
      this.advance();
      while (isDigit(this.peek())) this.advance();
    }

    return [
      "NUMBER",
      parseFloat(this.source.substring(this.start, this.current)),
    ];
  }

  // get next char and advance cursor
  private advance(): string {
    return this.source[this.current++];
  }

  // 1 char lookahead
  private peek(): string | null {
    if (this.atEOF()) return null;
    return this.source[this.current];
  }

  // 2 char lookahead
  private peeknext(): string | null {
    if (this.current + 1 >= this.source.length) return null;
    return this.source[this.current + 1];
  }

  // confirm and advance cursor if expected is next
  // 1-char lookahead
  private match(expected: string): boolean {
    if (this.atEOF()) return false;
    if (this.source[this.current] != expected) return false;

    this.current++;
    return true;
  }

  private atEOF() {
    return this.current >= this.source.length - 1;
  }
}

function isDigit(d: string | null): boolean {
  return (d !== null) && ("0" <= d) && (d <= "9");
}

// for some reason a !== null short circuit didn't satisfy ts here
function isAlpha(d: string | null): boolean {
  if (d === null) return false;
  return (d >= "a" && d <= "z") ||
    (d >= "A" && d <= "Z") ||
    d == "_";
}

function isAlphaNumeric(d: string | null) {
  return isDigit(d) || isAlpha(d);
}

export class Error {
  line: number;
  message: string;

  constructor(line: number, message: string) {
    this.line = line;
    this.message = message;
  }
}
