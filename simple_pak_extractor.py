#!/usr/bin/env python3
"""
Simple PAK Content Extractor
Focus on extracting readable strings and identifying content types
"""

import struct
import os
import re
import string

def analyze_pak_simple(pak_path):
    """Simple analysis focusing on content extraction"""
    
    print(f"Analyzing: {pak_path}")
    print("=" * 50)
    
    # Get file info
    file_size = os.path.getsize(pak_path)
    print(f"File size: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
    
    with open(pak_path, 'rb') as f:
        # Read header
        header = f.read(8)
        version, num_entries = struct.unpack('<II', header)
        print(f"PAK Version: {version}")
        print(f"Number of entries: {num_entries}")
        
        # The offset seems wrong (6,684,679 > file size), so this might be compressed
        # or use a different format. Let's search for strings throughout the file.
        
        print("\n--- Searching for readable content ---")
        
        f.seek(0)
        all_data = f.read()
        
        # Find all printable strings
        strings = []
        current_string = ""
        
        for byte in all_data:
            char = chr(byte) if byte < 128 else None
            if char and char in string.printable and char not in '\r\n\t':
                current_string += char
            else:
                if len(current_string) >= 10:  # Only keep strings 10+ chars
                    strings.append(current_string.strip())
                current_string = ""
        
        # Add final string if exists
        if len(current_string) >= 10:
            strings.append(current_string.strip())
        
        # Remove duplicates and filter
        unique_strings = list(set(strings))
        filtered_strings = [s for s in unique_strings if len(s) >= 10 and any(c.isalpha() for c in s)]
        
        print(f"Found {len(filtered_strings)} unique readable strings")
        
        # Categorize strings
        categories = {
            'html_css_js': [],
            'urls': [],
            'files': [],
            'errors': [],
            'ui_text': [],
            'other': []
        }
        
        for s in filtered_strings:
            s_lower = s.lower()
            
            if any(kw in s_lower for kw in ['html', 'css', 'javascript', 'function', 'class', 'style', 'script']):
                categories['html_css_js'].append(s)
            elif any(kw in s_lower for kw in ['http', 'https', 'www.', '.com', '.org', 'chrome://', 'file://']):
                categories['urls'].append(s)
            elif any(kw in s_lower for kw in ['.js', '.css', '.html', '.png', '.jpg', '.svg', '.json']):
                categories['files'].append(s)
            elif any(kw in s_lower for kw in ['error', 'warning', 'failed', 'exception', 'denied']):
                categories['errors'].append(s)
            elif any(kw in s_lower for kw in ['button', 'menu', 'dialog', 'window', 'click', 'chat', 'message']):
                categories['ui_text'].append(s)
            else:
                categories['other'].append(s)
        
        # Print results
        for category, items in categories.items():
            if items:
                print(f"\n--- {category.upper().replace('_', ' ')} ({len(items)} items) ---")
                for i, item in enumerate(items[:10]):  # Show first 10
                    print(f"{i+1:2d}. {item[:100]}{'...' if len(item) > 100 else ''}")
                if len(items) > 10:
                    print(f"    ... and {len(items) - 10} more")
        
        return filtered_strings, categories

def save_extraction_results(strings, categories, output_file):
    """Save all extracted content to a file"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("ChatGPT resources.pak Content Extraction\n")
        f.write("=" * 50 + "\n\n")
        
        f.write(f"Total unique strings extracted: {len(strings)}\n\n")
        
        for category, items in categories.items():
            if items:
                f.write(f"\n{category.upper().replace('_', ' ')} ({len(items)} items)\n")
                f.write("-" * 40 + "\n")
                for i, item in enumerate(items, 1):
                    f.write(f"{i:3d}. {item}\n")
                f.write("\n")
        
        f.write("\n" + "=" * 50 + "\n")
        f.write("ALL EXTRACTED STRINGS (FULL LIST)\n")
        f.write("=" * 50 + "\n\n")
        
        for i, s in enumerate(sorted(strings), 1):
            f.write(f"{i:4d}. {s}\n")

def create_integration_recommendations(categories):
    """Analyze what can be integrated into JARVIS"""
    
    print(f"\n--- INTEGRATION RECOMMENDATIONS FOR JARVIS ---")
    print("=" * 50)
    
    recommendations = []
    
    if categories['html_css_js']:
        recommendations.append("HTML/CSS/JS Components:")
        recommendations.append("- Found code-related strings that might contain UI components")
        recommendations.append("- Check for reusable CSS styles and JavaScript functions")
        
    if categories['ui_text']:
        recommendations.append("\nUI Text Elements:")
        recommendations.append("- Can extract UI labels and messages")
        recommendations.append("- Useful for consistent terminology")
        
    if categories['urls']:
        recommendations.append("\nURL References:")
        recommendations.append("- May contain API endpoints or external resources")
        recommendations.append("- Check for ChatGPT service URLs")
        
    if categories['files']:
        recommendations.append("\nFile References:")
        recommendations.append("- Asset files that might be useful")
        recommendations.append("- Check for icon files, stylesheets, or scripts")
    
    # Overall assessment
    total_useful = len(categories['html_css_js']) + len(categories['ui_text']) + len(categories['files'])
    
    if total_useful > 0:
        recommendations.append(f"\nOVERALL ASSESSMENT:")
        recommendations.append(f"- Found {total_useful} potentially useful items")
        recommendations.append("- The PAK file appears to contain mostly compressed/binary data")
        recommendations.append("- Most UI code is likely in the main application, not this resource file")
        recommendations.append("- This file seems to contain primarily assets and error messages")
    else:
        recommendations.append("\nOVERALL ASSESSMENT:")
        recommendations.append("- Limited extractable UI components found")
        recommendations.append("- File appears to be mostly compressed assets")
        recommendations.append("- Consider examining the main application executable instead")
        recommendations.append("- For UI inspiration, web-based ChatGPT might be more accessible")
    
    for rec in recommendations:
        print(rec)
    
    return recommendations

if __name__ == "__main__":
    pak_file = "C:/Users/Micha/OneDrive/Desktop/test/JARVIS/ChatGPT_App_Files/resources.pak"
    output_file = "C:/Users/Micha/OneDrive/Desktop/test/JARVIS/chatgpt_extracted_content.txt"
    
    print("ChatGPT PAK Content Extractor")
    print("=" * 30)
    
    # Extract content
    strings, categories = analyze_pak_simple(pak_file)
    
    # Save results
    save_extraction_results(strings, categories, output_file)
    print(f"\nResults saved to: {output_file}")
    
    # Generate recommendations
    recommendations = create_integration_recommendations(categories)