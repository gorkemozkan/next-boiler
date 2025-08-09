#!/bin/bash

# Generate secure JWT secrets script
# This script generates cryptographically secure random strings for JWT configuration

echo "🔐 Generating secure JWT secrets..."
echo ""

# Generate JWT_SECRET (64 bytes = 512 bits)
JWT_SECRET=$(openssl rand -base64 64)

# Generate JWT_REFRESH_SECRET (64 bytes = 512 bits)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)

echo "✅ Generated secure JWT secrets:"
echo ""
echo "JWT_SECRET=\"$JWT_SECRET\""
echo "JWT_REFRESH_SECRET=\"$JWT_REFRESH_SECRET\""
echo ""
echo "📝 Copy these lines to your .env file"
echo "⚠️  Keep these secrets secure and never commit them to version control!"
echo ""

# Save to temporary file for easy copying
cat > jwt-secrets.tmp << EOF
JWT_SECRET="$JWT_SECRET"
JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
EOF

echo "💾 Secrets also saved to jwt-secrets.tmp for easy copying"
echo ""

# Optional: Check if .env file exists and offer to append
if [ -f ".env" ]; then
    echo "📁 .env file detected"
    read -p "Would you like to append these secrets to your .env file? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "" >> .env
        echo "# JWT Configuration - Generated on $(date)" >> .env
        echo "JWT_SECRET=\"$JWT_SECRET\"" >> .env
        echo "JWT_REFRESH_SECRET=\"$JWT_REFRESH_SECRET\"" >> .env
        echo "✅ Secrets appended to .env file"
    fi
fi 