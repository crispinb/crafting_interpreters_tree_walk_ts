import { parse } from "https://deno.land/std@0.177.0/flags/mod.ts";
import type { ClassData } from "./class_data.ts";
import classData from "./class_data.ts";

if (import.meta.main) {
  main(Deno.args);
}

function main(args: Array<string>) {
  const parsed = parse(args);
  const path: string = parsed["p"];
  const data = classData();
  createClassesFile(path, data);
}

// ❯ deno run -A ./ast/create_classes.ts fark fork -spark --snark sausage/on/a/stick
// youre running me with args {"_":["fark","fork"],"s":true,"p":true,"a":true,"r":true,"k":true,"snark":"sausage/on/a/stick"}
function createClassesFile(filepath: string, classesData: ClassData) {
  const classesAsString = write(classesData);
  Deno.writeTextFileSync(filepath, classesAsString);
}

function write(classData: ClassData): string {
  let subclasses = "";
  for (const [name, properties] of classData) {
    subclasses += writeSubclass(name, properties);
    subclasses += "\n\n";
  }
  return `${writeStart(classData)}\n${subclasses}\n${writeEnd()}`;
}

function writeStart(classData: Map<string, Map<string, string>>): string {
  let start = "";
  start += `\ninterface Visitor<R> {${writeInterfaces(classData)}}\n\n`;
  start += "\n";
  start +=
    `abstract class Expr {\n\tabstract accept<R>(visitor: Visitor<R>): R;\n}\n\n`;

  return start;
}

function writeInterfaces(classData: ClassData): string {
  let interfaces = "";
  for (const name of classData.keys()) {
    interfaces += `\n\tvisit${name}Expr(expr: ${name}): R;`;
  }
  interfaces += "\n";
  return interfaces;
}

function writeSubclass(
  name: string,
  properties: Map<string, string>,
): string {
  const props = [];
  for (const [name, type] of properties) {
    props.push(`public readonly ${name}: ${type}`);
  }
  const s = `class ${name} extends Expr {
    constructor(${props.join(", ")}) {
      super();
    }

    accept<R>(visitor: Visitor<R>): R {
      return visitor.visit${name}Expr(this);
    }
  }`;

  return s;
}

function writeEnd(): string {
  return `\n`;
}

export { type ClassData, createClassesFile, write };
