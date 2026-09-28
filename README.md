# MITS Web

MITS Web is a unified web platform and template generator for college clubs and departments. It provides shared database schemas, a reference implementation (`robotics/`), scaffold templates (`templates/club/`), a CLI for generating new clubs (`cli/`), and a central superadmin portal (`superadmin/`).

## Architecture Overview

- **`robotics/`**: The reference production club application (Client public site + Admin portal).
- **`templates/club/`**: Clean, generic templates used by the `mits` CLI to scaffold new clubs.
- **`cli/`**: The `mits` command line tool (`doctor`, `list`, `create`, `remove`).
- **`database/`**: Shared PostgreSQL schema definitions and migrations.
- **`superadmin/`**: Central administration portal for managing all organizations.
- **`scripts/`**: Automation and verification tools.

---

## Changing the template safely

Because `templates/club/` serves as the blueprint for newly created clubs and departments while `robotics/` is the live reference implementation, changes between them must remain synchronized and drift-free.

### 1. How to Edit Templates

When improving features, fixing UI bugs, or updating shared components:
- **Recommended Workflow:** Make and test your changes inside `robotics/` first, where you have live dev servers, working environment variables, and realistic test data.
- Ensure that you do not introduce hardcoded organization-specific names, slugs, or branding into shared files.

### 2. How to Test Changes Against Robotics

- Test your changes locally in `robotics/client` and `robotics/admin` (`npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`).
- Once verified, sync the changes to `templates/club/`:
  ```bash
  bash scripts/sync-template.sh --from-robotics
  ```
- This automatically applies generic branding replacements to ensure the templates remain brand-neutral.

If you made changes directly inside `templates/club/`, you can test them against robotics using:
```bash
bash scripts/sync-template.sh --to-robotics
```
Then run tests in `robotics/`.

### 3. How to Run `check-template-sync.sh`

To verify that `templates/club/` and `robotics/` are synchronized and that no brand-specific references have leaked:

```bash
bash scripts/check-template-sync.sh
```

This script:
1. Verifies that no file in `templates/club/` contains the literal string `"robotics"` outside of comments.
2. Compares all shared files (client & admin app, components, lib, public, configs), ignoring known branding placeholders.
3. Exits with code `0` if in sync, or code `1` with a detailed diff if drift is detected.

### 4. How to Run `sync-template.sh`

The synchronization tool supports three modes:

- `bash scripts/sync-template.sh --from-robotics`: Copies shared code from `robotics/` into `templates/club/`, sanitizing branding into generic placeholders.
- `bash scripts/sync-template.sh --to-robotics`: Copies shared code from `templates/club/` into `robotics/`, reapplying robotics-specific branding.
- `bash scripts/sync-template.sh --check`: Runs `scripts/check-template-sync.sh` to ensure alignment.
