import asyncio
from playwright.async_api import async_playwright

async def test_mobile():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Test at multiple mobile breakpoints
        viewports = [
            {"width": 375, "height": 812, "name": "iPhone_X"},   # iPhone X
            {"width": 390, "height": 844, "name": "iPhone_12"},  # iPhone 12/13/14
            {"width": 414, "height": 896, "name": "iPhone_11"}, # iPhone 11 Pro Max
            {"width": 768, "height": 1024, "name": "iPad"},      # iPad
        ]
        
        for vp in viewports:
            context = await browser.new_context(viewport={"width": vp["width"], "height": vp["height"]})
            page = await context.new_page()
            
            # Load the local server
            await page.goto("http://localhost:8080", wait_until="networkidle")
            
            # Take full page screenshot
            await page.screenshot(path=f"mobile_test_{vp['name']}_full.png", full_page=True)
            
            # Take viewport screenshot (top of page)
            await page.screenshot(path=f"mobile_test_{vp['name']}_viewport.png")
            
            # Scroll down and take screenshots of each section
            sections = ["#home", "#mission", "#services", "#process", "#advantage", "#contact"]
            for section in sections:
                try:
                    await page.evaluate(f"document.querySelector('{section}').scrollIntoView()")
                    await page.wait_for_timeout(500)
                    await page.screenshot(path=f"mobile_test_{vp['name']}_{section.replace('#', '')}.png")
                except:
                    pass
            
            # Get page metrics
            metrics = await page.evaluate("""
                () => ({
                    scrollHeight: document.documentElement.scrollHeight,
                    viewportHeight: window.innerHeight,
                    viewportWidth: window.innerWidth,
                    bodyOverflowX: window.getComputedStyle(document.body).overflowX,
                    bodyOverflowY: window.getComputedStyle(document.body).overflowY,
                    htmlOverflowX: window.getComputedStyle(document.documentElement).overflowX,
                    htmlOverflowY: window.getComputedStyle(document.documentElement).overflowY,
                })
            """)
            
            print(f"\n=== {vp['name']} ({vp['width']}x{vp['height']}) ===")
            print(f"  Page scroll height: {metrics['scrollHeight']}px")
            print(f"  Viewport: {metrics['viewportWidth']}x{metrics['viewportHeight']}")
            print(f"  Body overflow: {metrics['bodyOverflowX']} / {metrics['bodyOverflowY']}")
            print(f"  HTML overflow: {metrics['htmlOverflowX']} / {metrics['htmlOverflowY']}")
            
            # Check for horizontal overflow
            h_overflow = await page.evaluate("""
                () => {
                    const elements = document.querySelectorAll('*');
                    const offenders = [];
                    for (const el of elements) {
                        const rect = el.getBoundingClientRect();
                        if (rect.right > window.innerWidth + 1) {
                            offenders.push({
                                tag: el.tagName,
                                class: el.className,
                                id: el.id,
                                right: rect.right,
                                width: rect.width
                            });
                        }
                    }
                    return offenders.slice(0, 10);
                }
            """)
            
            if h_overflow:
                print(f"  ⚠️ HORIZONTAL OVERFLOW elements:")
                for o in h_overflow:
                    print(f"    {o['tag']}.{o['class']}#{o['id']} - right: {o['right']:.0f}px, width: {o['width']:.0f}px")
            else:
                print(f"  ✅ No horizontal overflow detected")
            
            # Check hero section specifically
            hero_metrics = await page.evaluate("""
                () => {
                    const hero = document.querySelector('.hero');
                    const diagonal = document.querySelector('.hero-diagonal');
                    const visual = document.querySelector('.hero-visual');
                    if (!hero) return null;
                    return {
                        heroHeight: hero.offsetHeight,
                        heroMinHeight: window.getComputedStyle(hero).minHeight,
                        heroPaddingTop: window.getComputedStyle(hero).paddingTop,
                        heroPaddingBottom: window.getComputedStyle(hero).paddingBottom,
                        diagonalHeight: diagonal ? diagonal.offsetHeight : 0,
                        diagonalTop: diagonal ? diagonal.getBoundingClientRect().top : 0,
                        visualHeight: visual ? visual.offsetHeight : 0,
                        visualTop: visual ? visual.getBoundingClientRect().top : 0,
                    };
                }
            """)
            
            if hero_metrics:
                print(f"  Hero: {hero_metrics['heroHeight']}px (min: {hero_metrics['heroMinHeight']})")
                print(f"  Diagonal: {hero_metrics['diagonalHeight']}px at y={hero_metrics['diagonalTop']:.0f}")
                print(f"  Visual: {hero_metrics['visualHeight']}px at y={hero_metrics['visualTop']:.0f}")
            
            await context.close()
        
        await browser.close()

asyncio.run(test_mobile())
