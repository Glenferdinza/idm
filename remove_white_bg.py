from PIL import Image
import os

img_path = r'c:\Users\ghisy\Downloads\idm_web\frontend\public\assets\hero_illustration.png'
img = Image.open(img_path).convert('RGBA')

datas = img.getdata()
new_data = []

# Replace near-white background pixels with transparent
for item in datas:
    r, g, b, a = item
    if r > 240 and g > 240 and b > 240:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save(img_path, 'PNG')
print("Successfully converted hero_illustration.png to transparent PNG!")
