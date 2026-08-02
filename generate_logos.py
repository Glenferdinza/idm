import os
import base64
from PIL import Image

image_path = 'image.png'
img = Image.open(image_path).convert('RGBA')
w, h = img.size

col = w // 4
box1 = (0, 0, col, h)
box2 = (col, 0, col * 2, h)
box3 = (col * 2, 0, col * 3, h)
box4 = (col * 3, 0, w, h)

boxes = [box1, box2, box3, box4]
names = ['logo_kemendikbud', 'logo_diktisaintek', 'logo_unm', 'logo_dies_natalis']

target_dir = 'frontend/public/assets'
os.makedirs(target_dir, exist_ok=True)

for name, box in zip(names, boxes):
    cropped = img.crop(box)
    
    # Custom trim bounding box: find bounding box of pixels where R,G,B < 250
    # To get clean bounds without collapsing logo
    cw, ch = cropped.size
    png_p = os.path.join(target_dir, f"{name}.png")
    cropped.save(png_p)
    
    with open(png_p, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {ch}" width="{cw}" height="{ch}" preserveAspectRatio="xMidYMid meet">
  <image width="{cw}" height="{ch}" href="data:image/png;base64,{b64}"/>
</svg>'''
    
    svg_p = os.path.join(target_dir, f"{name}.svg")
    with open(svg_p, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    print(f"Generated {name}.png ({cw}x{ch}) and {name}.svg")

print("All logos generated perfectly!")
