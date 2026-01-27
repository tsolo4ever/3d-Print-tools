# File Upload Instructions for MCP Files API

## 📋 Files to Upload (10 files, ~330 KB total)

### Batch 1: Python Scripts (6 files)
1. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\process-all-mappings.py` (8.38 KB)
2. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\create-comprehensive-mappings.py` (~15 KB)
3. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\analyze-conditionals.py` (10.37 KB)
4. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\split-core-mappings.py` (9.11 KB)
5. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\add-ui-mappings.py` (9.31 KB)
6. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\analyze-validation.py` (10.61 KB)

### Batch 2: Configuration Files (4 files)
7. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration.h` (56.38 KB)
8. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_adv.h` (184.70 KB) ⚠️ LARGE
9. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_backend.h` (21.96 KB)
10. `C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_speed.h` (4.17 KB)

---

## 🚀 Upload Commands

Use the Cline MCP interface (@files-api) to execute these commands:

### Step 1: Upload Python Scripts

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\process-all-mappings.py
```
*Save the returned file_id*

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\create-comprehensive-mappings.py
```
*Save the returned file_id* ⚠️ **KEY SCRIPT** - Main extraction logic

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\analyze-conditionals.py
```
*Save the returned file_id*

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\split-core-mappings.py
```
*Save the returned file_id*

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\add-ui-mappings.py
```
*Save the returned file_id*

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\firmware-helper\analyze-validation.py
```
*Save the returned file_id*

### Step 2: Upload Configuration Files

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration.h
```
*Save the returned file_id*

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_adv.h
```
*Save the returned file_id* (⚠️ This is 185KB - may take 15-20 seconds)

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_backend.h
```
*Save the returned file_id*

```
@files-api upload C:\Users\Admin\OneDrive\Documents\GitHub\Code\test files\Configuration_speed.h
```
*Save the returned file_id*

---

## 🎯 Step 3: Process All Files with Claude Opus 4

Once all 10 files are uploaded, use the `process_file` tool with ALL file IDs:

```
@files-api process file_id_1,file_id_2,file_id_3,file_id_4,file_id_5,file_id_6,file_id_7,file_id_8,file_id_9,file_id_10
```

**Query to use**: Copy the entire content from `REVERSE_OPERATION_ANALYSIS_QUERY.md`

---

## 📝 Track File IDs

As you upload, record the file IDs here:

1. process-all-mappings.py: `file_____________`
2. create-comprehensive-mappings.py: `file_____________` ⚠️ **CRITICAL**
3. analyze-conditionals.py: `file_____________`
4. split-core-mappings.py: `file_____________`
5. add-ui-mappings.py: `file_____________`
6. analyze-validation.py: `file_____________`
7. Configuration.h: `file_____________`
8. Configuration_adv.h: `file_____________`
9. Configuration_backend.h: `file_____________`
10. Configuration_speed.h: `file_____________`

---

## ⏱️ Expected Timeline

- **Uploads**: ~45-60 seconds total
- **Processing with Claude Opus 4**: 2-4 minutes
- **Total**: ~5-6 minutes

---

## ✅ Success Indicators

After processing, Claude Opus 4 should provide:
1. ✅ Gap Analysis Report
2. ✅ Enhanced JSON Schema
3. ✅ Python Implementation Guide
4. ✅ Reverse Operation Algorithm
5. ✅ Working Examples
6. ✅ Implementation Roadmap
7. ✅ Risk Assessment
8. ✅ Recommendations

---

## 🗑️ Cleanup

After analysis is complete, delete the uploaded files:

```
@files-api delete file_id_1
@files-api delete file_id_2
... (repeat for all 10 files)
```

---

**Note**: The comprehensive analysis query is in `REVERSE_OPERATION_ANALYSIS_QUERY.md` - use that entire document as your query when processing the files.
