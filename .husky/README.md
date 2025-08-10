# Husky Security Hooks

This directory contains Git hooks powered by Husky that help prevent sensitive information from being committed or pushed to your repository.

## 🚨 Security Features

### 1. Pre-commit Hook (`.husky/pre-commit`)
- ✅ **Biome checks**: Code quality and formatting validation
- 🔒 **Security scan**: Scans staged files for sensitive information
- 🚫 **Protection**: Blocks commits with potential secrets, API keys, or credentials

### 2. Pre-push Hook (`.husky/pre-push`)
- 🔒 **Comprehensive security scan**: Checks ALL tracked files before pushing
- 🚨 **Production protection**: Extra validation for main/master/production branches
- 🛡️ **Remote protection**: Prevents pushing sensitive data to remote repositories

### 3. Post-merge Hook (`.husky/post-merge`)
- 📁 **New file detection**: Identifies potentially sensitive files after pulling
- 🔒 **Security scanning**: Checks new/modified files for secrets
- 🌍 **Environment file monitoring**: Alerts about new .env files

## 🔒 What Gets Detected

### Sensitive Patterns (15+ Types)
- **API Keys**: `sk_`, `pk_`, `AKIA`, `ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`
- **JWT Secrets**: `JWT_SECRET`, `NEXTAUTH_SECRET`, `COOKIE_SECRET`
- **Database URLs**: `postgresql://`, `mysql://`, `mongodb://`, `redis://`
- **Email Credentials**: `SMTP_PASS`, `SMTP_PASSWORD`, `EMAIL_PASSWORD`
- **Private Keys**: `-----BEGIN PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----`
- **Access Tokens**: `access_token`, `accessToken`, `ACCESS_TOKEN`
- **Client Secrets**: `client_secret`, `CLIENT_SECRET`
- **Database Passwords**: `DATABASE_PASSWORD`, `DB_PASSWORD`, `DB_PASS`

- **Google API Keys**: `AIza`, `ya29.`
- **AWS Keys**: `AKIA[0-9A-Z]{16}`, `aws_access_key_id`, `aws_secret_access_key`
- **GitHub Tokens**: `ghp_[a-zA-Z0-9]{36}`, `gho_[a-zA-Z0-9]{36}`, `ghu_[a-zA-Z0-9]{36}`
- **Sentry DSN**: `https://[a-f0-9]{32}@[a-z0-9.-]+/[0-9]+`

### Forbidden Files
- **Environment files**: `.env`, `.env.local`, `.env.production`, `.env.staging`
- **Config files**: `config.js`, `config.ts`, `.config.js`, `.config.ts`
- **Credential files**: `secrets.json`, `credentials.json`, `service-account.json`
- **Key files**: `firebase-key.json`, `google-credentials.json`
- **Lock files**: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`

## 🛠️ How to Use

### Installation
The hooks are automatically installed when you run:
```bash
npm run prepare
```

### Manual Installation
```bash
npx husky install
```

### Available NPM Scripts
```bash
# Security checking
npm run security:check        # Quick security check
npm run security:check:staged # Check staged files only
npm run security:check:all    # Check all tracked files
npm run security:test         # Test security hooks

# Code quality (existing)
npm run check                 # Biome check
npm run check:fix            # Biome check and fix
npm run lint                 # Biome lint
npm run format               # Biome format
```

### Testing Hooks
```bash
# Test pre-commit hook (Biome + Security)
git add . && git commit -m "test: testing security hooks"

# Test pre-push hook
git push

# Test post-merge hook (after git pull)
git pull origin main

# Manual security checks
npm run security:check:staged
npm run security:check:all
```

## ⚠️ Common Issues & Solutions

### 1. False Positives
If a hook incorrectly flags legitimate code:
- **Temporary bypass**: Use `git commit --no-verify` (not recommended)
- **Pattern adjustment**: Modify the security patterns in `.husky/_/security-check.sh`
- **File exclusion**: Add specific files to `.gitignore` or `.biomeignore`
- **Documentation files**: `.md`, `.txt`, and `.husky/*` files are automatically excluded

### 2. Environment Variables
**Never commit real environment files!**
- ✅ **Use**: `.env.example` for templates
- ✅ **Keep**: `.env*` in `.gitignore`
- ✅ **Use**: Secure secret management (Vercel, Railway, etc.)
- ❌ **Never**: Commit `.env.local`, `.env.production`, etc.

### 3. API Keys in Examples
For documentation or examples:
- ✅ **Use**: `YOUR_API_KEY_HERE` (placeholders)
- ✅ **Use**: `sk_test_...` (test keys only)
- ✅ **Use**: `process.env.API_KEY` (environment variables)
- ❌ **Never**: `sk_live_...` or real production keys

## 🔧 Customization

### Adding New Security Patterns
Edit `.husky/_/security-check.sh` and add to the arrays:

```bash
# Add to SENSITIVE_PATTERN_NAMES array
SENSITIVE_PATTERN_NAMES=(
    # ... existing patterns ...
    "Custom Pattern Name"
)

# Add to SENSITIVE_PATTERNS array (same order!)
SENSITIVE_PATTERNS=(
    # ... existing patterns ...
    "(your|regex|pattern)"
)
```

### Adding New Forbidden Files
Edit `.husky/_/security-check.sh` and add to `SENSITIVE_FILES`:

```bash
SENSITIVE_FILES=(
    # ... existing files ...
    "new-sensitive-file.json"
    "*.key"
    "*.pem"
)
```

### Modifying Hook Behavior
Each hook can be customized:
- **Pre-commit**: Add tests, dependency checks, or other validations
- **Pre-push**: Add deployment checks, dependency audits, or security scans
- **Post-merge**: Add dependency updates, security audits, or file monitoring

## 🚀 Best Practices

### 1. Regular Updates
- Keep Husky and hooks updated: `npm update husky`
- Review and update security patterns quarterly
- Test hooks after major changes or updates

### 2. Team Communication
- Share this README with all team members
- Provide clear error messages and solutions
- Train team on secure development practices
- Establish security review processes

### 3. Monitoring & Maintenance
- Monitor hook failures in CI/CD pipelines
- Track security violations over time
- Regular security audits of the codebase
- Update patterns based on new security threats

### 4. Development Workflow
- Always use conventional commit messages
- Test security hooks before pushing to production
- Review security warnings carefully
- Never bypass security checks without understanding risks

## 📚 Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## 🆘 Troubleshooting

### Hook Not Running
```bash
# Check if hooks are installed
ls -la .husky/

# Reinstall hooks
npm run prepare

# Check file permissions
chmod +x .husky/* .husky/_/*
```

### Permission Denied
```bash
# Fix file permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/post-merge
chmod +x .husky/_/security-check.sh
```

### Script Errors
```bash
# Test security script directly
npm run security:check:staged
npm run security:check:all

# Check for syntax errors
bash -n .husky/_/security-check.sh

# Debug with verbose output
bash -x .husky/_/security-check.sh staged
```

### Common Error Messages

#### "Security check failed!"
- **Cause**: Sensitive information detected in files
- **Solution**: Review warnings, remove secrets, use environment variables

#### "Biome checks failed!"
- **Cause**: Code quality or formatting issues
- **Solution**: Run `npm run check:fix` to auto-fix issues

#### "Hook script failed!"
- **Cause**: Script execution error or permission issue
- **Solution**: Check file permissions and script syntax

## 🔍 Security Examples

### ✅ Good Practices
```javascript
// Use environment variables
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// Use placeholder values in examples
const exampleKey = "YOUR_API_KEY_HERE";

// Use test keys only
const testKey = "test_key_1234567890abcdef";
```

### ❌ Bad Practices
```javascript
// Never hardcode secrets
const apiKey = "live_key_abcdefghijklmnop";
const password = "my-super-secret-password";

// Never commit real credentials
const dbUrl = "postgresql://user:password@localhost:5432/db";
```

## 🎯 Quick Start Checklist

- [ ] Run `npm run prepare` to install hooks
- [ ] Test with `npm run security:check:staged`
- [ ] Make a test commit to verify hooks work
- [ ] Share this README with your team
- [ ] Review and customize security patterns if needed
- [ ] Test pre-push hook with `git push`
- [ ] Test post-merge hook after `git pull`

---

## 🏆 Summary

These security hooks provide **enterprise-grade protection** for your development workflow by:

- 🛡️ **Preventing** accidental exposure of sensitive information
- 🔍 **Scanning** all files for security violations
- 🚫 **Blocking** dangerous commits and pushes
- 📚 **Documenting** security best practices
- 🧪 **Testing** security measures automatically
- 🔧 **Integrating** seamlessly with your existing workflow

**Remember**: These hooks are your first line of defense against accidentally exposing sensitive information. Always review security warnings carefully and never bypass them without understanding the risks. 