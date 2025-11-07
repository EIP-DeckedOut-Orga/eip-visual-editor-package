#!/bin/bash

# Script to fix import paths for the npm package

echo "Fixing import paths in the package..."

# Change @/components/ui to ../ui or ./ui depending on context
find src -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  # Replace @/components/ui with relative ui imports
  sed -i '' 's|@/components/ui/|@/ui/|g' "$file"
  
  # Replace @/lib/utils with relative path
  sed -i '' 's|@/lib/utils|@/lib/utils|g' "$file"
  
  # Replace @/components/visual-editor with relative paths
  sed -i '' 's|@/components/visual-editor/|@/|g' "$file"
  sed -i '' 's|@/components/visual-editor|@/|g' "$file"
done

echo "Import paths fixed!"
