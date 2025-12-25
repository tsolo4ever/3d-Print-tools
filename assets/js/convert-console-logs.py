#!/usr/bin/env python3
"""
Convert console.log to this.log() in enhanced-printer-profiles.js
Preserves console.error and console.warn calls
"""

import re
import shutil
from pathlib import Path

def convert_console_logs(file_path):
    """
    Replace console.log with this.log in JavaScript file
    Preserves console.error and console.warn
    """
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create backup
    backup_path = file_path.with_suffix('.js.backup-pre-script')
    shutil.copy2(file_path, backup_path)
    print(f"✅ Backup created: {backup_path}")
    
    # Count original console.log occurrences
    original_count = len(re.findall(r'console\.log\(', content))
    error_count = len(re.findall(r'console\.error\(', content))
    warn_count = len(re.findall(r'console\.warn\(', content))
    
    print(f"\n📊 Before conversion:")
    print(f"   console.log: {original_count}")
    print(f"   console.error: {error_count} (will preserve)")
    print(f"   console.warn: {warn_count} (will preserve)")
    
    # Replace console.log with this.log
    # Use negative lookbehind to avoid matching console.error and console.warn
    # Pattern: console.log( but NOT console.error( or console.warn(
    content = re.sub(
        r'console\.log\(',
        'this.log(',
        content
    )
    
    # Verify we didn't touch console.error or console.warn
    new_error_count = len(re.findall(r'console\.error\(', content))
    new_warn_count = len(re.findall(r'console\.warn\(', content))
    new_log_count = len(re.findall(r'console\.log\(', content))
    this_log_count = len(re.findall(r'this\.log\(', content))
    
    print(f"\n📊 After conversion:")
    print(f"   console.log: {new_log_count} (should be 0)")
    print(f"   this.log: {this_log_count}")
    print(f"   console.error: {new_error_count} (preserved: {new_error_count == error_count})")
    print(f"   console.warn: {new_warn_count} (preserved: {new_warn_count == warn_count})")
    
    # Write the updated content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ File updated: {file_path}")
    print(f"✅ Converted {original_count} console.log() calls to this.log()")
    
    # Validation
    if new_error_count != error_count:
        print(f"⚠️  WARNING: console.error count changed! {error_count} -> {new_error_count}")
    if new_warn_count != warn_count:
        print(f"⚠️  WARNING: console.warn count changed! {warn_count} -> {new_warn_count}")
    if new_log_count > 0:
        print(f"⚠️  WARNING: {new_log_count} console.log() calls remain!")
    
    return {
        'converted': original_count,
        'errors_preserved': new_error_count == error_count,
        'warns_preserved': new_warn_count == warn_count,
        'complete': new_log_count == 0
    }

if __name__ == '__main__':
    # Path to the file
    file_path = Path(__file__).parent / 'enhanced-printer-profiles.js'
    
    print("🔧 Console.log to this.log() Converter")
    print("=" * 50)
    print(f"Target file: {file_path}")
    print()
    
    if not file_path.exists():
        print(f"❌ Error: File not found: {file_path}")
        exit(1)
    
    # Run conversion
    result = convert_console_logs(file_path)
    
    print("\n" + "=" * 50)
    if result['complete'] and result['errors_preserved'] and result['warns_preserved']:
        print("✅ SUCCESS: All console.log() calls converted!")
        print("✅ console.error and console.warn preserved!")
    else:
        print("⚠️  PARTIAL SUCCESS: Review warnings above")
    
    print("\n💡 To undo changes, restore from backup:")
    print(f"   Copy {file_path.with_suffix('.js.backup-pre-script')} to {file_path}")
