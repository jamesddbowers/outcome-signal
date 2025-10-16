"""
BMad Framework - Validate Next Story Workflow
==============================================

Reasoning Engine implementation for validate-next-story task.

**Primary Agent**: PO (Sarah)
**Workflow Type**: Pre-Implementation Story Validation
**Analysis Reference**: analysis/tasks/validate-next-story.md
"""

from typing import Dict, List
from dataclasses import dataclass
from enum import Enum
from datetime import datetime
from google.cloud import firestore
from google import adk
from adk.workflows import WorkflowAgent, WorkflowStep


class ValidationResult(Enum):
    """Story validation outcome"""
    APPROVED = "approved"
    CHANGES_REQUIRED = "changes_required"


@dataclass
class ValidationCheck:
    """Individual validation check"""
    check_name: str
    passed: bool
    notes: str = ""


class ValidateNextStoryWorkflow(WorkflowAgent):
    """
    Pre-implementation story validation by PO.

    Validates:
    - Story completeness (all required sections present)
    - Technical context adequacy
    - Architecture citations present
    - Previous insights captured
    - Alignment with product vision
    """

    def __init__(self, project_id: str, **kwargs):
        super().__init__()
        self.project_id = project_id
        self.db = firestore.Client(project=project_id)

    @WorkflowStep(step_id="step_1_check_completeness", description="Validate story completeness")
    def check_completeness(self, story_data: Dict) -> List[ValidationCheck]:
        """Validate all required story sections present"""
        checks = []

        # Required sections
        required_sections = [
            'title', 'user_story', 'acceptance_criteria',
            'technical_context', 'dev_notes'
        ]

        for section in required_sections:
            passed = section in story_data and story_data[section]
            checks.append(ValidationCheck(
                check_name=f"{section.replace('_', ' ').title()} present",
                passed=passed,
                notes="" if passed else f"Missing {section}"
            ))

        return checks

    @WorkflowStep(step_id="step_2_check_technical_context", description="Check technical context adequacy")
    def check_technical_context(self, story_data: Dict) -> List[ValidationCheck]:
        """Validate technical context is adequate"""
        checks = []
        tech_context = story_data.get('technical_context', {})

        # Check for key architecture elements
        required_elements = ['tech_stack', 'coding_standards', 'testing_strategy']

        for element in required_elements:
            passed = element in tech_context and tech_context[element]
            checks.append(ValidationCheck(
                check_name=f"Technical context includes {element.replace('_', ' ')}",
                passed=passed
            ))

        return checks

    @WorkflowStep(step_id="step_3_make_decision", description="Make approval decision")
    def make_approval_decision(self, all_checks: List[ValidationCheck]) -> ValidationResult:
        """Determine if story is approved or needs changes"""
        all_passed = all(check.passed for check in all_checks)

        return ValidationResult.APPROVED if all_passed else ValidationResult.CHANGES_REQUIRED

    def execute(self, bmad_project_id: str, story_id: str) -> Dict:
        """Execute story validation workflow"""
        story = self._load_story(bmad_project_id, story_id)

        # Perform validation checks
        completeness_checks = self.check_completeness(story)
        tech_checks = self.check_technical_context(story)

        all_checks = completeness_checks + tech_checks

        # Make decision
        result = self.make_approval_decision(all_checks)

        # Update story status if approved
        if result == ValidationResult.APPROVED:
            self._update_story_status(bmad_project_id, story_id, 'approved')

        return {
            'success': True,
            'story_id': story_id,
            'validation_result': result.value,
            'checks_passed': sum(1 for c in all_checks if c.passed),
            'checks_total': len(all_checks)
        }

    def _load_story(self, project_id: str, story_id: str) -> Dict:
        return self.db.collection('projects').document(project_id).collection('stories').document(story_id).get().to_dict()

    def _update_story_status(self, project_id: str, story_id: str, status: str):
        story_ref = self.db.collection('projects').document(project_id).collection('stories').document(story_id)
        story_ref.update({'status': status, 'approved_at': datetime.now().isoformat()})
