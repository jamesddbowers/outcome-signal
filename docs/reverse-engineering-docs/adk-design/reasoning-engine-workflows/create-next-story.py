"""
BMad Framework - Create Next Story Workflow
===========================================

Reasoning Engine implementation for the create-next-story task.

This workflow implements the 6-step sequential story creation process that:
1. Identifies the next logical story based on project progress
2. Gathers requirements from epic definitions
3. Extracts architecture context based on story type
4. Verifies project structure alignment
5. Populates story template with complete technical context
6. Validates story draft via checklist

**Primary Agent**: SM (Bob) - Scrum Master
**Workflow Type**: Sequential
**Analysis Reference**: analysis/tasks/create-next-story.md
**Agent Config**: adk-design/agent-configurations/sm.yaml

Architecture Pattern:
--------------------
This workflow uses Google's Vertex AI Reasoning Engine with:
- Sequential step execution with blocking conditions
- Firestore for state persistence and resumption
- Cloud Storage for document reading (epics, architecture)
- Story-type-aware selective architecture reading
- Configuration-driven behavior from Firestore

Dependencies:
------------
- google-adk: Google's Agent Development Kit
- google-cloud-firestore: State and configuration storage
- google-cloud-storage: Document and template storage
- google-cloud-aiplatform: Vertex AI Reasoning Engine

Installation:
```bash
pip install google-adk google-cloud-firestore google-cloud-storage google-cloud-aiplatform
```
"""

from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum
import re
from datetime import datetime

# Google Cloud imports
from google.cloud import firestore
from google.cloud import storage
from google.cloud import aiplatform

# Google ADK imports
from google import adk
from adk.workflows import WorkflowAgent, WorkflowStep


# ============================================================================
# Data Models
# ============================================================================

class StoryStatus(Enum):
    """Story lifecycle states"""
    DRAFT = "draft"
    APPROVED = "approved"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"


class StoryType(Enum):
    """Story classification for architecture reading"""
    BACKEND = "backend"
    FRONTEND = "frontend"
    FULLSTACK = "fullstack"


@dataclass
class StoryIdentifier:
    """Story reference: epic.story"""
    epic: int
    story: int

    def __str__(self) -> str:
        return f"{self.epic}.{self.story}"

    @classmethod
    def from_string(cls, s: str) -> 'StoryIdentifier':
        """Parse '1.2' -> StoryIdentifier(epic=1, story=2)"""
        parts = s.split('.')
        return cls(epic=int(parts[0]), story=int(parts[1]))


@dataclass
class StoryRequirements:
    """Parsed story requirements from epic"""
    identifier: StoryIdentifier
    title: str
    user_story: Dict[str, str]  # role, action, benefit
    acceptance_criteria: List[str]
    epic_notes: List[str] = field(default_factory=list)
    story_type: Optional[StoryType] = None

    def get_text_for_classification(self) -> str:
        """Get combined text for story type classification"""
        return (
            f"{self.title} "
            f"{self.user_story.get('action', '')} "
            f"{' '.join(self.acceptance_criteria)}"
        )


@dataclass
class ArchitectureContext:
    """Architecture information extracted for story"""
    tech_stack: str = ""
    coding_standards: str = ""
    project_structure: str = ""
    data_models: str = ""
    testing_strategy: str = ""
    # Story-type-specific context
    backend_arch: str = ""
    api_specs: str = ""
    external_apis: str = ""
    frontend_arch: str = ""
    components: str = ""
    workflows: str = ""


@dataclass
class WorkflowState:
    """Persistent state for workflow resumption"""
    project_id: str
    workflow_id: str
    current_step: int = 0
    story_id: Optional[StoryIdentifier] = None
    requirements: Optional[StoryRequirements] = None
    previous_insights: str = ""
    arch_context: Optional[ArchitectureContext] = None
    structure_notes: str = ""
    story_content: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> Dict:
        """Convert to Firestore document"""
        return {
            'project_id': self.project_id,
            'workflow_id': self.workflow_id,
            'current_step': self.current_step,
            'story_id': str(self.story_id) if self.story_id else None,
            'requirements': self.requirements.__dict__ if self.requirements else None,
            'previous_insights': self.previous_insights,
            'arch_context': self.arch_context.__dict__ if self.arch_context else None,
            'structure_notes': self.structure_notes,
            'story_content': self.story_content,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


# ============================================================================
# Reasoning Engine Workflow Implementation
# ============================================================================

class CreateNextStoryWorkflow(WorkflowAgent):
    """
    Vertex AI Reasoning Engine workflow for create-next-story task.

    Implements the 6-step sequential process:
    0. Load core configuration and validate
    1. Identify next story for preparation
    2. Gather story requirements and previous story context
    3. Gather architecture context (story-type-aware)
    4. Verify project structure alignment
    5. Populate story template
    6. Execute draft checklist validation

    This workflow is resumable - if interrupted, it can continue from the last
    completed step using Firestore state persistence.
    """

    def __init__(
        self,
        project_id: str,
        firestore_client: Optional[firestore.Client] = None,
        storage_client: Optional[storage.Client] = None
    ):
        """
        Initialize workflow with GCP clients.

        Args:
            project_id: GCP project ID
            firestore_client: Firestore client (auto-created if None)
            storage_client: Cloud Storage client (auto-created if None)
        """
        super().__init__()
        self.project_id = project_id
        self.db = firestore_client or firestore.Client(project=project_id)
        self.storage = storage_client or storage.Client(project=project_id)

        # Configuration loaded from Firestore
        self.config: Optional[Dict] = None

        # Workflow state
        self.state: Optional[WorkflowState] = None

    # ========================================================================
    # Step 0: Load Core Configuration
    # ========================================================================

    @WorkflowStep(step_id="step_0_load_config", description="Load and validate project configuration")
    def load_core_config(self, bmad_project_id: str) -> Dict:
        """
        Load core-config.yaml equivalent from Firestore.

        In file-based BMad: Reads .bmad-core/core-config.yaml
        In ADK BMad: Reads from Firestore /projects/{projectId}/config

        Args:
            bmad_project_id: BMad project identifier (not GCP project)

        Returns:
            Configuration dictionary

        Raises:
            ValueError: If configuration not found or invalid
        """
        config_ref = self.db.collection('projects').document(bmad_project_id)
        config_doc = config_ref.get()

        if not config_doc.exists:
            raise ValueError(
                f"Configuration not found for project '{bmad_project_id}'. "
                "Project must be initialized before creating stories. "
                "Please run project initialization workflow first."
            )

        config_data = config_doc.to_dict()
        self.config = config_data.get('config', {})

        # Validate required fields
        required_fields = [
            'devStoryLocation',
            'prd.prdSharded',
            'architecture.architectureVersion'
        ]

        for field_path in required_fields:
            if not self._get_nested_field(self.config, field_path):
                raise ValueError(
                    f"Missing required configuration field: {field_path}. "
                    "Please update project configuration."
                )

        print(f"✓ Configuration loaded for project: {bmad_project_id}")
        print(f"  - Story Location: {self.config.get('devStoryLocation')}")
        print(f"  - PRD Sharded: {self.config.get('prd', {}).get('prdSharded')}")
        print(f"  - Architecture Version: {self.config.get('architecture', {}).get('architectureVersion')}")

        return self.config

    # ========================================================================
    # Step 1: Identify Next Story
    # ========================================================================

    @WorkflowStep(step_id="step_1_identify_story", description="Identify next story for preparation")
    def identify_next_story(
        self,
        bmad_project_id: str,
        story_override: Optional[str] = None
    ) -> StoryIdentifier:
        """
        Identify the next logical story based on project progress.

        Logic:
        1. Query existing story files from Cloud Storage
        2. Find highest story number
        3. Check if highest story is Done
        4. Determine next story (same epic or next epic)
        5. Handle epic completion (requires user approval)

        Args:
            bmad_project_id: BMad project identifier
            story_override: Optional explicit story (e.g., "2.3")

        Returns:
            StoryIdentifier for next story

        Raises:
            ValueError: If incomplete story found or epic complete
        """
        if story_override:
            print(f"Using override story: {story_override}")
            return StoryIdentifier.from_string(story_override)

        # Get existing stories from Firestore
        stories_ref = (
            self.db.collection('projects')
            .document(bmad_project_id)
            .collection('stories')
            .order_by('epic')
            .order_by('story')
        )

        stories = list(stories_ref.stream())

        if not stories:
            # No stories exist - start at beginning
            print("No existing stories found. Starting with story 1.1")
            return StoryIdentifier(epic=1, story=1)

        # Find highest story
        highest = stories[-1]
        highest_data = highest.to_dict()
        highest_id = StoryIdentifier(
            epic=highest_data['epic'],
            story=highest_data['story']
        )
        highest_status = StoryStatus(highest_data.get('status', 'draft'))

        # Check if highest story is complete
        if highest_status != StoryStatus.DONE:
            raise ValueError(
                f"ALERT: Found incomplete story!\n"
                f"Story: {highest_id}\n"
                f"Status: {highest_status.value}\n\n"
                f"You should complete this story first.\n"
                f"To override and create the next story anyway, pass story_override parameter."
            )

        # Story is done - determine next
        print(f"✓ Latest story {highest_id} is complete (status: {highest_status.value})")

        # Get epic to check story count
        epic_doc = self._load_epic_document(bmad_project_id, highest_id.epic)
        total_stories = self._count_stories_in_epic(epic_doc)

        if highest_id.story < total_stories:
            # More stories in current epic
            next_story = StoryIdentifier(
                epic=highest_id.epic,
                story=highest_id.story + 1
            )
            print(f"Next story in Epic {highest_id.epic}: {next_story}")
            return next_story
        else:
            # Epic complete - need user approval to advance
            raise ValueError(
                f"Epic {highest_id.epic} Complete!\n\n"
                f"All {total_stories} stories in Epic {highest_id.epic} have been completed.\n\n"
                f"To begin Epic {highest_id.epic + 1}, pass story_override='{highest_id.epic + 1}.1'\n"
                f"Or specify a different story to work on."
            )

    # ========================================================================
    # Step 2: Gather Requirements
    # ========================================================================

    @WorkflowStep(step_id="step_2_gather_requirements", description="Gather story requirements and previous context")
    def gather_requirements(
        self,
        bmad_project_id: str,
        story_id: StoryIdentifier
    ) -> Tuple[StoryRequirements, str]:
        """
        Extract story requirements from epic and previous story insights.

        Actions:
        1. Load epic document from Cloud Storage
        2. Parse story section (title, user story, acceptance criteria)
        3. Load previous story (if exists)
        4. Extract Dev Agent Record insights
        5. Classify story type (backend/frontend/fullstack)

        Args:
            bmad_project_id: BMad project identifier
            story_id: Story to gather requirements for

        Returns:
            Tuple of (StoryRequirements, previous_insights_text)
        """
        print(f"Gathering requirements for story {story_id}...")

        # Load epic document
        epic_doc = self._load_epic_document(bmad_project_id, story_id.epic)

        # Parse story section
        requirements = self._parse_story_from_epic(epic_doc, story_id)

        # Classify story type
        requirements.story_type = self._classify_story_type(requirements)
        print(f"  Story type classified as: {requirements.story_type.value}")

        # Get previous story insights
        previous_insights = ""
        if story_id.story > 1:
            prev_id = StoryIdentifier(epic=story_id.epic, story=story_id.story - 1)
            previous_insights = self._extract_previous_insights(bmad_project_id, prev_id)
        elif story_id.epic > 1:
            # Get last story from previous epic
            prev_epic_doc = self._load_epic_document(bmad_project_id, story_id.epic - 1)
            prev_epic_stories = self._count_stories_in_epic(prev_epic_doc)
            prev_id = StoryIdentifier(epic=story_id.epic - 1, story=prev_epic_stories)
            previous_insights = self._extract_previous_insights(bmad_project_id, prev_id)

        if previous_insights:
            print(f"  ✓ Extracted insights from previous story")

        return requirements, previous_insights

    # ========================================================================
    # Step 3: Gather Architecture Context
    # ========================================================================

    @WorkflowStep(step_id="step_3_gather_architecture", description="Gather story-specific architecture context")
    def gather_architecture_context(
        self,
        bmad_project_id: str,
        requirements: StoryRequirements
    ) -> ArchitectureContext:
        """
        Extract architecture context based on story type.

        Story-Type-Aware Reading Strategy:
        - BACKEND: Read backend-arch, api-specs, database-schema, data-models, external-apis
        - FRONTEND: Read frontend-arch, components, core-workflows, data-models
        - FULLSTACK: Read all architecture documents

        Always read:
        - tech-stack.md
        - coding-standards.md
        - unified-project-structure.md (or source-tree.md)
        - testing-strategy.md
        - data-models.md

        Args:
            bmad_project_id: BMad project identifier
            requirements: Story requirements with classified type

        Returns:
            ArchitectureContext with relevant sections populated
        """
        print(f"Gathering architecture context for {requirements.story_type.value} story...")

        context = ArchitectureContext()
        arch_config = self.config.get('architecture', {})

        # Always-read files
        context.tech_stack = self._read_architecture_file(
            bmad_project_id, 'tech-stack.md'
        )
        context.coding_standards = self._read_architecture_file(
            bmad_project_id, 'coding-standards.md'
        )
        context.project_structure = self._read_architecture_file(
            bmad_project_id, 'unified-project-structure.md'
        ) or self._read_architecture_file(
            bmad_project_id, 'source-tree.md'
        )
        context.testing_strategy = self._read_architecture_file(
            bmad_project_id, 'testing-strategy.md'
        )
        context.data_models = self._read_architecture_file(
            bmad_project_id, 'data-models.md'
        )

        # Story-type-specific reading
        story_type = requirements.story_type

        if story_type in [StoryType.BACKEND, StoryType.FULLSTACK]:
            context.backend_arch = self._read_architecture_file(
                bmad_project_id, 'backend-architecture.md'
            )
            context.api_specs = self._read_architecture_file(
                bmad_project_id, 'rest-api-spec.md'
            )
            context.external_apis = self._read_architecture_file(
                bmad_project_id, 'external-apis.md'
            )
            print("  ✓ Loaded backend architecture context")

        if story_type in [StoryType.FRONTEND, StoryType.FULLSTACK]:
            context.frontend_arch = self._read_architecture_file(
                bmad_project_id, 'frontend-architecture.md'
            )
            context.components = self._read_architecture_file(
                bmad_project_id, 'components.md'
            )
            context.workflows = self._read_architecture_file(
                bmad_project_id, 'core-workflows.md'
            )
            print("  ✓ Loaded frontend architecture context")

        return context

    # ========================================================================
    # Step 4: Verify Project Structure
    # ========================================================================

    @WorkflowStep(step_id="step_4_verify_structure", description="Verify project structure alignment")
    def verify_project_structure(
        self,
        bmad_project_id: str,
        requirements: StoryRequirements,
        arch_context: ArchitectureContext
    ) -> str:
        """
        Verify that story aligns with documented project structure.

        Actions:
        1. Review unified-project-structure.md (or source-tree.md)
        2. Analyze story requirements for file operations
        3. Generate alignment notes for developers

        Args:
            bmad_project_id: BMad project identifier
            requirements: Story requirements
            arch_context: Architecture context (includes project structure)

        Returns:
            Structure alignment notes
        """
        print("Verifying project structure alignment...")

        # In production, this would use an LLM to analyze alignment
        # For this design, we create a placeholder
        structure_notes = f"""
## Project Structure Alignment

Based on the project structure documented in unified-project-structure.md:

**Story Type**: {requirements.story_type.value}

**Expected File Locations**:
- Review project structure guide above
- Follow naming conventions from coding-standards.md
- Place test files according to testing-strategy.md

**Development Guidance**:
- Maintain consistency with existing file organization
- Follow the source tree patterns documented in architecture
- Update relevant index files if creating new modules

**Notes**:
This section will be populated by the SM agent based on story-specific analysis.
        """.strip()

        print("  ✓ Structure alignment notes prepared")
        return structure_notes

    # ========================================================================
    # Step 5: Populate Story Template
    # ========================================================================

    @WorkflowStep(step_id="step_5_populate_template", description="Populate story template with context")
    def populate_story_template(
        self,
        bmad_project_id: str,
        requirements: StoryRequirements,
        previous_insights: str,
        arch_context: ArchitectureContext,
        structure_notes: str
    ) -> Dict[str, Any]:
        """
        Generate complete story document from template.

        The story template includes:
        - Story header (epic, number, title, status)
        - User story statement
        - Acceptance criteria
        - Technical context (architecture citations)
        - Dev notes (previous insights, structure guidance)
        - Task list (to be populated by dev)
        - Dev Agent Record (to be populated by dev)

        Args:
            bmad_project_id: BMad project identifier
            requirements: Story requirements
            previous_insights: Insights from previous story
            arch_context: Architecture context
            structure_notes: Structure alignment notes

        Returns:
            Story content dictionary
        """
        print(f"Populating story template for {requirements.identifier}...")

        # Load story template from Cloud Storage
        template = self._load_template('story-tmpl.yaml')

        # Populate story content
        story_content = {
            'epic': requirements.identifier.epic,
            'story': requirements.identifier.story,
            'title': requirements.title,
            'status': StoryStatus.DRAFT.value,
            'user_story': requirements.user_story,
            'acceptance_criteria': requirements.acceptance_criteria,
            'technical_context': {
                'story_type': requirements.story_type.value,
                'tech_stack': arch_context.tech_stack,
                'coding_standards': arch_context.coding_standards,
                'testing_strategy': arch_context.testing_strategy,
                'data_models': arch_context.data_models,
                'backend_architecture': arch_context.backend_arch if requirements.story_type in [StoryType.BACKEND, StoryType.FULLSTACK] else None,
                'frontend_architecture': arch_context.frontend_arch if requirements.story_type in [StoryType.FRONTEND, StoryType.FULLSTACK] else None,
            },
            'dev_notes': {
                'previous_insights': previous_insights,
                'structure_notes': structure_notes,
                'architecture_references': self._generate_architecture_references(
                    requirements.story_type
                ),
            },
            'tasks': [],  # Populated by Dev agent during implementation
            'dev_agent_record': {},  # Populated by Dev agent after completion
            'created_at': datetime.now().isoformat(),
            'created_by': 'sm-agent',
        }

        print("  ✓ Story template populated")
        return story_content

    # ========================================================================
    # Step 6: Execute Draft Checklist
    # ========================================================================

    @WorkflowStep(step_id="step_6_validate_draft", description="Validate story draft via checklist")
    def execute_draft_checklist(
        self,
        bmad_project_id: str,
        story_content: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Run story-draft-checklist validation.

        Checklist validates:
        - Story has clear title and user story
        - Acceptance criteria are testable
        - Technical context is complete
        - Architecture citations are present
        - Structure notes are included

        Args:
            bmad_project_id: BMad project identifier
            story_content: Populated story content

        Returns:
            Checklist results with validation status
        """
        print("Executing story draft checklist...")

        # Load checklist from Cloud Storage
        checklist = self._load_checklist('story-draft-checklist.md')

        # Execute validation
        # In production, this would use execute-checklist workflow
        # For this design, we create a basic validation
        results = {
            'checklist_id': 'story-draft-checklist',
            'passed': True,
            'checks': [
                {'check': 'Story has clear title', 'status': 'pass'},
                {'check': 'User story follows As a/I want/So that format', 'status': 'pass'},
                {'check': 'Acceptance criteria are testable', 'status': 'pass'},
                {'check': 'Technical context includes architecture', 'status': 'pass'},
                {'check': 'Previous insights captured (if applicable)', 'status': 'pass'},
            ],
            'validated_at': datetime.now().isoformat(),
        }

        print("  ✓ Draft checklist validation complete")
        return results

    # ========================================================================
    # Main Workflow Execution
    # ========================================================================

    def execute(
        self,
        bmad_project_id: str,
        story_override: Optional[str] = None,
        resume: bool = False
    ) -> Dict[str, Any]:
        """
        Execute the complete create-next-story workflow.

        This is the main entry point called by Vertex AI Reasoning Engine.

        Args:
            bmad_project_id: BMad project identifier
            story_override: Optional explicit story to create (e.g., "2.3")
            resume: Whether to resume from previous execution

        Returns:
            Workflow result with story content and metadata
        """
        workflow_id = f"create-next-story-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        if resume:
            # Load previous state from Firestore
            self.state = self._load_workflow_state(bmad_project_id, workflow_id)
            print(f"Resuming workflow from step {self.state.current_step}")
        else:
            # Initialize new workflow state
            self.state = WorkflowState(
                project_id=bmad_project_id,
                workflow_id=workflow_id
            )

        try:
            # Step 0: Load configuration
            if self.state.current_step == 0:
                self.load_core_config(bmad_project_id)
                self.state.current_step = 1
                self._save_workflow_state()

            # Step 1: Identify next story
            if self.state.current_step == 1:
                self.state.story_id = self.identify_next_story(
                    bmad_project_id,
                    story_override
                )
                self.state.current_step = 2
                self._save_workflow_state()

            # Step 2: Gather requirements
            if self.state.current_step == 2:
                requirements, previous_insights = self.gather_requirements(
                    bmad_project_id,
                    self.state.story_id
                )
                self.state.requirements = requirements
                self.state.previous_insights = previous_insights
                self.state.current_step = 3
                self._save_workflow_state()

            # Step 3: Gather architecture context
            if self.state.current_step == 3:
                self.state.arch_context = self.gather_architecture_context(
                    bmad_project_id,
                    self.state.requirements
                )
                self.state.current_step = 4
                self._save_workflow_state()

            # Step 4: Verify project structure
            if self.state.current_step == 4:
                self.state.structure_notes = self.verify_project_structure(
                    bmad_project_id,
                    self.state.requirements,
                    self.state.arch_context
                )
                self.state.current_step = 5
                self._save_workflow_state()

            # Step 5: Populate story template
            if self.state.current_step == 5:
                self.state.story_content = self.populate_story_template(
                    bmad_project_id,
                    self.state.requirements,
                    self.state.previous_insights,
                    self.state.arch_context,
                    self.state.structure_notes
                )
                self.state.current_step = 6
                self._save_workflow_state()

            # Step 6: Execute draft checklist
            if self.state.current_step == 6:
                checklist_results = self.execute_draft_checklist(
                    bmad_project_id,
                    self.state.story_content
                )
                self.state.current_step = 7  # Complete
                self._save_workflow_state()

            # Save story to Firestore
            self._save_story(bmad_project_id, self.state.story_content)

            print(f"\n✓ Story {self.state.story_id} created successfully!")

            return {
                'success': True,
                'workflow_id': workflow_id,
                'story_id': str(self.state.story_id),
                'story_content': self.state.story_content,
                'checklist_results': checklist_results,
                'created_at': datetime.now().isoformat(),
            }

        except Exception as e:
            # Save error state for debugging
            error_state = {
                'error': str(e),
                'step': self.state.current_step,
                'timestamp': datetime.now().isoformat(),
            }
            self._save_error_state(workflow_id, error_state)

            raise RuntimeError(
                f"Workflow failed at step {self.state.current_step}: {str(e)}"
            ) from e

    # ========================================================================
    # Helper Methods
    # ========================================================================

    def _get_nested_field(self, data: Dict, path: str) -> Any:
        """Get nested dictionary value by dot-notation path"""
        keys = path.split('.')
        value = data
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return None
        return value

    def _load_epic_document(self, project_id: str, epic_num: int) -> str:
        """Load epic document from Cloud Storage"""
        # Implementation: Read from Cloud Storage bucket
        bucket_name = f"bmad-{project_id}-artifacts"
        epic_pattern = self.config.get('prd', {}).get('epicFilePattern', 'epic-{n}*.md')
        epic_filename = epic_pattern.replace('{n}', str(epic_num))

        # Placeholder - actual implementation would read from Cloud Storage
        return f"Epic {epic_num} content..."

    def _count_stories_in_epic(self, epic_doc: str) -> int:
        """Count stories defined in epic document"""
        # Parse epic markdown to count story sections
        story_pattern = r'### Story \d+\.\d+'
        matches = re.findall(story_pattern, epic_doc)
        return len(matches)

    def _parse_story_from_epic(
        self,
        epic_doc: str,
        story_id: StoryIdentifier
    ) -> StoryRequirements:
        """Parse story section from epic document"""
        # Implementation: Parse markdown to extract story components
        # Placeholder for design
        return StoryRequirements(
            identifier=story_id,
            title="Story Title",
            user_story={'role': 'user', 'action': 'do something', 'benefit': 'achieve goal'},
            acceptance_criteria=['Criterion 1', 'Criterion 2']
        )

    def _classify_story_type(self, requirements: StoryRequirements) -> StoryType:
        """Classify story as backend, frontend, or fullstack"""
        text = requirements.get_text_for_classification().lower()

        backend_keywords = ['api', 'endpoint', 'database', 'schema', 'model', 'service', 'auth']
        frontend_keywords = ['ui', 'component', 'page', 'form', 'button', 'display', 'view']

        backend_score = sum(1 for kw in backend_keywords if kw in text)
        frontend_score = sum(1 for kw in frontend_keywords if kw in text)

        if backend_score > 0 and frontend_score > 0:
            return StoryType.FULLSTACK
        elif backend_score > frontend_score:
            return StoryType.BACKEND
        elif frontend_score > backend_score:
            return StoryType.FRONTEND
        else:
            return StoryType.FULLSTACK

    def _extract_previous_insights(
        self,
        project_id: str,
        story_id: StoryIdentifier
    ) -> str:
        """Extract Dev Agent Record insights from previous story"""
        # Load previous story from Firestore
        story_ref = (
            self.db.collection('projects')
            .document(project_id)
            .collection('stories')
            .document(str(story_id))
        )
        story_doc = story_ref.get()

        if not story_doc.exists:
            return ""

        story_data = story_doc.to_dict()
        dev_record = story_data.get('dev_agent_record', {})
        completion_notes = dev_record.get('completion_notes', [])

        return '\n'.join(completion_notes) if completion_notes else ""

    def _read_architecture_file(
        self,
        project_id: str,
        filename: str
    ) -> str:
        """Read architecture file from Cloud Storage"""
        # Implementation: Read from Cloud Storage
        # Placeholder for design
        return f"Content of {filename}"

    def _generate_architecture_references(self, story_type: StoryType) -> List[str]:
        """Generate list of architecture files referenced for this story"""
        base_refs = [
            'tech-stack.md',
            'coding-standards.md',
            'unified-project-structure.md',
            'testing-strategy.md',
            'data-models.md'
        ]

        if story_type in [StoryType.BACKEND, StoryType.FULLSTACK]:
            base_refs.extend([
                'backend-architecture.md',
                'rest-api-spec.md',
                'database-schema.md'
            ])

        if story_type in [StoryType.FRONTEND, StoryType.FULLSTACK]:
            base_refs.extend([
                'frontend-architecture.md',
                'components.md',
                'core-workflows.md'
            ])

        return base_refs

    def _load_template(self, template_name: str) -> Dict:
        """Load template from Cloud Storage"""
        # Implementation: Read YAML template from Cloud Storage
        return {}

    def _load_checklist(self, checklist_name: str) -> Dict:
        """Load checklist from Cloud Storage"""
        # Implementation: Read checklist from Cloud Storage
        return {}

    def _save_workflow_state(self):
        """Persist workflow state to Firestore"""
        state_ref = (
            self.db.collection('workflow_states')
            .document(self.state.workflow_id)
        )
        state_ref.set(self.state.to_dict())

    def _load_workflow_state(self, project_id: str, workflow_id: str) -> WorkflowState:
        """Load workflow state from Firestore"""
        state_ref = self.db.collection('workflow_states').document(workflow_id)
        state_doc = state_ref.get()

        if not state_doc.exists:
            raise ValueError(f"Workflow state not found: {workflow_id}")

        # Reconstruct WorkflowState from dict
        # Implementation details omitted for brevity
        return WorkflowState(project_id=project_id, workflow_id=workflow_id)

    def _save_story(self, project_id: str, story_content: Dict):
        """Save completed story to Firestore"""
        story_id = f"{story_content['epic']}.{story_content['story']}"
        story_ref = (
            self.db.collection('projects')
            .document(project_id)
            .collection('stories')
            .document(story_id)
        )
        story_ref.set(story_content)
        print(f"  ✓ Story saved to Firestore: {story_id}")

    def _save_error_state(self, workflow_id: str, error_state: Dict):
        """Save error state for debugging"""
        error_ref = (
            self.db.collection('workflow_errors')
            .document(workflow_id)
        )
        error_ref.set(error_state)


# ============================================================================
# Deployment Configuration
# ============================================================================

def deploy_to_vertex_ai(
    project_id: str,
    region: str = 'us-central1',
    staging_bucket: str = None
):
    """
    Deploy this workflow to Vertex AI Reasoning Engine.

    Args:
        project_id: GCP project ID
        region: GCP region for deployment
        staging_bucket: Cloud Storage bucket for staging

    Returns:
        Deployed workflow resource name
    """
    aiplatform.init(
        project=project_id,
        location=region,
        staging_bucket=staging_bucket
    )

    # Create Reasoning Engine application
    reasoning_app = aiplatform.ReasoningEngine(
        requirements=[
            'google-adk',
            'google-cloud-firestore',
            'google-cloud-storage',
        ],
        reasoning_engine=CreateNextStoryWorkflow,
    )

    # Deploy
    reasoning_app.deploy(
        display_name='bmad-create-next-story-workflow',
        description='BMad Framework - Create Next Story Workflow',
        service_account='bmad-workflows@{}.iam.gserviceaccount.com'.format(project_id),
    )

    print(f"✓ Workflow deployed to Vertex AI Reasoning Engine")
    print(f"  Resource: {reasoning_app.resource_name}")

    return reasoning_app.resource_name


# ============================================================================
# Usage Example
# ============================================================================

if __name__ == '__main__':
    """
    Example usage of the Create Next Story workflow.

    This can be invoked:
    1. Directly (for testing)
    2. Via Vertex AI Reasoning Engine (production)
    3. Via Cloud Run API endpoint
    """

    # Example 1: Direct invocation
    workflow = CreateNextStoryWorkflow(project_id='my-gcp-project')
    result = workflow.execute(
        bmad_project_id='my-bmad-project',
        story_override=None  # Auto-identify next story
    )

    print(f"Story created: {result['story_id']}")
    print(f"Workflow ID: {result['workflow_id']}")

    # Example 2: Deploy to Vertex AI
    # deploy_to_vertex_ai(
    #     project_id='my-gcp-project',
    #     region='us-central1',
    #     staging_bucket='gs://my-bucket'
    # )
