#!/usr/bin/env python3
"""
Remove Resin Printers from Database (Version 2)
Uses bedType and technology fields ONLY - no keyword matching
"""

import json
import sys

def is_resin_printer(printer):
    """Check if a printer is a resin/SLA printer based on fields only"""
    
    # Skip section markers
    if printer.get('_section'):
        return False
    
    # Check bedType field
    bed_type = printer.get('bedType', '').lower()
    if bed_type == 'resin':
        return True
    
    # Check technology field
    tech = printer.get('technology', '').lower()
    if tech in ['sla', 'dlp', 'msla', 'resin', 'lcd', 'lcd-sla']:
        return True
    
    # Check printer type field
    printer_type = printer.get('type', '').lower()
    if printer_type in ['resin', 'sla', 'dlp']:
        return True
    
    return False

def main():
    input_file = 'printer-profiles.json'
    output_file = 'printer-profiles.json'
    backup_file = 'printer-profiles-pre-resin-cleanup.json'
    
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
    
    # Filter by field values only
    print("\n🔍 Scanning for resin printers (field-based)...")
    resin_printers = []
    fdm_printers = []
    
    for printer in data['printers']:
        if is_resin_printer(printer):
            resin_printers.append(printer)
            bed_type = printer.get('bedType', 'N/A')
            tech = printer.get('technology', 'N/A')
            print(f"  ❌ Removing: {printer.get('name', 'Unknown')} (bedType={bed_type}, tech={tech})")
        else:
            fdm_printers.append(printer)
    
    # Update data
    data['printers'] = fdm_printers
    
    # Update metadata if it exists
    if '_meta' in data:
        data['_meta']['printerCount'] = len(fdm_printers)
        data['_meta']['lastUpdated'] = '2025-12-23'
        data['_meta']['notes'] = 'FDM printers only - resin printers removed by bedType/technology field'
    
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
        print("\n📋 Removed Resin Printers (by field values):")
        for p in resin_printers:
            bed_type = p.get('bedType', 'N/A')
            tech = p.get('technology', 'N/A')
            print(f"  • {p.get('name', 'Unknown')} ({p.get('manufacturer', 'Unknown')}) - bedType={bed_type}, tech={tech}")
    
    print(f"\n✅ Backup saved: {backup_file}")
    print(f"✅ Cleaned file:  {output_file}")
    print("\n✅ Only printers with bedType='resin' or technology='sla/dlp/resin' were removed")
    print("✅ FDM printers with 'Max', 'Plus', etc. in names are preserved")

if __name__ == '__main__':
    main()
