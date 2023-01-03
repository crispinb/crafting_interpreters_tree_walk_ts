// Learn more at https://deno.land/manual/examples/module_metadata#concepts
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

function runFile(fileName: string){
    console.log(`Run file ${fileName} TODO`);
}

function runPrompt(){
    console.log("Run prompt TODO");
}
