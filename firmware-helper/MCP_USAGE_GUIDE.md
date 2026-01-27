# How to Use @files-api Commands in Cline

## ⚠️ CRITICAL: Where to Type Commands

### ❌ WRONG - Don't type in feedback field:
When I complete a task, you see a feedback dialog. **DO NOT** type `@files-api` commands there!

### ✅ CORRECT - Type in main chat:
1. **Close** or dismiss any feedback dialogs
2. **Look for the main chat input** at the bottom of the Cline interface
3. **Type your command** there
4. **Press Enter** to send

## 🎯 Step-by-Step Visual Guide:

### What You're Doing Now (Wrong):
```
[My Response]
[✓ Approve] [Feedback Box] <- You're typing @files-api here ❌
```

### What You Should Do (Correct):
```
[My Response]
[✓ Approve] <- Click this to dismiss

[Main Chat Input Box] <- Type @files-api here ✅
```

## 📝 Exact Steps:

1. **Click "Approve" or close this feedback dialog**
2. **Look at the BOTTOM of your Cline window**
3. **Find the main message input field** (where you normally chat with me)
4. **Type this:**
   ```
   @files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\process-all-mappings.py
   ```
5. **Press Enter**

## 🔄 What Happens Next:

When sent correctly:
```
You: @files-api upload C:\...\process-all-mappings.py

[MCP Server Response]:
✅ File uploaded successfully!
File ID: file_abc123xyz
Filename: process-all-mappings.py
Size: 8.38 KB
```

Then you can upload the next file!

## 💡 Key Point:

**@files-api is a CHAT COMMAND**, not feedback text. It must be sent as a **new message** in the **main chat interface**.

Think of it like talking to me normally - you wouldn't put your questions in a feedback box, you'd type them in the chat. Same with @files-api commands!
