"""Load and format frontend-ui-ux-publishing skill instructions for Claude API."""
import os
from pathlib import Path
from typing import Optional


class SkillLoader:
    """Loads skill instructions from files."""

    def __init__(self, skill_data_dir: Optional[str] = None):
        """Initialize skill loader.

        Args:
            skill_data_dir: Path to skill data directory. If None, uses default location.
        """
        if skill_data_dir is None:
            # Default to backend/skill-data relative to this file
            backend_dir = Path(__file__).parent.parent.parent
            skill_data_dir = backend_dir / "skill-data"

        self.skill_data_dir = Path(skill_data_dir)

    def load_skill_instructions(self, page_type: Optional[str] = None) -> str:
        """Load complete skill instructions as a formatted system prompt.

        Args:
            page_type: Optional page type hint (form, list, detail, dashboard)

        Returns:
            Formatted system prompt with skill instructions
        """
        instructions = []

        # Base instructions
        instructions.append(self._load_base_instructions())

        # Design system rules
        design_system = self._load_file("design-system.md")
        if design_system:
            instructions.append("\n## Design System\n")
            instructions.append(design_system)

        # Consistency rules
        consistency = self._load_file("consistency-rules.md")
        if consistency:
            instructions.append("\n## Consistency Rules\n")
            instructions.append(consistency)

        # Page templates
        templates = self._load_file("page-templates.md")
        if templates:
            instructions.append("\n## Page Templates\n")
            instructions.append(templates)

        # Component library
        components = self._load_file("component-library.md")
        if components:
            instructions.append("\n## Component Library\n")
            instructions.append(components)

        # Page type specific guidance
        if page_type:
            instructions.append(f"\n## Page Type Guidance\n")
            instructions.append(f"Generate a {page_type.upper()} page type specifically. ")
            instructions.append(f"Follow the {page_type} page template from the templates section above.")

        # Output format instructions
        instructions.append(self._get_output_format_instructions())

        return "\n".join(instructions)

    def _load_base_instructions(self) -> str:
        """Load base skill instructions."""
        return """You are a frontend code generator that produces consistent, modern React UIs.

Your goal is to generate complete, production-ready React components following strict design system rules.

Key Principles:
1. **Consistency First**: Follow the 8px spacing scale strictly (gap-4, p-6, etc.)
2. **Design Tokens**: Use semantic tokens (text-primary, bg-muted, border-border)
3. **No Arbitrary Values**: Never use arbitrary values like `margin: 20px` or `w-[350px]`
4. **Component Library**: Import from common/, not ui/ directly
5. **TypeScript**: Always use TypeScript with proper types
6. **Accessibility**: Include ARIA labels and keyboard navigation
7. **Responsive**: Mobile-first design with responsive breakpoints"""

    def _get_output_format_instructions(self) -> str:
        """Get output format instructions."""
        return """

## Output Format

Generate code files with clear file path markers. Use this exact format:

FILE: src/pages/PageName.tsx
```tsx
// Component code here
import { Button } from "@/components/common/button"

export default function PageName() {
  return (
    <div className="container mx-auto p-6">
      {/* Component content */}
    </div>
  )
}
```

FILE: src/components/ComponentName.tsx
```tsx
// Component code here
```

**Important Requirements:**
- Each file MUST start with "FILE: " followed by the path
- Use TSX file extension for React components
- Include all necessary imports
- Use Tailwind CSS classes only
- Follow 8px spacing scale: gap-2 (8px), gap-4 (16px), gap-6 (24px), gap-8 (32px)
- Use semantic color tokens: text-primary, text-muted, bg-background, bg-muted, border-border
- Import components from @/components/common/, not @/components/ui/
- Include proper TypeScript types for props and state
"""

    def _load_file(self, filename: str) -> Optional[str]:
        """Load a file from skill data directory.

        Args:
            filename: Name of file to load

        Returns:
            File contents or None if file doesn't exist
        """
        file_path = self.skill_data_dir / filename

        if not file_path.exists():
            print(f"Warning: Skill file not found: {file_path}")
            return None

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            print(f"Error loading skill file {filename}: {e}")
            return None


# Singleton instance
_skill_loader = None


def get_skill_loader() -> SkillLoader:
    """Get or create skill loader singleton."""
    global _skill_loader
    if _skill_loader is None:
        _skill_loader = SkillLoader()
    return _skill_loader
