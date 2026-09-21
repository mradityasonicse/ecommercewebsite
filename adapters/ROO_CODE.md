# Roo Code / Cline Adapter

> **Canonical Rules Reference**: [PROJECT_RULES.md](../PROJECT_RULES.md) & [.clinerules](../.clinerules)

This adapter enables Roo Code and Cline extensions to operate seamlessly within the EaseHub campus architecture.

---

## 1. Extension Configuration
- **Rule File**: `.clinerules` (root level)
- **Custom Modes**: `.roomodes` (root level: `campus-engineer`, `campus-architect`, `campus-auditor`)
- **MCP Config**: `.vscode/mcp.json`

---

## 2. Recommended Operating Modes in Roo Code

| Mode | Purpose | Primary Focus |
| :--- | :--- | :--- |
| `campus-engineer` | Feature development & UI components | React 19, TypeScript, CartDrawer, My Services tab |
| `campus-architect` | Auth & role routing architecture | RoleLoginPage, AuthService, Session management |
| `campus-auditor` | Empirical verification & build checks | `npm run build`, `npm run lint`, zero-defect gating |

---

## 3. Strict Development Protocols
1. **Search First**: Never read large files blindly. Use `grep` or search tools first.
2. **Type Safety**: Strictly no `any`. Avoid unused imports as `noUnusedLocals` is active.
3. **Design Tokens**: Use `src/styles/tokens.css` values for spacing, colors, and elevations.
4. **Empirical Verification**: Run `npm run build` to confirm 0 compilation errors after edits.
