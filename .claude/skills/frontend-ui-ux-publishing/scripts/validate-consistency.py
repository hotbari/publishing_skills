#!/usr/bin/env python3
"""
Consistency Validation Script

Checks if the frontend code follows consistency rules:
- 8px spacing scale (no arbitrary values)
- No hardcoded colors
- Proper component imports (from common/, not ui/)
- Design token usage

Usage:
    python validate-consistency.py [directory]

Example:
    python validate-consistency.py ./src
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Tuple


# Allowed spacing values (8px scale)
ALLOWED_SPACING = {'0', '1', '2', '4', '6', '8', '10', '12', '16', '20', '24'}

# Forbidden patterns
FORBIDDEN_PATTERNS = [
    (r'margin:\s*\d+px', 'Hardcoded margin (use design tokens)'),
    (r'padding:\s*\d+px', 'Hardcoded padding (use design tokens)'),
    (r'gap:\s*\d+px', 'Hardcoded gap (use design tokens)'),
    (r'#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])', 'Hardcoded hex color (use semantic tokens)'),
    (r'rgb\(', 'Hardcoded RGB color (use semantic tokens)'),
    (r'hsl\(', 'Hardcoded HSL color (use semantic tokens)'),
    (r"from\s+['\"]@/components/ui/", 'Direct import from ui/ (use common/ instead)'),
]

# Warning patterns (Tailwind arbitrary values outside allowed scale)
SPACING_PATTERN = r'\b(?:m|p|gap|space)-\[(\d+)px\]'


def check_file(file_path: Path) -> List[Tuple[int, str, str]]:
    """Check a single file for consistency violations."""
    violations = []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Warning: Could not read {file_path}: {e}")
        return violations

    for line_num, line in enumerate(lines, start=1):
        # Check forbidden patterns
        for pattern, message in FORBIDDEN_PATTERNS:
            if re.search(pattern, line):
                violations.append((line_num, message, line.strip()))

        # Check arbitrary spacing values
        for match in re.finditer(SPACING_PATTERN, line):
            spacing_value = match.group(1)
            if spacing_value not in ALLOWED_SPACING:
                violations.append((
                    line_num,
                    f'Arbitrary spacing value [{spacing_value}px] not in 8px scale',
                    line.strip()
                ))

    return violations


def validate_directory(directory: Path) -> dict:
    """Validate all TypeScript/TSX files in directory."""
    results = {}
    extensions = {'.ts', '.tsx', '.js', '.jsx'}

    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = Path(root) / file
                violations = check_file(file_path)
                if violations:
                    results[file_path] = violations

    return results


def main():
    if len(sys.argv) > 1:
        target_dir = Path(sys.argv[1])
    else:
        target_dir = Path('./src')

    if not target_dir.exists():
        print(f"Error: Directory {target_dir} does not exist")
        sys.exit(1)

    print(f"Validating consistency in: {target_dir}")
    print("Checking for:")
    print("  - 8px spacing scale compliance")
    print("  - No hardcoded colors")
    print("  - Proper component imports")
    print("  - Design token usage")
    print()

    results = validate_directory(target_dir)

    if not results:
        print("✅ No consistency violations found!")
        print("All spacing, colors, and imports follow the consistency rules.")
        sys.exit(0)

    # Print violations
    total_violations = 0
    for file_path, violations in results.items():
        print(f"\n❌ {file_path}")
        for line_num, message, line in violations:
            print(f"  Line {line_num}: {message}")
            print(f"    {line}")
            total_violations += 1

    print(f"\n❌ Found {total_violations} consistency violations in {len(results)} files")
    print("\nFix these violations to ensure consistent output.")
    print("See references/consistency-rules.md for details.")
    sys.exit(1)


if __name__ == "__main__":
    main()
