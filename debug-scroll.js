// Debug script to identify phantom scroll causes
// Run this in your browser console on the /chat page

console.log('🔍 Debugging phantom scroll...');

// Check body dimensions
const body = document.body;
console.log('📏 Body dimensions:', {
  scrollHeight: body.scrollHeight,
  clientHeight: body.clientHeight,
  offsetHeight: body.offsetHeight,
  scrollTop: body.scrollTop,
  hasOverflow: body.scrollHeight > body.clientHeight
});

// Check html element
const html = document.documentElement;
console.log('📐 HTML dimensions:', {
  scrollHeight: html.scrollHeight,
  clientHeight: html.clientHeight,
  offsetHeight: html.offsetHeight
});

// Check main chat container
const chatContainer = document.querySelector('[class*="flex h-screen"]');
if (chatContainer) {
  console.log('🎯 Chat container dimensions:', {
    scrollHeight: chatContainer.scrollHeight,
    clientHeight: chatContainer.clientHeight,
    offsetHeight: chatContainer.offsetHeight,
    className: chatContainer.className
  });
}

// List all direct children of body
console.log('👶 Body children:');
Array.from(body.children).forEach((child, index) => {
  console.log(`  ${index}:`, {
    tagName: child.tagName,
    className: child.className,
    id: child.id,
    style: child.style.cssText,
    dimensions: {
      scrollHeight: child.scrollHeight,
      clientHeight: child.clientHeight,
      offsetHeight: child.offsetHeight
    }
  });
});

// Check for any full-height elements
const fullHeightElements = Array.from(document.querySelectorAll('*')).filter(el => {
  const style = window.getComputedStyle(el);
  return style.height === '100vh' || style.height === '100%' || style.minHeight === '100vh';
});

if (fullHeightElements.length > 0) {
  console.log('🚨 Found full-height elements that might cause scroll:');
  fullHeightElements.forEach((el, index) => {
    console.log(`  ${index}:`, {
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      computedHeight: window.getComputedStyle(el).height,
      computedMinHeight: window.getComputedStyle(el).minHeight
    });
  });
}

// Check for any motion.div elements
const motionDivs = document.querySelectorAll('[data-framer-motion-component]');
if (motionDivs.length > 0) {
  console.log('🎭 Found Framer Motion components:');
  motionDivs.forEach((el, index) => {
    console.log(`  ${index}:`, {
      className: el.className,
      style: el.style.cssText,
      dimensions: {
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        offsetHeight: el.offsetHeight
      }
    });
  });
}

console.log('✅ Debug complete! Check the output above for potential scroll causes.');
