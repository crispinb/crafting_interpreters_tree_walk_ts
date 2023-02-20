import Token from '../token.ts';


export interface Visitor<R> {
	visitBinaryExpr(expr: Binary): R;
	visitGroupingExpr(expr: Grouping): R;
	visitLiteralExpr(expr: Literal): R;
	visitUnaryExpr(expr: Unary): R;
}


export abstract class Expr {
	abstract accept<R>(visitor: Visitor<R>): R;
}


export class Binary extends Expr {
    constructor(public readonly left: Expr, public readonly operator: Token, public readonly right: Expr) {
      super();
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visitBinaryExpr(this);
    }
  }

export class Grouping extends Expr {
    constructor(public readonly expression: Expr) {
      super();
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visitGroupingExpr(this);
    }
  }

export class Literal extends Expr {
    constructor(public readonly value: string|number|null) {
      super();
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visitLiteralExpr(this);
    }
  }

export class Unary extends Expr {
    constructor(public readonly operator: Token, public readonly right: Expr) {
      super();
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visitUnaryExpr(this);
    }
  }



