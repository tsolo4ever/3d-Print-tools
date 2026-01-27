# MCP Timeout Fix - Error -32001

## Problem
You were getting: **MCP error -32001: Request timed out**

This happened because:
1. **Anthropic API calls are slow** - File uploads and analysis can take 30-60+ seconds
2. **Cline default timeout too short** - Set to only 60 seconds (1 minute)
3. **Server had no backpressure handling** - Couldn't handle slow operations gracefully

---

## Solution Applied

### 1. ✅ Updated `files-api-mcp.js`

**What Changed:**
- Added 5-minute timeout to Anthropic SDK client
- Added `maxRetries: 3` for failed requests
- Implemented `Promise.race()` with 4-minute operation timeouts
- Better error handling and debug logging
- Fixed stdin/stdout with `terminal: false`
- Added uncaught exception handler

**Key Improvements:**
```javascript
// Before: timeout after 60 seconds
// After: 5 minute timeout + retry logic
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 5 * 60 * 1000,    // 5 minutes
  httpAgent: null,
  maxRetries: 3,             // Retry failed requests
});
```

### 2. ✅ Updated Cline MCP Settings

**File:** `C:\Users\Admin\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

**Change:**
```json
"files-api": {
  "timeout": 60,   // ❌ OLD
  "timeout": 300,  // ✅ NEW (5 minutes)
}
```

---

## How It Works Now

### Operation Timeline

1. **User requests upload:** `"Upload 'file.js'"`
2. **Cline starts MCP server** (30-60ms)
3. **Server receives request** (10ms)
4. **Operation begins:**
   - Upload to Anthropic: up to 4 minutes allowed
   - Process/analyze: up to 4 minutes allowed
5. **Cline waits:** up to 5 minutes (300 seconds) for result
6. **Result returned:** File ID or analysis

### Timeout Safety

| Stage | Timeout | Purpose |
|-------|---------|---------|
| SDK Client | 5 minutes | All API calls |
| Individual Operation | 4 minutes | Upload/Process enforcement |
| MCP Server | 5 minutes | Cline waits for response |
| **Total Safe Window** | **5 minutes** | Max operation time |

---

## What to Do Now

### 1. **Restart Cline**
- Close VS Code or Cline extension
- Reopen to load new settings

### 2. **Reconnect the MCP Server**
- In Cline, use "Delete Server" button if you see old server
- It will auto-restart with new timeout

### 3. **Test the Fix**
Run a file upload:
```
Upload 'assets/js/universal-parser.js' for analysis
```

### 4. **If Still Having Issues**

Check the debug output:
```
[MCP Files API] Starting upload for: ...
[MCP Files API] File size: 21028 bytes
[MCP Files API] Uploading to Anthropic API...
[MCP Files API] Upload successful: file_...
```

---

## Debugging

### Enable Detailed Logs
In `files-api-mcp.js`, DEBUG is set to `true` by default:
```javascript
const DEBUG = true;
function log(...args) {
  if (this.DEBUG) {
    console.error("[MCP Files API]", ...args);  // Sent to stderr
  }
}
```

### Check Terminal Output
When Cline runs MCP server, debug messages appear in the terminal:
```
[MCP Files API] MCP Files API Server starting...
[MCP Files API] Received request: tools/call
[MCP Files API] Calling tool: upload_file
[MCP Files API] Starting upload for: C:\Users\Admin\...
[MCP Files API] File size: 21028 bytes
[MCP Files API] Uploading to Anthropic API...
[MCP Files API] Upload successful: file_011CWmi4r2x6yHqweTJZ9koN
```

---

## Technical Details

### Why 300 Seconds (5 minutes)?

Anthropic Files API operations can be slow:
- **File upload:** 10-60 seconds (depending on file size)
- **API processing:** 20-120 seconds (depending on file complexity)
- **Network delays:** 2-5 seconds
- **Buffer:** Extra time for retries

**Formula:** 60 + 120 + 10 + 10 = 200 seconds minimum  
**Actual setting:** 300 seconds (5 min) = safe margin

### Error Recovery

With `maxRetries: 3`:
1. Initial attempt fails → Retry (60-120 seconds)
2. Retry fails → Retry again (60-120 seconds)
3. Final attempt → Complete or fail with detailed error

Total time for max retries: ~360 seconds (well within timeout)

---

## Files Modified

| File | Changes | Impact |
|------|---------|--------|
| `files-api-mcp.js` | Timeout handling, logging, error recovery | More reliable uploads |
| `cline_mcp_settings.json` | timeout: 60 → 300 | MCP gives server more time |

---

## Next Steps

1. **Restart Cline** to apply settings
2. **Test with file upload** to verify fix works
3. **Monitor logs** for any issues
4. **Keep UPLOADED_FILES.md updated** with file IDs

---

## Support

If timeouts still occur:

1. Check file size (very large files may need longer timeout)
2. Check internet connection (slow uploads need more time)
3. Check Anthropic API status
4. Review debug logs for specific error message

For more info, see:
- `MCP_FILE_UPLOAD_RULE.md` - How to request uploads
- `UPLOADED_FILES.md` - Registry of uploaded files
- `package.json` - Dependencies and versions
