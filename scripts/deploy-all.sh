#!/bin/bash

# Deploy all functions in the supabase/functions directory
FUNCTIONS_DIR="supabase/functions"

# Check if functions directory exists
if [ ! -d "$FUNCTIONS_DIR" ]; then
    echo "Error: Functions directory $FUNCTIONS_DIR does not exist"
    exit 1
fi

# Get all function names (directories in functions folder)
FUNCTIONS=$(find "$FUNCTIONS_DIR" -maxdepth 1 -type d -name "*" | sed 's|.*/||' | grep -v "^$")
# Get all deployed functions
DEPLOYED_FUNCTIONS_BLOB=$(supabase functions list --project-ref hyykpiovnvtkoncgxmpg)

# Deploy each function
for function in $FUNCTIONS; do
    # Check if index.ts exists in the function directory
    if [ ! -f "$FUNCTIONS_DIR/$function/index.ts" ]; then
        echo "⚠️  Skipping $function: index.ts not found"
        continue
    else
        echo "Deploying function: $function"
        supabase functions deploy "$function" --project-ref hyykpiovnvtkoncgxmpg --no-verify-jwt
    
        if [ $? -eq 0 ]; then
            echo "✅ Successfully deployed $function"
        else
            echo "❌ Failed to deploy $function"
        fi
    fi
    
done

if [ -z "$FUNCTIONS" ]; then
    echo "No functions found in $FUNCTIONS_DIR"
    exit 1
fi



x