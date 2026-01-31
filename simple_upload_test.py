#!/usr/bin/env python3
"""
Simple upload test to debug the issue
"""

import requests
import io
from PIL import Image

BASE_URL = "https://music-admin-5.preview.emergentagent.com/api"

def create_small_image():
    """Create a small test image"""
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG', quality=50)
    img_bytes.seek(0)
    return img_bytes

def test_simple_upload():
    """Test simple upload"""
    print("Testing simple file upload...")
    
    try:
        # Create a small image
        test_image = create_small_image()
        
        # Prepare the file for upload
        files = {'file': ('test.jpg', test_image, 'image/jpeg')}
        
        print(f"Uploading to: {BASE_URL}/upload")
        print(f"File size: {test_image.getbuffer().nbytes} bytes")
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: {data}")
        else:
            print(f"❌ FAILED")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    test_simple_upload()