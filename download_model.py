import urllib.request
import os
import time
import random

# Create directories if they don't exist
os.makedirs('assets/models', exist_ok=True)
os.makedirs('assets/images', exist_ok=True)

# NASA model URLs (these are direct download links to NASA models)
nasa_model_urls = {
    'space_satellite': 'https://nasa3d.arc.nasa.gov/shared_assets/models/satellit-3d/satellit-3d.glb',
    'deep_space_skybox': 'https://nasa3d.arc.nasa.gov/shared_assets/models/skybox-deep-space/skybox-deep-space.glb',
    'space_station': 'https://science.nasa.gov/wp-content/uploads/2019/04/ISS_stationary_Low.glb',
    'hubble': 'https://science.nasa.gov/wp-content/uploads/2019/04/HST_2013.glb',
    'mars_rover': 'https://nasa3d.arc.nasa.gov/shared_assets/models/mars-rover-curiosity/mars-rover-curiosity.glb'
}

# Placeholder backup URLs in case NASA URLs don't work
backup_model_urls = {
    'space_satellite': 'https://cdn.glitch.global/3a5b23db-5fcb-4cdc-8b1c-d4e09d6e6221/satellite.glb',
    'deep_space_skybox': 'https://cdn.glitch.global/3a5b23db-5fcb-4cdc-8b1c-d4e09d6e6221/skybox.glb',
    'space_station': 'https://cdn.glitch.global/3a5b23db-5fcb-4cdc-8b1c-d4e09d6e6221/iss.glb',
    'mars_rover': 'https://cdn.glitch.global/3a5b23db-5fcb-4cdc-8b1c-d4e09d6e6221/rover.glb'
}

print("Starting download of NASA 3D models...")

# Function to create a placeholder GLB file with text content
def create_placeholder_glb(filepath, model_name):
    with open(filepath, 'w') as f:
        f.write(f"""<!-- This is a placeholder for a GLB file -->
<!-- In reality, GLB files are binary and cannot be edited as text -->
<!-- This file serves as a placeholder for our 3D showcase demo -->

This is a placeholder for the {model_name} file.
Since GLB files are binary 3D model files, a real GLB file can't be created with text.
The application will fall back to creating a simple 3D model programmatically when it can't load this file.
""")
    print(f"Created placeholder file for {model_name}")

# Download NASA models with fallback to backup URLs and placeholders
for name, url in nasa_model_urls.items():
    print(f"Downloading {name} model from NASA...")
    try:
        # Add a User-Agent header to avoid being blocked
        req = urllib.request.Request(
            url,
            data=None,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
            }
        )
        
        # Download with a timeout
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read()
            
        with open(f'assets/models/{name}.glb', 'wb') as f:
            f.write(data)
            
        print(f"Downloaded {name} model successfully!")
        
        # Add a small delay between downloads to be nice to NASA's servers
        time.sleep(random.uniform(1.0, 2.0))
        
    except Exception as e:
        print(f"Failed to download {name} model from NASA: {e}")
        
        # Try backup URL
        if name in backup_model_urls:
            try:
                print(f"Trying backup URL for {name}...")
                urllib.request.urlretrieve(backup_model_urls[name], f'assets/models/{name}.glb')
                print(f"Downloaded {name} model from backup successfully!")
            except Exception as backup_e:
                print(f"Failed to download {name} from backup: {backup_e}")
                # Create placeholder file as last resort
                create_placeholder_glb(f'assets/models/{name}.glb', name)
        else:
            # Create placeholder file as last resort
            create_placeholder_glb(f'assets/models/{name}.glb', name)

# Make a copy of deep_space_skybox.glb to the old filename that script.js is referencing
try:
    # First check if the new file exists
    if os.path.exists('assets/models/deep_space_skybox.glb'):
        # Copy the file content to the old filename
        with open('assets/models/deep_space_skybox.glb', 'rb') as src:
            with open('assets/models/deep_space_skybox.glb.bak', 'wb') as dest:
                dest.write(src.read())
        print("Created backup copy of deep_space_skybox.glb")
except Exception as e:
    print(f"Failed to create backup copy: {e}")

print("NASA 3D model download process completed!") 