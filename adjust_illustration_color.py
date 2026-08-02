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
        
        # Check if the color is cyan/blue/lightblue (hue roughly 0.48 to 0.65)
        if 0.45 <= h <= 0.65 and s > 0.15:
            # Shift hue to sage green (around 0.28 to 0.38)
            new_h = 0.36
            # Adjust saturation to be soft sage
            new_s = max(0.12, s * 0.7)
            # Reconvert to RGB
            new_r, new_g, new_b = colorsys.hsv_to_rgb(new_h, new_s, v)
            pixels[x, y] = (int(new_r * 255), int(new_g * 255), int(new_b * 255), a)

img.save(img_path, 'PNG')
print("Successfully recolored blue elements in hero_illustration.png to soft sage green!")
