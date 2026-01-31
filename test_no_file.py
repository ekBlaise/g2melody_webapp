#!/usr/bin/env python3
"""
Test no file provided scenario
"""

import requests

BASE_URL = "https://music-admin-5.preview.emergentagent.com/api"

def test_no_file():
    """Test no file provided"""
    print("Testing no file provided...")
    
    try:
        # Send empty form data
        response = requests.post(f"{BASE_URL}/upload", data={})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")

def test_no_file_multipart():
    """Test no file provided with proper multipart"""
    print("Testing no file provided with multipart...")
    
    try:
        # Send empty files dict
        response = requests.post(f"{BASE_URL}/upload", files={'notfile': ('', '')})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    test_no_file()
    test_no_file_multipart()