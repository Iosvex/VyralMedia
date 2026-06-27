import os
from PIL import Image

def remove_background():
    img_path = "logo.jpeg"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found.")
        return
        
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Detect black and very dark gray background pixels (RGB < 35)
        if item[0] < 35 and item[1] < 35 and item[2] < 35:
            new_data.append((0, 0, 0, 0)) # Transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    output_path = "logo.png"
    img.save(output_path, "PNG")
    print(f"Success: Background removed and saved as {output_path}")

if __name__ == "__main__":
    remove_background()
