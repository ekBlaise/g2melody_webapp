#!/usr/bin/env python3
"""
Debug file size issue
"""

import requests
import io
from PIL import Image

BASE_URL = "https://music-admin-5.preview.emergentagent.com/api"

def create_large_image():
    """Create a definitely large image over 2MB"""
    # Create a very large image that should definitely be over 2MB
    img = Image.new('RGB', (2000, 2000), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG', quality=100)  # Maximum quality
    img_bytes.seek(0)
    
    size_mb = img_bytes.getbuffer().nbytes / (1024 * 1024)
    print(f"Created image size: {size_mb:.2f} MB ({img_bytes.getbuffer().nbytes} bytes)")
    
    return img_bytes

def test_large_file():
    """Test large file upload"""
    print("Testing large file upload...")
    
    try:
        large_image = create_large_image()
        files = {'file': ('large.jpg', large_image, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    test_large_file()