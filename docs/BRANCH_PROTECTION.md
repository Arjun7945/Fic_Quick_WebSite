# GitHub Branch Protection Setup Guide — Ficcado

**Purpose:** Exact, step-by-step instructions for repository owner to configure GitHub branch protection rules per Decision D7.  
**Audience:** Repository Owner (`Arjun7945`)  
**Target Branch:** `main`

---

## 1. Prerequisites
Ensure `.github/workflows/ci.yml` has run at least once on GitHub so the check name `Lint, Test & Build Validation` appears in the searchable status checks list.

---

## 2. Step-by-Step Configuration in GitHub UI

1. Open repository on GitHub: `https://github.com/Arjun7945/Fic_Quick_WebSite`.
2. Click **Settings** (top navigation tab).
3. In the left sidebar under *Code and automation*, click **Branches**.
4. Click **Add branch protection rule** (or **Add rule**).
5. In **Branch name pattern**, enter:
   ```
   main
   ```
6. Check **Require a pull request before merging**:
   - Check *Require approvals* (set to 1 approval if collaborating, or leave unchecked if solo author).
   - Check *Dismiss stale pull request approvals when new commits are pushed*.
7. Check **Require status checks to pass before merging**:
   - Check *Require branches to be up to date before merging*.
   - In the search bar under *Status checks that are required*, type and check:
     - `Lint, Test & Build Validation`
8. Check **Do not allow bypassing the above settings**:
   - Prevents accidental force pushes or direct commits to `main`.
9. Click **Create** (or **Save changes**) at the bottom of the page.
10. Confirm with your GitHub password or 2FA prompt.

---

## 3. Recommended Repository Settings

1. **Repository Visibility (Decision D11):**
   - In **Settings** → **General** → scroll to **Danger Zone**.
   - If keeping repository private: click **Change visibility** → select **Make private**.
2. **Secret Scanning & Push Protection:**
   - In **Settings** → **Code security and analysis**.
   - Enable **Secret scanning** and **Push protection** (available on public repos, and GitHub Enterprise/Team private repos).
