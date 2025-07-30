@echo off

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Check environment file
if not exist .env (
    echo ❗ Please add your OpenAI API key to the .env file
    echo You can get an API key from: https://platform.openai.com/api-keys
)

echo ✅ Setup complete!
echo.
echo 🚀 To start the server, run:
echo python main.py
echo.
echo 📚 The AI Tutor will be available at: http://localhost:8000
echo 📖 API Documentation: http://localhost:8000/docs

pause
