from PIL import Image
import colorsys

img_path = r'C:\Users\ghisy\.gemini\antigravity-ide\brain\435e5d4b-69b2-44ea-a43b-b1dfdc1c2ba9\hero_illustration_sage_1785493122820.png'
dest_path = r'c:\Users\ghisy\Downloads\idm_web\frontend\public\assets\hero_illustration.png'

img = Image.open(img_path).convert('RGBA')
pixels = img.load()
width, height = img.size

for x in range(width):
    for y in range(height):
        r, g, b, a = pixels[x, y]
        
        # 1. Remove white background pixels
        if r > 238 and g > 238 and b > 238:
            pixels[x, y] = (255, 255, 255, 0)
            continue

        # 2. Recolor any remaining blueish tones to soft sage green
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        is_blue = (0.42 <= h <= 0.75 and s > 0.08) or (b > r + 15 and b > 40)
        
        if is_blue:
            new_h = 0.36
            new_s = max(0.15, min(0.65, s * 0.75))
            new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)

img.save(dest_path, 'PNG')
print("Successfully processed sage illustration and saved to hero_illustration.png!")
