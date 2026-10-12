# Publishing Tezz Extension Update to VS Code Marketplace

## Publishing Version 0.4.0

Since the extension is already published at:
**https://marketplace.visualstudio.com/items?itemName=abhinav29102005.tezz**

You need to **publish an update** rather than a new extension.

## Prerequisites

1. **Personal Access Token (PAT)**
   - You should already have one from the initial publish
   - If not, get one from: https://dev.azure.com/
   - Organization: Visual Studio Marketplace
   - Scope: **Marketplace (Manage)**

2. **vsce installed**
   ```bash
   npm install -g @vscode/vsce
   ```

## Publishing Steps

### Step 1: Login to vsce

```bash
vsce login abhinav29102005
```

When prompted, enter your Personal Access Token (PAT).

### Step 2: Verify Package

Before publishing, verify the package looks good:

```bash
cd tezz-vscode
vsce ls
```

This will show all files that will be included.

### Step 3: Publish the Update

```bash
# Option 1: Publish directly (recommended)
vsce publish

# Option 2: Publish with specific version increment
vsce publish minor  # 0.3.0 -> 0.4.0
vsce publish patch  # 0.4.0 -> 0.4.1
vsce publish major  # 0.4.0 -> 1.0.0

# Option 3: Publish the VSIX file you already created
vsce publish --packagePath tezz-0.4.0.vsix
```

Since you've already updated to 0.4.0 in package.json, just use:
```bash
vsce publish
```

### Step 4: Verify on Marketplace

After publishing (takes 5-10 minutes to appear):
1. Visit: https://marketplace.visualstudio.com/items?itemName=abhinav29102005.tezz
2. Verify the version shows **0.4.0**
3. Check the README displays correctly
4. Verify the changelog appears

## Update Process Overview

```
Current State: v0.3.0 (published)
    ↓
Local Updates: v0.4.0 (completed )
    ↓
Publish Update: vsce publish
    ↓
Marketplace: v0.4.0 (live in ~5-10 min)
```

## What Users Will See

When the update is published, users who have the extension installed will:
1. See an "Update" button in VS Code Extensions view
2. Get the new features after clicking Update
3. See the updated README and features

New users will automatically get v0.4.0 when installing.

## Important Notes

- **Version must be higher**: 0.4.0 > 0.3.0 
- **Publisher must match**: abhinav29102005 
- **Extension ID must match**: `abhinav29102005.tezz` 
- **All files compiled**: TypeScript compiled 
- **VSIX created**: tezz-0.4.0.vsix ready 

## Troubleshooting

### "Extension already exists"
This is normal! You're updating, not creating new. Just proceed with publish.

### "Personal Access Token invalid"
1. Go to https://dev.azure.com/
2. Create a new PAT with Marketplace scope
3. Run `vsce login abhinav29102005` again

### "Version must be greater"
The version in package.json (0.4.0) is already greater than published (0.3.0), so this is fine.

### "Missing files"
If vsce complains about missing files:
```bash
npm install
npm run compile
```

## Quick Command Sequence

```bash
# Navigate to extension directory
cd d:\projects\tezz\tezz-lang\tezz-vscode

# Login (if not already)
vsce login abhinav29102005

# Publish the update
vsce publish

# That's it! 
```

## Post-Publishing

After publishing, monitor:
- Installation count
- Ratings and reviews
- GitHub issues for bug reports
- User feedback

Update the extension as needed with:
- Bug fixes → patch version (0.4.1)
- New features → minor version (0.5.0)
- Breaking changes → major version (1.0.0)

---

**Made with ❤️ and तेज़ी (speed) by Abhinav**
