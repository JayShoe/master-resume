#!/bin/bash
# Import data from schema-sync JSON files into Directus
# Run this after Directus is running and schema is loaded

TOKEN="${DIRECTUS_TOKEN:-Nluu7NJYuei2eJJTX4pw0ZpoSQkBoMyJ}"
URL="${DIRECTUS_URL:-http://localhost:8055}"
DATA_DIR="${DATA_DIR:-/c/github/master-resume/backend/schema-sync/data}"

echo "Importing data to $URL"

# Import order matters due to foreign key dependencies
# 1. Collections with no dependencies first
# 2. Then collections that depend on them

import_collection() {
    local collection=$1
    local file="$DATA_DIR/$collection.json"

    if [ -f "$file" ]; then
        echo "Importing $collection..."
        response=$(curl -s -X POST "$URL/items/$collection" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d @"$file")

        if echo "$response" | grep -q '"errors"'; then
            echo "  Warning: Some items may already exist or have errors"
            echo "$response" | head -c 200
            echo ""
        else
            echo "  Success!"
        fi
    else
        echo "  File not found: $file"
    fi
}

# Import in dependency order
import_collection "companies"
import_collection "positions"
import_collection "skills"
import_collection "technologies"
import_collection "projects"
import_collection "accomplishments"
import_collection "education"
import_collection "certifications"
import_collection "identity"
import_collection "professional_summaries"

echo "Done!"
