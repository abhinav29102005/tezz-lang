#!/usr/bin/env node

// ⚡ Tezz (तेज़) — CLI
// The Fast Backend Language
// Created by Abhinav

const fs = require('fs');
const path = require('path');
const { Lexer } = require('../src/lexer');
const { Parser } = require('../src/parser');
const { CodeGenerator } = require('../src/codegen');

const VERSION = '0.1.1';

const BANNER = `
  \x1b[1m\x1b[33m⚡ Tezz\x1b[0m \x1b[2m(तेज़)\x1b[0m \x1b[36mv${VERSION}\x1b[0m
  \x1b[2mA Fast Backend Language\x1b[0m
  \x1b[2mCreated by Abhinav\x1b[0m
`;

const HELP = `${BANNER}
  \x1b[1mUsage:\x1b[0m  tezz <command> [options] <file>

  \x1b[1mCommands:\x1b[0m
    run   <file.tezz>           Compile and run a Tezz file
    build <file.tezz>           Compile to JavaScript
    init                        Create a new Tezz project

  \x1b[1mOptions:\x1b[0m
    --target <node|worker>      Output target (default: node)
    --output <file.js>          Output file path
    --help, -h                  Show help
    --version, -v               Show version

  \x1b[1mExamples:\x1b[0m
    tezz run app.tezz
    tezz build app.tezz --target worker
    tezz build app.tezz --target worker --output dist/worker.js
    tezz init
`;

// --- Compiler Pipeline ---

function compile(source, options = {}) {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();

  const codegen = new CodeGenerator(ast, options);
  return codegen.generate();
}

// --- Commands ---

function cmdRun(file, options) {
  if (!fs.existsSync(file)) {
    console.error(`\x1b[31m  ✗ File not found: ${file}\x1b[0m`);
    process.exit(1);
  }

  const source = fs.readFileSync(file, 'utf-8');

  try {
    const jsCode = compile(source, { target: 'node' });

    // Write to .tezz/ temp directory
    const tmpDir = path.join(path.dirname(path.resolve(file)), '.tezz');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tmpFile = path.join(tmpDir, path.basename(file, '.tezz') + '.compiled.js');
    fs.writeFileSync(tmpFile, jsCode);

    console.log(BANNER);
    console.log(`  \x1b[32m✓\x1b[0m Compiled \x1b[1m${file}\x1b[0m`);
    console.log(`  \x1b[32m✓\x1b[0m Starting server...\n`);

    // Execute
    const { spawn } = require('child_process');
    const child = spawn(process.execPath, [tmpFile], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('error', (err) => {
      console.error(`\x1b[31m  ✗ Failed to start: ${err.message}\x1b[0m`);
      process.exit(1);
    });

    child.on('exit', (code) => {
      process.exit(code || 0);
    });

    // Forward signals
    process.on('SIGINT', () => { child.kill('SIGINT'); });
    process.on('SIGTERM', () => { child.kill('SIGTERM'); });

  } catch (err) {
    console.error(BANNER);
    console.error(`  \x1b[31m✗ Compilation Error:\x1b[0m\n`);
    console.error(`    ${err.message}\n`);
    process.exit(1);
  }
}

function cmdBuild(file, options) {
  if (!fs.existsSync(file)) {
    console.error(`\x1b[31m  ✗ File not found: ${file}\x1b[0m`);
    process.exit(1);
  }

  const source = fs.readFileSync(file, 'utf-8');
  const target = options.target || 'node';

  try {
    const jsCode = compile(source, { target });

    const outputFile = options.output || file.replace(/\.tezz$/, '.js');

    // Ensure output directory exists
    const outDir = path.dirname(outputFile);
    if (outDir && !fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(outputFile, jsCode);

    console.log(BANNER);
    console.log(`  \x1b[32m✓\x1b[0m Compiled \x1b[1m${file}\x1b[0m → \x1b[1m${outputFile}\x1b[0m`);
    console.log(`  \x1b[32m✓\x1b[0m Target: \x1b[36m${target}\x1b[0m`);
    console.log(`  \x1b[32m✓\x1b[0m Size: ${(Buffer.byteLength(jsCode) / 1024).toFixed(1)} KB\n`);

    if (target === 'worker') {
      console.log(`  \x1b[2mDeploy to Cloudflare Workers:\x1b[0m`);
      console.log(`    npx wrangler deploy ${outputFile}\n`);
    } else {
      console.log(`  \x1b[2mRun with:\x1b[0m`);
      console.log(`    node ${outputFile}\n`);
    }

  } catch (err) {
    console.error(BANNER);
    console.error(`  \x1b[31m✗ Compilation Error:\x1b[0m\n`);
    console.error(`    ${err.message}\n`);
    process.exit(1);
  }
}

function cmdInit() {
  console.log(BANNER);

  const appContent = `-- ⚡ Welcome to Tezz!
-- Your first Tezz service

service App on 3000 {

  route GET "/" {
    respond 200 {
      message: "Hello from Tezz! ⚡",
      version: "0.1.0",
      status: "running"
    }
  }

  route GET "/health" {
    respond 200 { healthy: true, uptime: "ok" }
  }

}
`;

  fs.writeFileSync('app.tezz', appContent);
  console.log(`  \x1b[32m✓\x1b[0m Created \x1b[1mapp.tezz\x1b[0m\n`);
  console.log(`  \x1b[2mGet started:\x1b[0m`);
  console.log(`    tezz run app.tezz`);
  console.log(`    tezz build app.tezz --target worker\n`);
}

// --- Argument Parsing ---

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(HELP);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(`tezz v${VERSION}`);
  process.exit(0);
}

const command = args[0];
const options = {};

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    options.target = args[++i];
  } else if (args[i] === '--output' && args[i + 1]) {
    options.output = args[++i];
  } else if (!args[i].startsWith('-')) {
    options.file = options.file || args[i];
  }
}

switch (command) {
  case 'run':
    if (!options.file) { console.error('Usage: tezz run <file.tezz>'); process.exit(1); }
    cmdRun(options.file, options);
    break;
  case 'build':
    if (!options.file) { console.error('Usage: tezz build <file.tezz>'); process.exit(1); }
    cmdBuild(options.file, options);
    break;
  case 'init':
    cmdInit();
    break;
  default:
    if (fs.existsSync(command) && command.endsWith('.tezz')) {
      cmdRun(command, options);
    } else {
      console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
      console.log(HELP);
      process.exit(1);
    }
}
