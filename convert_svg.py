import os
import base64
from PIL import Image

def png_to_svg(png_path, svg_path):
    im = Image.open(png_path)
    w, h = im.size
    with open(png_path, 'rb') as f:
        b64_data = base64.b64encode(f.read()).decode('utf-8')
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <image width="{w}" height="{h}" href="data:image/png;base64,{b64_data}"/>
</svg>'''
    
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Created SVG: {svg_path}")

target_dirs = ['frontend/public/assets', 'frontend/assets']
logos = ['logo_kemendikbud', 'logo_diktisaintek', 'logo_unm', 'logo_dies_natalis']

for target_dir in target_dirs:
    os.makedirs(target_dir, exist_ok=True)
    for logo in logos:
        png_p = os.path.join('frontend/public/assets', f"{logo}.png")
        svg_p = os.path.join(target_dir, f"{logo}.svg")
        if os.path.exists(png_p):
            png_to_svg(png_p, svg_p)
