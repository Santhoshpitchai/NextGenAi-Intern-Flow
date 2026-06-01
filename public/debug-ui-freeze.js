/**
 * UI Freeze Debugger
 * 
 * Paste this into browser console (F12) to diagnose UI blocking issues
 */

console.log('🔍 Starting UI Freeze Diagnostic...\n');

// 1. Check for Dialog Overlays
console.log('1️⃣ Checking for Dialog Overlays:');
const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
if (overlays.length > 0) {
  console.warn(`⚠️ Found ${overlays.length} dialog overlay(s):`);
  overlays.forEach((el, i) => {
    const state = el.getAttribute('data-state');
    const zIndex = window.getComputedStyle(el).zIndex;
    const pointerEvents = window.getComputedStyle(el).pointerEvents;
    const display = window.getComputedStyle(el).display;
    
    console.log(`  Overlay ${i + 1}:`, {
      state,
      zIndex,
      pointerEvents,
      display,
      element: el
    });
    
    if (state === 'closed' && pointerEvents !== 'none') {
      console.error(`  ❌ PROBLEM: Closed overlay still capturing pointer events!`);
    }
  });
} else {
  console.log('  ✅ No dialog overlays found');
}

// 2. Check for Dialog Content
console.log('\n2️⃣ Checking for Dialog Content:');
const dialogContent = document.querySelectorAll('[data-radix-dialog-content]');
if (dialogContent.length > 0) {
  console.warn(`⚠️ Found ${dialogContent.length} dialog content(s):`);
  dialogContent.forEach((el, i) => {
    const state = el.getAttribute('data-state');
    const display = window.getComputedStyle(el).display;
    console.log(`  Dialog ${i + 1}:`, { state, display, element: el });
  });
} else {
  console.log('  ✅ No dialog content found');
}

// 3. Check what element is at the center of the screen
console.log('\n3️⃣ Checking element at screen center:');
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const topElement = document.elementFromPoint(centerX, centerY);
console.log('  Element at center:', topElement);
console.log('  Tag:', topElement?.tagName);
console.log('  Classes:', topElement?.className);
console.log('  Z-index:', window.getComputedStyle(topElement).zIndex);
console.log('  Pointer events:', window.getComputedStyle(topElement).pointerEvents);

// 4. Find all high z-index elements
console.log('\n4️⃣ Finding elements with high z-index (>40):');
const highZIndexElements = Array.from(document.querySelectorAll('*'))
  .map(el => ({
    el,
    zIndex: window.getComputedStyle(el).zIndex
  }))
  .filter(({zIndex}) => zIndex !== 'auto' && parseInt(zIndex) > 40)
  .sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));

if (highZIndexElements.length > 0) {
  console.log(`  Found ${highZIndexElements.length} elements:`);
  highZIndexElements.slice(0, 10).forEach(({el, zIndex}) => {
    console.log(`  z-index ${zIndex}:`, el.tagName, el.className);
  });
} else {
  console.log('  ✅ No problematic high z-index elements');
}

// 5. Check for pointer-events: none on body or main containers
console.log('\n5️⃣ Checking pointer-events on main containers:');
['body', 'html', '#root', 'main', '[role="main"]'].forEach(selector => {
  const el = document.querySelector(selector);
  if (el) {
    const pointerEvents = window.getComputedStyle(el).pointerEvents;
    console.log(`  ${selector}: ${pointerEvents}`);
    if (pointerEvents === 'none') {
      console.error(`  ❌ PROBLEM: ${selector} has pointer-events: none!`);
    }
  }
});

// 6. Check for any fixed/absolute positioned elements covering the screen
console.log('\n6️⃣ Checking for full-screen overlays:');
const fullScreenElements = Array.from(document.querySelectorAll('*'))
  .filter(el => {
    const style = window.getComputedStyle(el);
    const position = style.position;
    const inset = style.inset;
    const top = style.top;
    const left = style.left;
    const right = style.right;
    const bottom = style.bottom;
    
    return (position === 'fixed' || position === 'absolute') && 
           (inset === '0px' || (top === '0px' && left === '0px' && right === '0px' && bottom === '0px'));
  });

if (fullScreenElements.length > 0) {
  console.warn(`  ⚠️ Found ${fullScreenElements.length} full-screen positioned elements:`);
  fullScreenElements.forEach(el => {
    const style = window.getComputedStyle(el);
    console.log('  Element:', {
      tag: el.tagName,
      class: el.className,
      position: style.position,
      zIndex: style.zIndex,
      pointerEvents: style.pointerEvents,
      display: style.display,
      opacity: style.opacity,
      element: el
    });
  });
} else {
  console.log('  ✅ No full-screen overlays found');
}

// 7. Test if inputs are actually disabled
console.log('\n7️⃣ Checking input elements:');
const inputs = document.querySelectorAll('input, button, textarea');
console.log(`  Found ${inputs.length} interactive elements`);
const disabledInputs = Array.from(inputs).filter(el => el.disabled);
if (disabledInputs.length > 0) {
  console.warn(`  ⚠️ ${disabledInputs.length} elements are disabled`);
} else {
  console.log('  ✅ No disabled inputs');
}

// 8. Summary and Fix Suggestions
console.log('\n📋 SUMMARY:');
const problems = [];

if (overlays.length > 0) {
  const closedOverlaysWithPointers = Array.from(overlays).filter(el => {
    const state = el.getAttribute('data-state');
    const pointerEvents = window.getComputedStyle(el).pointerEvents;
    return state === 'closed' && pointerEvents !== 'none';
  });
  
  if (closedOverlaysWithPointers.length > 0) {
    problems.push('Closed dialog overlays still capturing clicks');
  }
}

if (fullScreenElements.length > 0) {
  const blockingElements = fullScreenElements.filter(el => {
    const style = window.getComputedStyle(el);
    return style.pointerEvents !== 'none' && style.display !== 'none';
  });
  if (blockingElements.length > 0) {
    problems.push('Full-screen elements blocking interactions');
  }
}

if (problems.length > 0) {
  console.error('❌ PROBLEMS FOUND:');
  problems.forEach(p => console.error(`  - ${p}`));
  
  console.log('\n🔧 QUICK FIX:');
  console.log('Run this to remove blocking overlays:');
  console.log(`
    document.querySelectorAll('[data-radix-dialog-overlay]').forEach(el => el.remove());
    document.querySelectorAll('[data-radix-dialog-content]').forEach(el => el.remove());
  `);
} else {
  console.log('✅ No obvious UI blocking issues detected');
  console.log('If UI is still frozen, check:');
  console.log('  1. Browser console for JavaScript errors');
  console.log('  2. Network tab for failed requests');
  console.log('  3. React DevTools for component state');
}

console.log('\n✨ Diagnostic complete!');
