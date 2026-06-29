#!/usr/bin/env python3
"""
Capture per-section screenshots of the Green Cycle homepage.
Scrolls each target into view, waits for GSAP animations to settle,
and saves PNGs to assets/screenshots/.
"""

from pathlib import Path
from playwright.sync_api import sync_playwright

PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = PROJECT_ROOT / "assets" / "screenshots"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SECTIONS = [
    ("home", "#home"),
    ("mission", "#mission"),
    ("services", "#services"),
    ("process", "#process"),
    ("advantage", "#advantage"),
    ("impact", "#impact"),
    ("contact", "#contact"),
]

VIEWPORT = {"width": 1440, "height": 900}
BASE_URL = "http://localhost:8080"


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport=VIEWPORT)
        page.goto(BASE_URL)
        page.wait_for_timeout(2500)  # allow hero entrance to settle

        for name, selector in SECTIONS:
            element = page.locator(selector)
            if element.count() == 0:
                print(f"Warning: {selector} not found")
                continue
            element.evaluate("el => el.scrollIntoView({behavior: 'instant', block: 'start'})")
            page.evaluate("() => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(true); }")
            page.wait_for_timeout(2500)  # allow scroll-triggered animations
            path = OUTPUT_DIR / f"final-{name}.png"
            page.screenshot(path=str(path))
            print(f"Saved {path}")

        browser.close()


if __name__ == "__main__":
    main()
