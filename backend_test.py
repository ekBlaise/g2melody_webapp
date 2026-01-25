#!/usr/bin/env python3
"""
Backend API Testing Script for G2 Melody Learning Platform APIs
Tests all the new Learning Platform endpoints as specified in the review request.
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://music-platform-36.preview.emergentagent.com/api"

def test_api_endpoint(method, endpoint, data=None, params=None, expected_status=200):
    """Test an API endpoint and return the response"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, params=params)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        else:
            print(f"❌ Unsupported method: {method}")
            return None
            
        print(f"📡 {method} {endpoint} - Status: {response.status_code}")
        
        if response.status_code == expected_status:
            try:
                result = response.json()
                print(f"✅ SUCCESS: {method} {endpoint}")
                return result
            except json.JSONDecodeError:
                print(f"✅ SUCCESS: {method} {endpoint} (No JSON response)")
                return True
        else:
            print(f"❌ FAILED: {method} {endpoint} - Expected {expected_status}, got {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data}")
            except:
                print(f"   Error: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ NETWORK ERROR: {method} {endpoint} - {str(e)}")
        return None

def main():
    print("🚀 Starting G2 Melody Learning Platform API Tests")
    print("=" * 60)
    
    test_results = []
    
    # Test 1: GET /api/courses - Should return 4 courses
    print("\n1️⃣ Testing GET /api/courses")
    courses = test_api_endpoint("GET", "/courses")
    if courses and isinstance(courses, list):
        print(f"   📊 Found {len(courses)} courses")
        if len(courses) >= 4:
            print("   ✅ Expected 4+ courses found")
            test_results.append(("GET /api/courses", True, f"Found {len(courses)} courses"))
        else:
            print("   ⚠️  Expected 4+ courses, found fewer")
            test_results.append(("GET /api/courses", False, f"Expected 4+ courses, found {len(courses)}"))
    else:
        test_results.append(("GET /api/courses", False, "Failed to retrieve courses"))
    
    # Test 2: POST /api/enrollments - Create enrollment
    print("\n2️⃣ Testing POST /api/enrollments")
    enrollment_data = {
        "userId": "admin-1",
        "courseId": "course-3"
    }
    enrollment = test_api_endpoint("POST", "/enrollments", data=enrollment_data)
    if enrollment:
        print(f"   ✅ Enrollment created successfully")
        test_results.append(("POST /api/enrollments", True, "Enrollment created"))
    else:
        test_results.append(("POST /api/enrollments", False, "Failed to create enrollment"))
    
    # Test 3: GET /api/enrollments?userId=admin-1 - Should return enrolled courses
    print("\n3️⃣ Testing GET /api/enrollments?userId=admin-1")
    enrollments = test_api_endpoint("GET", "/enrollments", params={"userId": "admin-1"})
    if enrollments and isinstance(enrollments, list):
        print(f"   📊 Found {len(enrollments)} enrollments for admin-1")
        test_results.append(("GET /api/enrollments", True, f"Found {len(enrollments)} enrollments"))
    else:
        test_results.append(("GET /api/enrollments", False, "Failed to retrieve enrollments"))
    
    # Test 4: GET /api/practice-tracks - Should return 10 practice tracks
    print("\n4️⃣ Testing GET /api/practice-tracks")
    tracks = test_api_endpoint("GET", "/practice-tracks")
    if tracks and isinstance(tracks, list):
        print(f"   📊 Found {len(tracks)} practice tracks")
        if len(tracks) >= 10:
            print("   ✅ Expected 10+ practice tracks found")
            test_results.append(("GET /api/practice-tracks", True, f"Found {len(tracks)} tracks"))
        else:
            print("   ⚠️  Expected 10+ tracks, found fewer")
            test_results.append(("GET /api/practice-tracks", False, f"Expected 10+ tracks, found {len(tracks)}"))
    else:
        test_results.append(("GET /api/practice-tracks", False, "Failed to retrieve practice tracks"))
    
    # Test 5: GET /api/achievements - Should return 8 achievements
    print("\n5️⃣ Testing GET /api/achievements")
    achievements = test_api_endpoint("GET", "/achievements")
    if achievements and isinstance(achievements, list):
        print(f"   📊 Found {len(achievements)} achievements")
        if len(achievements) >= 8:
            print("   ✅ Expected 8+ achievements found")
            test_results.append(("GET /api/achievements", True, f"Found {len(achievements)} achievements"))
        else:
            print("   ⚠️  Expected 8+ achievements, found fewer")
            test_results.append(("GET /api/achievements", False, f"Expected 8+ achievements, found {len(achievements)}"))
    else:
        test_results.append(("GET /api/achievements", False, "Failed to retrieve achievements"))
    
    # Test 6: GET /api/schedule - Should return upcoming events (4 items)
    print("\n6️⃣ Testing GET /api/schedule")
    schedule = test_api_endpoint("GET", "/schedule")
    if schedule and isinstance(schedule, list):
        print(f"   📊 Found {len(schedule)} schedule items")
        if len(schedule) >= 4:
            print("   ✅ Expected 4+ schedule items found")
            test_results.append(("GET /api/schedule", True, f"Found {len(schedule)} schedule items"))
        else:
            print("   ⚠️  Expected 4+ schedule items, found fewer")
            test_results.append(("GET /api/schedule", False, f"Expected 4+ items, found {len(schedule)}"))
    else:
        test_results.append(("GET /api/schedule", False, "Failed to retrieve schedule"))
    
    # Test 7: GET /api/dashboard/learner?userId=admin-1 - Should return aggregated learner data
    print("\n7️⃣ Testing GET /api/dashboard/learner?userId=admin-1")
    learner_data = test_api_endpoint("GET", "/dashboard/learner", params={"userId": "admin-1"})
    if learner_data and isinstance(learner_data, dict):
        required_keys = ["progress", "courses", "practiceTracks", "achievements", "notifications", "schedule", "stats"]
        missing_keys = [key for key in required_keys if key not in learner_data]
        if not missing_keys:
            print("   ✅ All required learner dashboard fields present")
            test_results.append(("GET /api/dashboard/learner", True, "All required fields present"))
        else:
            print(f"   ❌ Missing required fields: {missing_keys}")
            test_results.append(("GET /api/dashboard/learner", False, f"Missing fields: {missing_keys}"))
    else:
        test_results.append(("GET /api/dashboard/learner", False, "Failed to retrieve learner dashboard"))
    
    # Test 8: GET /api/dashboard/supporter?userId=admin-1 - Should return supporter stats
    print("\n8️⃣ Testing GET /api/dashboard/supporter?userId=admin-1")
    supporter_data = test_api_endpoint("GET", "/dashboard/supporter", params={"userId": "admin-1"})
    if supporter_data and isinstance(supporter_data, dict):
        required_keys = ["stats", "donations", "leaderboard", "impact"]
        missing_keys = [key for key in required_keys if key not in supporter_data]
        if not missing_keys:
            print("   ✅ All required supporter dashboard fields present")
            test_results.append(("GET /api/dashboard/supporter", True, "All required fields present"))
        else:
            print(f"   ❌ Missing required fields: {missing_keys}")
            test_results.append(("GET /api/dashboard/supporter", False, f"Missing fields: {missing_keys}"))
    else:
        test_results.append(("GET /api/dashboard/supporter", False, "Failed to retrieve supporter dashboard"))
    
    # Test 9: POST /api/practice-sessions - Log practice
    print("\n9️⃣ Testing POST /api/practice-sessions")
    practice_data = {
        "userId": "admin-1",
        "trackId": "track-1",
        "duration": 15,
        "notes": "Great practice session"
    }
    practice_session = test_api_endpoint("POST", "/practice-sessions", data=practice_data)
    if practice_session:
        print("   ✅ Practice session logged successfully")
        test_results.append(("POST /api/practice-sessions", True, "Practice session logged"))
    else:
        test_results.append(("POST /api/practice-sessions", False, "Failed to log practice session"))
    
    # Test 10: GET /api/user-stats?userId=admin-1 - Should return user stats after practice logged
    print("\n🔟 Testing GET /api/user-stats?userId=admin-1")
    user_stats = test_api_endpoint("GET", "/user-stats", params={"userId": "admin-1"})
    if user_stats and isinstance(user_stats, dict):
        if "totalPracticeMinutes" in user_stats:
            print(f"   ✅ User stats retrieved - Practice minutes: {user_stats.get('totalPracticeMinutes', 0)}")
            test_results.append(("GET /api/user-stats", True, f"Stats retrieved with {user_stats.get('totalPracticeMinutes', 0)} practice minutes"))
        else:
            print("   ❌ Missing totalPracticeMinutes field")
            test_results.append(("GET /api/user-stats", False, "Missing totalPracticeMinutes field"))
    else:
        test_results.append(("GET /api/user-stats", False, "Failed to retrieve user stats"))
    
    # Test 11: POST /api/notifications - Create notification
    print("\n1️⃣1️⃣ Testing POST /api/notifications")
    notification_data = {
        "userId": "admin-1",
        "title": "Test Notification",
        "message": "This is a test notification from the API test suite",
        "type": "info"
    }
    notification = test_api_endpoint("POST", "/notifications", data=notification_data)
    if notification:
        print("   ✅ Notification created successfully")
        test_results.append(("POST /api/notifications", True, "Notification created"))
    else:
        test_results.append(("POST /api/notifications", False, "Failed to create notification"))
    
    # Test 12: GET /api/notifications?userId=admin-1 - Should return notifications
    print("\n1️⃣2️⃣ Testing GET /api/notifications?userId=admin-1")
    notifications = test_api_endpoint("GET", "/notifications", params={"userId": "admin-1"})
    if notifications and isinstance(notifications, list):
        print(f"   📊 Found {len(notifications)} notifications for admin-1")
        test_results.append(("GET /api/notifications", True, f"Found {len(notifications)} notifications"))
    else:
        test_results.append(("GET /api/notifications", False, "Failed to retrieve notifications"))
    
    # Print Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, success, details in test_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name} - {details}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"\n📈 RESULTS: {passed} passed, {failed} failed out of {len(test_results)} tests")
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED! Learning Platform APIs are working correctly.")
        return 0
    else:
        print(f"⚠️  {failed} tests failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())