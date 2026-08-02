from PIL import Image
import colorsys

img_path = r'c:\Users\ghisy\Downloads\idm_web\frontend\public\assets\hero_illustration.png'
img = Image.open(img_path).convert('RGBA')

pixels = img.load()
width, height = img.size

for x in range(width):
    for y in range(height):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        
        # Convert RGB (0..1) to HSV
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        
        # Detect ALL blue/cyan/indigo hues or pixels where blue is dominant
        is_blue = (0.42 <= h <= 0.75 and s > 0.08) or (b > r + 15 and b > 40)
        
        if is_blue:
            # Target sage green hue (around 0.36 in colorsys HSV, which corresponds to 130 deg green)
            new_h = 0.36
            # Adjust saturation: soft warm sage green
            new_s = max(0.15, min(0.65, s * 0.75))
            
            # Reconvert to RGB
            new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)

img.save(img_path, 'PNG')
print("Successfully recolored ALL blue elements (navy blazer, blue screen, blue circles) to soft sage green!")
