#!/usr/bin/env python3
"""
OpenAI API Test Script
"""
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_openai_connection():
    """Test direct OpenAI API connection"""
    print("🔍 Testing OpenAI API connection...")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ No OpenAI API key found in environment variables")
        return False
    
    if not api_key.startswith("sk-"):
        print("❌ Invalid OpenAI API key format")
        return False
    
    print(f"✅ API key found: {api_key[:10]}...{api_key[-10:]}")
    
    try:
        # Initialize OpenAI client
        client = openai.OpenAI(api_key=api_key)
        
        # Test with a simple completion
        print("🔍 Testing OpenAI chat completion...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello in one word."}
            ],
            max_tokens=10,
            temperature=0.7
        )
        
        if response.choices:
            message = response.choices[0].message.content
            print(f"✅ OpenAI API working! Response: '{message}'")
            return True
        else:
            print("❌ No response from OpenAI API")
            return False
            
    except openai.AuthenticationError:
        print("❌ OpenAI API Authentication failed - Invalid API key")
        return False
    except openai.RateLimitError:
        print("❌ OpenAI API Rate limit exceeded")
        return False
    except openai.APIConnectionError as e:
        print(f"❌ OpenAI API Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ OpenAI API Error: {e}")
        return False

def check_environment():
    """Check environment variables"""
    print("\n🔍 Checking environment variables...")
    
    env_vars = {
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
        "OPENAI_MODEL": os.getenv("OPENAI_MODEL"),
        "PORT": os.getenv("PORT"),
        "HOST": os.getenv("HOST"),
        "CORS_ORIGINS": os.getenv("CORS_ORIGINS")
    }
    
    for var, value in env_vars.items():
        if value:
            if var == "OPENAI_API_KEY":
                print(f"✅ {var}: {value[:10]}...{value[-10:]}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Not set")

if __name__ == "__main__":
    print("🧪 OpenAI API Connection Test")
    print("=" * 40)
    
    check_environment()
    success = test_openai_connection()
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 OpenAI API is working correctly!")
    else:
        print("⚠️ OpenAI API connection failed. Check your API key and internet connection.")
