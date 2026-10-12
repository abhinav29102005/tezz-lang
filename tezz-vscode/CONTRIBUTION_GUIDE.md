# Contributing Extension Updates to Tezz

## 👥 For Contributors (Not Admins)

Since you don't have publishing rights to the VS Code Marketplace, here's how to contribute your updates:

## 🔄 Contribution Workflow

### Step 1: Create a Pull Request

```bash
# Make sure all changes are committed
cd d:\projects\tezz\tezz-lang

# Check what's changed
git status

# Add the extension files
git add tezz-vscode/

# Commit with descriptive message
git commit -m "feat(extension): Update VS Code extension to v0.4.0

- Add comprehensive Hinglish support (25+ keywords)
- Add 40+ code snippets for English and Hinglish
- Enhanced syntax highlighting (operators, ranges, HTTP methods)
- Update README with examples and documentation
- Add CHANGELOG.md and .vscodeignore
- Support for -- comments as primary syntax
- Add hex/binary number literals support
- Improve operator highlighting

Closes #<issue-number>"

# Push to your branch
git push origin <your-branch-name>
```

### Step 2: Open Pull Request on GitHub

1. Go to: https://github.com/abhinav29102005/tezz-lang
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch
4. Add title: **"Update VS Code Extension to v0.4.0"**
5. Add description (see template below)

### PR Description Template

```markdown
## 🎯 Extension Update: v0.3.0 → v0.4.0

### 📋 Summary
This PR updates the Tezz VS Code extension with comprehensive improvements including full Hinglish support, 40+ snippets, and enhanced syntax highlighting.

### ✨ New Features
- **Comprehensive Hinglish Support**: 25+ Hindi keywords (seva, rasta, kaam, dhancha, etc.)
- **40+ Code Snippets**: Both English and Hinglish variants
- **Enhanced Syntax Highlighting**: Operators, ranges, HTTP methods, hex/binary literals
- **Updated Comment Syntax**: Primary support for `--` comments
- **Better Documentation**: Updated README, added CHANGELOG and installation guides

### 📦 Changed Files
- `package.json` - Version bump and metadata updates
- `snippets.json` - Expanded from 3 to 40+ snippets
- `syntaxes/tezz.tmLanguage.json` - Enhanced grammar rules
- `language-configuration.json` - Updated comment syntax
- `README.md` - Comprehensive rewrite with examples
- `CHANGELOG.md` - New file documenting changes
- `.vscodeignore` - New file for package optimization
- `INSTALLATION.md` - New installation guide

### ✅ Testing
- [x] Extension compiles without errors
- [x] VSIX package generated successfully (1.02 MB)
- [x] All snippets tested
- [x] Syntax highlighting verified for both English and Hinglish
- [x] Comment syntax works correctly

### 📸 Screenshots
_(Add screenshots of the extension in action if possible)_

### 🚀 Ready for Publishing
The extension is ready to be published to VS Code Marketplace by the admin (@abhinav29102005).

### 📄 Publishing Steps for Admin
Once merged, the admin can publish with:
```bash
cd tezz-vscode
vsce login abhinav29102005
vsce publish
```

---

**Testing Checklist for Reviewers:**
- [ ] Review code changes
- [ ] Test VSIX installation: `code --install-extension tezz-vscode/tezz-0.4.0.vsix`
- [ ] Verify snippets work
- [ ] Check syntax highlighting
- [ ] Review documentation
```

### Step 3: Tag Reviewers

In the PR, mention:
- `@abhinav29102005` - Admin/Publisher
- Any other maintainers

### Step 4: Address Review Feedback

The admin may request changes. Make updates and push to the same branch:

```bash
# Make changes based on feedback
# ... edit files ...

git add .
git commit -m "fix: address review comments"
git push origin <your-branch-name>
```

## 📦 What the Admin Will Do

Once your PR is approved and merged, the admin will:

1. Pull the latest changes
2. Navigate to `tezz-vscode`
3. Run `vsce login abhinav29102005`
4. Run `vsce publish`
5. The extension updates on the marketplace in 5-10 minutes

## 🧪 Local Testing (For You and Reviewers)

Before submitting the PR, test locally:

```bash
# Install the VSIX
code --install-extension tezz-vscode/tezz-0.4.0.vsix

# Test in VS Code
# 1. Create a .tezz file
# 2. Try snippets (service, seva, fn, kaam, etc.)
# 3. Verify syntax highlighting
# 4. Test comments with --
```

## 📝 Current Status

### ✅ Completed
- [x] Version updated to 0.4.0
- [x] All code changes implemented
- [x] TypeScript compiled successfully
- [x] VSIX package created (tezz-0.4.0.vsix)
- [x] Documentation updated
- [x] CHANGELOG created

### 🔄 Next Steps (Your Action)
- [ ] Test the extension locally
- [ ] Commit all changes
- [ ] Push to your branch
- [ ] Create pull request on GitHub
- [ ] Wait for admin review and approval

### 🎯 Final Step (Admin Action)
- [ ] Merge PR
- [ ] Publish to VS Code Marketplace

## 💡 Tips for Contributors

1. **Test Thoroughly**: Install the VSIX locally and test all features
2. **Document Well**: Good PR descriptions help reviewers
3. **Be Responsive**: Answer questions and address feedback quickly
4. **Follow Style**: Match existing code style and conventions
5. **Small Commits**: Make logical, atomic commits

## 🤝 Communication

If you need to discuss the changes:
- Open a GitHub Discussion
- Comment on the PR
- Mention the admin in issues

## 📊 Files Summary

```
Modified Files:
  ✅ tezz-vscode/package.json
  ✅ tezz-vscode/snippets.json
  ✅ tezz-vscode/syntaxes/tezz.tmLanguage.json
  ✅ tezz-vscode/language-configuration.json
  ✅ tezz-vscode/README.md

New Files:
  ✅ tezz-vscode/CHANGELOG.md
  ✅ tezz-vscode/.vscodeignore
  ✅ tezz-vscode/INSTALLATION.md
  ✅ tezz-vscode/PUBLISH.md (for admin)
  ✅ tezz-vscode/CONTRIBUTION_GUIDE.md (this file)

Generated Files:
  ✅ tezz-vscode/tezz-0.4.0.vsix
```

---

**Thank you for contributing to Tezz! 🚀**
