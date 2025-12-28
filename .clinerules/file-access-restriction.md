# File Access Restriction Rule

**MANDATORY:** Only access files that are open in VS Code tabs, unless explicitly instructed otherwise.

---

## 🔒 Default Behavior (REQUIRED)

**RULE:** Before using `read_file`, `write_to_file`, or `replace_in_file`, check VS Code open tabs.

### **How to Check:**
In environment_details, look for:
```
# Visual Studio Code Open Tabs
filename1.ext
path/to/filename2.ext
```

### **Restriction:**
- ✅ **ALLOWED:** Files listed in "Visual Studio Code Open Tabs"
- ✅ **ALLOWED:** Any `.md` files for notes and documentation updates
- ❌ **FORBIDDEN:** Any other files in the project

---

## ✅ ALWAYS Do This:

✅ **ALWAYS** check environment_details for open tabs first  
✅ **ALWAYS** restrict file access to only open tabs by default  
✅ **ALWAYS** allow access to `.md` files for documentation/notes  
✅ **ALWAYS** ask permission before accessing non-.md files outside open tabs  
✅ **ALWAYS** respect explicit instructions to look elsewhere  

---

## 🚫 NEVER Do This:

❌ **DO NOT** access non-.md files not in open tabs without permission  
❌ **DO NOT** use `list_files` without explicit request  
❌ **DO NOT** use `search_files` without explicit request  
❌ **DO NOT** read project files just to "explore"  

---

## 🔓 Exceptions (Built-In)

### **Markdown Files (.md)**
**ALWAYS ALLOWED** - Can freely access `.md` files for:
- Adding notes and documentation
- Updating project documentation
- Creating/editing guides
- Appending status updates
- Reading for context

**Rationale:** Documentation should be kept current and accessible regardless of what's open.

---

## 🔓 User Override Exceptions

The user MAY override this restriction by explicitly saying:
- "Look at [specific file path]"
- "Check the entire [directory] folder"
- "Search all files for [pattern]"
- "List files in [directory]"
- "Read [filename] even though it's not open"

**When user overrides:** Proceed with the requested file access, then return to restriction mode.

---

## 📋 Pre-Action Checklist

Before any file operation:

- [ ] Is the target file a `.md` file? → ✅ ALLOWED
- [ ] Are there files open in VS Code tabs?
- [ ] Is the target file in the open tabs list? → ✅ ALLOWED
- [ ] If NO, has the user explicitly requested this file? → ✅ ALLOWED
- [ ] If NO to all, → ❌ ASK PERMISSION FIRST

---

## 💡 Example Scenarios

### ✅ CORRECT:
```
Environment shows: 
  Open Tabs: index.html, assets/css/base.css

User: "Fix the styling issue"
Assistant: *reads assets/css/base.css (it's open)*
```

### ✅ CORRECT (.md exception):
```
Environment shows:
  Open Tabs: index.html

User: "Add a note about the bug fix"
Assistant: *reads/writes CHANGELOG.md (it's .md - allowed)*
```

### ❌ WRONG:
```
Environment shows:
  Open Tabs: index.html

User: "Fix the styling issue"
Assistant: *reads assets/css/base.css (NOT OPEN, NOT .md - should ask first!)*
```

### ✅ CORRECT (Override):
```
Environment shows:
  Open Tabs: (No open tabs)

User: "What's in package.json?"
Assistant: "package.json isn't open. Would you like me to read it?"
```

---

## 🎯 Benefits

1. **Focused work** - Only touch what user is actively working on
2. **Privacy** - Don't snoop through entire project
3. **Efficiency** - No unnecessary file reads
4. **User control** - User decides scope by opening files
5. **Documentation flexibility** - Notes and docs always accessible

---

## ⚠️ Special Cases

### **No Files Open:**
If no files are open in VS Code:
1. Inform the user
2. Ask which file(s) to access (unless .md files)
3. Wait for explicit permission

### **Task Requires Multiple Files:**
If accomplishing a task requires files not open:
1. Explain what files are needed
2. Ask: "Should I also look at [filenames]?"
3. Wait for permission

### **Documentation Updates:**
.md files are exempt - access freely to:
- Create session summaries
- Update changelogs
- Add implementation notes
- Create planning documents
- Update README files

---

## 📝 File Type Access Matrix

| File Type | Open in VS Code? | Access Allowed? |
|-----------|------------------|-----------------|
| `.md` | ❌ No | ✅ YES (always) |
| `.md` | ✅ Yes | ✅ YES |
| `.js` | ✅ Yes | ✅ YES |
| `.js` | ❌ No | ❌ NO (ask first) |
| `.html` | ✅ Yes | ✅ YES |
| `.html` | ❌ No | ❌ NO (ask first) |
| `.css` | ✅ Yes | ✅ YES |
| `.css` | ❌ No | ❌ NO (ask first) |
| `.json` | ✅ Yes | ✅ YES |
| `.json` | ❌ No | ❌ NO (ask first) |
| Any other | ✅ Yes | ✅ YES |
| Any other | ❌ No | ❌ NO (ask first) |

---

**REMEMBER:** The user controls scope by choosing what to open in VS Code. Respect that boundary. Markdown files are always accessible for documentation purposes.
