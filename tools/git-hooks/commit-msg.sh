#!/bin/sh

# Commit messages must not carry AI attribution trailers.
if grep -Eiq '^[[:space:]]*(co-authored-by|generated-by|assisted-by):.*(claude|anthropic)' "$1"; then
  echo 'Claude/AI attribution is not allowed in commit messages.'
  exit 1
fi
