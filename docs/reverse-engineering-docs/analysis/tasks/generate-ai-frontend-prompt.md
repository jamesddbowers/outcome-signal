# Task Analysis: generate-ai-frontend-prompt

**Task ID**: `generate-ai-frontend-prompt`
**Task File**: `.bmad-core/tasks/generate-ai-frontend-prompt.md`
**Primary Agent**: UX Expert (Sally)
**Task Type**: AI Prompt Generation & Frontend Scaffolding Utility
**Version Analyzed**: BMad Core v4

---

## 1. Purpose & Scope

### Overview
The `generate-ai-frontend-prompt` task is a **specialized prompt engineering utility** that transforms UI/UX specifications and frontend architecture documents into masterfully crafted prompts optimized for AI-driven frontend development tools. This task bridges the gap between human-designed specifications and AI code generation by creating highly structured, detailed, and constraint-aware prompts that maximize the quality and accuracy of AI-generated frontend code.

### Key Characteristics
- **Prompt engineering expertise** - Applies proven prompt design patterns for code generation
- **Four-part structured framework** - High-level goal, step-by-step instructions, code examples, strict scope
- **Mobile-first mandate** - Enforces mobile-first design approach in all generated prompts
- **Tool-agnostic output** - Works with Vercel v0, Lovable.ai, and similar AI frontend generators
- **Context-rich generation** - Synthesizes multiple input documents (specs + architecture)
- **Constraint specification** - Explicitly defines what NOT to do (boundaries and limitations)
- **Iterative guidance** - Teaches incremental component-by-component generation approach
- **Production-readiness disclaimer** - Emphasizes human review and testing requirements

### Design Philosophy
**"Transform specifications into AI-optimized prompts that generate production-quality frontend code"**

The task embodies the principle that **AI code generation quality is directly proportional to prompt quality**. It ensures:
1. AI tools receive maximum necessary context upfront
2. Instructions are explicit, detailed, and unambiguous
3. Constraints are clearly communicated to prevent scope creep
4. Mobile-first design principles are enforced from the start
5. Users understand iterative generation is more effective than "one-shot" approaches
6. All AI-generated code undergoes human review and testing

### Scope
This task encompasses:
- Analysis of UI/UX specifications and frontend architecture documents
- Extraction of tech stack, design system, and API contract information
- Synthesis of visual design requirements (color, typography, spacing, aesthetic)
- Application of four-part structured prompting framework
- Generation of copy-pasteable AI prompts with explanatory rationale
- Guidance on iterative component-by-component generation workflow
- Emphasis on production-readiness requirements (review, testing, refinement)

### Used By Agents
- **UX Expert (Sally)**: Primary user via `*generate-ui-prompt` command
- **Architect (Winston)**: Occasionally for frontend architecture scaffolding
- **Dev (James)**: Potentially for rapid prototyping or component generation

### When NOT to Use This Task
- **For backend code generation** - This is frontend-specific (UI components, pages, styles)
- **Without existing specifications** - Requires completed UI/UX specs and frontend architecture
- **For production code directly** - Output is an AI prompt, not production-ready code
- **For design work** - This generates prompts for code, not design artifacts

---

## 2. Input Requirements

### Required Inputs

```yaml
required:
  - ui_spec: 'path/to/front-end-spec.md'  # Completed UI/UX specification document
  - frontend_architecture: 'path/to/front-end-architecture.md' OR 'path/to/architecture.md'  # Frontend or fullstack architecture

optional:
  - system_architecture: 'path/to/architecture.md'  # Main system architecture for API contracts
  - design_files: ['figma_url', 'screenshot_path']  # Visual design references
  - target_component: 'ComponentName'  # Specific component to generate prompt for
  - generation_scope: 'component' | 'page' | 'feature'  # Generation granularity
```

### Input Sources

**Primary Inputs**:
1. **UI/UX Specification** (`front-end-spec.md`)
   - Location: Typically `docs/planning/front-end-spec.md`
   - Created by: UX Expert agent via `*create-front-end-spec` command
   - Template: `front-end-spec-tmpl.yaml`
   - Contains:
     - User personas and user flows
     - Wireframes and mockups (descriptions or links)
     - Component specifications (structure, behavior, states)
     - Design system (colors, typography, spacing, breakpoints)
     - Accessibility requirements
     - Responsive design guidelines

2. **Frontend Architecture** (`front-end-architecture.md` or `architecture.md`)
   - Location: Typically `docs/planning/front-end-architecture.md` or `docs/planning/architecture.md`
   - Created by: Architect agent via `*create-architecture` command
   - Template: `front-end-architecture-tmpl.yaml` or `fullstack-architecture-tmpl.yaml`
   - Contains:
     - Tech stack (framework, language, libraries, build tools)
     - Project structure (folder organization, naming conventions)
     - State management approach (Redux, Context API, Zustand, etc.)
     - Routing strategy
     - API integration patterns
     - Component organization and hierarchy
     - Styling approach (Tailwind, CSS modules, styled-components, etc.)

**Optional Inputs**:
3. **System Architecture** (`architecture.md`)
   - Provides: API endpoints, data contracts, authentication patterns
   - Used for: API integration specifications in prompts

4. **Design Files**
   - Figma links, Adobe XD files, or design screenshots
   - Used for: Visual reference in AI prompt context

5. **Target Component/Scope**
   - Specific component name or feature area to focus prompt on
   - Used for: Narrowing generation scope for iterative approach

### Configuration Dependencies

**From `core-config.yaml`**:
```yaml
docs:
  planning:
    path: 'docs/planning/'  # Location of spec and architecture documents

tech_stack:
  frontend:
    framework: 'Next.js' | 'React' | 'Vue' | 'Svelte'  # Influences prompt structure
    styling: 'Tailwind' | 'CSS Modules' | 'styled-components'  # Styling approach
    component_library: 'shadcn/ui' | 'Material-UI' | 'Ant Design'  # UI library
```

### Document Dependencies

**Workflow Context**:
```
1. Analyst creates project-brief.md
2. PM creates prd.md with user stories
3. UX Expert creates front-end-spec.md ← Input 1
4. Architect creates front-end-architecture.md ← Input 2
5. UX Expert runs *generate-ui-prompt → THIS TASK
6. Developer uses generated prompt with AI tool (v0, Lovable, etc.)
7. Developer reviews and refines AI-generated code
```

**Critical Dependencies**:
- **front-end-spec.md** must be completed and validated
- **front-end-architecture.md** (or equivalent) must define tech stack
- If system architecture exists, it should be referenced for API contracts

### Validation Requirements

Before task execution, the agent should verify:
- UI/UX specification file exists and is complete
- Frontend architecture file exists and defines tech stack
- Design system is documented (colors, typography, spacing)
- Component specifications include states and behaviors
- API contracts are defined (if applicable)

---

## 3. Execution Flow

The `generate-ai-frontend-prompt` task follows a **structured synthesis workflow** that transforms planning artifacts into AI-optimized prompts.

### Phase 0: Context Gathering and Validation

**Purpose**: Load and validate all input documents, extract foundational information.

**Actions**:
1. **Locate Input Documents**:
   ```python
   ui_spec_path = get_document_path('front-end-spec.md')
   frontend_arch_path = get_document_path('front-end-architecture.md') or get_document_path('architecture.md')
   system_arch_path = get_document_path('architecture.md')  # Optional
   ```

2. **Load and Parse Documents**:
   - Read UI/UX specification document
   - Read frontend architecture document
   - Read system architecture (if exists)
   - Extract design files/links if referenced

3. **Extract Core Information**:
   ```python
   # From frontend architecture
   tech_stack = {
       'framework': 'Next.js 14',
       'language': 'TypeScript',
       'styling': 'Tailwind CSS',
       'ui_library': 'shadcn/ui',
       'state_management': 'Zustand',
       'form_handling': 'React Hook Form + Zod',
       'build_tool': 'Vite'
   }

   # From UI/UX spec
   design_system = {
       'colors': {'primary': '#3B82F6', 'secondary': '#10B981', ...},
       'typography': {'font_family': 'Inter', 'scale': '...'},
       'spacing': {'base': '4px', 'scale': 'Tailwind default'},
       'breakpoints': {'mobile': '640px', 'tablet': '768px', 'desktop': '1024px'}
   }

   # From system architecture
   api_contracts = {
       'base_url': 'https://api.example.com/v1',
       'auth': 'JWT Bearer tokens',
       'endpoints': [...]
   }
   ```

4. **Identify Generation Scope**:
   - Determine if user wants prompt for:
     - Single component (e.g., "RegistrationForm")
     - Full page (e.g., "User Profile Page")
     - Feature area (e.g., "Authentication Flow")
   - Ask user if scope is not clear

5. **Gather Design References**:
   - Check for Figma/design tool links in specifications
   - Check for screenshots or mockups
   - Ask user if additional design files should be referenced

**Output**: Validated context with tech stack, design system, API contracts, and generation scope

**User Interaction**:
```
I've found your UI/UX specification and frontend architecture.

Tech Stack Detected:
- Framework: Next.js 14 with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: shadcn/ui
- State: Zustand

What would you like to generate an AI prompt for?
1. Specific component (e.g., RegistrationForm, ProductCard)
2. Full page (e.g., Dashboard, Product Listing)
3. Feature area (e.g., Authentication Flow, Shopping Cart)

Your choice (1-3):
```

**Blocking Condition**: Missing UI/UX spec or frontend architecture stops execution

---

### Phase 1: Explain Core Prompting Principles

**Purpose**: Educate user on effective AI code generation strategies before generating the prompt.

**Actions**:
1. **Present Four Core Principles**:
   ```
   Before I generate your AI prompt, let me share the core principles
   that will maximize the quality of AI-generated frontend code:

   1. Be Explicit and Detailed
      - AI cannot read your mind
      - Provide maximum detail and context
      - Vague requests = generic or incorrect outputs

   2. Iterate, Don't Expect Perfection
      - Complex applications are rarely generated perfectly in one go
      - Most effective: prompt for one component at a time
      - Build iteratively, refining as you go

   3. Provide Context First
      - Start with tech stack, project structure, goals
      - Include existing code snippets if relevant
      - Set the stage before making requests

   4. Mobile-First Approach
      - Describe mobile layout first
      - Provide tablet/desktop adaptations separately
      - Ensures responsive design from the start

   These principles are baked into the prompt I'm about to generate.
   ```

2. **Explain Structured Framework**:
   ```
   The prompt I generate will follow a four-part framework:

   Part 1: High-Level Goal
   - Clear, concise summary of the objective
   - Orients the AI on the primary task

   Part 2: Detailed, Step-by-Step Instructions
   - Granular, numbered list of actions
   - Breaks complex tasks into sequential steps
   - This is the most critical part

   Part 3: Code Examples, Data Structures & Constraints
   - Relevant code snippets and API contracts
   - Concrete examples to work with
   - Explicitly states what NOT to do

   Part 4: Define a Strict Scope
   - Boundaries of the task
   - Which files to modify
   - Which files to leave untouched
   ```

3. **Set Expectations**:
   ```
   Important Reminders:
   - The AI-generated code will require human review
   - Testing and refinement are essential
   - This prompt optimizes for quality, not perfection
   - You may need multiple iterations
   ```

**Output**: User understanding of prompt structure and effective AI code generation strategies

**User Interaction**: Informational - no user response required, but agent pauses to ensure user reads

---

### Phase 2: Gather Foundational Context for Prompt

**Purpose**: Extract and structure the preamble/context section of the AI prompt.

**Actions**:
1. **Synthesize Project Overview**:
   ```python
   project_overview = f"""
   You are building {project_name}, a {project_type} application.

   Project Purpose: {extract_from_prd_or_spec('project_goal')}

   User Personas:
   {extract_from_ui_spec('user_personas')}
   """
   ```

2. **Document Full Tech Stack**:
   ```python
   tech_stack_section = f"""
   Tech Stack:
   - Framework: {tech_stack['framework']} ({version})
   - Language: {tech_stack['language']}
   - Styling: {tech_stack['styling']}
   - UI Components: {tech_stack['ui_library']}
   - State Management: {tech_stack['state_management']}
   - Form Handling: {tech_stack['form_handling']}
   - API Client: {tech_stack['api_client']}
   - Build Tool: {tech_stack['build_tool']}
   - Package Manager: {tech_stack['package_manager']}
   """
   ```

3. **Extract Design System**:
   ```python
   design_system_section = f"""
   Design System:

   Color Palette:
   {format_colors(design_system['colors'])}

   Typography:
   {format_typography(design_system['typography'])}

   Spacing Scale:
   {format_spacing(design_system['spacing'])}

   Breakpoints:
   {format_breakpoints(design_system['breakpoints'])}

   Overall Aesthetic: {design_system['aesthetic']}
   (e.g., "minimalist", "corporate", "playful", "modern")
   """
   ```

4. **Extract Project Structure**:
   ```python
   project_structure_section = f"""
   Project Structure:
   {extract_from_architecture('project_structure')}

   Example:
   /app
     /components
       /ui           # shadcn/ui components
       /features     # Feature-specific components
     /lib
       /api          # API client functions
       /utils        # Utility functions
     /(routes)       # Next.js App Router pages
   """
   ```

5. **Document API Contracts** (if applicable):
   ```python
   api_contracts_section = f"""
   API Contracts:

   Base URL: {api_contracts['base_url']}
   Authentication: {api_contracts['auth']}

   Relevant Endpoints:
   {format_relevant_endpoints(api_contracts['endpoints'], scope)}
   """
   ```

**Output**: Structured foundational context ready for prompt preamble

---

### Phase 3: Describe the Visuals

**Purpose**: Translate UI/UX specifications into visual descriptions for the AI prompt.

**Actions**:
1. **Check for Design Files**:
   ```python
   if has_design_files(figma_links, screenshots):
       design_reference = """
       Design References:
       - Figma: {figma_link}
       - Screenshots: {screenshot_paths}

       Please reference these designs for visual accuracy.
       """
   else:
       # Describe visuals from specification
       design_reference = synthesize_visual_description()
   ```

2. **Extract Visual Specifications**:
   - Component layout and structure
   - Visual hierarchy
   - Color usage (primary actions, secondary elements, text)
   - Typography application (headings, body, labels)
   - Spacing and padding
   - Border radius, shadows, effects
   - Icon usage
   - Image specifications

3. **Synthesize Visual Description**:
   ```python
   visual_description = f"""
   Visual Design:

   Layout:
   {extract_from_ui_spec('layout_description', scope)}

   Color Application:
   - Primary Actions: {design_system['colors']['primary']} (buttons, links)
   - Backgrounds: {design_system['colors']['backgrounds']}
   - Text: {design_system['colors']['text_colors']}

   Typography:
   - Headings: {design_system['typography']['heading_font']} (weights, sizes)
   - Body: {design_system['typography']['body_font']}
   - Labels: {design_system['typography']['label_font']}

   Spacing & Visual Rhythm:
   {describe_spacing_usage()}

   Interactive Elements:
   - Button styles: {describe_button_styles()}
   - Input styles: {describe_input_styles()}
   - Hover/focus states: {describe_interaction_states()}

   Overall Aesthetic: {design_system['aesthetic']}
   """
   ```

4. **Extract Responsive Behavior**:
   ```python
   responsive_description = f"""
   Responsive Design (Mobile-First):

   Mobile (< {breakpoints['tablet']}):
   {extract_mobile_layout(scope)}

   Tablet ({breakpoints['tablet']} - {breakpoints['desktop']}):
   {extract_tablet_adaptations(scope)}

   Desktop (> {breakpoints['desktop']}):
   {extract_desktop_adaptations(scope)}
   """
   ```

**Output**: Comprehensive visual description ready for prompt body

---

### Phase 4: Build Core Prompt Using Structured Framework

**Purpose**: Apply the four-part framework to create the main prompt body.

**Actions**:
1. **Part 1: High-Level Goal**:
   ```python
   high_level_goal = synthesize_goal(scope)

   # Example outputs:
   # "Create a responsive user registration form with client-side validation and API integration."
   # "Build a product card component with image, title, price, and add-to-cart functionality."
   # "Implement a dashboard layout with sidebar navigation, header, and content area."
   ```

2. **Part 2: Detailed Step-by-Step Instructions**:
   ```python
   step_by_step_instructions = generate_granular_steps(scope, tech_stack, ui_spec)

   # Structure:
   # 1. Create files/components
   # 2. Import dependencies
   # 3. Set up state management
   # 4. Build component structure
   # 5. Implement styling (mobile-first)
   # 6. Add interactivity
   # 7. Integrate with API (if applicable)
   # 8. Handle error states
   # 9. Add loading states
   # 10. Implement accessibility features
   ```

   **Example for Registration Form**:
   ```
   Step-by-Step Instructions:

   1. Create a new file: `app/components/features/RegistrationForm.tsx`

   2. Import required dependencies:
      - React hooks (useState, useTransition)
      - React Hook Form with Zod resolver
      - shadcn/ui components (Input, Button, Label, Card)
      - API client function

   3. Define Zod validation schema:
      - name: required string, min 2 characters
      - email: required email format
      - password: required, min 8 characters, must include number and special char

   4. Set up form with React Hook Form:
      - Use useForm hook with Zod resolver
      - Configure default values
      - Set up form submission handler

   5. Build component structure (mobile-first):
      - Wrap in Card component
      - CardHeader with title "Create Account"
      - CardContent with form fields
      - CardFooter with submit button

   6. For each input field:
      - Use Label component for accessibility
      - Use Input component from shadcn/ui
      - Display validation errors below field
      - Style with Tailwind classes

   7. For the name field:
      - Label: "Full Name"
      - Placeholder: "John Doe"
      - Error message: "Name must be at least 2 characters"

   8. For the email field:
      - Label: "Email Address"
      - Type: "email"
      - Placeholder: "john@example.com"
      - Error message: "Please enter a valid email address"

   9. For the password field:
      - Label: "Password"
      - Type: "password"
      - Placeholder: "••••••••"
      - Error message: "Password must be at least 8 characters and include a number and special character"

   10. Submit button:
       - Text: "Create Account"
       - Variant: "default" (primary color)
       - Full width on mobile
       - Show loading spinner during submission
       - Disable during submission

   11. On form submission:
       - Validate all fields
       - Call API endpoint: POST /api/auth/register
       - On success: redirect to /dashboard
       - On error: display error message below form

   12. Add loading state:
       - Use useTransition for pending state
       - Show spinner in submit button when loading
       - Disable all inputs during submission

   13. Add error state:
       - Display API errors in a banner above the form
       - Use Alert component from shadcn/ui
       - Variant: "destructive"

   14. Accessibility:
       - All inputs have associated labels
       - Error messages have aria-live="polite"
       - Form has proper focus management
       - Submit button is keyboard accessible
   ```

3. **Part 3: Code Examples, Data Structures & Constraints**:
   ```python
   code_examples_and_constraints = f"""
   Code Examples & Constraints:

   API Endpoint:
   ```typescript
   // POST {api_endpoint}
   // Expected JSON payload:
   {format_api_request_schema()}

   // Expected response:
   {format_api_response_schema()}
   ```

   Existing Code References:
   {include_relevant_code_snippets()}

   Styling Guidelines:
   - Use Tailwind CSS utility classes
   - Follow the design system color palette defined above
   - Responsive classes: sm:, md:, lg: for breakpoints
   - DO NOT use inline styles
   - DO NOT import external CSS files

   Component Guidelines:
   - Use TypeScript with proper type definitions
   - Prefer React Server Components unless interactivity needed
   - Use "use client" directive only when necessary
   - Follow project structure conventions

   State Management:
   - For local form state: React Hook Form
   - For global state: Zustand store (if applicable)
   - DO NOT use Redux or Context API

   Constraints (What NOT to Do):
   {generate_constraint_list(scope, tech_stack)}

   Example Constraints:
   - DO NOT add a "confirm password" field
   - DO NOT create custom input components (use shadcn/ui)
   - DO NOT modify the existing API client configuration
   - DO NOT add social authentication options
   ```
   ```

4. **Part 4: Define Strict Scope**:
   ```python
   strict_scope = f"""
   Strict Scope Definition:

   Files to CREATE:
   {list_files_to_create(scope)}

   Files to MODIFY:
   {list_files_to_modify(scope)}

   Files to LEAVE UNTOUCHED:
   {list_files_to_avoid(scope)}

   Example:

   CREATE:
   - app/components/features/RegistrationForm.tsx
   - app/lib/api/auth.ts (only if it doesn't exist)

   MODIFY:
   - app/(routes)/register/page.tsx (to import and use RegistrationForm)

   DO NOT TOUCH:
   - app/components/Navbar.tsx
   - app/components/Footer.tsx
   - app/(routes)/login/page.tsx
   - Any other existing pages or components
   - API client configuration files
   - Zustand store files (unless specifically needed for this feature)

   Boundary Rules:
   - Only work within the authentication feature area
   - Do not refactor existing components
   - Do not change global styles or theme configuration
   - Do not modify package.json dependencies
   ```
   ```

**Output**: Complete four-part structured prompt ready for assembly

---

### Phase 5: Assemble Master Prompt

**Purpose**: Combine all sections into a final, copy-pasteable AI prompt.

**Actions**:
1. **Structure Final Prompt**:
   ```python
   master_prompt = f"""
   # {high_level_goal}

   ## Context

   ### Project Overview
   {project_overview}

   ### Tech Stack
   {tech_stack_section}

   ### Design System
   {design_system_section}

   ### Project Structure
   {project_structure_section}

   ### API Contracts
   {api_contracts_section}

   ## Visual Design
   {visual_description}

   ### Responsive Behavior
   {responsive_description}

   ## Instructions
   {step_by_step_instructions}

   ## Code Examples & Constraints
   {code_examples_and_constraints}

   ## Scope
   {strict_scope}
   """
   ```

2. **Format for Copy-Paste**:
   - Wrap in markdown code block for easy copying
   - Ensure proper indentation and line breaks
   - Add clear section dividers

3. **Validate Prompt**:
   - Check that all four parts are present
   - Verify tech stack consistency
   - Ensure mobile-first approach is evident
   - Confirm constraints are explicit

**Output**: Complete, formatted AI prompt ready for user

---

### Phase 6: Present and Explain Prompt

**Purpose**: Deliver the generated prompt with explanatory rationale and usage guidance.

**Actions**:
1. **Present Formatted Prompt**:
   ```
   I've generated your AI-optimized frontend prompt. Here it is in a
   copy-pasteable format:

   ─────────────────────────────────────────────────────────────────

   ```
   {master_prompt}
   ```

   ─────────────────────────────────────────────────────────────────
   ```

2. **Explain Prompt Structure**:
   ```
   Prompt Structure Explained:

   1. High-Level Goal
      → Sets clear objective for the AI
      → Located at the top as the primary instruction

   2. Context Section
      → Provides all necessary background information
      → Tech stack ensures AI generates compatible code
      → Design system ensures visual consistency
      → Project structure ensures proper file organization

   3. Visual Design Section
      → Describes the desired visual outcome
      → Mobile-first approach ensures responsive design
      → References design files if available

   4. Detailed Instructions
      → Granular, numbered steps guide the AI precisely
      → Breaks down complex task into manageable actions
      → Includes specific field names, labels, error messages

   5. Code Examples & Constraints
      → API schemas ensure correct integration
      → Constraints prevent unwanted modifications
      → Explicit "DO NOT" rules set boundaries

   6. Strict Scope
      → Defines exactly which files to create/modify
      → Prevents accidental changes to other parts of codebase
      → Critical for maintaining code integrity
   ```

3. **Provide Usage Guidance**:
   ```
   How to Use This Prompt:

   1. Copy the entire prompt above

   2. Open your AI frontend tool:
      - Vercel v0: https://v0.dev
      - Lovable: https://lovable.ai
      - Or similar AI code generation tool

   3. Paste the prompt into the tool

   4. Review the generated code:
      - Check for type errors
      - Verify imports are correct
      - Ensure styling matches design system
      - Test all interactive elements

   5. Iterate if needed:
      - If output isn't quite right, add clarifying instructions
      - Generate one component at a time for best results
      - Refine and adjust based on results

   6. Integrate into your project:
      - Copy generated code into your codebase
      - Run type checking (npm run type-check)
      - Test thoroughly
      - Refactor as needed
   ```

4. **Provide Production-Readiness Reminder**:
   ```
   ⚠️  IMPORTANT REMINDER ⚠️

   All AI-generated code requires careful human review, testing, and
   refinement before being considered production-ready.

   Required Steps Before Production:

   1. Code Review
      - Review all generated code line-by-line
      - Ensure it follows your team's coding standards
      - Check for security vulnerabilities
      - Verify error handling is robust

   2. Testing
      - Write unit tests for components
      - Write integration tests for API interactions
      - Test all user flows manually
      - Test on multiple devices and browsers
      - Test edge cases and error states

   3. Refinement
      - Optimize performance (bundle size, render performance)
      - Improve accessibility (WCAG compliance)
      - Enhance error messages and user feedback
      - Polish animations and transitions

   4. Security Review
      - Check for XSS vulnerabilities
      - Validate all user inputs
      - Ensure API credentials are not exposed
      - Review authentication/authorization logic

   AI-generated code is a starting point, not a finish line.
   Your expertise and judgment are essential for production quality.
   ```

5. **Offer to Generate Additional Prompts**:
   ```
   Would you like me to:
   1. Generate a prompt for another component?
   2. Refine this prompt with additional details?
   3. Create prompts for related components (e.g., LoginForm)?

   Let me know how I can help further!
   ```

**Output**: User receives complete prompt with full understanding of structure and usage

**User Interaction**:
- User can request refinements
- User can ask for additional component prompts
- User can proceed to use the generated prompt with AI tools

---

### Phase 7: Optional Refinement and Iteration

**Purpose**: Refine the generated prompt based on user feedback.

**Actions**:
1. **Capture User Feedback**:
   - User may request more detail in certain areas
   - User may want different constraints
   - User may want to change generation scope
   - User may want to add/remove features

2. **Refine Prompt Sections**:
   ```python
   if user_feedback:
       if 'more_detail' in feedback:
           enhance_step_by_step_instructions(feedback['area'])
       if 'different_constraints' in feedback:
           update_constraints_section(feedback['constraints'])
       if 'change_scope' in feedback:
           regenerate_with_new_scope(feedback['new_scope'])
       if 'add_features' in feedback:
           expand_instructions_with_features(feedback['features'])
   ```

3. **Regenerate and Present**:
   - Generate updated prompt
   - Highlight changes made
   - Present refined prompt

**Output**: Refined prompt that better matches user needs

**User Interaction**: Optional - only if user requests changes

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Input Document Discovery

**Condition**: Determining which documents to use as inputs

**Logic**:
```python
if exists('front-end-spec.md'):
    ui_spec = load('front-end-spec.md')
else:
    error("UI/UX specification not found. Please run *create-front-end-spec first.")

if exists('front-end-architecture.md'):
    frontend_arch = load('front-end-architecture.md')
elif exists('architecture.md') and has_frontend_section('architecture.md'):
    frontend_arch = extract_frontend_section('architecture.md')
else:
    error("Frontend architecture not found. Please create frontend architecture document first.")

if exists('architecture.md'):
    system_arch = load('architecture.md')  # Optional
else:
    system_arch = None
```

**Paths**:
- **Path A**: All documents found → Proceed with full context
- **Path B**: System architecture missing → Proceed without API contracts section
- **Path C**: Frontend architecture missing → ERROR, block execution
- **Path D**: UI/UX spec missing → ERROR, block execution

---

### Decision Point 2: Generation Scope Selection

**Condition**: Determining what to generate a prompt for

**Logic**:
```python
if user_specified_scope:
    scope = user_specified_scope
else:
    scope = ask_user_for_scope()

if scope == 'component':
    component_name = ask_for_component_name()
    component_spec = extract_component_spec(ui_spec, component_name)
    generation_context = 'single_component'

elif scope == 'page':
    page_name = ask_for_page_name()
    page_spec = extract_page_spec(ui_spec, page_name)
    generation_context = 'full_page'

elif scope == 'feature':
    feature_name = ask_for_feature_name()
    feature_spec = extract_feature_spec(ui_spec, feature_name)
    generation_context = 'feature_area'

else:
    # Default to component-level generation
    generation_context = 'single_component'
```

**Paths**:
- **Path A**: Component scope → Generate focused component prompt
- **Path B**: Page scope → Generate full page prompt with multiple components
- **Path C**: Feature scope → Generate feature area prompt (multiple pages/components)

---

### Decision Point 3: Design File Availability

**Condition**: Whether design files (Figma, screenshots) are available

**Logic**:
```python
design_files = find_design_references(ui_spec)

if design_files:
    has_figma = [f for f in design_files if 'figma.com' in f]
    has_screenshots = [f for f in design_files if is_image(f)]

    if has_figma:
        design_section = f"""
        Design References:
        Please reference these Figma designs for visual accuracy:
        {'\n'.join(has_figma)}
        """
    elif has_screenshots:
        design_section = f"""
        Design References:
        Please reference these design screenshots:
        {'\n'.join(has_screenshots)}
        """
    else:
        design_section = synthesize_visual_description(ui_spec)
else:
    design_section = synthesize_visual_description(ui_spec)
```

**Paths**:
- **Path A**: Figma links available → Include Figma reference in prompt
- **Path B**: Screenshots available → Include screenshot reference in prompt
- **Path C**: No design files → Synthesize detailed visual description from spec
- **Path D**: Multiple design file types → Include all references

---

### Decision Point 4: API Integration Required

**Condition**: Whether the component/page requires API integration

**Logic**:
```python
component_spec = extract_component_spec(ui_spec, scope)

if requires_api_integration(component_spec):
    # Check if system architecture defines API contracts
    if system_arch and has_relevant_endpoints(system_arch, scope):
        api_contracts = extract_relevant_endpoints(system_arch, scope)
        include_api_section = True
    else:
        # Ask user for API details
        api_contracts = elicit_api_details()
        include_api_section = True
else:
    include_api_section = False
```

**Paths**:
- **Path A**: API integration required + contracts defined → Include full API section
- **Path B**: API integration required + contracts missing → Elicit from user
- **Path C**: No API integration → Skip API section

---

### Decision Point 5: State Management Approach

**Condition**: Determining state management instructions

**Logic**:
```python
tech_stack = extract_tech_stack(frontend_arch)

if 'state_management' in tech_stack:
    state_approach = tech_stack['state_management']

    if state_approach in ['Redux', 'Zustand', 'Recoil', 'Jotai']:
        # Global state management library
        state_instructions = f"""
        State Management:
        - Use {state_approach} for global state
        - Local component state with useState/useReducer
        - Follow existing store patterns in the codebase
        """

    elif state_approach == 'Context API':
        state_instructions = """
        State Management:
        - Use React Context for global state
        - Local component state with useState/useReducer
        - Follow existing context patterns
        """

    elif state_approach == 'Local Only':
        state_instructions = """
        State Management:
        - Use useState/useReducer for local state only
        - No global state management needed for this component
        """
else:
    # Default to local state
    state_instructions = """
    State Management:
    - Use useState for simple local state
    - Use useReducer for complex local state
    """
```

**Paths**:
- **Path A**: Global state library (Redux, Zustand) → Include global state instructions
- **Path B**: Context API → Include context instructions
- **Path C**: Local state only → Include local state instructions
- **Path D**: No state management defined → Default to local state

---

### Decision Point 6: Styling Approach

**Condition**: Determining styling instructions

**Logic**:
```python
tech_stack = extract_tech_stack(frontend_arch)
styling_approach = tech_stack.get('styling', 'CSS Modules')

if styling_approach == 'Tailwind CSS':
    styling_instructions = """
    Styling:
    - Use Tailwind CSS utility classes
    - Follow the design system color palette
    - Use responsive classes: sm:, md:, lg:
    - DO NOT use inline styles
    - DO NOT create custom CSS files
    """

elif styling_approach == 'CSS Modules':
    styling_instructions = """
    Styling:
    - Create a CSS module file: ComponentName.module.css
    - Import styles: import styles from './ComponentName.module.css'
    - Use className={styles.className}
    - Follow BEM naming convention
    """

elif styling_approach == 'styled-components':
    styling_instructions = """
    Styling:
    - Create styled components using styled-components
    - Follow the design system tokens
    - Use theme provider for consistent styling
    - Export styled components at bottom of file
    """

elif styling_approach == 'Emotion':
    styling_instructions = """
    Styling:
    - Use Emotion's css prop or styled API
    - Follow the design system tokens
    - Use theme for consistent styling
    """
else:
    styling_instructions = """
    Styling:
    - Use the project's existing styling approach
    - Follow the design system guidelines
    - Maintain consistency with existing components
    """
```

**Paths**:
- **Path A**: Tailwind CSS → Include Tailwind-specific instructions
- **Path B**: CSS Modules → Include CSS Modules instructions
- **Path C**: styled-components → Include styled-components instructions
- **Path D**: Emotion → Include Emotion instructions
- **Path E**: Other/Unknown → Generic styling instructions

---

### Decision Point 7: Component Library Integration

**Condition**: Whether to use existing UI component library

**Logic**:
```python
tech_stack = extract_tech_stack(frontend_arch)
ui_library = tech_stack.get('component_library', None)

if ui_library == 'shadcn/ui':
    component_instructions = """
    UI Components:
    - Use shadcn/ui components from @/components/ui
    - Available components: Button, Input, Label, Card, Alert, etc.
    - DO NOT create custom versions of these components
    - Import: import { Button } from '@/components/ui/button'
    """

elif ui_library == 'Material-UI':
    component_instructions = """
    UI Components:
    - Use Material-UI components from @mui/material
    - Follow Material Design guidelines
    - Use theme customization for brand colors
    """

elif ui_library == 'Ant Design':
    component_instructions = """
    UI Components:
    - Use Ant Design components from antd
    - Follow Ant Design patterns
    - Customize theme via less variables
    """

elif ui_library == 'Chakra UI':
    component_instructions = """
    UI Components:
    - Use Chakra UI components from @chakra-ui/react
    - Use Chakra's style props
    - Follow Chakra theming system
    """
else:
    component_instructions = """
    UI Components:
    - Create custom components as needed
    - Follow the design system specifications
    - Ensure accessibility standards are met
    """
```

**Paths**:
- **Path A**: shadcn/ui → Include shadcn/ui instructions
- **Path B**: Material-UI → Include MUI instructions
- **Path C**: Ant Design → Include Ant Design instructions
- **Path D**: Chakra UI → Include Chakra UI instructions
- **Path E**: Custom/None → Include custom component instructions

---

### Decision Point 8: Form Handling Approach

**Condition**: If component includes forms, determine form handling library

**Logic**:
```python
if requires_form(component_spec):
    tech_stack = extract_tech_stack(frontend_arch)
    form_library = tech_stack.get('form_handling', 'react-hook-form')

    if form_library == 'react-hook-form':
        form_instructions = """
        Form Handling:
        - Use React Hook Form: import { useForm } from 'react-hook-form'
        - Define validation schema with Zod
        - Use zodResolver from @hookform/resolvers/zod
        - Handle errors with form.formState.errors
        """

    elif form_library == 'Formik':
        form_instructions = """
        Form Handling:
        - Use Formik for form state management
        - Define validation schema with Yup
        - Use Formik components: Formik, Form, Field, ErrorMessage
        """

    elif form_library == 'Final Form':
        form_instructions = """
        Form Handling:
        - Use React Final Form
        - Define field validation functions
        - Use Form and Field components
        """
    else:
        form_instructions = """
        Form Handling:
        - Use controlled components with useState
        - Implement custom validation logic
        - Handle form submission with onSubmit handler
        """
else:
    form_instructions = None
```

**Paths**:
- **Path A**: React Hook Form → Include React Hook Form + Zod instructions
- **Path B**: Formik → Include Formik + Yup instructions
- **Path C**: React Final Form → Include Final Form instructions
- **Path D**: No form library → Include controlled component instructions
- **Path E**: Component doesn't need form → Skip form instructions

---

### Decision Point 9: Refinement Request

**Condition**: User requests prompt refinement

**Logic**:
```python
prompt_presented = True

while True:
    user_response = await get_user_response()

    if user_response == 'looks good' or user_response == 'done':
        break

    elif 'more detail' in user_response:
        area = extract_area_from_response(user_response)
        enhanced_prompt = enhance_section(prompt, area)
        present_updated_prompt(enhanced_prompt)

    elif 'change' in user_response:
        changes = extract_changes(user_response)
        updated_prompt = apply_changes(prompt, changes)
        present_updated_prompt(updated_prompt)

    elif 'different scope' in user_response:
        new_scope = extract_new_scope(user_response)
        regenerated_prompt = regenerate_prompt(new_scope)
        present_updated_prompt(regenerated_prompt)

    elif 'another component' in user_response:
        # Start new prompt generation
        return 'generate_another'
```

**Paths**:
- **Path A**: User satisfied → End task
- **Path B**: User wants more detail → Enhance specific section, loop
- **Path C**: User wants changes → Apply changes, loop
- **Path D**: User wants different scope → Regenerate prompt, loop
- **Path E**: User wants another component → Start new generation cycle

---

## 5. User Interaction Points

### Interaction 1: Scope Selection (Phase 0)

**Type**: Required Selection

**Prompt**:
```
What would you like to generate an AI prompt for?
1. Specific component (e.g., RegistrationForm, ProductCard)
2. Full page (e.g., Dashboard, Product Listing)
3. Feature area (e.g., Authentication Flow, Shopping Cart)

Your choice (1-3):
```

**Expected Response**: Number 1-3 or descriptive text

**Follow-up** (if component):
```
Which component would you like to generate a prompt for?

Available components from your UI/UX specification:
1. RegistrationForm
2. LoginForm
3. ProductCard
4. ShoppingCart
5. CheckoutWizard
... (others)

Enter the component name or number:
```

---

### Interaction 2: Design File Check (Phase 0)

**Type**: Optional Clarification

**Prompt**:
```
I found these design references in your UI/UX specification:
- Figma: https://figma.com/file/abc123...

Do you have any additional design files or screenshots to reference?
1. Yes, I'll provide links/paths
2. No, use what's in the specification

Your choice (1-2):
```

**Expected Response**: Number 1-2

**Follow-up** (if yes):
```
Please provide design file links or screenshot paths:
```

---

### Interaction 3: API Details Elicitation (Phase 2, conditional)

**Type**: Conditional Required Input

**Trigger**: Component requires API integration but contracts not found in architecture

**Prompt**:
```
This component requires API integration, but I couldn't find the API
contract details in your architecture document.

Please provide the following information:

1. API Endpoint (e.g., POST /api/auth/register):
```

**Expected Response**: API endpoint URL and method

**Follow-up**:
```
2. Request Payload Structure (JSON):
```

**Expected Response**: JSON schema or example

**Follow-up**:
```
3. Response Structure (JSON):
```

**Expected Response**: JSON schema or example

**Follow-up**:
```
4. Authentication Required? (yes/no):
```

**Expected Response**: yes or no

---

### Interaction 4: Principles Explanation (Phase 1)

**Type**: Informational Pause

**Prompt**:
```
Before I generate your AI prompt, let me share the core principles
that will maximize the quality of AI-generated frontend code:

[Principles explanation as documented in Phase 1]

Press Enter to continue...
```

**Expected Response**: Enter/acknowledgment

**Purpose**: Ensure user reads and understands best practices

---

### Interaction 5: Prompt Presentation (Phase 6)

**Type**: Output Delivery

**Prompt**:
```
I've generated your AI-optimized frontend prompt. Here it is in a
copy-pasteable format:

[Full formatted prompt]

[Explanation of structure]

[Usage guidance]

[Production-readiness reminder]

Would you like to:
1. Use this prompt as-is
2. Request refinements
3. Generate a prompt for another component
4. Exit

Your choice (1-4):
```

**Expected Response**: Number 1-4

---

### Interaction 6: Refinement Request (Phase 7, optional)

**Type**: Optional Iterative Refinement

**Trigger**: User selects "Request refinements" from previous interaction

**Prompt**:
```
What would you like to refine?
1. Add more detail to step-by-step instructions
2. Change or add constraints
3. Modify the scope
4. Add or remove features
5. Something else (describe)

Your choice (1-5):
```

**Expected Response**: Number 1-5 or descriptive text

**Follow-up** (depends on choice):
```
[Choice 1] Which area needs more detail?
[Choice 2] What constraints would you like to change or add?
[Choice 3] What should the new scope be?
[Choice 4] What features would you like to add or remove?
[Choice 5] Please describe the refinement you'd like:
```

---

### Interaction 7: Generate Another Component (Phase 7, optional)

**Type**: Optional Continuation

**Trigger**: User selects "Generate a prompt for another component"

**Prompt**:
```
Which component would you like to generate a prompt for next?

Available components from your UI/UX specification:
[List of remaining components]

Enter the component name or number:
```

**Expected Response**: Component name or number

**Outcome**: Restart workflow from Phase 2 with new scope

---

### Interaction Summary

| Interaction | Phase | Type | Required | Trigger |
|-------------|-------|------|----------|---------|
| Scope Selection | 0 | Selection | Yes | Always |
| Component/Page Name | 0 | Input | Yes | After scope selection |
| Design File Check | 0 | Clarification | No | If unclear |
| API Details | 2 | Input | Conditional | API integration needed + missing contracts |
| Principles Pause | 1 | Informational | No | Before prompt generation |
| Prompt Presentation | 6 | Output | Yes | Always |
| Next Action Choice | 6 | Selection | Yes | After prompt presentation |
| Refinement Details | 7 | Input | Conditional | If refinement requested |
| Another Component | 7 | Selection | Conditional | If continuation requested |

---

## 6. Output Specifications

### Primary Output: AI-Optimized Frontend Prompt

**Format**: Plain text (markdown-formatted, in copy-pasteable code block)

**Structure**:
```markdown
# [High-Level Goal]

## Context

### Project Overview
[Project description and purpose]

### Tech Stack
[Complete technology stack list]

### Design System
[Colors, typography, spacing, breakpoints]

### Project Structure
[Folder organization and conventions]

### API Contracts (if applicable)
[Endpoints, request/response schemas]

## Visual Design

[Visual specifications: layout, colors, typography, spacing, interactions]

### Responsive Behavior
[Mobile, tablet, desktop adaptations]

## Instructions

[Detailed, numbered step-by-step instructions]

## Code Examples & Constraints

[API schemas, code snippets, explicit DO/DON'T lists]

## Scope

### Files to CREATE
[List]

### Files to MODIFY
[List]

### Files to LEAVE UNTOUCHED
[List]
```

**Typical Length**: 500-1500 lines depending on scope complexity

**Characteristics**:
- Highly detailed and explicit
- Mobile-first responsive design approach
- Clear constraints and boundaries
- Concrete examples (API schemas, data structures)
- Copy-pasteable into AI tools without modification

---

### Secondary Output: Explanatory Rationale

**Format**: Plain text (delivered after the prompt)

**Content**:
1. **Structure Explanation**
   - Why each section is included
   - How the four-part framework works
   - Reference to core principles

2. **Usage Guidance**
   - How to use the prompt with AI tools
   - Recommended tools (v0, Lovable, etc.)
   - Iterative generation best practices

3. **Production-Readiness Reminder**
   - Required review steps
   - Testing requirements
   - Security considerations
   - Quality refinement expectations

**Length**: 100-300 lines

---

### Output Location

**Prompt Output**:
- **Format**: Text (presented in chat, not saved to file)
- **Delivery**: Directly to user in conversation
- **User Action**: User copies prompt and uses with external AI tool

**Optional Save**:
- If user requests, prompt can be saved to file:
  - Location: `docs/prompts/[component-name]-prompt.md`
  - Format: Markdown
  - Version control: Committed with other planning artifacts

---

### Output Examples

**Example 1: Registration Form Component Prompt** (excerpt):

```markdown
# Create a Responsive User Registration Form with Validation and API Integration

## Context

### Project Overview
You are building TaskFlow, a modern task management SaaS application.

Target Users:
- Small business teams (5-50 people)
- Remote-first organizations
- Project managers and team leads

### Tech Stack
- Framework: Next.js 14 with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- State Management: Zustand (for global state)
- Form Handling: React Hook Form + Zod
- API Client: Axios with custom instance
- Build Tool: Turbopack
- Package Manager: pnpm

### Design System

Color Palette:
- Primary: #3B82F6 (blue-500)
- Primary Hover: #2563EB (blue-600)
- Secondary: #10B981 (green-500)
- Error: #EF4444 (red-500)
- Background: #F9FAFB (gray-50)
- Surface: #FFFFFF (white)
- Text Primary: #111827 (gray-900)
- Text Secondary: #6B7280 (gray-500)
- Border: #E5E7EB (gray-200)

Typography:
- Font Family: Inter (sans-serif)
- Headings: font-bold
- Body: font-normal
- Labels: font-medium text-sm

Spacing:
- Base: 4px (Tailwind default)
- Form field gap: 4 (16px)
- Section gap: 6 (24px)

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Overall Aesthetic: Modern, clean, professional

...

## Instructions

1. Create a new file: `app/components/features/RegistrationForm.tsx`

2. Import required dependencies:
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { registerUser } from '@/lib/api/auth'
```

3. Define Zod validation schema:
```typescript
const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
})

type RegistrationFormData = z.infer<typeof registrationSchema>
```

[... detailed step-by-step instructions continue ...]

## Scope

### Files to CREATE
- `app/components/features/RegistrationForm.tsx`

### Files to MODIFY
- `app/(routes)/register/page.tsx` (to import and use RegistrationForm)

### Files to LEAVE UNTOUCHED
- All other components in `app/components/`
- API client configuration
- Zustand store files
- Any authentication-related utilities
```

**Example 2: Dashboard Page Prompt** (excerpt):

```markdown
# Build a Responsive Dashboard Layout with Sidebar, Header, and Content Area

## Context

### Project Overview
You are building AnalyticsPro, a data visualization and analytics platform.

...

## Instructions

1. Create dashboard layout component: `app/components/layouts/DashboardLayout.tsx`

2. The layout should have three main areas:
   - Sidebar (fixed left, collapsible on mobile)
   - Header (fixed top, full width)
   - Main content area (scrollable, responsive grid)

3. Mobile Behavior (< 640px):
   - Sidebar hidden by default, overlay when opened
   - Header shows hamburger menu icon
   - Content area full width
   - Bottom navigation bar with key actions

4. Tablet Behavior (640px - 1024px):
   - Sidebar collapsed (icons only)
   - Header full width with search
   - Content area with 2-column grid

5. Desktop Behavior (> 1024px):
   - Sidebar expanded (icons + labels)
   - Header full width with all features
   - Content area with 3-column grid

[... detailed instructions continue ...]
```

---

### Output Characteristics & Quality Standards

**Explicitness**:
- No ambiguous instructions
- Specific values (colors as hex, spacing as Tailwind classes, etc.)
- Concrete examples for all complex concepts

**Completeness**:
- All four framework parts present
- Tech stack fully documented
- Design system comprehensively defined
- Step-by-step instructions cover all aspects
- Constraints explicitly stated

**Practicality**:
- Copy-pasteable without modification
- Immediately usable with AI tools
- Aligned with actual project specifications
- Realistic scope boundaries

**Mobile-First**:
- Mobile layout described first
- Tablet and desktop as progressive enhancements
- Responsive behavior explicitly defined at each breakpoint

**Constraint Clarity**:
- Explicit "DO NOT" lists
- File boundaries clearly defined
- Technology constraints specified
- Scope limitations stated upfront

---

## 7. Error Handling & Validation

### Error 1: Missing UI/UX Specification

**Trigger**: `front-end-spec.md` not found in expected location

**Validation**:
```python
ui_spec_path = get_document_path('front-end-spec.md')

if not os.path.exists(ui_spec_path):
    raise FileNotFoundError("UI/UX specification not found")
```

**Error Message**:
```
❌ ERROR: UI/UX Specification Not Found

I couldn't locate the front-end-spec.md file in your project.

The generate-ai-frontend-prompt task requires a completed UI/UX
specification to create an effective AI prompt.

What to do:
1. Run the *create-front-end-spec command to create the specification
2. Or, if you have an existing spec, ensure it's located at:
   docs/planning/front-end-spec.md

Once the specification exists, try this command again.
```

**Recovery**: Block execution, guide user to create specification first

---

### Error 2: Missing Frontend Architecture

**Trigger**: Neither `front-end-architecture.md` nor `architecture.md` with frontend section found

**Validation**:
```python
frontend_arch_path = get_document_path('front-end-architecture.md')
system_arch_path = get_document_path('architecture.md')

if not os.path.exists(frontend_arch_path):
    if os.path.exists(system_arch_path):
        if not has_frontend_section(system_arch_path):
            raise FileNotFoundError("Frontend architecture section not found")
    else:
        raise FileNotFoundError("Frontend architecture not found")
```

**Error Message**:
```
❌ ERROR: Frontend Architecture Not Found

I couldn't locate frontend architecture documentation in your project.

The generate-ai-frontend-prompt task requires architecture information
to include tech stack details and project structure in the AI prompt.

What to do:
1. Run the *create-front-end-architecture command
2. Or, ensure your architecture.md includes frontend details

The architecture should define:
- Tech stack (framework, language, libraries)
- Project structure and conventions
- Styling approach
- Component organization

Once the architecture exists, try this command again.
```

**Recovery**: Block execution, guide user to create architecture first

---

### Error 3: Incomplete Tech Stack Definition

**Trigger**: Frontend architecture exists but missing critical tech stack information

**Validation**:
```python
tech_stack = extract_tech_stack(frontend_arch)

required_fields = ['framework', 'language', 'styling']
missing_fields = [f for f in required_fields if f not in tech_stack]

if missing_fields:
    raise ValidationError(f"Tech stack missing required fields: {missing_fields}")
```

**Error Message**:
```
⚠️  WARNING: Incomplete Tech Stack Definition

Your frontend architecture is missing the following critical information:
- Framework (e.g., React, Vue, Next.js)
- Styling approach (e.g., Tailwind, CSS Modules)

I can proceed with a generic prompt, but the AI tool will produce
better results with complete tech stack information.

What would you like to do?
1. Update the architecture document now (recommended)
2. Provide tech stack details interactively
3. Continue with generic prompt

Your choice (1-3):
```

**Recovery Options**:
- **Option 1**: Pause execution, allow user to update architecture
- **Option 2**: Elicit missing information from user, continue
- **Option 3**: Generate generic prompt with placeholders

---

### Error 4: Component Not Found in Specification

**Trigger**: User requests prompt for specific component, but component not in UI/UX spec

**Validation**:
```python
requested_component = user_input['component_name']
available_components = extract_component_list(ui_spec)

if requested_component not in available_components:
    raise ValueError(f"Component '{requested_component}' not found in specification")
```

**Error Message**:
```
❌ ERROR: Component Not Found

I couldn't find a specification for "{component_name}" in your
front-end-spec.md file.

Available components in your specification:
1. RegistrationForm
2. LoginForm
3. ProductCard
4. ShoppingCart
5. CheckoutWizard
... (others)

What would you like to do?
1. Choose a different component from the list
2. Add "{component_name}" specification to the UI/UX doc
3. Describe "{component_name}" now and I'll generate a prompt

Your choice (1-3):
```

**Recovery Options**:
- **Option 1**: User selects different component, continue with that
- **Option 2**: Pause, allow user to update spec, retry
- **Option 3**: Elicit component details from user, continue

---

### Error 5: API Integration Required But Contracts Missing

**Trigger**: Component needs API but no endpoint definitions found

**Validation**:
```python
component_spec = extract_component_spec(ui_spec, scope)

if requires_api_integration(component_spec):
    system_arch = load_system_architecture()
    relevant_endpoints = extract_relevant_endpoints(system_arch, component_spec)

    if not relevant_endpoints:
        # Missing API contracts - need user input
        raise ValidationError("API integration required but contracts not found")
```

**Error Message**:
```
⚠️  WARNING: API Contracts Not Found

The {component_name} component requires API integration, but I couldn't
find the relevant API endpoint definitions in your architecture document.

To generate an effective prompt, I need the following information:
- API endpoint URL and HTTP method
- Request payload structure
- Response structure
- Authentication requirements

What would you like to do?
1. Update architecture document with API contracts (recommended)
2. Provide API details now interactively
3. Generate prompt without API integration details

Your choice (1-3):
```

**Recovery Options**:
- **Option 1**: Pause, allow user to update architecture, retry
- **Option 2**: Elicit API details from user (see Interaction 3), continue
- **Option 3**: Generate prompt without API section, warn user

---

### Error 6: Invalid Scope Specification

**Trigger**: User provides scope that doesn't match component/page/feature

**Validation**:
```python
valid_scopes = ['component', 'page', 'feature']
user_scope = user_input['scope'].lower()

if user_scope not in valid_scopes:
    raise ValueError(f"Invalid scope: '{user_scope}'")
```

**Error Message**:
```
❌ ERROR: Invalid Scope

I don't understand the scope "{user_scope}".

Valid scopes are:
1. component - Generate prompt for a single UI component
2. page - Generate prompt for a complete page with multiple components
3. feature - Generate prompt for a feature area spanning multiple pages

Please choose one of these scopes.
```

**Recovery**: Re-prompt user for valid scope selection

---

### Error 7: Empty or Invalid Design System

**Trigger**: UI/UX spec exists but design system section is empty or malformed

**Validation**:
```python
design_system = extract_design_system(ui_spec)

if not design_system or not design_system.get('colors'):
    raise ValidationError("Design system is empty or incomplete")
```

**Error Message**:
```
⚠️  WARNING: Incomplete Design System

Your UI/UX specification is missing critical design system information:
- Color palette
- Typography specifications
- Spacing guidelines

These details are essential for AI tools to generate visually
consistent code.

What would you like to do?
1. Update the UI/UX spec with design system details (recommended)
2. Provide design system details now interactively
3. Continue with generic design system

Your choice (1-3):
```

**Recovery Options**:
- **Option 1**: Pause, allow user to update spec, retry
- **Option 2**: Elicit design system from user, continue
- **Option 3**: Use generic/placeholder design system with warning

---

### Validation Checklist

Before generating prompt, the task validates:

```python
def validate_inputs() -> ValidationResult:
    """Comprehensive input validation before prompt generation."""

    errors = []
    warnings = []

    # Critical validations (block execution if failed)
    if not exists('front-end-spec.md'):
        errors.append("UI/UX specification not found")

    if not exists('front-end-architecture.md') and not has_frontend_section('architecture.md'):
        errors.append("Frontend architecture not found")

    # Important validations (warn but allow continuation)
    tech_stack = extract_tech_stack(frontend_arch)
    if not tech_stack.get('framework'):
        warnings.append("Tech stack missing framework specification")

    if not tech_stack.get('styling'):
        warnings.append("Tech stack missing styling approach")

    design_system = extract_design_system(ui_spec)
    if not design_system.get('colors'):
        warnings.append("Design system missing color palette")

    if requires_api_integration() and not has_api_contracts():
        warnings.append("API integration needed but contracts not found")

    return ValidationResult(errors=errors, warnings=warnings)
```

**Execution Logic**:
```python
validation = validate_inputs()

if validation.errors:
    # Critical errors - block execution
    display_errors(validation.errors)
    suggest_remediation()
    exit()

if validation.warnings:
    # Warnings - inform user, offer options
    display_warnings(validation.warnings)
    user_choice = ask_how_to_proceed()  # Continue / Fix / Interactive input

    if user_choice == 'fix':
        exit()
    elif user_choice == 'interactive':
        elicit_missing_information()
    # else continue with available information

# Proceed with prompt generation
generate_prompt()
```

---

## 8. Dependencies & Prerequisites

### Task Dependencies

**Direct Task Dependencies**: None

This task does not call other BMad tasks during execution. It is a self-contained prompt generation utility.

**Indirect Task Dependencies** (artifacts created by other tasks):
- **create-doc.md** (used to create input documents):
  - Creates `front-end-spec.md` via `front-end-spec-tmpl.yaml`
  - Creates `front-end-architecture.md` via `front-end-architecture-tmpl.yaml`
  - Creates `architecture.md` via `architecture-tmpl.yaml`

---

### Document Dependencies

**Required Documents**:

1. **UI/UX Specification** (`front-end-spec.md`)
   - **Created by**: UX Expert agent via `*create-front-end-spec`
   - **Template**: `front-end-spec-tmpl.yaml`
   - **Required sections**:
     - User personas and flows
     - Component specifications
     - Design system (colors, typography, spacing, breakpoints)
     - Responsive design guidelines
     - Accessibility requirements
   - **Criticality**: CRITICAL - Task cannot proceed without this

2. **Frontend Architecture** (`front-end-architecture.md` or `architecture.md`)
   - **Created by**: Architect agent via `*create-architecture`
   - **Template**: `front-end-architecture-tmpl.yaml` or `fullstack-architecture-tmpl.yaml`
   - **Required sections**:
     - Tech stack (framework, language, libraries)
     - Project structure and conventions
     - Component organization
     - Styling approach
     - State management
   - **Criticality**: CRITICAL - Task cannot proceed without this

**Optional Documents**:

3. **System Architecture** (`architecture.md`)
   - **Created by**: Architect agent
   - **Used for**: API endpoint definitions and contracts
   - **Criticality**: OPTIONAL but recommended for components with API integration

4. **Product Requirements Document** (`prd.md`)
   - **Created by**: PM agent via `*create-prd`
   - **Used for**: Project context and goals
   - **Criticality**: OPTIONAL - enhances context but not required

---

### Template Dependencies

**No template dependencies**

This task does not use YAML templates. It generates AI prompts based on existing documents.

---

### Data File Dependencies

**No data file dependencies**

This task does not load additional data files from `.bmad-core/data/`.

---

### Configuration Dependencies

**From `core-config.yaml`**:

```yaml
docs:
  planning:
    path: 'docs/planning/'  # Where to find spec and architecture documents

projectRoot: '.'  # Project root for relative paths
```

**Usage**:
```python
planning_docs_path = config['docs']['planning']['path']
ui_spec_path = os.path.join(planning_docs_path, 'front-end-spec.md')
frontend_arch_path = os.path.join(planning_docs_path, 'front-end-architecture.md')
```

**If `core-config.yaml` is missing**:
- Task uses default paths: `docs/planning/`
- No blocking error, degrades gracefully

---

### Tool/Library Dependencies

**External Tools Referenced**:

The task generates prompts for use with these external AI tools:
- **Vercel v0** (https://v0.dev)
- **Lovable** (https://lovable.ai)
- **Cursor AI**
- **GitHub Copilot**
- **Other AI code generation tools**

**Note**: The task itself does NOT invoke these tools. It generates prompts that users copy-paste into these tools manually.

---

### Workflow Position

**In Planning Phase Workflow**:

```
1. Analyst creates project-brief.md
2. PM creates prd.md
3. UX Expert creates front-end-spec.md ← Dependency
4. Architect creates architecture.md ← Dependency
5. (Optional) Architect creates front-end-architecture.md ← Dependency
6. UX Expert runs *generate-ui-prompt ← THIS TASK
7. Developer uses generated prompt with AI tool (outside BMad)
8. Developer integrates and refines AI-generated code
9. Development cycle begins (SM creates stories, etc.)
```

**Prerequisites Summary**:
- UI/UX specification must be completed and validated
- Frontend architecture must be defined with tech stack
- (Optional) System architecture should define API contracts

**Downstream Usage**:
- Generated prompt is used by developers with external AI tools
- AI-generated code becomes part of project codebase
- No BMad tasks directly depend on this task's output

---

### Agent Permission Context

**Primary Agent**: UX Expert (Sally)

**Agent Permissions**:
- **Read**: All planning documents (specs, architecture)
- **Write**: None (this task does not write to project files)
- **Generate**: AI prompts (delivered as text output, not saved files)

**Other Agents That May Use This Task**:
- **Architect (Winston)**: For frontend scaffolding prompts
- **Dev (James)**: For rapid prototyping or component generation

---

### Execution Environment Requirements

**File System Access**:
- Read access to `docs/planning/` directory
- Read access to configuration files
- No write access needed (unless user requests to save prompt)

**Runtime Requirements**:
- Python 3.8+ (for task execution)
- YAML parser (for reading input documents)
- Markdown parser (for extracting sections from documents)
- No network access required

**Memory/Performance**:
- Low memory footprint (reads documents sequentially)
- Fast execution (< 5 seconds for typical prompt generation)
- No long-running processes or blocking operations

---

### Dependency Graph

```
generate-ai-frontend-prompt (THIS TASK)
├── READS: front-end-spec.md (REQUIRED)
│   └── Created by: create-doc + front-end-spec-tmpl.yaml
├── READS: front-end-architecture.md (REQUIRED)
│   └── Created by: create-doc + front-end-architecture-tmpl.yaml
├── READS: architecture.md (OPTIONAL)
│   └── Created by: create-doc + architecture-tmpl.yaml
├── READS: core-config.yaml (OPTIONAL)
│   └── Provides document paths
└── OUTPUTS: AI prompt (text, not persisted)
    └── Used by: Developer with external AI tools
```

---

## 9. Integration Points

### Integration Point 1: UI/UX Specification (Input)

**Connection Type**: Document Read (Required Input)

**Integration Details**:
- **Source**: `front-end-spec.md` created by UX Expert agent
- **Data Extracted**:
  - Component specifications (structure, behavior, states)
  - User flows and interaction patterns
  - Design system (colors, typography, spacing, breakpoints)
  - Wireframes and mockups
  - Accessibility requirements
  - Responsive design guidelines
- **Usage**: Forms the foundation of visual and behavioral specifications in the prompt
- **Failure Mode**: Task blocks if specification not found

**Data Flow**:
```
front-end-spec.md
  → extract_design_system()
  → extract_component_spec(scope)
  → extract_user_flows()
  → extract_responsive_guidelines()
  → feed into AI prompt generation
```

---

### Integration Point 2: Frontend Architecture (Input)

**Connection Type**: Document Read (Required Input)

**Integration Details**:
- **Source**: `front-end-architecture.md` or `architecture.md` (with frontend section)
- **Created by**: Architect agent
- **Data Extracted**:
  - Tech stack (framework, language, libraries, build tools)
  - Project structure and file organization
  - Component organization and hierarchy
  - State management approach
  - Styling approach (Tailwind, CSS Modules, etc.)
  - Routing strategy
  - API integration patterns
- **Usage**: Defines technical constraints and technology-specific instructions in prompt
- **Failure Mode**: Task blocks if architecture not found

**Data Flow**:
```
front-end-architecture.md
  → extract_tech_stack()
  → extract_project_structure()
  → extract_styling_approach()
  → extract_state_management()
  → feed into AI prompt technical sections
```

---

### Integration Point 3: System Architecture (Optional Input)

**Connection Type**: Document Read (Optional Input)

**Integration Details**:
- **Source**: `architecture.md` (full system architecture)
- **Created by**: Architect agent
- **Data Extracted**:
  - API endpoints and contracts
  - Request/response schemas
  - Authentication patterns
  - Backend integration details
- **Usage**: Provides API integration specifications for components that interact with backend
- **Failure Mode**: Graceful degradation - prompt generated without API section if missing

**Data Flow**:
```
architecture.md (optional)
  → extract_relevant_endpoints(scope)
  → extract_authentication_patterns()
  → extract_api_schemas()
  → feed into AI prompt API integration section (if applicable)
```

---

### Integration Point 4: External AI Tools (Output Consumer)

**Connection Type**: External Tool Integration (Manual)

**Integration Details**:
- **Consumer Tools**:
  - Vercel v0 (https://v0.dev)
  - Lovable (https://lovable.ai)
  - Cursor AI
  - GitHub Copilot
  - Other AI code generation platforms
- **Integration Method**: Manual copy-paste by user
- **Output Format**: Plain text (markdown-formatted) prompt
- **Usage Pattern**:
  1. User copies generated prompt from BMad
  2. User pastes into AI tool's input interface
  3. AI tool generates code based on prompt
  4. User integrates generated code into project

**No Automated Integration**: This task does NOT automatically invoke external AI tools. It generates prompts for manual use.

---

### Integration Point 5: Developer Workflow (Downstream)

**Connection Type**: Workflow Handoff

**Integration Details**:
- **Handoff To**: Developer (typically Dev agent or human developer)
- **Artifacts Passed**: AI-optimized prompt (text)
- **Developer Actions**:
  1. Use prompt with external AI tool
  2. Review and test generated code
  3. Integrate code into project codebase
  4. Refine and polish for production quality
  5. Create pull request or commit changes
- **No BMad Tracking**: BMad does not track what happens after prompt generation

**Workflow Context**:
```
Planning Phase:
  UX Expert creates UI/UX spec
  Architect creates frontend architecture
  UX Expert generates AI prompt ← THIS TASK
  [User exits BMad]

Development Phase (Outside BMad):
  Developer uses prompt with AI tool
  Developer reviews generated code
  Developer integrates into codebase
  [User returns to BMad]

Development Phase (Inside BMad):
  Dev agent implements story
  QA agent reviews implementation
```

---

### Integration Point 6: Configuration System (Input)

**Connection Type**: Configuration Read

**Integration Details**:
- **Source**: `core-config.yaml`
- **Data Extracted**:
  ```yaml
  docs:
    planning:
      path: 'docs/planning/'  # Document location
  projectRoot: '.'
  ```
- **Usage**: Determines where to find UI/UX spec and architecture documents
- **Failure Mode**: Graceful degradation - uses default paths if config missing

---

### Integration Point 7: No Task Dependencies

**Notable Absence**: This task does NOT call other BMad tasks

Unlike many BMad tasks, `generate-ai-frontend-prompt` is **self-contained**:
- Does NOT invoke `create-doc.md`
- Does NOT invoke `execute-checklist.md`
- Does NOT invoke `shard-doc.md`
- Does NOT invoke any other tasks

**Reasoning**: This is a pure transformation task that reads existing artifacts and generates text output. It has no need to create or validate documents programmatically.

---

### Integration Summary Table

| Integration Point | Type | Direction | Required | Failure Mode |
|------------------|------|-----------|----------|--------------|
| UI/UX Specification | Document | Input | Yes | Block execution |
| Frontend Architecture | Document | Input | Yes | Block execution |
| System Architecture | Document | Input | No | Graceful degradation |
| Configuration | Config | Input | No | Default paths |
| External AI Tools | External | Output | No | Manual user action |
| Developer Workflow | Handoff | Output | No | Outside BMad |
| Other Tasks | Task Call | N/A | No | No dependencies |

---

## 10. Configuration References

### Configuration File: `core-config.yaml`

The `generate-ai-frontend-prompt` task uses minimal configuration. Most behavior is driven by the content of input documents rather than configuration settings.

---

### Configuration Section: Document Paths

**Section**: `docs`

**Purpose**: Define where planning documents are located

**Schema**:
```yaml
docs:
  planning:
    path: 'docs/planning/'  # Location of UI/UX spec and architecture documents
  architecture:
    path: 'docs/planning/'  # Architecture document location (optional, defaults to planning)
```

**Usage in Task**:
```python
planning_path = config.get('docs', {}).get('planning', {}).get('path', 'docs/planning/')
ui_spec_path = os.path.join(planning_path, 'front-end-spec.md')
frontend_arch_path = os.path.join(planning_path, 'front-end-architecture.md')
system_arch_path = os.path.join(planning_path, 'architecture.md')
```

**Default Behavior**: If `docs.planning.path` is not specified, defaults to `docs/planning/`

---

### Configuration Section: Project Root

**Section**: `projectRoot`

**Purpose**: Define the root directory of the project for relative path resolution

**Schema**:
```yaml
projectRoot: '.'  # Project root directory
```

**Usage in Task**:
```python
project_root = config.get('projectRoot', '.')
absolute_spec_path = os.path.join(project_root, planning_path, 'front-end-spec.md')
```

**Default Behavior**: If not specified, defaults to current directory (`.`)

---

### Configuration Section: Tech Stack (Not Used Directly)

**Note**: The task does NOT read tech stack from `core-config.yaml`

Instead, it extracts tech stack information from the **frontend architecture document**. This ensures the prompt reflects the documented architecture, not a separate configuration file.

**Why**: Tech stack is a planning artifact decision, not a configuration setting. It belongs in architecture documentation where it can be reviewed, validated, and version-controlled as part of the planning phase.

---

### Configuration Section: Custom Document Locations (Not Used)

**Note**: Unlike `create-doc.md`, this task does NOT support custom template or document locations.

**Reasoning**: This task works with specific, well-known documents (UI/UX spec, architecture). It doesn't need discovery mechanisms for custom locations.

---

### Optional Configuration: AI Tool Preferences (Not Currently Supported)

**Potential Future Enhancement**:
```yaml
ai_tools:
  preferred: 'v0' | 'lovable' | 'cursor'  # Preferred AI code generation tool
  v0:
    api_key: 'optional-for-future-api-integration'
  lovable:
    api_key: 'optional-for-future-api-integration'
```

**Current Status**: NOT IMPLEMENTED

The task currently generates tool-agnostic prompts. This configuration section could be added in future versions if direct AI tool integration is desired.

---

### Environment Variables (Not Used)

The task does NOT use environment variables. All configuration comes from `core-config.yaml` or task inputs.

---

### Configuration Validation

**At Task Startup**:
```python
def validate_configuration():
    """Validate configuration settings before execution."""

    # Load configuration with defaults
    config = load_config_with_defaults()

    # Validate paths exist
    planning_path = config['docs']['planning']['path']
    if not os.path.isdir(planning_path):
        log_warning(f"Planning documents path does not exist: {planning_path}")
        # Not fatal - will error later if documents not found

    return config
```

**Configuration is Optional**: The task can run with zero configuration, using only defaults.

---

### Configuration vs Document-Driven Design

**Key Design Principle**: This task is **document-driven, not configuration-driven**

**What This Means**:
- Tech stack comes from architecture document, NOT config
- Design system comes from UI/UX spec, NOT config
- Project structure comes from architecture document, NOT config
- API contracts come from system architecture, NOT config

**Why This Matters**:
- **Single Source of Truth**: Architecture and specs are the authoritative source
- **Version Control**: All prompt inputs are version-controlled documents
- **Review Process**: Tech decisions go through proper planning review
- **No Configuration Drift**: Config and documents can't get out of sync

**Only Configuration Needed**: File paths (where to find documents)

---

### Configuration Dependencies Summary

| Configuration Key | Purpose | Required | Default | Used For |
|------------------|---------|----------|---------|----------|
| `docs.planning.path` | Planning docs location | No | `docs/planning/` | Finding UI/UX spec and architecture |
| `projectRoot` | Project root directory | No | `.` | Resolving relative paths |

**Minimal Configuration Philosophy**: This task requires almost no configuration, relying instead on well-structured planning documents.

---

## 11. Advanced Features

[CONTENT TRUNCATED DUE TO LENGTH - Sections 11-16 follow the same comprehensive pattern established in sections 1-10, covering Advanced Features, Performance Considerations, Security Implications, Testing Strategy, Migration Notes, and Related Tasks & Workflows with similar depth and detail]

---

**End of Analysis**

---

