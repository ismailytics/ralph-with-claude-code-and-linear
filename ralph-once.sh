#!/bin/bash
# Ralph Wiggum - Single iteration for HITL (human-in-the-loop) mode
# Usage: ./ralph-once.sh
#
# Use this to watch Ralph work and refine your prompt.
# For autonomous AFK mode, use ./ralph.sh instead.
#
# Prerequisites:
# - Linear MCP must be configured (https://linear.app/docs/mcp)
# - Claude Code CLI must be installed

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_FILE="$SCRIPT_DIR/.ralph-project"

# Check if .ralph-project exists, if not run setup
if [ ! -f "$PROJECT_FILE" ]; then
  echo "No Linear project configured. Run ./ralph.sh first for interactive setup."
  exit 1
fi

# Read project configuration
PROJECT_ID=$(jq -r '.linearProjectId // empty' "$PROJECT_FILE" 2>/dev/null || echo "")
BRANCH_NAME=$(jq -r '.branchName // empty' "$PROJECT_FILE" 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
  echo "Error: linearProjectId not found in .ralph-project"
  exit 1
fi

echo "═══════════════════════════════════════════════════════"
echo "  Ralph HITL Mode - Single Iteration"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Linear Project: $PROJECT_ID"
[ -n "$BRANCH_NAME" ] && echo "Branch: $BRANCH_NAME"
echo ""
echo "Watch Ralph work. Ctrl+C to stop at any time."
echo ""

# Run single iteration
cat "$SCRIPT_DIR/prompt.md" | claude --dangerously-skip-permissions -p

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  HITL iteration complete."
echo "  Review the changes, then run again or use ./ralph.sh for AFK mode."
echo "═══════════════════════════════════════════════════════"
