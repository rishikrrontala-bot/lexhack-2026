"""Record the public site as a captioned, silent 2–3 minute demo."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import imageio_ffmpeg
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'submission' / 'video'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'https://rishikrrontala-bot.github.io/lexhack-2026/'

def caption(page, value):
    page.evaluate("t => {let e=document.querySelector('#video-caption'); if(!e){e=document.createElement('div');e.id='video-caption';document.body.append(e)} e.textContent=t}", value)

def hold(page, seconds):
    page.wait_for_timeout(int(seconds * 1000))

def move_click(page, locator):
    locator.scroll_into_view_if_needed()
    box = locator.bounding_box()
    if box:
        page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2,steps=12)
        hold(page,.4)
    locator.click()

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True,args=['--no-sandbox','--mute-audio'])
    context = browser.new_context(viewport={'width':1280,'height':720}, record_video_dir=str(OUT), record_video_size={'width':1280,'height':720}, reduced_motion='reduce')
    page = context.new_page()
    page.goto(URL,wait_until='networkidle')
    page.add_style_tag(content="""#video-caption{position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#141517ed;color:#fcfcfa;padding:19px 36px;font:600 24px/1.28 Arial,sans-serif;text-align:center;min-height:74px;display:flex;align-items:center;justify-content:center;pointer-events:none}html{scroll-behavior:auto!important}""")
    original = page.locator('#bill-text').input_value()
    # Wow moment in the opening seconds.
    page.locator('#compile').click()
    page.locator('#after-text ins').wait_for()
    page.locator('#after-block').scroll_into_view_if_needed()
    caption(page,'A real D.C. bill rewrites the law in one click.')
    hold(page,13)
    caption(page,'Each magenta mark traces back to one bill instruction.')
    page.locator('#trace-text').scroll_into_view_if_needed()
    hold(page,15)
    caption(page,'The source sentence remains attached to the words it changes.')
    hold(page,12)
    move_click(page,page.locator('.instruction').nth(0))
    caption(page,'A full paragraph replacement, applied to the historical Code.')
    hold(page,15)
    move_click(page,page.locator('.instruction').nth(3))
    caption(page,'The compiler also reads a repeal and shows its target.')
    hold(page,15)
    move_click(page,page.locator('.instruction').nth(2))
    caption(page,'No model call. The edit engine is deterministic and inspectable.')
    hold(page,14)
    page.locator('#bill-text').fill(original.replace('Strike the word "written".', 'Strike the word "nonexistent wording".'))
    move_click(page,page.locator('#compile'))
    page.locator('.query').first.wait_for()
    page.locator('.query').first.scroll_into_view_if_needed()
    caption(page,'If the phrase is absent, the proof raises a query instead of guessing.')
    hold(page,18)
    page.locator('#bill-text').fill(original)
    page.locator('#compile').click()
    page.locator('#publication-copy').scroll_into_view_if_needed()
    caption(page,'The later Council publication includes editorial changes. We show that gap.')
    hold(page,18)
    page.locator('#about').scroll_into_view_if_needed()
    caption(page,'One honest, source-linked proof desk. Built by Rishik Rontala.')
    hold(page,12)
    context.close()
    webm=Path(page.video.path())
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    mp4=OUT/'demo.mp4'
    subprocess.run([ffmpeg,'-y','-i',str(webm),'-vf','scale=1920:1080:flags=lanczos','-c:v','libx264','-preset','medium','-crf','27','-pix_fmt','yuv420p','-an','-movflags','+faststart',str(mp4)],check=True,stdout=subprocess.DEVNULL)
    print('VIDEO',mp4,'BYTES',mp4.stat().st_size)
    browser.close()
