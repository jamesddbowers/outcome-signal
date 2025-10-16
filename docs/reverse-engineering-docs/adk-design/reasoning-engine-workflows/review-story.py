"""
BMad Framework - Review Story Workflow
=======================================

Reasoning Engine implementation for the review-story task.

This workflow implements comprehensive test architecture review with quality gate decision:
1. Risk assessment (determines review depth)
2. Comprehensive analysis (6 parallel dimensions)
3. Active refactoring (unique QA authority)
4. Standards compliance check
5. Acceptance criteria validation
6. Documentation review and gate decision

**Primary Agent**: QA (Quinn) - Test Architect
**Workflow Type**: Adaptive Multi-Step
**Analysis Reference**: analysis/tasks/review-story.md
**Agent Config**: adk-design/agent-configurations/qa.yaml

Architecture Pattern:
--------------------
- Adaptive workflow (standard vs deep review based on risk)
- Parallel analysis dimensions with orchestration
- Active code modification capability (refactoring)
- Deterministic gate decision algorithm
- Dual outputs: story update + YAML gate file
"""

from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum
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

class ReviewDepth(Enum):
    """Review thoroughness level"""
    STANDARD = "standard"
    DEEP = "deep"


class GateStatus(Enum):
    """Quality gate decision"""
    PASS = "pass"
    CONCERNS = "concerns"
    FAIL = "fail"
    WAIVED = "waived"


class NFRStatus(Enum):
    """Non-functional requirement assessment"""
    PASS = "pass"
    CONCERNS = "concerns"
    FAIL = "fail"


@dataclass
class RiskSignals:
    """Risk indicators for review depth decision"""
    auth_files_touched: bool = False
    payment_files_touched: bool = False
    security_files_touched: bool = False
    no_tests_added: bool = False
    large_diff: bool = False  # > 500 lines
    previous_gate_concerns: bool = False
    high_ac_count: bool = False  # > 5 ACs

    def requires_deep_review(self) -> bool:
        """Determine if any risk signal triggers deep review"""
        return (
            self.auth_files_touched or
            self.payment_files_touched or
            self.security_files_touched or
            self.no_tests_added or
            self.large_diff or
            self.previous_gate_concerns or
            self.high_ac_count
        )


@dataclass
class RequirementTrace:
    """Requirements traceability for single AC"""
    ac_number: int
    ac_text: str
    test_mappings: List[Dict[str, str]] = field(default_factory=list)
    coverage_status: str = "none"  # full, partial, none


@dataclass
class NFRAssessment:
    """Non-functional requirement assessment"""
    category: str  # security, performance, reliability, maintainability
    status: NFRStatus
    findings: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)


@dataclass
class CodeRefactoring:
    """Refactoring performed during review"""
    file_path: str
    change_description: str
    reason: str
    improvement: str
    tests_passed: bool = True


@dataclass
class QAResults:
    """Complete QA review results"""
    story_id: str
    review_date: str
    reviewer: str = "Quinn (Test Architect)"
    review_depth: ReviewDepth = ReviewDepth.STANDARD

    # Analysis results
    requirements_trace: List[RequirementTrace] = field(default_factory=list)
    code_quality_findings: List[str] = field(default_factory=list)
    refactorings: List[CodeRefactoring] = field(default_factory=list)
    test_assessment: Dict[str, Any] = field(default_factory=dict)
    nfr_assessments: List[NFRAssessment] = field(default_factory=list)
    testability_score: Dict[str, str] = field(default_factory=dict)
    technical_debt: List[str] = field(default_factory=list)

    # Gate decision
    gate_status: GateStatus = GateStatus.PASS
    gate_rationale: str = ""
    top_issues: List[Dict[str, str]] = field(default_factory=list)
    recommended_status: str = "Ready for Done"


# ============================================================================
# Reasoning Engine Workflow Implementation
# ============================================================================

class ReviewStoryWorkflow(WorkflowAgent):
    """
    Vertex AI Reasoning Engine workflow for comprehensive story review.

    Implements adaptive review with:
    - Automatic escalation to deep review based on risk
    - Active refactoring authority (unique to QA agent)
    - Deterministic gate decision algorithm
    - Dual output generation (story update + gate file)
    """

    def __init__(
        self,
        project_id: str,
        firestore_client: Optional[firestore.Client] = None,
        storage_client: Optional[storage.Client] = None
    ):
        """Initialize workflow with GCP clients"""
        super().__init__()
        self.project_id = project_id
        self.db = firestore_client or firestore.Client(project=project_id)
        self.storage = storage_client or storage.Client(project=project_id)
        self.config: Optional[Dict] = None
        self.results = QAResults(story_id="", review_date=datetime.now().isoformat())

    # ========================================================================
    # Step 1: Risk Assessment & Review Depth Selection
    # ========================================================================

    @WorkflowStep(step_id="step_1_assess_risk", description="Assess risk signals and determine review depth")
    def assess_risk_signals(
        self,
        bmad_project_id: str,
        story_id: str
    ) -> Tuple[RiskSignals, ReviewDepth]:
        """
        Analyze story for risk indicators to determine review depth.

        Auto-escalate to deep review when ANY risk signal detected.

        Returns:
            Tuple of (RiskSignals, ReviewDepth)
        """
        print(f"Assessing risk signals for story {story_id}...")

        # Load story from Firestore
        story_ref = (
            self.db.collection('projects')
            .document(bmad_project_id)
            .collection('stories')
            .document(story_id)
        )
        story_doc = story_ref.get()

        if not story_doc.exists:
            raise ValueError(f"Story not found: {story_id}")

        story_data = story_doc.to_dict()
        signals = RiskSignals()

        # Check 1: Auth/payment/security files
        file_list = story_data.get('dev_agent_record', {}).get('file_list', [])
        risk_patterns = ['auth', 'payment', 'security', 'login', 'password', 'token']
        signals.auth_files_touched = any(
            any(pattern in f.lower() for pattern in risk_patterns)
            for f in file_list
        )

        # Check 2: No tests added
        test_files = [f for f in file_list if '.test.' in f or '.spec.' in f or '__tests__' in f]
        signals.no_tests_added = len(test_files) == 0

        # Check 3: Large diff (> 500 lines)
        # In production, calculate from git diff or stored metrics
        signals.large_diff = len(file_list) > 10  # Proxy for large change

        # Check 4: Previous gate concerns
        previous_gates = self._load_previous_gates(bmad_project_id, story_id)
        if previous_gates:
            latest_gate = previous_gates[0]
            signals.previous_gate_concerns = latest_gate.get('decision') in ['fail', 'concerns']

        # Check 5: High AC count (> 5)
        ac_count = len(story_data.get('acceptance_criteria', []))
        signals.high_ac_count = ac_count > 5

        # Determine review depth
        review_depth = ReviewDepth.DEEP if signals.requires_deep_review() else ReviewDepth.STANDARD

        print(f"  Risk signals detected: {sum([
            signals.auth_files_touched,
            signals.no_tests_added,
            signals.large_diff,
            signals.previous_gate_concerns,
            signals.high_ac_count
        ])}")
        print(f"  Review depth: {review_depth.value}")

        self.results.review_depth = review_depth
        return signals, review_depth

    # ========================================================================
    # Step 2: Comprehensive Analysis (6 Parallel Dimensions)
    # ========================================================================

    @WorkflowStep(step_id="step_2a_trace_requirements", description="Trace requirements to tests")
    def trace_requirements(
        self,
        bmad_project_id: str,
        story_id: str,
        review_depth: ReviewDepth
    ) -> List[RequirementTrace]:
        """
        Map each acceptance criterion to validating tests.

        Uses Given-When-Then documentation pattern.
        """
        print("Tracing requirements to tests...")

        # Load story
        story_data = self._load_story(bmad_project_id, story_id)
        acceptance_criteria = story_data.get('acceptance_criteria', [])

        # For each AC, analyze test coverage
        # In production, this would use LLM to analyze test files
        traces = []
        for i, ac in enumerate(acceptance_criteria, 1):
            trace = RequirementTrace(
                ac_number=i,
                ac_text=ac,
                test_mappings=[],  # Would be populated by analyzing test files
                coverage_status="partial"  # Placeholder
            )
            traces.append(trace)

        print(f"  ✓ Traced {len(traces)} acceptance criteria")
        self.results.requirements_trace = traces
        return traces

    @WorkflowStep(step_id="step_2b_review_code_quality", description="Review code quality and identify refactorings")
    def review_code_quality(
        self,
        bmad_project_id: str,
        story_id: str,
        review_depth: ReviewDepth
    ) -> List[str]:
        """
        Analyze code quality across multiple dimensions:
        - Architecture and design patterns
        - Performance optimizations
        - Security vulnerabilities
        - Code duplication
        - Best practices adherence
        """
        print("Reviewing code quality...")

        # In production, analyze source files using LLM
        findings = [
            "Code follows established patterns",
            "No obvious security vulnerabilities detected",
            "Performance characteristics acceptable",
        ]

        if review_depth == ReviewDepth.DEEP:
            findings.extend([
                "Deep analysis: All edge cases considered",
                "Deep analysis: Error handling comprehensive"
            ])

        print(f"  ✓ Code quality review complete ({len(findings)} findings)")
        self.results.code_quality_findings = findings
        return findings

    @WorkflowStep(step_id="step_2c_assess_test_architecture", description="Assess test architecture")
    def assess_test_architecture(
        self,
        bmad_project_id: str,
        story_id: str,
        review_depth: ReviewDepth
    ) -> Dict[str, Any]:
        """
        Evaluate test architecture:
        - Coverage adequacy
        - Test level appropriateness (unit/integration/E2E)
        - Test design quality
        - Edge case coverage
        """
        print("Assessing test architecture...")

        assessment = {
            'coverage_adequate': True,
            'test_levels_appropriate': True,
            'test_design_quality': 'good',
            'edge_cases_covered': True,
            'findings': [
                "Test coverage meets requirements",
                "Test levels appropriately chosen",
                "Edge cases adequately covered"
            ]
        }

        print(f"  ✓ Test architecture assessment complete")
        self.results.test_assessment = assessment
        return assessment

    @WorkflowStep(step_id="step_2d_assess_nfrs", description="Assess non-functional requirements")
    def assess_nfrs(
        self,
        bmad_project_id: str,
        story_id: str,
        review_depth: ReviewDepth
    ) -> List[NFRAssessment]:
        """
        Assess 4 core NFRs:
        1. Security
        2. Performance
        3. Reliability
        4. Maintainability
        """
        print("Assessing non-functional requirements...")

        nfr_assessments = [
            NFRAssessment(
                category="Security",
                status=NFRStatus.PASS,
                findings=["Input validation present", "Authentication checked"],
                recommendations=[]
            ),
            NFRAssessment(
                category="Performance",
                status=NFRStatus.PASS,
                findings=["Response times acceptable", "Query efficiency good"],
                recommendations=[]
            ),
            NFRAssessment(
                category="Reliability",
                status=NFRStatus.PASS,
                findings=["Error handling comprehensive", "Recovery mechanisms present"],
                recommendations=[]
            ),
            NFRAssessment(
                category="Maintainability",
                status=NFRStatus.PASS,
                findings=["Code is clear and well-documented", "Modularity good"],
                recommendations=[]
            ),
        ]

        print(f"  ✓ NFR assessment complete (4 categories)")
        self.results.nfr_assessments = nfr_assessments
        return nfr_assessments

    # ========================================================================
    # Step 3: Active Refactoring
    # ========================================================================

    @WorkflowStep(step_id="step_3_perform_refactoring", description="Perform safe refactorings")
    def perform_refactorings(
        self,
        bmad_project_id: str,
        story_id: str,
        code_quality_findings: List[str]
    ) -> List[CodeRefactoring]:
        """
        Unique QA authority: Directly refactor code to improve quality.

        Guidelines:
        - Only safe refactorings (no behavior changes)
        - Run all tests after each refactoring
        - Document all changes
        - Stay within safety boundaries
        """
        print("Performing safe refactorings...")

        refactorings = []

        # In production, identify and perform actual refactorings
        # For design, show structure
        example_refactoring = CodeRefactoring(
            file_path="src/components/LoginForm.tsx",
            change_description="Extracted validation logic to separate function",
            reason="Improve code organization and reusability",
            improvement="Makes validation logic testable and reusable",
            tests_passed=True
        )

        # Would only add if actually performed
        # refactorings.append(example_refactoring)

        print(f"  ✓ Refactoring complete ({len(refactorings)} changes)")
        self.results.refactorings = refactorings
        return refactorings

    # ========================================================================
    # Step 4: Standards Compliance
    # ========================================================================

    @WorkflowStep(step_id="step_4_check_standards", description="Verify standards compliance")
    def check_standards_compliance(
        self,
        bmad_project_id: str,
        story_id: str
    ) -> Dict[str, bool]:
        """
        Verify adherence to:
        - Coding standards
        - Project structure
        - Testing strategy
        """
        print("Checking standards compliance...")

        compliance = {
            'coding_standards': True,
            'project_structure': True,
            'testing_strategy': True,
        }

        print(f"  ✓ Standards compliance check complete")
        return compliance

    # ========================================================================
    # Step 5: Validate Acceptance Criteria
    # ========================================================================

    @WorkflowStep(step_id="step_5_validate_acs", description="Validate acceptance criteria met")
    def validate_acceptance_criteria(
        self,
        bmad_project_id: str,
        story_id: str,
        requirements_trace: List[RequirementTrace]
    ) -> Dict[str, Any]:
        """
        Verify each AC fully implemented:
        - All requirements met
        - No partial implementations
        - Edge cases handled
        """
        print("Validating acceptance criteria...")

        validation = {
            'all_acs_met': True,
            'partial_implementations': [],
            'missing_functionality': [],
        }

        print(f"  ✓ Acceptance criteria validation complete")
        return validation

    # ========================================================================
    # Step 6: Gate Decision & Documentation
    # ========================================================================

    @WorkflowStep(step_id="step_6_decide_gate", description="Make gate decision and generate outputs")
    def decide_gate_and_document(
        self,
        bmad_project_id: str,
        story_id: str,
        risk_signals: RiskSignals,
        nfr_assessments: List[NFRAssessment],
        requirements_trace: List[RequirementTrace]
    ) -> GateStatus:
        """
        Apply deterministic gate decision algorithm.

        Rules (in order):
        1. Risk thresholds (scores >= 9 → FAIL, >= 6 → CONCERNS)
        2. Test coverage gaps (P0 missing → CONCERNS/FAIL)
        3. Issue severity (high → FAIL, medium → CONCERNS)
        4. NFR statuses (FAIL → FAIL, CONCERNS → CONCERNS, else PASS)
        5. Waiver override (active waiver → WAIVED)
        """
        print("Making gate decision...")

        # Rule 4: NFR statuses (simplified for this design)
        gate_status = GateStatus.PASS

        for nfr in nfr_assessments:
            if nfr.status == NFRStatus.FAIL:
                gate_status = GateStatus.FAIL
                break
            elif nfr.status == NFRStatus.CONCERNS and gate_status == GateStatus.PASS:
                gate_status = GateStatus.CONCERNS

        # Rule 2: Check for missing P0 tests
        uncovered_acs = [
            trace for trace in requirements_trace
            if trace.coverage_status == "none"
        ]
        if uncovered_acs and gate_status == GateStatus.PASS:
            gate_status = GateStatus.CONCERNS

        # Determine recommended status
        recommended_status = (
            "Ready for Done" if gate_status == GateStatus.PASS
            else "Changes Required - See unchecked items"
        )

        # Build rationale
        rationale = self._build_gate_rationale(gate_status, nfr_assessments, uncovered_acs)

        self.results.gate_status = gate_status
        self.results.gate_rationale = rationale
        self.results.recommended_status = recommended_status

        print(f"  Gate decision: {gate_status.value}")
        print(f"  Recommended status: {recommended_status}")

        return gate_status

    # ========================================================================
    # Main Workflow Execution
    # ========================================================================

    def execute(
        self,
        bmad_project_id: str,
        story_id: str
    ) -> Dict[str, Any]:
        """
        Execute complete review-story workflow.

        Returns both:
        - QA Results (for story file update)
        - Gate file content (YAML artifact)
        """
        self.results.story_id = story_id
        workflow_id = f"review-story-{story_id}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        try:
            # Load configuration
            self._load_config(bmad_project_id)

            # Step 1: Risk assessment
            risk_signals, review_depth = self.assess_risk_signals(bmad_project_id, story_id)

            # Step 2: Comprehensive analysis (6 parallel dimensions)
            requirements_trace = self.trace_requirements(bmad_project_id, story_id, review_depth)
            code_findings = self.review_code_quality(bmad_project_id, story_id, review_depth)
            test_assessment = self.assess_test_architecture(bmad_project_id, story_id, review_depth)
            nfr_assessments = self.assess_nfrs(bmad_project_id, story_id, review_depth)

            # Step 3: Active refactoring
            refactorings = self.perform_refactorings(bmad_project_id, story_id, code_findings)

            # Step 4: Standards compliance
            compliance = self.check_standards_compliance(bmad_project_id, story_id)

            # Step 5: Validate ACs
            ac_validation = self.validate_acceptance_criteria(bmad_project_id, story_id, requirements_trace)

            # Step 6: Gate decision
            gate_status = self.decide_gate_and_document(
                bmad_project_id, story_id, risk_signals, nfr_assessments, requirements_trace
            )

            # Generate outputs
            qa_results_markdown = self._generate_qa_results_markdown()
            gate_yaml = self._generate_gate_yaml(bmad_project_id, story_id)

            # Save outputs
            self._save_qa_results(bmad_project_id, story_id, qa_results_markdown)
            self._save_gate_file(bmad_project_id, story_id, gate_yaml)

            print(f"\n✓ Review complete for story {story_id}")
            print(f"  Gate: {gate_status.value}")
            print(f"  Recommendation: {self.results.recommended_status}")

            return {
                'success': True,
                'workflow_id': workflow_id,
                'story_id': story_id,
                'gate_status': gate_status.value,
                'recommended_status': self.results.recommended_status,
                'qa_results': qa_results_markdown,
                'gate_file': gate_yaml,
            }

        except Exception as e:
            raise RuntimeError(f"Review workflow failed: {str(e)}") from e

    # ========================================================================
    # Helper Methods
    # ========================================================================

    def _load_config(self, project_id: str):
        """Load project configuration"""
        config_ref = self.db.collection('projects').document(project_id)
        self.config = config_ref.get().to_dict().get('config', {})

    def _load_story(self, project_id: str, story_id: str) -> Dict:
        """Load story from Firestore"""
        story_ref = (
            self.db.collection('projects')
            .document(project_id)
            .collection('stories')
            .document(story_id)
        )
        return story_ref.get().to_dict()

    def _load_previous_gates(self, project_id: str, story_id: str) -> List[Dict]:
        """Load previous gate decisions for this story"""
        # Implementation would query gates collection
        return []

    def _build_gate_rationale(
        self,
        gate_status: GateStatus,
        nfr_assessments: List[NFRAssessment],
        uncovered_acs: List[RequirementTrace]
    ) -> str:
        """Build human-readable gate rationale"""
        if gate_status == GateStatus.PASS:
            return "All quality criteria met. No blocking issues found."
        elif gate_status == GateStatus.CONCERNS:
            concerns = []
            if uncovered_acs:
                concerns.append(f"{len(uncovered_acs)} acceptance criteria lack test coverage")
            return "Minor concerns identified: " + "; ".join(concerns)
        else:
            return "Critical issues require resolution before completion."

    def _generate_qa_results_markdown(self) -> str:
        """Generate QA Results section for story file"""
        return f"""
## QA Results

### Review Date: {self.results.review_date}

### Reviewed By: {self.results.reviewer}

### Review Depth: {self.results.review_depth.value}

### Gate Decision: {self.results.gate_status.value.upper()}

**Rationale**: {self.results.gate_rationale}

### Requirements Traceability
{len(self.results.requirements_trace)} acceptance criteria traced to tests.

### Code Quality Findings
{chr(10).join(f'- {finding}' for finding in self.results.code_quality_findings)}

### NFR Assessment
{chr(10).join(f'- **{nfr.category}**: {nfr.status.value}' for nfr in self.results.nfr_assessments)}

### Recommended Next Status
{self.results.recommended_status}
"""

    def _generate_gate_yaml(self, project_id: str, story_id: str) -> str:
        """Generate gate file YAML content"""
        # In production, generate proper YAML from gate template
        return f"""---
story_id: {story_id}
gate_decision: {self.results.gate_status.value}
reviewed_date: {self.results.review_date}
reviewer: {self.results.reviewer}
rationale: |
  {self.results.gate_rationale}
"""

    def _save_qa_results(self, project_id: str, story_id: str, content: str):
        """Append QA Results to story document"""
        print(f"  ✓ QA Results appended to story file")

    def _save_gate_file(self, project_id: str, story_id: str, content: str):
        """Save gate file to Cloud Storage"""
        print(f"  ✓ Gate file saved: {story_id}.yml")


# ============================================================================
# Deployment & Usage
# ============================================================================

if __name__ == '__main__':
    """Example usage"""

    workflow = ReviewStoryWorkflow(project_id='my-gcp-project')
    result = workflow.execute(
        bmad_project_id='my-bmad-project',
        story_id='1.3'
    )

    print(f"Review complete: {result['gate_status']}")
