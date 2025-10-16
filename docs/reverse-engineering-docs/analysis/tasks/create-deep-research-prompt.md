# Task Analysis: create-deep-research-prompt

**Task ID**: `create-deep-research-prompt`
**Task File**: `.bmad-core/tasks/create-deep-research-prompt.md`
**Primary Agent**: Analyst (Mary)
**Task Type**: Interactive Facilitation Workflow (5 Steps)
**Version Analyzed**: BMad Core v4
**Analysis Date**: 2025-10-14
**Complexity**: Medium (Requires research focus selection, collaborative prompt design, structured output generation)

---

## 1. Purpose & Scope

### Primary Purpose
Generate comprehensive, well-structured research prompts that guide systematic investigation of complex topics. This task transforms initial research needs (from brainstorming sessions, project briefs, market research, or direct questions) into actionable research prompts with clear objectives, specific questions, methodologies, and deliverable requirements.

### Scope Definition

**In Scope**:
- Research type/focus selection from 9 predefined categories
- Input processing from multiple source types (project briefs, brainstorming results, market research, or fresh starts)
- Collaborative development of research objectives, questions, methodology, and output requirements
- Structured prompt generation using standardized template
- Iterative refinement based on user feedback
- Next steps guidance for research execution

**Out of Scope**:
- Actually conducting the research (this task only creates the prompt)
- Validating research findings or results
- Integrating research results into project artifacts
- Managing research execution or timelines
- Direct interaction with external research tools or APIs

### Key Characteristics
- **Research-type-aware** - 9 predefined focus areas with specific guidance for each
- **Input-agnostic** - Processes multiple input types or starts from scratch
- **Collaborative generation** - CRITICAL markers emphasize user collaboration at key decision points
- **Structured output** - Standardized markdown template ensures consistency
- **Iterative refinement** - Built-in review and adjustment cycle
- **Execution guidance** - Provides clear next steps for using the generated prompt

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - research_need: 'Description of what needs to be researched'  # Can be verbal description or document-based

optional:
  - project_brief: 'Path to project-brief.md'           # Processed for context extraction
  - brainstorming_results: 'Path to brainstorming output' # Processed for theme synthesis
  - market_research: 'Path to market research doc'      # Processed for building on findings
  - research_focus: 1-9                                 # Pre-selected research type (otherwise elicit)
```

**Input Details**:
- **research_need**: High-level description of research objectives or problem space (required, even if minimal)
- **project_brief**: Optional structured brief with product concepts, goals, users, constraints
- **brainstorming_results**: Optional brainstorming session output with ideas, themes, hypotheses
- **market_research**: Optional existing market research to build upon or deepen
- **research_focus**: Optional pre-selection of research type (1-9 from menu) to skip type selection

### Input Source Processing

**If Project Brief Provided**:
Extract and synthesize:
- Key product concepts and strategic goals
- Target users and primary use cases
- Technical constraints and technology preferences
- Open questions, uncertainties, and assumptions

**If Brainstorming Results Provided**:
Extract and synthesize:
- Main ideas and recurring themes
- Areas requiring validation or evidence
- Hypotheses that need testing
- Creative directions worth exploring further

**If Market Research Provided**:
Extract and synthesize:
- Previously identified opportunities
- Areas needing deeper investigation
- Initial findings requiring validation
- Adjacent possibilities or expansion areas

**If Starting Fresh (No Documents)**:
Elicit through targeted questions:
- What is the problem space or opportunity?
- What decisions does this research need to inform?
- Who are the key stakeholders and users?
- What are the success criteria?

### Configuration Dependencies

From `core-config.yaml`:
- No specific configuration keys required (this is a standalone facilitation task)
- Agent may reference general project settings if available

### Prerequisites

**Agent Requirements**:
- Analyst persona active (research and elicitation expertise)
- Access to provided input documents (if any)

**No Technical Prerequisites**:
- Pure facilitation task, no code execution or builds required

---

## 3. Execution Flow

### High-Level Process (5 Sequential Steps + 1 Optional)

```
Step 1: Research Type Selection
  ↓
Step 2: Input Processing
  ↓
Step 3: Research Prompt Structure Development
  ↓
Step 4: Prompt Generation
  ↓
Step 5: Review and Refinement
  ↓
Step 6: Next Steps Guidance (advisory)
```

**Critical Rule**: CRITICAL markers in task file indicate required user collaboration points - agent must not proceed unilaterally at these points.

---

### Step 1: Research Type Selection

**Purpose**: Identify the most appropriate research focus based on user needs and available inputs.

**Process**:

1. Present 9 numbered research focus options to user:
   1. **Product Validation Research** - Validate hypotheses, market fit, feasibility, risks
   2. **Market Opportunity Research** - Market size, segments, entry strategies, timing
   3. **User & Customer Research** - Personas, behaviors, pain points, journeys, willingness to pay
   4. **Competitive Intelligence Research** - Competitor analysis, positioning, features, business models
   5. **Technology & Innovation Research** - Tech trends, approaches, emerging technologies, build/buy/partner
   6. **Industry & Ecosystem Research** - Value chains, key players, regulatory factors, partnerships
   7. **Strategic Options Research** - Strategic directions, business models, GTM strategies, scaling
   8. **Risk & Feasibility Research** - Risk factors, implementation challenges, resources, legal/regulatory
   9. **Custom Research Focus** - User-defined objectives and specialized domains

2. For each option, display:
   - Option number
   - Focus area name
   - 3-4 bullet points describing what this research type covers

3. Elicit user selection:
   - "Which research focus best matches your needs? (1-9)"
   - Allow user to select one or request custom (#9)

**Outputs**:
- `selected_focus`: Research type selected by user (1-9)
- `focus_description`: Text description of selected focus area
- `focus_characteristics`: Key areas this research will address

**Blocking Conditions**:
- If user is unsure, offer guidance based on input documents or problem description
- If user selects #9 (Custom), elicit detailed description of custom focus area

**Decision Points**:
```
IF research_focus already provided in inputs THEN
  SKIP to Step 2 with selected focus
ELSE
  PRESENT options 1-9 and ELICIT selection
END IF

IF user_selection == 9 (Custom) THEN
  ELICIT custom research focus description
  ELICIT key areas to address
END IF
```

---

### Step 2: Input Processing

**Purpose**: Extract relevant context from provided inputs to inform prompt development.

**Process**:

**If Project Brief Provided**:
```
READ project brief file
EXTRACT:
  - product_concepts: Core ideas and value propositions
  - goals: Strategic objectives and success criteria
  - target_users: User segments and personas
  - use_cases: Primary use cases and scenarios
  - technical_constraints: Technology stack, integrations, limitations
  - assumptions: Stated or implied assumptions
  - uncertainties: Open questions and unknown factors
SYNTHESIZE into background_context
```

**If Brainstorming Results Provided**:
```
READ brainstorming output file
EXTRACT:
  - main_ideas: Top ideas and concepts from session
  - themes: Recurring themes and patterns
  - validation_needs: Ideas requiring evidence or validation
  - hypotheses: Testable assumptions
  - creative_directions: Novel approaches worth exploring
SYNTHESIZE into background_context
```

**If Market Research Provided**:
```
READ market research file
EXTRACT:
  - identified_opportunities: Market gaps and opportunities
  - initial_findings: Key insights from existing research
  - validation_needs: Findings requiring additional evidence
  - adjacent_areas: Related areas worth exploring
  - open_questions: Unanswered questions from prior research
SYNTHESIZE into background_context
```

**If Starting Fresh**:
```
ELICIT:
  - problem_space: What problem or opportunity is being explored?
  - decision_context: What decisions will this research inform?
  - stakeholders: Who needs these insights?
  - success_criteria: What would make this research successful?
  - constraints: Time, budget, resource limitations
SYNTHESIZE into background_context
```

**Outputs**:
- `background_context`: Structured summary of relevant context
- `key_concepts`: Important concepts, terms, and ideas
- `open_questions`: Known unknowns and areas of uncertainty
- `constraints`: Limitations or boundaries for research

**Important Notes**:
- Multiple inputs can be processed together (e.g., both project brief AND brainstorming results)
- Extract selectively - focus on information relevant to selected research focus
- Synthesize into concise paragraphs, not just bullet lists
- Identify gaps in provided information that research should address

---

### Step 3: Research Prompt Structure Development

**Purpose**: Collaboratively develop the four core components of a comprehensive research prompt.

**CRITICAL**: This step requires active collaboration with the user at each component.

**Process**:

#### Component A: Research Objectives

**CRITICAL: Collaborate with user to articulate clear, specific objectives.**

Elicit and document:
1. **Primary research goal and purpose**
   - "What is the single most important thing this research should achieve?"
   - Frame as actionable outcome (e.g., "Determine market entry strategy" not "Learn about market")

2. **Key decisions the research will inform**
   - "What specific decisions depend on this research?"
   - Link to concrete actions or choices

3. **Success criteria for the research**
   - "How will you know this research was successful?"
   - Define measurable outcomes or clarity achieved

4. **Constraints and boundaries**
   - "What is out of scope for this research?"
   - Note time, budget, or topic limitations

**Output**: `research_objectives` object with 4 sub-fields

---

#### Component B: Research Questions

**CRITICAL: Collaborate with user to develop specific, actionable research questions organized by priority.**

**Core Questions (Must Answer)**:
```
ELICIT primary questions that MUST be answered:
  - "What are the 3-5 critical questions this research must answer?"
  - Ensure questions are:
    * Specific (not "What is the market?" but "What is the TAM for X in Y region?")
    * Actionable (answers inform concrete decisions)
    * Scoped (answerable within research constraints)

FOR each core question:
  - Assign priority ranking (1 = highest)
  - Identify dependencies (e.g., "Answer Q1 before Q3")
```

**Supporting Questions (Nice to Have)**:
```
ELICIT secondary questions for additional context:
  - "What other insights would be valuable, even if not critical?"
  - These provide depth but aren't decision-blockers
  - Include future-looking considerations

FOR each supporting question:
  - Note relationship to core questions
  - Indicate if time-sensitive or deferrable
```

**Output**:
- `core_questions[]`: Array of must-answer questions with priority and dependencies
- `supporting_questions[]`: Array of nice-to-have questions

---

#### Component C: Research Methodology

**Purpose**: Define how research will be conducted and analyzed.

**Data Collection Methods**:
```
RECOMMEND collection methods based on research focus:
  - Secondary research sources (industry reports, competitor sites, publications)
  - Primary research approaches (if applicable - surveys, interviews, experiments)
  - Data quality requirements (recency, sample size, credibility)
  - Source credibility criteria (authoritative sources, peer-reviewed, etc.)

ELICIT user preferences or constraints:
  - "Are there specific sources you want included or excluded?"
  - "Is primary research (surveys, interviews) in scope?"
  - "What data quality standards apply?"
```

**Analysis Frameworks**:
```
RECOMMEND frameworks appropriate to research focus:
  - Product Validation: Lean Canvas, Risk/Assumption Mapping, Feasibility Matrix
  - Market Opportunity: TAM/SAM/SOM, Porter's Five Forces, Market Segmentation
  - Competitive Intelligence: Feature Comparison Matrix, Strategic Group Analysis
  - Technology: Technology Radar, Capability Maturity, Build/Buy Decision Matrix
  - Strategic Options: Decision Tree, Pros/Cons Analysis, Scenario Planning
  - [etc. - frameworks mapped to research types]

ELICIT:
  - "Which frameworks are most relevant to your needs?"
  - "Are there specific evaluation criteria or comparison dimensions?"
```

**Output**:
- `data_collection`: Object with sources, approaches, quality requirements
- `analysis_frameworks[]`: Array of frameworks to apply with brief descriptions

---

#### Component D: Output Requirements

**Purpose**: Specify structure and content of research deliverables.

**Format Specifications**:
```
DEFINE standard output structure:
  - Executive summary (1-2 pages max)
  - Detailed findings (organized by question or theme)
  - Visual/tabular presentations (comparison matrices, charts, diagrams)
  - Supporting documentation (source list, data tables, methodology notes)

ELICIT user preferences:
  - "Do you need specific visualizations or data formats?"
  - "Who is the audience, and what level of detail do they need?"
```

**Key Deliverables**:
```
SPECIFY must-have elements:
  - Must-have sections (map to core research questions)
  - Decision-support elements (recommendations, implications, trade-offs)
  - Action-oriented recommendations (what to do with findings)
  - Risk and uncertainty documentation (confidence levels, gaps, assumptions)

ENSURE alignment:
  - Each core question has corresponding deliverable section
  - Deliverables support key decisions from objectives
```

**Output**:
- `output_format`: Structure and format specifications
- `key_deliverables[]`: Array of required outputs mapped to questions

---

### Step 4: Prompt Generation

**Purpose**: Generate complete research prompt using standardized template.

**Process**:

1. **Populate Template**:
```markdown
## Research Objective

{research_objectives.primary_goal}

This research will inform: {research_objectives.key_decisions}

Success criteria: {research_objectives.success_criteria}

Constraints: {research_objectives.constraints}

## Background Context

{background_context from Step 2}

Key concepts: {key_concepts}
Open questions: {open_questions}

## Research Questions

### Primary Questions (Must Answer)

{FOR each question in core_questions}
{priority}. {question}
   - Priority: {priority_ranking}
   - Dependencies: {dependencies if any}
{END FOR}

### Secondary Questions (Nice to Have)

{FOR each question in supporting_questions}
- {question}
{END FOR}

## Research Methodology

### Information Sources

{data_collection.sources}

Quality requirements: {data_collection.quality_requirements}
Credibility criteria: {data_collection.credibility_criteria}

### Analysis Frameworks

{FOR each framework in analysis_frameworks}
- **{framework.name}**: {framework.description}
{END FOR}

### Data Requirements

- Recency: {data_collection.recency_needs}
- Credibility: {data_collection.credibility_standards}
- Scope: {data_collection.scope}

## Expected Deliverables

### Executive Summary

- Key findings and insights
- Critical implications for {research_objectives.key_decisions}
- Recommended actions

### Detailed Analysis

{FOR each section in key_deliverables}
- **{section.name}**: {section.description}
{END FOR}

### Supporting Materials

- Data tables and quantitative findings
- Comparison matrices
- Source documentation and references
- Methodology notes

## Success Criteria

{research_objectives.success_criteria - expanded with specific checkpoints}

## Timeline and Priority

{IF constraints include timeline}
- Deadline: {timeline.deadline}
- Phasing: {timeline.phases if applicable}
{END IF}
```

2. **Generate Full Prompt**:
   - Render populated template as markdown
   - Ensure all sections are complete
   - Include placeholder guidance for any optional/flexible sections

**Outputs**:
- `research_prompt`: Complete markdown-formatted research prompt
- `prompt_file_path`: Suggested save location (e.g., `docs/research/{focus}-research-prompt.md`)

**Important Notes**:
- Template is standardized but content is customized to user's needs
- Prompt should be self-contained (usable by AI or human researcher without additional context)
- Include enough detail to guide execution but not over-constrain approach

---

### Step 5: Review and Refinement

**Purpose**: Present complete prompt and iterate based on user feedback.

**Process**:

1. **Present Complete Prompt**:
   ```
   DISPLAY full research prompt to user
   EXPLAIN:
     - "Here's the complete research prompt I've generated"
     - Highlight key elements and their rationale
     - Note any assumptions made during prompt creation
   ```

2. **Gather Structured Feedback**:
   ```
   ASK user to review:
     - "Are the objectives clear and correctly stated?"
     - "Do the research questions address all your concerns?"
     - "Is the scope appropriate (not too broad or narrow)?"
     - "Are the output requirements sufficient for your needs?"
     - "Is anything missing or should anything be removed?"
   ```

3. **Refine as Needed**:
   ```
   FOR each feedback item:
     IF objective needs clarification THEN
       REVISE Component A and regenerate relevant sections

     IF questions missing or misaligned THEN
       REVISE Component B and regenerate question sections

     IF methodology needs adjustment THEN
       REVISE Component C and regenerate methodology section

     IF output requirements insufficient THEN
       REVISE Component D and regenerate deliverables section
   END FOR

   REGENERATE complete prompt with revisions
   PRESENT updated version
   ASK: "Does this revision address your feedback?"
   ```

4. **Iterate Until Approved**:
   ```
   WHILE user has feedback DO:
     APPLY revisions
     REGENERATE prompt
     PRESENT for review
   END WHILE

   WHEN user approves:
     PROCEED to Step 6
   ```

**Outputs**:
- `final_research_prompt`: User-approved research prompt (markdown)
- `revision_history`: Summary of changes made during refinement

**Blocking Conditions**:
- Do not proceed to Step 6 until user explicitly approves prompt
- If user requests major changes (e.g., different research focus), may need to return to Step 1

**Important Notes**:
- Refinement is expected and normal - prompts rarely perfect on first draft
- Balance comprehensiveness with usability (avoid over-engineering prompt)
- Document assumptions clearly so user can validate them

---

### Step 6: Next Steps Guidance (Advisory)

**Purpose**: Guide user on how to execute research using the generated prompt.

**Process**:

1. **Present Execution Options**:
   ```
   EXPLAIN three execution pathways:

   Option 1: Use with AI Research Assistant
     - Provide this prompt to AI model with research/web access capabilities
     - Examples: Claude with computer use, Perplexity AI, custom GPT
     - Benefits: Fast, comprehensive, can process large amounts of data
     - Limitations: May hallucinate, requires verification, lacks domain expertise

   Option 2: Guide Human Research
     - Use prompt as framework for manual research efforts
     - Assign to researcher, analyst, or research team
     - Benefits: Deep domain expertise, critical thinking, nuanced insights
     - Limitations: Time-intensive, resource-dependent, potentially narrower scope

   Option 3: Hybrid Approach
     - Use AI for broad scanning and data collection
     - Use human for critical analysis, synthesis, and validation
     - Benefits: Speed + depth, AI breadth + human judgment
     - Recommended for most research efforts
   ```

2. **Save Research Prompt**:
   ```
   OFFER to save prompt to file:
     - Suggested path: docs/research/{focus}-research-prompt.md
     - Or custom location specified by user

   IF user agrees:
     WRITE final_research_prompt to file
     CONFIRM: "Research prompt saved to {file_path}"
   END IF
   ```

3. **Explain Integration Points**:
   ```
   GUIDE user on next steps:
     - "How findings will feed into next phases"
       Example: "Research findings will inform Product Brief or PRD development"

     - "Which team members should review results"
       Example: "Share results with PM, Architect, and key stakeholders"

     - "How to validate findings"
       Example: "Cross-reference with competitor analysis, test assumptions with users"

     - "When to revisit or expand research"
       Example: "If initial findings raise new questions, return to prompt and extend"
   ```

4. **Offer Follow-Up Support**:
   ```
   INFORM user of available next steps:
     - "I can help facilitate the research if you're using AI execution"
     - "I can help process research findings into project artifacts"
     - "I can help refine the prompt if new questions emerge"
   ```

**Outputs**:
- `execution_guidance`: Recommendations for research execution
- `saved_prompt_path`: File path if prompt was saved
- `integration_notes`: How research integrates with project workflow

**Important Notes**:
- This step is advisory, not mandatory
- User may execute research independently without further agent assistance
- Agent should be available to support downstream artifact creation (e.g., creating project brief from research findings)

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Research Focus Selection (Step 1)

```
IF research_focus pre-specified (1-9) THEN
  SKIP elicitation and proceed with specified focus
ELSE
  PRESENT 9 options and ELICIT user selection
END IF

IF user_selection == 9 (Custom) THEN
  ELICIT custom focus description
  CREATE custom focus characteristics
ELSE
  USE predefined focus characteristics for selected option (1-8)
END IF
```

### Decision Point 2: Input Processing Strategy (Step 2)

```
available_inputs = []
IF project_brief provided THEN
  available_inputs.add('project_brief')
IF brainstorming_results provided THEN
  available_inputs.add('brainstorming')
IF market_research provided THEN
  available_inputs.add('market_research')

IF available_inputs.empty THEN
  EXECUTE fresh_start_elicitation()
ELSE
  FOR each input in available_inputs:
    EXECUTE appropriate extraction logic
  END FOR
  SYNTHESIZE all extractions into background_context
END IF
```

### Decision Point 3: Methodology Recommendation (Step 3C)

```
BASED ON selected_focus:
  CASE Product Validation:
    RECOMMEND: Lean Canvas, Risk Mapping, Feasibility Matrix, User Validation
  CASE Market Opportunity:
    RECOMMEND: TAM/SAM/SOM, Porter's Five Forces, PESTEL, Market Segmentation
  CASE User & Customer:
    RECOMMEND: Jobs-to-be-Done, User Journey Mapping, Persona Development, Value Proposition Canvas
  CASE Competitive Intelligence:
    RECOMMEND: Feature Comparison, Strategic Group Analysis, SWOT, Business Model Canvas
  CASE Technology & Innovation:
    RECOMMEND: Technology Radar, Capability Maturity, Hype Cycle, Build/Buy Decision Matrix
  CASE Industry & Ecosystem:
    RECOMMEND: Value Chain Analysis, Ecosystem Mapping, Regulatory Analysis, Partnership Frameworks
  CASE Strategic Options:
    RECOMMEND: Decision Tree, Scenario Planning, Strategic Options Grid, Roadmap Planning
  CASE Risk & Feasibility:
    RECOMMEND: Risk Matrix, FMEA, Feasibility Assessment, Dependency Mapping
  CASE Custom:
    ELICIT frameworks from user or research literature
END CASE

PRESENT recommendations to user
ALLOW user to select, modify, or add frameworks
```

### Decision Point 4: Refinement Iteration (Step 5)

```
final_prompt = generated_prompt
approved = false

WHILE NOT approved:
  PRESENT final_prompt to user
  feedback = ELICIT user feedback

  IF feedback.isEmpty OR feedback.indicates_approval THEN
    approved = true
  ELSE
    revisions = PROCESS feedback into specific changes
    final_prompt = APPLY revisions to final_prompt
  END IF
END WHILE

RETURN final_prompt
```

### Decision Point 5: Save Prompt (Step 6)

```
OFFER to save prompt:
  "Would you like me to save this research prompt to a file?"

IF user agrees THEN
  path = ELICIT custom path OR use default (docs/research/{focus}-research-prompt.md)
  WRITE final_prompt to path
  CONFIRM save successful
ELSE
  INFORM user they can copy prompt manually
END IF
```

---

## 5. User Interaction Points (Elicitation)

### Interaction Modes
This task operates in **COLLABORATIVE mode only** - there is no "YOLO" mode. User input is essential at multiple points.

### Required Elicitation Points (CRITICAL Markers in Task)

#### Point 1: Research Focus Selection (Step 1)
**Trigger**: Start of task
**Question**: "Which research focus best matches your needs? (1-9)"
**Expected Response**: Number 1-9 or request for guidance
**Fallback**: If user unsure, analyze input documents or problem description to recommend 2-3 options

#### Point 2: Custom Focus Definition (Step 1, if #9 selected)
**Trigger**: User selects option 9 (Custom)
**Questions**:
  - "What is the specific focus of your research?"
  - "What are the key areas this research should address?"
**Expected Response**: Paragraph description + bullet list of areas
**Validation**: Ensure sufficient specificity to guide prompt development

#### Point 3: Research Objectives (Step 3A - CRITICAL)
**Trigger**: Beginning of prompt structure development
**Questions**:
  - "What is the single most important thing this research should achieve?"
  - "What specific decisions will this research inform?"
  - "How will you know this research was successful?"
  - "What is out of scope for this research?"
**Expected Responses**: Clear, actionable statements for each question
**Validation**: Ensure objectives are specific and measurable

#### Point 4: Core Research Questions (Step 3B - CRITICAL)
**Trigger**: After objectives defined
**Question**: "What are the 3-5 critical questions this research must answer?"
**Expected Response**: Array of specific, scoped questions
**Follow-up**: "Are there dependencies between these questions?" (e.g., answer Q1 before Q3)
**Validation**: Ensure questions are specific, actionable, and answerable within scope

#### Point 5: Supporting Research Questions (Step 3B - CRITICAL)
**Trigger**: After core questions defined
**Question**: "What other insights would be valuable, even if not critical?"
**Expected Response**: Array of nice-to-have questions (may be empty)
**Validation**: Ensure supporting questions don't duplicate core questions

#### Point 6: Data Collection Constraints (Step 3C)
**Trigger**: During methodology definition
**Questions**:
  - "Are there specific sources you want included or excluded?"
  - "Is primary research (surveys, interviews) in scope?"
  - "What data quality standards apply?"
**Expected Responses**: Specific constraints or "no constraints"
**Fallback**: Use defaults if user has no preferences

#### Point 7: Framework Selection (Step 3C)
**Trigger**: After presenting recommended frameworks
**Question**: "Which frameworks are most relevant to your needs?"
**Expected Response**: Selection from recommended list or custom additions
**Fallback**: Use all recommended frameworks if user unsure

#### Point 8: Output Format Preferences (Step 3D)
**Trigger**: During deliverable definition
**Questions**:
  - "Do you need specific visualizations or data formats?"
  - "Who is the audience, and what level of detail do they need?"
**Expected Responses**: Specific requirements or "standard format is fine"
**Fallback**: Use standard output structure if no special requirements

#### Point 9: Prompt Review and Feedback (Step 5 - CRITICAL)
**Trigger**: After complete prompt generated
**Questions**:
  - "Are the objectives clear and correctly stated?"
  - "Do the research questions address all your concerns?"
  - "Is the scope appropriate?"
  - "Are the output requirements sufficient?"
  - "Is anything missing or should anything be removed?"
**Expected Response**: Approval or specific feedback items
**Iteration**: Refine and re-present until user approves

#### Point 10: Save Prompt Decision (Step 6)
**Trigger**: After prompt approved
**Question**: "Would you like me to save this research prompt to a file? If so, where?"
**Expected Response**: Yes/No + optional custom path
**Default**: docs/research/{focus}-research-prompt.md

### Elicitation Best Practices

**From Task File "Important Notes" Section**:
- Balance comprehensiveness with focus (avoid over-constraining)
- Be specific rather than general in research questions
- Consider both current state and future implications
- Document assumptions and limitations clearly
- Plan for iterative refinement based on initial findings

**Agent Guidance**:
- Ask one question at a time at each elicitation point (don't overwhelm user)
- Provide examples when asking for abstract concepts (objectives, questions)
- Validate responses for specificity and actionability
- Offer to refine vague responses collaboratively
- Summarize collected inputs periodically to ensure alignment

---

## 6. Output Specifications

### Primary Output

**Research Prompt Markdown File**
- **Format**: Markdown (.md)
- **Location**: User-specified or default `docs/research/{focus}-research-prompt.md`
- **Structure**: Standardized template with 8 sections

**Template Structure**:
```markdown
## Research Objective
- Primary goal
- Key decisions to inform
- Success criteria
- Constraints

## Background Context
- Synthesized context from inputs or elicitation
- Key concepts
- Open questions

## Research Questions
### Primary Questions (Must Answer)
- Numbered list with priorities and dependencies

### Secondary Questions (Nice to Have)
- Bulleted list

## Research Methodology
### Information Sources
- Source types and priorities

### Analysis Frameworks
- Frameworks to apply with descriptions

### Data Requirements
- Quality, recency, credibility needs

## Expected Deliverables
### Executive Summary
- Key findings, implications, recommendations

### Detailed Analysis
- Sections mapped to research questions

### Supporting Materials
- Data tables, matrices, documentation

## Success Criteria
- How to evaluate research success

## Timeline and Priority
- Deadlines, phasing (if applicable)
```

### Secondary Outputs

**Execution Guidance (Verbal/Display Only)**:
- Options for research execution (AI, human, hybrid)
- Integration points with project workflow
- Validation strategies
- Follow-up support offers

**Revision History (Internal)**:
- Summary of changes made during Step 5 refinement
- Rationale for major decisions
- Assumptions documented

### Output Characteristics

**Self-Contained**:
- Prompt can be used independently by AI or human researcher
- All necessary context included in Background section
- No external dependencies required to understand or execute

**Actionable**:
- Specific questions with clear scope
- Defined methodologies and frameworks
- Concrete deliverable requirements
- Success criteria for evaluation

**Structured**:
- Consistent section organization
- Hierarchical question prioritization (primary vs. secondary)
- Logical flow from objectives → questions → methodology → deliverables

**Detailed But Not Over-Constrained**:
- Enough specificity to guide execution
- Flexibility for researcher judgment and exploration
- Room for iterative refinement based on findings

### File Naming Convention

**Pattern**: `{focus-area}-research-prompt.md`

**Examples**:
- `product-validation-research-prompt.md`
- `market-opportunity-research-prompt.md`
- `competitive-intelligence-research-prompt.md`
- `custom-research-prompt.md` (for option #9)

**Slug Generation**:
```
focus_name = user_selected_focus_option.name
slug = focus_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
filename = `${slug}-research-prompt.md`
```

### Version Control

**Recommendation**: Save research prompt to project repository for tracking
- Enables version history if prompt evolves
- Makes prompt accessible to team members
- Documents research planning decisions

---

## 7. Error Handling & Validation

### Input Validation

#### Research Focus Selection Validation
```
IF user_selection NOT in range(1, 9) THEN
  ERROR: "Please select a number between 1 and 9"
  RETRY elicitation
END IF

IF user_selection == 9 AND custom_description.isEmpty THEN
  ERROR: "Custom research focus requires a description"
  RETRY elicitation with prompt: "Please describe your custom research focus"
END IF
```

#### Input Document Validation
```
IF project_brief specified BUT file not found THEN
  WARN: "Project brief file not found at {path}"
  OFFER: "Would you like to (1) provide correct path, (2) skip project brief, or (3) describe context manually?"
END IF

[Same pattern for brainstorming_results and market_research]

IF all input documents fail to load AND user doesn't provide verbal context THEN
  ERROR: "No input context available - cannot develop research prompt"
  REQUEST: "Please provide either (1) valid document paths or (2) verbal description of research needs"
END IF
```

#### Research Objectives Validation (Step 3A)
```
IF primary_goal is vague or generic (e.g., "learn about the market") THEN
  WARN: "Objective is too general - more specificity will improve research quality"
  SUGGEST: "Example: 'Determine TAM and viable entry strategy for X market' is more actionable than 'learn about market'"
  OFFER: "Would you like to refine this objective?"
END IF

IF success_criteria not measurable THEN
  WARN: "Success criteria should be specific and measurable"
  SUGGEST: "Example: 'Identify top 3 competitors with feature comparison' is measurable; 'understand competition' is not"
  OFFER: "Would you like to make this more specific?"
END IF
```

#### Research Questions Validation (Step 3B)
```
IF core_questions.length < 2 THEN
  WARN: "Only {count} core question(s) - research may be too narrow"
  OFFER: "Are there other critical questions this research should answer?"
END IF

IF core_questions.length > 7 THEN
  WARN: "{count} core questions may be too many - research could lose focus"
  SUGGEST: "Consider prioritizing top 3-5 must-answer questions and moving others to 'Supporting Questions'"
  OFFER: "Would you like to reprioritize?"
END IF

FOR each question in core_questions:
  IF question is too broad or vague THEN
    WARN: "Question '{question}' may be too broad to answer definitively"
    SUGGEST: "Can this be broken into more specific sub-questions?"
    OFFER: "Would you like to refine this question?"
  END IF
END FOR
```

### Process Validation

#### Step Completion Validation
```
AFTER each step completes:
  VALIDATE all required outputs generated
  IF any required output missing THEN
    ERROR: "Step {step_number} incomplete - missing {output_name}"
    RETRY step with focus on missing output
  END IF
```

#### Prompt Completeness Validation (Step 4)
```
AFTER prompt generation:
  VALIDATE all template sections populated:
    - Research Objective ✓
    - Background Context ✓
    - Research Questions (Primary + Secondary) ✓
    - Research Methodology (Sources + Frameworks + Data Requirements) ✓
    - Expected Deliverables (Summary + Detailed + Supporting) ✓
    - Success Criteria ✓
    - Timeline (if applicable) ✓

  IF any section empty or placeholder-only THEN
    WARN: "Prompt section '{section}' is incomplete"
    REVIEW inputs for that section
    OFFER: "Would you like to provide more detail for this section?"
  END IF
```

### Error Recovery Strategies

#### Missing Input Documents
**Error**: Input document path invalid or file not found
**Recovery**:
1. Confirm with user if path is correct
2. Offer to skip that input and proceed with others
3. If critical, elicit verbal context as fallback
4. Continue with available inputs

#### Vague or Insufficient User Responses
**Error**: User provides generic or unclear responses during elicitation
**Recovery**:
1. Provide examples of good responses
2. Ask clarifying follow-up questions
3. Suggest refinements collaboratively
4. If user persistently vague, document assumptions and proceed (with user awareness)

#### Scope Creep During Refinement (Step 5)
**Error**: User keeps adding new objectives or questions during refinement
**Recovery**:
1. Acknowledge additions: "I notice we're expanding the scope..."
2. Validate intentional: "Is this additional research critical, or could it be a follow-up phase?"
3. Offer options:
   - Expand current prompt (may reduce focus)
   - Create separate follow-up research prompt
   - Defer to future research iteration
4. User decides, agent adjusts accordingly

#### Framework or Methodology Uncertainty
**Error**: User unsure which frameworks to use or how to analyze
**Recovery**:
1. Explain recommended frameworks in plain language
2. Provide examples of insights each framework yields
3. Offer "standard set" for research type as default
4. Remind user that researcher can adapt frameworks during execution

### Blocking Conditions (Task Cannot Proceed)

#### No Research Need Defined
```
IF research_need undefined AND all input documents missing AND user provides no verbal context THEN
  HALT with message:
    "I need to understand what you want to research before I can create a prompt.
     Please provide:
       1. Input documents (project brief, brainstorming results, market research), OR
       2. A verbal description of your research needs and objectives"
```

#### User Cannot Articulate Objectives (Repeated Failures)
```
IF elicitation_attempts > 3 AND objectives still vague THEN
  OFFER pivot:
    "It seems we're having difficulty defining clear objectives. Would you like to:
       1. Start with a different research focus area (return to Step 1)?
       2. Begin with brainstorming to clarify what you want to learn?
       3. Review examples of research prompts for inspiration?
       4. Defer this task and return when objectives are clearer?"
```

#### Approval Never Reached (Step 5 Iteration Limit)
```
IF refinement_iterations > 5 THEN
  WARN: "We've refined this prompt {count} times. Two options:
    1. Accept current version and iterate after initial research findings
    2. Take a break and return to this with fresh perspective

    Which would you prefer?"
```

---

## 8. Dependencies & Prerequisites

### Agent Dependencies

**Primary Agent**: Analyst (Mary)
- **Role**: Research & Discovery Agent
- **Required Capabilities**:
  - Research methodology expertise
  - Elicitation and facilitation skills
  - Structured thinking and synthesis
  - Domain knowledge across business, tech, market, user research

### Task Dependencies

**Predecessor Tasks** (Optional - Provides Input Context):
- `facilitate-brainstorming-session.md` → Output can be input for this task
- `create-doc.md` (with project-brief template) → Project brief can be input
- Market research documents from external sources

**Successor Tasks** (Use Output of This Task):
- Research execution (typically external to BMad, or via BMad-Master in KB mode)
- `create-doc.md` (project brief) → Research findings inform brief creation
- `create-doc.md` (PRD) → Research insights feed into requirements

**No Direct Task Dependencies**:
- This task does not call other BMad tasks during execution
- It's a standalone facilitation workflow

### File System Dependencies

**Read Requirements**:
```yaml
optional_reads:
  - project_brief_path: 'User-provided path to project brief'
  - brainstorming_output_path: 'User-provided path to brainstorming results'
  - market_research_path: 'User-provided path to existing market research'
```

**Write Requirements**:
```yaml
writes:
  - research_prompt_path: 'docs/research/{focus}-research-prompt.md (default) or user-specified'
```

**Directory Requirements**:
- If saving to default path: `docs/research/` directory should exist (create if missing)
- No strict directory structure enforced - user can specify custom location

### Configuration Dependencies

**From `core-config.yaml`**:
- **None required** - This task operates independently of project configuration
- May reference general project info if available, but not mandatory

**Agent Activation**:
- Analyst agent must be active (persona, instructions, capabilities loaded)
- No other agents required during execution

### Template Dependencies

**No Template Files Required**:
- Research prompt template is embedded in task file (Step 4)
- No external YAML template files needed

### Data File Dependencies

**No Required Data Files**:
- Task operates on user-provided inputs or fresh elicitation
- No lookups to `.bmad-core/data/` files

### Technical/Runtime Prerequisites

**No Technical Requirements**:
- Pure facilitation and text generation task
- No code execution, builds, tests, or compilations
- No external API calls (unless counting AI model itself)
- No command-line tools invoked

**Environment Requirements**:
- AI agent with strong reasoning and synthesis capabilities
- Access to file system for reading input documents and writing output prompt

### Knowledge Prerequisites

**Agent Knowledge**:
- Research methodologies (secondary, primary, qualitative, quantitative)
- Business analysis frameworks (SWOT, Porter's Five Forces, TAM/SAM/SOM, etc.)
- Product management frameworks (Lean Canvas, Jobs-to-be-Done, etc.)
- Technology assessment frameworks (Technology Radar, Build/Buy matrices, etc.)
- Strategic analysis frameworks (Scenario Planning, Decision Trees, etc.)

**User Knowledge**:
- Understanding of their research needs (or willingness to explore with agent's help)
- Ability to articulate objectives and key questions (with agent facilitation)
- Familiarity with their problem domain (though agent can help structure)

### Integration Points

**Upstream Integration** (Inputs to This Task):
- Brainstorming session outputs (from `facilitate-brainstorming-session`)
- Project briefs (from `create-doc` with project-brief template)
- Market research documents (external or from prior research)
- Direct user requests for research

**Downstream Integration** (Outputs from This Task):
- Research findings (after execution) → Project briefs, PRDs, architecture docs
- Research prompts → Knowledge base or research repository
- Validated assumptions → Risk profiles, feasibility assessments

**Parallel Integration** (Related Workflows):
- `facilitate-brainstorming-session` → Often precedes this task (research to validate brainstormed ideas)
- `document-project` → May generate research needs for brownfield projects
- `create-doc` → Research findings inform document creation

---

## 9. Integration Points

### Agent Handoff Points

**Analyst → (External Execution) → Analyst/PM/Architect**:
```
SEQUENCE:
  1. Analyst (this task) creates research prompt
  2. Research executed externally (AI researcher, human researcher, or hybrid)
  3. Research findings returned to project
  4. Findings consumed by:
     - Analyst → Synthesize into project brief or competitive analysis
     - PM → Inform PRD and product strategy
     - Architect → Guide technology and architecture decisions
```

**No Direct Agent Handoffs During Task Execution**:
- This task is executed entirely by Analyst agent
- No mid-task handoffs to other agents
- Output (research prompt) is consumed asynchronously after research execution

### Artifact Handoff Points

**Incoming Artifacts (Optional Inputs)**:
```yaml
from_brainstorming:
  artifact: 'brainstorming-output.md'
  source_task: 'facilitate-brainstorming-session'
  usage: 'Extract themes, ideas, hypotheses for research focus'

from_project_brief:
  artifact: 'project-brief.md'
  source_task: 'create-doc (project-brief template)'
  usage: 'Extract product concepts, users, constraints for context'

from_market_research:
  artifact: 'market-research.md or competitor-analysis.md'
  source_task: 'create-doc (market-research template) or external'
  usage: 'Build on existing findings, identify gaps to research'
```

**Outgoing Artifacts (Task Outputs)**:
```yaml
research_prompt:
  artifact: '{focus}-research-prompt.md'
  destination: 'docs/research/'
  consumers:
    - researcher: 'AI or human executing research'
    - analyst: 'May facilitate research execution'
    - pm: 'Reviews research objectives alignment'
    - team: 'Reference for understanding research scope'
```

**Artifact Update Permissions**:
- **Creates**: Research prompt file (new)
- **Reads**: Input documents (project brief, brainstorming, market research)
- **Updates**: None - this task does not modify existing artifacts
- **Deletes**: None

### Workflow Integration Patterns

**Pattern 1: Discovery → Research → Planning**
```
Workflow:
  1. facilitate-brainstorming-session → Generate ideas and hypotheses
  2. create-deep-research-prompt → Develop research plan to validate hypotheses
  3. [External Research Execution] → Gather evidence and insights
  4. create-doc (project-brief) → Synthesize validated ideas into brief

Handoffs:
  - Brainstorming output → Research prompt (ideas to validate)
  - Research findings → Project brief (validated assumptions)
```

**Pattern 2: Brief → Research → PRD**
```
Workflow:
  1. create-doc (project-brief) → Initial product concept with assumptions
  2. create-deep-research-prompt → Develop research to validate assumptions
  3. [External Research Execution] → Validate market, users, competition
  4. create-doc (PRD) → Build PRD on validated foundation

Handoffs:
  - Project brief → Research prompt (assumptions to validate)
  - Research findings → PRD (validated market and user insights)
```

**Pattern 3: Brownfield → Research → Architecture**
```
Workflow:
  1. document-project → Document existing system and pain points
  2. create-deep-research-prompt → Research technology alternatives or market trends
  3. [External Research Execution] → Evaluate options and approaches
  4. create-doc (architecture) → Design solution based on research

Handoffs:
  - Project documentation → Research prompt (context and constraints)
  - Research findings → Architecture (technology selections, patterns)
```

**Pattern 4: Standalone Research**
```
Workflow:
  1. create-deep-research-prompt → Direct research request (no prior artifacts)
  2. [External Research Execution] → Conduct research
  3. Results stored for future reference

Handoffs:
  - Ad-hoc request → Research prompt
  - Research findings → Knowledge base or future project inputs
```

### Shared Artifact Access

**Reads From** (No Locking Required):
- Project brief (if provided)
- Brainstorming outputs (if provided)
- Market research (if provided)
- Core config (not required, but may reference if available)

**Writes To**:
- New research prompt file (no conflicts - new file creation)

**No Concurrent Modification Concerns**:
- Task creates new files, doesn't modify existing shared artifacts
- Read-only access to input documents

### State Transitions

**Research Lifecycle States** (conceptual, not formal BMad states):
```
State 0: Research Need Identified
  ↓
State 1: Research Prompt Created (this task)
  ↓
State 2: Research In Progress (external)
  ↓
State 3: Research Findings Delivered (external)
  ↓
State 4: Findings Integrated into Project Artifacts (downstream tasks)
```

**This Task's Responsibility**: State 0 → State 1 transition only

### Cross-Agent Communication

**Communication Method**: File-based artifact passing
- No direct inter-agent messaging during this task
- Output file serves as asynchronous communication to future agents/researchers

**Context Preservation**:
- All necessary context embedded in research prompt (Background section)
- Future agents don't need to re-trace reasoning - prompt is self-contained

---

## 10. Configuration References

### Core Configuration Usage

**Configuration File**: `.bmad-core/core-config.yaml`

**Usage**: **OPTIONAL - Not Required**
- This task can operate entirely independently of project configuration
- If core config exists, may reference general project info for context
- No specific config keys required for task execution

**Optional Config References** (if available):
```yaml
# Example - not required, but may be used if present
project:
  name: 'Project Name'
  domain: 'Project domain or industry'

# Could provide default context, but task can elicit this info directly
```

### No Configuration Requirements

Unlike many other BMad tasks, `create-deep-research-prompt` has:
- No mandatory config keys
- No path resolution dependencies
- No location mappings required

**Rationale**: Research prompt creation is a planning/facilitation activity that doesn't depend on project structure, file locations, or runtime settings.

### Configuration-Independent Operation

**Standalone Capability**:
- Can be invoked on any project, even those without `.bmad-core/` setup
- Useful for early-stage exploration before formal project structure exists
- Agent relies on user elicitation rather than config file lookups

**Graceful Degradation**:
```
IF core-config.yaml exists THEN
  MAY reference project name, domain, or other context
  INCLUDE in Background Context section of prompt
ELSE
  OPERATE entirely from user-provided inputs and elicitation
  NO functional limitations
END IF
```

### Output Path Configuration

**Default Output Path**: `docs/research/{focus}-research-prompt.md`
- Hardcoded default, not from config
- User can override with custom path during Step 6

**Path Customization**:
```
IF user specifies custom path THEN
  USE user-specified path
ELSE
  USE default pattern: docs/research/{focus}-research-prompt.md
END IF

IF output directory doesn't exist THEN
  CREATE directory recursively (mkdir -p equivalent)
END IF
```

### No Template Configuration

**Prompt Template**: Embedded in task file (Step 4)
- Not loaded from `.bmad-core/templates/`
- Standardized structure defined inline
- No external template YAML file

### No Agent Configuration Overrides

**Agent Behavior**: Defined by task file, not config
- No mode toggles (always interactive/collaborative)
- No configurable parameters
- No feature flags

---

## 11. Performance Considerations

### Execution Time

**Estimated Duration**:
- **Fast Path (Experienced User with Clear Objectives)**: 10-15 minutes
  - User pre-knows research focus
  - Has clear objectives and questions ready
  - Minimal refinement needed

- **Standard Path (Typical Scenario)**: 20-30 minutes
  - User explores research focus options
  - Collaborates on objectives and questions
  - 1-2 refinement iterations

- **Exploratory Path (Research Scope Unclear)**: 45-60 minutes
  - User needs help defining research needs
  - Multiple refinement iterations
  - Extensive elicitation and examples

**Time Factors**:
- User preparedness (clear objectives vs. exploratory)
- Input document complexity (if provided)
- Number of refinement iterations in Step 5
- Depth of methodology discussion

### Scalability

**Research Prompt Complexity**:
- **Simple Prompt**: 2-3 core questions, 1-2 frameworks, 500-800 words
- **Standard Prompt**: 4-5 core questions, 3-4 frameworks, 800-1200 words
- **Complex Prompt**: 6-7 core questions, 5+ frameworks, 1200-2000 words

**No Performance Bottlenecks**:
- Pure text generation and reasoning task
- No file system scans, builds, or external API calls
- Scales linearly with prompt complexity

### Resource Usage

**Computational Resources**:
- Minimal CPU/memory (text processing only)
- File I/O limited to reading input documents and writing single output file
- No concurrent operations or parallel processing

**Token/Context Usage** (AI Agent):
- **Input Context**: Task instructions + input documents + conversation history
  - Task file: ~5,000 tokens
  - Input documents: 1,000-10,000 tokens (varies)
  - Conversation: 2,000-8,000 tokens (varies with elicitation depth)
  - **Total Input**: 8,000-23,000 tokens (typical)

- **Output Generation**: Generated research prompt
  - Simple: 500-800 tokens
  - Standard: 800-1,200 tokens
  - Complex: 1,200-2,000 tokens

**Optimization Strategies**:
- Clear, concise elicitation questions reduce back-and-forth
- Examples help users respond more precisely
- Structured template minimizes unnecessary generation

### Concurrency

**Single-Threaded Execution**:
- Collaborative task requires sequential user interaction
- No opportunity for parallelization

**No Locking Required**:
- Creates new files (no shared resource conflicts)
- Read-only access to input documents

### Caching

**No Built-In Caching**:
- Each research prompt is unique and context-specific
- No reusable components across invocations

**Potential Optimization** (ADK Implementation):
- Could cache research focus descriptions and framework explanations
- Would reduce token usage for repeated task invocations
- Minimal benefit (these are small, infrequent lookups)

### Bottlenecks

**User Response Time**:
- Primary bottleneck is waiting for user input during elicitation
- No technical bottlenecks

**Refinement Iterations**:
- Step 5 can loop indefinitely if user keeps requesting changes
- Mitigation: Practical limit of ~5 iterations before suggesting pause (see Error Handling section)

### Performance Best Practices

**For Agent**:
- Ask clear, specific questions to minimize back-and-forth
- Provide examples to guide user responses
- Validate inputs early to avoid late-stage rework
- Summarize collected info periodically to ensure alignment

**For User**:
- Prepare objectives and key questions before starting task
- Review input documents beforehand to extract key points
- Be specific rather than general in responses
- Accept "good enough" prompt and refine after initial research findings

---

## 12. Security & Validation

### Input Security

**File Path Validation**:
```
IF user provides input document path THEN
  VALIDATE path is within allowed directories (project root and subdirectories)
  PREVENT path traversal attacks (../ sequences)
  VALIDATE file exists and is readable

  IF path suspicious or outside project THEN
    WARN: "Path {path} appears to be outside project directory"
    CONFIRM: "Are you sure you want to read this file? (y/n)"
  END IF
END IF
```

**Input Document Content Validation**:
```
READ file content
IF file size > 100KB THEN
  WARN: "Input document is large ({size}KB) - processing may take time"
  OFFER: "Would you like to (1) proceed, (2) provide a summary instead, or (3) skip this input?"
END IF

IF content appears to be binary or non-text THEN
  ERROR: "File appears to be binary - expected text/markdown"
  REQUEST: "Please provide a text-based document"
END IF
```

**User Input Sanitization**:
```
FOR each user text input:
  TRIM whitespace
  VALIDATE non-empty (where required)
  SANITIZE for markdown (escape special characters if needed for output)
  NO EXECUTION of user input (pure text, no eval or exec)
END FOR
```

### Output Security

**File Write Validation**:
```
IF user specifies custom output path THEN
  VALIDATE path is within project directory
  PREVENT writing to system directories, home directory outside project
  PREVENT overwriting critical files (.git/, .bmad-core/core-config.yaml, etc.)

  IF path outside project OR conflicts with critical file THEN
    ERROR: "Cannot write to {path} - please choose location within project"
    SUGGEST default: "docs/research/{focus}-research-prompt.md"
  END IF
END IF
```

**Output Content Sanitization**:
```
Generated prompt contains user-provided text:
  - Research objectives
  - Research questions
  - Background context

ENSURE:
  - No script injection (markdown is display-only, not executed)
  - No sensitive data leakage (prompt may be shared with external researchers)
  - Proper markdown escaping for special characters
```

**Sensitive Data Warning**:
```
BEFORE writing prompt to file:
  SCAN background_context and objectives for potential sensitive data markers:
    - "password", "secret", "api key", "token", "private"
    - Email addresses, phone numbers (regex patterns)
    - Financial data, PII indicators

  IF potential sensitive data detected THEN
    WARN: "Research prompt may contain sensitive information"
    DISPLAY flagged sections
    CONFIRM: "Proceed with saving? This file may be shared with researchers."
  END IF
```

### Permission Model

**File System Permissions**:
```yaml
reads:
  - input_documents: read-only access to user-specified paths within project
  - core_config: read-only IF exists (optional)

writes:
  - research_prompt: create new file at specified or default path
  - CANNOT modify existing project artifacts
  - CANNOT write outside project directory structure

deletes:
  - NONE - task never deletes files
```

### Data Privacy

**User Input Privacy**:
- User-provided objectives, questions, and context may contain proprietary or confidential information
- Task should operate in secure environment where conversation history is protected
- Generated prompts may be shared externally (with researchers) - user should be aware

**Recommendations**:
```
BEFORE finalizing prompt (Step 5):
  REMIND user: "This research prompt may be shared with external researchers or AI systems.
                Ensure it doesn't contain sensitive information like:
                - Confidential product details
                - Proprietary technology or trade secrets
                - Personally identifiable information (PII)
                - Internal financial or strategic data

                Would you like to review the prompt for sensitive content before saving?"
```

### Validation Rules

**Research Focus Validation**:
```
ASSERT user_selection in range(1, 9)
ASSERT IF user_selection == 9 THEN custom_description is not empty
```

**Research Objectives Validation**:
```
VALIDATE primary_goal is not empty
VALIDATE success_criteria is not empty
RECOMMEND key_decisions is not empty (warn if missing)
RECOMMEND constraints is not empty (suggest "none" if truly unconstrained)
```

**Research Questions Validation**:
```
VALIDATE core_questions.length >= 1 (must have at least one core question)
RECOMMEND core_questions.length in range(2, 7) for optimal scope
FOR each question:
  VALIDATE question is not empty
  RECOMMEND question length > 10 characters (avoid too-brief questions)
```

**Methodology Validation**:
```
VALIDATE analysis_frameworks.length >= 1 (at least one framework)
VALIDATE data_collection.sources is not empty
```

**Output Requirements Validation**:
```
VALIDATE key_deliverables.length >= 1 (at least executive summary)
VALIDATE output_format specifies structure
```

**Completeness Validation** (Before Step 5):
```
required_components = [
  'research_objectives',
  'background_context',
  'core_questions',
  'data_collection',
  'analysis_frameworks',
  'key_deliverables',
  'success_criteria'
]

FOR each component in required_components:
  ASSERT component is populated and not placeholder-only
  IF component empty or incomplete:
    ERROR: "Prompt is incomplete - missing {component}"
    RETURN to appropriate step to collect missing info
  END IF
```

### Error Messages

**Security-Related Errors**:
```
ERROR: "Path traversal detected in {path} - cannot access files outside project"
ERROR: "Cannot write to protected location {path}"
WARN: "File {path} is outside project directory - confirm access"
WARN: "Research prompt may contain sensitive data - review before sharing"
```

**Validation Errors**:
```
ERROR: "Research focus selection must be 1-9"
ERROR: "Custom research focus requires description"
ERROR: "At least one core research question is required"
WARN: "Research objective is too vague - more specificity recommended"
WARN: "Success criteria should be measurable"
```

---

## 13. Testing & Quality Assurance

### Test Scenarios

#### Scenario 1: Fast Path - Clear Objectives
```yaml
test_name: "Experienced user with prepared objectives"
inputs:
  research_focus: 2  # Market Opportunity Research (pre-selected)
  primary_goal: "Determine TAM/SAM/SOM for AI-powered project management tools in North America"
  core_questions:
    - "What is the total addressable market size for AI PM tools in NA?"
    - "What are the primary market segments and their characteristics?"
    - "Who are the top 5 competitors and what is their market share?"
  success_criteria: "Clear market size estimates, segment identification, competitive landscape"
expected_outcome:
  - Prompt generated in single iteration (no refinement needed)
  - All sections populated with specific, actionable content
  - Execution time: 10-15 minutes
  - Quality: High (clear scope, measurable outcomes)
```

#### Scenario 2: Standard Path - Collaborative Development
```yaml
test_name: "User with general research need, requires facilitation"
inputs:
  research_need: "Understand our competitive landscape"
  input_document: "project-brief.md"
process:
  - Agent presents 9 research focus options
  - User selects #4 (Competitive Intelligence)
  - Agent extracts context from project brief
  - Agent elicits specific objectives and questions
  - User refines questions in Step 5 (1 iteration)
expected_outcome:
  - Prompt generated after 1 refinement iteration
  - Background context drawn from project brief
  - Specific competitive analysis questions developed collaboratively
  - Execution time: 20-30 minutes
  - Quality: Good (specific scope, actionable framework)
```

#### Scenario 3: Exploratory Path - Research Scope Unclear
```yaml
test_name: "User unsure of research needs, exploratory"
inputs:
  research_need: "We need to learn more about the market before deciding on features"
  input_documents: "brainstorming-output.md"
process:
  - Agent analyzes brainstorming output, identifies themes
  - Agent recommends 2-3 research focus options based on themes
  - User selects combination (Product Validation + Market Opportunity)
  - Agent elicits objectives through clarifying questions
  - Multiple refinement iterations to clarify scope (2-3 iterations)
expected_outcome:
  - Prompt generated after 2-3 refinement iterations
  - Hybrid focus combining product and market validation
  - Clearer scope emerged through elicitation process
  - Execution time: 45-60 minutes
  - Quality: Acceptable (user gained clarity on what to research)
```

#### Scenario 4: Multiple Inputs - Synthesis
```yaml
test_name: "Multiple input documents requiring synthesis"
inputs:
  project_brief: "project-brief.md"
  brainstorming_results: "brainstorming-output.md"
  market_research: "initial-market-scan.md"
  research_focus: 1  # Product Validation (pre-selected)
process:
  - Agent reads all 3 input documents
  - Agent synthesizes: product concept (brief) + hypotheses (brainstorming) + market context (research)
  - Agent proposes validation-focused questions based on synthesis
  - User reviews and approves with minor refinements
expected_outcome:
  - Comprehensive background context from 3 sources
  - Research questions validate specific hypotheses
  - Build on existing market research (fill gaps)
  - Execution time: 25-35 minutes
  - Quality: High (well-informed, targeted validation)
```

#### Scenario 5: Custom Research Focus
```yaml
test_name: "User selects custom research focus (#9)"
inputs:
  research_focus: 9  # Custom
  custom_description: "Evaluate AI model deployment platforms for production ML workloads"
process:
  - Agent elicits key areas for custom focus
  - Agent recommends frameworks (Technology + Risk assessment)
  - Agent develops technical evaluation criteria
  - User adds specific deployment constraints
expected_outcome:
  - Custom research focus documented in prompt
  - Technology-specific frameworks applied
  - Evaluation criteria tailored to deployment requirements
  - Execution time: 30-40 minutes
  - Quality: Good (specialized, domain-appropriate)
```

#### Scenario 6: Error Recovery - Vague Objectives
```yaml
test_name: "User provides vague objectives, agent guides to specificity"
inputs:
  research_focus: 3  # User & Customer Research
  initial_objective: "Learn about users"  # Too vague
process:
  - Agent detects vague objective
  - Agent provides examples of specific objectives
  - Agent elicits: Which users? What aspects? For what decisions?
  - User refines: "Understand pain points of enterprise PM teams (10-50 users) to inform feature prioritization"
expected_outcome:
  - Initial vague input transformed into specific objective
  - Agent facilitation improves prompt quality
  - User learns how to articulate research needs
  - Execution time: 35-45 minutes (extra elicitation time)
  - Quality: Good (achieved specificity through guidance)
```

### Quality Metrics

**Prompt Quality Indicators**:
```yaml
high_quality_prompt:
  - objectives: Specific, measurable, decision-linked
  - questions: 3-5 core questions, all actionable and scoped
  - methodology: 2-4 appropriate frameworks, clear data sources
  - deliverables: Mapped to questions, decision-support focus
  - background: Relevant context without unnecessary detail
  - length: 800-1200 words (focused, not over-engineered)

medium_quality_prompt:
  - objectives: Mostly specific, some vagueness remains
  - questions: 2-6 questions, some may be broad
  - methodology: 1-2 frameworks, sources somewhat generic
  - deliverables: Present but may not fully map to questions
  - background: Either too brief or overly detailed
  - length: 600-800 or 1200-1500 words (slightly unfocused)

low_quality_prompt:
  - objectives: Vague, not decision-linked
  - questions: <2 or >7 questions, generic or overly broad
  - methodology: No frameworks or inappropriate ones
  - deliverables: Generic, not tailored to research needs
  - background: Missing context or irrelevant detail
  - length: <600 or >1500 words (either too thin or bloated)
```

**Success Criteria**:
- ≥80% of prompts achieve high or medium quality
- User approval rate: ≥95% (user satisfied after refinement)
- Execution time: ≤35 minutes average
- Refinement iterations: ≤2 average

### Validation Checklist

**Pre-Generation Validation** (Before Step 4):
- [ ] Research focus selected (1-9) and documented
- [ ] Research objectives articulated (primary goal, decisions, success criteria, constraints)
- [ ] Core research questions defined (2-7 questions, specific and scoped)
- [ ] Supporting questions identified (if any)
- [ ] Data collection approach specified (sources, quality requirements)
- [ ] Analysis frameworks selected (1-5 frameworks, appropriate to focus)
- [ ] Output requirements defined (deliverables mapped to questions)
- [ ] Background context synthesized (from inputs or elicitation)

**Post-Generation Validation** (After Step 4):
- [ ] All template sections populated (no empty placeholders)
- [ ] Objectives align with selected research focus
- [ ] Questions are specific, actionable, and answerable
- [ ] Frameworks are appropriate for research type
- [ ] Deliverables support decision-making
- [ ] Success criteria are measurable
- [ ] Prompt is self-contained (usable without additional context)
- [ ] Length is appropriate (800-1200 words target)

**User Approval Validation** (Step 5):
- [ ] User confirms objectives are correctly stated
- [ ] User confirms questions address all concerns
- [ ] User confirms scope is appropriate
- [ ] User confirms output requirements are sufficient
- [ ] User explicitly approves prompt or requests specific refinements

### Edge Cases

**Edge Case 1: No Input Documents, Minimal User Context**
```
Scenario: User says "I need research" with no documents, no details
Mitigation:
  - Start with very basic elicitation: "What is this research about?"
  - Use Step 1 (research focus selection) to guide user thinking
  - Narrow scope through targeted questions
  - Accept smaller, more exploratory prompt as valid outcome
Expected: Longer elicitation time, but still produces useful prompt
```

**Edge Case 2: Conflicting Inputs**
```
Scenario: Project brief says "target SMBs" but brainstorming says "enterprise focus"
Mitigation:
  - Surface conflict to user: "I see different target markets mentioned..."
  - Elicit clarification: "Which is the primary focus for this research?"
  - Document assumption in Background Context
Expected: User resolves conflict, research focused on clarified target
```

**Edge Case 3: Overly Ambitious Scope**
```
Scenario: User wants to research "everything about AI, markets, users, competition, technology"
Mitigation:
  - Warn: "This scope is very broad - research may lack depth"
  - Suggest: "Would you like to prioritize or break into multiple research efforts?"
  - Offer to create multiple focused prompts instead of one mega-prompt
Expected: User agrees to narrow scope or create phased research plan
```

**Edge Case 4: Highly Specialized Domain**
```
Scenario: Research focus is niche technical domain (e.g., quantum computing algorithms)
Mitigation:
  - Agent may lack deep domain expertise
  - Rely more heavily on user guidance for methodology and frameworks
  - Document user's domain knowledge in prompt
  - Recommend human expert researcher rather than pure AI execution
Expected: Prompt guides research but acknowledges domain complexity
```

**Edge Case 5: Continuous Refinement Loop**
```
Scenario: User keeps requesting changes, never approves (5+ iterations)
Mitigation:
  - After 5 iterations, offer pause: "We've refined extensively - would you like to:
      1. Accept current version and iterate after initial findings
      2. Take a break and return with fresh perspective"
  - Validate if fundamental issue exists (wrong research focus, unclear objectives)
Expected: User accepts prompt or identifies root issue to resolve
```

### ADK Testing Recommendations

**Unit Tests** (Reasoning Engine):
- Test research focus selection logic (1-9 + custom)
- Test input document parsing (project brief, brainstorming, market research)
- Test template population (all sections filled correctly)
- Test validation rules (objectives, questions, methodology)

**Integration Tests**:
- Test with real project brief → research prompt generation
- Test with brainstorming output → research prompt generation
- Test with no inputs → elicitation-driven prompt generation
- Test refinement loop (user feedback → revision → re-generation)

**End-to-End Tests**:
- Test complete workflow from research need to saved prompt file
- Test multiple input documents synthesis
- Test custom research focus (#9) path
- Test save to default vs. custom path

**User Acceptance Tests**:
- Real users with real research needs
- Measure: prompt quality, user satisfaction, execution time
- Validate: refinement iterations, approval rate

---

## 14. ADK Translation Recommendations

### Recommended GCP Services

**Primary Service**: **Vertex AI Agent with Conversational Flow**
- **Rationale**: This is a multi-turn, highly interactive task requiring structured elicitation and state management across 6 steps
- **Capabilities Needed**:
  - Multi-turn conversation with state persistence
  - Structured elicitation (present options, gather responses, validate)
  - Dynamic prompt generation based on collected inputs
  - File read/write operations

**Supporting Services**:

```yaml
agent_builder:
  service: "Vertex AI Agent Builder"
  configuration:
    agent_type: "conversational"
    persona: "Analyst (Mary)"
    tools:
      - name: "read_document"
        type: "cloud_function"
        description: "Read input documents (project brief, brainstorming, market research)"
      - name: "write_research_prompt"
        type: "cloud_function"
        description: "Write generated research prompt to file"
      - name: "validate_prompt"
        type: "cloud_function"
        description: "Validate prompt completeness and quality"

cloud_functions:
  - function: "read_document"
    purpose: "Load and parse input documents from Cloud Storage or Firestore"
    runtime: "Python 3.11"

  - function: "write_research_prompt"
    purpose: "Write generated prompt to Cloud Storage or Firestore"
    runtime: "Python 3.11"

  - function: "validate_prompt"
    purpose: "Run validation rules on generated prompt"
    runtime: "Python 3.11"

storage:
  input_documents:
    service: "Cloud Storage"
    bucket: "bmad-project-artifacts"
    path: "projects/{project_id}/docs/"

  output_prompts:
    service: "Cloud Storage"
    bucket: "bmad-project-artifacts"
    path: "projects/{project_id}/research/"

state_management:
  service: "Firestore"
  collection: "research_prompt_sessions"
  fields:
    - session_id
    - project_id
    - selected_focus
    - research_objectives
    - core_questions
    - supporting_questions
    - data_collection
    - analysis_frameworks
    - key_deliverables
    - current_step
    - refinement_iteration
```

### Agent Configuration

**Analyst Agent Enhancement** (for this task):
```yaml
agent:
  id: "analyst-agent"
  display_name: "Mary - Research & Discovery Analyst"
  task: "create-deep-research-prompt"

  instructions: |
    You are facilitating research prompt creation. Your role is to:
    1. Guide user through research focus selection (9 options + custom)
    2. Process input documents to extract relevant context
    3. Collaboratively develop research objectives, questions, methodology, and deliverables
    4. Generate structured research prompt using standardized template
    5. Refine prompt based on user feedback until approved
    6. Provide guidance on research execution

    CRITICAL MARKERS indicate required user collaboration - do not proceed unilaterally.

  tools:
    - read_document
    - write_research_prompt
    - validate_prompt

  conversation_flow:
    initial_state: "select_research_focus"
    states:
      - select_research_focus:
          prompt: "Present 9 research focus options, elicit selection"
          transitions:
            - to: "process_inputs" when: "focus selected"
            - to: "elicit_custom_focus" when: "custom selected (#9)"

      - elicit_custom_focus:
          prompt: "Elicit custom focus description and key areas"
          transitions:
            - to: "process_inputs" when: "custom focus defined"

      - process_inputs:
          prompt: "Extract context from input documents or elicit if none"
          transitions:
            - to: "develop_objectives" when: "context gathered"

      - develop_objectives:
          prompt: "Collaboratively develop research objectives (Step 3A)"
          transitions:
            - to: "develop_questions" when: "objectives defined"

      - develop_questions:
          prompt: "Develop core and supporting questions (Step 3B)"
          transitions:
            - to: "develop_methodology" when: "questions defined"

      - develop_methodology:
          prompt: "Define data collection and analysis frameworks (Step 3C)"
          transitions:
            - to: "develop_deliverables" when: "methodology defined"

      - develop_deliverables:
          prompt: "Specify output requirements (Step 3D)"
          transitions:
            - to: "generate_prompt" when: "deliverables defined"

      - generate_prompt:
          prompt: "Generate complete research prompt using template (Step 4)"
          action: "call write_research_prompt tool"
          transitions:
            - to: "review_and_refine" when: "prompt generated"

      - review_and_refine:
          prompt: "Present prompt, gather feedback, refine if needed (Step 5)"
          transitions:
            - to: "generate_prompt" when: "refinement requested"
            - to: "provide_guidance" when: "prompt approved"

      - provide_guidance:
          prompt: "Offer to save prompt, provide execution guidance (Step 6)"
          transitions:
            - to: "complete" when: "guidance provided"
```

### Workflow Implementation

**Reasoning Engine Workflow** (Alternative to pure conversational agent):

If Vertex AI Agent's conversational flow is insufficient, implement as Reasoning Engine workflow:

```python
from google.cloud import reasoning_engine
from google.cloud import storage
from google.cloud import firestore

class CreateDeepResearchPromptWorkflow:
    """
    Reasoning Engine workflow for create-deep-research-prompt task.
    Implements 6-step facilitation process with state management.
    """

    def __init__(self, config):
        self.config = config
        self.firestore = firestore.Client()
        self.storage = storage.Client()

    def execute(self, project_id: str, user_inputs: dict) -> dict:
        """Main execution flow with user interaction loop."""

        session_id = self.create_session(project_id)

        # Step 1: Research Type Selection
        selected_focus = self.select_research_focus(
            session_id,
            user_inputs.get('research_focus')
        )

        # Step 2: Input Processing
        background_context = self.process_inputs(
            session_id,
            user_inputs.get('input_documents', [])
        )

        # Step 3: Research Prompt Structure Development
        research_structure = self.develop_research_structure(
            session_id,
            selected_focus,
            background_context
        )

        # Step 4: Prompt Generation
        research_prompt = self.generate_prompt(
            session_id,
            research_structure
        )

        # Step 5: Review and Refinement (loop until approved)
        final_prompt = self.refine_prompt(
            session_id,
            research_prompt
        )

        # Step 6: Next Steps Guidance
        guidance = self.provide_guidance(
            session_id,
            selected_focus
        )

        return {
            "research_prompt": final_prompt,
            "saved_path": self.save_prompt(project_id, final_prompt, selected_focus),
            "execution_guidance": guidance,
            "session_id": session_id
        }

    def select_research_focus(self, session_id, pre_selected=None):
        """Step 1: Present options and elicit selection."""
        if pre_selected:
            return self.validate_focus_selection(pre_selected)

        # Present 9 options via UI/conversation
        # Elicit user selection
        # Store in Firestore session state
        pass

    def process_inputs(self, session_id, input_documents):
        """Step 2: Extract context from documents or elicit."""
        # Read documents from Cloud Storage
        # Parse and extract relevant context
        # Synthesize into background_context
        pass

    def develop_research_structure(self, session_id, focus, context):
        """Step 3: Collaborative development of 4 components."""
        # Step 3A: Research Objectives
        objectives = self.elicit_objectives(session_id)

        # Step 3B: Research Questions
        questions = self.elicit_questions(session_id)

        # Step 3C: Methodology
        methodology = self.develop_methodology(session_id, focus)

        # Step 3D: Output Requirements
        deliverables = self.elicit_deliverables(session_id)

        return {
            "objectives": objectives,
            "questions": questions,
            "methodology": methodology,
            "deliverables": deliverables,
            "background_context": context
        }

    def generate_prompt(self, session_id, structure):
        """Step 4: Populate template and generate markdown."""
        template = self.load_prompt_template()
        prompt = self.populate_template(template, structure)
        return prompt

    def refine_prompt(self, session_id, initial_prompt):
        """Step 5: Iterative refinement based on feedback."""
        current_prompt = initial_prompt
        iteration = 0

        while iteration < 5:  # Max 5 iterations
            feedback = self.get_user_feedback(session_id, current_prompt)

            if feedback['approved']:
                return current_prompt

            current_prompt = self.apply_refinements(
                current_prompt,
                feedback['changes']
            )
            iteration += 1

        # Suggest pause after 5 iterations
        return current_prompt

    def provide_guidance(self, session_id, focus):
        """Step 6: Next steps and execution options."""
        return {
            "execution_options": ["AI Research Assistant", "Human Research", "Hybrid"],
            "integration_points": self.get_integration_guidance(focus),
            "follow_up_support": ["Facilitate research", "Process findings", "Refine prompt"]
        }

    def save_prompt(self, project_id, prompt, focus):
        """Save prompt to Cloud Storage."""
        bucket = self.storage.bucket(self.config['output_bucket'])
        blob_path = f"projects/{project_id}/research/{focus}-research-prompt.md"
        blob = bucket.blob(blob_path)
        blob.upload_from_string(prompt, content_type='text/markdown')
        return blob_path
```

### State Management

**Firestore Schema**:
```javascript
// Collection: research_prompt_sessions
{
  session_id: "uuid",
  project_id: "project-123",
  created_at: Timestamp,
  current_step: 1-6,

  // Step 1: Research Focus
  selected_focus: 1-9,
  focus_name: "Market Opportunity Research",
  custom_focus_description: null,  // if focus == 9

  // Step 2: Inputs
  input_documents: [
    {type: "project_brief", path: "gs://...", processed: true},
    {type: "brainstorming", path: "gs://...", processed: true}
  ],
  background_context: "Synthesized context...",

  // Step 3: Structure
  research_objectives: {
    primary_goal: "...",
    key_decisions: "...",
    success_criteria: "...",
    constraints: "..."
  },

  core_questions: [
    {question: "...", priority: 1, dependencies: []},
    {question: "...", priority: 2, dependencies: [1]}
  ],

  supporting_questions: ["...", "..."],

  data_collection: {
    sources: "...",
    quality_requirements: "...",
    credibility_criteria: "..."
  },

  analysis_frameworks: [
    {name: "TAM/SAM/SOM", description: "..."},
    {name: "Porter's Five Forces", description: "..."}
  ],

  key_deliverables: [
    {name: "Executive Summary", description: "..."},
    {name: "Market Size Analysis", description: "..."}
  ],

  // Step 4: Generated Prompt
  generated_prompt: "markdown content...",

  // Step 5: Refinement
  refinement_iteration: 0,
  refinement_history: [
    {iteration: 1, feedback: "...", changes_applied: "..."}
  ],

  // Step 6: Output
  final_prompt: "markdown content...",
  saved_path: "gs://bmad-project-artifacts/projects/project-123/research/market-opportunity-research-prompt.md",
  approved: true,
  completed_at: Timestamp
}
```

### UI/UX Considerations

**Web UI Implementation**:
- Step-by-step wizard interface (6 steps)
- Progress indicator showing current step
- Option selection (radio buttons for research focus 1-9)
- Text areas for objectives, questions, methodology
- Live preview of generated prompt
- Inline editing during refinement
- "Save Draft" capability (resume later)

**IDE Integration** (if applicable):
- Command palette: "BMad: Create Research Prompt"
- Interactive prompts in IDE terminal or sidebar
- File picker for input documents
- Generated prompt opens in editor for manual refinement

### Integration with Other Tasks

**Upstream Tasks** (Provide Inputs):
- `facilitate-brainstorming-session` → brainstorming output
- `create-doc` (project-brief) → project brief
- External market research → market research documents

**Downstream Tasks** (Consume Outputs):
- Research execution (external to BMad)
- `create-doc` (project-brief, PRD) → Informed by research findings
- `create-doc` (architecture) → Technology research findings

**API Endpoints** (if exposing as service):
```yaml
POST /v1/projects/{project_id}/research-prompts
  Request Body:
    - research_focus: 1-9 (optional)
    - input_documents: array of GCS paths (optional)
    - user_inputs: {objectives, questions, ...} (optional)
  Response:
    - session_id: uuid
    - current_step: 1
    - next_action: "select_research_focus"

PUT /v1/sessions/{session_id}/step/{step_number}
  Request Body:
    - user_response: {step-specific data}
  Response:
    - session_state: updated state
    - next_action: "proceed_to_step_X" or "refine_current_step"

GET /v1/sessions/{session_id}/prompt
  Response:
    - research_prompt: markdown content
    - status: "draft" | "final"
    - refinement_iteration: int

POST /v1/sessions/{session_id}/save
  Request Body:
    - output_path: custom path (optional)
  Response:
    - saved_path: GCS path
    - prompt_url: signed URL for download
```

### Migration Considerations

**From Current BMad**:
- Task file content → Agent instructions + conversation flow
- Markdown template → Template service or embedded in workflow
- File I/O → Cloud Storage operations
- User interaction → Web UI or conversational interface

**Behavioral Parity**:
- Ensure all 9 research focus options preserved
- Maintain CRITICAL collaboration points (user approval required)
- Preserve template structure and output format
- Maintain validation rules and error handling

**Enhancements Possible in ADK**:
- Richer UI for option selection and prompt preview
- Template library (save and reuse prompt templates)
- Collaborative editing (multiple stakeholders contribute)
- Integration with actual research tools (auto-execute research)
- Analytics on research prompt patterns and quality

---

## 15. Cross-References

### Related Tasks

**Direct Dependencies**:
- **None** - This task operates independently, no other tasks called during execution

**Common Predecessors** (Provide Context):
- `facilitate-brainstorming-session.md` - Brainstorming output often feeds into research prompt
  - **Artifact Flow**: `brainstorming-output.md` → `create-deep-research-prompt` (as input document)
  - **Usage**: Extract themes, hypotheses, and validation needs to inform research questions

- `create-doc.md` (project-brief template) - Project brief provides product context
  - **Artifact Flow**: `project-brief.md` → `create-deep-research-prompt` (as input document)
  - **Usage**: Extract product concepts, users, constraints to inform background context

**Common Successors** (Consume Research Findings):
- `create-doc.md` (project-brief template) - Research findings inform brief creation
  - **Artifact Flow**: Research findings → `create-doc` (project-brief) (as reference)
  - **Usage**: Validated market, user, and competitive insights feed into brief

- `create-doc.md` (PRD templates) - Research informs requirements and features
  - **Artifact Flow**: Research findings → `create-doc` (PRD) (as reference)
  - **Usage**: Market size, user needs, competitive analysis inform PRD sections

- `create-doc.md` (architecture template) - Technology research guides architecture
  - **Artifact Flow**: Technology research findings → `create-doc` (architecture) (as reference)
  - **Usage**: Technology evaluation, build/buy decisions, patterns feed into architecture

**Related Analyst Tasks**:
- `facilitate-brainstorming-session.md` - Similar facilitation/elicitation workflow
- `document-project.md` - Brownfield analysis (may generate research needs)
- `advanced-elicitation.md` - Elicitation methods used within this task

### Referenced Templates

**No External Templates Required**:
- Research prompt template is embedded in task file (Step 4 section)
- No `.bmad-core/templates/*.yaml` files loaded

**Template Structure** (Inline):
```markdown
## Research Objective
## Background Context
## Research Questions
  ### Primary Questions (Must Answer)
  ### Secondary Questions (Nice to Have)
## Research Methodology
  ### Information Sources
  ### Analysis Frameworks
  ### Data Requirements
## Expected Deliverables
  ### Executive Summary
  ### Detailed Analysis
  ### Supporting Materials
## Success Criteria
## Timeline and Priority
```

### Referenced Checklists

**No Checklists Used**:
- This task does not invoke `execute-checklist.md`
- No checklist files loaded from `.bmad-core/checklists/`

### Referenced Data Files

**No Data Files Required**:
- Task does not load data from `.bmad-core/data/`
- All information gathered through user elicitation or input documents

**Potential Enhancement** (Not in Current Implementation):
- Could load `.bmad-core/data/research-frameworks.yaml` with curated framework descriptions
- Would reduce hardcoded framework text in task file
- Low priority - current inline approach is sufficient

### Agent Assignments

**Primary Agent**: Analyst (Mary)
- **Tasks**: Entire workflow (Steps 1-6)
- **Justification**: Research and discovery expertise, elicitation skills, structured thinking

**No Multi-Agent Collaboration**:
- Single agent executes entire task
- No handoffs during execution

**Agent Capabilities Required**:
- Research methodology knowledge
- Business/technology/market frameworks
- Elicitation and facilitation skills
- Structured prompt generation
- User guidance and teaching

### Configuration Keys

**No Required Configuration**:
- Task operates independently of `core-config.yaml`
- No specific keys referenced

**Optional Configuration** (Enhancement):
```yaml
# Not currently implemented, but could be useful
analyst:
  default_research_path: 'docs/research/'
  research_frameworks_data: '.bmad-core/data/research-frameworks.yaml'

project:
  name: 'Project Name'  # Could be included in background context
  domain: 'Industry/Domain'  # Could guide framework recommendations
```

### Document Locations

**Input Document Locations** (User-Specified):
- Project Brief: Typically `docs/{project}/project-brief.md` or `docs/planning/project-brief.md`
- Brainstorming Output: Typically `docs/{project}/brainstorming-output.md`
- Market Research: Variable (could be external or `docs/{project}/market-research.md`)

**Output Document Location** (Default or Custom):
- **Default**: `docs/research/{focus}-research-prompt.md`
- **Custom**: User-specified path (must be within project directory)

**No Location Resolution from Config**:
- Unlike many BMad tasks, this task does not resolve paths from `core-config.yaml`
- Uses default pattern or user-provided paths directly

### Workflow Context

**Planning Phase Workflows**:
- This task is typically used during **Planning Phase** (before development)
- Supports all 6 workflow types (greenfield/brownfield × fullstack/service/UI)
- Not tied to specific workflow, used on-demand when research is needed

**Development Phase Usage** (Less Common):
- May be used mid-development if new research needs emerge
- Example: Technology spike requires deeper evaluation of options

**Brownfield Workflows**:
- Particularly relevant for brownfield projects (understanding existing system, market, technology landscape)
- Often follows `document-project.md` task

### External Integrations

**Research Execution** (External to BMad):
- Generated prompt used by external tools/people:
  - AI research assistants (Claude, Perplexity, custom GPT)
  - Human researchers (internal analysts, consultants)
  - Hybrid approach (AI + human validation)

**No Direct API Integrations**:
- Task does not call external APIs
- Research execution happens outside BMad framework

**Potential Integrations** (Enhancement):
- Vertex AI Search - Could auto-execute research using prompt
- Web search APIs - Gather initial data based on prompt
- Document analysis - Pre-process large input documents

### Knowledge Base References

**BMad-Master KB Mode**:
- `kb-mode-interaction.md` - BMad-Master could be used to execute research
- Research prompt from this task → BMad-Master in KB mode → Research findings

**Knowledge Base as Input**:
- If project has knowledge base, could be referenced as background context
- Not currently implemented in task, but conceptually aligned

---

## 16. Examples & Use Cases

### Example 1: Product Validation Research (Greenfield)

**Context**: Startup has idea for AI-powered project management tool, needs to validate assumptions before building PRD.

**Inputs**:
```yaml
research_need: "Validate product concept and market fit before committing to PRD"
project_brief: "docs/planning/project-brief.md"
research_focus: 1  # Product Validation Research
```

**Process**:
1. **Step 1**: Agent confirms focus #1 (Product Validation)
2. **Step 2**: Agent extracts from project brief:
   - Product concept: AI-powered PM tool with predictive risk analysis
   - Target users: Engineering managers at Series A-C startups (10-50 devs)
   - Key assumptions: Users will pay $50/user/month, AI predictions are differentiator
3. **Step 3**: Agent collaborates with user to develop:
   - **Objective**: "Validate that engineering managers at Series A-C startups have unmet need for predictive risk analysis and would pay $50/user/month"
   - **Core Questions**:
     1. What are current pain points for eng managers in risk identification?
     2. How do they currently handle risk forecasting (tools, processes)?
     3. Would AI-powered predictions be compelling enough to switch tools?
     4. What is willingness to pay for this capability?
   - **Methodology**: User interviews (10-15), competitive tool analysis, pricing research
   - **Frameworks**: Jobs-to-be-Done, Value Proposition Canvas, Willingness-to-Pay Analysis
4. **Step 4**: Agent generates comprehensive research prompt (1,100 words)
5. **Step 5**: User reviews, requests addition of "technical feasibility" question, agent refines
6. **Step 6**: Agent saves to `docs/research/product-validation-research-prompt.md`, recommends hybrid approach (AI for market scan, human for interviews)

**Output**: Research prompt guides 2-week validation study, findings feed into PRD creation.

---

### Example 2: Competitive Intelligence Research (Market Entry)

**Context**: Established SaaS company considering expansion into adjacent market, needs deep competitive analysis.

**Inputs**:
```yaml
research_need: "Understand competitive landscape before market entry decision"
market_research: "docs/research/initial-market-scan.md"  # High-level overview
research_focus: 4  # Competitive Intelligence Research
```

**Process**:
1. **Step 1**: Agent confirms focus #4 (Competitive Intelligence)
2. **Step 2**: Agent extracts from initial market scan:
   - Market: Observability tools for cloud-native apps
   - Identified competitors: Datadog, New Relic, Dynatrace (incumbents)
   - Gap: Initial scan was high-level, need depth on differentiation
3. **Step 3**: Agent collaborates:
   - **Objective**: "Identify competitive moats and differentiation opportunities to inform positioning and feature priorities"
   - **Core Questions**:
     1. What are the core value propositions of top 5 competitors?
     2. What features are table-stakes vs. differentiators?
     3. What customer segments are underserved by current solutions?
     4. What are competitors' pricing models and typical contract values?
     5. What technology choices give competitive advantages?
   - **Methodology**: Competitor website/doc analysis, customer review mining, pricing intelligence, technical deep-dives
   - **Frameworks**: Feature Comparison Matrix, Strategic Group Analysis, Positioning Map, Technology Stack Analysis
4. **Step 4**: Agent generates research prompt (1,300 words)
5. **Step 5**: User approves without refinement
6. **Step 6**: Agent saves to `docs/research/competitive-intelligence-research-prompt.md`, recommends AI for data collection + human for strategic synthesis

**Output**: Research prompt guides 3-week competitive intelligence project, findings inform go/no-go decision and feature roadmap.

---

### Example 3: Technology Research (Architecture Decision)

**Context**: Mid-project, team needs to select vector database for AI features, requires systematic evaluation.

**Inputs**:
```yaml
research_need: "Evaluate vector database options for production deployment"
research_focus: 5  # Technology & Innovation Research
```

**Process**:
1. **Step 1**: Agent confirms focus #5 (Technology & Innovation)
2. **Step 2**: No input documents, agent elicits context:
   - **Context**: Adding semantic search and RAG features to existing product
   - **Constraints**: Must integrate with existing Postgres DB, handle 10M+ vectors, <100ms query latency
   - **Options**: Considering pgvector (Postgres extension), Pinecone, Weaviate, Qdrant
3. **Step 3**: Agent collaborates:
   - **Objective**: "Select vector database that meets performance and integration requirements while minimizing operational complexity"
   - **Core Questions**:
     1. Which solutions meet latency requirements at target scale (10M vectors, <100ms)?
     2. What are integration patterns with existing Postgres database?
     3. What are TCO implications (self-hosted vs. managed)?
     4. What are operational complexity and team skill requirements?
   - **Methodology**: Benchmarking, architecture pattern analysis, cost modeling, vendor evaluations
   - **Frameworks**: Build/Buy/Partner Decision Matrix, Technology Radar, TCO Analysis, Risk-Adjusted Scoring
4. **Step 4**: Agent generates research prompt (1,000 words)
5. **Step 5**: User requests adding "migration path" consideration, agent refines
6. **Step 6**: Agent saves to `docs/research/technology-vector-database-research-prompt.md`, recommends hybrid approach (AI for vendor research, team for benchmarking)

**Output**: Research prompt guides 1-week technology spike, findings documented in ADR (Architecture Decision Record).

---

### Example 4: User Research (Feature Prioritization)

**Context**: Product team has 20 feature ideas, needs user research to prioritize based on actual needs.

**Inputs**:
```yaml
research_need: "Understand user needs to prioritize feature backlog"
brainstorming_results: "docs/planning/feature-ideas-brainstorming.md"
research_focus: 3  # User & Customer Research
```

**Process**:
1. **Step 1**: Agent confirms focus #3 (User & Customer Research)
2. **Step 2**: Agent extracts from brainstorming:
   - 20 feature ideas across 4 themes: automation, insights, collaboration, integrations
   - Hypotheses: Users want more AI assistance, real-time collaboration is critical
   - Uncertainty: Which theme delivers most value? Which features are must-haves?
3. **Step 3**: Agent collaborates:
   - **Objective**: "Identify top 5 feature priorities based on user pain points, frequency of need, and willingness to pay"
   - **Core Questions**:
     1. What are the top 3 pain points users face with current product?
     2. Which of the 4 themes (automation/insights/collaboration/integrations) addresses highest-priority needs?
     3. For top theme, which specific features are must-haves vs. nice-to-haves?
     4. What would users pay extra for (premium feature identification)?
   - **Methodology**: User interviews (15-20), survey (existing users), usage analytics, prioritization workshops
   - **Frameworks**: Jobs-to-be-Done, Kano Model (must-have/performance/delighter), Value vs. Effort Matrix
4. **Step 4**: Agent generates research prompt (1,150 words)
5. **Step 5**: User approves after 1 refinement (clarified "existing users" vs. "prospects")
6. **Step 6**: Agent saves to `docs/research/user-feature-prioritization-research-prompt.md`, recommends hybrid approach (surveys via AI analysis, interviews human-conducted)

**Output**: Research prompt guides 2-week user research study, findings create prioritized backlog for next quarter.

---

### Example 5: Brownfield System Analysis (Modernization Research)

**Context**: Company has legacy monolith, exploring microservices migration, needs to research patterns and approaches.

**Inputs**:
```yaml
research_need: "Research microservices migration strategies and patterns for our legacy system"
input_documents:
  - "docs/brownfield/system-documentation.md"  # from document-project task
research_focus: 5  # Technology & Innovation (could also be #6 Industry & Ecosystem)
```

**Process**:
1. **Step 1**: Agent confirms focus #5 (Technology & Innovation)
2. **Step 2**: Agent extracts from system documentation:
   - Current system: 10-year-old Rails monolith, 500K LOC, 20 devs
   - Pain points: Slow deployments, scaling challenges, tech debt
   - Constraints: Must maintain uptime, team has limited microservices experience
3. **Step 3**: Agent collaborates:
   - **Objective**: "Identify pragmatic microservices migration path that balances modernization benefits with team capabilities and business continuity"
   - **Core Questions**:
     1. What are proven strangler fig patterns for Rails-to-microservices migrations?
     2. Which services should be extracted first (prioritization criteria)?
     3. What technology stacks are most compatible with existing Rails monolith?
     4. What are realistic timelines and resource requirements for migration?
     5. What risks are most common, and how can they be mitigated?
   - **Methodology**: Case study analysis, architectural pattern research, vendor evaluations (if applicable), cost/benefit modeling
   - **Frameworks**: Strangler Fig Pattern, Domain-Driven Design (bounded contexts), Risk Matrix, Effort-Impact Matrix
4. **Step 4**: Agent generates research prompt (1,250 words)
5. **Step 5**: User requests adding "team training needs" consideration, agent refines
6. **Step 6**: Agent saves to `docs/research/technology-microservices-migration-research-prompt.md`, recommends architect-led research with team input

**Output**: Research prompt guides 3-week architecture exploration, findings inform migration roadmap and ADRs.

---

### Example 6: Strategic Options Research (Business Model)

**Context**: Startup at crossroads - continue B2B SaaS or pivot to developer platform model? Need research to inform decision.

**Inputs**:
```yaml
research_need: "Evaluate business model options: continue B2B SaaS vs. pivot to developer platform"
project_brief: "docs/planning/project-brief.md"
research_focus: 7  # Strategic Options Research
```

**Process**:
1. **Step 1**: Agent confirms focus #7 (Strategic Options)
2. **Step 2**: Agent extracts from project brief:
   - Current state: B2B SaaS, 50 customers, $500K ARR, slow growth
   - Observation: Developers building on top of product (unofficial API usage)
   - Question: Should we double down on SaaS or become developer platform?
3. **Step 3**: Agent collaborates:
   - **Objective**: "Determine which business model (B2B SaaS vs. developer platform) offers better path to $10M ARR within 3 years"
   - **Core Questions**:
     1. What is market size and growth trajectory for each model?
     2. What are unit economics and CAC payback for each model?
     3. What are successful examples in similar domains (case studies)?
     4. What resources/capabilities are required for each model?
     5. What are risks and mitigation strategies for pivot to platform?
   - **Methodology**: Market sizing, financial modeling, competitive case studies, resource gap analysis, scenario planning
   - **Frameworks**: Business Model Canvas comparison, Strategic Options Grid, Scenario Planning, Decision Tree Analysis
4. **Step 4**: Agent generates research prompt (1,350 words)
5. **Step 5**: User requests adding "exit implications" for potential acquisition, agent refines
6. **Step 6**: Agent saves to `docs/research/strategic-options-business-model-research-prompt.md`, recommends leadership team conducts research (high-stakes decision)

**Output**: Research prompt guides 4-week strategic research project involving leadership team, board, and advisors. Findings inform pivotal business decision.

---

### Common Patterns Across Examples

**Pattern 1: Input Document Processing**
- Examples 1, 2, 5, 6 all use existing artifacts as context
- Agent extracts key concepts, constraints, and open questions
- Background context section of prompt synthesizes this information

**Pattern 2: Hypothesis Validation**
- Examples 1, 4 focus on validating assumptions from brainstorming or briefs
- Research questions directly test hypotheses ("Would users pay $X?" "Is feature Y must-have?")

**Pattern 3: Decision Support**
- All examples link research to specific decisions (build PRD, enter market, select technology, prioritize features, pivot business model)
- Success criteria tied to decision clarity

**Pattern 4: Hybrid Execution**
- Most examples recommend hybrid approach (AI + human)
- AI for data collection and analysis, human for critical judgment and synthesis

**Pattern 5: Integration with Workflow**
- Research findings feed into downstream artifacts (PRD, architecture, roadmap, ADRs)
- Research prompt creation is a planning activity, not execution

---

## Appendix: Research Focus Descriptions

### Full Descriptions of 9 Research Focus Options

Extracted from task file for reference:

1. **Product Validation Research**
   - Validate product hypotheses and market fit
   - Test assumptions about user needs and solutions
   - Assess technical and business feasibility
   - Identify risks and mitigation strategies

2. **Market Opportunity Research**
   - Analyze market size and growth potential
   - Identify market segments and dynamics
   - Assess market entry strategies
   - Evaluate timing and market readiness

3. **User & Customer Research**
   - Deep dive into user personas and behaviors
   - Understand jobs-to-be-done and pain points
   - Map customer journeys and touchpoints
   - Analyze willingness to pay and value perception

4. **Competitive Intelligence Research**
   - Detailed competitor analysis and positioning
   - Feature and capability comparisons
   - Business model and strategy analysis
   - Identify competitive advantages and gaps

5. **Technology & Innovation Research**
   - Assess technology trends and possibilities
   - Evaluate technical approaches and architectures
   - Identify emerging technologies and disruptions
   - Analyze build vs. buy vs. partner options

6. **Industry & Ecosystem Research**
   - Map industry value chains and dynamics
   - Identify key players and relationships
   - Analyze regulatory and compliance factors
   - Understand partnership opportunities

7. **Strategic Options Research**
   - Evaluate different strategic directions
   - Assess business model alternatives
   - Analyze go-to-market strategies
   - Consider expansion and scaling paths

8. **Risk & Feasibility Research**
   - Identify and assess various risk factors
   - Evaluate implementation challenges
   - Analyze resource requirements
   - Consider regulatory and legal implications

9. **Custom Research Focus**
   - User-defined research objectives
   - Specialized domain investigation
   - Cross-functional research needs

---

**End of Analysis**

**Analysis Statistics**:
- **Total Sections**: 16
- **Word Count**: ~18,000 words
- **Analysis Depth**: Comprehensive
- **Code Examples**: 15+ blocks
- **Use Case Examples**: 6 detailed scenarios

**Document Metadata**:
- **Task Analyzed**: `create-deep-research-prompt`
- **Primary Agent**: Analyst (Mary)
- **Task Complexity**: Medium (Interactive Facilitation)
- **Analysis Date**: 2025-10-14
- **Analyzer**: Claude Code (AI Agent)
- **Version**: 1.0
