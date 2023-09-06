#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <root_directory>"
    exit 1
fi

ROOT_DIR="$1"
DATA_DIR="${ROOT_DIR}/data"

input_path="${DATA_DIR}/topInstitutionsTmp.json"
output_path="${DATA_DIR}/topInstitutions.json"

# Pull down top 1000 most visited institution pages
curl 'https://plausible.io/api/v1/stats/breakdown?site_id=open.coki.ac&period=12mo&property=event:page&filters=event%3Apage%3D%3D%2Finstitution%2F%2A%2F&limit=1000' -H "Authorization: Bearer ${PLAUSIBLE_API_TOKEN}" >${input_path}

# Transform results into a JSON array of ROR IDs
jq '.results[] | .page' ${input_path} | sed 's/\/institution\///g' | sed 's/\///g' | jq --slurp -c . > ${output_path}

# Cleanup
rm ${input_path}
