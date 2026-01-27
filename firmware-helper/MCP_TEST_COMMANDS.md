# MCP Server Test Commands

The MCP server uses **JSON-RPC 2.0** protocol. You can't just type `tools/list` directly - you need to send properly formatted JSON messages.

---

## 🔧 Command Format

All commands must be valid JSON-RPC 2.0 messages in this format:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "method_name",
  "params": {}
}
```

---

## 📋 Available Commands

### 1. Initialize Server
```json
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}
```

**What it does:** Initializes the MCP server connection

---

### 2. List Available Tools
```json
{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}
```

**What it does:** Returns list of available tools (`upload_file`, `process_file`, `delete_file`)

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "upload_file",
        "description": "Upload a file to Anthropic Files API",
        "input_schema": {...}
      },
      {
        "name": "process_file",
        "description": "Analyze an uploaded file with Claude",
        "input_schema": {...}
      },
      {
        "name": "delete_file",
        "description": "Delete an uploaded file from Anthropic Files API",
        "input_schema": {...}
      }
    ]
  }
}
```

---

### 3. Upload a File
```json
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "upload_file", "arguments": {"filePath": "C:\\Users\\Admin\\OneDrive\\Documents\\GitHub\\Code\\firmware-helper\\process-all-mappings.py"}}}
```

**What it does:** Uploads a file to Anthropic Files API

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "File uploaded successfully!\nFile ID: file_XXXXXXXXXXXXX\nFilename: process-all-mappings.py\nSize: 5893 bytes"
      }
    ]
  }
}
```

---

### 4. Process/Analyze a File
```json
{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "process_file", "arguments": {"fileId": "file_XXXXXXXXXXXXX", "query": "Summarize this Python script's main functions"}}}
```

**What it does:** Sends the file to Claude for analysis with your query

---

### 5. Delete a File
```json
{"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "delete_file", "arguments": {"fileId": "file_XXXXXXXXXXXXX"}}}
```

**What it does:** Deletes the file from Anthropic's servers

---

## 🎮 How to Test Manually

### Option 1: Echo & Pipe (PowerShell)
```powershell
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node C:\Users\Admin\my-files-api-mcp\Files-api-mcp.js
```

### Option 2: Using a file
```powershell
# Create test file
@"
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}
{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}
"@ | Out-File -Encoding ASCII test-mcp.json

# Run it
Get-Content test-mcp.json | node C:\Users\Admin\my-files-api-mcp\Files-api-mcp.js
```

---

## ⚠️ Important Notes

1. **One command per line** - The server reads line-by-line
2. **Must be valid JSON** - No comments, trailing commas, or syntax errors
3. **Proper escaping** - Windows paths need double backslashes: `C:\\Users\\...`
4. **Sequential IDs** - Each request should have a unique ID
5. **Initialize first** - Some MCP clients require initialization before tool calls

---

## 🚫 Common Mistakes

### ❌ WRONG - Plain text
```
tools/list
```
**Error:** "Unexpected token 'o', tools/list is not valid JSON"

### ❌ WRONG - Missing quotes
```json
{jsonrpc: "2.0", id: 1, method: "tools/list"}
```

### ❌ WRONG - Single quotes (not valid JSON)
```json
{'jsonrpc': '2.0', 'id': 1, 'method': 'tools/list'}
```

### ✅ CORRECT
```json
{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

---

## 🔄 Why MCP Uses JSON-RPC

MCP (Model Context Protocol) is designed for **programmatic communication**, not manual terminal use. 

- **Cline automatically** sends these JSON-RPC messages
- **You shouldn't need** to manually format them
- **The @files-api syntax** in Cline is translated to these messages

---

## 🎯 For Your Use Case

You don't need to manually send these commands! Instead:

1. **Restart Cline** to load the MCP tools
2. **Use the command:** `@files-api upload path/to/file`
3. **Cline translates** this to the proper JSON-RPC format automatically

The MCP server is meant to be used BY Cline, not by you directly typing commands.

---

## 🧪 Quick Test

To verify the server works:

```powershell
# Test in PowerShell (single line)
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node C:\Users\Admin\my-files-api-mcp\Files-api-mcp.js
```

If you see a JSON response with the three tools listed, the server is working correctly!
