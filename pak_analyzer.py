#!/usr/bin/env python3
"""
Advanced PAK File Analyzer
Analyzes Chrome .pak files with multiple format support
"""

import struct
import os
import binascii
import re

def analyze_pak_file(pak_path):
    """Analyze PAK file structure and content"""
    
    print(f"Analyzing PAK file: {pak_path}")
    print("=" * 50)
    
    with open(pak_path, 'rb') as f:
        # Get file size
        f.seek(0, 2)
        file_size = f.tell()
        f.seek(0)
        
        print(f"File size: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
        
        # Read first 1KB for analysis
        header_data = f.read(1024)
        
        # Try different PAK format interpretations
        print("\n--- Header Analysis ---")
        
        # Standard Chrome PAK format
        if len(header_data) >= 8:
            version, num_entries = struct.unpack('<II', header_data[:8])
            print(f"Standard PAK - Version: {version}, Entries: {num_entries}")
            
            # Check if this makes sense
            if version <= 10 and num_entries <= 10000:
                print("* Standard format seems valid")
                analyze_standard_pak(f, version, num_entries, file_size)
            else:
                print("* Standard format invalid, trying alternatives")
        
        # Try alternative formats
        f.seek(0)
        analyze_alternative_formats(f, file_size)
        
        # Search for embedded strings and patterns
        f.seek(0)
        find_embedded_content(f, file_size)

def analyze_standard_pak(f, version, num_entries, file_size):
    """Analyze using standard Chrome PAK format"""
    
    print(f"\n--- Standard PAK Analysis ---")
    
    try:
        # Calculate expected entry table size
        entry_size = 6  # resource_id (2 bytes) + offset (4 bytes)
        entry_table_size = num_entries * entry_size
        
        print(f"Entry table size: {entry_table_size} bytes")
        
        # Read entry table
        f.seek(8)  # Skip header
        entries = []
        
        for i in range(min(num_entries, 100)):  # Limit to first 100 entries
            entry_data = f.read(entry_size)
            if len(entry_data) < entry_size:
                break
            resource_id, offset = struct.unpack('<HI', entry_data)
            entries.append((resource_id, offset))
            
            if i < 10:  # Show first 10 entries
                print(f"Entry {i}: ID={resource_id}, Offset={offset:,}")
        
        # Analyze entries
        if entries:
            print(f"\nFirst offset: {entries[0][1]:,}")
            print(f"Last offset: {entries[-1][1]:,}")
            
            # Check if offsets are reasonable
            reasonable_offsets = [e for e in entries if 8 <= e[1] < file_size]
            print(f"Reasonable offsets: {len(reasonable_offsets)}/{len(entries)}")
            
    except Exception as e:
        print(f"Error in standard analysis: {e}")

def analyze_alternative_formats(f, file_size):
    """Try alternative PAK formats"""
    
    print(f"\n--- Alternative Format Analysis ---")
    
    # Look for common signatures throughout the file
    f.seek(0)
    data = f.read(min(file_size, 100000))  # Read first 100KB
    
    # Search for file signatures
    signatures = {
        b'PNG': 'PNG images',
        b'JFIF': 'JPEG images', 
        b'GIF8': 'GIF images',
        b'<!DOCTYPE': 'HTML documents',
        b'<html': 'HTML documents',
        b'function': 'JavaScript code',
        b'var ': 'JavaScript variables',
        b'const ': 'JavaScript constants',
        b'class ': 'JavaScript/CSS classes',
        b'.css': 'CSS references',
        b'.js': 'JavaScript references',
        b'.html': 'HTML references',
        b'http://': 'HTTP URLs',
        b'https://': 'HTTPS URLs',
        b'data:': 'Data URLs',
        b'webkit': 'WebKit references',
        b'chrome': 'Chrome references',
        b'electron': 'Electron references'
    }
    
    print("Signature search results:")
    for sig, desc in signatures.items():
        count = data.count(sig)
        if count > 0:
            print(f"  {desc}: {count} occurrences")

def find_embedded_content(f, file_size):
    """Search for embedded readable content"""
    
    print(f"\n--- Content Search ---")
    
    f.seek(0)
    chunk_size = 64 * 1024  # 64KB chunks
    all_strings = []
    
    while f.tell() < file_size:
        chunk = f.read(chunk_size)
        if not chunk:
            break
            
        # Find ASCII strings (4+ characters)
        strings = re.findall(b'[ -~]{4,}', chunk)
        for s in strings:
            try:
                decoded = s.decode('ascii')
                if len(decoded) >= 10:  # Only substantial strings
                    all_strings.append(decoded)
            except:
                pass
    
    # Filter and categorize strings
    html_css_js = []
    urls = []
    error_messages = []
    other_interesting = []
    
    for s in all_strings:
        s_lower = s.lower()
        if any(keyword in s_lower for keyword in ['html', 'css', 'javascript', 'function', 'class', 'style']):
            html_css_js.append(s)
        elif any(keyword in s_lower for keyword in ['http', 'https', 'www.', '.com', '.org']):
            urls.append(s)
        elif any(keyword in s_lower for keyword in ['error', 'warning', 'failed', 'exception']):
            error_messages.append(s)
        elif len(s) > 20 and any(c.isalpha() for c in s):
            other_interesting.append(s)
    
    print(f"Total strings found: {len(all_strings)}")
    print(f"HTML/CSS/JS related: {len(html_css_js)}")
    print(f"URLs: {len(urls)}")
    print(f"Error messages: {len(error_messages)}")
    print(f"Other interesting: {len(other_interesting)}")
    
    # Show samples
    if html_css_js:
        print(f"\n--- HTML/CSS/JS Samples ---")
        for i, s in enumerate(html_css_js[:5]):
            print(f"{i+1}. {s[:100]}{'...' if len(s) > 100 else ''}")
    
    if urls:
        print(f"\n--- URL Samples ---")
        for i, s in enumerate(urls[:5]):
            print(f"{i+1}. {s}")
    
    if error_messages:
        print(f"\n--- Error Message Samples ---")
        for i, s in enumerate(error_messages[:5]):
            print(f"{i+1}. {s[:100]}{'...' if len(s) > 100 else ''}")

def extract_strings_to_file(pak_path, output_path):
    """Extract all readable strings to a text file"""
    
    print(f"\n--- Extracting Strings to File ---")
    
    with open(pak_path, 'rb') as f, open(output_path, 'w', encoding='utf-8') as out:
        file_size = os.path.getsize(pak_path)
        chunk_size = 64 * 1024
        
        out.write(f"Extracted strings from: {pak_path}\n")
        out.write(f"File size: {file_size:,} bytes\n")
        out.write("=" * 50 + "\n\n")
        
        string_count = 0
        
        while f.tell() < file_size:
            chunk = f.read(chunk_size)
            if not chunk:
                break
                
            # Find strings of various lengths
            for min_len in [4, 10, 20]:
                strings = re.findall(f'[ -~]{{{min_len},}}', chunk)
                for s in strings:
                    try:
                        decoded = s.decode('ascii')
                        out.write(f"[{min_len}+] {decoded}\n")
                        string_count += 1
                    except:
                        pass
        
        print(f"Extracted {string_count} strings to {output_path}")

if __name__ == "__main__":
    pak_file = "C:/Users/Micha/OneDrive/Desktop/test/JARVIS/ChatGPT_App_Files/resources.pak"
    strings_file = "C:/Users/Micha/OneDrive/Desktop/test/JARVIS/extracted_strings.txt"
    
    # Analyze the PAK file
    analyze_pak_file(pak_file)
    
    # Extract strings to file
    extract_strings_to_file(pak_file, strings_file)