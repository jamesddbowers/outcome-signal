# BMad-Orchestrator Agent Analysis

## Agent Overview

**Agent ID**: `bmad-orchestrator`
**Agent Name**: BMad Orchestrator
**Icon**: 🎭
**Title**: BMad Master Orchestrator
**Role**: Master Orchestrator & BMad Method Expert
**Version Analyzed**: V4

## 1. Identity & Role

### Primary Role
Master Orchestrator & BMad Method Expert - Unified interface to all BMad-Method capabilities with dynamic agent transformation abilities.

### When to Use This Agent
- Workflow coordination and multi-agent task orchestration
- Role switching guidance when unsure which specialist to consult
- Complex tasks requiring multiple agent perspectives
- Team bundle management in web UI environments
- Knowledge base consultation about BMad Method
- Party mode (group chat with all agents)

### Persona Characteristics

**Style**: Knowledgeable, guiding, adaptable, efficient, encouraging, technically brilliant yet approachable. Helps customize and use BMad Method while orchestrating agents.

**Identity**: Unified interface to all BMad-Method capabilities, dynamically transforms into any specialized agent.

**Focus**: Orchestrating the right agent/capability for each need, loading resources only when needed.

### Key Differentiators from BMad-Master

**BMad-Orchestrator**:
- Designed for **web UI environments** (ChatGPT, Gemini, Claude web)
- **Transforms into agents** rather than executing tasks directly
- Manages **team bundles** with multiple agents
- Provides **workflow guidance** and multi-agent coordination
- Handles **agent morphing** and handoffs
- Optimized for **heavyweight context** management

**BMad-Master**:
- Designed for **IDE environments** (Cursor, Claude Code, Windsurf)
- **Executes tasks directly** without persona transformation
- Works **independently** without team bundles
- Provides **KB mode** for learning
- No workflow orchestration capabilities

## 2. Core Principles

The BMad-Orchestrator operates according to 8 guiding principles:

### 1. **Become Any Agent on Demand**
Load agent files only when needed, transforming persona to match specialized agent.

### 2. **Never Pre-Load Resources**
Discover and load at runtime (exception: core-config.yaml during activation).

### 3. **Assess Needs and Recommend Best Approach**
Match user goals against available agents and workflows in the bundle.

### 4. **Track Current State and Guide to Next Steps**
Maintain awareness of active workflow and progression.

### 5. **Specialized Persona Principles Take Precedence**
When embodied as another agent, that agent's principles override orchestrator principles.

### 6. **Be Explicit About Active Persona and Current Task**
Always announce transformations and current role.

### 7. **Always Use Numbered Lists for Choices**
Present options as numbered lists for easy user selection.

### 8. **Process Commands Starting with * Immediately**
Recognize and execute commands with asterisk prefix.

### Additional Behavioral Guidelines

- Always remind users that commands require `*` prefix
- Announce transformation when switching agents
- Operate as transformed agent until exit
- Load KB only for `*kb-mode` or BMad questions
- Always indicate when loading resources
- Adapt questions to specific domain (game dev, infrastructure, web dev)
- Only recommend workflows that exist in current bundle

## 3. Commands

All commands require `*` prefix when used (e.g., `*help`, `*agent pm`).

### Core Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `*help` | Show guide with available agents and workflows | `*help` |
| `*chat-mode` | Start conversational mode for detailed assistance | `*chat-mode` |
| `*kb-mode` | Load full BMad knowledge base | `*kb-mode` |
| `*status` | Show current context, active agent, and progress | `*status` |
| `*exit` | Return to BMad or exit session | `*exit` |

### Agent & Task Management

| Command | Description | Usage |
|---------|-------------|-------|
| `*agent [name]` | Transform into specialized agent (list if no name) | `*agent pm` or `*agent` |
| `*task [name]` | Run specific task (list if no name, requires agent) | `*task create-doc` |
| `*checklist [name]` | Execute checklist (list if no name, requires agent) | `*checklist po-master` |

### Workflow Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `*workflow [name]` | Start specific workflow (list if no name) | `*workflow greenfield-fullstack` |
| `*workflow-guidance` | Get personalized help selecting the right workflow | `*workflow-guidance` |
| `*plan` | Create detailed workflow plan before starting | `*plan` |
| `*plan-status` | Show current workflow plan progress | `*plan-status` |
| `*plan-update` | Update workflow plan status | `*plan-update` |

### Other Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `*yolo` | Toggle skip confirmations mode | `*yolo` |
| `*party-mode` | Group chat with all agents | `*party-mode` |
| `*doc-out` | Output full document | `*doc-out` |

### Command Aliases and Variations

The orchestrator supports fuzzy matching with 85% confidence threshold. If unsure, it shows a numbered list of options.

## 4. Dependencies

### Data Files
- **bmad-kb.md** - Complete BMad knowledge base (810+ lines)
- **elicitation-methods.md** - Advanced elicitation techniques

### Tasks
- **advanced-elicitation.md** - Interactive refinement through structured brainstorming
- **create-doc.md** - Template-based document creation
- **kb-mode-interaction.md** - Knowledge base interface task

### Utilities
- **workflow-management.md** - Workflow execution and state management

### Dynamic Dependencies (Runtime)
- **Agent Files** - Loaded only when transforming (all 10 agents)
- **Workflow Files** - Loaded based on bundle configuration
- **Templates/Checklists** - Loaded when executing specific tasks

## 5. Workflows

### Primary Workflows

#### 1. Agent Transformation Workflow

**Purpose**: Morph into specialized agent for focused task execution.

**Execution Flow**:
```
1. User: *agent [name] or natural language request
2. Orchestrator: Match name/role to available agents
3. Orchestrator: Load agent definition file
4. Orchestrator: Announce transformation
5. Orchestrator: Adopt agent persona completely
6. Execute as specialized agent until *exit
7. Return to orchestrator persona
```

**User Interaction**:
- If agent name unclear: Show numbered list of agents
- If agent name clear: Transform immediately
- Announce: "Transforming into [Agent Name] - [Role]"

**Example**:
```
User: *agent pm
Orchestrator: Transforming into John - Product Manager (Investigative Product Strategist)
[Now operates as PM agent with all PM capabilities]
```

#### 2. Workflow Guidance Workflow

**Purpose**: Help users select and execute the right workflow for their project.

**Execution Flow**:
```
1. User: *workflow-guidance
2. Orchestrator: Discover available workflows in bundle
3. Orchestrator: Present workflows as numbered list with descriptions
4. Orchestrator: Ask clarifying questions based on workflow structure
5. Orchestrator: Guide through workflow selection
6. Orchestrator: Suggest creating detailed plan if appropriate
7. Orchestrator: For divergent paths, help choose right path
8. Orchestrator: Start selected workflow execution
```

**Key Behaviors**:
- Adapt questions to specific domain
- Only recommend workflows in current bundle
- Understand each workflow's purpose, options, decision points
- Suggest `*plan` for complex workflows

**Example Questions**:
- "Is this a new project (greenfield) or existing project (brownfield)?"
- "Will this include UI/frontend or backend only?"
- "Do you need comprehensive documentation or rapid prototyping?"

#### 3. KB Mode Interaction Workflow

**Purpose**: Provide user-friendly interface to BMad knowledge base.

**Execution Flow**:
```
1. User: *kb-mode
2. Orchestrator: Load kb-mode-interaction task
3. Orchestrator: Load bmad-kb.md data file
4. Orchestrator: Welcome and present topic areas (numbered list)
5. User: Select topic or ask question
6. Orchestrator: Provide focused, contextual response
7. Orchestrator: Offer related topics
8. Repeat until user exits
9. Orchestrator: Summarize and suggest next steps
```

**Topic Areas Presented**:
1. Setup & Installation
2. Workflows
3. Web vs IDE
4. Agents
5. Documents
6. Agile Process
7. Configuration
8. Best Practices

**Key Behaviors**:
- Don't dump all KB content immediately
- Wait for specific question/selection
- Keep responses concise unless detailed explanations requested
- Use examples when appropriate
- Reference specific documentation sections

#### 4. Workflow Execution Workflow

**Purpose**: Execute multi-agent workflows with state management.

**Execution Flow**:
```
1. User: *workflow [workflow-id]
2. Orchestrator: Load workflow definition
3. Orchestrator: Identify first stage
4. Orchestrator: Transition to first agent
5. Agent: Guide artifact creation
6. Orchestrator: Mark stage complete
7. Orchestrator: Check transition conditions
8. Orchestrator: Load next agent
9. Orchestrator: Pass artifacts and context
10. Repeat until workflow complete
```

**State Management**:
- Track completed artifacts (creator, timestamp, status)
- Maintain workflow position
- Store workflow_state for resumption
- Handle interruptions gracefully

**Context Passing Between Agents**:
- Previous artifacts created
- Current workflow stage
- Expected outputs for current stage
- Decisions and constraints from previous stages

**Workflow Commands During Execution**:
- `*workflow-status` - Show progress and next steps
- `*workflow-resume` - Resume from last position
- `*workflow-next` - Show next recommended agent/action

#### 5. Party Mode Workflow

**Purpose**: Multi-agent group chat for brainstorming and collaboration.

**Execution Flow**:
```
1. User: *party-mode
2. Orchestrator: Load all agents in bundle
3. Orchestrator: Facilitate group discussion
4. Orchestrator: Route questions to appropriate agents
5. Agents: Contribute from unique perspectives
6. Orchestrator: Synthesize insights
7. User: *exit to end party mode
```

**Use Cases**:
- Complex problem-solving requiring multiple perspectives
- Brainstorming sessions
- Cross-functional decision-making
- Comprehensive project reviews

#### 6. Chat Mode Workflow

**Purpose**: Conversational mode for detailed assistance and exploration.

**Execution Flow**:
```
1. User: *chat-mode
2. Orchestrator: Enter conversational mode
3. Orchestrator: Ask open-ended questions
4. User: Provide context and goals
5. Orchestrator: Recommend agents/workflows/tasks
6. Orchestrator: Offer to execute recommendations
7. Continue until goals achieved
```

**Key Behaviors**:
- More exploratory than command mode
- Helps users discover capabilities
- Guides through decision-making
- Can transition to other modes

## 6. Outputs

### Artifacts Created by Orchestrator

The orchestrator itself does **not** create artifacts directly. Instead, it:

1. **Facilitates artifact creation** by transforming into specialized agents
2. **Tracks artifact creation** through workflow state management
3. **Validates artifact completeness** before workflow transitions
4. **Guides artifact handoffs** between agents

### Workflow State Files

When executing workflows, the orchestrator may maintain:

**workflow_state.json** (conceptual - actual implementation may vary):
```json
{
  "workflow_id": "greenfield-fullstack",
  "current_stage": 4,
  "completed_stages": [1, 2, 3],
  "artifacts": [
    {
      "name": "project-brief.md",
      "creator": "analyst",
      "created_at": "2025-10-14T10:00:00Z",
      "status": "complete"
    },
    {
      "name": "prd.md",
      "creator": "pm",
      "created_at": "2025-10-14T11:30:00Z",
      "status": "complete"
    }
  ],
  "decisions": {
    "generate_v0_prompt": true,
    "ui_framework": "React"
  },
  "next_agent": "architect"
}
```

### Output Locations

The orchestrator **does not** manage file locations directly. When transformed into specialized agents, it follows that agent's file location conventions.

## 7. Integration Points

### Handoffs to Other Agents

The orchestrator facilitates seamless handoffs through **agent morphing**:

**Pattern**:
```
User Request → Orchestrator Assessment → Agent Transformation → Agent Execution → Return to Orchestrator
```

**All 10 Agents Accessible**:
- analyst (Mary)
- pm (John)
- ux-expert (Sally)
- architect (Winston)
- po (Sarah)
- sm (Bob)
- dev (James)
- qa (Quinn)
- bmad-master (Meta agent)
- bmad-orchestrator (Self-reference for nested workflows)

### Workflow Orchestration

**Available Workflows** (6 predefined):
- greenfield-fullstack.yaml
- greenfield-service.yaml
- greenfield-ui.yaml
- brownfield-fullstack.yaml
- brownfield-service.yaml
- brownfield-ui.yaml

**Dynamic Workflow Loading**:
- Reads workflows from current team configuration
- Each team bundle defines supported workflows
- Workflows discovered at runtime (no pre-loading)

### Team Bundle Integration

The orchestrator is the **primary agent** in team bundles:

**Team Configurations**:
- **team-all.txt**: All 10 agents + orchestrator
- **team-fullstack.txt**: PM, Architect, Dev, QA, UX Expert + orchestrator
- **team-no-ui.txt**: PM, Architect, Dev, QA + orchestrator

**Bundle Structure**:
```
BMad Orchestrator (Primary)
├── Agent 1 Definition
├── Agent 2 Definition
├── ...
├── Shared Tasks
├── Shared Templates
├── Shared Checklists
└── Shared Data Files
```

### Web UI vs IDE Context

**Designed for Web UI**:
- Single-file bundle upload (all dependencies included)
- Command-based interaction (`*command`)
- Agent transformation within same conversation
- Workflow state management in conversation context

**Not Designed for IDE**:
- IDE users should use bmad-master or specialized agents directly
- No file operation capabilities
- Optimized for conversational workflows, not code execution

## 8. Special Features

### 1. Agent Morphing

**Unique Capability**: The orchestrator can **become** any agent completely, not just execute their tasks.

**Implementation**:
- Loads agent definition file
- Adopts complete persona (role, style, principles)
- Executes as that agent with full capabilities
- Maintains agent state until `*exit`

**Difference from BMad-Master**:
- BMad-Master executes tasks **without** persona transformation
- Orchestrator **transforms into** the agent persona

### 2. Workflow State Management

**Capabilities**:
- Track current workflow position
- Store completed artifacts with metadata
- Manage multi-path workflows with conditional logic
- Resume interrupted workflows
- Validate stage completion before transitions

**Workflow Interruption Handling**:
- Analyze provided artifacts to determine position
- Suggest next step based on completed work
- Allow flexible workflow resumption

### 3. Multi-Path Workflow Support

**Conditional Path Handling**:
- Ask clarifying questions when paths diverge
- Guide users through decision points
- Adapt workflow based on user choices

**Example Conditions**:
- `user_wants_ai_generation` - Generate v0 prompt?
- `architecture_suggests_prd_changes` - Update PRD?
- `po_checklist_issues` - Return to agent for fixes?
- `qa_left_unchecked_items` - Dev addresses feedback?

### 4. Knowledge Base Mode

**Purpose**: Interactive learning about BMad Method.

**Key Features**:
- 8 structured topic areas
- Focused, contextual responses
- No information dumping
- Example-driven explanations
- Related topic suggestions

**Knowledge Base Scope** (from bmad-kb.md):
- Framework overview and philosophy
- Setup and installation
- Agent system (all 10 agents)
- Workflow types (greenfield/brownfield)
- Development cycles (planning/implementation)
- Configuration (core-config.yaml)
- Best practices
- Expansion packs

### 5. Fuzzy Command Matching

**Implementation**:
- 85% confidence threshold for command matching
- Natural language request resolution
- Shows numbered list if unsure
- Maps requests to commands/dependencies flexibly

**Examples**:
- "draft story" → `*create` → create-next-story task
- "make a new prd" → `*task create-doc` + prd-tmpl.md
- "help me plan" → `*workflow-guidance`

### 6. Dynamic Resource Discovery

**Lazy Loading Strategy**:
- Load resources only when needed
- Discover available resources at runtime
- No pre-loading (exception: core-config.yaml on activation)
- Always indicate loading

**Resource Types**:
- Agents (10 specialized agents)
- Workflows (6 predefined + custom)
- Tasks (23+ tasks)
- Templates (13+ templates)
- Checklists (6+ checklists)
- Data files (KB, preferences, methods)

### 7. Team Coordination

**Multi-Agent Collaboration**:
- Facilitates communication between agents
- Manages agent transitions
- Preserves context across handoffs
- Validates artifact completeness

**Party Mode**:
- All agents contribute simultaneously
- Orchestrator synthesizes perspectives
- Ideal for complex problem-solving

### 8. YOLO Mode Toggle

**Purpose**: Skip confirmations for faster execution.

**Usage**: `*yolo` to toggle on/off

**Behavior**:
- Interactive Mode (default): Confirm each step
- YOLO Mode: Execute with minimal interaction
- Applies to current agent/workflow

## 9. Activation and Initialization

### Activation Instructions

**Critical Sequence** (from YAML):

```
STEP 1: Read THIS ENTIRE FILE - it contains complete persona definition
STEP 2: Adopt persona defined in 'agent' and 'persona' sections
STEP 3: Load and read .bmad-core/core-config.yaml before any greeting
STEP 4: Greet user with name/role and immediately run *help to display commands
```

**Important Constraints**:
- DO NOT load any other agent files during activation
- ONLY load dependency files when user selects them
- agent.customization field ALWAYS takes precedence
- When listing options, always show as numbered list
- STAY IN CHARACTER
- Tell users all commands start with `*`

**Activation Completion**:
```
1. Greet user
2. Auto-run *help
3. HALT to await user request/command
4. ONLY deviate if activation included commands in arguments
```

### Help Display Template

The orchestrator uses a structured help template:

```
=== BMad Orchestrator Commands ===
All commands must start with * (asterisk)

Core Commands:
*help ............... Show this guide
*chat-mode .......... Start conversational mode
[... more commands ...]

=== Available Specialist Agents ===
[Dynamically list each agent in bundle:
*agent {id}: {title}
  When to use: {whenToUse}
  Key deliverables: {main outputs/documents}]

=== Available Workflows ===
[Dynamically list each workflow in bundle:
*workflow {id}: {name}
  Purpose: {description}]

💡 Tip: Each agent has unique tasks, templates, and checklists.
    Switch to an agent to access their capabilities!
```

### Core Configuration Loading

**Always Load on Activation**: `.bmad-core/core-config.yaml`

**Purpose**:
- Understand project structure
- Identify document locations
- Configure agent behavior
- Enable version compatibility (V3/V4)

**Configuration-Driven Behavior**:
- PRD sharding configuration
- Architecture sharding configuration
- Dev agent context files
- Debug and logging settings

## 10. Workflow Management System

### Dynamic Workflow Loading

**Implementation** (from workflow-management.md):

**Commands**:
- `/workflows` - List workflows in current bundle
- `/agent-list` - Show agents in current bundle
- `/workflow-start {workflow-id}` - Start workflow
- `/workflow-status` - Show progress
- `/workflow-resume` - Resume from last position
- `/workflow-next` - Show next agent/action

### Execution Flow

**Starting Workflow**:
```
1. Load workflow definition
2. Identify first stage
3. Transition to first agent
4. Guide artifact creation
```

**Stage Transitions**:
```
1. Mark current stage complete
2. Check transition conditions
3. Load next agent
4. Pass artifacts and context
```

**Artifact Tracking**:
```
Track in workflow_state:
- Artifact status
- Creator agent
- Creation timestamp
- Validation status
```

**Interruption Handling**:
```
1. Analyze provided artifacts
2. Determine current position
3. Suggest next step
4. Allow resumption
```

### Context Passing

**Information Transferred Between Agents**:
- Previous artifacts created
- Current workflow stage
- Expected outputs for this stage
- Decisions made in previous stages
- Constraints and requirements

### Multi-Path Workflow Handling

**Strategy**: Ask clarifying questions when paths diverge

**Example** (from greenfield-fullstack workflow):
```
- agent: ux-expert
  creates: v0_prompt (optional)
  condition: user_wants_ai_generation
  notes: "OPTIONAL BUT RECOMMENDED: Generate AI UI prompt..."
```

**Orchestrator Behavior**:
1. Reach decision point
2. Ask: "Would you like to generate an AI UI prompt for v0/Lovable?"
3. Based on answer, follow appropriate path
4. Record decision in workflow state

### Agent Integration

**Agents Should Be Workflow-Aware**:
- Know active workflow
- Understand their role in workflow
- Access artifacts from previous stages
- Understand expected outputs

## 11. Elicitation and Interaction Patterns

### Advanced Elicitation Methods

The orchestrator has access to **elicitation-methods.md** with 9 sophisticated techniques:

**Core Reflective Methods**:
1. Expand or Contract for Audience
2. Explain Reasoning (CoT Step-by-Step)
3. Critique and Refine

**Structural Analysis Methods**:
4. Analyze Logical Flow and Dependencies
5. Assess Alignment with Overall Goals

**Risk and Challenge Methods**:
6. Identify Potential Risks and Unforeseen Issues
7. Challenge from Critical Perspective

**Creative Exploration Methods**:
8. Tree of Thoughts Deep Dive
9. Hindsight is 20/20: The 'If Only...' Reflection

**Multi-Persona Collaboration Methods**:
- Agile Team Perspective Shift
- Stakeholder Round Table
- Meta-Prompting Analysis

**Advanced 2025 Techniques**:
- Self-Consistency Validation

### Interaction Modes

**1. Command Mode** (Default):
- Execute specific commands (`*help`, `*agent`, etc.)
- Direct and efficient
- Clear command syntax

**2. Chat Mode**:
- Conversational exploration
- Open-ended assistance
- Discovery-oriented

**3. KB Mode**:
- Educational and informative
- Topic-based learning
- Interactive Q&A

**4. Party Mode**:
- Multi-agent collaboration
- Brainstorming and ideation
- Synthesized perspectives

**5. Workflow Mode**:
- Structured multi-stage execution
- State-managed progression
- Guided handoffs

## 12. ADK Translation Considerations

### Vertex AI Agent Builder Mapping

**BMad-Orchestrator** → **Vertex AI Orchestrator Agent**

**Core Capabilities Required**:
```yaml
agent:
  id: "bmad-orchestrator"
  display_name: "BMad Master Orchestrator"
  model: "gemini-2.0-flash-001"  # Large context for team bundles
  persona:
    role: "Master Orchestrator & BMad Method Expert"
    style: "Knowledgeable, guiding, adaptable, efficient"
  capabilities:
    - agent_morphing: true
    - workflow_management: true
    - state_tracking: true
    - multi_agent_coordination: true
```

### Architecture Design

**Component: Orchestrator Service (Cloud Run)**

**Responsibilities**:
- Agent routing and transformation
- Workflow state management
- Session management
- Command processing
- Team bundle loading

**API Endpoints**:
```
POST /v1/orchestrator/command
  - Process commands (*help, *agent, *workflow, etc.)

POST /v1/orchestrator/transform
  - Transform into specialized agent
  - Load agent definition
  - Adopt persona

GET /v1/orchestrator/agents
  - List available agents in bundle

GET /v1/orchestrator/workflows
  - List available workflows

POST /v1/orchestrator/workflow/start
  - Start workflow execution
  - Initialize state

GET /v1/orchestrator/workflow/status
  - Get current workflow state

POST /v1/orchestrator/workflow/resume
  - Resume interrupted workflow
```

### Firestore Schema for Orchestrator

```
/sessions/{session_id}
  - orchestrator_state: "default" | "agent:{agent_id}" | "workflow:{workflow_id}"
  - current_agent: agent_id (if morphed)
  - active_workflow: workflow_id (if in workflow)
  - started_at: timestamp
  - last_activity: timestamp

/sessions/{session_id}/workflow_state
  - workflow_id: string
  - current_stage: int
  - completed_stages: array
  - artifacts: array[{name, creator, timestamp, status}]
  - decisions: object
  - next_agent: string

/sessions/{session_id}/context
  - messages: array (conversation history)
  - loaded_resources: array
  - active_mode: "command" | "chat" | "kb" | "party" | "workflow"
```

### Agent Morphing Implementation

**Challenge**: Vertex AI agents are typically statically defined, but orchestrator needs dynamic persona switching.

**Solution Approach 1: Multi-Agent Delegation**
```python
class OrchestratorAgent:
    def transform_to_agent(self, agent_id: str):
        # Load agent configuration
        agent_config = self.load_agent_config(agent_id)

        # Create or retrieve specialized agent
        specialized_agent = vertex_ai.Agent(config=agent_config)

        # Delegate conversation to specialized agent
        response = specialized_agent.invoke(user_message)

        # Return response with agent context
        return {
            "response": response,
            "active_agent": agent_id,
            "agent_name": agent_config.display_name
        }
```

**Solution Approach 2: Dynamic System Instructions**
```python
class OrchestratorAgent:
    def transform_to_agent(self, agent_id: str):
        # Load agent persona
        agent_persona = self.load_agent_persona(agent_id)

        # Update system instructions dynamically
        self.system_instructions = f"""
        You are now {agent_persona.display_name}.

        Role: {agent_persona.role}
        Style: {agent_persona.style}
        Principles: {agent_persona.core_principles}

        You have access to the following tools:
        {agent_persona.tools}

        Stay in character until user types *exit.
        """

        # Mark transformation in session state
        self.session_state.current_agent = agent_id
```

### Workflow State Management

**Implementation**: Cloud Firestore + Cloud Workflows

**Approach**:
```python
from google.cloud import firestore
from google.cloud import workflows

class WorkflowOrchestrator:
    def start_workflow(self, workflow_id: str, session_id: str):
        # Load workflow definition
        workflow_def = self.load_workflow(workflow_id)

        # Initialize state in Firestore
        workflow_state = {
            "workflow_id": workflow_id,
            "current_stage": 0,
            "completed_stages": [],
            "artifacts": [],
            "decisions": {},
            "started_at": firestore.SERVER_TIMESTAMP
        }

        db = firestore.Client()
        db.collection("sessions").document(session_id)\
          .collection("workflow_state").document(workflow_id)\
          .set(workflow_state)

        # Start first stage
        first_stage = workflow_def["sequence"][0]
        return self.transition_to_stage(session_id, workflow_id, 0)

    def transition_to_stage(self, session_id: str, workflow_id: str, stage_index: int):
        # Load workflow and state
        workflow_def = self.load_workflow(workflow_id)
        stage = workflow_def["sequence"][stage_index]

        # Check conditions
        if "condition" in stage:
            if not self.evaluate_condition(stage["condition"], session_id):
                # Skip to next stage
                return self.transition_to_stage(session_id, workflow_id, stage_index + 1)

        # Transform to agent or execute action
        if "agent" in stage:
            return self.transform_to_agent(stage["agent"], context={
                "workflow": workflow_id,
                "stage": stage_index,
                "expected_output": stage.get("creates"),
                "notes": stage.get("notes")
            })
        elif "step" in stage:
            return self.execute_step(stage, session_id)
```

### Knowledge Base Integration

**Implementation**: Vertex AI Search + RAG

**Approach**:
```python
from google.cloud import discoveryengine

class KnowledgeBaseMode:
    def __init__(self):
        self.search_client = discoveryengine.SearchServiceClient()
        self.kb_datastore = "projects/{project}/locations/global/collections/default_collection/dataStores/bmad-kb"

    def enter_kb_mode(self):
        # Present topic areas
        return {
            "message": "I've entered KB mode...",
            "topics": [
                {"id": 1, "name": "Setup & Installation", "query": "setup installation getting started"},
                {"id": 2, "name": "Workflows", "query": "workflows greenfield brownfield"},
                # ... 6 more topics
            ]
        }

    def answer_kb_question(self, query: str):
        # Search knowledge base
        request = discoveryengine.SearchRequest(
            serving_config=f"{self.kb_datastore}/servingConfigs/default_search",
            query=query,
            page_size=5
        )

        response = self.search_client.search(request)

        # Extract relevant context
        context = self.extract_context(response.results)

        # Generate focused answer using Gemini
        answer = self.generate_answer(query, context)

        # Suggest related topics
        related = self.suggest_related_topics(query)

        return {
            "answer": answer,
            "related_topics": related
        }
```

### Command Processing

**Implementation**: Cloud Function for Command Router

**Approach**:
```python
class CommandProcessor:
    def __init__(self):
        self.commands = {
            "help": self.show_help,
            "agent": self.transform_agent,
            "chat-mode": self.enter_chat_mode,
            "kb-mode": self.enter_kb_mode,
            "status": self.show_status,
            "workflow": self.start_workflow,
            "workflow-guidance": self.workflow_guidance,
            "yolo": self.toggle_yolo,
            "party-mode": self.enter_party_mode,
            "exit": self.exit_mode
        }

    def process_command(self, user_input: str, session_id: str):
        # Check for * prefix
        if not user_input.startswith("*"):
            # Try fuzzy matching
            return self.fuzzy_match_request(user_input, session_id)

        # Parse command
        parts = user_input[1:].split(maxsplit=1)
        command = parts[0]
        args = parts[1] if len(parts) > 1 else None

        # Execute command
        if command in self.commands:
            return self.commands[command](args, session_id)
        else:
            # Fuzzy match
            matches = self.fuzzy_match_command(command)
            if matches:
                return self.show_command_options(matches)
            else:
                return {"error": f"Unknown command: {command}"}

    def fuzzy_match_request(self, request: str, session_id: str):
        # Use LLM to match natural language to commands
        # Example: "draft story" → *create → create-next-story task
        # Example: "make a new prd" → *task create-doc + prd-tmpl

        # This requires intent classification
        intent = self.classify_intent(request)
        return self.execute_intent(intent, session_id)
```

### Team Bundle Loading

**Implementation**: Cloud Storage + Dynamic Loading

**Approach**:
```python
from google.cloud import storage

class TeamBundleLoader:
    def __init__(self):
        self.storage_client = storage.Client()
        self.bucket_name = "bmad-team-bundles"

    def load_team_bundle(self, team_id: str):
        # Load team configuration
        bucket = self.storage_client.bucket(self.bucket_name)

        # Load team definition
        team_blob = bucket.blob(f"teams/{team_id}/team-config.yaml")
        team_config = yaml.safe_load(team_blob.download_as_text())

        # Load all agents in team
        agents = {}
        for agent_id in team_config["agents"]:
            agent_blob = bucket.blob(f"agents/{agent_id}.md")
            agent_def = agent_blob.download_as_text()
            agents[agent_id] = self.parse_agent_definition(agent_def)

        # Load workflows
        workflows = {}
        for workflow_id in team_config["workflows"]:
            workflow_blob = bucket.blob(f"workflows/{workflow_id}.yaml")
            workflow_def = yaml.safe_load(workflow_blob.download_as_text())
            workflows[workflow_id] = workflow_def

        # Load shared resources
        resources = self.load_shared_resources(team_config["resources"])

        return {
            "team_id": team_id,
            "agents": agents,
            "workflows": workflows,
            "resources": resources
        }
```

### Challenges and Considerations

**1. Agent Morphing**
- **Challenge**: Vertex AI agents are typically statically configured
- **Solution**: Dynamic system instruction updates or multi-agent delegation pattern

**2. Conversation Context**
- **Challenge**: Maintaining context across agent transformations
- **Solution**: Firestore session state + context passing in system instructions

**3. Workflow State**
- **Challenge**: Complex multi-stage workflows with conditions
- **Solution**: Cloud Workflows + Firestore state management + Reasoning Engine

**4. Team Bundle Size**
- **Challenge**: Large bundles (all agents + resources) exceed token limits
- **Solution**: Lazy loading (load only active agent's dependencies) + Cloud Storage

**5. Command Processing**
- **Challenge**: Fuzzy matching natural language to commands
- **Solution**: LLM-based intent classification + command router

**6. Multi-Agent Coordination**
- **Challenge**: Party mode requires simultaneous agent interaction
- **Solution**: Agent pool + orchestrator synthesizes responses

### Recommended Architecture

**For BMad-Orchestrator in Vertex AI ADK**:

```
Web UI Client
    ↓
API Gateway (Apigee)
    ↓
Orchestrator Service (Cloud Run)
    ├── Command Router (Intent Classification)
    ├── Agent Morpher (Dynamic Persona Switching)
    ├── Workflow Engine (State Management)
    ├── KB Mode Handler (Search + RAG)
    └── Party Mode Coordinator (Multi-Agent Pool)
    ↓
├─→ Vertex AI Agent Pool (10 agents)
├─→ Cloud Workflows (Complex workflows)
├─→ Vertex AI Search (Knowledge base)
├─→ Cloud Storage (Team bundles, workflows)
└─→ Firestore (Session state, workflow state)
```

**Key Services**:
- **Cloud Run**: Orchestrator service with HTTP endpoints
- **Vertex AI Agent Builder**: 10 specialized agents
- **Cloud Workflows**: Multi-stage workflow execution
- **Firestore**: Session and workflow state persistence
- **Cloud Storage**: Team bundles and resource storage
- **Vertex AI Search**: Knowledge base RAG
- **Apigee**: API gateway for authentication and routing

## 13. Usage Patterns

### Typical User Journey in Web UI

**Journey 1: Greenfield Full-Stack Project**

```
1. User uploads team-fullstack.txt to Gemini
2. Gemini activates as BMad Orchestrator
3. Orchestrator: Greets and runs *help automatically
4. User: "I want to build a SaaS app"
5. Orchestrator: "Let me help guide you. I recommend the greenfield-fullstack workflow."
6. User: *workflow greenfield-fullstack
7. Orchestrator: "Starting workflow. Transforming into Analyst (Mary)..."
8. [As Analyst] Creates project brief
9. [Orchestrator] "Project brief complete. Transforming into PM (John)..."
10. [As PM] Creates PRD
11. [Orchestrator] "PRD complete. Transforming into UX Expert (Sally)..."
12. [As UX] Creates front-end spec
13. [Orchestrator] "Would you like to generate an AI UI prompt for v0/Lovable?"
14. User: "Yes"
15. [As UX] Generates v0 prompt
16. [Orchestrator] "Transforming into Architect (Winston)..."
17. [As Architect] Creates fullstack architecture
18. [Orchestrator] "Transforming into PO (Sarah)..."
19. [As PO] Validates all artifacts
20. [Orchestrator] "Planning phase complete! Copy docs to your project and switch to IDE for development."
```

**Journey 2: Quick Question About BMad**

```
1. User: *kb-mode
2. Orchestrator: Shows 8 topic areas
3. User: "2" (selects Workflows)
4. Orchestrator: Explains workflow types with examples
5. User: "What's the difference between greenfield and brownfield?"
6. Orchestrator: Focused answer with examples
7. Orchestrator: "Related topics: Documents, Agents, Best Practices"
8. User: *exit
9. Orchestrator: "Exiting KB mode. How else can I help?"
```

**Journey 3: Agent Consultation**

```
1. User: "I need help creating a PRD"
2. Orchestrator: "Perfect! Let me transform into John - Product Manager."
3. [As PM] "I'll help create a comprehensive PRD. Let me run the create-doc task..."
4. [As PM] Interactive PRD creation
5. User: *exit
6. [Orchestrator] "Returned to orchestrator. The PRD is complete."
```

**Journey 4: Party Mode Brainstorming**

```
1. User: *party-mode
2. Orchestrator: "Entering party mode! All agents are here to collaborate."
3. User: "Should we use microservices or monolith for this project?"
4. [Orchestrator facilitates]
   - Architect: "Microservices for scalability..."
   - Dev: "Monolith for faster initial development..."
   - PM: "Consider time-to-market and team size..."
   - PO: "What are the long-term maintenance implications?"
5. Orchestrator: Synthesizes recommendations
6. User: *exit
```

### When NOT to Use Orchestrator

**Use Specialized Agents Directly When**:
- In IDE environment (use bmad-master or specific agents)
- Single-agent task (no coordination needed)
- Direct file operations required
- Development workflow execution (SM → Dev → QA)

**Use BMad-Master When**:
- IDE environment
- KB mode learning
- Task execution without persona preference
- Single conversation comprehensive work

## 14. Summary

### Key Characteristics

**BMad-Orchestrator is**:
- **Web UI Specialist**: Optimized for ChatGPT, Gemini, Claude web
- **Agent Coordinator**: Morphs into any of 10 specialized agents
- **Workflow Manager**: Executes 6 predefined multi-agent workflows
- **Knowledge Base**: Interactive guide to BMad Method
- **Team Leader**: Facilitates multi-agent collaboration (party mode)
- **State Manager**: Tracks workflow progress and artifacts
- **Lazy Loader**: Loads resources only when needed

**BMad-Orchestrator is NOT**:
- IDE-optimized (use bmad-master instead)
- Direct code executor (transforms into dev agent)
- File system operator (delegates to specialized agents)
- Pre-loaded with all dependencies (lazy loading)

### Unique Value Proposition

The orchestrator provides **the best of both worlds**:
1. **Single Entry Point**: One agent interface to entire BMad ecosystem
2. **Specialized Execution**: Full persona transformation for quality outputs
3. **Guided Workflows**: Step-by-step multi-agent orchestration
4. **Flexible Interaction**: Command mode, chat mode, KB mode, party mode
5. **Context Efficiency**: Lazy loading preserves token budget

### Integration with BMad Ecosystem

**Role in Framework**:
- **Primary agent** in team bundles for web UI
- **Workflow coordinator** for planning phase
- **Knowledge base** for BMad learning
- **Agent router** for specialized task execution
- **Context manager** for heavyweight documents

**Relationship to Other Agents**:
- Transforms into: All 10 specialized agents
- Coordinates: Multi-agent workflows
- Complements: bmad-master (orchestrator for web, master for IDE)
- Enables: Seamless web-to-IDE transition

---

**Analysis Complete**
**Document Version**: 1.0
**Analysis Date**: 2025-10-14
**Analyst**: Claude Code (AI Agent)
**Lines**: 1,600+
**Sections**: 14
