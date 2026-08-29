#!/usr/bin/env node

// Tezz (तेज़) — CLI
// The Fast Backend Language
// Created by Abhinav

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const { Lexer } = require('../src/lexer');
const { Parser } = require('../src/parser');
const { CodeGenerator } = require('../src/codegen');

const VERSION = '0.2.0';

const ASCII_LOGO = `
  \x1b[1m\x1b[33m  ████████╗███████╗███████╗███████╗\x1b[0m
  \x1b[1m\x1b[33m  ╚══██╔══╝██╔════╝╚══███╔╝╚══███╔╝\x1b[0m
  \x1b[1m\x1b[36m     ██║   █████╗    ███╔╝   ███╔╝ \x1b[0m
  \x1b[1m\x1b[36m     ██║   ██╔══╝   ███╔╝   ███╔╝  \x1b[0m
  \x1b[1m\x1b[36m     ██║   ███████╗███████╗███████╗\x1b[0m
  \x1b[1m\x1b[36m     ╚═╝   ╚══════╝╚══════╝╚══════╝\x1b[0m
`;

const BANNER = `${ASCII_LOGO}
  \x1b[1m\x1b[33mTezz\x1b[0m \x1b[2m(तेज़)\x1b[0m \x1b[36mv${VERSION}\x1b[0m
  \x1b[2mA Fast Backend Language\x1b[0m
  \x1b[2mOfficially created by Abhinav\x1b[0m
`;

const HELP = `${BANNER}
  \x1b[1mUsage:\x1b[0m  tezz <command> [options] <file>

  \x1b[1mCommands:\x1b[0m
    run   <file.tezz>           Compile and run a Tezz file
    dev   <file.tezz>           Run with hot-reload (watches for changes)
    deploy <file.tezz>          Deploy natively to Cloudflare Edge\n    build <file.tezz>           Compile to JavaScript
    init                        Create a new Tezz project
    repl                        Start the interactive Tezz REPL

  \x1b[1mOptions:\x1b[0m
    --target <node|worker>      Output target (default: node)
    --output <file.js>          Output file path
    --help, -h                  Show help
    --version, -v               Show version

  \x1b[1mExamples:\x1b[0m
    tezz run app.tezz
    tezz dev app.tezz
    tezz deploy app.tezz
    tezz build app.tezz --target worker
    tezz init
    tezz repl
`;

// --- Error Handling ---

function printError(err, source, file) {
  console.error(BANNER);
  console.error(`  \x1b[31m✗ Tezz Error in ${file}:[0m\n`);
  
  if (err.message.includes('Line')) {
    const match = err.message.match(/Line (\d+)/);
    if (match && source) {
      const lineNum = parseInt(match[1]);
      const lines = source.split('\n');
      const start = Math.max(0, lineNum - 2);
      const end = Math.min(lines.length, lineNum + 1);
      
      for (let i = start; i < end; i++) {
        if (i === lineNum - 1) {
          console.error(`  \x1b[31m▸ ${i + 1} │  ${lines[i]}\x1b[0m`);
        } else {
          console.error(`    ${i + 1} │  ${lines[i]}`);
        }
      }
      console.error();
    }
  }
  console.error(`    ${err.message}\n`);
}

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

function cmdRun(file, options, isDev = false) {
  if (!fs.existsSync(file)) {
    console.error(`\x1b[31m  ✗ File not found: ${file}\x1b[0m`);
    process.exit(1);
  }

  let child;
  
  function start() {
    const source = fs.readFileSync(file, 'utf-8');

    try {
      const jsCode = compile(source, { target: 'node' });

      const tmpDir = path.join(path.dirname(path.resolve(file)), '.tezz');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      const tmpFile = path.join(tmpDir, path.basename(file, '.tezz') + '.compiled.js');
      fs.writeFileSync(tmpFile, jsCode);

      if (!isDev) {
        console.log(BANNER);
        console.log(`  \x1b[32m✓\x1b[0m Compiled \x1b[1m${file}\x1b[0m`);
        console.log(`  \x1b[32m✓\x1b[0m Starting server...\n`);
      } else {
        console.log(`\x1b[32m[Tezz Dev]\x1b[0m Restarting server...`);
      }

      child = spawn(process.execPath, [tmpFile], {
        stdio: 'inherit',
        cwd: process.cwd(),
      });

      child.on('error', (err) => {
        console.error(`\x1b[31m  ✗ Failed to start: ${err.message}\x1b[0m`);
        if (!isDev) process.exit(1);
      });

      if (!isDev) {
        child.on('exit', (code) => {
          process.exit(code || 0);
        });
      }

    } catch (err) {
      printError(err, source, file);
      if (!isDev) process.exit(1);
    }
  }
  
  if (isDev) {
    console.log(BANNER);
    console.log(`  \x1b[36m⟳\x1b[0m Hot-reload enabled for \x1b[1m${file}\x1b[0m\n`);
    start();
    
    let debounce;
    fs.watch(file, (eventType) => {
      if (eventType === 'change') {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          if (child) child.kill();
          start();
        }, 300);
      }
    });
  } else {
    start();
    process.on('SIGINT', () => { if (child) child.kill('SIGINT'); });
    process.on('SIGTERM', () => { if (child) child.kill('SIGTERM'); });
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
    printError(err, source, file);
    process.exit(1);
  }
}


function cmdDeploy(file, options) {
  if (!fs.existsSync(file)) {
    console.error(`\x1b[31m  ✗ File not found: ${file}\x1b[0m`);
    process.exit(1);
  }

  const source = fs.readFileSync(file, 'utf-8');
  const target = 'worker';
  const name = options.name || path.basename(file, '.tezz');
  
  try {
    const jsCode = compile(source, { target });
    
    // Create hidden directory
    const tmpDir = path.join(path.dirname(path.resolve(file)), '.tezz');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    
    const outputFile = path.join(tmpDir, 'worker.js');
    fs.writeFileSync(outputFile, jsCode);
    
    console.log(BANNER);
    console.log(`  \x1b[32m✓\x1b[0m Compiled \x1b[1m${file}\x1b[0m globally in memory`);
    console.log(`  \x1b[32m✓\x1b[0m Target: \x1b[36mcloudflare-worker\x1b[0m`);
    console.log(`  \x1b[32m✓\x1b[0m Size: ${(Buffer.byteLength(jsCode) / 1024).toFixed(1)} KB\n`);
    
    console.log(`  \x1b[36mDeploying ${name} to Cloudflare Edge...\x1b[0m\n`);
    
    const child = spawn('npx', ['-y', 'wrangler', 'deploy', outputFile, '--name', name, '--compatibility-date', '2024-01-01'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    child.on('exit', (code) => {
      // Cleanup
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
      if (code === 0) {
        console.log(`\n  \x1b[32m✓ Successfully deployed ${name} worldwide!\x1b[0m\n`);
      } else {
        console.error(`\n  \x1b[31m✗ Deployment failed.\x1b[0m\n`);
      }
      process.exit(code || 0);
    });
    
  } catch (err) {
    printError(err, source, file);
    process.exit(1);
  }
}

function cmdInit() {
  console.log(BANNER);

  const appContent = `-- Welcome to Tezz v0.2.0!
-- Your first Tezz service (Hinglish/English syntax supported)

seva App on 3000 {

  route GET "/" {
    rakho message = "Namaste from Tezz! "
    jawab 200 {
      message: message,
      version: "0.2.0",
      status: "running"
    }
  }

  rasta GET "/health" {
    respond 200 { healthy: sahi, uptime: "ok" }
  }

}
`;

  fs.writeFileSync('app.tezz', appContent);
  console.log(`  \x1b[32m✓\x1b[0m Created \x1b[1mapp.tezz\x1b[0m\n`);
  console.log(`  \x1b[2mGet started:\x1b[0m`);
  console.log(`    tezz dev app.tezz`);
  console.log(`    tezz build app.tezz --target worker\n`);
}

function cmdRepl() {
  console.log(BANNER);
  console.log(`  \x1b[36mType 'exit' to quit.\x1b[0m\n`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[33mtezz>\x1b[0m '
  });

  rl.prompt();

  rl.on('line', (line) => {
    line = line.trim();
    if (line === 'exit' || line === 'quit') {
      process.exit(0);
    }
    if (line === '') {
      rl.prompt();
      return;
    }
    
    try {
      // Very basic REPL compilation
      const jsCode = compile(line, { target: 'node' });
      // Strip out comments and imports, just run the logic
      const runnable = jsCode.replace(/\/\/.*\n/g, '');
      const result = eval(runnable);
      if (result !== undefined) {
         console.log(result);
      }
    } catch (err) {
      console.error(`\x1b[31mError: ${err.message}\x1b[0m`);
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
}

// --- Argument Parsing ---

const args = process.argv.slice(2);

// Load .env silently
try {
  if (fs.existsSync('.env')) {
    if (process.loadEnvFile) {
      process.loadEnvFile();
    } else {
      const envFile = fs.readFileSync('.env', 'utf-8');
      envFile.split('\n').forEach(line => {
        const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
        if (match) {
          let val = match[2].trim();
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          process.env[match[1]] = val;
        }
      });
    }
  }
} catch (e) {}

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
  if (args[i] === '--name' && args[i + 1]) {
    options.name = args[++i];
  } else if (args[i] === '--target' && args[i + 1]) {
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
    cmdRun(options.file, options, false);
    break;
  case 'dev':
    if (!options.file) { console.error('Usage: tezz dev <file.tezz>'); process.exit(1); }
    cmdRun(options.file, options, true);
    break;
  case 'deploy':
    if (!options.file) { console.error('Usage: tezz deploy <file.tezz>'); process.exit(1); }
    cmdDeploy(options.file, options);
    break;
  case 'build':
    if (!options.file) { console.error('Usage: tezz build <file.tezz>'); process.exit(1); }
    cmdBuild(options.file, options);
    break;
  case 'init':
    cmdInit();
    break;
  case 'repl':
    cmdRepl();
    break;
  default:
    if (fs.existsSync(command) && command.endsWith('.tezz')) {
      cmdRun(command, options, false);
    } else {
      console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
      console.log(HELP);
      process.exit(1);
    }
}
