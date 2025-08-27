import { NextResponse } from 'next/server';

// HTML entities mapping for XSS prevention
const HTML_ENTITIES: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

// Dangerous HTML attributes to remove
const DANGEROUS_ATTRIBUTES = [
  'onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur',
  'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload', 'onabort',
  'onbeforeunload', 'onerror', 'onhashchange', 'onmessage', 'onoffline',
  'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onresize',
  'onstorage', 'oncontextmenu', 'oninput', 'oninvalid', 'onsearch',
  'onbeforeprint', 'onafterprint', 'onbeforecopy', 'onbeforecut',
  'onbeforepaste', 'oncopy', 'oncut', 'onpaste', 'onselectstart',
  'onstart', 'onstop', 'onbeforeeditfocus', 'onlayoutcomplete',
  'onlosecapture', 'onpropertychange', 'onreadystatechange',
  'onrowsdelete', 'onrowsinserted', 'oncellchange', 'onhelp',
  'onbeforedeactivate', 'onbeforeactivate', 'oncontrolselect',
  'onfocusin', 'onfocusout', 'onactivate', 'onbeforecopy',
  'onbeforecut', 'onbeforepaste', 'oncopy', 'oncut', 'onpaste',
  'onmouseenter', 'onmouseleave', 'onmousewheel', 'onmove',
  'onmoveend', 'onmovestart', 'onbeforeunload', 'onerror',
  'onhashchange', 'onmessage', 'onoffline', 'ononline',
  'onpagehide', 'onpageshow', 'onpopstate', 'onresize',
  'onstorage', 'oncontextmenu', 'oninput', 'oninvalid', 'onsearch'
];

// Dangerous HTML tags to remove
const DANGEROUS_TAGS = [
  'script', 'object', 'embed', 'applet', 'form', 'input',
  'textarea', 'select', 'button', 'iframe', 'frame',
  'frameset', 'noframes', 'noscript', 'xmp', 'plaintext',
  'listing', 'dir', 'menu', 'isindex', 'base', 'basefont',
  'bgsound', 'link', 'meta', 'title', 'style', 'xml',
  'xmp', 'plaintext', 'listing', 'dir', 'menu', 'isindex'
];

export function sanitizeOutput(response: NextResponse): NextResponse {
  try {
    // Get the response body
    const body = response.body;
    if (!body) return response;
    
    // Clone the response to modify it
    const newResponse = NextResponse.next();
    
    // Copy all headers
    response.headers.forEach((value, key) => {
      newResponse.headers.set(key, value);
    });
    
    // Sanitize the response body if it's HTML or JSON
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/html')) {
      // For HTML responses, sanitize the content
      const sanitizedBody = sanitizeHTML(body.toString());
      // Create a new response object instead of modifying the existing one
      const newResponse = new NextResponse(sanitizedBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      return newResponse;
    } else if (contentType?.includes('application/json')) {
      // For JSON responses, sanitize string values
      const jsonData = JSON.parse(body.toString());
      const sanitizedData = sanitizeJSON(jsonData);
      // Create a new response object instead of modifying the existing one
      const newResponse = new NextResponse(JSON.stringify(sanitizedData), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      return newResponse;
    }
    
    // If no content type matched, return the original response
    return response;
    
  } catch (error) {
    console.error('Output sanitization error:', error);
    return response; // Return original response if sanitization fails
  }
}

function sanitizeHTML(html: string): string {
  return html
    // Remove dangerous tags
    .replace(new RegExp(`<(${DANGEROUS_TAGS.join('|')})[^>]*>.*?</\\1>`, 'gi'), '')
    // Remove dangerous attributes
    .replace(new RegExp(`\\s+(${DANGEROUS_ATTRIBUTES.join('|')})\\s*=\\s*["'][^"']*["']`, 'gi'), '')
    // Escape HTML entities
    .replace(/[&<>"'`=\/]/g, (match) => HTML_ENTITIES[match] || match)
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (except for images)
    .replace(/data:(?!image\/)/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove on* attributes
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
}

function sanitizeJSON(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeJSON);
  } else if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeJSON(value);
    }
    return sanitized;
  }
  return obj;
}

function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:(?!image\/)/gi, '') // Remove data: protocol (except images)
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
}

// Utility function to sanitize user input before storing
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:(?!image\/)/gi, '') // Remove data: protocol (except images)
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/[&<>"'`=\/]/g, (match) => HTML_ENTITIES[match] || match) // Escape HTML entities
    .trim();
}

// Function to validate and sanitize URLs
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Remove potentially dangerous parameters
    const dangerousParams = ['javascript', 'data', 'vbscript'];
    dangerousParams.forEach(param => {
      parsed.searchParams.delete(param);
    });
    
    return parsed.toString();
  } catch {
    return null;
  }
}

// Function to sanitize file names
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\.\./g, '') // Remove directory traversal
    .replace(/^\./, '') // Remove leading dot
    .substring(0, 255); // Limit length
}
