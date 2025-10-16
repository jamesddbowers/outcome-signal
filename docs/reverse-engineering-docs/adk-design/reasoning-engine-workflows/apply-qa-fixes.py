"""
BMad Framework - Apply QA Fixes Workflow
=========================================

Reasoning Engine implementation for apply-qa-fixes task.

**Primary Agent**: Dev (James)
**Workflow Type**: Deterministic Fix Application
**Analysis Reference**: analysis/tasks/apply-qa-fixes.md
"""

from typing import Dict, List
from dataclasses import dataclass
from datetime import datetime
from google.cloud import firestore, storage
from google import adk
from adk.workflows import WorkflowAgent, WorkflowStep


@dataclass
class QAFix:
    """Individual QA fix to apply"""
    fix_id: str
    description: str
    severity: str  # high, medium, low
    file_path: str
    fix_action: str
    applied: bool = False
    tests_passed: bool = False


class ApplyQAFixesWorkflow(WorkflowAgent):
    """
    Deterministic application of QA-identified fixes.

    Process:
    1. Extract unchecked improvement items from QA Results
    2. Prioritize by severity
    3. Apply fixes sequentially
    4. Run tests after each fix
    5. Rollback on test failure
    6. Update story with progress
    """

    def __init__(self, project_id: str, **kwargs):
        super().__init__()
        self.project_id = project_id
        self.db = firestore.Client(project=project_id)

    @WorkflowStep(step_id="step_1_extract_fixes", description="Extract unchecked improvement items")
    def extract_fixes(self, qa_results: Dict, gate_file: Dict) -> List[QAFix]:
        """Extract improvement items from QA Results"""
        fixes = []

        # Parse QA Results for unchecked items
        # In production, parse markdown checkboxes
        unchecked_items = qa_results.get('unchecked_improvements', [])

        for i, item in enumerate(unchecked_items):
            fixes.append(QAFix(
                fix_id=f"FIX-{i+1}",
                description=item.get('description', ''),
                severity=item.get('severity', 'medium'),
                file_path=item.get('file_path', ''),
                fix_action=item.get('action', '')
            ))

        return sorted(fixes, key=lambda f: {'high': 0, 'medium': 1, 'low': 2}[f.severity])

    @WorkflowStep(step_id="step_2_apply_fixes", description="Apply fixes sequentially with test validation")
    def apply_fixes(self, bmad_project_id: str, story_id: str, fixes: List[QAFix]) -> List[QAFix]:
        """Apply each fix sequentially, running tests after each"""
        for fix in fixes:
            try:
                # Apply fix
                self._apply_single_fix(fix)
                fix.applied = True

                # Run tests
                tests_passed = self._run_tests()
                fix.tests_passed = tests_passed

                if not tests_passed:
                    # Rollback
                    self._rollback_fix(fix)
                    fix.applied = False
                    print(f"  ! Fix {fix.fix_id} rolled back (tests failed)")
                else:
                    print(f"  ✓ Fix {fix.fix_id} applied successfully")

            except Exception as e:
                print(f"  ! Error applying fix {fix.fix_id}: {str(e)}")
                fix.applied = False

        return fixes

    @WorkflowStep(step_id="step_3_update_story", description="Update story with fixes applied")
    def update_story(self, bmad_project_id: str, story_id: str, fixes: List[QAFix]) -> Dict:
        """Update story Dev Agent Record with fixes applied"""
        applied_count = sum(1 for f in fixes if f.applied)

        update_data = {
            'qa_fixes_applied': applied_count,
            'qa_fixes_total': len(fixes),
            'qa_fixes_timestamp': datetime.now().isoformat()
        }

        story_ref = (
            self.db.collection('projects')
            .document(bmad_project_id)
            .collection('stories')
            .document(story_id)
        )

        story_ref.update(update_data)
        return update_data

    def execute(self, bmad_project_id: str, story_id: str) -> Dict:
        """Execute QA fixes application workflow"""
        # Load QA Results and gate
        qa_results = self._load_qa_results(bmad_project_id, story_id)
        gate_file = self._load_gate_file(bmad_project_id, story_id)

        # Extract fixes
        fixes = self.extract_fixes(qa_results, gate_file)

        # Apply fixes
        fixes = self.apply_fixes(bmad_project_id, story_id, fixes)

        # Update story
        update_data = self.update_story(bmad_project_id, story_id, fixes)

        return {
            'success': True,
            'story_id': story_id,
            'fixes_total': len(fixes),
            'fixes_applied': sum(1 for f in fixes if f.applied),
            'fixes_failed': sum(1 for f in fixes if not f.applied)
        }

    def _apply_single_fix(self, fix: QAFix):
        """Apply a single fix to codebase"""
        # In production, perform actual code modification
        pass

    def _run_tests(self) -> bool:
        """Run test suite"""
        # In production, execute test framework
        return True

    def _rollback_fix(self, fix: QAFix):
        """Rollback a fix"""
        # In production, revert code changes
        pass

    def _load_qa_results(self, project_id: str, story_id: str) -> Dict:
        return {}  # Load from story's QA Results section

    def _load_gate_file(self, project_id: str, story_id: str) -> Dict:
        return {}  # Load from qa/gates/
