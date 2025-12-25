#!/usr/bin/env python3
"""Check console.log usage in parser files"""
import re
from pathlib import Path

parser_files = [
    'th3d-config-parser.js',
    'config-parser.js',
    'eeprom-parser.js',
]

print("📊 Console Usage Analysis")
print("=" * 60)

for filename in parser_files:
    filepath = Path(__file__).parent / filename
    if not filepath.exists():
        print(f"❌ {filename}: NOT FOUND")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    log_count = len(re.findall(r'console\.log\(', content))
    error_count = len(re.findall(r'console\.error\(', content))
    warn_count = len(re.findall(r'console\.warn\(', content))
    
    print(f"\n📄 {filename}:")
    print(f"   console.log:   {log_count}")
    print(f"   console.error: {error_count}")
    print(f"   console.warn:  {warn_count}")
    
    if log_count > 0:
        print(f"   ⚠️  Needs conversion")
    else:
        print(f"   ✅ Already clean")

print("\n" + "=" * 60)
