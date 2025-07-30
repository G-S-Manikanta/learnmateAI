#!/bin/bash

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Set up environment variables
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    echo "❗ Please add your OpenAI API key to the .env file"
    echo "You can get an API key from: https://platform.openai.com/api-keys"
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server, run:"
echo "python main.py"
echo ""
echo "📚 The AI Tutor will be available at: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
