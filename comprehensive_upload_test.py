#!/usr/bin/env python3
"""
Comprehensive File Upload API Testing
Tests all validation scenarios as requested
"""

import requests
import json
import io
from PIL import Image

BASE_URL = "https://music-admin-5.preview.emergentagent.com/api"

def create_test_image(size_mb=1, format='JPEG'):
    """Create a test image of specified size in MB"""
    if size_mb <= 0.1:
        width, height = 200, 200
    elif size_mb <= 0.5:
        width, height = 400, 400
    elif size_mb <= 1:
        width, height = 600, 600
    elif size_mb <= 2:
        width, height = 1000, 1000
    else:
        width, height = 1500, 1500
    
    img = Image.new('RGB', (width, height), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format=format, quality=95)
    img_bytes.seek(0)
    
    return img_bytes

def test_comprehensive_upload():
    """Test all upload scenarios as specified in the requirements"""
    print("COMPREHENSIVE FILE UPLOAD API TESTING")
    print("="*60)
    
    # Test 1: Valid JPEG upload (under 2MB)
    print("\n1. Testing valid JPEG upload (under 2MB)...")
    try:
        test_image = create_test_image(1, 'JPEG')
        files = {'file': ('test.jpg', test_image, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: JPEG uploaded successfully")
            print(f"   URL: {data.get('url')}")
            print(f"   Filename: {data.get('filename')}")
            print(f"   Size: {data.get('size')} bytes")
            
            # Verify response structure
            if all(key in data for key in ['url', 'filename', 'size']):
                print(f"✅ VERIFIED: Response contains required fields (url, filename, size)")
            else:
                print(f"❌ FAILED: Missing required fields in response")
        else:
            print(f"❌ FAILED: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 2: Valid PNG upload
    print("\n2. Testing valid PNG upload...")
    try:
        test_image = create_test_image(0.5, 'PNG')
        files = {'file': ('test.png', test_image, 'image/png')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: PNG uploaded successfully")
            print(f"   Size: {data.get('size')} bytes")
        else:
            print(f"❌ FAILED: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 3: Valid GIF upload
    print("\n3. Testing valid GIF upload...")
    try:
        test_image = create_test_image(0.3, 'GIF')
        files = {'file': ('test.gif', test_image, 'image/gif')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: GIF uploaded successfully")
            print(f"   Size: {data.get('size')} bytes")
        else:
            print(f"❌ FAILED: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 4: Valid WebP upload
    print("\n4. Testing valid WebP upload...")
    try:
        test_image = create_test_image(0.4, 'WEBP')
        files = {'file': ('test.webp', test_image, 'image/webp')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: WebP uploaded successfully")
            print(f"   Size: {data.get('size')} bytes")
        else:
            print(f"❌ FAILED: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 5: File too large (over 2MB) - SHOULD FAIL
    print("\n5. Testing file size limit (over 2MB) - should reject...")
    try:
        large_image = create_test_image(3, 'JPEG')  # 3MB image
        files = {'file': ('large.jpg', large_image, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            expected_error = "File too large. Maximum size is 2MB."
            if expected_error in data.get('error', ''):
                print(f"✅ SUCCESS: Correctly rejected large file")
                print(f"   Error: {data.get('error')}")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
                print(f"   Expected: {expected_error}")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 6: Invalid file type - SHOULD FAIL
    print("\n6. Testing invalid file type (text file) - should reject...")
    try:
        text_content = b"This is not an image file"
        files = {'file': ('test.txt', io.BytesIO(text_content), 'text/plain')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            if "Invalid file type" in data.get('error', ''):
                print(f"✅ SUCCESS: Correctly rejected invalid file type")
                print(f"   Error: {data.get('error')}")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 7: No file provided - SHOULD FAIL
    print("\n7. Testing no file provided - should reject...")
    try:
        response = requests.post(f"{BASE_URL}/upload", files={})
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            if "No file provided" in data.get('error', ''):
                print(f"✅ SUCCESS: Correctly rejected empty request")
                print(f"   Error: {data.get('error')}")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    test_comprehensive_upload()