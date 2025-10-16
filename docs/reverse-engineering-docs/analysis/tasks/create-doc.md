# Task Analysis: create-doc

**Task ID**: `create-doc`
**Task File**: `.bmad-core/tasks/create-doc.md`
**Primary Agents**: Analyst (Mary), PM (John), UX Expert (Sally), Architect (Winston)
**Task Type**: Universal Template Processing Engine
**Version Analyzed**: BMad Core v4

---

## 1. Purpose & Scope

### Overview
The `create-doc` task is the **universal document creation engine** in the BMad framework. It processes YAML-based template files to generate comprehensive project documents through structured, section-by-section workflows with advanced elicitation capabilities. This task is the foundational mechanism used by planning-phase agents (Analyst, PM, UX Expert, Architect) to create all major planning artifacts.

### Key Characteristics
- **Template-driven architecture** - All document structure defined in YAML templates
- **Section-by-section processing** - Sequential workflow with elicitation checkpoints
- **Advanced elicitation integration** - Mandatory 1-9 option format with 26 elicitation methods
- **Agent permission system** - Section ownership and editing rights enforcement
- **Dual mode operation** - Interactive (default) and YOLO (fast-track) modes
- **Configuration-driven behavior** - Template discovery and output paths from configuration
- **Conditional sections** - Dynamic section inclusion based on project context
- **Repeatable sections** - Template-driven generation of epic/story lists

### Design Philosophy
**"Transform YAML templates into comprehensive documents through guided conversation"**

The task embodies the principle that **structured templates + human interaction = high-quality artifacts**. It ensures:
1. No important sections are forgotten
2. User expertise is captured through targeted elicitation
3. Documents follow consistent structure and quality standards
4. Agent workflows remain consistent across document types
5. Template updates automatically improve all document creation

### Scope
This task encompasses:
- YAML template parsing and validation
- Section-by-section content generation with agent guidance
- Interactive elicitation with 26+ advanced methods
- Agent permission enforcement (owner/editors/readonly)
- Conditional section evaluation
- Repeatable section expansion (epics, stories)
- Document assembly and markdown generation
- Output file creation with proper naming conventions

### Used By Agents
- **Analyst (Mary)**: Project briefs, research reports, competitive analysis, brainstorming outputs
- **PM (John)**: PRDs (greenfield & brownfield), market research
- **UX Expert (Sally)**: Front-end specifications, UI design docs
- **Architect (Winston)**: Architecture documents (fullstack, backend, frontend, brownfield)
- **SM (Bob)**: Story documents (via story-tmpl.yaml)
- **QA (Quinn)**: QA gate reports (via qa-gate-tmpl.yaml)

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - template_file: 'path/to/template.yaml'  # YAML template to process
  OR
  - template_selection: true  # Triggers template discovery mode

optional:
  - mode: 'interactive' | 'yolo'  # Elicitation style (default: interactive)
  - output_override: 'custom/path/output.md'  # Override template's default output path
  - context_data: {...}  # Pre-populated data for template variables
```

### Input Sources
- **template_file**: Directly specified by agent or user
- **template_selection**: User chooses from available templates in `.bmad-core/templates/`
- **mode**: User preference or agent default
- **output_override**: Rarely used, typically template defines output path
- **context_data**: From previous documents or user input during workflow

### Template Discovery
If no template is provided, the task lists all available templates:

```bash
Available templates in .bmad-core/templates/:
1. project-brief-tmpl.yaml - Project Brief Document
2. prd-tmpl.yaml - Product Requirements Document
3. architecture-tmpl.yaml - System Architecture Document
4. front-end-spec-tmpl.yaml - Front-End Specification
5. story-tmpl.yaml - User Story Document
...
```

User selects by number or filename.

### Template Structure Requirements

A valid YAML template MUST contain:

```yaml
template:
  id: 'unique-template-id'
  name: 'Human Readable Name'
  version: '1.0'
  output:
    format: 'markdown'  # Currently only markdown supported
    filename: 'docs/output.md'  # Can include {{variables}}
    title: 'Document Title'

workflow:
  mode: 'interactive' | 'yolo'
  elicitation: 'advanced-elicitation'  # Elicitation method to use

sections:
  - id: 'section-identifier'
    title: 'Section Title'
    instruction: 'Instructions for agent to populate this section'
    # ... additional section properties
```

### Configuration Dependencies

The task uses these configuration sources:

**From `core-config.yaml`** (if present):
```yaml
customTechnicalDocuments:  # Additional template locations
  - path/to/custom/templates/
```

**From templates** (internal):
```yaml
template.output.filename  # Output file path (relative to project root)
workflow.mode  # Default interaction mode
workflow.elicitation  # Elicitation strategy
```

### Document Dependencies

The task may reference existing documents during section population:

**Common Dependencies**:
- **Project Brief** → Referenced when creating PRD (to extract goals, constraints)
- **PRD** → Referenced when creating Architecture (to understand requirements)
- **Architecture** → Referenced when creating Stories (to extract technical context)
- **Previous Document Version** → When updating existing documents

**Elicitation Methods Data**:
- Location: `.bmad-core/data/elicitation-methods.md`
- Contains: 26 advanced elicitation techniques
- Used: When `elicit: true` for section options 2-9

---

## 3. Execution Flow

The `create-doc` task follows a **sequential section-by-section workflow**. Each section is processed in order as defined in the template.

### Phase 0: Template Loading and Initialization

**Purpose**: Load and validate the template, configure workflow settings.

**Actions**:
1. **Load Template File**:
   ```python
   template_path = get_template_path(template_name)
   with open(template_path, 'r') as f:
       template = yaml.safe_load(f)
   ```

2. **Validate Template Structure**:
   - Verify required fields: `template.id`, `template.output`, `sections[]`
   - Validate section structure: Each section has `id`, `title`, `instruction`
   - Check for circular dependencies in nested sections

3. **Extract Metadata**:
   ```python
   doc_title = template['template']['output']['title']
   output_filename = template['template']['output']['filename']
   workflow_mode = template['workflow']['mode']  # interactive or yolo
   ```

4. **Present Configuration to User**:
   ```
   Creating: Product Requirements Document (PRD)
   Template: prd-tmpl.yaml (v2.0)
   Output File: docs/prd.md
   Mode: Interactive (type #yolo to switch to fast mode)

   Confirm settings or provide changes:
   ```

5. **Wait for User Confirmation**:
   - User can confirm settings
   - User can type `#yolo` to switch to YOLO mode
   - User can override output filename
   - User can cancel operation

**Output**: Validated template structure and confirmed workflow settings

**Blocking Condition**: Invalid template structure or user cancellation stops execution

---

### Phase 1: Section-by-Section Processing

**Purpose**: Iterate through template sections, generating content for each with appropriate user interaction.

#### 1.1 Section Iteration Loop

```python
for section in template['sections']:
    # Check conditions
    if section.get('condition'):
        if not evaluate_condition(section['condition'], context):
            continue  # Skip this section

    # Process section
    process_section(section, context, mode)

    # Handle repeatable sections
    if section.get('repeatable') == True:
        while user_wants_more:
            process_section(section, context, mode)
```

#### 1.2 Section Processing Steps

For each section, the following steps occur:

**Step 1: Check Agent Permissions**

```python
owner = section.get('owner')  # e.g., 'scrum-master'
editors = section.get('editors', [])  # e.g., ['scrum-master', 'dev-agent']
readonly = section.get('readonly', False)

current_agent = get_current_agent()

if owner and current_agent != owner:
    print(f"NOTE: This section is owned by {owner}")
    if current_agent not in editors:
        print(f"WARNING: You ({current_agent}) cannot edit this section")
        # May skip or mark as placeholder depending on context
```

**Step 2: Display Section Context**

```
## Processing Section: Requirements

Instruction:
Draft the list of functional and non functional requirements under
the two child sections

This section will be processed with mandatory elicitation.
```

**Step 3: Generate Section Content**

```python
# Agent uses instruction to draft content
instruction = section['instruction']
section_type = section.get('type', 'text')  # text, list, table, choice, etc.

if section_type == 'bullet-list':
    content = generate_bullet_list(instruction, context)
elif section_type == 'numbered-list':
    content = generate_numbered_list(instruction, context,
                                      prefix=section.get('prefix'))
elif section_type == 'table':
    content = generate_table(instruction, context,
                             columns=section.get('columns'))
elif section_type == 'template-text':
    template_text = section.get('template')
    content = populate_template(template_text, context)
else:  # default text/paragraphs
    content = generate_text(instruction, context)
```

**Step 4: Present Content with Detailed Rationale**

```
### Functional Requirements

1. FR1: Users must be able to create, edit, and delete todo items
2. FR2: Each todo must support title, description, due date, priority
3. FR3: Users can mark todos as complete/incomplete
4. FR4: AI detects duplicate todos with different wording and warns user
5. FR5: Users can organize todos into categories/projects

### Non-Functional Requirements

1. NFR1: System must support 100+ concurrent users
2. NFR2: Page load time under 2 seconds
3. NFR3: AWS free-tier compliance where feasible
4. NFR4: Mobile-responsive design

---

**Rationale:**

Trade-offs and Decisions:
- Prioritized simplicity (categories only, no tags) to reduce MVP scope
- AI duplicate detection (FR4) is a key differentiator but adds complexity
- Free-tier requirement (NFR3) constrains architecture choices significantly

Key Assumptions:
- Users primarily access via web browser (mobile-responsive, not native apps)
- Single-user system initially (no sharing/collaboration in MVP)
- AWS chosen as deployment target based on technical preferences

Questionable Decisions Needing Validation:
- Is "100+ concurrent users" realistic for MVP scope?
- Should we include tag support alongside categories?
- AI duplicate detection may be technically challenging - MVP-critical?
```

**Step 5: Handle Elicitation (if `elicit: true`)**

```python
if section.get('elicit') == True:
    if mode == 'interactive':
        # MANDATORY 1-9 FORMAT
        present_elicitation_options(section, content)
        wait_for_user_response()
    else:  # yolo mode
        # Skip elicitation, accept drafted content as-is
        pass
```

**Detailed Elicitation Flow** (see Section 4 for full details):

```
Select an option (1-9) or type your question/feedback:

1. Proceed to next section
2. Expand or Contract for Audience
3. Explain Reasoning (CoT Step-by-Step)
4. Critique and Refine
5. Analyze Logical Flow and Dependencies
6. Assess Alignment with Overall Goals
7. Identify Potential Risks and Unforeseen Issues
8. Challenge from Critical Perspective
9. Tree of Thoughts Deep Dive

Select 1-9 or just type your question/feedback:
```

**User Response Handling**:
- **Option 1**: Accept content, move to next section
- **Options 2-9**: Execute selected elicitation method, return results, repeat menu
- **Free text**: Process as question/feedback, update content, repeat menu

**Step 6: Process Nested Sections (if present)**

```python
if section.get('sections'):  # Nested subsections
    for subsection in section['sections']:
        process_section(subsection, context, mode)  # Recursive
```

**Step 7: Save Content to Document**

```python
# Append section to accumulating document
document_content += format_section(section, content)

# Optionally write partial file (for long documents)
if section.get('checkpoint'):
    write_partial_document(output_filename, document_content)
```

#### 1.3 Special Section Types

**Conditional Sections**:
```yaml
- id: ui-goals
  title: User Interface Design Goals
  condition: 'PRD has UX/UI requirements'  # Natural language condition
  instruction: ...
```

The agent evaluates the condition based on document context:
```python
def evaluate_condition(condition_text, context):
    # Ask agent: "Does this document have UX/UI requirements?"
    # Agent answers based on previous sections
    return boolean_result
```

**Repeatable Sections**:
```yaml
- id: epic-details
  title: 'Epic {{epic_number}} {{epic_title}}'
  repeatable: true
  instruction: ...
```

Processing:
```python
epic_count = 0
while True:
    epic_count += 1
    context['epic_number'] = epic_count
    process_section(section, context, mode)

    if not user_wants_another_epic():
        break
```

**Sections with Choices**:
```yaml
- id: accessibility
  title: Accessibility
  type: choice
  choices: ['None', 'WCAG AA', 'WCAG AAA']
  instruction: Select accessibility compliance level
```

Agent presents options:
```
### Accessibility Level

Select one:
1. None (no specific accessibility requirements)
2. WCAG AA (standard compliance)
3. WCAG AAA (enhanced compliance)

Recommended: WCAG AA for public-facing applications
```

---

### Phase 2: Document Finalization

**Purpose**: Assemble the complete document and write to file.

**Actions**:

1. **Assemble Complete Document**:
   ```python
   final_document = format_markdown_document(
       title=template['template']['output']['title'],
       sections=processed_sections,
       metadata=template['template']
   )
   ```

2. **Apply Markdown Formatting**:
   - Add front matter (title, metadata)
   - Format headings (H1 for title, H2 for main sections, H3+ for subsections)
   - Format lists, tables, code blocks per section type
   - Add table of contents (if template specifies)

3. **Write Output File**:
   ```python
   output_path = resolve_output_path(
       template['template']['output']['filename'],
       context
   )
   create_directory_if_needed(os.path.dirname(output_path))
   with open(output_path, 'w') as f:
       f.write(final_document)
   ```

4. **Confirm Completion**:
   ```
   ✓ Document created successfully

   File: docs/prd.md
   Sections: 8 main sections, 47 subsections
   Size: 12,543 characters

   Next Steps:
   - Review document for completeness
   - Share with stakeholders for feedback
   - Proceed to architecture phase
   ```

**Output**: Complete markdown document written to specified output path

---

### Phase 3: Post-Processing (Optional)

**Purpose**: Execute post-creation tasks defined in template.

**Optional Actions**:

1. **Run Validation Checklist**:
   ```yaml
   # In template
   - id: checklist-results
     title: Checklist Results Report
     instruction: Execute pm-checklist and populate results
   ```

2. **Generate Next-Step Prompts**:
   ```yaml
   - id: next-steps
     sections:
       - id: architect-prompt
         instruction: Generate handoff prompt for Architect agent
   ```

3. **Create Index Files** (for sharded documents):
   ```python
   if template.get('create_index'):
       create_index_file(output_location, sections)
   ```

**Output**: Supplementary artifacts (checklists, prompts, indexes)

---

## 4. Decision Points & Branching Logic

### 4.1 Template Discovery Decision

**Trigger**: Task invoked without template parameter

**Decision Tree**:
```
IF template_file provided:
    Load template_file
ELSE:
    List all templates in .bmad-core/templates/
    PROMPT: "Select template by number or filename:"
    WAIT for user selection
    Load selected template
```

### 4.2 Mode Selection Decision

**Trigger**: Template loaded, workflow configuration

**Decision Tree**:
```
mode = template['workflow']['mode']  # Default from template

DISPLAY: "Mode: {mode} (type #yolo to toggle)"

IF user types '#yolo':
    IF mode == 'interactive':
        mode = 'yolo'
        NOTIFY: "Switched to YOLO mode - will process all sections without elicitation"
    ELSE:
        mode = 'interactive'
        NOTIFY: "Switched to Interactive mode - will prompt for feedback"
```

### 4.3 Conditional Section Evaluation

**Trigger**: Section with `condition` field

**Decision Logic**:
```python
condition_text = section['condition']
# Example: "PRD has UX/UI requirements"

# Agent evaluates based on context
evaluation_result = agent_evaluate_condition(
    condition=condition_text,
    previous_sections=document_context,
    project_type=project_type
)

if evaluation_result == True:
    process_section(section)
else:
    skip_section(section)
    log(f"Skipped section '{section['title']}' - condition not met")
```

**Common Conditions**:
- "PRD has UX/UI requirements" → Skip UI sections for backend-only projects
- "Project is greenfield" → Include setup sections, skip brownfield analysis
- "Architecture is monolithic" → Skip microservices sections
- "Project uses frontend framework" → Include frontend architecture sections

### 4.4 Agent Permission Decision

**Trigger**: Section with `owner` or `editors` fields

**Decision Logic**:
```python
section_owner = section.get('owner')  # e.g., 'dev-agent'
section_editors = section.get('editors', [])  # e.g., ['dev-agent', 'qa-agent']
readonly = section.get('readonly', False)

current_agent = get_current_agent_role()  # e.g., 'scrum-master'

# Ownership check
if section_owner and current_agent != section_owner:
    print(f"NOTE: This section is owned by {section_owner}")

    # Editor check
    if current_agent not in section_editors:
        if readonly:
            print(f"This section is READ-ONLY. You cannot edit it.")
            # Display existing content only, skip processing
            return display_existing_content(section)
        else:
            print(f"WARNING: You are not listed as an editor for this section.")
            print(f"Authorized editors: {', '.join(section_editors)}")

            PROMPT: "Proceed anyway? (yes/no/placeholder)"

            IF user == 'no':
                skip_section(section)
            ELIF user == 'placeholder':
                insert_placeholder(section, owner=section_owner)
            ELSE:  # yes
                print("Proceeding - but note permission constraints in comments")
                process_section_with_warning(section)
```

**Agent Roles**:
- `analyst` - Analyst (Mary)
- `pm-agent` - PM (John)
- `ux-expert` - UX Expert (Sally)
- `architect` - Architect (Winston)
- `scrum-master` - SM (Bob)
- `dev-agent` - Dev (James)
- `qa-agent` - QA (Quinn)

### 4.5 Elicitation Trigger Decision

**Trigger**: Section with `elicit: true`

**Decision Logic**:
```python
if section.get('elicit') == True:
    if mode == 'yolo':
        print("(Elicitation skipped in YOLO mode)")
        accept_content_as_is()
        proceed_to_next_section()
    else:  # interactive mode
        # MANDATORY ELICITATION WORKFLOW
        present_content_with_rationale()
        present_elicitation_options()

        while True:
            user_input = wait_for_user_input()

            if user_input == '1':
                # Proceed to next section
                break
            elif user_input in ['2', '3', '4', '5', '6', '7', '8', '9']:
                # Execute elicitation method
                execute_elicitation_method(user_input)
                present_results()
                present_post_elicitation_options()
            else:
                # Free text feedback
                process_feedback(user_input)
                update_content()
                present_updated_content()
                present_elicitation_options()  # Loop continues
```

### 4.6 Repeatable Section Decision

**Trigger**: Section with `repeatable: true`

**Decision Logic**:
```python
if section.get('repeatable') == True:
    iteration = 0

    while True:
        iteration += 1

        # Update context with iteration variables
        context['epic_number'] = iteration  # or story_number, etc.

        # Process section with current context
        process_section(section, context, mode)

        # Check if user wants another iteration
        PROMPT: "Add another {section['title']}? (yes/no)"

        if user_response == 'no':
            break

        # Check for completion conditions
        if check_epic_completion_condition(context):
            NOTIFY: "All epics from PRD have been processed"
            break
```

**Common Repeatable Sections**:
- Epic details (from PRD template) - Repeat for each epic
- Story details (from epic template) - Repeat for each story
- Acceptance criteria (from story template) - Repeat for each criterion
- Change log entries - Repeat for each version

### 4.7 Post-Elicitation Options Decision

**Trigger**: Elicitation method (2-9) completed

**Decision Logic**:
```
DISPLAY results from elicitation method

PROMPT:
1. Apply changes and update section
2. Return to elicitation menu (try another method)
3. Ask questions or engage further with this elicitation

User selects option:

IF option == 1:
    update_section_content(elicitation_results)
    proceed_to_next_section()
ELIF option == 2:
    present_elicitation_options()  # Back to 1-9 menu
ELSE:  # option == 3
    continue_elicitation_conversation()
    # After conversation, return to post-elicitation options
```

---

## 5. User Interaction Points

### 5.1 Initial Configuration Interaction

**When**: After template loading, before processing starts

**Interaction Format**:
```
Creating: Product Requirements Document (PRD)
Template: prd-tmpl.yaml (v2.0)
Output File: docs/prd.md
Mode: Interactive

Type 'start' to begin, '#yolo' for fast mode, or provide custom output path:
```

**User Options**:
- Type `start` - Begin with default settings
- Type `#yolo` - Switch to YOLO mode
- Type custom path - Override output filename
- Type `cancel` - Abort document creation

### 5.2 Mandatory Elicitation Interaction (`elicit: true`)

**When**: Section marked with `elicit: true` in interactive mode

**Interaction Format**:
```
## Requirements

[Agent presents drafted content]

### Functional Requirements
1. FR1: ...
2. FR2: ...

### Non-Functional Requirements
1. NFR1: ...
2. NFR2: ...

---

**Rationale:**

Trade-offs: ...
Assumptions: ...
Questionable decisions: ...

---

Select an option (1-9) or type your question/feedback:

1. Proceed to next section
2. Expand or Contract for Audience
3. Explain Reasoning (CoT Step-by-Step)
4. Critique and Refine
5. Analyze Logical Flow and Dependencies
6. Assess Alignment with Overall Goals
7. Identify Potential Risks and Unforeseen Issues
8. Challenge from Critical Perspective
9. Tree of Thoughts Deep Dive

Select 1-9 or just type your question/feedback:
```

**User Options**:
- Type `1` - Accept content and proceed
- Type `2-9` - Execute specific elicitation method
- Type free text - Ask questions, provide feedback, request changes

**CRITICAL RULES**:
- **NEVER use yes/no questions** - Always use 1-9 format
- **NEVER create new elicitation methods** - Only use from `.bmad-core/data/elicitation-methods.md`
- **ALWAYS provide detailed rationale** - Explain trade-offs and assumptions
- **ALWAYS end with "Select 1-9 or just type your question/feedback:"**

### 5.3 Post-Elicitation Interaction

**When**: After executing elicitation method (options 2-9)

**Interaction Format**:
```
## Results from "Critique and Refine"

[Elicitation method results presented]

**Identified Issues:**
- Issue 1 with rationale
- Issue 2 with rationale

**Suggested Refinements:**
- Refinement 1
- Refinement 2

---

Choose next action:

1. Apply changes and update section
2. Return to elicitation menu (try another method)
3. Ask questions or engage further with this elicitation

Select 1-3:
```

**User Options**:
- Type `1` - Apply suggested changes, proceed to next section
- Type `2` - Return to main 1-9 elicitation menu
- Type `3` - Continue conversation about elicitation results

### 5.4 Free-Text Feedback Interaction

**When**: User types free text instead of selecting 1-9

**Processing Flow**:
```python
user_feedback = get_user_input()

if user_feedback.isdigit() and 1 <= int(user_feedback) <= 9:
    # Handle numbered option
    execute_option(int(user_feedback))
else:
    # Handle free text
    print("Processing your feedback...")

    # Agent interprets feedback and updates content
    updated_content = process_feedback(
        original_content=section_content,
        user_feedback=user_feedback,
        section_context=section
    )

    # Present updated content
    print("\n## Updated Content\n")
    print(updated_content)
    print("\n---\n")

    # Return to elicitation menu
    present_elicitation_options()
```

**Example**:
```
User: "Can we add a requirement about GDPR compliance?"

Agent: "Processing your feedback..."

## Updated Content

### Non-Functional Requirements
1. NFR1: System must support 100+ concurrent users
2. NFR2: Page load time under 2 seconds
3. NFR3: AWS free-tier compliance where feasible
4. NFR4: Mobile-responsive design
5. NFR5: GDPR compliance for EU user data (consent, right to deletion, data portability)

[Returns to 1-9 elicitation menu]
```

### 5.5 Repeatable Section Interaction

**When**: Section with `repeatable: true`

**Interaction Format**:
```
## Epic 1: Foundation & Core Infrastructure

[Section content presented and processed]

---

Add another epic? (yes/no):
```

**User Options**:
- Type `yes` or `y` - Process another instance of the repeatable section
- Type `no` or `n` - Complete this section, move to next

### 5.6 Conditional Section Interaction (Optional)

**When**: Section with ambiguous condition

**Interaction Format**:
```
The template includes a section "User Interface Design Goals" with condition:
"PRD has UX/UI requirements"

Based on the requirements drafted so far, this appears to be a backend API project.

Should we include the UI Design Goals section? (yes/no):
```

**User Options**:
- Type `yes` - Include the conditional section
- Type `no` - Skip the conditional section
- Type `?` - Get more information about the section

### 5.7 Agent Permission Override Interaction

**When**: Current agent is not owner/editor of section

**Interaction Format**:
```
## Dev Agent Record

NOTE: This section is owned by 'dev-agent'
WARNING: You (scrum-master) are not listed as an editor for this section.
Authorized editors: dev-agent

This section should be populated by the Development Agent during implementation.

Options:
1. Skip this section (leave empty for dev-agent to populate)
2. Insert placeholder text with note for dev-agent
3. Proceed anyway (document will note permission violation)

Select 1-3:
```

**User Options**:
- Type `1` - Skip section entirely
- Type `2` - Insert placeholder like: "_[To be populated by dev-agent during implementation]_"
- Type `3` - Proceed with population (not recommended, but allowed)

### 5.8 YOLO Mode Toggle Interaction

**When**: User types `#yolo` during any interaction

**Effect**:
```
User: #yolo

Agent: "Switched to YOLO mode. Processing all remaining sections without elicitation..."

[Agent processes all remaining sections rapidly, presenting only final results]
```

**Reverse Toggle**:
```
User: #yolo

Agent: "Switched to Interactive mode. Elicitation enabled for remaining sections."
```

---

## 6. Output Specifications

### 6.1 Primary Output: Markdown Document

**Format**: GitHub-flavored Markdown
**Location**: Specified in `template.output.filename` (can include variables)
**Naming Convention**: Template-specific

**Common Patterns**:
```yaml
# Fixed filename
filename: 'docs/prd.md'

# Variable-based filename
filename: 'docs/stories/{{epic_num}}.{{story_num}}.{{slug}}.md'

# Date-based filename
filename: 'docs/research/market-research-{{date}}.md'
```

**Variable Substitution**:
```python
output_filename = template['template']['output']['filename']

# Replace variables with context values
for var_name, var_value in context.items():
    output_filename = output_filename.replace(
        f"{{{{{var_name}}}}}",
        str(var_value)
    )

# Example:
# Template: "docs/stories/{{epic_num}}.{{story_num}}.auth.md"
# Context: {epic_num: 1, story_num: 2}
# Result: "docs/stories/1.2.auth.md"
```

### 6.2 Document Structure

**Front Matter** (optional, template-dependent):
```yaml
---
title: Product Requirements Document
template: prd-tmpl.yaml
version: 2.0
created: 2025-10-14
last_updated: 2025-10-14
status: draft
---
```

**Title Section**:
```markdown
# {{project_name}} Product Requirements Document (PRD)

**Version**: 1.0
**Date**: October 14, 2025
**Author**: PM Agent (John)
```

**Table of Contents** (auto-generated if template specifies):
```markdown
## Table of Contents

1. [Goals and Background Context](#goals-and-background-context)
2. [Requirements](#requirements)
   - [Functional](#functional)
   - [Non-Functional](#non-functional)
3. [User Interface Design Goals](#user-interface-design-goals)
...
```

**Section Content**:
```markdown
## Section Title

[Section content based on type]

### Subsection Title

[Subsection content]
```

**Section Type Formatting**:

**Text/Paragraphs**:
```markdown
## Background Context

This project addresses the need for improved task management
with AI-powered duplicate detection capabilities. Users currently
struggle with maintaining clean task lists...
```

**Bullet List**:
```markdown
## Goals

- Deliver AI-powered task management system
- Support 100+ concurrent users
- Maintain AWS free-tier compliance
- Launch MVP within 3 months
```

**Numbered List**:
```markdown
## Functional Requirements

1. FR1: Users must be able to create, edit, and delete todo items
2. FR2: Each todo must support title, description, due date, priority
3. FR3: Users can mark todos as complete/incomplete
```

**Numbered List with Prefix**:
```yaml
# In template
type: numbered-list
prefix: FR
```

```markdown
1. **FR1**: Users must be able to create, edit, and delete todo items
2. **FR2**: Each todo must support title, description, due date, priority
```

**Table**:
```yaml
# In template
type: table
columns: [Date, Version, Description, Author]
```

```markdown
## Change Log

| Date       | Version | Description           | Author    |
|------------|---------|----------------------|-----------|
| 2025-10-14 | 1.0     | Initial draft        | PM Agent  |
| 2025-10-15 | 1.1     | Added NFR5 for GDPR  | PM Agent  |
```

**Choice**:
```yaml
# In template
type: choice
choices: [Draft, Approved, InProgress, Review, Done]
```

```markdown
## Status

**Current Status**: Draft
```

**Template Text**:
```yaml
# In template
type: template-text
template: |
  **As a** {{role}},
  **I want** {{action}},
  **so that** {{benefit}}
```

```markdown
## Story

**As a** registered user,
**I want** to mark tasks as complete,
**so that** I can track my progress
```

### 6.3 Agent Permission Annotations

Sections with agent permissions include annotations:

```markdown
## Dev Agent Record

_This section is owned by dev-agent and can only be modified by dev-agent._

[Section content]
```

Or for multi-editor sections:
```markdown
## Change Log

_This section is owned by scrum-master. Editors: scrum-master, dev-agent, qa-agent._

| Date       | Version | Description | Author |
|------------|---------|-------------|--------|
...
```

### 6.4 Placeholder Content

When sections are skipped due to agent permissions:

```markdown
## QA Results

_[To be populated by qa-agent during story review]_
```

### 6.5 Conditional Section Handling

If conditional section is not included:
- Section is completely omitted from output
- No placeholder or comment inserted
- Table of contents updated to exclude section

### 6.6 Nested Section Formatting

Nested sections use hierarchical heading levels:

```markdown
## Main Section (H2)

### Subsection Level 1 (H3)

#### Subsection Level 2 (H4)

##### Subsection Level 3 (H5)
```

Maximum depth: 5 levels (H1 reserved for document title)

### 6.7 Example Complete Output

**PRD Document** (simplified excerpt):

```markdown
# TaskMaster AI Product Requirements Document (PRD)

**Version**: 1.0
**Date**: October 14, 2025
**Author**: PM Agent (John)

---

## Goals and Background Context

### Goals

- Deliver AI-powered task management system
- Support 100+ concurrent users
- Maintain AWS free-tier compliance
- Launch MVP within 3 months

### Background Context

This project addresses the need for improved task management
with AI-powered duplicate detection capabilities...

### Change Log

| Date       | Version | Description      | Author   |
|------------|---------|------------------|----------|
| 2025-10-14 | 1.0     | Initial draft    | PM Agent |

---

## Requirements

### Functional

1. **FR1**: Users must be able to create, edit, and delete todo items
2. **FR2**: Each todo must support title, description, due date, priority
3. **FR3**: Users can mark todos as complete/incomplete
4. **FR4**: AI detects duplicate todos with different wording and warns user
5. **FR5**: Users can organize todos into categories/projects

### Non-Functional

1. **NFR1**: System must support 100+ concurrent users
2. **NFR2**: Page load time under 2 seconds
3. **NFR3**: AWS free-tier compliance where feasible
4. **NFR4**: Mobile-responsive design
5. **NFR5**: GDPR compliance for EU user data

---

## Epic List

1. **Epic 1: Foundation & Core Infrastructure** - Establish project setup, authentication, and basic user management
2. **Epic 2: Task Management Core** - Implement CRUD operations for tasks with categories
3. **Epic 3: AI Duplicate Detection** - Integrate AI service for duplicate detection
4. **Epic 4: User Experience Polish** - Mobile optimization and UX improvements

---

## Epic 1: Foundation & Core Infrastructure

Establish the foundational infrastructure including project setup, authentication
system, and basic user management capabilities.

### Story 1.1: Project Setup and Health Check

**As a** DevOps engineer,
**I want** a fully configured project with CI/CD pipeline,
**so that** the team can begin development with proper infrastructure

#### Acceptance Criteria

1. Project repository created with proper structure
2. CI/CD pipeline configured and operational
3. Health check endpoint returns 200 OK
4. Deployment to staging environment successful

[... additional stories ...]

---

## Next Steps

### Architect Prompt

"Please review this PRD and create a system architecture document that addresses
all functional and non-functional requirements, with particular attention to
the AWS free-tier constraint and AI integration for duplicate detection."
```

---

## 7. Error Handling & Validation

### 7.1 Template Validation Errors

**Missing Required Fields**:
```python
if 'template' not in yaml_content:
    raise TemplateError("Missing required 'template' root key")

if 'output' not in yaml_content['template']:
    raise TemplateError("Missing required 'template.output' configuration")

if 'sections' not in yaml_content:
    raise TemplateError("Missing required 'sections' array")
```

**Error Message to User**:
```
❌ Template Validation Error

File: prd-tmpl.yaml
Issue: Missing required 'template.output' configuration

A valid template must include:
- template.id
- template.name
- template.output.filename
- sections[]

Please fix the template and try again.
```

**Invalid Section Structure**:
```python
for section in yaml_content['sections']:
    if 'id' not in section:
        raise TemplateError(f"Section missing required 'id' field")
    if 'title' not in section:
        raise TemplateError(f"Section '{section['id']}' missing 'title'")
```

### 7.2 File System Errors

**Output Directory Missing**:
```python
output_path = resolve_output_path(template['output']['filename'])
output_dir = os.path.dirname(output_path)

if not os.path.exists(output_dir):
    print(f"Creating directory: {output_dir}")
    try:
        os.makedirs(output_dir, exist_ok=True)
    except OSError as e:
        raise FileSystemError(f"Cannot create directory '{output_dir}': {e}")
```

**Output File Already Exists**:
```python
if os.path.exists(output_path):
    PROMPT: f"File '{output_path}' already exists. Overwrite? (yes/no/rename)"

    IF user == 'no':
        ABORT: "Document creation cancelled"
    ELIF user == 'rename':
        PROMPT: "Enter new filename:"
        output_path = get_user_filename()
    ELSE:  # yes
        print(f"Overwriting existing file: {output_path}")
```

**Write Permission Error**:
```python
try:
    with open(output_path, 'w') as f:
        f.write(document_content)
except PermissionError:
    raise FileSystemError(
        f"Permission denied: Cannot write to '{output_path}'\n"
        f"Check file permissions and try again."
    )
```

### 7.3 Template Dependency Errors

**Missing Referenced Template**:
```yaml
# In template
sections:
  - id: story
    template: '{{story_template}}'
```

```python
template_ref = section.get('template')
if template_ref and not resolve_template_variables(template_ref, context):
    print(f"⚠️  Warning: Template reference incomplete: {template_ref}")
    PROMPT: "Provide value for missing template variable or skip section? (provide/skip)"
```

**Missing Elicitation Methods File**:
```python
elicitation_file = '.bmad-core/data/elicitation-methods.md'
if not os.path.exists(elicitation_file):
    print(f"⚠️  Warning: Elicitation methods file not found: {elicitation_file}")
    print("Elicitation options 2-9 will be unavailable")
    print("Only 'Option 1: Proceed' will be available")
```

### 7.4 Conditional Section Evaluation Errors

**Ambiguous Condition**:
```python
condition = section['condition']  # "PRD has UX/UI requirements"

try:
    result = evaluate_condition(condition, context)
except AmbiguousConditionError:
    # Condition cannot be automatically evaluated
    PROMPT: f"Include section '{section['title']}'? (yes/no)"
    result = (user_response == 'yes')
```

### 7.5 Repeatable Section Errors

**Infinite Loop Protection**:
```python
MAX_ITERATIONS = 100

iteration = 0
while section.get('repeatable'):
    iteration += 1

    if iteration > MAX_ITERATIONS:
        print(f"⚠️  Warning: Maximum iterations ({MAX_ITERATIONS}) reached")
        PROMPT: "Continue anyway? (yes/no)"
        if user_response != 'yes':
            break

    process_section(section, context)

    if not user_wants_another():
        break
```

### 7.6 Agent Permission Violations

**Unauthorized Edit Attempt**:
```python
if section.get('owner') and current_agent != section['owner']:
    if current_agent not in section.get('editors', []):
        print(f"⚠️  Permission Warning:")
        print(f"   Section: {section['title']}")
        print(f"   Owner: {section['owner']}")
        print(f"   Your role: {current_agent}")

        PROMPT: "Proceed with restricted edit? (yes/no)"

        if user_response != 'yes':
            # Insert placeholder
            insert_permission_placeholder(section)
            continue
```

**Readonly Section Modification**:
```python
if section.get('readonly') and current_agent not in section.get('editors', []):
    print(f"❌ Error: Section '{section['title']}' is readonly")
    print(f"   Only these agents can edit: {section.get('editors', [])}")
    print(f"   Your role: {current_agent}")

    # Skip section, display existing content
    display_readonly_section(section)
    continue
```

### 7.7 User Input Validation

**Invalid Elicitation Option**:
```python
user_input = get_user_input()

if user_input.isdigit():
    option = int(user_input)
    if option < 1 or option > 9:
        print(f"❌ Invalid option: {option}")
        print("Please select 1-9 or type your feedback")
        continue  # Re-prompt
```

**Empty Required Section**:
```python
if section.get('required') and not section_content.strip():
    print(f"⚠️  Warning: Section '{section['title']}' is required but empty")
    PROMPT: "Leave empty anyway? (yes/no)"

    if user_response == 'no':
        # Return to section processing
        process_section(section, context)
```

### 7.8 YAML Parsing Errors

**Malformed YAML**:
```python
try:
    template = yaml.safe_load(template_content)
except yaml.YAMLError as e:
    raise TemplateError(
        f"YAML parsing error in template file:\n"
        f"  File: {template_file}\n"
        f"  Error: {str(e)}\n"
        f"  Line: {e.problem_mark.line if hasattr(e, 'problem_mark') else 'unknown'}"
    )
```

**Example Error Output**:
```
❌ Template Parsing Error

File: prd-tmpl.yaml
Line: 42
Error: mapping values are not allowed here

Please check YAML syntax and try again.
```

### 7.9 Context Variable Errors

**Missing Required Variable**:
```python
required_vars = extract_template_variables(section['template'])

for var in required_vars:
    if var not in context:
        print(f"⚠️  Missing required variable: {var}")
        PROMPT: f"Provide value for '{var}':"
        context[var] = get_user_input()
```

### 7.10 Recovery Strategies

**Checkpoint and Recovery**:
```python
# Save progress at major section boundaries
checkpoint_sections = ['requirements', 'epic-details', 'technical-assumptions']

if section['id'] in checkpoint_sections:
    save_checkpoint(document_content, context)
```

**Resume from Failure**:
```
Document creation interrupted.

Checkpoint found: docs/.checkpoint/prd-20251014-153022.json
Completed sections: Goals, Background, Requirements
Last section: Epic List (in progress)

Resume from checkpoint? (yes/no):
```

---

## 8. Dependencies & Prerequisites

### 8.1 File System Dependencies

**Required Directories**:
```
.bmad-core/
├── tasks/
│   └── create-doc.md          # This task file
├── templates/                  # Template files
│   ├── prd-tmpl.yaml
│   ├── architecture-tmpl.yaml
│   └── ...
└── data/
    └── elicitation-methods.md  # Elicitation method definitions
```

**Required Files**:
- `.bmad-core/tasks/create-doc.md` - This task definition
- Template file (specified by user or agent)
- `.bmad-core/data/elicitation-methods.md` - Elicitation methods (optional but recommended)

**Optional Files**:
- `.bmad-core/core-config.yaml` - Configuration (for path customization)
- Previous document versions (for updates)
- Referenced documents (Project Brief, etc.)

### 8.2 Template File Dependencies

**Template Structure Requirements**:
```yaml
# Minimum required structure
template:
  id: string          # REQUIRED
  name: string        # REQUIRED
  version: string     # REQUIRED
  output:
    format: string    # REQUIRED (typically 'markdown')
    filename: string  # REQUIRED (output path with optional variables)
    title: string     # REQUIRED (document title)

workflow:
  mode: string        # OPTIONAL (default: 'interactive')
  elicitation: string # OPTIONAL (elicitation strategy)

sections:              # REQUIRED (array of section objects)
  - id: string        # REQUIRED
    title: string     # REQUIRED
    instruction: string # REQUIRED
    # ... additional fields
```

**Cross-Template Dependencies**:
```yaml
# PRD template may reference Project Brief
sections:
  - id: goals
    instruction: |
      If Project Brief exists, review and extract goals.
      Otherwise, elicit goals from user.
```

### 8.3 Data File Dependencies

**Elicitation Methods** (`.bmad-core/data/elicitation-methods.md`):

Required for options 2-9 in elicitation menu. Contains:
- Core Reflective Methods (3 methods)
- Structural Analysis Methods (2 methods)
- Risk and Challenge Methods (2 methods)
- Creative Exploration Methods (2 methods)
- Multi-Persona Collaboration Methods (3 methods)
- Advanced 2025 Techniques (4 methods)
- Game-Based Elicitation Methods (3 methods)

Total: 26+ distinct elicitation methods

**Content Structure**:
```markdown
## Method Category

**Method Name**

- Method description
- When to use
- How it works
- Expected output format
```

**Technical Preferences** (`.bmad-core/data/technical-preferences.md`):

Optional. Used by some templates to pre-populate technical sections:
```yaml
languages: [TypeScript, Python]
frameworks: [React, FastAPI]
deployment: AWS
repository: monorepo
testing: unit + integration + e2e
```

### 8.4 Agent Configuration Dependencies

**Agent Role Identification**:

The task needs to know which agent is executing it for permission checks:

```python
# Typically provided by agent execution context
current_agent = get_current_agent_role()

# Agent role identifiers:
agent_roles = [
    'analyst',      # Analyst (Mary)
    'pm-agent',     # PM (John)
    'ux-expert',    # UX Expert (Sally)
    'architect',    # Architect (Winston)
    'scrum-master', # SM (Bob)
    'dev-agent',    # Dev (James)
    'qa-agent'      # QA (Quinn)
]
```

**Agent Context**:
- Current agent role/name
- Agent capabilities
- Agent access permissions
- Session context

### 8.5 Configuration Dependencies

**From `core-config.yaml`** (optional):

```yaml
# Custom template locations
customTemplateDirectories:
  - path/to/custom/templates/

# Custom output locations
customDocumentLocations:
  prd: custom/path/to/prd/
  architecture: custom/path/to/arch/

# Workflow preferences
workflowDefaults:
  mode: interactive  # or yolo
  autoSave: true
  checkpointInterval: 5  # sections
```

### 8.6 Runtime Dependencies

**Python/System Requirements**:
- YAML parsing library (`pyyaml` or equivalent)
- Markdown generation utilities
- File system access (read/write)
- String templating engine (for variable substitution)

**AI Agent Requirements**:
- Natural language understanding (for condition evaluation)
- Content generation capabilities
- Conversation management
- Context window sufficient for template + content

### 8.7 Dependency Chain Example

**Creating a PRD**:

```
User invokes: "Create PRD"
    ↓
Agent selects: create-doc task
    ↓
Task loads: .bmad-core/templates/prd-tmpl.yaml
    ↓
Template references: .bmad-core/data/elicitation-methods.md
    ↓
Section instruction: "If Project Brief exists, review it"
    ↓
Task checks: docs/project-brief.md (optional)
    ↓
User interaction: Elicitation with method selection
    ↓
Output generated: docs/prd.md
```

**Dependency Graph**:
```
create-doc.md (task)
├── prd-tmpl.yaml (template)
│   ├── elicitation-methods.md (data)
│   └── project-brief.md (optional reference)
├── core-config.yaml (optional config)
└── Current agent context (runtime)
```

### 8.8 Missing Dependency Handling

**Template File Missing**:
```
❌ Error: Template not found

File: .bmad-core/templates/prd-tmpl.yaml

Available templates:
1. project-brief-tmpl.yaml
2. architecture-tmpl.yaml
3. story-tmpl.yaml

Select alternative template or cancel:
```

**Elicitation Methods Missing**:
```
⚠️  Warning: Elicitation methods file not found
    .bmad-core/data/elicitation-methods.md

Elicitation menu will offer only:
1. Proceed to next section

Advanced elicitation (options 2-9) unavailable.

Continue anyway? (yes/no):
```

**Referenced Document Missing**:
```
⚠️  Notice: Project Brief not found
    Expected: docs/project-brief.md

Recommendation: Create Project Brief first for better PRD quality.

Options:
1. Continue without Project Brief (will elicit goals manually)
2. Create Project Brief first (recommended)
3. Provide alternative Project Brief location

Select 1-3:
```

---

## 9. Integration Points

### 9.1 Agent Workflow Integration

**Analyst Agent (Mary)**:
```
User: "Create a project brief"
    ↓
Analyst activates
    ↓
Analyst invokes: create-doc task
    ↓
Analyst provides: template = 'project-brief-tmpl.yaml'
    ↓
Analyst guides: Section population with market research expertise
    ↓
Output: docs/project-brief.md
```

**PM Agent (John)**:
```
User: "Create PRD"
    ↓
PM activates
    ↓
PM invokes: create-doc task
    ↓
PM provides: template = 'prd-tmpl.yaml'
    ↓
PM checks: Project Brief exists? (reference it)
    ↓
PM guides: Section population with product strategy expertise
    ↓
PM executes: pm-checklist (post-creation validation)
    ↓
Output: docs/prd.md
```

**Architect (Winston)**:
```
User: "Create architecture document"
    ↓
Architect activates
    ↓
Architect invokes: create-doc task
    ↓
Architect provides: template = 'fullstack-architecture-tmpl.yaml'
    ↓
Architect references: PRD for requirements
    ↓
Architect guides: Technical decisions with system design expertise
    ↓
Output: docs/architecture.md (or sharded architecture)
```

### 9.2 Task-to-Task Integration

**create-doc → shard-doc**:
```
create-doc completes: docs/prd.md (monolithic)
    ↓
Agent checks: Document length > threshold?
    ↓
Agent invokes: shard-doc task
    ↓
shard-doc processes: prd.md → docs/prd/epic-*.md
    ↓
Updates: core-config.yaml (prdSharded: true)
```

**create-doc → execute-checklist**:
```
create-doc completes: Section population
    ↓
Template specifies: Run pm-checklist
    ↓
Agent invokes: execute-checklist task
    ↓
execute-checklist validates: Document completeness
    ↓
Results appended: "Checklist Results" section
```

**create-doc (self-invocation)**:
```
Template: story-tmpl.yaml (repeatable stories)
    ↓
SM agent: Creates story 1.1.md
    ↓
SM agent: Invokes create-doc again for 1.2.md
    ↓
Pattern repeats: For each story in epic
```

### 9.3 Template System Integration

**Template Discovery**:
```python
# Agent discovers available templates
templates = discover_templates('.bmad-core/templates/')

# Agent filters by agent role
my_templates = filter_templates_by_agent(templates, current_agent)

# Agent presents to user
present_template_menu(my_templates)
```

**Template Versioning**:
```yaml
# Template file
template:
  id: prd-template-v2
  name: Product Requirements Document
  version: 2.0
  previous_version: prd-template-v1
  migration_notes: |
    - Added technical-assumptions section
    - Split epic-details into separate repeatable section
    - Added agent permission fields
```

**Template Inheritance** (potential future feature):
```yaml
template:
  id: custom-prd-tmpl
  extends: prd-tmpl.yaml
  overrides:
    sections:
      - id: requirements
        # Override requirements section behavior
```

### 9.4 Configuration System Integration

**Dynamic Path Resolution**:
```python
# Template specifies output
output_filename = template['output']['filename']  # 'docs/prd.md'

# Check for config overrides
if 'customDocumentLocations' in config:
    if 'prd' in config['customDocumentLocations']:
        output_filename = config['customDocumentLocations']['prd']

# Resolve variables
output_filename = resolve_variables(output_filename, context)
```

**Workflow Preferences**:
```python
# Template default mode
mode = template['workflow']['mode']  # 'interactive'

# Override from config
if 'workflowDefaults' in config:
    mode = config['workflowDefaults'].get('mode', mode)

# Override from user
if user_preference:
    mode = user_preference
```

### 9.5 File System Integration

**Directory Creation**:
```python
output_path = resolve_output_path(template['output']['filename'], context)
output_dir = os.path.dirname(output_path)

if not os.path.exists(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    print(f"Created directory: {output_dir}")
```

**File Naming Conventions**:
```python
# Story files
filename_pattern = "{{epic_num}}.{{story_num}}.{{slug}}.md"
# Result: "1.2.user-authentication.md"

# Date-stamped files
filename_pattern = "research-{{date}}.md"
# Result: "research-2025-10-14.md"

# Versioned files
filename_pattern = "prd-v{{version}}.md"
# Result: "prd-v2.0.md"
```

### 9.6 Agent Permission System Integration

**Permission Enforcement**:
```python
# During section processing
if section.get('owner'):
    if current_agent != section['owner']:
        if current_agent not in section.get('editors', []):
            # Permission violation handling
            handle_permission_violation(section, current_agent)
```

**Permission Annotations in Output**:
```markdown
## Dev Agent Record

_This section is owned by dev-agent and can only be modified by dev-agent._

[Section content or placeholder]
```

**Multi-Agent Collaboration**:
```
SM creates story: Populates story, AC, tasks (owned sections)
    ↓
Story file: 1.2.auth.md (status: Draft)
    ↓
PO validates story: May modify status (editor permission)
    ↓
Dev implements: Updates Dev Agent Record (owned section)
    ↓
QA reviews: Updates QA Results (owned section)
    ↓
Story complete: Multiple agents contributed to single document
```

### 9.7 Elicitation System Integration

**Method Loading**:
```python
# Load elicitation methods
methods_file = '.bmad-core/data/elicitation-methods.md'
methods = parse_elicitation_methods(methods_file)

# Methods available for options 2-9
available_methods = methods[1:9]  # Skip "Proceed" (option 1)
```

**Method Execution**:
```python
user_selects = 4  # "Critique and Refine"

method = available_methods[user_selects - 2]
# method = {
#   'name': 'Critique and Refine',
#   'description': '...',
#   'instructions': '...'
# }

# Agent executes method
results = execute_elicitation_method(
    method=method,
    content=section_content,
    context=section_context
)

present_results(results)
```

### 9.8 State Management Integration

**Session State**:
```python
session_state = {
    'document_id': 'prd-2025-10-14',
    'current_section': 'requirements',
    'completed_sections': ['goals', 'background'],
    'mode': 'interactive',
    'context': {...},
    'checkpoint': 'checkpoint-5-sections.json'
}
```

**Checkpoint System**:
```python
# Save checkpoint every N sections
if section_count % checkpoint_interval == 0:
    save_checkpoint(
        document_content=current_document,
        session_state=session_state,
        timestamp=current_time
    )
```

### 9.9 Handoff Integration

**PM → Architect Handoff**:
```yaml
# In prd-tmpl.yaml
sections:
  - id: next-steps
    sections:
      - id: architect-prompt
        instruction: |
          Generate a concise prompt for the Architect agent
          to initiate architecture document creation based
          on this PRD.
```

Generated output:
```markdown
## Next Steps

### Architect Prompt

"Please review this PRD and create a system architecture document
that addresses all functional and non-functional requirements,
with particular attention to AWS free-tier constraints (NFR3)
and AI integration for duplicate detection (FR4)."
```

**Architect → SM Handoff**:
```yaml
# In architecture-tmpl.yaml
sections:
  - id: next-steps
    instruction: |
      After architecture is complete, generate handoff note
      for Scrum Master to begin story creation.
```

---

## 10. Performance Considerations

### 10.1 Template Parsing Optimization

**Caching Strategy**:
```python
# Cache parsed templates to avoid repeated YAML parsing
template_cache = {}

def load_template(template_name):
    if template_name in template_cache:
        return template_cache[template_name]

    # Load and parse
    template = parse_yaml_template(template_name)
    template_cache[template_name] = template
    return template
```

**Lazy Section Loading**:
```python
# Don't load nested sections until parent section is reached
if section.get('sections'):
    # Only process nested sections when parent is active
    for subsection in section['sections']:
        process_section(subsection)  # Lazy evaluation
```

### 10.2 Content Generation Optimization

**Incremental Document Writing**:
```python
# Write sections to file as they complete (for very long documents)
with open(output_path, 'w') as f:
    f.write(document_header)

    for section in sections:
        section_content = process_section(section)
        f.write(section_content)  # Incremental write
        f.flush()  # Ensure data is written
```

**Context Window Management**:
```python
# For AI agents with limited context windows
MAX_CONTEXT_SIZE = 100000  # characters

if len(current_context) > MAX_CONTEXT_SIZE:
    # Summarize completed sections
    context = summarize_context(
        completed_sections=completed_sections,
        keep_recent=3  # Keep last 3 sections full
    )
```

### 10.3 User Interaction Optimization

**Quick Mode Shortcuts**:
```python
# Allow users to skip elicitation for multiple sections
if user_types('#auto-approve-all'):
    mode = 'yolo'
    print("All remaining sections will be auto-approved")
```

**Batch Section Processing**:
```python
# Process multiple simple sections together
if all(not s.get('elicit') for s in next_5_sections):
    print("Processing next 5 simple sections...")
    for section in next_5_sections:
        process_section_silently(section)
    print("✓ Completed 5 sections")
```

### 10.4 File System Optimization

**Buffered Writes**:
```python
# Accumulate content before writing
document_buffer = []

for section in sections:
    section_content = process_section(section)
    document_buffer.append(section_content)

# Single write at end
final_content = '\n\n'.join(document_buffer)
write_file(output_path, final_content)
```

**Atomic File Operations**:
```python
# Write to temp file first, then rename (atomic on Unix)
temp_path = f"{output_path}.tmp"
with open(temp_path, 'w') as f:
    f.write(document_content)

os.rename(temp_path, output_path)  # Atomic
```

### 10.5 Memory Optimization

**Streaming Section Processing**:
```python
# Don't load entire document into memory for very large templates
def process_large_template(template, output_file):
    with open(output_file, 'w') as f:
        for section in template['sections']:
            content = process_section(section)
            f.write(content)
            del content  # Free memory immediately
```

**Context Pruning**:
```python
# Remove unnecessary context between sections
context = {
    'essential': {...},  # Always keep
    'section_specific': {...}  # Clear after section
}

after_section_complete:
    del context['section_specific']  # Free memory
```

### 10.6 Elicitation Performance

**Elicitation Method Lazy Loading**:
```python
# Don't load all 26 methods upfront
def get_elicitation_method(method_number):
    # Load only requested method from file
    methods = parse_methods_file('.bmad-core/data/elicitation-methods.md')
    return methods[method_number]
```

**Method Execution Timeout**:
```python
# Prevent elicitation methods from running indefinitely
ELICITATION_TIMEOUT = 60  # seconds

with timeout(ELICITATION_TIMEOUT):
    results = execute_elicitation_method(method, content)
```

### 10.7 Repeatable Section Performance

**Batch Epic Processing**:
```python
# For PRDs with many epics, offer batch mode
if epic_count > 10:
    PROMPT: "Process all epics in batch mode? (yes/no)"

    if user == 'yes':
        for epic in epics:
            process_epic_fast_mode(epic)
```

**Parallel Section Processing** (future enhancement):
```python
# Process independent sections in parallel
independent_sections = identify_independent_sections(template)

with ThreadPoolExecutor() as executor:
    futures = [
        executor.submit(process_section, section)
        for section in independent_sections
    ]

    results = [f.result() for f in futures]
```

---

## 11. Security Considerations

### 11.1 Template Injection Prevention

**Variable Sanitization**:
```python
# Prevent injection attacks via template variables
def sanitize_variable(value):
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[^\w\s\-\.]', '', str(value))
    return sanitized

context['user_input'] = sanitize_variable(raw_user_input)
```

**Template Source Validation**:
```python
# Only load templates from trusted directories
ALLOWED_TEMPLATE_DIRS = [
    '.bmad-core/templates/',
    'custom_templates/'  # If explicitly configured
]

def load_template(template_path):
    # Verify path is within allowed directories
    abs_path = os.path.abspath(template_path)

    if not any(abs_path.startswith(d) for d in ALLOWED_TEMPLATE_DIRS):
        raise SecurityError(f"Template path not allowed: {template_path}")

    return parse_yaml(abs_path)
```

### 11.2 File System Security

**Path Traversal Prevention**:
```python
# Prevent directory traversal attacks
def safe_output_path(filename):
    # Normalize path
    normalized = os.path.normpath(filename)

    # Ensure path is relative (not absolute)
    if os.path.isabs(normalized):
        raise SecurityError("Absolute paths not allowed")

    # Ensure path doesn't escape project root
    if '..' in normalized.split(os.sep):
        raise SecurityError("Path traversal not allowed")

    # Resolve relative to project root
    return os.path.join(project_root, normalized)
```

**Write Permission Checking**:
```python
# Check permissions before writing
output_path = safe_output_path(template['output']['filename'])
output_dir = os.path.dirname(output_path)

if not is_writable_directory(output_dir):
    raise PermissionError(f"Cannot write to directory: {output_dir}")
```

### 11.3 Agent Permission Enforcement

**Role Verification**:
```python
# Verify agent role is authentic
def verify_agent_role(claimed_role):
    # Check against authenticated agent identity
    actual_role = get_authenticated_agent_role()

    if claimed_role != actual_role:
        raise SecurityError(
            f"Agent role mismatch: claimed={claimed_role}, "
            f"actual={actual_role}"
        )
```

**Permission Audit Trail**:
```python
# Log permission violations for audit
def log_permission_violation(section, agent, action):
    audit_log.write({
        'timestamp': current_time,
        'section': section['id'],
        'section_owner': section.get('owner'),
        'agent': agent,
        'action': action,
        'allowed': False
    })
```

### 11.4 Input Validation

**User Input Sanitization**:
```python
# Sanitize user feedback before processing
def sanitize_user_input(user_input):
    # Remove control characters
    sanitized = ''.join(c for c in user_input if c.isprintable() or c.isspace())

    # Limit length
    MAX_INPUT_LENGTH = 10000
    if len(sanitized) > MAX_INPUT_LENGTH:
        sanitized = sanitized[:MAX_INPUT_LENGTH]

    return sanitized
```

**Elicitation Option Validation**:
```python
# Validate elicitation option selection
def validate_elicitation_option(user_input):
    if user_input.isdigit():
        option = int(user_input)
        if 1 <= option <= 9:
            return option

    # Free text input
    return sanitize_user_input(user_input)
```

### 11.5 Data Privacy

**Sensitive Data Handling**:
```python
# Mark sections with sensitive data
sensitive_sections = ['technical-credentials', 'api-keys', 'secrets']

def process_sensitive_section(section):
    print("⚠️  Warning: This section may contain sensitive data")
    print("Ensure proper access controls on output file")

    content = process_section(section)

    # Add warning to output
    warning = "<!-- SENSITIVE DATA - RESTRICT ACCESS -->"
    return f"{warning}\n\n{content}"
```

**Credential Redaction**:
```python
# Automatically detect and redact potential credentials
CREDENTIAL_PATTERNS = [
    r'password:\s*\S+',
    r'api[_-]?key:\s*\S+',
    r'secret:\s*\S+',
    r'token:\s*\S+'
]

def redact_credentials(content):
    for pattern in CREDENTIAL_PATTERNS:
        content = re.sub(pattern, '[REDACTED]', content, flags=re.IGNORECASE)
    return content
```

---

## 12. Edge Cases & Special Scenarios

### 12.1 Empty Template

**Scenario**: Template with no sections

```yaml
template:
  id: minimal-tmpl
  name: Minimal Document
  version: 1.0
  output:
    format: markdown
    filename: docs/minimal.md
    title: Minimal Document

sections: []  # Empty sections array
```

**Handling**:
```python
if not template.get('sections') or len(template['sections']) == 0:
    print("⚠️  Warning: Template has no sections")
    PROMPT: "Create empty document anyway? (yes/no)"

    if user == 'yes':
        create_document_with_header_only(template)
    else:
        ABORT: "Document creation cancelled"
```

### 12.2 Circular Section References

**Scenario**: Nested sections that reference each other

```yaml
sections:
  - id: section-a
    sections:
      - id: section-b
        sections:
          - id: section-a  # Circular reference!
```

**Handling**:
```python
visited_sections = set()

def process_section(section, visited):
    if section['id'] in visited:
        raise CircularReferenceError(
            f"Circular section reference detected: {section['id']}"
        )

    visited.add(section['id'])

    # Process section...

    if section.get('sections'):
        for subsection in section['sections']:
            process_section(subsection, visited.copy())
```

### 12.3 Infinite Repeatable Sections

**Scenario**: User keeps saying "yes" to repeatable section

**Handling** (already covered in Error Handling, but worth noting):
```python
MAX_ITERATIONS = 100
WARN_AT = 20

iteration = 0
while section.get('repeatable'):
    iteration += 1

    if iteration == WARN_AT:
        print(f"⚠️  You've created {WARN_AT} instances of this section")
        PROMPT: "Continue adding more? (yes/no)"
        if user != 'yes':
            break

    if iteration >= MAX_ITERATIONS:
        print(f"❌ Maximum iterations reached ({MAX_ITERATIONS})")
        break

    process_section(section, context)
```

### 12.4 Missing Template Variables

**Scenario**: Template uses variables that aren't in context

```yaml
sections:
  - id: greeting
    template: "Hello {{user_name}}, welcome to {{project_name}}!"
```

**Handling**:
```python
def populate_template(template_text, context):
    # Find all variables
    variables = re.findall(r'\{\{(\w+)\}\}', template_text)

    # Check for missing variables
    missing = [v for v in variables if v not in context]

    if missing:
        print(f"⚠️  Missing template variables: {', '.join(missing)}")

        for var in missing:
            PROMPT: f"Provide value for '{var}':"
            context[var] = get_user_input()

    # Populate template
    return template_text.format(**context)
```

### 12.5 Extremely Large Documents

**Scenario**: Template generates document > 100,000 lines

**Handling**:
```python
LINE_THRESHOLD = 50000

if estimated_line_count > LINE_THRESHOLD:
    print(f"⚠️  Warning: Estimated document size: {estimated_line_count} lines")
    print("This is a very large document. Consider:")
    print("1. Using document sharding (shard-doc task)")
    print("2. Splitting into multiple documents")
    print("3. Reducing epic/story count")

    PROMPT: "Continue anyway? (yes/no)"

    if user != 'yes':
        ABORT: "Document creation cancelled"
```

### 12.6 Concurrent Document Creation

**Scenario**: Multiple agents try to create same document simultaneously

**Handling**:
```python
# Lock-based approach
output_path = resolve_output_path(template['output']['filename'])
lock_file = f"{output_path}.lock"

if os.path.exists(lock_file):
    print(f"⚠️  Warning: Document creation already in progress")
    print(f"Lock file: {lock_file}")

    PROMPT: "Wait for other process or override lock? (wait/override/cancel)"

    if user == 'wait':
        wait_for_lock_release(lock_file, timeout=300)
    elif user == 'override':
        os.remove(lock_file)
    else:
        ABORT: "Document creation cancelled"

# Create lock
create_lock_file(lock_file)

try:
    create_document(template)
finally:
    remove_lock_file(lock_file)
```

### 12.7 Partial Document Updates

**Scenario**: User wants to regenerate only specific sections of existing document

**Handling** (potential feature):
```python
if document_exists(output_path):
    PROMPT: "Document exists. Update mode: (overwrite/append/section-replace)"

    if user == 'section-replace':
        existing_doc = load_document(output_path)

        PROMPT: "Which sections to regenerate? (comma-separated IDs)"
        section_ids = parse_section_list(get_user_input())

        for section_id in section_ids:
            if section_id in template['sections']:
                new_content = process_section(
                    get_section_by_id(template, section_id)
                )
                replace_section_in_document(existing_doc, section_id, new_content)

        write_document(output_path, existing_doc)
```

### 12.8 Template Version Mismatch

**Scenario**: Template version has changed, existing document uses old version

```yaml
# Old document front matter
---
template: prd-tmpl.yaml
template_version: 1.0
---

# Current template
template:
  version: 2.0
  migration_notes: "Added technical-assumptions section"
```

**Handling**:
```python
existing_version = extract_template_version(existing_document)
current_version = template['template']['version']

if existing_version != current_version:
    print(f"⚠️  Template version mismatch")
    print(f"   Document version: {existing_version}")
    print(f"   Template version: {current_version}")

    if template.get('migration_notes'):
        print(f"\nMigration notes:\n{template['migration_notes']}")

    PROMPT: "Proceed with version mismatch? (yes/no/migrate)"

    if user == 'migrate':
        migrate_document(existing_document, existing_version, current_version)
```

### 12.9 Interrupted Elicitation

**Scenario**: User disconnects during elicitation interaction

**Handling**:
```python
# Auto-save elicitation state
def handle_elicitation_interrupt(section, partial_content):
    checkpoint = {
        'section_id': section['id'],
        'partial_content': partial_content,
        'timestamp': current_time,
        'awaiting_option': True
    }

    save_checkpoint(checkpoint)

    print("\n⚠️  Session interrupted")
    print(f"Checkpoint saved: {checkpoint_file}")
    print("Resume with: continue-document <checkpoint_file>")
```

### 12.10 Agent Capability Mismatch

**Scenario**: Template requires capabilities current agent doesn't have

```yaml
# Template requires technical expertise
sections:
  - id: technical-architecture
    required_capabilities: ['system-design', 'technology-selection']
    instruction: Design the complete system architecture
```

**Handling**:
```python
required_capabilities = section.get('required_capabilities', [])
agent_capabilities = get_current_agent_capabilities()

missing = set(required_capabilities) - set(agent_capabilities)

if missing:
    print(f"⚠️  Warning: Section requires capabilities you may not have:")
    print(f"   Required: {', '.join(missing)}")
    print(f"   Your role: {current_agent}")

    PROMPT: "Attempt section anyway? (yes/no/delegate)"

    if user == 'delegate':
        recommended_agent = find_agent_with_capabilities(required_capabilities)
        print(f"Recommended agent: {recommended_agent}")
        PROMPT: "Switch to that agent? (yes/no)"
```

---

## 13. Testing & Validation

### 13.1 Template Validation Tests

**Valid Template Test**:
```python
def test_valid_template():
    template = load_template('prd-tmpl.yaml')

    assert 'template' in template
    assert 'id' in template['template']
    assert 'output' in template['template']
    assert 'sections' in template
    assert len(template['sections']) > 0
```

**Invalid Template Test**:
```python
def test_invalid_template_missing_id():
    template = {
        'template': {
            # Missing 'id' field
            'output': {'filename': 'test.md'}
        },
        'sections': []
    }

    with pytest.raises(TemplateError):
        validate_template(template)
```

**Section Structure Test**:
```python
def test_section_structure():
    section = {
        'id': 'test-section',
        'title': 'Test Section',
        'instruction': 'Test instruction'
    }

    assert is_valid_section(section) == True

    # Missing required field
    invalid_section = {'id': 'test'}  # Missing title
    assert is_valid_section(invalid_section) == False
```

### 13.2 Section Processing Tests

**Text Section Test**:
```python
def test_text_section_processing():
    section = {
        'id': 'background',
        'title': 'Background',
        'type': 'text',
        'instruction': 'Provide project background'
    }

    content = process_section(section, context={})

    assert isinstance(content, str)
    assert len(content) > 0
```

**List Section Test**:
```python
def test_bullet_list_section():
    section = {
        'id': 'goals',
        'title': 'Goals',
        'type': 'bullet-list',
        'instruction': 'List project goals'
    }

    content = process_section(section, context={})

    assert '- ' in content  # Bullet list format
    assert content.count('- ') >= 3  # At least 3 goals
```

**Numbered List with Prefix Test**:
```python
def test_numbered_list_with_prefix():
    section = {
        'id': 'requirements',
        'title': 'Functional Requirements',
        'type': 'numbered-list',
        'prefix': 'FR'
    }

    content = process_section(section, context={})

    assert 'FR1:' in content
    assert 'FR2:' in content
```

### 13.3 Conditional Section Tests

**Condition Met Test**:
```python
def test_conditional_section_included():
    section = {
        'id': 'ui-goals',
        'title': 'UI Goals',
        'condition': 'PRD has UX/UI requirements'
    }

    context = {'has_ui_requirements': True}

    should_include = evaluate_condition(section['condition'], context)

    assert should_include == True
```

**Condition Not Met Test**:
```python
def test_conditional_section_excluded():
    section = {
        'id': 'ui-goals',
        'title': 'UI Goals',
        'condition': 'PRD has UX/UI requirements'
    }

    context = {'has_ui_requirements': False}

    should_include = evaluate_condition(section['condition'], context)

    assert should_include == False
```

### 13.4 Repeatable Section Tests

**Repeatable Section Iteration Test**:
```python
def test_repeatable_section():
    section = {
        'id': 'epic-details',
        'title': 'Epic {{epic_number}}',
        'repeatable': True
    }

    # Simulate processing 3 epics
    epic_count = 3
    contents = []

    for i in range(1, epic_count + 1):
        context = {'epic_number': i}
        content = process_section(section, context)
        contents.append(content)

    assert len(contents) == 3
    assert 'Epic 1' in contents[0]
    assert 'Epic 2' in contents[1]
    assert 'Epic 3' in contents[2]
```

### 13.5 Agent Permission Tests

**Owner Permission Test**:
```python
def test_section_owner_permission():
    section = {
        'id': 'dev-record',
        'title': 'Dev Agent Record',
        'owner': 'dev-agent'
    }

    # Correct agent
    assert can_edit_section(section, agent='dev-agent') == True

    # Wrong agent
    assert can_edit_section(section, agent='scrum-master') == False
```

**Editor Permission Test**:
```python
def test_section_editor_permission():
    section = {
        'id': 'change-log',
        'title': 'Change Log',
        'owner': 'scrum-master',
        'editors': ['scrum-master', 'dev-agent', 'qa-agent']
    }

    # Owner
    assert can_edit_section(section, agent='scrum-master') == True

    # Editor
    assert can_edit_section(section, agent='dev-agent') == True

    # Non-editor
    assert can_edit_section(section, agent='pm-agent') == False
```

### 13.6 Elicitation Tests

**Elicitation Option Selection Test**:
```python
def test_elicitation_option_selection():
    valid_options = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    for option in valid_options:
        assert is_valid_elicitation_option(option) == True

    invalid_options = ['0', '10', 'abc', '']

    for option in invalid_options:
        assert is_valid_elicitation_option(option) == False
```

**Elicitation Method Execution Test**:
```python
def test_elicitation_method_execution():
    method_name = 'Critique and Refine'
    content = "Sample content to critique"

    results = execute_elicitation_method(method_name, content)

    assert 'issues' in results
    assert 'refinements' in results
    assert isinstance(results['issues'], list)
```

### 13.7 Output Tests

**Markdown Generation Test**:
```python
def test_markdown_output():
    sections = [
        {'id': 'title', 'content': 'Document Title'},
        {'id': 'body', 'content': 'Document body content'}
    ]

    markdown = generate_markdown(sections)

    assert '# Document Title' in markdown
    assert 'Document body content' in markdown
```

**File Write Test**:
```python
def test_document_write():
    template = load_template('prd-tmpl.yaml')
    output_path = 'test-output/test-prd.md'

    create_document(template, output_path)

    assert os.path.exists(output_path)

    with open(output_path, 'r') as f:
        content = f.read()
        assert len(content) > 0
        assert '# ' in content  # Has markdown headers
```

### 13.8 Integration Tests

**End-to-End Document Creation Test**:
```python
def test_end_to_end_document_creation():
    # Load template
    template = load_template('project-brief-tmpl.yaml')

    # Simulate user inputs (YOLO mode - no elicitation)
    mode = 'yolo'

    # Process template
    document = create_document(template, mode=mode)

    # Verify output
    assert document is not None
    assert os.path.exists(document['output_path'])

    # Verify sections
    assert all(
        section['id'] in document['processed_sections']
        for section in template['sections']
    )
```

**Multi-Agent Collaboration Test**:
```python
def test_multi_agent_collaboration():
    # SM creates story
    sm_agent = activate_agent('scrum-master')
    story = sm_agent.create_document('story-tmpl.yaml')

    # Dev updates dev record
    dev_agent = activate_agent('dev-agent')
    dev_agent.update_section(story, 'dev-agent-record')

    # QA updates qa results
    qa_agent = activate_agent('qa-agent')
    qa_agent.update_section(story, 'qa-results')

    # Verify all sections updated
    story_content = read_file(story['output_path'])
    assert 'Dev Agent Record' in story_content
    assert 'QA Results' in story_content
```

### 13.9 Performance Tests

**Large Document Performance Test**:
```python
def test_large_document_performance():
    # Template with 50 epics, 10 stories each
    template = create_large_template(epic_count=50, stories_per_epic=10)

    start_time = time.time()
    document = create_document(template, mode='yolo')
    end_time = time.time()

    duration = end_time - start_time

    # Should complete within reasonable time
    assert duration < 300  # 5 minutes
```

**Memory Usage Test**:
```python
def test_memory_usage():
    import psutil
    import os

    process = psutil.Process(os.getpid())
    initial_memory = process.memory_info().rss

    # Create large document
    template = create_large_template(epic_count=100)
    create_document(template, mode='yolo')

    final_memory = process.memory_info().rss
    memory_increase = final_memory - initial_memory

    # Should not exceed 500MB increase
    assert memory_increase < 500 * 1024 * 1024
```

---

## 14. Troubleshooting Guide

### 14.1 Common Issues

**Issue: Template not found**

*Symptoms*:
```
❌ Error: Template not found
File: .bmad-core/templates/my-template.yaml
```

*Solutions*:
1. Verify template file exists in `.bmad-core/templates/`
2. Check filename spelling (case-sensitive)
3. Use template discovery: invoke task without specifying template
4. Check file permissions

**Issue: Section not populating**

*Symptoms*:
- Section appears empty in output
- Agent skips section without explanation

*Solutions*:
1. Check section condition - may not be met
2. Check agent permissions - may not have edit access
3. Verify section instruction is clear
4. Check for missing template variables
5. Review section dependencies

**Issue: Elicitation options not appearing**

*Symptoms*:
- Only "Option 1: Proceed" appears
- Options 2-9 missing

*Solutions*:
1. Check `.bmad-core/data/elicitation-methods.md` exists
2. Verify file is readable
3. Check YAML front matter format
4. Confirm mode is 'interactive' (not 'yolo')

**Issue: Output file not created**

*Symptoms*:
- Task completes but no file appears
- No error messages

*Solutions*:
1. Check output path in template
2. Verify directory exists or can be created
3. Check write permissions
4. Review file naming pattern for invalid characters
5. Check for path traversal blocks

**Issue: Variable substitution not working**

*Symptoms*:
```
Output filename: docs/stories/{{epic_num}}.{{story_num}}.md
(Variables not replaced)
```

*Solutions*:
1. Verify variables exist in context
2. Check variable name spelling
3. Provide values during section processing
4. Use double curly braces: `{{var}}` not `{var}`

### 14.2 Error Messages & Solutions

**Error: "YAML parsing error"**

*Full Message*:
```
❌ Template Parsing Error
File: prd-tmpl.yaml
Line: 42
Error: mapping values are not allowed here
```

*Solution*:
- Open template in YAML validator
- Check indentation (use spaces, not tabs)
- Verify colons have space after them: `key: value` not `key:value`
- Check for unescaped special characters

**Error: "Circular section reference detected"**

*Full Message*:
```
❌ Circular section reference detected: section-a
```

*Solution*:
- Review section nesting in template
- Remove circular references
- Use section ID references instead of nesting

**Error: "Permission denied: Cannot write to"**

*Full Message*:
```
❌ Permission denied: Cannot write to 'docs/prd.md'
Check file permissions and try again.
```

*Solution*:
```bash
# Check permissions
ls -l docs/prd.md

# Fix permissions
chmod 644 docs/prd.md

# Check directory permissions
chmod 755 docs/
```

**Error: "Missing required template variable"**

*Full Message*:
```
⚠️  Missing required variable: project_name
```

*Solution*:
- Provide value when prompted
- Pre-populate context before task invocation:
```python
context = {'project_name': 'My Project'}
create_document(template, context=context)
```

**Error: "Maximum iterations reached"**

*Full Message*:
```
❌ Maximum iterations reached (100)
```

*Solution*:
- Repeatable section exceeded iteration limit
- Answer "no" when asked "Add another?"
- Check for automation scripts stuck in loop
- Review template logic

### 14.3 Debug Techniques

**Enable Verbose Logging**:
```python
# Set environment variable
export BMAD_DEBUG=1

# Or in code
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Inspect Template Structure**:
```python
import yaml

with open('.bmad-core/templates/prd-tmpl.yaml', 'r') as f:
    template = yaml.safe_load(f)

print(json.dumps(template, indent=2))
```

**Trace Section Processing**:
```python
def process_section(section, context, depth=0):
    indent = "  " * depth
    print(f"{indent}Processing: {section['id']}")

    # ... section processing logic

    if section.get('sections'):
        for subsection in section['sections']:
            process_section(subsection, context, depth + 1)
```

**Checkpoint Inspection**:
```bash
# List checkpoints
ls -la .bmad-checkpoints/

# View checkpoint content
cat .bmad-checkpoints/prd-20251014-153022.json | jq .
```

### 14.4 Performance Troubleshooting

**Slow Document Creation**:

*Symptoms*:
- Task takes > 5 minutes for simple document
- Agent appears to hang

*Solutions*:
1. Switch to YOLO mode to skip elicitation
2. Reduce number of repeatable sections
3. Check for infinite loops in conditional logic
4. Monitor memory usage during processing
5. Use incremental file writing

**High Memory Usage**:

*Symptoms*:
- System slows down during task execution
- Out of memory errors

*Solutions*:
1. Process sections incrementally, not all at once
2. Clear context between sections
3. Write to file frequently, don't buffer entire document
4. Reduce concurrent document creation
5. Increase system swap space

### 14.5 Integration Troubleshooting

**Agent Handoff Issues**:

*Symptoms*:
- Next agent doesn't receive document
- Context lost between agents

*Solutions*:
1. Verify document was written to expected location
2. Check file permissions for reading
3. Ensure proper path configuration in `core-config.yaml`
4. Review handoff section in template (Next Steps)

**Template Compatibility Issues**:

*Symptoms*:
- Template from one project doesn't work in another
- Missing sections or fields

*Solutions*:
1. Check template version compatibility
2. Review `core-config.yaml` for custom paths
3. Verify all referenced data files exist
4. Update template to current version

---

## 15. ADK Translation Recommendations

### 15.1 Overall Architecture

**Recommended ADK Components**:

```
Cloud Functions (Gen 2)
├── Simple Templates (< 5 sections, no complex logic)
│   └── Function: create-simple-document
│
Reasoning Engine
├── Complex Templates (10+ sections, repeatable, conditional)
│   └── Workflow: create-complex-document
│
Firestore
├── Template Storage (as JSON, converted from YAML)
├── Document State (checkpoints, session data)
└── Configuration (core-config)
│
Cloud Storage
├── Template Files (YAML originals)
├── Elicitation Methods Data
└── Generated Documents (markdown outputs)
│
Vertex AI Agent Builder
└── Agent Integration (current agent context)
```

### 15.2 Cloud Function Design (Simple Documents)

**Function: `create-simple-document`**

```python
from google.cloud import functions_v2
from google.cloud import storage
import yaml

@functions_v2.http
def create_simple_document(request):
    """
    Cloud Function for simple document creation (< 5 sections).
    """
    # Extract parameters
    template_name = request.json.get('template')
    mode = request.json.get('mode', 'interactive')
    context = request.json.get('context', {})

    # Load template from Cloud Storage
    storage_client = storage.Client()
    bucket = storage_client.bucket('bmad-templates')
    blob = bucket.blob(f'templates/{template_name}')
    template_content = blob.download_as_text()
    template = yaml.safe_load(template_content)

    # Validate template
    if not is_simple_template(template):
        return {
            'error': 'Template too complex for Cloud Function',
            'recommendation': 'Use Reasoning Engine workflow'
        }, 400

    # Process sections
    document_content = []
    for section in template['sections']:
        section_content = process_section_simple(section, context, mode)
        document_content.append(section_content)

    # Generate markdown
    markdown = generate_markdown(document_content, template['template'])

    # Write to Cloud Storage
    output_path = template['template']['output']['filename']
    output_blob = bucket.blob(f'documents/{output_path}')
    output_blob.upload_from_string(markdown)

    return {
        'status': 'success',
        'output_path': output_path,
        'sections_processed': len(template['sections'])
    }

def is_simple_template(template):
    """Check if template is simple enough for Cloud Function."""
    sections = template.get('sections', [])

    # Too many sections
    if len(sections) > 5:
        return False

    # Has repeatable sections
    if any(s.get('repeatable') for s in sections):
        return False

    # Has complex conditional logic
    if any(s.get('condition') for s in sections):
        return False

    return True
```

### 15.3 Reasoning Engine Design (Complex Documents)

**Workflow: `create-complex-document`**

```python
from google.cloud import reasoning_engine
from google.cloud import firestore
from google.cloud import storage
import yaml

class CreateDocumentWorkflow:
    """
    Reasoning Engine workflow for complex document creation.
    Handles repeatable sections, conditional logic, and elicitation.
    """

    def __init__(self, project_id, location):
        self.project_id = project_id
        self.location = location
        self.firestore_client = firestore.Client()
        self.storage_client = storage.Client()

    def execute(self, template_name: str, mode: str = 'interactive',
                context: dict = None) -> dict:
        """
        Main execution flow.
        """
        # Step 1: Load and validate template
        template = self.load_template(template_name)
        self.validate_template(template)

        # Step 2: Initialize session state
        session = self.create_session(template, mode, context or {})

        # Step 3: Process sections sequentially
        document_sections = []
        for section in template['sections']:
            # Check condition
            if section.get('condition'):
                if not self.evaluate_condition(section['condition'], session['context']):
                    continue

            # Process section (may be repeatable)
            if section.get('repeatable'):
                section_instances = self.process_repeatable_section(
                    section, session
                )
                document_sections.extend(section_instances)
            else:
                section_content = self.process_section(section, session)
                document_sections.append(section_content)

            # Save checkpoint
            self.save_checkpoint(session, document_sections)

        # Step 4: Generate final document
        markdown = self.generate_markdown(document_sections, template)

        # Step 5: Write output
        output_path = self.write_document(markdown, template, session['context'])

        return {
            'status': 'success',
            'output_path': output_path,
            'sections_processed': len(document_sections),
            'session_id': session['id']
        }

    def process_section(self, section: dict, session: dict) -> dict:
        """
        Process a single section with elicitation support.
        """
        # Generate content using AI
        content = self.generate_section_content(
            instruction=section['instruction'],
            section_type=section.get('type', 'text'),
            context=session['context']
        )

        # Handle elicitation
        if section.get('elicit') and session['mode'] == 'interactive':
            content = self.handle_elicitation(section, content, session)

        return {
            'id': section['id'],
            'title': section['title'],
            'content': content
        }

    def process_repeatable_section(self, section: dict, session: dict) -> list:
        """
        Process repeatable section (e.g., epics).
        """
        instances = []
        iteration = 0

        while True:
            iteration += 1

            # Update context with iteration number
            session['context'][f"{section['id']}_number"] = iteration

            # Process instance
            instance = self.process_section(section, session)
            instances.append(instance)

            # Check if user wants another (in interactive mode)
            if session['mode'] == 'interactive':
                if not self.user_wants_another(section, iteration):
                    break
            else:
                # In YOLO mode, process all from source data
                if not self.has_more_instances(section, session['context'], iteration):
                    break

        return instances

    def handle_elicitation(self, section: dict, content: str,
                          session: dict) -> str:
        """
        Handle elicitation interaction for section.
        """
        # Present content with rationale
        self.present_content(content, section)

        while True:
            # Get user input
            user_input = self.get_user_input()

            if user_input == '1':
                # Proceed to next section
                return content
            elif user_input.isdigit() and 2 <= int(user_input) <= 9:
                # Execute elicitation method
                method_results = self.execute_elicitation_method(
                    int(user_input), content, section
                )

                # Present results and get next action
                action = self.present_elicitation_results(method_results)

                if action == 'apply':
                    content = self.apply_elicitation_changes(content, method_results)
                    return content
                elif action == 'menu':
                    continue  # Back to 1-9 menu
                # else: continue conversation
            else:
                # Free text feedback
                content = self.process_feedback(content, user_input, section)
                self.present_content(content, section)

    def load_template(self, template_name: str) -> dict:
        """Load template from Cloud Storage."""
        bucket = self.storage_client.bucket('bmad-templates')
        blob = bucket.blob(f'templates/{template_name}')
        template_content = blob.download_as_text()
        return yaml.safe_load(template_content)

    def create_session(self, template: dict, mode: str, context: dict) -> dict:
        """Create Firestore session document."""
        session_ref = self.firestore_client.collection('document_sessions').document()

        session_data = {
            'id': session_ref.id,
            'template_id': template['template']['id'],
            'mode': mode,
            'context': context,
            'started_at': firestore.SERVER_TIMESTAMP,
            'status': 'in_progress'
        }

        session_ref.set(session_data)
        return session_data

    def save_checkpoint(self, session: dict, processed_sections: list):
        """Save progress checkpoint to Firestore."""
        session_ref = self.firestore_client.collection('document_sessions').document(session['id'])

        session_ref.update({
            'processed_sections': processed_sections,
            'last_checkpoint': firestore.SERVER_TIMESTAMP
        })

    def write_document(self, markdown: str, template: dict, context: dict) -> str:
        """Write final document to Cloud Storage."""
        output_filename = template['template']['output']['filename']

        # Substitute variables
        for key, value in context.items():
            output_filename = output_filename.replace(f'{{{{{key}}}}}', str(value))

        bucket = self.storage_client.bucket('bmad-documents')
        blob = bucket.blob(output_filename)
        blob.upload_from_string(markdown)

        return output_filename
```

### 15.4 Firestore Schema

**Collections and Documents**:

```
/templates/{template_id}
  - id: string
  - name: string
  - version: string
  - yaml_content: string (original YAML)
  - json_structure: object (parsed structure)
  - created_at: timestamp
  - updated_at: timestamp

/document_sessions/{session_id}
  - id: string
  - template_id: string
  - mode: string ('interactive' | 'yolo')
  - context: object (template variables)
  - processed_sections: array
  - status: string ('in_progress' | 'completed' | 'failed')
  - started_at: timestamp
  - last_checkpoint: timestamp
  - completed_at: timestamp

/elicitation_methods/{method_id}
  - name: string
  - category: string
  - description: string
  - instructions: string

/agent_permissions/{agent_role}
  - role: string ('analyst', 'pm-agent', etc.)
  - capabilities: array[string]
  - template_access: array[string] (template IDs)
```

### 15.5 API Endpoint Design

**RESTful API**:

```yaml
POST /v1/documents/create
  Request:
    template: string (template name or ID)
    mode: string ('interactive' | 'yolo')
    context: object (optional pre-populated variables)
    agent_role: string (current agent)

  Response:
    session_id: string
    status: string
    next_action: object (elicitation prompt or completion)

POST /v1/documents/{session_id}/continue
  Request:
    user_input: string (elicitation option or feedback)

  Response:
    status: string
    next_action: object

GET /v1/documents/{session_id}/status
  Response:
    session_id: string
    status: string
    progress: object
      sections_total: number
      sections_completed: number
      current_section: string

GET /v1/documents/{session_id}/output
  Response:
    output_path: string
    content: string (markdown)
    metadata: object

GET /v1/templates
  Query params:
    agent_role: string (optional filter)

  Response:
    templates: array[object]
      - id: string
        name: string
        description: string
        version: string
```

### 15.6 Vertex AI Agent Integration

**Agent Tool Configuration**:

```python
from vertexai.preview import reasoning_engines

# Define tool for agent
create_document_tool = {
    'name': 'create_document',
    'description': 'Create a document from a YAML template',
    'parameters': {
        'type': 'object',
        'properties': {
            'template': {
                'type': 'string',
                'description': 'Template name (e.g., prd-tmpl.yaml)'
            },
            'mode': {
                'type': 'string',
                'enum': ['interactive', 'yolo'],
                'description': 'Interaction mode'
            }
        },
        'required': ['template']
    }
}

# Register tool with agent
agent.register_tool('create_document', create_document_tool, create_document_function)
```

**Agent Invocation**:

```python
# PM agent creates PRD
pm_agent = get_agent('pm-agent')

response = pm_agent.chat(
    "Create a PRD for the TodoMaster AI project. "
    "Use interactive mode for elicitation."
)

# Agent invokes create_document tool
# Returns session ID and starts interactive flow
```

### 15.7 Deployment Configuration

**Terraform Module**:

```hcl
module "create_doc_workflow" {
  source = "./modules/reasoning-engine"

  project_id = var.project_id
  location   = var.location

  workflow_name = "create-complex-document"
  workflow_code = file("workflows/create_document_workflow.py")

  dependencies = {
    firestore_database = module.firestore.database_id
    storage_bucket = module.storage.bucket_name
  }

  environment = {
    TEMPLATES_BUCKET = "bmad-templates"
    DOCUMENTS_BUCKET = "bmad-documents"
    ELICITATION_METHODS_PATH = "data/elicitation-methods.md"
  }
}

module "create_simple_doc_function" {
  source = "./modules/cloud-function"

  project_id = var.project_id
  location   = var.location

  function_name = "create-simple-document"
  runtime       = "python311"
  entry_point   = "create_simple_document"
  source_dir    = "functions/create_simple_document"

  environment = {
    TEMPLATES_BUCKET = "bmad-templates"
    DOCUMENTS_BUCKET = "bmad-documents"
  }
}
```

### 15.8 Migration Considerations

**Template Migration**:
```python
# Convert YAML templates to Firestore documents
def migrate_template(yaml_path):
    with open(yaml_path, 'r') as f:
        template = yaml.safe_load(f)

    firestore_doc = {
        'id': template['template']['id'],
        'name': template['template']['name'],
        'version': template['template']['version'],
        'yaml_content': f.read(),  # Store original
        'json_structure': template,  # Parsed structure
        'created_at': firestore.SERVER_TIMESTAMP
    }

    firestore.collection('templates').document(template['template']['id']).set(firestore_doc)
```

**Session State Migration**:
- Current: In-memory state during task execution
- ADK: Firestore-backed persistent state
- Benefit: Resume interrupted sessions, multi-agent collaboration

**Elicitation Method Migration**:
- Current: Markdown file with method descriptions
- ADK: Firestore collection with structured method data
- Benefit: Dynamic method selection, versioning, A/B testing

---

## 16. Summary

### 16.1 Task Capabilities

The `create-doc` task is a **powerful, flexible document generation engine** that:

✅ **Processes any YAML template** to generate structured markdown documents
✅ **Supports multiple document types** (PRDs, architecture docs, stories, etc.)
✅ **Enables interactive elicitation** with 26+ advanced techniques
✅ **Enforces agent permissions** for multi-agent collaboration
✅ **Handles complex logic** (conditional sections, repeatable sections, nested structures)
✅ **Provides dual modes** (interactive for quality, YOLO for speed)
✅ **Integrates with BMad ecosystem** (agents, workflows, configuration)

### 16.2 Key Design Patterns

**Template-Driven Architecture**:
- Separation of structure (YAML template) from content generation (agent)
- Reusable templates across projects
- Versioned templates for migration paths

**Section-by-Section Processing**:
- Sequential workflow ensures completeness
- Elicitation checkpoints for quality
- Incremental document building

**Agent Permission System**:
- Section ownership (single agent responsible)
- Editor lists (multiple agents can modify)
- Readonly sections (protected content)

**Dual Mode Operation**:
- Interactive mode: High-quality, user-guided
- YOLO mode: Fast, automated (for simple docs or drafts)

**Advanced Elicitation**:
- 1-9 option format (never yes/no)
- 26+ sophisticated elicitation methods
- Rationale-driven presentation (explain trade-offs)

### 16.3 Critical Success Factors

For successful task execution:

1. **Valid YAML template** with required structure
2. **Clear section instructions** for agent guidance
3. **Available elicitation methods** (for interactive mode)
4. **Agent permission alignment** with current agent role
5. **Proper configuration** (core-config.yaml, template paths)
6. **User engagement** (in interactive mode)

### 16.4 ADK Translation Strategy

**Recommended Implementation**:

| Component | ADK Service | Reasoning |
|-----------|-------------|-----------|
| Simple templates (< 5 sections) | Cloud Functions | Stateless, fast execution |
| Complex templates (10+ sections) | Reasoning Engine | Stateful, multi-step workflow |
| Template storage | Cloud Storage + Firestore | YAML files + parsed structure |
| Session state | Firestore | Persistent, resumable sessions |
| Elicitation methods | Firestore collection | Structured, queryable data |
| Document output | Cloud Storage | Version control, access control |
| Agent integration | Vertex AI Agent Builder | Tool registration, invocation |

**Implementation Priorities**:

1. **Phase 1**: Cloud Function for simple templates (quick wins)
2. **Phase 2**: Reasoning Engine for complex templates (core value)
3. **Phase 3**: Elicitation system (quality enhancement)
4. **Phase 4**: Agent permission system (collaboration enabler)

### 16.5 Unique Insights

**Why This Task Is Foundational**:

The `create-doc` task is the **universal document creation mechanism** in BMad. Nearly every planning artifact (project briefs, PRDs, architecture docs) flows through this task. Its quality and flexibility directly impact:

- **Consistency**: All docs follow template structure
- **Completeness**: No sections forgotten
- **Quality**: Elicitation ensures expert review
- **Collaboration**: Permission system enables multi-agent workflows
- **Maintainability**: Template updates improve all future docs

**Design Philosophy**:

The task embodies the BMad principle: **"Structure + Interaction = Quality"**

Templates provide structure (what to include), elicitation provides interaction (refine and validate), and together they produce high-quality artifacts.

**Innovation**:

The **1-9 elicitation format** is a unique innovation:
- Combines "proceed" option (1) with 8 sophisticated methods (2-9)
- Never uses yes/no (too limiting)
- Supports free text (flexibility)
- Guides users toward proven techniques (elicitation methods library)

This format maximizes both speed (option 1 for simple sections) and quality (methods 2-9 for critical sections).

---

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Analysis Type**: Task Workflow Analysis
**Lines**: 3,800+
