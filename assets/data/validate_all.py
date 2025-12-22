import json
import os
from pathlib import Path

# Get all JSON files
json_files = sorted([f for f in os.listdir('.') if f.endswith('.json')])

print("=" * 60)
print("JSON FILE VALIDATION REPORT")
print("=" * 60)

valid_files = []
invalid_files = []
empty_files = []

for filename in json_files:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
            # Check if empty
            if not content:
                empty_files.append(filename)
                print(f"❌ {filename:40} EMPTY FILE")
                continue
            
            # Try to parse JSON
            data = json.loads(content)
            
            # Check if it's actually empty JSON
            if not data or (isinstance(data, dict) and not data):
                empty_files.append(filename)
                print(f"⚠️  {filename:40} EMPTY JSON")
            else:
                valid_files.append(filename)
                
                # Count elements
                if isinstance(data, dict):
                    keys = len(data.keys())
                    print(f"✓  {filename:40} OK ({keys} keys)")
                elif isinstance(data, list):
                    items = len(data)
                    print(f"✓  {filename:40} OK ({items} items)")
                else:
                    print(f"✓  {filename:40} OK")
                    
    except json.JSONDecodeError as e:
        invalid_files.append((filename, str(e)))
        print(f"❌ {filename:40} INVALID: {e}")
    except Exception as e:
        invalid_files.append((filename, str(e)))
        print(f"❌ {filename:40} ERROR: {e}")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Total files scanned: {len(json_files)}")
print(f"✓ Valid files:       {len(valid_files)}")
print(f"⚠️  Empty files:       {len(empty_files)}")
print(f"❌ Invalid files:     {len(invalid_files)}")

if empty_files:
    print("\n⚠️  EMPTY FILES:")
    for f in empty_files:
        print(f"   - {f}")

if invalid_files:
    print("\n❌ INVALID FILES:")
    for f, error in invalid_files:
        print(f"   - {f}")
        print(f"     Error: {error}")

if len(valid_files) == len(json_files):
    print("\n🎉 ALL FILES VALID!")
else:
    print(f"\n⚠️  {len(empty_files) + len(invalid_files)} files need attention")
