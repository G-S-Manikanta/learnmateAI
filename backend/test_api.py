#!/usr/bin/env python3
"""
Test script for LearnMate AI Tutor Backend
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_root_endpoint():
    """Test the root endpoint"""
    print("🔍 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print("✅ Root endpoint working!")
            print(f"   Message: {data.get('message')}")
            print(f"   Status: {data.get('status')}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing root endpoint: {e}")
        return False

def test_health_endpoint():
    """Test the health check endpoint"""
    print("\n🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health endpoint working!")
            print(f"   Status: {data.get('status')}")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing health endpoint: {e}")
        return False

def test_subjects_endpoint():
    """Test the subjects endpoint"""
    print("\n🔍 Testing subjects endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/tutor/subjects")
        if response.status_code == 200:
            data = response.json()
            print("✅ Subjects endpoint working!")
            subjects = data.get('subjects', {})
            print(f"   Available subjects: {len(subjects)}")
            for subject_key, subject_info in list(subjects.items())[:3]:
                print(f"   - {subject_info['icon']} {subject_info['name']}")
            return True
        else:
            print(f"❌ Subjects endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing subjects endpoint: {e}")
        return False

def test_study_tips_endpoint():
    """Test the study tips endpoint"""
    print("\n🔍 Testing study tips endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/tutor/study-tips")
        if response.status_code == 200:
            data = response.json()
            print("✅ Study tips endpoint working!")
            tips = data.get('tips', [])
            print(f"   Available tips: {len(tips)}")
            if tips:
                print(f"   Example: {tips[0]['category']} - {tips[0]['tip'][:50]}...")
            return True
        else:
            print(f"❌ Study tips endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing study tips endpoint: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint with AI tutor"""
    print("\n🔍 Testing AI chat endpoint...")
    try:
        # Test data
        chat_request = {
            "message": "Can you help me understand what photosynthesis is?",
            "subject": "biology",
            "user_level": "high_school",
            "conversation_history": []
        }
        
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}/api/tutor/chat", 
            json=chat_request, 
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI Chat endpoint working!")
            print(f"   AI Response: {data.get('response', '')[:100]}...")
            print(f"   Subject detected: {data.get('subject_detected')}")
            print(f"   Confidence: {data.get('confidence')}")
            if data.get('suggestions'):
                print(f"   Suggestions provided: {len(data.get('suggestions'))}")
            return True
        else:
            print(f"❌ Chat endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing chat endpoint: {e}")
        return False

def test_invalid_chat():
    """Test chat endpoint with invalid/non-educational content"""
    print("\n🔍 Testing chat with non-educational content...")
    try:
        chat_request = {
            "message": "What's the weather like today?",
            "subject": None,
            "user_level": "high_school",
            "conversation_history": []
        }
        
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}/api/tutor/chat", 
            json=chat_request, 
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Non-educational content handled correctly!")
            print(f"   AI Response: {data.get('response', '')[:100]}...")
            return True
        else:
            print(f"❌ Invalid chat test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing invalid chat: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 LearnMate AI Tutor Backend Test Suite")
    print("=" * 50)
    
    tests = [
        test_root_endpoint,
        test_health_endpoint,
        test_subjects_endpoint,
        test_study_tips_endpoint,
        test_chat_endpoint,
        test_invalid_chat
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your LearnMate AI Tutor Backend is working perfectly!")
    else:
        print("⚠️  Some tests failed. Check the logs above for details.")
    
    print(f"🕐 Test completed at: {datetime.now()}")

if __name__ == "__main__":
    main()
