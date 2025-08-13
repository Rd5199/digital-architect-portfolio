from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('assets/images', exist_ok=True)

# Image sizes
card_size = (600, 400)
bg_size = (1920, 1080)

# Create placeholder images for showcase cards
def create_card_image(name, color):
    img = Image.new('RGB', card_size, color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a system font, or use default if not available
    try:
        font = ImageFont.truetype("Arial", 40)
    except IOError:
        font = ImageFont.load_default()
    
    # Draw text
    text = f"{name.capitalize()} Model"
    text_width = draw.textlength(text, font=font)
    draw.text(
        ((card_size[0] - text_width) // 2, card_size[1] // 2),
        text,
        fill="white",
        font=font
    )
    
    # Save the image
    img.save(f'assets/images/{name}-preview.jpg')
    print(f"Created {name} preview image")

# Create background images
def create_bg_image(name, color):
    img = Image.new('RGB', bg_size, color)
    draw = ImageDraw.Draw(img)
    
    # Add some stars (white dots)
    for _ in range(200):
        x = int(random.random() * bg_size[0])
        y = int(random.random() * bg_size[1])
        size = int(random.random() * 3) + 1
        draw.ellipse((x, y, x+size, y+size), fill="white")
    
    # Save the image
    img.save(f'assets/images/{name}.jpg')
    print(f"Created {name} background image")

# Generate images
try:
    import random
    
    # Create card preview images
    create_card_image('satellite', (30, 50, 100))
    create_card_image('planet', (50, 30, 100))
    create_card_image('spaceship', (100, 30, 80))
    
    # Create background images
    create_bg_image('space-bg', (5, 5, 30))
    create_bg_image('space-bg2', (10, 10, 40))
    
    print("All placeholder images created successfully!")
except Exception as e:
    print(f"Error creating placeholder images: {e}") 