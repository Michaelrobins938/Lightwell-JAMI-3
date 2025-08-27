const { chromium } = require('playwright');

async function debugChatScroll() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Navigating to chat page...');
    await page.goto('http://localhost:3000/chat');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('📏 Checking page dimensions...');
    
    // Get body dimensions
    const bodyInfo = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollHeight: body.scrollHeight,
        clientHeight: body.clientHeight,
        offsetHeight: body.offsetHeight,
        scrollTop: body.scrollTop,
        hasOverflow: body.scrollHeight > body.clientHeight,
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth
      };
    });
    
    console.log('📏 Body dimensions:', bodyInfo);
    
    // Get HTML element dimensions
    const htmlInfo = await page.evaluate(() => {
      const html = document.documentElement;
      return {
        scrollHeight: html.scrollHeight,
        clientHeight: html.clientHeight,
        offsetHeight: html.offsetHeight
      };
    });
    
    console.log('📐 HTML dimensions:', htmlInfo);
    
    // Check main chat container
    const chatContainerInfo = await page.evaluate(() => {
      const container = document.querySelector('[class*="flex h-screen"]');
      if (container) {
        return {
          scrollHeight: container.scrollHeight,
          clientHeight: container.clientHeight,
          offsetHeight: container.offsetHeight,
          className: container.className,
          computedHeight: window.getComputedStyle(container).height,
          computedMinHeight: window.getComputedStyle(container).minHeight
        };
      }
      return null;
    });
    
    console.log('🎯 Chat container:', chatContainerInfo);
    
    // List all direct children of body
    const bodyChildren = await page.evaluate(() => {
      return Array.from(document.body.children).map((child, index) => ({
        index,
        tagName: child.tagName,
        className: child.className,
        id: child.id,
        style: child.style.cssText,
        dimensions: {
          scrollHeight: child.scrollHeight,
          clientHeight: child.clientHeight,
          offsetHeight: child.offsetHeight
        }
      }));
    });
    
    console.log('👶 Body children:', bodyChildren);
    
    // Check for full-height elements
    const fullHeightElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.height === '100vh' || style.height === '100%' || style.minHeight === '100vh';
      }).map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        computedHeight: window.getComputedStyle(el).height,
        computedMinHeight: window.getComputedStyle(el).minHeight
      }));
    });
    
    if (fullHeightElements.length > 0) {
      console.log('🚨 Full-height elements found:', fullHeightElements);
    }
    
    // Check for motion.div elements
    const motionDivs = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-framer-motion-component]');
      return Array.from(elements).map(el => ({
        className: el.className,
        style: el.style.cssText,
        dimensions: {
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          offsetHeight: el.offsetHeight
        }
      }));
    });
    
    if (motionDivs.length > 0) {
      console.log('🎭 Framer Motion components:', motionDivs);
    }
    
    // Check if there's a scrollbar
    const hasScrollbar = await page.evaluate(() => {
      return document.body.scrollHeight > document.body.clientHeight;
    });
    
    console.log('🔍 Has scrollbar:', hasScrollbar);
    
    // Take a screenshot to see the current state
    await page.screenshot({ path: 'chat-page-debug.png', fullPage: true });
    console.log('📸 Screenshot saved as chat-page-debug.png');
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await browser.close();
  }
}

debugChatScroll();
