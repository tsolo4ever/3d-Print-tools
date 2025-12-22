import json
import sys

if len(sys.argv) != 2:
    print("Usage: python validate_single.py <filename.json>")
    sys.exit(1)

filename = sys.argv[1]

try:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read().strip()
        
        # Check if empty
        if not content:
            print(f"❌ {filename} - EMPTY FILE")
            sys.exit(1)
        
        # Try to parse JSON
        data = json.loads(content)
        
        # Check if it's actually empty JSON
        if not data or (isinstance(data, dict) and not data):
            print(f"⚠️  {filename} - EMPTY JSON")
            sys.exit(0)
        
        # Count elements
        if isinstance(data, dict):
            keys = len(data.keys())
            print(f"✓ {filename} - OK ({keys} keys)")
        elif isinstance(data, list):
            items = len(data)
            print(f"✓ {filename} - OK ({items} items)")
        else:
            print(f"✓ {filename} - OK")
        
        sys.exit(0)
                
except json.JSONDecodeError as e:
    print(f"❌ {filename} - INVALID JSON: {e}")
    sys.exit(1)
except FileNotFoundError:
    print(f"❌ {filename} - FILE NOT FOUND")
    sys.exit(1)
except Exception as e:
    print(f"❌ {filename} - ERROR: {e}")
    sys.exit(1)
