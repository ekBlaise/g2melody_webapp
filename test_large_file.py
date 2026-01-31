#!/usr/bin/env python3
"""
Create a definitely large file over 2MB
"""

import requests
import io

BASE_URL = "https://music-admin-5.preview.emergentagent.com/api"

def create_large_file():
    """Create a file definitely over 2MB"""
    # Create 3MB of data
    size_bytes = 3 * 1024 * 1024  # 3MB
    data = b'A' * size_bytes
    
    print(f"Created file size: {len(data) / (1024 * 1024):.2f} MB ({len(data)} bytes)")
    
    return io.BytesIO(data)

def test_large_file():
    """Test large file upload"""
    print("Testing large file upload...")
    
    try:
        large_file = create_large_file()
        files = {'file': ('large.jpg', large_file, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    test_large_file()