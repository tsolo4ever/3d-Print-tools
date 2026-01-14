# Quick Start: Upload and Analyze Files

## 🚀 Copy-Paste Commands (Use in Cline Chat)

### Step 1: Upload Python Scripts (one at a time)

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\process-all-mappings.py
```

**After upload completes, save the file_id, then continue:**

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\create-comprehensive-mappings.py
```

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\analyze-conditionals.py
```

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\split-core-mappings.py
```

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\add-ui-mappings.py
```

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\analyze-validation.py
```

### Step 2: Upload Configuration Files

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration.h
```

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_adv.h
```
⚠️ This file is 185KB - may take 15-20 seconds

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_backend.h
```

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_speed.h
```

---

## 📝 Track Your File IDs Here:

As each file uploads, record its file_id:

1. process-all-mappings.py: `___________________`
2. create-comprehensive-mappings.py: `___________________`
3. analyze-conditionals.py: `___________________`
4. split-core-mappings.py: `___________________`
5. add-ui-mappings.py: `___________________`
6. analyze-validation.py: `___________________`
7. Configuration.h: `___________________`
8. Configuration_adv.h: `___________________`
9. Configuration_backend.h: `___________________`
10. Configuration_speed.h: `___________________`

---

## 🎯 Step 3: Process All Files

Once all 10 files are uploaded, use this command (replace the file_id placeholders):

```
@files-api process file_xxx,file_yyy,file_zzz,...(all 10 IDs comma-separated)
```

**Query:** Use the ENTIRE content from `REVERSE_OPERATION_ANALYSIS_QUERY.md` as your query text.

---

## ⏱️ What to Expect:

- **Upload time**: ~60 seconds for all 10 files
- **Processing time**: 2-4 minutes with Claude Opus 4
- **Result**: Comprehensive analysis of gaps and recommendations

---

## 💡 Quick Tip:

You can upload multiple files in quick succession - just wait for each to complete before copying the next command!
