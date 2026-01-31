#!/usr/bin/env python3
"""
G2 Melody Backend API Testing Script
Tests file upload and project CRUD operations
"""

import requests
import json
import io
import os
from PIL import Image
import tempfile

# Configuration
BASE_URL = "https://music-admin-5.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

def create_test_image(size_mb=1, format='JPEG'):
    """Create a test image of specified size in MB"""
    # Calculate dimensions for target file size
    # Rough estimate: 1MB ≈ 1000x1000 pixels for JPEG
    if size_mb <= 0.1:
        width, height = 300, 300
    elif size_mb <= 0.5:
        width, height = 500, 500
    elif size_mb <= 1:
        width, height = 800, 800
    elif size_mb <= 2:
        width, height = 1200, 1200
    else:
        width, height = 2000, 2000
    
    # Create image
    img = Image.new('RGB', (width, height), color='red')
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format=format, quality=95)
    img_bytes.seek(0)
    
    return img_bytes

def test_file_upload_api():
    """Test POST /api/upload endpoint"""
    print("\n" + "="*60)
    print("TESTING FILE UPLOAD API")
    print("="*60)
    
    # Test 1: Valid image upload (JPEG, under 2MB)
    print("\n1. Testing valid JPEG upload (under 2MB)...")
    try:
        test_image = create_test_image(1, 'JPEG')
        files = {'file': ('test.jpg', test_image, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: File uploaded successfully")
            print(f"   URL: {data.get('url')}")
            print(f"   Filename: {data.get('filename')}")
            print(f"   Size: {data.get('size')} bytes")
            return data.get('url')  # Return URL for later use
        else:
            print(f"❌ FAILED: {response.text}")
            return None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None
    
    # Test 2: File too large (over 2MB)
    print("\n2. Testing file size limit (over 2MB)...")
    try:
        large_image = create_test_image(3, 'JPEG')  # 3MB image
        files = {'file': ('large.jpg', large_image, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            if "File too large. Maximum size is 2MB." in data.get('error', ''):
                print(f"✅ SUCCESS: Correctly rejected large file")
                print(f"   Error: {data.get('error')}")
            else:
                print(f"❌ FAILED: Wrong error message: {data.get('error')}")
        else:
            print(f"❌ FAILED: Should have returned 400, got {response.status_code}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 3: Invalid file type
    print("\n3. Testing invalid file type...")
    try:
        # Create a text file
        text_content = "This is not an image file"
        files = {'file': ('test.txt', io.StringIO(text_content), 'text/plain')}
        
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
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 4: No file provided
    print("\n4. Testing no file provided...")
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
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
    
    # Test 5: Valid PNG upload
    print("\n5. Testing valid PNG upload...")
    try:
        test_image = create_test_image(0.5, 'PNG')
        files = {'file': ('test.png', test_image, 'image/png')}
        
        response = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: PNG uploaded successfully")
            print(f"   URL: {data.get('url')}")
            print(f"   Size: {data.get('size')} bytes")
        else:
            print(f"❌ FAILED: {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def test_projects_crud():
    """Test project CRUD operations"""
    print("\n" + "="*60)
    print("TESTING PROJECT CRUD OPERATIONS")
    print("="*60)
    
    # First, get existing projects to find one to update/delete
    print("\n1. Getting existing projects...")
    try:
        response = requests.get(f"{BASE_URL}/projects")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            projects = response.json()
            print(f"✅ SUCCESS: Retrieved {len(projects)} projects")
            
            if len(projects) > 0:
                existing_project_id = projects[0]['id']
                print(f"   Using project ID for testing: {existing_project_id}")
                return existing_project_id
            else:
                print("   No existing projects found, will create one first")
                return None
        else:
            print(f"❌ FAILED: {response.text}")
            return None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None

def test_project_update(project_id):
    """Test PUT /api/projects/:id"""
    print(f"\n2. Testing project update (PUT /api/projects/{project_id})...")
    
    try:
        # Update project data
        update_data = {
            "title": "Updated Test Project",
            "description": "This project has been updated via API testing",
            "goalAmount": 150000,
            "status": "ACTIVE"
        }
        
        response = requests.put(
            f"{BASE_URL}/projects/{project_id}",
            headers=HEADERS,
            data=json.dumps(update_data)
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_project = response.json()
            print(f"✅ SUCCESS: Project updated successfully")
            print(f"   New Title: {updated_project.get('title')}")
            print(f"   New Description: {updated_project.get('description')}")
            print(f"   New Goal Amount: {updated_project.get('goalAmount')}")
            
            # Verify the update by fetching the project
            verify_response = requests.get(f"{BASE_URL}/projects/{project_id}")
            if verify_response.status_code == 200:
                verified_project = verify_response.json()
                if verified_project.get('title') == update_data['title']:
                    print(f"✅ VERIFIED: Update persisted correctly")
                else:
                    print(f"❌ VERIFICATION FAILED: Title not updated")
            
            return True
        else:
            print(f"❌ FAILED: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_project_creation_and_deletion():
    """Test creating a project and then deleting it"""
    print("\n3. Testing project creation and deletion...")
    
    # Create a test project
    try:
        project_data = {
            "title": "Test Project for Deletion",
            "description": "This project will be created and then deleted",
            "goalAmount": 100000,
            "status": "DRAFT",
            "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
        }
        
        # Create project
        response = requests.post(
            f"{BASE_URL}/projects",
            headers=HEADERS,
            data=json.dumps(project_data)
        )
        print(f"Create Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_project = response.json()
            project_id = created_project.get('id')
            print(f"✅ SUCCESS: Project created successfully")
            print(f"   Project ID: {project_id}")
            print(f"   Title: {created_project.get('title')}")
            
            # Now delete the project
            print(f"\n4. Testing project deletion (DELETE /api/projects/{project_id})...")
            delete_response = requests.delete(f"{BASE_URL}/projects/{project_id}")
            print(f"Delete Status Code: {delete_response.status_code}")
            
            if delete_response.status_code == 200:
                delete_data = delete_response.json()
                print(f"✅ SUCCESS: Project deleted successfully")
                print(f"   Response: {delete_data}")
                
                # Verify deletion by trying to fetch the project
                verify_response = requests.get(f"{BASE_URL}/projects/{project_id}")
                if verify_response.status_code == 404:
                    print(f"✅ VERIFIED: Project no longer exists")
                    return True
                else:
                    print(f"❌ VERIFICATION FAILED: Project still exists")
                    return False
            else:
                print(f"❌ DELETE FAILED: {delete_response.text}")
                return False
        else:
            print(f"❌ CREATE FAILED: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def main():
    """Main testing function"""
    print("G2 MELODY BACKEND API TESTING")
    print("Testing File Upload and Project CRUD APIs")
    print(f"Base URL: {BASE_URL}")
    
    # Test file upload API
    uploaded_url = test_file_upload_api()
    
    # Test project CRUD operations
    existing_project_id = test_projects_crud()
    
    if existing_project_id:
        test_project_update(existing_project_id)
    
    # Test project creation and deletion
    test_project_creation_and_deletion()
    
    print("\n" + "="*60)
    print("TESTING COMPLETED")
    print("="*60)

if __name__ == "__main__":
    main()