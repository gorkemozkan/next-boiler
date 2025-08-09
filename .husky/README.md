# Husky Security Hooks

This directory contains Git hooks powered by Husky that help prevent sensitive information from being committed or pushed to your repository.

## 🚨 Security Features

### 1. Pre-commit Hook (`.husky/pre-commit`)
- Runs Biome code quality checks
- **Security check**: Scans staged files for sensitive information
- Prevents commits with potential secrets, API keys, or credentials

### 2. Pre-push Hook (`.husky/pre-push`)
- **Comprehensive security scan**: Checks ALL tracked files before pushing
- **Production protection**: Extra validation for main/master/production branches
- Prevents pushing sensitive data to remote repositories

### 3. Commit Message Hook (`.husky/commit-msg`)
- **Sensitive content detection**: Scans commit messages for secret keywords
- **Format validation**: Enforces conventional commit format
- **Length validation**: Warns about overly long commit messages

### 4. Post-merge Hook (`.husky/post-merge`)
- **New file detection**: Identifies potentially sensitive files after pulling
- **Security scanning**: Checks new/modified files for secrets
- **Environment file monitoring**: Alerts about new .env files

## 🔒 What Gets Detected

### Sensitive Patterns
- **API Keys**: `sk_`, `pk_`, `AKIA`, `ghp_`, etc.
- **JWT Secrets**: `JWT_SECRET`, `NEXTAUTH_SECRET`, etc.
- **Database URLs**: `postgresql://`, `mysql://`, `redis://`
- **Email Credentials**: `SMTP_PASS`, `EMAIL_PASSWORD`
- **Private Keys**: `-----BEGIN PRIVATE KEY-----`
- **Access Tokens**: `access_token`, `accessToken`
- **Client Secrets**: `client_secret`, `CLIENT_SECRET`
- **Stripe Keys**: `sk_live_`, `sk_test_`, `pk_live_`, `pk_test_`
- **Google API Keys**: `AIza`, `ya29.`
- **AWS Keys**: `AKIA[0-9A-Z]{16}`
- **GitHub Tokens**: `ghp_[a-zA-Z0-9]{36}`
- **Sentry DSN**: `https://[a-f0-9]{32}@[a-z0-9.-]+/[0-9]+`

### Forbidden Files
- `.env`, `.env.local`, `.env.production`, `.env.staging`
- `config.js`, `config.ts`, `.config.js`, `.config.ts`
- `secrets.json`, `credentials.json`, `service-account.json`
- `firebase-key.json`, `google-credentials.json`
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`

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

### Testing Hooks
```bash
# Test pre-commit hook
git add . && git commit -m "test: testing security hooks"

# Test pre-push hook
git push

# Test commit-msg hook
git commit -m "test: commit with sensitive keyword password"
```

## ⚠️ Common Issues & Solutions

### 1. False Positives
If a hook incorrectly flags legitimate code:
- **Temporary bypass**: Use `git commit --no-verify` (not recommended)
- **Pattern adjustment**: Modify the security patterns in `.husky/_/security-check.sh`
- **File exclusion**: Add specific files to `.gitignore` or `.biomeignore`

### 2. Environment Variables
**Never commit real environment files!**
- Use `.env.example` for templates
- Keep `.env*` in `.gitignore`
- Use secure secret management (Vercel, Railway, etc.)

### 3. API Keys in Examples
For documentation or examples:
- Use placeholder values: `YOUR_API_KEY_HERE`
- Use test keys: `sk_test_...`
- Use environment variables: `process.env.API_KEY`

## 🔧 Customization

### Adding New Patterns
Edit `.husky/_/security-check.sh` and add to `SENSITIVE_PATTERNS`:
```bash
["Custom Pattern"]="(your|regex|pattern)"
```

### Adding New Forbidden Files
Edit `.husky/_/security-check.sh` and add to `SENSITIVE_FILES`:
```bash
"new-sensitive-file.json"
```

### Modifying Hook Behavior
Each hook can be customized:
- **Pre-commit**: Add more checks (tests, linting, etc.)
- **Pre-push**: Add deployment checks, dependency audits
- **Commit-msg**: Modify commit message format requirements
- **Post-merge**: Add dependency updates, security audits

## 🚀 Best Practices

### 1. Regular Updates
- Keep Husky and hooks updated
- Review and update security patterns regularly
- Test hooks after major changes

### 2. Team Communication
- Document hook behavior for team members
- Provide clear error messages and solutions
- Train team on secure development practices

### 3. Monitoring
- Monitor hook failures in CI/CD
- Track security violations over time
- Regular security audits of the codebase

## 📚 Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

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
chmod +x .husky/commit-msg
chmod +x .husky/post-merge
chmod +x .husky/_/security-check.sh
```

### Script Errors
```bash
# Test security script directly
bash .husky/_/security-check.sh "staged"

# Check for syntax errors
bash -n .husky/_/security-check.sh
```

---

**Remember**: These hooks are your first line of defense against accidentally exposing sensitive information. Always review security warnings carefully and never bypass them without understanding the risks. 