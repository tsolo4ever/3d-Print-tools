# MCP File Upload Rule

**MANDATORY:** Use this rule to request file uploads to Anthropic Files API via MCP.

---

## 🔒 When to Use File Upload

**Rule:** You can request me to upload a file when:

1. ✅ You explicitly ask: **"upload [filepath]"**
2. ✅ You provide file content directly in your message
3. ✅ You want Claude to analyze a file using AI
4. ✅ You need to process a file with the Anthropic Files API

---

## ✅ How to Request File Upload

### **Option 1: Explicit Upload Request**
```
Can you upload 'assets/js/universal-parser.js' for analysis?
```

### **Option 2: File Content Provided**
```
<file_content path="path/to/file.js">
[file content here]
</file_content>

Please upload this file.
```

### **Option 3: File with Analysis Task**
```
Upload 'config.json' and analyze its structure with Claude
```

---

## 🚀 What I'll Do

When you request a file upload, I will:

1. **Verify API Key** - Check that `ANTHROPIC_API_KEY` is set
2. **Use MCP Server** - Call the Files API MCP server
3. **Upload File** - Send file to Anthropic Files API
4. **Get File ID** - Receive unique file identifier
5. **Update Registry** - Add file to `C:\Users\Admin\my-files-api-mcp\UPLOADED_FILES.md`
6. **Return Results** - Show you:
   - ✅ File ID (for future reference)
   - 📊 File size and name
   - 🔗 How to use the file ID

---

## 📋 Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| File exists | Required | Must be accessible at provided path |
| File size | No limit | Anthropic Files API has generous limits |
| File type | Supported | PDF, TXT, JSON, JS, CSS, HTML, PNG, JPG, etc. |
| API Key | Required | Must be set: `$env:ANTHROPIC_API_KEY` |
| MCP Server | Required | `files-api` must be running (auto-starts) |
| Update Registry | **REQUIRED** | Must update `UPLOADED_FILES.md` after upload |

---

## 📁 File Format

When requesting upload, provide path in one of these formats:

```
✅ Absolute path:
   C:\Users\Admin\OneDrive\Documents\GitHub\Code\assets\js\universal-parser.js

✅ Relative path (from project root):
   assets/js/universal-parser.js

✅ With descriptive context:
   Upload 'assets/data/printer-profiles.json' and analyze the structure
```

---

## 🎯 Common Use Cases

### **Code Analysis**
```
Upload 'assets/js/universal-parser.js' and summarize its architecture
```

### **Configuration Review**
```
Upload 'firmware-helper/th3d-field-mapping.json' and check for errors
```

### **Documentation Analysis**
```
Upload 'MASTER_ROADMAP.md' for analysis
```

### **Data Validation**
```
Upload 'assets/data/marlin-boards.json' and verify structure
```

---

## 📤 Upload Response Format

After successful upload, you'll receive:

```
✅ File Upload Successful

File ID: file_011CWmi4r2x6yHqweTJZ9koN
Filename: universal-parser.js
Size: 21,028 bytes

Registry Updated: ✅ Added to UPLOADED_FILES.md

You can now:
1. Use this file ID with Claude's Files API
2. Reference it for analysis or processing
3. Keep it for future sessions
```

---

## 📝 Registry Update Procedure

**IMPORTANT:** After every successful upload:

1. ✅ File is uploaded to Anthropic
2. ✅ File ID is received
3. ✅ `UPLOADED_FILES.md` is updated with:
   - File name
   - File ID
   - File size
   - Upload date
   - Status (✅ Active)
   - Purpose/notes

**Location:** `C:\Users\Admin\my-files-api-mcp\UPLOADED_FILES.md`

---

## 🚫 When I Won't Upload

❌ **No upload if:**
- File path is not provided
- File doesn't exist or can't be accessed
- You haven't explicitly asked for upload
- API key is not set (I'll ask you to set it)
- File is too large (rare - Anthropic supports large files)

---

## 💡 Examples

### ✅ CORRECT - I will upload:
```
User: "Upload 'assets/js/memory-calculator.js'"
Cline: *uploads file* → File ID: file_...
Cline: *updates UPLOADED_FILES.md*
```

### ✅ CORRECT - I will upload:
```
User: "Can you analyze this file: assets/data/extruder-types.json"
[file content provided]
Cline: *uploads file* → File ID: file_...
Cline: *updates UPLOADED_FILES.md*
```

### ❌ WRONG - I won't upload:
```
User: "What's in assets/js/printer-profiles.js?"
Cline: *reads file normally, no upload*
```

---

## ⚙️ Technical Details

**MCP Server:** `files-api`  
**Command:** `node C:\Users\Admin\my-files-api-mcp\Files-api-mcp.js`  
**Authentication:** Via `ANTHROPIC_API_KEY` environment variable  
**API Used:** Anthropic Files API (files-api-2025-04-14)  
**Status:** ✅ Tested and working

---

## 🔄 File ID Persistence

Uploaded file IDs persist and can be:
- ✅ Used in future conversations
- ✅ Analyzed with different queries
- ✅ Referenced by ID without re-uploading
- ✅ Found in `UPLOADED_FILES.md`

**Example:**
```
File ID: file_011CWmi4r2x6yHqweTJZ9koN

Later conversation:
User: "Analyze file_011CWmi4r2x6yHqweTJZ9koN for performance issues"
```

---

## ✨ Benefits

| Benefit | Reason |
|---------|--------|
| 🚀 Faster analysis | Claude reads files directly |
| 📊 Better accuracy | Full file context visible |
| 🔒 Secure | Files encrypted in transit |
| 💾 Persistent | File IDs valid across sessions |
| 🎯 Precise | Can query specific aspects |
| 📋 Tracked | All uploads logged in registry |

---

## 📞 Questions?

To request file upload, simply say:
- "Upload [filepath]"
- "Upload [filepath] and [task]"
- "Analyze this file: [filepath]"

I'll handle the upload, get the file ID, and **automatically update UPLOADED_FILES.md** with the reference! 🚀

---

**REMEMBER:** 
1. Be explicit about wanting a file uploaded
2. I won't upload files unless you clearly ask me to
3. Every upload automatically updates the registry
4. Keep UPLOADED_FILES.md as your reference library
