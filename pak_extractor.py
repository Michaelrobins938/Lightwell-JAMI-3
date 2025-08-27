#!/usr/bin/env python3
"""
Chrome PAK File Extractor
Extracts contents from Chrome .pak resource files
"""

import struct
import os
import sys
import re

def extract_pak_file(pak_path, output_dir):
    """Extract contents from a Chrome PAK file"""
    
    if not os.path.exists(pak_path):
        print(f"Error: PAK file not found at {pak_path}")
        return
    
    os.makedirs(output_dir, exist_ok=True)
    
    with open(pak_path, 'rb') as f:
        # Read PAK header
        header = f.read(8)
        if len(header) < 8:
            print("Error: Invalid PAK file - too small")
            return
            
        version, num_entries = struct.unpack('<II', header)
        print(f"PAK Version: {version}")
        print(f"Number of entries: {num_entries}")
        
        # Read entry table
        entries = []
        for i in range(num_entries):
            entry_data = f.read(6)
            if len(entry_data) < 6:
                print(f"Warning: Truncated entry {i}")
                break
            resource_id, offset = struct.unpack('<HI', entry_data)
            entries.append((resource_id, offset))
        
        # Add final entry for size calculation
        final_offset = f.seek(0, 2)  # Seek to end
        entries.append((0, final_offset))
        
        print(f"Successfully read {len(entries)-1} entries")
        
        # Extract each resource
        extracted_files = []
        readable_content = []
        
        for i in range(len(entries) - 1):
            resource_id, offset = entries[i]
            next_offset = entries[i + 1][1]
            size = next_offset - offset
            
            if size <= 0:
                continue
                
            f.seek(offset)
            data = f.read(size)
            
            # Try to determine file type
            file_ext = determine_file_type(data)
            filename = f"resource_{resource_id:04d}{file_ext}"
            filepath = os.path.join(output_dir, filename)
            
            # Write the resource to file
            with open(filepath, 'wb') as out_f:
                out_f.write(data)
            
            extracted_files.append(filename)
            
            # Check if it's readable text
            if is_readable_text(data):
                try:
                    text_content = data.decode('utf-8', errors='ignore')
                    if len(text_content.strip()) > 10:  # Only include substantial content
                        readable_content.append({
                            'resource_id': resource_id,
                            'filename': filename,
                            'content': text_content,
                            'size': size
                        })
                except:
                    pass
        
        # Create summary report
        create_summary_report(output_dir, extracted_files, readable_content, pak_path)
        
        print(f"\nExtraction complete!")
        print(f"Total files extracted: {len(extracted_files)}")
        print(f"Readable text files: {len(readable_content)}")
        print(f"Output directory: {output_dir}")

def determine_file_type(data):
    """Determine file type based on content"""
    if not data:
        return ".bin"
    
    # Check for common file signatures
    if data.startswith(b'\x89PNG'):
        return ".png"
    elif data.startswith(b'\xFF\xD8\xFF'):
        return ".jpg"
    elif data.startswith(b'GIF8'):
        return ".gif"
    elif data.startswith(b'RIFF') and b'WEBP' in data[:12]:
        return ".webp"
    elif data.startswith(b'<!DOCTYPE') or data.startswith(b'<html'):
        return ".html"
    elif b'function' in data[:100] or b'var ' in data[:100]:
        return ".js"
    elif b'{' in data[:50] and b'}' in data:
        # Could be CSS or JSON
        if b'color:' in data or b'font-' in data or b'margin:' in data:
            return ".css"
        else:
            return ".json"
    elif data.startswith(b'<?xml'):
        return ".xml"
    elif is_readable_text(data):
        return ".txt"
    else:
        return ".bin"

def is_readable_text(data):
    """Check if data contains readable text"""
    try:
        # Try to decode as UTF-8
        text = data.decode('utf-8', errors='strict')
        # Check if it contains mostly printable characters
        printable_ratio = sum(1 for c in text if c.isprintable() or c.isspace()) / len(text)
        return printable_ratio > 0.7 and len(text.strip()) > 5
    except:
        return False

def create_summary_report(output_dir, extracted_files, readable_content, pak_path):
    """Create a summary report of the extraction"""
    
    report_path = os.path.join(output_dir, "extraction_report.txt")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(f"PAK File Extraction Report\n")
        f.write(f"========================\n\n")
        f.write(f"Source PAK file: {pak_path}\n")
        f.write(f"Total files extracted: {len(extracted_files)}\n")
        f.write(f"Readable text files: {len(readable_content)}\n\n")
        
        f.write("File Types Summary:\n")
        f.write("-" * 20 + "\n")
        
        # Count file types
        type_counts = {}
        for filename in extracted_files:
            ext = os.path.splitext(filename)[1] or '.bin'
            type_counts[ext] = type_counts.get(ext, 0) + 1
        
        for ext, count in sorted(type_counts.items()):
            f.write(f"{ext}: {count} files\n")
        
        f.write(f"\nReadable Content Analysis:\n")
        f.write("=" * 30 + "\n\n")
        
        for item in readable_content:
            f.write(f"Resource ID: {item['resource_id']}\n")
            f.write(f"Filename: {item['filename']}\n")
            f.write(f"Size: {item['size']} bytes\n")
            f.write(f"Content preview (first 500 chars):\n")
            f.write("-" * 40 + "\n")
            f.write(item['content'][:500])
            if len(item['content']) > 500:
                f.write("...\n")
            f.write("\n\n" + "=" * 50 + "\n\n")

if __name__ == "__main__":
    pak_file = "C:/Users/Micha/OneDrive/Desktop/test/JARVIS/ChatGPT_App_Files/resources.pak"
    output_directory = "C:/Users/Micha/OneDrive/Desktop/test/JARVIS/extracted_resources"
    
    print("Chrome PAK File Extractor")
    print("========================")
    print(f"Extracting: {pak_file}")
    print(f"Output to: {output_directory}")
    print()
    
    extract_pak_file(pak_file, output_directory)