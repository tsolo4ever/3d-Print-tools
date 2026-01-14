# Uploaded Files Registry

**IMPORTANT:** This file tracks all files uploaded to Anthropic Files API via MCP. Update this whenever a new file is uploaded.

---

## 📁 Uploaded Files

|      File Name      | File ID | Size | Upload Date | Status | Notes |
|---------------------|---------|------|-------------|--------|-------|
| Combined batch (11 files) | Various | ~330 KB | 2026-01-04 06:03 | ✅ Analyzed | See ANALYSES.md |
| process-all-mappings.py | Pending | 8.38 KB | Pending | ⚠️ Ready | Orchestration script |
| | | | | | |

---

## 🔍 How to Use File IDs

Once uploaded, files are stored persistently and can be referenced by ID:

```javascript
{
  "method": "tools/call",
  "params": {
    "name": "process_file",
    "arguments": {
      "fileId": "file_011CWmi4r2x6yHqweTJZ9koN",
      "query": "Your analysis question here"
    }
  }
}
```

---

## 📝 Upload Procedure

When uploading a new file:

1. **Request Upload:** Tell Cline "upload [filepath]"
2. **Confirm Success:** Check that File ID is returned
3. **Copy File ID:** Get the `file_XXXXX...` reference
4. **Update This File:** Add entry to table above
5. **Document Usage:** Note what the file is for

---

## 🔗 File Reference Format

```
File ID: file_011CWmi4r2x6yHqweTJZ9koN
Location: assets/js/universal-parser.js
Size: 21,028 bytes
Purpose: Universal firmware configuration parser
```

---

## 📋 Columns Explained

- **File Name:** Original filename from upload
- **File ID:** Unique identifier from Anthropic (use for analysis)
- **Size:** File size in bytes
- **Upload Date:** When file was uploaded (YYYY-MM-DD HH:MM)
- **Status:** ✅ Active, ⚠️ Testing, ❌ Archived
- **Notes:** File purpose, contents, or important details

---

## 💾 Persistence

File IDs remain valid indefinitely. You can:
- ✅ Reference them in future conversations
- ✅ Analyze them without re-uploading
- ✅ Share IDs with different analysis tasks
- ✅ Keep them for reference

---

## 🎯 Example Queries

Using the uploaded universal-parser.js file:

```
"Analyze file_011CWmi4r2x6yHqweTJZ9koN for:
- Main classes and functions
- Debug logging implementation
- Architecture and design patterns"
```

---

## 📌 Important Notes

- **Keep Updated:** Add every uploaded file to the table
- **Track IDs:** Don't lose file IDs - they're needed for analysis
- **Organize:** Group by file type or purpose if needed
- **Archive:** Mark old files with ❌ if no longer needed

---

## 🔄 Status Legend

| Status | Meaning |
|--------|---------|
| ✅ Active | Recently uploaded, ready for analysis |
| ⚠️ Testing | Experimental upload, verify before using |
| 🔄 Updating | File being re-uploaded with changes |
| ❌ Archived | Old version, keeping for reference |

---

**Last Updated:** 2026-01-04 06:06 UTC  
**Total Files:** 11+ (batch analyzed)  
**Total Size:** ~330 KB

## 🎉 Recent Analysis

**2026-01-04 06:03:28** - Successfully analyzed 11 firmware helper files with Claude Sonnet 4.5:
- Python scripts: process-all-mappings.py, create-comprehensive-mappings.py, analyze-conditionals.py, split-core-mappings.py, add-ui-mappings.py, analyze-validation.py
- Configuration files: Configuration.h, Configuration_adv.h, Configuration_backend.h, Configuration_speed.h

**Output:** Comprehensive gap analysis and enhancement recommendations saved to `ANALYSES.md`

**Key Findings:**
- Current system captures ~60% of information needed for perfect reconstruction
- Missing: multi-line continuations, section headers, complex conditionals, exact formatting
- Enhancement plan provided with concrete implementations
- Estimated JSON size increase: +40% (acceptable trade-off)

---

## 🗑️ Recently Deleted Files

| File ID | Deleted Date | Reason |
|---------|--------------|--------|
| `file_011CWmkKewbgW262DDpEcktJ` | 2026-01-03 23:05 | Test cleanup |
| `file_011CWmi4r2x6yHqweTJZ9koN` | 2026-01-03 23:05 | Test cleanup |
