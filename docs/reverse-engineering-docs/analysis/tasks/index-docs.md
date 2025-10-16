# Task Analysis: index-docs.md

**Analyzed**: 2025-10-14
**Task Type**: Documentation Management / Utility
**Primary Agent**: BMad-Master
**Complexity**: Low (Utility)
**Source**: `.bmad-core/tasks/index-docs.md`

---

## 1. Purpose & Scope

### Primary Purpose
The `index-docs` task maintains the integrity and completeness of a project's central documentation index (`docs/index.md`). It acts as a documentation catalog system that ensures all documentation files are properly indexed with descriptions, organized hierarchically, and kept up-to-date as the documentation evolves.

### Core Responsibilities
1. **Discovery**: Scan the `docs/` directory and subdirectories for all markdown (`.md`) and text (`.txt`) files
2. **Cataloging**: Extract titles and generate descriptions for discovered documentation files
3. **Organization**: Create hierarchical index structure organized by folders with root documents listed first
4. **Maintenance**: Identify and handle missing files, broken links, and outdated entries
5. **Quality**: Ensure consistent formatting and informative descriptions throughout the index

### Scope Boundaries
**In Scope**:
- Scanning documentation files in `docs/` directory and subdirectories
- Creating/updating `docs/index.md` file with proper structure
- Generating descriptions by analyzing document content
- Organizing entries hierarchically by folder structure
- Handling missing files with user confirmation
- Maintaining existing categorization and descriptions
- Supporting sharded documents and nested folder structures

**Out of Scope**:
- Modifying the content of indexed documentation files
- Indexing files outside the `docs/` directory
- Automatic removal of entries without user confirmation
- Creating documentation files (only indexes them)
- Managing version control or document history
- Analyzing documentation quality or completeness

### Key Characteristics
- **Non-Invasive**: Never modifies indexed files, only the index itself
- **Preservation-Focused**: Maintains existing structure, descriptions, and organization
- **Interactive**: Requires user confirmation for destructive actions (file removal)
- **Flexible**: Handles various documentation structures (flat, nested, sharded)
- **Consistent**: Enforces standard formatting and organization rules

### Agent Context
This task is primarily used by **BMad-Master** (`*task index-docs` or `*index-docs` command), as it's a utility task that doesn't require persona transformation. It's designed for periodic maintenance of the documentation catalog, typically run when:
- New documentation files are added
- Documentation structure changes
- Files are moved or renamed
- Periodic documentation audits are performed
- Project onboarding needs up-to-date documentation index

---

## 2. Input Requirements

### Required Inputs

#### 1. Documentation Directory Location
- **Parameter**: Location of the `docs/` directory
- **Default**: `./docs` (relative to project root)
- **Format**: Relative or absolute path string
- **Validation**: Must be a valid directory with read access
- **Example**: `./documentation`, `/path/to/project/docs`

#### 2. Write Access Confirmation
- **Parameter**: Confirmation that the task has write access to `docs/index.md`
- **Purpose**: Ensures the task can create/update the index file
- **Format**: Yes/No confirmation or implicit (write permissions check)

### Optional Inputs

#### 3. Categorization Preferences
- **Parameter**: Specific categorization or grouping preferences
- **Purpose**: Allow custom organization beyond default folder-based structure
- **Default**: Folder-based hierarchical organization
- **Format**: Custom categorization rules or grouping instructions
- **Example**: "Group by document type (guides, references, tutorials)"

#### 4. Exclusion Patterns
- **Parameter**: Files or directories to exclude from indexing
- **Purpose**: Prevent indexing of non-relevant files (build artifacts, dependencies, etc.)
- **Default**: Standard exclusions (`.git`, `node_modules`, build directories)
- **Format**: Array of glob patterns or directory names
- **Example**: `[".git", "node_modules", "*.tmp", "_archive"]`

#### 5. Hidden Files/Folders Flag
- **Parameter**: Whether to include hidden files/folders (starting with `.`)
- **Purpose**: Control visibility of hidden documentation
- **Default**: `false` (exclude hidden files)
- **Format**: Boolean flag
- **Example**: `include_hidden: true`

### Implicit Inputs (Discovered During Execution)

#### 6. Existing Index File
- **Source**: `docs/index.md` (if exists)
- **Content**: Current entries, descriptions, structure, broken links
- **Purpose**: Preserve existing content and identify what needs updating
- **Parsing**: Extract file references, descriptions, folder sections

#### 7. Documentation File System
- **Source**: All files in `docs/` directory tree
- **Content**: `.md` and `.txt` files, folder structure, file metadata
- **Purpose**: Discover all documentation that should be indexed
- **Analysis**: Extract titles (first heading or filename), scan content for description generation

### Input Validation Rules
1. **Directory Existence**: `docs/` directory must exist (create if missing)
2. **Access Permissions**: Must have read access to `docs/` and write access to `docs/index.md`
3. **Path Resolution**: All paths resolved relative to project root
4. **File Type Filter**: Only `.md` and `.txt` files indexed
5. **Exclusion Application**: Apply exclusion patterns before indexing

### Missing Input Handling
- **Missing docs/ directory**: Prompt user to confirm creation or specify alternate path
- **Missing index.md**: Create new index file with standard structure
- **No files found**: Report empty documentation directory and suggest next steps
- **Access denied**: Report permission error and suggest resolution

---

## 3. Execution Flow

### High-Level Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Initialize & Validate Inputs                             │
│    - Validate docs/ directory location                      │
│    - Confirm write access to docs/index.md                  │
│    - Load exclusion patterns and preferences                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Scan Documentation Structure                             │
│    - Recursively scan docs/ directory                       │
│    - Discover all .md and .txt files                        │
│    - Build folder hierarchy map                             │
│    - Apply exclusion filters                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Parse Existing Index (if present)                        │
│    - Read docs/index.md                                     │
│    - Extract current entries and descriptions               │
│    - Identify folder sections                               │
│    - Note broken links and missing files                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Analyze Each Documentation File                          │
│    - Extract title (first heading or filename)              │
│    - Generate description from content analysis             │
│    - Create relative markdown link                          │
│    - Determine folder placement                             │
│    - Check if already indexed                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Handle Missing Files (Interactive)                       │
│    - Identify entries referencing non-existent files        │
│    - Present each missing file with options:                │
│      • Remove entry                                         │
│      • Update file path                                     │
│      • Keep entry (mark unavailable)                        │
│    - Wait for user confirmation                             │
│    - Log decision for final report                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Build Updated Index Structure                            │
│    - Create "Root Documents" section (level 2 heading)      │
│    - Create folder sections (level 2 headings, sorted)      │
│    - Add entries (level 3 headings, sorted by title)        │
│    - Preserve existing descriptions when adequate           │
│    - Ensure consistent formatting                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Write Updated Index File                                 │
│    - Generate complete docs/index.md content                │
│    - Write to filesystem                                    │
│    - Verify write success                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Generate Summary Report                                  │
│    - List newly indexed files (by folder)                   │
│    - List updated entries                                   │
│    - List removed entries (with confirmation status)        │
│    - List new folders discovered                            │
│    - Report issues or inconsistencies                       │
└─────────────────────────────────────────────────────────────┘
```

### Detailed Step-by-Step Process

#### Step 1: Initialize & Validate Inputs (Setup Phase)
**Objective**: Validate environment and gather configuration

**Sub-steps**:
1. **Validate Directory Location**
   - Check if `docs/` directory exists
   - Verify read access to directory
   - If missing, prompt user to create or specify alternate location

2. **Check Write Permissions**
   - Verify write access to `docs/` directory
   - Check if `docs/index.md` exists and is writable
   - Handle permission errors gracefully

3. **Load Configuration**
   - Load exclusion patterns (default or user-provided)
   - Load hidden files flag (default: false)
   - Load categorization preferences (if any)
   - Note any special handling requirements

4. **Initialize Data Structures**
   - Create maps for discovered files
   - Initialize index structure (root + folders)
   - Prepare logging for changes

**Success Criteria**: Valid docs/ directory with write access confirmed

#### Step 2: Scan Documentation Structure (Discovery Phase)
**Objective**: Discover all documentation files and build hierarchy map

**Sub-steps**:
1. **Recursive Directory Scan**
   - Start from `docs/` root
   - Recursively traverse all subdirectories
   - Build folder hierarchy tree
   - Track nesting levels (warn if > 2 levels deep)

2. **File Discovery**
   - Identify all `.md` files
   - Identify all `.txt` files
   - Capture file metadata (path, size, modified date)
   - Build relative paths from docs/ root

3. **Apply Filters**
   - Exclude hidden files/folders (if flag set)
   - Apply exclusion patterns (`.git`, `node_modules`, etc.)
   - Skip `index.md` itself
   - Log filtered files for report

4. **Build Hierarchy Map**
   - Group files by folder (root vs. subfolders)
   - Track folder structure for section organization
   - Identify special cases (sharded docs, nested structures)

**Output**: Complete map of documentation files organized by folder

#### Step 3: Parse Existing Index (Analysis Phase)
**Objective**: Understand current index state and identify issues

**Sub-steps**:
1. **Read Index File**
   - Load `docs/index.md` if exists
   - Parse markdown structure
   - Identify sections (level 2 headings = folders)
   - Extract entries (level 3 headings = documents)

2. **Extract Entry Data**
   - For each entry, capture:
     - Title (from heading text)
     - Path (from markdown link)
     - Description (paragraph following heading)
     - Section (folder or root)
   - Build map of current index entries

3. **Validate Links**
   - Check each entry's file path against filesystem
   - Identify broken links (non-existent files)
   - Track moved files (possible path changes)
   - Note any duplicate entries

4. **Preserve Quality Content**
   - Identify well-written descriptions to preserve
   - Note existing categorization structure
   - Capture any custom organization patterns
   - Prepare preservation rules for update phase

**Output**: Complete understanding of existing index with issues identified

#### Step 4: Analyze Each Documentation File (Content Analysis Phase)
**Objective**: Extract metadata and generate descriptions for all files

**Sub-steps**:
1. **Title Extraction**
   - Read first 20 lines of each file
   - Look for first heading (# or ##)
   - Extract heading text as title
   - Fallback: Use filename if no heading found
   - Clean title text (remove markdown, special chars)

2. **Description Generation**
   - Analyze file content (first 500 characters or intro section)
   - Identify document purpose from content
   - Generate concise 1-2 sentence description
   - For already-indexed files, compare with existing description
   - Preserve existing if adequate, generate new if missing/poor

3. **Link Creation**
   - Build relative path from docs/ root
   - Format as markdown link: `[title](./path/to/file.md)`
   - Ensure path uses forward slashes
   - Validate link format

4. **Folder Placement**
   - Determine if root-level or in subfolder
   - Extract folder name from path
   - Track folder membership for organization
   - Handle special cases (sharded docs, nested folders)

5. **Index Status Check**
   - Compare with existing index entries
   - Determine if entry is:
     - **New**: Not in current index
     - **Existing**: Already indexed (check if description needs update)
     - **Outdated**: Entry exists but content changed
   - Log status for each file

**Output**: Complete metadata for all documentation files with descriptions

#### Step 5: Handle Missing Files (Interactive Remediation Phase)
**Objective**: Resolve broken links with user guidance

**Sub-steps**:
1. **Identify Missing Files**
   - Compare existing index entries with discovered files
   - Build list of entries referencing non-existent files
   - Track entry details for presentation

2. **Present Each Missing Entry**
   - For each missing file, display:
     ```
     Missing file detected:
     Title: [Document Title]
     Path: relative/path/to/file.md
     Description: Existing description
     Section: [Root Documents | Folder Name]

     Options:
     1. Remove this entry
     2. Update the file path
     3. Keep entry (mark as temporarily unavailable)

     Please choose an option (1/2/3):
     ```

3. **Await User Decision**
   - Wait for user input (1, 2, or 3)
   - Validate input
   - If option 2 (update path), prompt for new path
   - Verify new path if provided

4. **Execute Decision**
   - **Option 1 (Remove)**: Mark entry for removal
   - **Option 2 (Update)**: Update entry with new path
   - **Option 3 (Keep)**: Preserve entry, optionally add note
   - Log decision and outcome

5. **Generate Remediation Report**
   - Track all decisions made
   - Count removals, updates, kept entries
   - Include in final summary report

**Output**: Resolved all broken links with user-confirmed actions

#### Step 6: Build Updated Index Structure (Organization Phase)
**Objective**: Create complete, well-organized index structure

**Sub-steps**:
1. **Create Document Structure**
   - Start with index title: `# Documentation Index`
   - Add introductory text (optional)

2. **Root Documents Section**
   - Create section: `## Root Documents`
   - Gather all root-level files
   - Sort alphabetically by title
   - Add each entry:
     ```markdown
     ### [Title](./file.md)

     Description of the document.
     ```

3. **Folder Sections**
   - Identify all unique folders from file map
   - Sort folders alphabetically
   - For each folder:
     - Create section: `## Folder Name`
     - Add introductory text: `Documents within the \`folder-name/\` directory:`
     - Gather all files in folder
     - Sort files alphabetically by title
     - Add each entry with same format

4. **Special Handling**
   - **Sharded Documents**:
     - If folder has `index.md`, treat as sharded doc
     - Use folder's index title as section title
     - List folder documents as subsections
     - Note in description: "Multi-part document"
   - **README Files**:
     - Convert `README.md` to descriptive title from content
   - **Nested Subfolders**:
     - Limit main index to 2 levels
     - Suggest sub-indexes for deeper structures

5. **Consistency Enforcement**
   - Ensure all relative paths start with `./`
   - Verify all headings use correct levels (2 for sections, 3 for entries)
   - Add blank line after each description
   - Maintain consistent spacing throughout

**Output**: Complete, well-formatted index structure ready for writing

#### Step 7: Write Updated Index File (Persistence Phase)
**Objective**: Write updated index to filesystem

**Sub-steps**:
1. **Generate Content**
   - Convert index structure to markdown text
   - Apply final formatting rules
   - Add any header/footer content (timestamps, generation notes)

2. **Backup Existing Index**
   - If `docs/index.md` exists, create backup
   - Save as `docs/index.md.backup` (optional, timestamp)
   - Preserve for rollback if needed

3. **Write New Index**
   - Write generated content to `docs/index.md`
   - Flush to filesystem
   - Verify write completed successfully

4. **Verify Output**
   - Re-read written file
   - Validate structure integrity
   - Check file size (warn if empty or too small)

**Output**: Updated `docs/index.md` successfully written

#### Step 8: Generate Summary Report (Reporting Phase)
**Objective**: Provide comprehensive report of changes made

**Sub-steps**:
1. **Changes Summary**
   - Count newly indexed files
   - Count updated entries
   - Count removed entries
   - Count new folders discovered

2. **Detailed Listings**
   - **Newly Indexed Files** (organized by folder):
     ```
     ## Root Documents
     - [Title 1](./file1.md)
     - [Title 2](./file2.md)

     ## Folder Name
     - [Title 3](./folder/file3.md)
     ```
   - **Updated Entries**: List files with updated descriptions
   - **Removed Entries**: List with confirmation status:
     ```
     Removed Entries:
     - [Old Title](./old-path.md) - User confirmed removal
     ```
   - **Updated Paths**: List files with path changes:
     ```
     Updated Paths:
     - [Title](./old-path.md) → [Title](./new-path.md)
     ```
   - **Kept Despite Missing**: List entries user chose to keep

3. **New Folders**
   - List all newly discovered folders
   - Note organization impact

4. **Issues and Inconsistencies**
   - Report deeply nested structures (> 2 levels)
   - Note duplicate titles
   - Highlight potential issues (missing descriptions, etc.)
   - Suggest improvements

5. **Statistics**
   - Total documents indexed
   - Total folders
   - Coverage percentage (if known total)
   - Index file size

**Output**: Comprehensive summary report of indexing operation

### Sequential Dependencies
- **Step 2 depends on Step 1**: Need validated directory before scanning
- **Step 3 depends on Step 1**: Need file access before reading index
- **Step 4 depends on Step 2**: Need discovered files before analysis
- **Step 5 depends on Steps 3 & 4**: Need both existing and discovered files to identify missing
- **Step 6 depends on Steps 4 & 5**: Need analyzed files and remediation decisions
- **Step 7 depends on Step 6**: Need complete structure before writing
- **Step 8 depends on Step 7**: Need written file to report success

### Parallel Opportunities
- **Steps 2 & 3** can run in parallel (scan filesystem + read existing index)
- **Step 4** can process files in parallel (independent content analysis)
- Report generation can start accumulating data throughout execution

---

## 4. Decision Points & Branching Logic

### Decision Point 1: Documentation Directory Existence
**Location**: Step 1 (Initialize & Validate Inputs)
**Condition**: `docs/` directory exists?

**Branch A: Directory Exists**
- Validate read/write permissions
- Proceed to Step 2 (scan)

**Branch B: Directory Does Not Exist**
- Prompt user: "docs/ directory not found. Create it? (Y/n)"
- If Yes: Create directory, proceed to Step 2
- If No: Prompt for alternate path, validate, proceed to Step 2
- If alternate path invalid: Report error, exit

**Impact**: Determines whether to create directory or use alternate location

---

### Decision Point 2: Existing Index File Presence
**Location**: Step 3 (Parse Existing Index)
**Condition**: `docs/index.md` exists?

**Branch A: Index Exists**
- Parse existing structure
- Extract entries and descriptions
- Identify broken links
- Preserve quality content
- Proceed with update mode

**Branch B: Index Does Not Exist**
- Skip parsing step
- No existing entries to preserve
- All discovered files are "new"
- Proceed with creation mode
- Build index from scratch

**Impact**: Determines whether to update existing index or create new one

---

### Decision Point 3: File Already Indexed
**Location**: Step 4 (Analyze Each Documentation File)
**Condition**: File already has entry in existing index?

**Branch A: File Already Indexed**
- Compare existing description with generated description
- If existing description adequate: Preserve it
- If existing description poor/missing: Use generated description
- Mark as "existing" in change tracking
- Check if path changed (moved file)

**Branch B: File Not Indexed**
- Use generated description
- Mark as "new" in change tracking
- Add to list of newly indexed files
- Include in "New Files" section of report

**Impact**: Determines whether to preserve or generate description

---

### Decision Point 4: Existing Description Quality
**Location**: Step 4 (Analyze Each Documentation File) - Sub-decision
**Condition**: Existing description adequate?
**Prerequisite**: File already indexed (Decision Point 3, Branch A)

**Branch A: Existing Description Adequate**
- Preserve existing description verbatim
- Skip description generation
- Maintain user-authored content
- Mark as "preserved" in tracking

**Branch B: Existing Description Poor/Missing**
- Generate new description from content
- Replace existing description
- Mark as "updated" in change tracking
- Include in "Updated Entries" report section

**Criteria for "Adequate"**:
- Length: 1-3 sentences (not too short or verbose)
- Content: Describes document purpose clearly
- Grammar: No obvious errors
- Relevance: Accurately reflects document content

**Impact**: Balances preservation with quality improvement

---

### Decision Point 5: Missing File Detected
**Location**: Step 5 (Handle Missing Files)
**Condition**: Index entry references non-existent file?

**Branch A: File Exists**
- No action needed
- Include in final index
- Mark as "valid" in tracking

**Branch B: File Missing**
- Present interactive prompt to user
- Proceed to Decision Point 6 (User Choice)

**Impact**: Triggers interactive remediation workflow

---

### Decision Point 6: Missing File Remediation Choice
**Location**: Step 5 (Handle Missing Files) - User Decision
**Condition**: User chooses option for missing file?
**Prerequisite**: Missing file detected (Decision Point 5, Branch B)

**Branch A: Remove Entry (Option 1)**
- Mark entry for removal
- Exclude from updated index
- Log removal decision
- Include in "Removed Entries" report section

**Branch B: Update File Path (Option 2)**
- Prompt user for new file path
- Validate new path (file must exist)
- Update entry with new path
- Preserve title and description
- Log path update
- Include in "Updated Paths" report section
- **Sub-decision**: New path valid?
  - If Yes: Apply update
  - If No: Re-prompt or offer options 1 or 3

**Branch C: Keep Entry (Option 3)**
- Preserve entry in index
- Optionally add note: "*(Currently unavailable)*"
- Log decision to keep
- Include in "Kept Despite Missing" report section
- Entry remains in index with warning

**Impact**: User controls how broken links are resolved

---

### Decision Point 7: Folder Contains Index File (Sharded Document)
**Location**: Step 6 (Build Updated Index Structure)
**Condition**: Folder contains `index.md` file?

**Branch A: Folder Has Index.md (Sharded Document)**
- Treat as multi-part document
- Use folder's `index.md` title as section title
- List folder's documents as subsections
- Add note: "Multi-part document"
- Create special hierarchical structure

**Branch B: Regular Folder**
- Create standard folder section
- List documents alphabetically
- Use folder name as section title
- Standard description for each entry

**Impact**: Determines index structure for sharded vs. regular documents

---

### Decision Point 8: Nested Folder Depth
**Location**: Step 6 (Build Updated Index Structure)
**Condition**: Folder nesting level > 2?

**Branch A: Depth ≤ 2 Levels**
- Include in main index
- Create section in `docs/index.md`
- List all documents in folder

**Branch B: Depth > 2 Levels**
- Warn in report: "Deeply nested structure detected"
- Suggest creating sub-index: `folder/subfolder/index.md`
- Include in main index with note: "See folder index"
- Provide guidance on restructuring

**Impact**: Maintains index readability for deeply nested structures

---

### Decision Point 9: Hidden Files Inclusion
**Location**: Step 2 (Scan Documentation Structure)
**Condition**: `include_hidden` flag set?

**Branch A: Include Hidden Files (Flag = true)**
- Include files starting with `.` in scan
- Index hidden documentation
- Apply other filters normally

**Branch B: Exclude Hidden Files (Flag = false, Default)**
- Skip files starting with `.`
- Skip folders starting with `.`
- Log skipped files in report

**Impact**: Controls visibility of hidden documentation

---

### Decision Point 10: Exclusion Pattern Match
**Location**: Step 2 (Scan Documentation Structure)
**Condition**: File/folder matches exclusion pattern?

**Branch A: Matches Exclusion Pattern**
- Skip file/folder
- Do not index
- Log in excluded files report
- Examples: `.git`, `node_modules`, `*.tmp`

**Branch B: Does Not Match**
- Include in scan
- Process for indexing
- Add to file discovery list

**Impact**: Filters out non-relevant files from indexing

---

### Condition Summary Table

| Decision Point | Condition | Branches | Impact |
|---------------|-----------|----------|--------|
| 1. Directory Existence | `docs/` exists? | Exists / Create / Alternate | Setup path |
| 2. Index File Presence | `index.md` exists? | Update / Create | Preservation mode |
| 3. File Already Indexed | Entry exists? | Update / New | Description source |
| 4. Description Quality | Adequate? | Preserve / Generate | Content quality |
| 5. File Missing | File exists? | Valid / Remediate | Broken link handling |
| 6. Missing File Action | User choice? | Remove / Update / Keep | Link resolution |
| 7. Sharded Document | Has `index.md`? | Sharded / Regular | Section structure |
| 8. Nested Depth | Depth > 2? | Include / Sub-index | Hierarchy management |
| 9. Hidden Files | Include flag? | Include / Exclude | Visibility control |
| 10. Exclusion Match | Matches pattern? | Exclude / Include | File filtering |

---

## 5. User Interaction Points

### Interaction Pattern: Elicitation Mode
This task uses **Interactive Prompting** for critical decisions that require user judgment. Unlike template-driven elicitation (1-9 format), this task uses simple confirmation prompts and option selection.

**Interaction Characteristics**:
- **Frequency**: Multiple interactions during missing file remediation phase
- **Timing**: After discovery and analysis, before index generation
- **Mode**: Synchronous (waits for user input before proceeding)
- **Skippability**: Cannot be skipped (user decisions required for destructive actions)
- **Batch vs. Individual**: Individual prompts for each missing file

---

### Interaction 1: Startup Input Gathering (Optional)
**Location**: Step 1 (Initialize & Validate Inputs)
**Trigger**: Task invocation
**Required**: Only if non-default values needed

**Prompt Format**:
```
Documentation Indexing Task
----------------------------

Required Input:
1. Documentation directory location (default: ./docs):
2. Exclude files/folders (default: .git, node_modules):
3. Include hidden files? (default: no):
4. Custom categorization preferences (optional):

Press Enter to use defaults or provide custom values.
```

**User Response Options**:
- Press Enter: Use all defaults
- Provide custom values: Override defaults
- Type path: Specify custom docs location
- List patterns: Custom exclusions

**Task Behavior**:
- Wait for input or Enter
- Validate provided values
- Apply configuration
- Proceed to scanning

**Skip Condition**: All defaults accepted (Enter pressed)

---

### Interaction 2: Directory Creation Confirmation
**Location**: Step 1 (Initialize & Validate Inputs)
**Trigger**: `docs/` directory not found
**Required**: Yes (prevents error)

**Prompt Format**:
```
Documentation directory not found: ./docs

Create directory? (Y/n):
```

**User Response Options**:
- `Y` or Enter: Create directory, proceed
- `n`: Prompt for alternate path
- Alternate path: Use custom location

**Task Behavior**:
- Wait for user input
- If Yes: Create directory, continue
- If No: Prompt for alternate path
- Validate alternate path if provided
- Retry or exit if invalid

**Skip Condition**: Cannot be skipped (directory required)

---

### Interaction 3: Missing File Remediation (Primary Interactive Loop)
**Location**: Step 5 (Handle Missing Files)
**Trigger**: Entry references non-existent file
**Required**: Yes (prevents unintended data loss)
**Frequency**: Once per missing file

**Prompt Format**:
```
Missing file detected:
----------------------------
Title: Getting Started Guide
Path: ./guides/getting-started.md
Description: Comprehensive guide for new users to get started with the platform
Section: Guides

This file is referenced in the index but not found in the filesystem.

Options:
1. Remove this entry from the index
2. Update the file path (file was moved)
3. Keep entry and mark as temporarily unavailable

Please choose an option (1/2/3):
```

**User Response Options**:

**Option 1: Remove Entry**
- Input: `1`
- Effect: Entry removed from index
- Confirmation: "Entry removed. Will not appear in updated index."
- Reversibility: Can be re-added later if file returns

**Option 2: Update Path**
- Input: `2`
- Follow-up prompt: "Enter new file path (relative to docs/): "
- User provides: `./archive/getting-started.md`
- Validation: Check if new file exists
- If valid: Update entry path, preserve title/description
- If invalid: Re-prompt or offer options 1 or 3
- Confirmation: "Path updated to ./archive/getting-started.md"

**Option 3: Keep Entry**
- Input: `3`
- Effect: Entry preserved with optional warning note
- Confirmation: "Entry kept. Will be marked as temporarily unavailable."
- Note added: "*(Currently unavailable)*" after title

**Task Behavior**:
- Present each missing file sequentially
- Wait for valid input (1, 2, or 3)
- Validate input
- If option 2, prompt for new path and validate
- Log decision
- Move to next missing file
- Complete loop when all resolved

**Skip Condition**: Cannot be skipped (NEVER remove entries without confirmation)

**Batch Option (Optional Enhancement)**:
```
Found 5 missing files. Choose remediation mode:
1. Interactive (decide for each file)
2. Remove all
3. Keep all

Mode:
```

---

### Interaction 4: Path Update Validation Failure
**Location**: Step 5 (Handle Missing Files) - Sub-interaction
**Trigger**: User provides invalid path in option 2
**Required**: Yes (ensure valid path)

**Prompt Format**:
```
Error: File not found at path: ./archive/getting-started.md

Options:
1. Try different path
2. Remove entry instead
3. Keep entry as unavailable

Please choose (1/2/3):
```

**User Response Options**:
- `1`: Re-prompt for path (retry)
- `2`: Remove entry (switch to option 1)
- `3`: Keep entry (switch to option 3)

**Task Behavior**:
- Validate new choice
- Execute selected option
- Log decision
- Proceed to next missing file

---

### Interaction 5: Completion Confirmation (Optional)
**Location**: Step 8 (Generate Summary Report)
**Trigger**: Index update complete
**Required**: No (informational)

**Prompt Format**:
```
Documentation index updated successfully!

Summary:
- 12 files newly indexed
- 3 entries updated
- 2 entries removed
- 1 entry path updated
- 2 new folders discovered

View detailed report? (Y/n):
```

**User Response Options**:
- `Y` or Enter: Display detailed report
- `n`: Show summary only

**Task Behavior**:
- Display summary by default
- If Yes: Show full detailed report
- If No: Skip detailed report
- Exit task

---

### Interaction Summary Table

| Interaction | Location | Required | Frequency | Can Skip? | Purpose |
|------------|----------|----------|-----------|-----------|---------|
| 1. Startup Input | Step 1 | No | Once | Yes | Custom configuration |
| 2. Create Directory | Step 1 | Yes | Once (if needed) | No | Ensure directory exists |
| 3. Missing File Remediation | Step 5 | Yes | Per missing file | No | Prevent data loss |
| 4. Path Validation Failure | Step 5 | Yes | Per invalid path | No | Ensure valid path |
| 5. Completion Confirmation | Step 8 | No | Once | Yes | View detailed report |

---

### Elicitation Strategy
**Mode**: Interactive confirmation for destructive actions
**Philosophy**: "Never remove without confirmation, always allow path updates"
**User Experience**:
- Simple option selection (1/2/3)
- Clear consequences for each choice
- Validation and error recovery
- Batch processing possible but individual control preserved

---

## 6. Output Specifications

### Primary Output: `docs/index.md`

#### Output Location
- **Path**: `docs/index.md` (relative to project root)
- **Alternative**: User-specified location from input configuration
- **Creation**: Created if doesn't exist, overwritten if exists
- **Backup**: Optional backup as `docs/index.md.backup` (timestamped)

#### Output Format: Markdown

#### Structure Specification

```markdown
# Documentation Index

## Root Documents

### [Document Title 1](./document1.md)

Brief description of document1's purpose and contents.

### [Document Title 2](./document2.md)

Brief description of document2's purpose and contents.

## Folder Name

Documents within the `folder-name/` directory:

### [Document in Folder](./folder-name/document.md)

Description of this document within the folder.

### [Another Document](./folder-name/another.md)

Description of another document in this folder.

## Another Folder

Documents within the `another-folder/` directory:

### [Nested Document](./another-folder/nested.md)

Description of nested document.
```

#### Formatting Rules

**1. Heading Levels**:
- **Level 1** (`#`): Index title only ("Documentation Index")
- **Level 2** (`##`): Folder sections ("Root Documents", "Folder Name")
- **Level 3** (`###`): Document entries (title + link)
- No deeper heading levels used

**2. Entry Format**:
```markdown
### [Document Title](relative/path/to/file.md)

Brief description paragraph.
```

**3. Link Format**:
- Relative path from `docs/` root
- Always starts with `./`
- Forward slashes only (`/`, not `\`)
- Example: `./guides/api-reference.md`

**4. Description Format**:
- 1-3 sentences
- Concise but informative
- Describes document purpose and key contents
- No markdown formatting within description (plain text)
- Blank line after description

**5. Section Organization**:
- **Root Documents** section always first
- Folder sections sorted alphabetically
- Documents within sections sorted alphabetically by title
- Blank line between sections

**6. Folder Section Format**:
```markdown
## Folder Name

Documents within the `folder-name/` directory:

### [Document 1](./folder-name/doc1.md)
...
```

**7. Spacing**:
- One blank line after each section heading
- One blank line after each description
- No blank lines between title and description

#### Special Cases

**Sharded Documents**:
```markdown
## Architecture Documentation

Multi-part document within the `architecture/` directory:

### [Overview](./architecture/index.md)

Main index for the architecture documentation.

### [System Design](./architecture/01-system-design.md)

Detailed system architecture and design decisions.

### [Data Model](./architecture/02-data-model.md)

Database schema and data relationships.
```

**README Files**:
```markdown
### [Project Overview](./README.md)

Main project documentation and getting started guide.
```
(Title derived from content, not "README")

**Deeply Nested Folders**:
```markdown
## Advanced Topics

Documents within the `advanced/` directory:

### [Nested Documentation](./advanced/topics/index.md)

See the advanced topics folder index for detailed documentation. *(Nested 3+ levels)*
```

---

### Secondary Output: Summary Report (Console/Log)

#### Report Location
- **Format**: Markdown or plain text
- **Destination**: Console output (stdout) or log file
- **Timing**: Generated after index file written (Step 8)

#### Report Structure

**1. Header**:
```markdown
# Documentation Index Update Report
Generated: 2025-10-14 14:30:00
```

**2. Changes Summary**:
```markdown
## Summary
- 12 files newly indexed
- 3 entries updated
- 2 entries removed
- 1 entry path updated
- 2 entries kept despite missing files
- 2 new folders discovered
```

**3. Newly Indexed Files** (organized by folder):
```markdown
## Newly Indexed Files

### Root Documents
- [Getting Started](./getting-started.md)
- [Installation Guide](./installation.md)

### API Reference
- [Authentication](./api/authentication.md)
- [Endpoints](./api/endpoints.md)
```

**4. Updated Entries**:
```markdown
## Updated Entries
- [Configuration](./config.md) - Description updated
- [Deployment](./deployment.md) - Description updated
```

**5. Removed Entries**:
```markdown
## Removed Entries
- [Old Guide](./old-guide.md) - User confirmed removal
- [Deprecated](./deprecated.md) - User confirmed removal
```

**6. Updated Paths**:
```markdown
## Updated Paths
- [Migration Guide](./old-location/migration.md) → [Migration Guide](./guides/migration.md)
```

**7. Kept Despite Missing**:
```markdown
## Entries Kept (Files Missing)
- [Future Feature](./future/feature.md) - Kept by user choice, marked as unavailable
```

**8. New Folders**:
```markdown
## New Folders Discovered
- `tutorials/`
- `api/`
```

**9. Issues and Recommendations**:
```markdown
## Issues and Recommendations
- ⚠️ Deeply nested structure detected: `docs/guides/advanced/topics/` (4 levels)
  Recommendation: Create sub-index at `docs/guides/advanced/index.md`

- ⚠️ Duplicate titles found:
  - "Getting Started" appears in both ./getting-started.md and ./guides/getting-started.md
  Recommendation: Use more specific titles to differentiate

- ℹ️ 3 files excluded by filter: .gitignore, node_modules/, _drafts/
```

**10. Statistics**:
```markdown
## Statistics
- Total documents indexed: 45
- Total folders: 8
- Index file size: 15.2 KB
- Files excluded by filter: 3
```

---

### Output Validation

#### Index File Validation
1. **File Created**: `docs/index.md` exists on filesystem
2. **Non-Empty**: File size > 100 bytes (not empty)
3. **Valid Markdown**: Parseable markdown structure
4. **Structure Integrity**:
   - Has level 1 heading
   - Has at least one level 2 section
   - All links are valid markdown format
   - All relative paths start with `./`
5. **Content Completeness**:
   - All discovered files have entries (unless intentionally removed)
   - All entries have descriptions
   - All folder sections present

#### Report Validation
1. **Summary Counts Match**: Numbers in summary match detailed listings
2. **All Missing Files Addressed**: Every missing file has a logged decision
3. **No Unresolved Issues**: All errors and inconsistencies reported

---

### Output File Naming Conventions
- **Index**: Always `index.md` (lowercase, no variations)
- **Backup**: `index.md.backup-YYYYMMDD-HHMMSS` (if created)
- **Report**: `index-update-report-YYYYMMDD.md` (if saved to file)

---

### Output Permissions
- **Read**: All users with read access to docs/
- **Write**: Task execution context must have write access
- **Modify**: Index file can be manually edited after generation
- **Version Control**: Index file should be committed to version control

---

## 7. Error Handling & Validation

### Error Categories

#### Category 1: Input/Configuration Errors

**Error 1.1: Documentation Directory Not Found**
- **Trigger**: `docs/` directory doesn't exist and user declines creation
- **Detection**: Step 1 (Initialize & Validate Inputs)
- **Severity**: Critical (task cannot proceed)
- **Handling**:
  ```
  Error: Documentation directory not found: ./docs

  Options:
  1. Create directory now
  2. Specify alternate directory
  3. Exit task

  Please choose (1/2/3):
  ```
- **Recovery**:
  - Option 1: Create directory automatically
  - Option 2: Prompt for path, validate, retry
  - Option 3: Exit gracefully with message
- **User Communication**: Clear prompt with options
- **Logging**: Log directory path attempted and user choice

**Error 1.2: No Read Access to Documentation Directory**
- **Trigger**: Insufficient permissions to read `docs/` directory
- **Detection**: Step 1 or Step 2 (filesystem access check)
- **Severity**: Critical
- **Handling**:
  ```
  Error: Permission denied reading directory: ./docs

  This task requires read access to the documentation directory.
  Please check file permissions and try again.

  Suggested fix: chmod +r ./docs
  ```
- **Recovery**: Cannot automatically recover, requires user action
- **User Communication**: Error message with suggested fix
- **Logging**: Log permission error details

**Error 1.3: No Write Access to Index File**
- **Trigger**: Cannot write to `docs/index.md` (permissions or filesystem issue)
- **Detection**: Step 7 (Write Updated Index File)
- **Severity**: Critical
- **Handling**:
  ```
  Error: Permission denied writing to: ./docs/index.md

  This task requires write access to create/update the index file.

  Suggested fix: chmod +w ./docs/index.md
  ```
- **Recovery**: Offer to write to alternate location
- **User Communication**: Error message with suggested fix and alternate option
- **Logging**: Log write failure details

#### Category 2: File Discovery & Parsing Errors

**Error 2.1: Empty Documentation Directory**
- **Trigger**: No `.md` or `.txt` files found in `docs/` directory
- **Detection**: Step 2 (Scan Documentation Structure)
- **Severity**: Warning (not critical, but unusual)
- **Handling**:
  ```
  Warning: No documentation files found in ./docs

  The documentation directory exists but contains no .md or .txt files to index.

  Options:
  1. Verify directory location is correct
  2. Check exclusion filters (currently excluding: .git, node_modules)
  3. Create empty index.md placeholder
  4. Exit task

  Please choose (1/2/3/4):
  ```
- **Recovery**:
  - Option 1: Re-prompt for directory location
  - Option 2: Review/adjust exclusion filters
  - Option 3: Create minimal index with note
  - Option 4: Exit
- **User Communication**: Warning with context and options
- **Logging**: Log directory scanned, file count, filters applied

**Error 2.2: Malformed Existing Index**
- **Trigger**: `docs/index.md` exists but cannot be parsed (corrupt, invalid structure)
- **Detection**: Step 3 (Parse Existing Index)
- **Severity**: Medium (can proceed but may lose existing structure)
- **Handling**:
  ```
  Warning: Existing index file appears malformed: ./docs/index.md

  Issues detected:
  - Invalid markdown structure
  - Missing required headings
  - Unparseable entries

  Options:
  1. Create backup and rebuild index from scratch
  2. Attempt to salvage existing content
  3. Exit and allow manual repair

  Please choose (1/2/3):
  ```
- **Recovery**:
  - Option 1: Backup existing file, create new index
  - Option 2: Best-effort parsing, warn about lost content
  - Option 3: Exit for manual intervention
- **User Communication**: Explain issue clearly with options
- **Logging**: Log parsing errors and user choice

**Error 2.3: File Read Failure**
- **Trigger**: Cannot read specific documentation file for content analysis
- **Detection**: Step 4 (Analyze Each Documentation File)
- **Severity**: Low (skip file, continue with others)
- **Handling**:
  ```
  Warning: Could not read file: ./guides/advanced-topics.md
  Reason: Permission denied

  Action: Skipping this file. It will not be indexed.
  ```
- **Recovery**: Skip file, continue processing others
- **User Communication**: Warning logged, continue silently
- **Logging**: Log skipped file with reason
- **Report**: Include in "Issues" section of final report

#### Category 3: Content Analysis Errors

**Error 3.1: No Title Extractable**
- **Trigger**: File has no headings and filename is non-descriptive
- **Detection**: Step 4 (Title Extraction sub-step)
- **Severity**: Low (use fallback)
- **Handling**: Use filename as title, clean up formatting
- **Recovery**: Automatic fallback
  ```
  # Filename: api-docs-v2-final-FINAL.md
  # Title used: "API Docs V2"
  ```
- **User Communication**: Include in report as recommendation
- **Logging**: Log files using filename as title
- **Report**:
  ```
  Recommendations:
  - Add descriptive title heading to: ./api-docs-v2-final-FINAL.md
  ```

**Error 3.2: Content Unreadable (Binary/Encrypted)**
- **Trigger**: File extension is `.md` but content is binary or unreadable
- **Detection**: Step 4 (Description Generation)
- **Severity**: Low (use generic description)
- **Handling**: Use generic description, flag in report
  ```
  Description generated: "Documentation file (content unreadable)"
  ```
- **Recovery**: Include entry with generic description
- **User Communication**: Warning in report
- **Logging**: Log files with unreadable content
- **Report**: List files needing manual description

**Error 3.3: Description Generation Failure**
- **Trigger**: Cannot analyze content to generate meaningful description
- **Detection**: Step 4 (Description Generation)
- **Severity**: Low (use placeholder)
- **Handling**: Use placeholder description
  ```
  Description: "Documentation file. [Description pending]"
  ```
- **Recovery**: Include entry, flag for manual update
- **User Communication**: Include in report recommendations
- **Logging**: Log files needing manual descriptions
- **Report**: List files with placeholder descriptions

#### Category 4: User Interaction Errors

**Error 4.1: Invalid User Input (Missing File Remediation)**
- **Trigger**: User enters invalid option (not 1, 2, or 3)
- **Detection**: Step 5 (Handle Missing Files)
- **Severity**: Low (re-prompt)
- **Handling**:
  ```
  Error: Invalid input "remove" (expected 1, 2, or 3)

  Please choose an option (1/2/3):
  ```
- **Recovery**: Re-prompt with validation
- **User Communication**: Clear error message, re-display options
- **Logging**: Log invalid inputs (UX improvement signal)
- **Retry Limit**: 3 attempts, then default to option 3 (keep entry)

**Error 4.2: Invalid Path Provided (Path Update)**
- **Trigger**: User provides non-existent path when updating entry
- **Detection**: Step 5 (Path Update Validation)
- **Severity**: Low (re-prompt)
- **Handling**: Covered in Decision Point 9 (Interaction 4)
- **Recovery**: Re-prompt with fallback options
- **User Communication**: Error message with retry option
- **Logging**: Log invalid paths provided

**Error 4.3: User Interrupt (Ctrl+C)**
- **Trigger**: User cancels task mid-execution
- **Detection**: Signal handler (SIGINT)
- **Severity**: Medium (partial state)
- **Handling**:
  ```
  Task interrupted by user.

  Progress saved:
  - Scanned 45 files
  - Analyzed 30 files
  - 5 missing files resolved

  Warning: Index file not updated. Re-run task to complete indexing.
  ```
- **Recovery**: Graceful shutdown, no partial writes
- **User Communication**: Progress summary, how to resume
- **Logging**: Log interruption point and state

#### Category 5: Output/Write Errors

**Error 5.1: Disk Full**
- **Trigger**: Insufficient disk space to write index file
- **Detection**: Step 7 (Write Updated Index File)
- **Severity**: Critical
- **Handling**:
  ```
  Error: Insufficient disk space to write index file

  Required: ~50 KB
  Available: 10 KB

  Please free up disk space and try again.
  ```
- **Recovery**: Cannot proceed, exit cleanly
- **User Communication**: Clear error with space requirements
- **Logging**: Log disk space error

**Error 5.2: File System Error (Write Failure)**
- **Trigger**: Unexpected filesystem error during write
- **Detection**: Step 7 (Write Updated Index File)
- **Severity**: Critical
- **Handling**:
  ```
  Error: Failed to write index file: ./docs/index.md
  Reason: [filesystem error details]

  Options:
  1. Retry write
  2. Write to alternate location
  3. Display content (for manual save)

  Please choose (1/2/3):
  ```
- **Recovery**:
  - Option 1: Retry write operation
  - Option 2: Prompt for alternate path
  - Option 3: Output generated content to console
- **User Communication**: Error details with recovery options
- **Logging**: Log full error details

**Error 5.3: Index Verification Failure**
- **Trigger**: Written file doesn't match expected structure
- **Detection**: Step 7 (Verify Output sub-step)
- **Severity**: Medium (file written but may have issues)
- **Handling**:
  ```
  Warning: Index file written but verification failed

  Issues detected:
  - File size smaller than expected (expected ~50KB, got 5KB)
  - Some entries may be missing

  Options:
  1. Review file manually: ./docs/index.md
  2. Re-run task
  3. Continue (file may be valid)

  Please choose (1/2/3):
  ```
- **Recovery**: User decides whether to accept or retry
- **User Communication**: Verification failure details with options
- **Logging**: Log verification issues

#### Category 6: Edge Cases & Validation Errors

**Error 6.1: Circular Reference Detected (Sharded Docs)**
- **Trigger**: Folder's index.md references itself or creates circular structure
- **Detection**: Step 6 (Build Updated Index Structure)
- **Severity**: Low (skip circular reference)
- **Handling**: Break circular reference, use standard structure
  ```
  Warning: Circular reference detected in: ./architecture/index.md
  Action: Using standard folder organization instead of sharded structure.
  ```
- **Recovery**: Automatic fallback to standard structure
- **User Communication**: Warning in report
- **Logging**: Log circular reference details

**Error 6.2: Duplicate File Paths**
- **Trigger**: Multiple files with same relative path (shouldn't happen, but...)
- **Detection**: Step 4 (File Discovery)
- **Severity**: Low (use first occurrence)
- **Handling**: Use first occurrence, warn about duplicate
  ```
  Warning: Duplicate file path detected: ./guides/intro.md
  Action: Using first occurrence. Please resolve duplicate files.
  ```
- **Recovery**: Index first occurrence only
- **User Communication**: Warning in report
- **Logging**: Log duplicate paths

**Error 6.3: Title Conflict (Multiple Files, Same Title)**
- **Trigger**: Multiple files extract to same title
- **Detection**: Step 4 (Title Extraction)
- **Severity**: Low (titles allowed to match)
- **Handling**: Allow both entries (distinguished by path)
  ```
  Note: Duplicate title "Getting Started" found:
  - ./getting-started.md
  - ./guides/getting-started.md

  Recommendation: Use more specific titles to differentiate.
  ```
- **Recovery**: Include both entries
- **User Communication**: Recommendation in report
- **Logging**: Log title conflicts

---

### Validation Rules

#### Input Validation
1. **Directory Path**: Must be valid directory, have read access
2. **Exclusion Patterns**: Valid glob patterns
3. **Hidden Files Flag**: Boolean (true/false)
4. **Write Access**: Verify write access to index file location

#### File Discovery Validation
1. **File Extension**: Must be `.md` or `.txt`
2. **Readability**: File must be readable (not binary)
3. **Not Excluded**: File not matched by exclusion patterns
4. **Not Hidden**: Excluded if hidden and flag=false

#### Content Validation
1. **Title Length**: 1-100 characters
2. **Description Length**: 1-500 characters
3. **Path Format**: Relative path, starts with `./`, uses `/`
4. **Link Validity**: Valid markdown link syntax

#### Output Validation
1. **Structure**: Valid markdown, correct heading levels
2. **Completeness**: All discovered files have entries (or explicit removal)
3. **Format Consistency**: All entries follow format rules
4. **Link Integrity**: All links use correct relative paths

---

### Error Recovery Strategies

#### Strategy 1: Graceful Degradation
- **When**: Non-critical errors (file read failure, title extraction failure)
- **Action**: Skip problematic file, continue with others
- **Logging**: Log skipped files with reasons
- **Reporting**: Include skipped files in final report

#### Strategy 2: User-Guided Recovery
- **When**: Ambiguous situations (missing files, malformed index)
- **Action**: Present options, wait for user decision
- **Logging**: Log user choices
- **Reporting**: Include user decisions in report

#### Strategy 3: Fallback Values
- **When**: Content analysis failures
- **Action**: Use fallback values (filename as title, generic description)
- **Logging**: Log fallback usage
- **Reporting**: Flag entries needing manual review

#### Strategy 4: Partial Success
- **When**: Some operations succeed, some fail
- **Action**: Complete successful operations, report failures
- **Logging**: Log both successes and failures
- **Reporting**: Clear summary of partial results

---

## 8. Dependencies & Prerequisites

### Agent Dependencies

#### Primary Agent: BMad-Master
- **Agent ID**: `bmad-master`
- **Role**: Universal Task Executor
- **Why This Agent**:
  - Task doesn't require persona transformation
  - Utility/maintenance task suitable for general executor
  - No domain-specific expertise needed
  - Straightforward command execution

#### Agent Capabilities Required
- **File System Access**: Read/write access to documentation directory
- **Markdown Parsing**: Ability to parse and generate markdown
- **Content Analysis**: Extract headings and summarize content
- **Interactive Prompting**: Handle user input during execution
- **Report Generation**: Create formatted output reports

#### Command Invocation
```bash
# Via BMad-Master
*task index-docs

# Or direct task invocation (if framework supports)
*index-docs
```

---

### Task Dependencies

#### No Direct Task Dependencies
This task does **not** directly invoke other tasks. It's a standalone utility task.

**Related Tasks** (not dependencies, but complementary):
- `shard-doc.md`: Creates sharded document structures that this task indexes
- `create-doc.md`: Creates documentation files that may need indexing
- `document-project.md`: Brownfield documentation generation (may create docs to index)

**Workflow Context**:
- Typically run **after** documentation creation tasks
- May be run periodically as maintenance
- Can be run standalone anytime documentation changes

---

### Template Dependencies

#### No Template Dependencies
This task does **not** use YAML templates. It generates output based on discovered files and hardcoded structure rules.

**Output Format**: Markdown with fixed structure (defined in task instructions, not template)

---

### Checklist Dependencies

#### No Checklist Dependencies
This task does **not** invoke or validate against checklists.

**Quality Assurance**: Built-in validation rules (see Section 7: Validation Rules)

---

### Data File Dependencies

#### No Required Data Files
This task operates entirely on:
1. File system (docs/ directory contents)
2. Existing index file (if present)
3. User input (configuration and remediation decisions)

**Optional Data Files**:
- Exclusion patterns could be loaded from config file (currently inline)
- Description generation templates could be stored externally (currently inline logic)

---

### Configuration Dependencies

#### Core Configuration File: `core-config.yaml`
**Usage**: Task may reference project-level configuration for:
- Documentation directory location (if customized)
- Default exclusion patterns
- Project-specific organization preferences

**Example Configuration Section**:
```yaml
documentation:
  location: ./docs
  index_file: index.md
  exclusions:
    - .git
    - node_modules
    - _drafts
  include_hidden: false
```

**Fallback**: Task uses built-in defaults if config not present

---

### File System Dependencies

#### Required Directories
1. **Documentation Directory** (`docs/`)
   - **Purpose**: Contains all documentation files to be indexed
   - **Permission**: Read access required
   - **Creation**: Task can create if missing (with confirmation)
   - **Validation**: Must exist or be creatable

2. **Project Root**
   - **Purpose**: Base path for resolving relative paths
   - **Permission**: Read access required
   - **Requirement**: Task must be run from project root

#### Required Files
1. **Index File** (`docs/index.md`)
   - **Purpose**: Central documentation catalog
   - **Permission**: Write access required
   - **Creation**: Task creates if missing
   - **Backup**: Optional backup before overwrite

#### Optional Files
1. **Existing Documentation Files** (`.md`, `.txt`)
   - **Purpose**: Files to be indexed
   - **Permission**: Read access required
   - **Validation**: Skipped if unreadable

---

### External Tool Dependencies

#### Markdown Parser
- **Tool**: Internal markdown parsing capability (native to AI agent)
- **Purpose**: Parse existing index, extract headings from docs
- **Fallback**: Regex-based parsing if full parser unavailable

#### File System API
- **Tool**: Standard filesystem operations (read, write, list, stat)
- **Purpose**: Scan directories, read files, write index
- **Requirement**: Must be available in execution environment

#### No External CLI Tools Required
- **Note**: Task does **not** require external tools like `find`, `grep`, `tree`, etc.
- **Reason**: All operations use native file system API and AI agent capabilities

---

### Runtime Prerequisites

#### Execution Environment
1. **Platform**: Cross-platform (Linux, macOS, Windows)
2. **Permissions**: Read/write file system access
3. **Working Directory**: Must be run from project root (or specify full paths)

#### Resource Requirements
1. **Memory**: Low (process files sequentially)
2. **Disk Space**: Minimal (index file typically < 100 KB)
3. **Execution Time**: Scales with file count (~1-5 seconds per 100 files)

#### State Requirements
1. **No Persistent State**: Task is stateless between runs
2. **Idempotent**: Can be run multiple times safely
3. **No Lock Files**: No concurrency control needed

---

### Prerequisite Validation Checklist

**Before Task Execution**:
- [ ] Project root identified
- [ ] Documentation directory location known
- [ ] Write access to docs/ directory confirmed
- [ ] Exclusion patterns loaded (or defaults used)
- [ ] Agent has file system access capabilities

**During Task Execution**:
- [ ] All discovered files readable
- [ ] Existing index parseable (or handled gracefully)
- [ ] User available for interactive prompts (missing file remediation)

**After Task Execution**:
- [ ] Index file successfully written
- [ ] Index file validates correctly
- [ ] Summary report generated
- [ ] No unresolved errors

---

### Dependency Resolution

#### Missing Documentation Directory
**Resolution**: Interactive prompt to create or specify alternate path

#### Missing Index File
**Resolution**: Create new index from scratch

#### Inaccessible Files
**Resolution**: Skip files, log in report with recommendations

#### Malformed Existing Index
**Resolution**: User-guided recovery (rebuild, salvage, or manual repair)

---

### Integration Points

#### File System
- **Direction**: Bidirectional (read docs, write index)
- **Protocol**: Native filesystem API
- **Error Handling**: Graceful failure with user notification

#### User Interface
- **Direction**: Bidirectional (prompts, responses)
- **Protocol**: Interactive console/terminal
- **Error Handling**: Input validation, re-prompting

#### Agent Framework
- **Direction**: Task receives command, returns results
- **Protocol**: BMad-Master command invocation
- **Error Handling**: Standard error reporting

---


## 9. Integration Points

### Agent Integration

#### BMad-Master Agent
**Relationship**: Primary executor
**Integration Method**: Command invocation
**Workflow**:
1. User activates BMad-Master: `/activate BMad-Master`
2. User issues command: `*task index-docs` or `*index-docs`
3. BMad-Master loads task file: `.bmad-core/tasks/index-docs.md`
4. Executes task instructions as workflow
5. Returns results to user

**Data Exchange**:
- **Input**: Command parameters (optional: custom docs path, exclusions)
- **Output**: Console report + updated `docs/index.md` file

#### Other Agents (Indirect)
**Analyst, PM, Architect, etc.**:
- These agents may **create** documentation files
- After creation, user manually runs `index-docs` to catalog
- No automatic invocation from other agents

**PO Agent**:
- May suggest running `index-docs` as part of project validation
- Could be added to PO master checklist (not currently)
- Manual validation that docs are properly indexed

---

### Task Integration

#### Complementary Tasks (Not Dependencies)

**1. shard-doc.md**
- **Relationship**: Creates sharded document structures
- **Integration**: `shard-doc` outputs folders with `index.md` + section files
- **Impact**: `index-docs` detects sharded structure and indexes accordingly
- **Workflow Sequence**:
  ```
  1. create-doc → Creates large PRD/Architecture doc
  2. shard-doc → Splits into folder with multiple files
  3. index-docs → Catalogs sharded structure in main index
  ```

**2. create-doc.md**
- **Relationship**: Creates documentation files (PRDs, architectures, etc.)
- **Integration**: Files created by `create-doc` are discoverable by `index-docs`
- **Impact**: New documentation needs indexing after creation
- **Workflow Sequence**:
  ```
  1. create-doc → Creates PRD in docs/planning/prd.md
  2. index-docs → Adds PRD to docs/index.md catalog
  ```

**3. document-project.md**
- **Relationship**: Brownfield project documentation generator
- **Integration**: Generates comprehensive project documentation
- **Impact**: Large documentation set created, needs indexing
- **Workflow Sequence**:
  ```
  1. document-project → Generates multiple architecture docs
  2. index-docs → Catalogs all generated documentation
  ```

#### No Task Invocations
This task **does not invoke other tasks**. It's a leaf node in the task dependency graph.

---

### File System Integration

#### Input Sources

**1. Documentation Files**
- **Location**: `docs/` directory (all subdirectories)
- **Format**: Markdown (`.md`), Text (`.txt`)
- **Access**: Read-only
- **Purpose**: Discovery, title extraction, description generation

**2. Existing Index File**
- **Location**: `docs/index.md`
- **Format**: Markdown
- **Access**: Read (parsing), Write (update)
- **Purpose**: Preserve existing content, identify missing files

**3. Project Configuration**
- **Location**: `.bmad-core/core-config.yaml` (optional)
- **Format**: YAML
- **Access**: Read-only
- **Purpose**: Custom paths, exclusions, preferences

#### Output Destinations

**1. Index File**
- **Location**: `docs/index.md`
- **Format**: Markdown (structured)
- **Access**: Write (create/overwrite)
- **Consumers**: Human readers, other tools (static site generators, etc.)

**2. Backup File (Optional)**
- **Location**: `docs/index.md.backup-YYYYMMDD-HHMMSS`
- **Format**: Markdown (copy of old index)
- **Access**: Write (create)
- **Purpose**: Rollback capability

**3. Console/Log Output**
- **Location**: stdout/stderr
- **Format**: Plain text or Markdown
- **Access**: Write (append)
- **Purpose**: Summary report, warnings, errors

---

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Command                          │
│         *task index-docs [docs-path] [options]              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     BMad-Master Agent                        │
│                 Loads Task Instructions                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─────────────┬─────────────┬─────────────┐
                 ▼             ▼             ▼             ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Config File  │ │ docs/    │ │ docs/    │ │ User     │
        │ (optional)   │ │ *.md     │ │ index.md │ │ Input    │
        │              │ │ *.txt    │ │ (exists?)│ │ (prompts)│
        └──────┬───────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
               │              │            │            │
               └──────────────┴────────────┴────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Task Execution  │
                    │  (8 steps)       │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │ docs/        │          │ Console      │
        │ index.md     │          │ Report       │
        │ (updated)    │          │ (summary)    │
        └──────────────┘          └──────────────┘
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │ Human        │          │ Build Tools  │
        │ Readers      │          │ (optional)   │
        └──────────────┘          └──────────────┘
```

---

### Cross-Agent Collaboration

**No Direct Collaboration**:
This task runs independently. It doesn't coordinate with other agents during execution.

**Indirect Benefits to Other Agents**:
- **All Agents**: Benefit from well-maintained documentation index
- **BMad-Master**: Can reference index when guiding users to documentation
- **PO Agent**: Can validate documentation completeness via index
- **Orchestrator**: Can use index for web-based documentation navigation

---

### External System Integration

#### Static Site Generators (Potential)
- **Systems**: Jekyll, Hugo, MkDocs, Docusaurus
- **Integration**: `docs/index.md` can be included in generated site
- **Format Compatibility**: Standard markdown links work in most generators
- **Enhancement**: Add front matter for metadata (title, date, etc.)

#### Documentation Portals
- **Systems**: Confluence, GitBook, Notion
- **Integration**: Index can be imported or referenced
- **Format**: Markdown with links (widely supported)

#### CI/CD Pipelines
- **Integration Point**: Run `index-docs` in pre-commit hook or CI job
- **Purpose**: Ensure documentation index stays up-to-date
- **Example**:
  ```yaml
  # .github/workflows/docs.yml
  - name: Update Documentation Index
    run: bmad-master exec index-docs
  ```

---

# index-docs.md Analysis - Sections 10-16 (Continuation)

**Note**: This is a continuation of [index-docs.md](index-docs.md). Sections 1-9 are in the main file.

---

## 10. Configuration References

### Task-Specific Configuration

#### No Hardcoded Configuration File
This task **does not require** a dedicated configuration file. All configuration is via:
1. Command-line parameters (runtime inputs)
2. Interactive prompts (user decisions)
3. Optional project configuration (core-config.yaml)

---

### Optional: Project Configuration (core-config.yaml)

#### Configuration Section: `documentation`

**Location**: `.bmad-core/core-config.yaml`

**Schema**:
```yaml
documentation:
  # Documentation directory location (relative to project root)
  location: ./docs

  # Index file name
  index_file: index.md

  # Files and folders to exclude from indexing
  exclusions:
    - .git
    - node_modules
    - _drafts
    - _archive
    - "*.tmp"
    - "*.backup"

  # Include hidden files/folders (starting with .)
  include_hidden: false

  # Backup existing index before overwriting
  create_backup: true

  # Custom categorization rules (optional)
  categories:
    guides:
      display_name: "Guides & Tutorials"
      pattern: "guides/**"
    api:
      display_name: "API Reference"
      pattern: "api/**"
```

**Field Descriptions**:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `location` | String | `./docs` | Path to documentation directory |
| `index_file` | String | `index.md` | Name of index file to generate |
| `exclusions` | Array[String] | `[.git, node_modules]` | Glob patterns to exclude |
| `include_hidden` | Boolean | `false` | Include hidden files/folders |
| `create_backup` | Boolean | `true` | Backup index before overwrite |
| `categories` | Object | `{}` | Custom categorization rules |

**Usage in Task**:
```
Step 1: Initialize & Validate Inputs
  └─> Load core-config.yaml (if exists)
      └─> Read documentation.* fields
          └─> Apply as defaults (can be overridden by command params)
```

---

### Runtime Configuration (Command Parameters)

#### Command Syntax
```bash
*task index-docs [docs-path] [options]

# Examples:
*task index-docs                          # Use defaults
*task index-docs ./documentation          # Custom docs path
*task index-docs --exclude="*.tmp,_drafts" # Custom exclusions
*task index-docs --include-hidden         # Include hidden files
```

#### Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `docs-path` | String | `./docs` | Documentation directory path |
| `--exclude` | String | `.git,node_modules` | Comma-separated exclusion patterns |
| `--include-hidden` | Flag | `false` | Include hidden files/folders |
| `--no-backup` | Flag | `false` | Skip backup creation |
| `--category` | String | `folder` | Categorization mode (folder, type, custom) |

---

### File Path Configuration

#### Configurable Paths

**1. Documentation Directory**
- **Config Key**: `documentation.location`
- **Default**: `./docs`
- **Override**: Command parameter `docs-path`
- **Example**: `*task index-docs ./documentation`

**2. Index File Name**
- **Config Key**: `documentation.index_file`
- **Default**: `index.md`
- **Override**: Not typically overridden (standard name)
- **Full Path**: `{docs-path}/{index_file}` → `./docs/index.md`

**3. Backup File Location**
- **Config Key**: Derived from index file location
- **Default**: `{docs-path}/index.md.backup-{timestamp}`
- **Override**: Not configurable
- **Example**: `./docs/index.md.backup-20251014-143000`

---

### Exclusion Pattern Configuration

#### Default Exclusions
```yaml
exclusions:
  - .git          # Version control
  - .svn
  - node_modules  # Dependencies
  - venv
  - _drafts       # Work in progress
  - _archive      # Archived content
  - "*.tmp"       # Temporary files
  - "*.backup"    # Backup files
  - "*.swp"       # Editor temp files
```

#### Custom Exclusions
```bash
# Via config file
documentation:
  exclusions:
    - internal-docs
    - deprecated
    - "*.wip.md"

# Via command parameter
*task index-docs --exclude="internal-docs,deprecated,*.wip.md"
```

#### Exclusion Pattern Matching
- **Syntax**: Glob patterns (standard wildcard matching)
- **Examples**:
  - `*.tmp` → Matches all files ending in `.tmp`
  - `_drafts` → Matches folder named `_drafts`
  - `**/archive/**` → Matches `archive` folder at any level
  - `.git` → Matches hidden `.git` folder

---

### Categorization Configuration

#### Default: Folder-Based Categorization
```
Structure: Automatic based on directory structure
Sections: Folder names become section headings
Sorting: Alphabetical by folder name
```

#### Custom Categorization (Optional)
```yaml
documentation:
  categories:
    guides:
      display_name: "Guides & Tutorials"
      pattern: "guides/**"
      sort_order: 1
    api:
      display_name: "API Reference"
      pattern: "api/**"
      sort_order: 2
    reference:
      display_name: "Technical Reference"
      pattern: "reference/**"
      sort_order: 3
```

**Effect**: Organize index by custom categories instead of folders

---

### Configuration Precedence

**Priority Order** (highest to lowest):
1. **Command-line parameters**: Direct overrides (`*task index-docs ./custom-docs`)
2. **Interactive prompts**: User input during execution
3. **Project configuration**: `core-config.yaml` settings
4. **Task defaults**: Hardcoded in task instructions

**Example**:
```
Command:  *task index-docs ./documentation --exclude="*.tmp"
Config:   documentation.location: ./docs
Default:  ./docs

Result:   Uses ./documentation (command override)
          Uses *.tmp exclusion (command parameter)
```

---

### Configuration Best Practices

**1. Use Project Configuration for**:
- Team-wide standards (exclusions, categorization)
- Project-specific documentation structure
- Settings that rarely change

**2. Use Command Parameters for**:
- One-off overrides
- Testing different configurations
- User-specific preferences

**3. Avoid Hardcoding**:
- Don't hardcode paths in task instructions
- Use configuration or parameters for flexibility
- Maintain backward compatibility with defaults

---

## 11. Special Features & Patterns

### Feature 1: Preservation-First Philosophy

**Concept**: Never destroy user-authored content without explicit confirmation

**Implementation**:
1. **Existing Descriptions**: Preserved unless inadequate
2. **Missing Files**: Require user decision before removal
3. **Index Structure**: Maintained from previous version
4. **Custom Organization**: Respected and preserved

**Rationale**:
- Users may have carefully crafted descriptions
- Manual improvements should not be lost
- Unexpected file moves shouldn't cause data loss
- Trust user decisions over automatic actions

**Example**:
```markdown
# Existing Entry (preserved)
### [Getting Started](./getting-started.md)

Comprehensive guide for new users covering installation,
configuration, and first steps. Updated Q4 2024.

# Generated Entry (would be less detailed)
### [Getting Started](./getting-started.md)

Guide for getting started with the platform.
```

**Design Pattern**: Read → Preserve → Augment → Write

---

### Feature 2: Interactive Remediation (Never Auto-Delete)

**Concept**: User controls resolution of problematic entries

**Critical Rule**: **NEVER remove entries without explicit confirmation**

**Implementation**:
```
For each missing file:
  1. Present full context (title, path, description, section)
  2. Offer three options (Remove / Update Path / Keep)
  3. Wait for user decision
  4. Execute only the chosen action
  5. Log decision for audit trail
```

**Rationale**:
- Files may be temporarily unavailable (unmounted drive, network issue)
- Files may have been moved (path update needed)
- User may want to keep entry as placeholder for future docs
- Automatic deletion could lose important context

**User Experience**:
```
Missing file detected:
Title: Advanced Configuration
Path: ./config/advanced.md
Description: Detailed configuration options for power users

This file is currently missing. What would you like to do?

1. Remove entry from index
2. Update file path (file was moved)
3. Keep entry (mark as unavailable)

Choice: 3

✓ Entry kept and marked as unavailable.
```

---

### Feature 3: Hierarchical Organization (Folders as Sections)

**Concept**: Index structure mirrors documentation directory structure

**Structure**:
```
docs/
├── index.md (ROOT DOCUMENTS section)
├── getting-started.md
├── installation.md
├── guides/
│   ├── quickstart.md (GUIDES section)
│   └── advanced.md
└── api/
    ├── authentication.md (API section)
    └── endpoints.md

→ Generates index with sections:
  - Root Documents
  - Guides
  - API
```

**Benefits**:
- Natural organization that matches file system
- Easy to navigate (users know folder structure)
- Scales to large documentation sets
- Supports nested structures (with depth limits)

**Implementation**: Step 6 (Build Updated Index Structure)

---

### Feature 4: Sharded Document Detection

**Concept**: Detect multi-part documents and index them specially

**Detection**: Folder contains `index.md` file

**Structure**:
```
docs/
└── architecture/
    ├── index.md (main document)
    ├── 01-system-design.md
    ├── 02-data-model.md
    └── 03-api-design.md

→ Detected as sharded document
```

**Special Handling**:
```markdown
## Architecture Documentation

Multi-part document within the `architecture/` directory:

### [Overview](./architecture/index.md)

Main index for the architecture documentation.

### [System Design](./architecture/01-system-design.md)

Detailed system architecture and design decisions.

### [Data Model](./architecture/02-data-model.md)

Database schema and data relationships.

### [API Design](./architecture/03-api-design.md)

API architecture, endpoints, and protocols.
```

**Benefits**:
- Recognizes BMad's document sharding pattern (from `shard-doc` task)
- Provides better context for multi-part docs
- Links related sections together
- Maintains document hierarchy

**Integration**: Works seamlessly with `shard-doc.md` task output

---

### Feature 5: Smart Description Generation

**Concept**: Generate meaningful descriptions by analyzing document content

**Methodology**:
1. **Title Extraction**:
   - Read first 20 lines of document
   - Extract first heading (# or ##)
   - Fallback to filename if no heading
   - Clean and format title

2. **Content Analysis**:
   - Read introduction section (first 500 characters)
   - Identify document purpose (guide, reference, tutorial, etc.)
   - Extract key topics or features mentioned
   - Generate concise summary (1-2 sentences)

3. **Context Enhancement**:
   - Detect document type from structure (checklist, template, specification)
   - Add type-specific context (e.g., "Checklist for...", "Template for...")
   - Incorporate folder context (e.g., "API reference for...")

**Example**:
```markdown
# Document: api/authentication.md
# Content (first paragraph):
"This document describes the authentication mechanisms
 supported by the API, including OAuth2, API keys, and JWT."

# Generated Description:
"Describes authentication mechanisms including OAuth2, API keys,
 and JWT for API access."
```

**Quality Check**:
- Compare with existing description (if any)
- Preserve existing if more detailed or accurate
- Use generated if existing is missing or poor quality

---

### Feature 6: Nested Folder Management (Depth Limits)

**Concept**: Manage deeply nested folder structures gracefully

**Rule**: Main index includes up to 2 levels of nesting

**Handling**:
```
docs/
├── guides/ (Level 1 - included)
│   ├── quickstart.md
│   └── advanced/  (Level 2 - included)
│       ├── configuration.md
│       └── deployment/ (Level 3 - warn)
│           └── kubernetes.md
```

**Strategy**:
- **Depth ≤ 2**: Include in main index
- **Depth > 2**:
  - Include in main index with note
  - Suggest creating sub-index in that folder
  - Provide navigation hint

**Example**:
```markdown
## Advanced Guides

### [Advanced Topics Index](./guides/advanced/index.md)

See the advanced guides folder for detailed documentation on
advanced topics including deployment strategies. *(3+ levels)*
```

**Benefits**:
- Keeps main index manageable
- Guides users to detailed sub-indexes
- Maintains discoverability of deep content
- Scales to large documentation sets

---

### Feature 7: Consistent Formatting Enforcement

**Concept**: Enforce standard formatting rules throughout index

**Rules**:
1. **Heading Levels**:
   - Level 1: Index title only
   - Level 2: Section headings
   - Level 3: Document entries
2. **Link Format**:
   - Always relative paths
   - Always start with `./`
   - Forward slashes only
3. **Spacing**:
   - One blank line after section headings
   - One blank line after descriptions
   - No blank lines between title and description
4. **Sorting**:
   - Sections sorted alphabetically (except Root Documents first)
   - Entries within sections sorted alphabetically

**Enforcement**: Automatic during Step 6 (Build Updated Index Structure)

**Example**:
```markdown
# CORRECT
### [Document](./file.md)

Description here.

### [Another Document](./another.md)

Another description.

# INCORRECT (will be corrected)
### [Document](file.md)        ← Missing ./
Description here.              ← Missing blank line after title

###  [Another Document](./another.md)  ← Extra space
Another description.
```

---

### Feature 8: Comprehensive Reporting

**Concept**: Provide complete transparency into what changed and why

**Report Sections**:
1. **Summary Statistics**: Counts of all change types
2. **Detailed Listings**: What was added, updated, removed
3. **Audit Trail**: User decisions logged
4. **Recommendations**: Issues found, suggested improvements
5. **Full report at end of execution**

**Benefits**:
- Users understand what happened
- Changes are auditable
- Issues proactively surfaced
- Supports continuous improvement
- Builds confidence through transparency

**Implementation**:
```python
# Comprehensive report generation
report = {
    'summary': {
        'newly_indexed': len(new_files),
        'updated': len(updated_files),
        'removed': len(removed_files),
        'paths_updated': len(path_updates),
        'kept_despite_missing': len(kept_files)
    },
    'details': {
        'new_files': format_file_list(new_files),
        'updated_entries': format_changes(updated_files),
        'removed_entries': format_removals(removed_files),
        'path_updates': format_path_changes(path_updates),
        'issues': collect_issues(),
        'recommendations': generate_recommendations()
    },
    'statistics': {
        'total_documents': count_total_docs(),
        'total_folders': count_folders(),
        'index_size': get_index_size()
    }
}
```

**Contrast with Alternative**:
- **Anti-pattern**: Silent updates (user doesn't know what changed)
- **Anti-pattern**: Minimal reporting (only success/failure)
- **BMad pattern**: Complete transparency with actionable insights

---

### Feature 9: Idempotent Operations

**Concept**: Running the same operation multiple times produces the same result

**Guarantees**:
1. **Re-run Safety**: Running twice produces same index (if files unchanged)
2. **No Duplicate Entries**: Existing entries not duplicated
3. **Preserves Quality**: Doesn't degrade existing descriptions
4. **No Unexpected Changes**: Only changes what's necessary

**Implementation**:
- Compare discovered files with existing index
- Identify new, existing, updated, missing
- Only modify what's needed
- Preserve everything else

**Testing**: Running `*task index-docs` twice should produce identical index

---

### Feature 10: Extensibility Points

**Future Enhancements** (not currently implemented but supported by design):

**1. Custom Description Templates**
```yaml
documentation:
  description_templates:
    api: "API reference for {topic}. Includes {features}."
    guide: "Step-by-step guide for {task}. Covers {topics}."
```

**2. Multi-Language Support**
```yaml
documentation:
  languages:
    - en (default)
    - es
    - fr
  index_file_pattern: "index-{lang}.md"
```

**3. Auto-Generated Sections**
```yaml
documentation:
  auto_sections:
    - name: "Recently Updated"
      sort: "mtime"
      limit: 10
```

**4. Integration Hooks**
```yaml
documentation:
  hooks:
    pre_index: "./scripts/pre-index.sh"
    post_index: "./scripts/post-index.sh"
    on_missing_file: "./scripts/handle-missing.sh"
```

---

## 12. BMad Framework Context

### Role in BMad Workflow

#### Planning Phase
**Role**: Limited (documentation not primary focus)
- May be used to index project research documentation
- Can catalog competitive analysis, market research docs
- Not typically part of planning workflow

#### Development Phase
**Role**: Moderate (growing importance)
- Index story documentation as stories complete
- Catalog architecture decisions
- Organize technical specifications
- Track QA assessments and gate documents

#### Maintenance Phase
**Role**: High (critical for documentation management)
- Primary tool for documentation organization
- Regular maintenance task (weekly/monthly)
- Ensures documentation discoverability
- Supports onboarding and knowledge transfer

---

### Position in Agent Ecosystem

**Agent Type**: Utility / Support

**Agent Relationship**:
```
BMad-Master
   └─> index-docs (task)
       └─> No other agent dependencies

All Agents → Create Docs → [User runs index-docs] → Updated Index
```

**No Direct Agent Coordination**:
- Other agents don't invoke `index-docs`
- Task runs independently on user request
- Agents may suggest running task (manual trigger)

---

### BMad Workflow Integration Points

#### After Documentation Creation
```
Workflow: create-doc (PM creates PRD)
          ↓
          docs/planning/prd.md created
          ↓
          [User manually runs: *task index-docs]
          ↓
          docs/index.md updated with PRD entry
```

#### After Document Sharding
```
Workflow: shard-doc (PO shards architecture)
          ↓
          docs/architecture/ folder created
          ├── index.md
          ├── 01-system-design.md
          └── 02-data-model.md
          ↓
          [User manually runs: *task index-docs]
          ↓
          docs/index.md detects sharded structure
          ↓
          Sharded document section added
```

#### After Story Completion
```
Workflow: Dev completes story
          ↓
          QA review generates gate document
          ↓
          docs/stories/01-01-user-auth-gate.md created
          ↓
          [User manually runs: *task index-docs]
          ↓
          docs/index.md includes gate document
```

---

### Automation Opportunities

#### Potential: Automatic Indexing Hooks
**Not Currently Implemented, But Possible**:

**1. Post-Create Hook**
```yaml
# In create-doc.md
post_execution:
  - task: index-docs
    trigger: auto
    condition: output_to_docs_directory
```

**2. PO Master Checklist Item**
```yaml
# In po-master-checklist.md
- item: "Documentation index is up-to-date"
  validation: "Run *task index-docs to verify"
  auto_fix: "Execute index-docs task"
```

**3. CI/CD Integration**
```yaml
# .github/workflows/docs.yml
on:
  push:
    paths:
      - 'docs/**/*.md'
jobs:
  update-index:
    runs-on: ubuntu-latest
    steps:
      - name: Update Documentation Index
        run: bmad-master exec index-docs
      - name: Commit Updated Index
        run: |
          git add docs/index.md
          git commit -m "Auto-update documentation index"
          git push
```

---

### Documentation Standards in BMad

#### BMad Documentation Structure
```
project-root/
├── docs/
│   ├── index.md (maintained by index-docs task)
│   ├── planning/
│   │   ├── project-brief.md
│   │   ├── prd/ (sharded)
│   │   │   ├── index.md
│   │   │   ├── 01-vision.md
│   │   │   └── 02-features.md
│   ├── architecture/ (sharded)
│   │   ├── index.md
│   │   ├── 01-system-design.md
│   │   └── 02-data-model.md
│   ├── stories/
│   │   ├── 01-01-user-auth.md
│   │   ├── 01-01-user-auth-gate.md
│   │   └── ...
│   └── processes/
│       ├── development-workflow.md
│       └── qa-process.md
```

**Index Role**: Catalog all documentation in standardized format

---

### Relationship to BMad Core Components

#### Templates (No Direct Relationship)
- Task doesn't use YAML templates
- But indexes documentation created from templates

#### Checklists (No Direct Relationship)
- Task doesn't invoke checklists
- Could be added to PO master checklist

#### Data Files (No Direct Relationship)
- Task doesn't load data files
- Operates on documentation files only

#### Core Config (Indirect Relationship)
- May read `documentation.*` config section
- Uses project-level configuration if present

---

### Greenfield vs Brownfield Usage

#### Greenfield Projects
**Usage Pattern**: Regular maintenance task
- Run after major documentation milestones
- Index planning documents (PRD, architecture)
- Catalog story documentation as project progresses
- **Frequency**: Weekly during active development

#### Brownfield Projects
**Usage Pattern**: Initial indexing + maintenance
- **Initial**: Run `document-project` → `index-docs` to catalog existing docs
- **Ongoing**: Run after adding new documentation
- **Retroactive**: Index existing project documentation discovered during reverse engineering
- **Frequency**: Monthly or as needed

**Special Consideration**: Brownfield projects may have large existing doc sets requiring careful organization

---

### BMad Best Practices

#### When to Run `index-docs`

**Good Times**:
1. After completing planning phase (index PRD, architecture)
2. End of sprint (index completed stories)
3. After document sharding (catalog sharded structure)
4. Before project handoff (ensure docs discoverable)
5. Monthly maintenance (catch missed files)

**Bad Times**:
1. During active document editing (wait until stable)
2. Before resolving merge conflicts (may have duplicate entries)
3. On every file change (too frequent, use CI/CD instead)

#### Integration with PO Validation
```yaml
# Potential addition to po-master-checklist.md
Documentation Quality:
  - [ ] All documentation files are indexed (run *task index-docs)
  - [ ] Index descriptions are accurate and helpful
  - [ ] No broken links in documentation index
  - [ ] Documentation structure is intuitive
```

---

### Task Evolution & Future Enhancements

**Potential Additions** (aligned with BMad philosophy):

**1. Cross-Reference Validation**
- Detect broken links within documentation files
- Validate references between documents
- Report dead links for cleanup

**2. Documentation Coverage Reports**
- Compare indexed docs against project artifacts (stories, components)
- Identify undocumented features or areas
- Generate coverage heat map

**3. Quality Scoring**
- Assess description quality (length, clarity, informativeness)
- Score index completeness (all files indexed?)
- Report index health metrics

**4. Template-Based Descriptions**
- Allow custom description templates by document type
- Support placeholders for dynamic content
- Maintain consistency across similar docs

**5. Multi-Index Support**
- Support multiple indexes for different audiences (internal/external)
- Generate filtered views (public vs private docs)
- Create specialized indexes (API only, guides only)

---

## 13. ADK Translation Recommendations

### Recommended ADK Service: Cloud Functions (2nd Gen)

**Rationale**:
- **Simplicity**: Straightforward task without complex state management
- **Stateless**: Each execution is independent
- **Short Runtime**: Typically completes in seconds
- **Event-Driven**: Can be triggered by file system events
- **Cost-Effective**: Pay only for execution time

**Alternative**: App Engine Standard Environment (for always-on availability)

---

## 14. Testing Strategy

### Unit Tests

#### Test Categories

**1. File Discovery Tests**
```python
def test_scan_docs_directory_finds_all_files():
    """Test that all .md and .txt files are discovered."""
    # Setup mock filesystem
    # Execute scan
    # Assert all expected files found

def test_scan_respects_exclusions():
    """Test that excluded files are not discovered."""
    # Setup with .git and node_modules
    # Execute scan with exclusions
    # Assert excluded files not in results

def test_scan_handles_nested_folders():
    """Test that nested folders are scanned recursively."""
    # Setup nested structure (3+ levels)
    # Execute scan
    # Assert files at all levels found
```

**2. Title Extraction Tests**
**3. Description Generation Tests**
**4. Index Structure Building Tests**
**5. Missing File Handling Tests**
**6. Link Format Tests**

---

## 15. Key Insights & Design Patterns

### Pattern 1: Preservation Over Generation

**Principle**: Always preserve human-authored content over AI-generated content

**Manifestation**:
- Existing descriptions preserved unless inadequate
- Index structure maintained from previous version
- Custom organization respected
- Missing files require user confirmation before removal

**Why It Matters**:
- Users invest effort in crafting quality descriptions
- Automation should augment, not replace human judgment
- Trust is built through predictable, non-destructive behavior

**Implementation**:
```python
# Decision logic for descriptions
if existing_entry and is_adequate(existing_entry.description):
    description = existing_entry.description  # Preserve
else:
    description = generate_description(file_content)  # Generate new
```

**Contrast with Alternative**:
- **Anti-pattern**: Always regenerate descriptions (loses user improvements)
- **Anti-pattern**: Always preserve (never improves quality)
- **BMad pattern**: Smart preservation with quality checks

---

### Pattern 2: Interactive Confirmation for Destructive Actions

**Principle**: Never delete or destroy user data without explicit confirmation

**Manifestation**:
- Missing files present 3 options (remove/update/keep)
- User must explicitly choose removal
- Path updates offered before deletion
- Decisions logged for audit trail

**Why It Matters**:
- Prevents accidental data loss
- Handles temporary file unavailability gracefully
- Respects user control and agency
- Builds trust through transparency

---

### Pattern 3: Structure Reflects Reality

**Principle**: Index organization mirrors actual file system structure

### Pattern 4: Fail-Safe Defaults

**Principle**: When uncertain, choose the safe option that preserves information

### Pattern 5: Comprehensive Reporting

**Principle**: Provide complete transparency into what changed and why

### Pattern 6: Idempotent Operations

**Principle**: Running the same operation multiple times produces the same result

### Pattern 7: Separation of Discovery and Presentation

**Principle**: Separate data discovery from output formatting

### Pattern 8: Smart Defaults with Override Capability

**Principle**: Provide sensible defaults but allow customization

### Pattern 9: Progressive Enhancement

**Principle**: Basic functionality works simply, advanced features available when needed

### Pattern 10: Graceful Degradation

**Principle**: When things go wrong, degrade quality rather than fail completely

---

## 16. Change History & Evolution Potential

### Current Version: 1.0

**Implemented Features**:
- File system scanning (`.md` and `.txt`)
- Title extraction from headings or filenames
- Description generation from content analysis
- Hierarchical index structure (folders as sections)
- Missing file remediation (interactive)
- Existing description preservation
- Comprehensive reporting
- Exclusion pattern filtering
- Sharded document detection
- Idempotent operation

**Limitations**:
- Single index file only (no multi-index support)
- Manual trigger only (no automation hooks)
- Interactive remediation (challenging in headless environments)
- English-only descriptions
- Limited customization of index structure

---

### Potential Evolution: Version 2.0

#### Feature: Multi-Index Support

**Problem**: Large projects need multiple indexes for different audiences

**Solution**: Generate specialized indexes
```yaml
documentation:
  indexes:
    - name: "main"
      path: "docs/index.md"
      include: "**/*"
      exclude: "internal/**"
    - name: "internal"
      path: "docs/internal-index.md"
      include: "internal/**"
    - name: "api"
      path: "docs/api-index.md"
      include: "api/**"
```

**Benefit**: Separate public/internal, domain-specific indexes

---

#### Feature: Automated Remediation Modes

**Problem**: Interactive remediation doesn't work in CI/CD

**Solution**: Add remediation policies
```yaml
documentation:
  missing_file_policy: "keep"  # keep | remove | update-if-moved
  moved_file_detection: true
  search_archive: "docs/_archive"
```

**Benefit**: Fully automated execution in pipelines

---

### Backward Compatibility Strategy

**Commitment**: New versions maintain backward compatibility

**Approach**:
1. **Additive Changes**: New features added, old behavior preserved
2. **Deprecation Path**: Old features deprecated with warnings before removal
3. **Config Versioning**: Config schema versioned, auto-migrated
4. **Default Behavior**: Defaults remain consistent across versions

---

## Summary

The `index-docs` task is a **documentation catalog maintenance utility** that ensures all project documentation is properly indexed, organized, and discoverable. It exemplifies several BMad design principles:

**Core Principles**:
1. **Preservation First**: Never destroys user-authored content without confirmation
2. **Interactive Control**: User guides remediation of missing files
3. **Fail-Safe Defaults**: Degrades gracefully rather than failing completely
4. **Comprehensive Reporting**: Complete transparency into changes made
5. **Idempotent**: Safe to run repeatedly
6. **Structure Reflects Reality**: Index mirrors actual file system organization

**Key Features**:
- Scans `docs/` directory for markdown and text files
- Generates hierarchical index organized by folders
- Preserves existing descriptions when adequate
- Interactive remediation for missing files
- Detects and handles sharded documents specially
- Comprehensive change reporting

**ADK Translation**:
- **Recommended**: Cloud Functions (2nd Gen)
- **Alternative**: App Engine Standard
- **Strategy**: Two-phase execution for interactive remediation
- **Storage**: Cloud Storage for docs, Firestore for state
- **Cost**: < $2/month (typical usage)

**Evolution Potential**:
- Multi-index support (audience-specific)
- Automated remediation (CI/CD friendly)
- Cross-reference validation
- AI-enhanced descriptions
- Documentation quality scoring

---

**Document Metadata**:
- **Analysis Completed**: 2025-10-14
- **Source File**: `.bmad-core/tasks/index-docs.md`
- **Analysis Length**: ~6,700+ lines total
- **Complexity**: Low (Utility Task)
- **Primary Agent**: BMad-Master
- **Related Tasks**: create-doc, shard-doc, document-project (complementary, not dependencies)
