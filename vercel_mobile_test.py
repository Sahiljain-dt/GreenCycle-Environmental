import asyncio
from playwright.async_api import async_playwright

async def test_vercel_mobile():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Test the LIVE Vercel site at mobile viewport
        context = await browser.new_context(viewport={"width": 390, "height": 844})
        page = await context.new_page()
        
        await page.goto("https://gce-git-main-designthynks-projects.vercel.app", wait_until="networkidle", timeout=30000)
        
        # Wait a bit for any JS to settle
        await page.wait_for_timeout(2000)
        
        # Take viewport screenshot (what user sees first)
        await page.screenshot(path="vercel_mobile_viewport.png")
        
        # Scroll through page and capture each section
        sections = [
            ("hero", "#home"),
            ("mission", "#mission"),
            ("services", "#services"),
            ("process", "#process"),
            ("advantage", "#advantage"),
            ("cta", "#contact"),
        ]
        
        for name, selector in sections:
            try:
                await page.evaluate(f"document.querySelector('{selector}').scrollIntoView()")
                await page.wait_for_timeout(500)
                await page.screenshot(path=f"vercel_mobile_{name}.png")
            except Exception as e:
                print(f"Error on {name}: {e}")
        
        # Get metrics
        metrics = await page.evaluate("""
            () => ({
                scrollHeight: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight,
                viewportWidth: window.innerWidth,
                heroHeight: document.querySelector('.hero')?.offsetHeight || 0,
                heroMinHeight: window.getComputedStyle(document.querySelector('.hero') || document.body).minHeight,
                diagonalHeight: document.querySelector('.hero-diagonal')?.offsetHeight || 0,
                hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
            })
        """)
        
        print(f"Viewport: {metrics['viewportWidth']}x{metrics['viewportHeight']}")
        print(f"Page height: {metrics['scrollHeight']}px")
        print(f"Hero height: {metrics['heroHeight']}px (min: {metrics['heroMinHeight']})")
        print(f"Diagonal height: {metrics['diagonalHeight']}px")
        print(f"Horizontal scroll: {metrics['hasHorizontalScroll']}")
        
        # Check for elements that overflow horizontally
        overflow = await page.evaluate("""
            () => {
                const bad = [];
                document.querySelectorAll('*').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.right > window.innerWidth + 2 && rect.left < window.innerWidth) {
                        bad.push({
                            tag: el.tagName,
                            class: el.className?.substring(0, 50),
                            id: el.id,
                            width: Math.round(rect.width),
                            right: Math.round(rect.right),
                            vw: window.innerWidth
                        });
                    }
                });
                return bad.slice(0, 5);
            }
        """)
        
        if overflow:
            print("\\nElements overflowing viewport:")
            for o in overflow:
                print(f"  {o['tag']}.{o['class']}#{o['id']} - width:{o['width']} right:{o['right']} (vw:{o['vw']})")
        
        await browser.close()

asyncio.run(test_vercel_mobile())
