#!/usr/bin/env python3
"""
G2 Melody Music Platform Backend API Tests
Testing new Site Settings API and existing APIs
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://g2melody.preview.emergentagent.com/api"

# Test credentials
ADMIN_EMAIL = "admin@g2melody.com"
ADMIN_PASSWORD = "admin123"

class G2MelodyAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
    def test_site_settings_get(self):
        """Test GET /api/settings - Should return site settings"""
        try:
            response = self.session.get(f"{self.base_url}/settings")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ['memberCount', 'studentsCount', 'programsCount', 'yearsActive']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("GET /api/settings", False, f"Missing required fields: {missing_fields}", data)
                else:
                    self.log_test("GET /api/settings", True, f"Retrieved settings: memberCount={data.get('memberCount')}, studentsCount={data.get('studentsCount')}, programsCount={data.get('programsCount')}, yearsActive={data.get('yearsActive')}", data)
                    return data
            else:
                self.log_test("GET /api/settings", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/settings", False, f"Exception: {str(e)}")
            
        return None
        
    def test_site_settings_update(self):
        """Test PUT /api/admin/settings - Should update site settings"""
        try:
            # Test data - updating memberCount to 75 as requested
            update_data = {
                "memberCount": 75,
                "studentsCount": 120,
                "programsCount": 8,
                "yearsActive": 10,
                "albumDescription": "Updated description for testing"
            }
            
            response = self.session.put(
                f"{self.base_url}/admin/settings",
                json=update_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify the update worked
                if data.get('memberCount') == 75:
                    self.log_test("PUT /api/admin/settings", True, f"Successfully updated memberCount to 75. Full response: {data}", data)
                    return data
                else:
                    self.log_test("PUT /api/admin/settings", False, f"memberCount not updated correctly. Expected 75, got {data.get('memberCount')}", data)
            else:
                self.log_test("PUT /api/admin/settings", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("PUT /api/admin/settings", False, f"Exception: {str(e)}")
            
        return None
        
    def test_projects_api(self):
        """Test GET /api/projects - Should return all projects"""
        try:
            response = self.session.get(f"{self.base_url}/projects")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/projects", True, f"Retrieved {len(data)} projects")
                    return data
                else:
                    self.log_test("GET /api/projects", False, f"Expected list, got {type(data)}")
            else:
                self.log_test("GET /api/projects", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/projects", False, f"Exception: {str(e)}")
            
        return None
        
    def test_donations_api(self):
        """Test POST /api/donations - Should create donation and update project amount"""
        try:
            # First get a project to donate to
            projects = self.test_projects_api()
            if not projects:
                self.log_test("POST /api/donations", False, "No projects available for donation test")
                return None
                
            project = projects[0]
            original_amount = project.get('currentAmount', 0)
            
            donation_data = {
                "amount": 5000,
                "currency": "XAF",
                "donorName": "Test Donor",
                "donorEmail": "testdonor@example.com",
                "message": "Test donation for API testing",
                "anonymous": False,
                "projectId": project['id'],
                "paymentMethod": "card"
            }
            
            response = self.session.post(
                f"{self.base_url}/donations",
                json=donation_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify donation was created
                if data.get('amount') == 5000 and data.get('projectId') == project['id']:
                    # Check if project amount was updated
                    updated_projects = self.test_projects_api()
                    if updated_projects:
                        updated_project = next((p for p in updated_projects if p['id'] == project['id']), None)
                        if updated_project and updated_project.get('currentAmount') == original_amount + 5000:
                            self.log_test("POST /api/donations", True, f"Donation created and project amount updated from {original_amount} to {updated_project.get('currentAmount')}")
                            return data
                        else:
                            self.log_test("POST /api/donations", False, f"Project amount not updated correctly")
                    else:
                        self.log_test("POST /api/donations", False, "Could not verify project amount update")
                else:
                    self.log_test("POST /api/donations", False, f"Donation data incorrect: {data}")
            else:
                self.log_test("POST /api/donations", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("POST /api/donations", False, f"Exception: {str(e)}")
            
        return None
        
    def test_admin_stats_api(self):
        """Test GET /api/admin/stats - Should return admin statistics"""
        try:
            response = self.session.get(f"{self.base_url}/admin/stats")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ['donations', 'purchases', 'users', 'members', 'projects', 'recentDonations']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("GET /api/admin/stats", False, f"Missing required fields: {missing_fields}")
                else:
                    donations_total = data['donations'].get('total', 0)
                    donations_count = data['donations'].get('count', 0)
                    users_count = data.get('users', 0)
                    self.log_test("GET /api/admin/stats", True, f"Stats retrieved: {donations_count} donations totaling {donations_total} XAF, {users_count} users")
                    return data
            else:
                self.log_test("GET /api/admin/stats", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/admin/stats", False, f"Exception: {str(e)}")
            
        return None
        
    def test_admin_users_api(self):
        """Test GET /api/admin/users - Should return user list"""
        try:
            response = self.session.get(f"{self.base_url}/admin/users")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    admin_users = [u for u in data if u.get('role') == 'ADMIN']
                    self.log_test("GET /api/admin/users", True, f"Retrieved {len(data)} users, {len(admin_users)} admins")
                    return data
                else:
                    self.log_test("GET /api/admin/users", False, f"Expected list, got {type(data)}")
            else:
                self.log_test("GET /api/admin/users", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/admin/users", False, f"Exception: {str(e)}")
            
        return None
        
    def test_create_project_api(self):
        """Test POST /api/projects - Should create new project"""
        try:
            project_data = {
                "title": "Test Project API",
                "description": "A test project created via API testing",
                "image": "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg",
                "goalAmount": 1000000,
                "status": "CURRENT",
                "deadline": "2025-12-31"
            }
            
            response = self.session.post(
                f"{self.base_url}/projects",
                json=project_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('title') == "Test Project API" and data.get('goalAmount') == 1000000:
                    self.log_test("POST /api/projects", True, f"Project created with ID: {data.get('id')}")
                    return data
                else:
                    self.log_test("POST /api/projects", False, f"Project data incorrect: {data}")
            else:
                self.log_test("POST /api/projects", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("POST /api/projects", False, f"Exception: {str(e)}")
            
        return None
        
    def test_create_music_api(self):
        """Test POST /api/music - Should create new music track"""
        try:
            music_data = {
                "title": "Test Track API",
                "artist": "G2 Melody Test",
                "album": "API Test Album",
                "genre": "Gospel",
                "duration": 180,
                "price": 500,
                "currency": "XAF",
                "coverImage": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
                "isHymn": False
            }
            
            response = self.session.post(
                f"{self.base_url}/music",
                json=music_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('title') == "Test Track API" and data.get('price') == 500:
                    self.log_test("POST /api/music", True, f"Music track created with ID: {data.get('id')}")
                    return data
                else:
                    self.log_test("POST /api/music", False, f"Music data incorrect: {data}")
            else:
                self.log_test("POST /api/music", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("POST /api/music", False, f"Exception: {str(e)}")
            
        return None
        
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 80)
        print("G2 MELODY MUSIC PLATFORM - BACKEND API TESTS")
        print("=" * 80)
        print(f"Testing against: {self.base_url}")
        print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test new Site Settings API (main focus)
        print("🎯 TESTING NEW SITE SETTINGS API")
        print("-" * 40)
        original_settings = self.test_site_settings_get()
        updated_settings = self.test_site_settings_update()
        
        # Verify the update persisted
        if updated_settings:
            print("\n🔄 Verifying settings update persisted...")
            current_settings = self.test_site_settings_get()
            if current_settings and current_settings.get('memberCount') == 75:
                self.log_test("Settings Persistence", True, "memberCount update persisted correctly")
            else:
                self.log_test("Settings Persistence", False, "memberCount update did not persist")
        
        print("\n🔍 TESTING EXISTING APIs (SANITY CHECK)")
        print("-" * 40)
        
        # Test existing APIs
        self.test_projects_api()
        self.test_donations_api()
        self.test_admin_stats_api()
        self.test_admin_users_api()
        self.test_create_project_api()
        self.test_create_music_api()
        
        # Summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return passed == total

if __name__ == "__main__":
    tester = G2MelodyAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)