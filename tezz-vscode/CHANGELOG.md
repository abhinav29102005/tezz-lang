# Changelog

All notable changes to the Tezz VS Code extension will be documented in this file.

## [0.4.0] - 2026-10-12

### Added
- **Comprehensive Hinglish Support**: Added full syntax highlighting and snippets for all Hinglish keywords
  - Service: `seva` (सेवा)
  - Route: `rasta` (रास्ता)
  - Function: `kaam` (काम)
  - Class: `dhancha` (ढांचा)
  - Extends: `se_bana` (से बना)
  - Enum: `vikalp` (विकल्प)
  - Trait: `lakshan` (लक्षण)
  - Macro: `jadoo` (जादू)
  - Let: `mano` (मानो)
  - Const: `pakka` (पक्का)
  - If/Else: `agar`/`warna` (अगर/वरना)
  - While: `jabtak` (जबतक)
  - For: `har`/`mein` (हर/में)
  - Try/Catch: `koshish`/`pakad` (कोशिश/पकड़)
  - Print: `dikha` (दिखा)
  - Respond: `jawab` (जवाब)
  - Return: `vapas` (वापस)
  - Await: `ruko` (रुको)
  - New: `naya` (नया)
  - This: `yeh` (यह)
  - Boolean: `sahi`/`galat` (सही/गलत)

- **Enhanced Snippets**: 40+ production-ready code snippets for both English and Hinglish syntax
  - Service/route creation
  - Function definitions (regular and arrow)
  - Class declarations with inheritance
  - Control flow structures
  - Error handling
  - Concurrency primitives
  - Type definitions (enums, traits, macros)

- **Advanced Syntax Highlighting**:
  - Range operator (`..`) highlighting
  - Arrow function (`=>`) support
  - Arithmetic, comparison, logical, bitwise operators
  - HTTP method highlighting (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, CONNECT, TRACE)
  - Background/spawn concurrency keywords
  - Macro invocation syntax (`macro_name!`)
  - Hex and binary number literals
  - Scientific notation support

- **Comment Support**: Added `--` (double dash) as the primary line comment syntax
- **Extended Language Features**:
  - `background` keyword for async tasks
  - `wait` keyword as alternative to `await`
  - `params` and `request` as built-in service keywords
  - Extended OOP keywords: `constructor`, `super`
  - Import/export statements

### Changed
- Updated extension version to 0.4.0
- Enhanced README with comprehensive feature documentation and code examples
- Improved keyword categorization for better semantic highlighting
- Updated package.json with better metadata, keywords, and links

### Fixed
- Comment syntax now correctly recognizes `--` as line comments
- Improved syntax highlighting accuracy for numeric literals
- Better recognition of Hinglish keywords in various contexts

## [0.3.0] - Previous Release

### Added
- Initial syntax highlighting
- Basic snippets
- LSP integration
- Basic Hinglish keyword support

---

**Made with ❤️ and तेज़ी (speed)**
