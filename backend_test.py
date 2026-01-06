#!/usr/bin/env python3
"""
G2 Melody Music Platform Backend API Tests
Tests all backend endpoints for the music platform
"""

import requests
import json
import uuid
from datetime import datetime, timedelta

# Base URL from environment
BASE_URL = "https://learn-melody-2.preview.emergentagent.com/api"

class G2MelodyAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_data = {}
        
    def log_test(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        print()
        
    def test_root_endpoint(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            success = response.status_code == 200 and "G2 Melody API" in response.text
            self.log_test("Root Endpoint", success, f"Status: {response.status_code}, Response: {response.json()}")
            return success
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test user registration API"""
        try:
            # Test user registration
            user_data = {
                "email": f"testuser_{uuid.uuid4().hex[:8]}@g2melody.com",
                "password": "SecurePass123!",
                "name": "Test User"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=user_data)
            success = response.status_code == 200
            
            if success:
                user_info = response.json()
                self.test_data['user'] = user_info
                self.log_test("User Registration", True, f"Created user: {user_info['email']}")
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False
    
    def test_projects_api(self):
        """Test Projects CRUD API"""
        try:
            # Test GET all projects
            response = self.session.get(f"{self.base_url}/projects")
            get_all_success = response.status_code == 200
            projects = response.json() if get_all_success else []
            self.log_test("GET /projects", get_all_success, f"Found {len(projects)} projects")
            
            # Test GET projects with status filter
            response = self.session.get(f"{self.base_url}/projects?status=CURRENT")
            filter_success = response.status_code == 200
            current_projects = response.json() if filter_success else []
            self.log_test("GET /projects?status=CURRENT", filter_success, f"Found {len(current_projects)} current projects")
            
            # Test POST create project
            project_data = {
                "title": f"Test Project {uuid.uuid4().hex[:8]}",
                "description": "This is a test project for API validation",
                "goalAmount": 1000000,
                "status": "CURRENT",
                "deadline": (datetime.now() + timedelta(days=90)).isoformat(),
                "image": "https://images.pexels.com/photos/444658/pexels-photo-444658.jpeg"
            }
            
            response = self.session.post(f"{self.base_url}/projects", json=project_data)
            create_success = response.status_code == 200
            
            if create_success:
                created_project = response.json()
                self.test_data['project'] = created_project
                self.log_test("POST /projects", True, f"Created project: {created_project['title']}")
                
                # Test GET single project
                project_id = created_project['id']
                response = self.session.get(f"{self.base_url}/projects/{project_id}")
                get_single_success = response.status_code == 200
                self.log_test("GET /projects/:id", get_single_success, f"Retrieved project: {project_id}")
                
                # Test PUT update project
                update_data = {
                    "title": f"Updated Test Project {uuid.uuid4().hex[:8]}",
                    "description": "Updated description for test project"
                }
                response = self.session.put(f"{self.base_url}/projects/{project_id}", json=update_data)
                update_success = response.status_code == 200
                self.log_test("PUT /projects/:id", update_success, f"Updated project: {project_id}")
                
                return get_all_success and filter_success and create_success and get_single_success and update_success
            else:
                self.log_test("POST /projects", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Projects API", False, f"Error: {str(e)}")
            return False
    
    def test_donations_api(self):
        """Test Donations API"""
        try:
            if 'project' not in self.test_data:
                self.log_test("Donations API", False, "No test project available")
                return False
            
            project_id = self.test_data['project']['id']
            
            # Get project current amount before donation
            response = self.session.get(f"{self.base_url}/projects/{project_id}")
            if response.status_code == 200:
                initial_amount = response.json().get('currentAmount', 0)
            else:
                initial_amount = 0
            
            # Test POST create donation
            donation_data = {
                "amount": 5000,
                "projectId": project_id,
                "donorName": "John Doe",
                "donorEmail": "john.doe@example.com",
                "message": "Supporting this great cause!",
                "anonymous": False,
                "paymentMethod": "card"
            }
            
            response = self.session.post(f"{self.base_url}/donations", json=donation_data)
            create_success = response.status_code == 200
            
            if create_success:
                donation = response.json()
                self.test_data['donation'] = donation
                self.log_test("POST /donations", True, f"Created donation: {donation['amount']} XAF")
                
                # Verify project amount was updated
                response = self.session.get(f"{self.base_url}/projects/{project_id}")
                if response.status_code == 200:
                    updated_project = response.json()
                    new_amount = updated_project.get('currentAmount', 0)
                    amount_updated = new_amount == initial_amount + 5000
                    self.log_test("Project Amount Update", amount_updated, 
                                f"Amount changed from {initial_amount} to {new_amount}")
                else:
                    self.log_test("Project Amount Update", False, "Could not verify amount update")
                
                # Test GET donations
                response = self.session.get(f"{self.base_url}/donations")
                get_all_success = response.status_code == 200
                donations = response.json() if get_all_success else []
                self.log_test("GET /donations", get_all_success, f"Found {len(donations)} donations")
                
                # Test GET donations by project
                response = self.session.get(f"{self.base_url}/donations?projectId={project_id}")
                get_by_project_success = response.status_code == 200
                project_donations = response.json() if get_by_project_success else []
                self.log_test("GET /donations?projectId", get_by_project_success, 
                            f"Found {len(project_donations)} donations for project")
                
                return create_success and get_all_success and get_by_project_success
            else:
                self.log_test("POST /donations", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Donations API", False, f"Error: {str(e)}")
            return False
    
    def test_music_api(self):
        """Test Music CRUD API"""
        try:
            # Test GET all music
            response = self.session.get(f"{self.base_url}/music")
            get_all_success = response.status_code == 200
            music_list = response.json() if get_all_success else []
            self.log_test("GET /music", get_all_success, f"Found {len(music_list)} tracks")
            
            # Test GET music with filters
            response = self.session.get(f"{self.base_url}/music?genre=Gospel")
            filter_success = response.status_code == 200
            gospel_tracks = response.json() if filter_success else []
            self.log_test("GET /music?genre=Gospel", filter_success, f"Found {len(gospel_tracks)} gospel tracks")
            
            # Test GET music with search
            response = self.session.get(f"{self.base_url}/music?search=Hallelujah")
            search_success = response.status_code == 200
            search_results = response.json() if search_success else []
            self.log_test("GET /music?search=Hallelujah", search_success, f"Found {len(search_results)} search results")
            
            # Test POST create music
            music_data = {
                "title": f"Test Song {uuid.uuid4().hex[:8]}",
                "artist": "Test Artist",
                "album": "Test Album",
                "genre": "Gospel",
                "duration": 240,
                "price": 500,
                "coverImage": "https://images.unsplash.com/photo-1652626627227-acc5ce198876",
                "isHymn": False
            }
            
            response = self.session.post(f"{self.base_url}/music", json=music_data)
            create_success = response.status_code == 200
            
            if create_success:
                created_music = response.json()
                self.test_data['music'] = created_music
                self.log_test("POST /music", True, f"Created track: {created_music['title']}")
                
                # Test GET single music
                music_id = created_music['id']
                response = self.session.get(f"{self.base_url}/music/{music_id}")
                get_single_success = response.status_code == 200
                self.log_test("GET /music/:id", get_single_success, f"Retrieved track: {music_id}")
                
                # Test PUT update music
                update_data = {
                    "title": f"Updated Test Song {uuid.uuid4().hex[:8]}",
                    "price": 750
                }
                response = self.session.put(f"{self.base_url}/music/{music_id}", json=update_data)
                update_success = response.status_code == 200
                self.log_test("PUT /music/:id", update_success, f"Updated track: {music_id}")
                
                return get_all_success and filter_success and search_success and create_success and get_single_success and update_success
            else:
                self.log_test("POST /music", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Music API", False, f"Error: {str(e)}")
            return False
    
    def test_purchases_api(self):
        """Test Purchases API"""
        try:
            if 'music' not in self.test_data:
                self.log_test("Purchases API", False, "No test music available")
                return False
            
            music_id = self.test_data['music']['id']
            
            # Test POST create purchase
            purchase_data = {
                "musicId": music_id,
                "guestEmail": "buyer@example.com",
                "paymentMethod": "card"
            }
            
            response = self.session.post(f"{self.base_url}/purchases", json=purchase_data)
            create_success = response.status_code == 200
            
            if create_success:
                purchase = response.json()
                self.test_data['purchase'] = purchase
                self.log_test("POST /purchases", True, f"Created purchase: {purchase['amount']} XAF")
                
                # Test GET purchases
                response = self.session.get(f"{self.base_url}/purchases")
                get_all_success = response.status_code == 200
                purchases = response.json() if get_all_success else []
                self.log_test("GET /purchases", get_all_success, f"Found {len(purchases)} purchases")
                
                return create_success and get_all_success
            else:
                self.log_test("POST /purchases", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Purchases API", False, f"Error: {str(e)}")
            return False
    
    def test_admin_stats_api(self):
        """Test Admin Stats API"""
        try:
            response = self.session.get(f"{self.base_url}/admin/stats")
            success = response.status_code == 200
            
            if success:
                stats = response.json()
                required_keys = ['donations', 'purchases', 'users', 'projects', 'recentDonations']
                has_all_keys = all(key in stats for key in required_keys)
                
                self.log_test("GET /admin/stats", has_all_keys, 
                            f"Stats: {stats['donations']['count']} donations, {stats['purchases']['count']} purchases, {stats['users']} users")
                return has_all_keys
            else:
                self.log_test("GET /admin/stats", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Stats API", False, f"Error: {str(e)}")
            return False
    
    def test_cleanup(self):
        """Clean up test data"""
        try:
            cleanup_success = True
            
            # Delete test project (this will cascade delete donations)
            if 'project' in self.test_data:
                project_id = self.test_data['project']['id']
                response = self.session.delete(f"{self.base_url}/projects/{project_id}")
                project_deleted = response.status_code == 200
                self.log_test("DELETE /projects/:id", project_deleted, f"Deleted project: {project_id}")
                cleanup_success = cleanup_success and project_deleted
            
            # Delete test music (this will cascade delete purchases)
            if 'music' in self.test_data:
                music_id = self.test_data['music']['id']
                response = self.session.delete(f"{self.base_url}/music/{music_id}")
                music_deleted = response.status_code == 200
                self.log_test("DELETE /music/:id", music_deleted, f"Deleted music: {music_id}")
                cleanup_success = cleanup_success and music_deleted
            
            return cleanup_success
            
        except Exception as e:
            self.log_test("Cleanup", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("G2 MELODY MUSIC PLATFORM - BACKEND API TESTS")
        print("=" * 60)
        print()
        
        test_results = {}
        
        # Run tests in order
        test_results['root'] = self.test_root_endpoint()
        test_results['registration'] = self.test_user_registration()
        test_results['projects'] = self.test_projects_api()
        test_results['donations'] = self.test_donations_api()
        test_results['music'] = self.test_music_api()
        test_results['purchases'] = self.test_purchases_api()
        test_results['admin_stats'] = self.test_admin_stats_api()
        test_results['cleanup'] = self.test_cleanup()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in test_results.values() if result)
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name.replace('_', ' ').title()}")
        
        print()
        print(f"OVERALL: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL BACKEND TESTS PASSED!")
        else:
            print("⚠️  Some tests failed - check details above")
        
        return test_results

if __name__ == "__main__":
    tester = G2MelodyAPITester()
    results = tester.run_all_tests()