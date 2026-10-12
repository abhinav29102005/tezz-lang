# Tezz VS Code Extension - Installation Guide

## 📦 Version 0.4.0

### Option 1: Install from VSIX File (Recommended for Testing)

1. **Using VS Code UI:**
   - Open VS Code
   - Go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
   - Click the "..." menu at the top
   - Select "Install from VSIX..."
   - Navigate to `tezz-0.4.0.vsix` and select it

2. **Using Command Line:**
   ```bash
   code --install-extension tezz-0.4.0.vsix
   ```

3. **Reload VS Code:**
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Reload Window" and press Enter

### Option 2: Install from VS Code Marketplace (Once Published)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Tezz Official"
4. Click Install

### Option 3: Build from Source

```bash
# Clone the repository
git clone https://github.com/abhinav29102005/tezz-lang.git
cd tezz-lang/tezz-vscode

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package the extension
vsce package

# Install the generated VSIX
code --install-extension tezz-0.4.0.vsix
```

## ✅ Verify Installation

1. Create a new file with `.tezz` extension
2. You should see the Tezz icon in the file explorer
3. Try typing one of these snippets and press Tab:
   - `service` → Creates a service block
   - `seva` → Creates a Hinglish service block
   - `route` → Creates a route handler
   - `fn` → Creates a function

## 🧪 Test the Features

### Test Syntax Highlighting
Create a file `test.tezz` with this content:

```tezz
-- English syntax
service API on 3000 {
  route GET "/hello/:name" {
    let name = params.name
    respond 200 { message: "Hello, {name}!" }
  }
}

-- Hinglish syntax
seva API on 3001 {
  rasta POST "/greet" {
    rakho data = request.body
    jawab 200 { message: "Namaste!" }
  }
}
```

### Test Snippets
1. Type `service` and press Tab
2. Type `kaam` and press Tab
3. Type `dhancha` and press Tab
4. Type `agar` and press Tab

### Test Comments
```tezz
-- This is a Tezz comment
// This also works
/* Block comment */
```

## 🔧 Troubleshooting

### Extension Not Working
1. Check if the extension is enabled:
   - Go to Extensions view
   - Search for "Tezz"
   - Make sure it's not disabled

2. Reload VS Code:
   - Ctrl+Shift+P → "Reload Window"

3. Check file extension:
   - File must have `.tezz` or `.tz` extension

### Snippets Not Appearing
1. Make sure IntelliSense is enabled:
   - File → Preferences → Settings
   - Search for "suggest"
   - Ensure "Editor: Quick Suggestions" is enabled

2. Try manual trigger:
   - Type the snippet prefix
   - Press Ctrl+Space to manually trigger suggestions

### Syntax Highlighting Issues
1. Reload the window: Ctrl+Shift+P → "Reload Window"
2. Change language mode manually:
   - Click language indicator in bottom-right
   - Select "Tezz"

## 🆘 Getting Help

- **Issues**: https://github.com/abhinav29102005/tezz-lang/issues
- **Documentation**: https://tezz.abhinavkumarsingh.tech
- **Repository**: https://github.com/abhinav29102005/tezz-lang

## 📢 Publishing to Marketplace

To publish this extension to VS Code Marketplace:

```bash
# Get a Personal Access Token from Azure DevOps
# Visit: https://dev.azure.com/

# Login to vsce
vsce login abhinav29102005

# Publish the extension
vsce publish
```

---

**Made with ❤️ and तेज़ी (speed) by Abhinav**
