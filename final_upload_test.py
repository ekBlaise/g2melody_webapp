#!/usr/bin/env python3
"""
Final Comprehensive File Upload API Testing
Tests all validation scenarios as requested with proper file sizes
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

def create_large_file():
    """Create a file definitely over 2MB"""
    size_bytes = 3 * 1024 * 1024  # 3MB
    data = b'A' * size_bytes
    return io.BytesIO(data)

def test_final_comprehensive_upload():
    """Test all upload scenarios as specified in the requirements"""
    print("FINAL COMPREHENSIVE FILE UPLOAD API TESTING")
    print("="*60)
    
    test_results = []
    
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
                test_results.append("✅ JPEG upload")
            else:
                print(f"❌ FAILED: Missing required fields in response")
                test_results.append("❌ JPEG upload - missing fields")
        else:
            print(f"❌ FAILED: {response.text}")
            test_results.append("❌ JPEG upload")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ JPEG upload - error")
    
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
            test_results.append("✅ PNG upload")
        else:
            print(f"❌ FAILED: {response.text}")
            test_results.append("❌ PNG upload")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ PNG upload - error")
    
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
            test_results.append("✅ GIF upload")
        else:
            print(f"❌ FAILED: {response.text}")
            test_results.append("❌ GIF upload")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ GIF upload - error")
    
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
            test_results.append("✅ WebP upload")
        else:
            print(f"❌ FAILED: {response.text}")
            test_results.append("❌ WebP upload")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ WebP upload - error")
    
    # Test 5: File too large (over 2MB) - SHOULD FAIL
    print("\n5. Testing file size limit (over 2MB) - should reject...")
    try:
        large_file = create_large_file()
        files = {'file': ('large.jpg', large_file, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            expected_error = "File too large. Maximum size is 2MB."
            if expected_error in data.get('error', ''):
                print(f"✅ SUCCESS: Correctly rejected large file")
                print(f"   Error: {data.get('error')}")
                test_results.append("✅ File size validation")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
                print(f"   Expected: {expected_error}")
                test_results.append("❌ File size validation - wrong message")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
            print(f"   Response: {response.text}")
            test_results.append("❌ File size validation - wrong status")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ File size validation - error")
    
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
                test_results.append("✅ File type validation")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
                test_results.append("❌ File type validation - wrong message")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
            print(f"   Response: {response.text}")
            test_results.append("❌ File type validation - wrong status")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ File type validation - error")
    
    # Test 7: No file provided - SHOULD FAIL
    print("\n7. Testing no file provided - should reject...")
    try:
        response = requests.post(f"{BASE_URL}/upload", files={'notfile': ('', '')})
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            if "No file provided" in data.get('error', ''):
                print(f"✅ SUCCESS: Correctly rejected empty request")
                print(f"   Error: {data.get('error')}")
                test_results.append("✅ No file validation")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
                test_results.append("❌ No file validation - wrong message")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
            print(f"   Response: {response.text}")
            test_results.append("❌ No file validation - wrong status")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        test_results.append("❌ No file validation - error")
    
    # Summary
    print("\n" + "="*60)
    print("UPLOAD API TEST SUMMARY")
    print("="*60)
    for result in test_results:
        print(result)
    
    success_count = len([r for r in test_results if r.startswith("✅")])
    total_count = len(test_results)
    print(f"\nOverall: {success_count}/{total_count} tests passed")

if __name__ == "__main__":
    test_final_comprehensive_upload()