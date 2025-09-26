# AI Chat Setup Guide

## Current Status
The AI chat is now working in **Demo Mode** with improved error handling.

## Issues Fixed
1. ✅ Added environment variable validation
2. ✅ Added authentication checks
3. ✅ Improved error messages
4. ✅ Added demo mode for testing

## To Enable Full AI Chat:

### 1. Create Environment File
Create a `.env` file in your project root with:
```
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Backend Requirements
The chat expects a backend API with these endpoints:
- `POST /chat/ai` - Main chat endpoint
- Expected request body: `{ message: string, userId: string, productId?: string }`
- Expected response: `{ reply: string }` or `{ message: string }`

### 3. Authentication
Make sure users are logged in before using the chat (the `_id` from AuthContext is required).

## Demo Mode
When `VITE_API_BASE_URL` is not set, the chat will work in demo mode with pre-defined responses to help you test the UI.

## Testing
1. Open the chat by clicking the floating chat button
2. Type a message and press Enter
3. You should see either:
   - Demo mode responses (if no API URL is set)
   - Real AI responses (if backend is running)
   - Clear error messages (if there are connection issues)

## Troubleshooting
- **"API not configured"**: Set the `VITE_API_BASE_URL` environment variable
- **"Please log in"**: Make sure you're authenticated
- **"Network error"**: Check if your backend server is running
- **"Server error"**: Check your backend API implementation
