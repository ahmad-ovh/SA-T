"""Layout-only smoke test for TSX source snapshot. Does not exercise React events."""
import asyncio, json, os, shutil
from pathlib import Path
from playwright.async_api import async_playwright
root=Path(__file__).resolve().parent.parent
html=(root/'qa-static.html').read_text()
out=root/'qa-output'
out.mkdir(exist_ok=True)
async def run():
  async with async_playwright() as p:
    browser=await p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or None,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    reports=[]
    for width in [360, 390, 768, 1024, 1440, 1920]:
      page=await browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
      await page.set_content(html,wait_until='domcontentloaded',timeout=20000)
      await page.evaluate('document.fonts.ready')
      dims=await page.evaluate('''() => ({viewport:innerWidth,docWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,heading:[...document.querySelectorAll('.chapter h2')].map(el=>({label:el.innerText,scroll:el.scrollWidth,client:el.clientWidth})),oversized:[...document.querySelectorAll('main *,header *,footer *')].filter(el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>1 && r.right>innerWidth+6 && s.position!=='absolute' && s.position!=='fixed' && s.display!=='none' && !el.closest('svg')}).slice(0,20).map(el=>({tag:el.tagName,cls:String(el.className).slice(0,55),text:el.textContent?.slice(0,35),right:Math.round(el.getBoundingClientRect().right)}))})''')
      reports.append({'width':width,**dims})
      if width in [390,768,1440]:
        await page.locator('#origin').screenshot(path=str(out/f'qa-origin-{width}.png'),timeout=25000)
        await page.locator('#tectonics').screenshot(path=str(out/f'qa-tectonics-{width}.png'),timeout=25000)
        await page.locator('#malaysia').screenshot(path=str(out/f'qa-malaysia-{width}.png'),timeout=25000)
      await page.close()
    (out/'layout-report.json').write_text(json.dumps(reports,indent=2)+'\n')
    assert all(r['docWidth']==r['viewport'] and not r['oversized'] for r in reports),'Unexpected viewport overflow'
    print('PASS: no unexpected page-width overflow at 360, 390, 768, 1024, 1440, 1920 px')
    await browser.close()
asyncio.run(run())
