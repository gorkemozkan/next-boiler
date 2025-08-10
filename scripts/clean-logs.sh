#!/bin/bash

# Clean up Tailwind CSS log files
echo "Cleaning up Tailwind CSS log files..."

# Remove existing log files
rm -f tailwindcss-*.log

# Remove any other debug log files
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*
rm -f .pnpm-debug.log*

echo "Log files cleaned up successfully!"
echo "Note: Future log files will be prevented by the updated configuration." 