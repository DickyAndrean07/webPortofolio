"""Prepare the user-supplied portrait; remove only edge-connected white background."""
from pathlib import Path
from collections import deque
import shutil
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
out = root / 'public'
out.mkdir(exist_ok=True)
source = Path(sys.argv[1])
im = Image.open(source).convert('RGBA')
im.thumbnail((850, 850))
w, h = im.size
pixels = im.load()
seen = set()
queue = deque([(x, y) for x in range(w) for y in (0, h-1)] + [(x, y) for y in range(h) for x in (0, w-1)])
while queue:
    x, y = queue.popleft()
    if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
        continue
    seen.add((x, y))
    r, g, b, a = pixels[x, y]
    if min(r, g, b) < 220 or max(r, g, b) - min(r, g, b) > 25:
        continue
    pixels[x, y] = (r, g, b, 0)
    queue.extend(((x-1,y),(x+1,y),(x,y-1),(x,y+1)))
im.save(out / 'portrait.webp', quality=90)
shutil.copyfile(root / 'M_Dicky_Andrean_FlowCV_Resume_2026-10-19 (1).pdf', out / 'M-Dicky-Andrean-CV.pdf')
print('Prepared portrait.webp', im.size, 'and CV PDF')
