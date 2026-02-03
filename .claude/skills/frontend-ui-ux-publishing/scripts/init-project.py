#!/usr/bin/env python3
"""
Initialize Project Script

Copies the project template and sets up a new frontend project.

Usage:
    python init-project.py <project-name> <target-directory>

Example:
    python init-project.py my-app ./my-app
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path


def main():
    if len(sys.argv) < 3:
        print("Usage: python init-project.py <project-name> <target-directory>")
        sys.exit(1)

    project_name = sys.argv[1]
    target_dir = Path(sys.argv[2]).resolve()
    script_dir = Path(__file__).parent
    template_dir = script_dir.parent / "assets" / "project-template"

    if not template_dir.exists():
        print(f"Error: Template directory not found at {template_dir}")
        sys.exit(1)

    if target_dir.exists():
        response = input(f"{target_dir} already exists. Overwrite? (y/N): ")
        if response.lower() != 'y':
            print("Aborted.")
            sys.exit(0)
        shutil.rmtree(target_dir)

    print(f"Creating project: {project_name}")
    print(f"Target directory: {target_dir}")

    # Copy template
    print("Copying template files...")
    shutil.copytree(template_dir, target_dir)

    # Update package.json with project name
    package_json_path = target_dir / "package.json"
    if package_json_path.exists():
        with open(package_json_path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('"name": "frontend-app"', f'"name": "{project_name}"')
        with open(package_json_path, 'w', encoding='utf-8') as f:
            f.write(content)

    # Update index.html title
    index_html_path = target_dir / "index.html"
    if index_html_path.exists():
        with open(index_html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('<title>Frontend App</title>', f'<title>{project_name}</title>')
        with open(index_html_path, 'w', encoding='utf-8') as f:
            f.write(content)

    print("\nProject created successfully!")
    print("\nNext steps:")
    print(f"  1. cd {target_dir}")
    print("  2. npm install")
    print("  3. npm run dev")
    print("\nProject structure follows consistency rules:")
    print("  - All spacing uses 8px scale")
    print("  - Common components enforce consistency")
    print("  - Design tokens prevent hardcoding")
    print("  - Page templates ensure structural consistency")

    # Ask if user wants to run npm install
    response = input("\nRun npm install now? (y/N): ")
    if response.lower() == 'y':
        print("\nInstalling dependencies...")
        subprocess.run(['npm', 'install'], cwd=target_dir, check=True)
        print("\nDependencies installed successfully!")
        print("\nRun 'npm run dev' to start the development server.")


if __name__ == "__main__":
    main()
