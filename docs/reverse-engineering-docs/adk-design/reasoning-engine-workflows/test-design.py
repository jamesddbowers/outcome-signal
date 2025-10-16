"""
BMad Framework - Test Design Workflow
======================================

Reasoning Engine implementation for test-design task.

**Primary Agent**: QA (Quinn)
**Workflow Type**: Test Scenario Generation with Dual Framework Application
**Analysis Reference**: analysis/tasks/test-design.md
"""

from typing import Dict, List
from dataclasses import dataclass
from enum import Enum
from datetime import datetime
from google.cloud import firestore, storage
from google import adk
from adk.workflows import WorkflowAgent, WorkflowStep


class TestLevel(Enum):
    """Test Levels Framework"""
    UNIT = "Unit"
    INTEGRATION = "Integration"
    E2E = "End-to-End"


class TestPriority(Enum):
    """Test Priorities Framework"""
    P0 = "P0"  # Must pass - blocking
    P1 = "P1"  # Should pass - important
    P2 = "P2"  # Nice to have - optional


@dataclass
class TestScenario:
    """Individual test scenario"""
    scenario_id: str
    description: str
    acceptance_criterion: str
    test_level: TestLevel
    priority: TestPriority
    test_type: str  # happy_path, edge_case, error_handling
    test_data: Dict
    expected_outcome: str


class TestDesignWorkflow(WorkflowAgent):
    """
    Test scenario generation with dual framework application.

    Applies two orthogonal frameworks:
    1. Test Levels: Unit → Integration → E2E
    2. Test Priorities: P0 → P1 → P2

    Each scenario gets both a level and a priority.
    """

    def __init__(self, project_id: str, **kwargs):
        super().__init__()
        self.project_id = project_id
        self.db = firestore.Client(project=project_id)

    @WorkflowStep(step_id="step_1_generate_scenarios", description="Generate test scenarios from ACs")
    def generate_scenarios(self, story_data: Dict, risk_profile: Dict) -> List[TestScenario]:
        """Generate test scenarios from acceptance criteria"""
        scenarios = []

        # For each AC, generate happy path + edge cases
        for i, ac in enumerate(story_data.get('acceptance_criteria', []), 1):
            # Happy path scenario
            scenarios.append(TestScenario(
                scenario_id=f"T{i}.1",
                description=f"Happy path for AC{i}",
                acceptance_criterion=ac,
                test_level=TestLevel.INTEGRATION,  # Placeholder
                priority=TestPriority.P0,  # Placeholder
                test_type="happy_path",
                test_data={},
                expected_outcome="Success"
            ))

            # Edge case scenario
            scenarios.append(TestScenario(
                scenario_id=f"T{i}.2",
                description=f"Edge case for AC{i}",
                acceptance_criterion=ac,
                test_level=TestLevel.UNIT,  # Placeholder
                priority=TestPriority.P1,  # Placeholder
                test_type="edge_case",
                test_data={},
                expected_outcome="Handled gracefully"
            ))

        return scenarios

    @WorkflowStep(step_id="step_2_apply_frameworks", description="Apply test levels and priorities frameworks")
    def apply_frameworks(self, scenarios: List[TestScenario], risk_profile: Dict) -> List[TestScenario]:
        """Apply test levels and priorities frameworks to each scenario"""
        for scenario in scenarios:
            # Apply test level framework
            scenario.test_level = self._determine_test_level(scenario)

            # Apply test priority framework
            scenario.priority = self._determine_priority(scenario, risk_profile)

        return scenarios

    @WorkflowStep(step_id="step_3_add_test_data", description="Add test data requirements")
    def add_test_data_requirements(self, scenarios: List[TestScenario]) -> List[TestScenario]:
        """Define test data requirements for each scenario"""
        for scenario in scenarios:
            # In production, use LLM to generate appropriate test data
            scenario.test_data = {
                'setup': 'Test data setup TBD',
                'fixtures': [],
                'mocks': []
            }

        return scenarios

    def execute(self, bmad_project_id: str, story_id: str) -> Dict:
        """Execute test design workflow"""
        story = self._load_story(bmad_project_id, story_id)
        risk_profile = self._load_risk_profile(bmad_project_id, story_id)

        # Generate scenarios
        scenarios = self.generate_scenarios(story, risk_profile)

        # Apply frameworks
        scenarios = self.apply_frameworks(scenarios, risk_profile)

        # Add test data
        scenarios = self.add_test_data_requirements(scenarios)

        # Save test design
        self._save_test_design(bmad_project_id, story_id, scenarios)

        return {
            'success': True,
            'story_id': story_id,
            'scenario_count': len(scenarios),
            'p0_count': sum(1 for s in scenarios if s.priority == TestPriority.P0),
            'unit_count': sum(1 for s in scenarios if s.test_level == TestLevel.UNIT)
        }

    def _determine_test_level(self, scenario: TestScenario) -> TestLevel:
        """Determine appropriate test level for scenario"""
        # Simplified logic - in production, use LLM analysis
        if scenario.test_type == "happy_path":
            return TestLevel.INTEGRATION
        else:
            return TestLevel.UNIT

    def _determine_priority(self, scenario: TestScenario, risk_profile: Dict) -> TestPriority:
        """Determine test priority based on risk profile"""
        # Simplified logic - in production, consider risk scores
        if scenario.test_type == "happy_path":
            return TestPriority.P0
        elif scenario.test_type == "edge_case":
            return TestPriority.P1
        else:
            return TestPriority.P2

    def _load_story(self, project_id: str, story_id: str) -> Dict:
        return self.db.collection('projects').document(project_id).collection('stories').document(story_id).get().to_dict()

    def _load_risk_profile(self, project_id: str, story_id: str) -> Dict:
        profile = self.db.collection('projects').document(project_id).collection('risk_profiles').document(story_id).get()
        return profile.to_dict() if profile.exists else {}

    def _save_test_design(self, project_id: str, story_id: str, scenarios: List[TestScenario]):
        design_ref = self.db.collection('projects').document(project_id).collection('test_designs').document(story_id)
        design_ref.set({
            'story_id': story_id,
            'scenarios': [vars(s) for s in scenarios],
            'created_at': datetime.now().isoformat()
        })
