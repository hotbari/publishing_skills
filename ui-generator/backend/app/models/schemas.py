"""Pydantic models for request/response schemas."""
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    """Request model for UI generation."""
    prompt: str = Field(..., min_length=1, description="Natural language description of the UI to generate")
    page_type: Optional[Literal["form", "list", "detail", "dashboard"]] = Field(
        None,
        description="Optional page type hint to guide generation"
    )


class GeneratedFile(BaseModel):
    """Represents a generated code file."""
    path: str = Field(..., description="File path relative to src/")
    content: str = Field(..., description="File content (TSX/TypeScript code)")


class TokenUsage(BaseModel):
    """API token usage information."""
    input: int = Field(..., description="Input tokens consumed")
    output: int = Field(..., description="Output tokens generated")


class GenerateResponse(BaseModel):
    """Response model for UI generation."""
    success: bool = Field(..., description="Whether generation was successful")
    files: List[GeneratedFile] = Field(..., description="Generated code files")
    preview_html: str = Field(..., description="HTML preview of generated UI")
    token_usage: TokenUsage = Field(..., description="API token usage")
    error: Optional[str] = Field(None, description="Error message if generation failed")
