# Semantic Release Setup

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and package publishing.

## How It Works

1. **Commit Analysis**: Analyzes commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
2. **Version Calculation**: Determines the next version number based on commit types
3. **Release Notes**: Generates changelog from commits
4. **Git Tag**: Creates a git tag for the new version
5. **GitHub Release**: Creates a GitHub release with release notes
6. **Version Update**: Updates `package.json` and commits changes

## Configuration

### `.releaserc.json`

The semantic-release configuration includes:

- **Commit Analyzer**: Determines version bump from commits
- **Release Notes Generator**: Creates changelog
- **Changelog Plugin**: Updates `CHANGELOG.md`
- **NPM Plugin**: Updates `package.json` version
- **Git Plugin**: Commits version changes
- **GitHub Plugin**: Creates GitHub releases

### Release Rules

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `feat:` | Minor (1.0.0 → 1.1.0) | New feature |
| `fix:` | Patch (1.0.0 → 1.0.1) | Bug fix |
| `perf:` | Patch | Performance improvement |
| `BREAKING CHANGE:` | Major (1.0.0 → 2.0.0) | Breaking change |
| `docs:`, `style:`, etc. | Patch | Other changes |
| `chore:` | No release | Maintenance tasks |

## GitHub Actions Workflow

The release workflow (`.github/workflows/release.yml`) runs on every push to `main`/`master`:

1. Checks out code
2. Sets up Node.js and pnpm
3. Installs dependencies
4. Builds the project
5. Runs semantic-release

### Required Secrets

The workflow uses the following GitHub secrets:

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `NPM_TOKEN` - (Optional) Only needed if publishing to npm

## Usage

### Making a Release

1. **Create commits** using conventional commit format:
   ```bash
   git commit -m "feat: add new customer filter"
   git commit -m "fix: correct date formatting"
   ```

2. **Push to main**:
   ```bash
   git push origin main
   ```

3. **Automated release** happens via GitHub Actions:
   - Version is calculated
   - CHANGELOG.md is updated
   - Git tag is created
   - GitHub release is published
   - Changes are committed back

### Testing Locally

To see what would be released without actually releasing:

```bash
pnpm semantic-release --dry-run
```

This will:
- Analyze commits
- Show the next version
- Display release notes
- **NOT** create tags or releases

### Manual Release

To trigger a release manually (requires proper permissions):

```bash
pnpm semantic-release
```

## Commit Message Examples

### Feature (Minor Version)
```bash
git commit -m "feat(auth): add password reset functionality"
```

### Bug Fix (Patch Version)
```bash
git commit -m "fix(api): handle null response from server"
```

### Breaking Change (Major Version)
```bash
git commit -m "feat(api)!: change response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case"
```

### Multiple Changes
```bash
git commit -m "feat(dashboard): add customer analytics

- Add revenue chart
- Add customer growth metrics
- Add export functionality"
```

### No Release
```bash
git commit -m "chore: update dependencies"
git commit -m "docs: fix typo in README"
```

## Changelog

The `CHANGELOG.md` file is automatically generated and updated with each release. It includes:

- Version number and date
- Categorized changes (Features, Bug Fixes, etc.)
- Commit messages and links
- Breaking changes highlighted

## Branches

Semantic-release is configured to release from:
- `main`
- `master`

Commits to other branches will not trigger releases.

## Troubleshooting

### Release Not Triggered

**Possible causes:**
- No releasable commits (only `chore:`, `docs:`, etc.)
- Not pushed to `main`/`master` branch
- GitHub Actions workflow failed

**Solution:** Check GitHub Actions logs for errors.

### Version Not Bumped

**Possible causes:**
- Commit messages don't follow conventional format
- Only non-release commits (chore, docs without release flag)

**Solution:** Ensure commits use proper conventional commit format.

### Permission Errors

**Possible causes:**
- Missing `GITHUB_TOKEN` permissions
- Repository settings restrict workflow permissions

**Solution:** 
1. Go to repository Settings → Actions → General
2. Set "Workflow permissions" to "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"

## Best Practices

1. **Use conventional commits** for all commits
2. **Write descriptive commit messages** - they become your changelog
3. **Group related changes** in a single commit when appropriate
4. **Use breaking changes sparingly** - they trigger major versions
5. **Review the changelog** after releases to ensure quality

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Commit Message Guidelines](./CONTRIBUTING.md)
