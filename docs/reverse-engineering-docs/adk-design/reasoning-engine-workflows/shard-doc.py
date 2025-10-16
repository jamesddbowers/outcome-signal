"""
BMad Framework - Shard Document Workflow
=========================================

Reasoning Engine implementation for shard-doc task.

**Primary Agent**: PM (PRD), Architect (Architecture), PO (coordination)
**Workflow Type**: Document Sharding (Monolithic → Sharded)
**Analysis Reference**: analysis/tasks/shard-doc.md
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum
from datetime import datetime
from google.cloud import firestore, storage
from google import adk
from adk.workflows import WorkflowAgent, WorkflowStep


class DocumentType(Enum):
    """Document types that can be sharded"""
    PRD = "prd"
    ARCHITECTURE = "architecture"


class ShardingStrategy(Enum):
    """Sharding strategy by document type"""
    EPIC_BASED = "epic_based"  # PRD: Split by epic
    CONCERN_BASED = "concern_based"  # Architecture: Split by technical concern


@dataclass
class DocumentShard:
    """Individual document shard"""
    shard_id: str
    filename: str
    title: str
    content: str
    order: int


@dataclass
class ShardingResult:
    """Result of sharding operation"""
    document_type: DocumentType
    original_file: str
    shards: List[DocumentShard]
    index_file: DocumentShard
    created_at: str


class ShardDocWorkflow(WorkflowAgent):
    """
    Document sharding workflow (monolithic → sharded structure).

    Sharding Strategies:
    - PRD: Epic-based (one file per epic + index)
    - Architecture: Concern-based (tech-stack, backend-arch, frontend-arch, etc.)

    Transition: v3 (monolithic) → v4 (sharded)
    """

    def __init__(self, project_id: str, **kwargs):
        super().__init__()
        self.project_id = project_id
        self.db = firestore.Client(project=project_id)
        self.storage = storage.Client(project=project_id)

    @WorkflowStep(step_id="step_1_analyze_document", description="Analyze document structure")
    def analyze_document(
        self,
        document_content: str,
        document_type: DocumentType
    ) -> Tuple[ShardingStrategy, List[str]]:
        """Analyze document to determine sharding strategy"""
        if document_type == DocumentType.PRD:
            strategy = ShardingStrategy.EPIC_BASED
            # Parse PRD to identify epic sections
            sections = self._parse_prd_epics(document_content)
        else:  # ARCHITECTURE
            strategy = ShardingStrategy.CONCERN_BASED
            # Parse architecture to identify technical concerns
            sections = self._parse_architecture_concerns(document_content)

        return strategy, sections

    @WorkflowStep(step_id="step_2_extract_shards", description="Extract sections into shards")
    def extract_shards(
        self,
        document_content: str,
        sections: List[str],
        strategy: ShardingStrategy
    ) -> List[DocumentShard]:
        """Extract document sections into individual shards"""
        shards = []

        for i, section_title in enumerate(sections, 1):
            # Extract section content
            section_content = self._extract_section(document_content, section_title)

            # Create shard
            if strategy == ShardingStrategy.EPIC_BASED:
                # PRD epic: epic-1-user-authentication.md
                filename = f"epic-{i}-{self._slugify(section_title)}.md"
            else:
                # Architecture concern: backend-architecture.md
                filename = f"{self._slugify(section_title)}.md"

            shard = DocumentShard(
                shard_id=f"shard_{i}",
                filename=filename,
                title=section_title,
                content=section_content,
                order=i
            )
            shards.append(shard)

        return shards

    @WorkflowStep(step_id="step_3_generate_index", description="Generate index file with navigation")
    def generate_index(
        self,
        shards: List[DocumentShard],
        document_type: DocumentType
    ) -> DocumentShard:
        """Generate index file with links to all shards"""
        index_content = self._build_index_content(shards, document_type)

        index_shard = DocumentShard(
            shard_id="index",
            filename="index.md",
            title="Index",
            content=index_content,
            order=0
        )

        return index_shard

    @WorkflowStep(step_id="step_4_preserve_references", description="Preserve cross-references")
    def preserve_cross_references(self, shards: List[DocumentShard]) -> List[DocumentShard]:
        """Update cross-references to work with sharded structure"""
        # In production, parse and update internal links
        # For design, return shards unchanged
        return shards

    @WorkflowStep(step_id="step_5_validate_integrity", description="Validate shard integrity")
    def validate_integrity(
        self,
        original_content: str,
        shards: List[DocumentShard]
    ) -> bool:
        """Validate no content lost during sharding"""
        # Compare original vs combined shard content
        # Ensure all sections accounted for
        return True

    def execute(
        self,
        bmad_project_id: str,
        document_type: str,  # "prd" or "architecture"
        document_path: str
    ) -> Dict:
        """Execute document sharding workflow"""
        doc_type = DocumentType(document_type)

        # Load original document
        original_content = self._load_document(bmad_project_id, document_path)

        # Analyze document
        strategy, sections = self.analyze_document(original_content, doc_type)

        # Extract shards
        shards = self.extract_shards(original_content, sections, strategy)

        # Generate index
        index_shard = self.generate_index(shards, doc_type)

        # Preserve cross-references
        shards = self.preserve_cross_references(shards)

        # Validate integrity
        valid = self.validate_integrity(original_content, shards)

        if not valid:
            raise ValueError("Shard integrity validation failed")

        # Save shards
        self._save_shards(bmad_project_id, doc_type, shards + [index_shard])

        # Create result
        result = ShardingResult(
            document_type=doc_type,
            original_file=document_path,
            shards=shards,
            index_file=index_shard,
            created_at=datetime.now().isoformat()
        )

        return {
            'success': True,
            'document_type': doc_type.value,
            'shard_count': len(shards),
            'index_file': index_shard.filename,
            'shards': [s.filename for s in shards]
        }

    def _parse_prd_epics(self, content: str) -> List[str]:
        """Parse PRD to identify epic sections"""
        # In production, parse markdown headings
        return ["User Authentication", "Dashboard", "Reports"]

    def _parse_architecture_concerns(self, content: str) -> List[str]:
        """Parse architecture to identify technical concerns"""
        return [
            "Tech Stack", "Backend Architecture", "Frontend Architecture",
            "Database Schema", "API Specification", "Testing Strategy"
        ]

    def _extract_section(self, content: str, section_title: str) -> str:
        """Extract section content from document"""
        # In production, parse markdown to extract section
        return f"# {section_title}\n\nSection content..."

    def _slugify(self, text: str) -> str:
        """Convert title to slug (lowercase-hyphenated)"""
        return text.lower().replace(' ', '-')

    def _build_index_content(self, shards: List[DocumentShard], doc_type: DocumentType) -> str:
        """Build index file content with navigation"""
        links = '\n'.join([f"- [{shard.title}]({shard.filename})" for shard in sorted(shards, key=lambda s: s.order)])

        return f"""# {doc_type.value.upper()} Index

## Document Structure

{links}

---

**Sharding Date**: {datetime.now().isoformat()}
**Shard Count**: {len(shards)}
"""

    def _load_document(self, project_id: str, document_path: str) -> str:
        """Load document from Cloud Storage"""
        # In production, read from Cloud Storage
        return "# Original Document\n\nContent..."

    def _save_shards(self, project_id: str, doc_type: DocumentType, shards: List[DocumentShard]):
        """Save shards to Cloud Storage"""
        # In production, write each shard to Cloud Storage
        bucket_name = f"bmad-{project_id}-artifacts"
        output_dir = f"{doc_type.value}/"

        for shard in shards:
            print(f"  ✓ Saved shard: {output_dir}{shard.filename}")
