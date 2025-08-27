export function sanitizeHTML(html: string): string {
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

  let sanitized = html;
  
  // Remove dangerous tags completely
  sanitized = sanitized.replace(new RegExp(`<(${DANGEROUS_TAGS.join('|')})[^>]*>.*?</\\1>`, 'gi'), '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(new RegExp(`\\s+(${DANGEROUS_ATTRIBUTES.join('|')})\\s*=\\s*["'][^"']*["']`, 'gi'), '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (except for images)
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '');
  
  // Remove vbscript: protocol
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  // Remove on* attributes
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Replace any div tags that might be inside span tags with p tags
  sanitized = sanitized.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');
  
  // Ensure all HTML is properly closed
  sanitized = sanitized.replace(/<([^>]+)(?<!\/)>/g, (match, tagName) => {
    // Self-closing tags
    if (['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName.split(' ')[0])) {
      return match.replace(/>$/, ' />');
    }
    return match;
  });
  
  // Escape HTML entities in text content
  sanitized = sanitized.replace(/[&<>"'`=\/]/g, (match) => HTML_ENTITIES[match] || match);
  
  return sanitized;
}

export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}


