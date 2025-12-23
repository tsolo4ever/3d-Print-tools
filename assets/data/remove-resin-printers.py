#!/usr/bin/env python3
"""
Remove Resin Printers from Database
Filters out resin/SLA printers from printer-profiles.json since they don't use FDM firmware
"""

import json
import sys

# Resin printer keywords to identify and remove
RESIN_KEYWORDS = [
    'photon', 'mars', 'saturn', 'jupiter',  # Elegoo/Anycubic resin
    'sonic', 'mono',  # Anycubic Mono series
    'sl1', 'sl2',  # Prusa SL series
    'form', 'formlabs',  # Formlabs
    'resin', 'sla', 'dlp', 'lcd',  # Technology types
    'phrozen', 'peopoly',  # Resin-only manufacturers
    'halot',  # Creality Halot series
]

def is_resin_printer(printer):
    """Check if a printer is a resin/SLA printer"""
    
    # Skip section markers
    if printer.get('_section'):
        return False
    
    # Check name for resin keywords
    name_lower = printer.get('name', '').lower()
    id_lower = printer.get('id', '').lower()
    manufacturer_lower = printer.get('manufacturer', '').lower()
    notes_lower = printer.get('notes', '').lower()
    
    combined_text = f"{name_lower} {id_lower} {manufacturer_lower} {notes_lower}"
    
    for keyword in RESIN_KEYWORDS:
        if keyword in combined_text:
            return True
    
    # Check technology field if it exists
    tech = printer.get('technology', '').lower()
    if tech in ['sla', 'dlp', 'msla', 'resin', 'lcd']:
        return True
    
    return False

def main():
    input_file = 'printer-profiles.json'
    output_file = 'printer-profiles.json'
    backup_file = 'printer-profiles-with-resin-backup.json'
    
    print(f"📖 Reading {input_file}...")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: {input_file} not found!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {e}")
        sys.exit(1)
    
    if 'printers' not in data:
        print("❌ Error: No 'printers' array found in JSON!")
        sys.exit(1)
    
    original_count = len(data['printers'])
    print(f"📊 Original printer count: {original_count}")
    
    # Backup original file
    print(f"\n💾 Creating backup: {backup_file}")
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    # Filter out resin printers
    print("\n🔍 Scanning for resin printers...")
    resin_printers = []
    fdm_printers = []
    
    for printer in data['printers']:
        if is_resin_printer(printer):
            resin_printers.append(printer)
            print(f"  ❌ Removing: {printer.get('name', 'Unknown')} ({printer.get('manufacturer', 'Unknown')})")
        else:
            fdm_printers.append(printer)
    
    # Update data
    data['printers'] = fdm_printers
    
    # Update metadata if it exists
    if '_meta' in data:
        data['_meta']['printerCount'] = len(fdm_printers)
        data['_meta']['lastUpdated'] = '2025-12-23'
        data['_meta']['notes'] = 'FDM printers only - resin printers removed'
    
    # Save cleaned file
    print(f"\n💾 Saving cleaned database to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    # Statistics
    print("\n" + "="*60)
    print("✅ CLEANUP COMPLETE!")
    print("="*60)
    print(f"Original count:     {original_count}")
    print(f"Resin removed:      {len(resin_printers)}")
    print(f"FDM remaining:      {len(fdm_printers)}")
    print(f"Reduction:          {len(resin_printers)} printers ({len(resin_printers)/original_count*100:.1f}%)")
    print("="*60)
    
    if len(resin_printers) > 0:
        print("\n📋 Removed Resin Printers:")
        manufacturers = {}
        for p in resin_printers:
            mfg = p.get('manufacturer', 'Unknown')
            if mfg not in manufacturers:
                manufacturers[mfg] = []
            manufacturers[mfg].append(p.get('name', 'Unknown'))
        
        for mfg in sorted(manufacturers.keys()):
            print(f"\n  {mfg}:")
            for name in sorted(manufacturers[mfg]):
                print(f"    • {name}")
    
    print(f"\n✅ Backup saved: {backup_file}")
    print(f"✅ Cleaned file:  {output_file}")

if __name__ == '__main__':
    main()
