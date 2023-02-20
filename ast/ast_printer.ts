import * as AST from "./classes.ts";

export default class AstPrinter implements AST.Visitor<string> {
  print(expr: AST.Expr): string {
    return expr.accept(this);
  }

  visitLiteralExpr(expr: AST.Literal): string {
    if (!expr.value) return "nil";
    if (typeof expr.value === "number") return expr.value.toString();
    return expr.value;
  }

  visitUnaryExpr(expr: AST.Unary): string {
    return this.parenthesise(expr.operator.lexeme, expr.right);
  }

  visitBinaryExpr(expr: AST.Binary): string {
    return this.parenthesise(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: AST.Grouping): string {
    return this.parenthesise("group", expr.expression);
  }

  parenthesise(name: string, ...exprs: Array<AST.Expr>): string {
    let result = `(${name}`;
    for (const expr of exprs) {
      result += ` ${expr.accept(this)}`;
    }
    return result + ")";
  }

  // visitAssignExpr(expr: AST.Assign): string {
  // visitBinaryExpr(expr: Binary): R;
  // visitCallExpr(expr: Call): R;
  // visitGetExpr(expr: Get): R;
  // visitGroupingExpr(expr: Grouping): R;
  // visitLiteralExpr(expr: Literal): R;
  // visitLogicalExpr(expr: Logical): R;
  // visitSetExpr(expr: Set): R;
  // visitSuperExpr(expr: Super): R;
  // visitThisExpr(expr: This): R;
  // visitUnaryExpr(expr: Unary): R;
  // visitVariableExpr(expr: Variable): R;
  // visitExpressionExp(expr: Expression): R;
  // visitPrintExpr(expr: Print): R;
  // visitReturnExpr(expr: Return): R;
  // visitVarExpr(expr: Var): R;
}
