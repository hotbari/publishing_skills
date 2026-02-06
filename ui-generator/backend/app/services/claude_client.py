"""Claude API client for generating React UI code."""
import re
from typing import Dict, List, Optional
from anthropic import Anthropic
from app.config import settings
from app.services.skill_loader import get_skill_loader
from app.models.schemas import GeneratedFile, TokenUsage


class ClaudeClient:
    """Client for interacting with Claude API."""

    def __init__(self):
        """Initialize Claude client."""
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.skill_loader = get_skill_loader()

    async def generate_code(
        self,
        user_prompt: str,
        page_type: Optional[str] = None
    ) -> Dict:
        """Generate React UI code from user prompt.

        Args:
            user_prompt: Natural language description of UI to generate
            page_type: Optional page type hint (form, list, detail, dashboard)

        Returns:
            Dictionary containing:
                - success: bool
                - files: List[GeneratedFile]
                - preview_html: str
                - token_usage: TokenUsage
                - error: Optional[str]
        """
        try:
            # Build system prompt with skill instructions
            system_prompt = self.skill_loader.load_skill_instructions(page_type)

            # Call Claude API
            message = self.client.messages.create(
                model=settings.claude_model,
                max_tokens=settings.max_tokens,
                temperature=settings.temperature,
                system=system_prompt,
                messages=[{
                    "role": "user",
                    "content": f"Generate a React frontend for: {user_prompt}"
                }]
            )

            # Extract text content from response
            response_text = ""
            for block in message.content:
                if block.type == "text":
                    response_text += block.text

            # Parse generated code files
            files = self._parse_generated_code(response_text)

            if not files:
                return {
                    "success": False,
                    "files": [],
                    "preview_html": "",
                    "token_usage": {
                        "input": message.usage.input_tokens,
                        "output": message.usage.output_tokens
                    },
                    "error": "Failed to parse generated code. No valid files found in response."
                }

            # Generate preview HTML
            preview_html = self._generate_preview_html(files)

            return {
                "success": True,
                "files": files,
                "preview_html": preview_html,
                "token_usage": {
                    "input": message.usage.input_tokens,
                    "output": message.usage.output_tokens
                },
                "error": None
            }

        except Exception as e:
            print(f"Error generating code: {e}")
            return {
                "success": False,
                "files": [],
                "preview_html": "",
                "token_usage": {"input": 0, "output": 0},
                "error": str(e)
            }

    def _parse_generated_code(self, response_text: str) -> List[Dict]:
        """Parse generated code files from Claude response.

        Expected format:
        FILE: src/pages/PageName.tsx
        ```tsx
        // code here
        ```

        Args:
            response_text: Raw response text from Claude

        Returns:
            List of file dictionaries with 'path' and 'content' keys
        """
        files = []

        # Pattern to match file blocks
        # Matches: FILE: path\n```language\ncode\n```
        pattern = r'FILE:\s*([^\n]+)\n```(?:tsx?|typescript|javascript)?\n(.*?)```'

        matches = re.finditer(pattern, response_text, re.DOTALL)

        for match in matches:
            file_path = match.group(1).strip()
            file_content = match.group(2).strip()

            files.append({
                "path": file_path,
                "content": file_content
            })

        # If no files found with FILE: marker, try to extract code blocks directly
        if not files:
            code_blocks = re.finditer(r'```(?:tsx?|typescript)?\n(.*?)```', response_text, re.DOTALL)
            for i, match in enumerate(code_blocks):
                content = match.group(1).strip()
                # Try to infer filename from content
                filename = self._infer_filename(content, i)
                files.append({
                    "path": filename,
                    "content": content
                })

        return files

    def _infer_filename(self, content: str, index: int) -> str:
        """Infer filename from code content.

        Args:
            content: Code content
            index: File index for fallback naming

        Returns:
            Inferred filename
        """
        # Try to extract component name from export statement
        export_match = re.search(r'export\s+(?:default\s+)?function\s+(\w+)', content)
        if export_match:
            component_name = export_match.group(1)
            return f"src/components/{component_name}.tsx"

        # Try to extract from const component
        const_match = re.search(r'const\s+(\w+)\s*=\s*\(\)', content)
        if const_match:
            component_name = const_match.group(1)
            return f"src/components/{component_name}.tsx"

        # Fallback
        return f"src/components/Component{index + 1}.tsx"

    def _generate_preview_html(self, files: List[Dict]) -> str:
        """Generate preview HTML from generated files.

        Args:
            files: List of generated file dictionaries

        Returns:
            HTML string for preview iframe
        """
        # Find the main page component (usually in src/pages/)
        main_component = None
        for file in files:
            if "pages/" in file["path"] or "Page" in file["path"]:
                main_component = file["content"]
                break

        # If no page found, use first component
        if not main_component and files:
            main_component = files[0]["content"]

        if not main_component:
            return "<html><body><p>No preview available</p></body></html>"

        # Generate a simple preview HTML
        # Note: This is a simplified version - in production, you'd want to properly
        # transpile JSX and handle imports
        preview_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {{ margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }}
    </style>
</head>
<body>
    <div id="preview">
        <div class="bg-muted p-6 rounded-lg border border-border">
            <p class="text-muted-foreground">Preview rendering requires a React runtime.</p>
            <p class="text-sm text-muted-foreground mt-2">View generated code in the "Code" tab.</p>
        </div>
    </div>
    <!-- In production, you would transpile and render the React component here -->
</body>
</html>
"""
        return preview_html


# Singleton instance
_claude_client = None


def get_claude_client() -> ClaudeClient:
    """Get or create Claude client singleton."""
    global _claude_client
    if _claude_client is None:
        _claude_client = ClaudeClient()
    return _claude_client
