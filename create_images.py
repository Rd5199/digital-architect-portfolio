import os
import base64
import random

# Create directory if it doesn't exist
os.makedirs('assets/images', exist_ok=True)

# Function to create simple SVG-based placeholder images
def create_svg_image(width, height, bg_color, text="", overlay=None):
    # Generate a simple SVG with the given parameters
    svg = f"""<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="{bg_color}"/>
    """
    
    # Add random stars for space-like backgrounds
    if overlay == "stars":
        for _ in range(200):
            x = random.randint(0, width)
            y = random.randint(0, height)
            r = random.uniform(0.5, 2)
            opacity = random.uniform(0.3, 1.0)
            svg += f'<circle cx="{x}" cy="{y}" r="{r}" fill="white" opacity="{opacity}" />\n'
    
    # Add a label
    if text:
        svg += f"""<text x="50%" y="50%" font-family="Arial" font-size="30" 
                  text-anchor="middle" fill="white">{text}</text>"""
    
    svg += "</svg>"
    return svg

# Function to save SVG to file
def save_svg_to_file(svg_data, filename):
    with open(filename, 'w') as f:
        f.write(svg_data)
    print(f"Created {filename}")

# Create preview images for models
preview_images = {
    'satellite': {'color': '#1E3264', 'text': 'Satellite Model'},
    'planet': {'color': '#32641E', 'text': 'Planet Model'},
    'spaceship': {'color': '#641E32', 'text': 'Spaceship Model'}
}

for name, props in preview_images.items():
    svg = create_svg_image(600, 400, props['color'], props['text'])
    save_svg_to_file(svg, f'assets/images/{name}-preview.svg')

# Create background images
backgrounds = {
    'space-bg': {'color': '#050519', 'overlay': 'stars'},
    'space-bg2': {'color': '#0A0A28', 'overlay': 'stars'}
}

for name, props in backgrounds.items():
    svg = create_svg_image(1920, 1080, props['color'], "", props['overlay'])
    save_svg_to_file(svg, f'assets/images/{name}.svg')

# Create logo images
logos = {
    'logo-light': {'color': '#000033', 'text': 'COSMIC WEB', 'width': 200, 'height': 80},
    'logo-dark': {'color': '#E0E0FF', 'text': 'COSMIC WEB', 'width': 200, 'height': 80}
}

for name, props in logos.items():
    svg = create_svg_image(props['width'], props['height'], props['color'], props['text'])
    # Save as both SVG and PNG (using SVG for simplicity here)
    save_svg_to_file(svg, f'assets/images/{name}.svg')
    # For PNG, we'll just use SVG since this is a placeholder script
    save_svg_to_file(svg, f'assets/images/{name}.png')

print("All placeholder images created successfully!")

# Create HTML file that embeds these images for reference
with open('placeholder-images.html', 'w') as f:
    f.write("""<!DOCTYPE html>
<html>
<head>
    <title>Placeholder Images</title>
    <style>
        body { background: #111; color: white; font-family: Arial; padding: 20px; }
        .image-card { margin-bottom: 20px; border: 1px solid #333; padding: 10px; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>Placeholder Images</h1>
""")
    
    for name in preview_images:
        f.write(f"""
    <div class="image-card">
        <h2>{name}-preview.svg</h2>
        <img src="assets/images/{name}-preview.svg" alt="{name} preview">
    </div>
""")
    
    for name in backgrounds:
        f.write(f"""
    <div class="image-card">
        <h2>{name}.svg</h2>
        <img src="assets/images/{name}.svg" alt="{name}">
    </div>
""")
    
    for name in logos:
        f.write(f"""
    <div class="image-card">
        <h2>{name}.svg / {name}.png</h2>
        <img src="assets/images/{name}.svg" alt="{name}">
    </div>
""")
    
    f.write("""
</body>
</html>
""")

print("Created placeholder-images.html for reference") 