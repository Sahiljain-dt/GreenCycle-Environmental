import asyncio
from playwright.async_api import async_playwright

async def test_vercel_mobile():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Test Vercel deployment at mobile size
        context = await browser.new_context(viewport={"width": 375, "height": 812})
        page = await context.new_page()
        
        await page.goto("https://gce-git-main-designthynks-projects.vercel.app/", wait_until="networkidle")
        
        # Take screenshots
        await page.screenshot(path="vercel_mobile_viewport.png")
        await page.screenshot(path="vercel_mobile_full.png", full_page=True)
        
        # Check hero section
        hero_metrics = await page.evaluate("""
            () => {
                const hero = document.querySelector('.hero');
                const visual = document.querySelector('.hero-visual');
                const diagonal = document.querySelector('.hero-diagonal');
                return {
                    heroHeight: hero ? hero.offsetHeight : 0,
                    heroMinHeight: hero ? window.getComputedStyle(hero).minHeight : 'none',
                    visualDisplay: visual ? window.getComputedStyle(visual).display : 'none',
                    diagonalHeight: diagonal ? diagonal.offsetHeight : 0,
                };
            }
        """)
        
        print(f"Hero height: {hero_metrics['heroHeight']}px (min: {hero_metrics['heroMinHeight']})")
        print(f"Hero visual display: {hero_metrics['visualDisplay']}")
        print(f"Diagonal height: {hero_metrics['diagonalHeight']}px")
        
        # Check if GSAP is disabled on mobile
        gsap_check = await page.evaluate("""
            () => {
                // Check if mobile media query matches
                const isMobile = window.matchMedia('(max-width: 768px)').matches;
                // Check if any elements have opacity 0 from GSAP
                const hiddenElements = document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]');
                return {
                    isMobile: isMobile,
                    hiddenCount: hiddenElements.length,
                    viewportWidth: window.innerWidth,
                };
            }
        """)
        
        print(f"Is mobile viewport: {gsap_check['isMobile']}")
        print(f"Hidden elements (opacity 0): {gsap_check['hiddenCount']}")
        print(f"Viewport width: {gsap_check['viewportWidth']}px")
        
        await context.close()
        await browser.close()

asyncio.run(test_vercel_mobile())
