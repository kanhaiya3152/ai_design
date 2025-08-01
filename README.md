# AI Design Assistant - Voice/Text to Vision

A full-stack prototype that transforms voice or text prompts into 3 unique AI-generated design concepts in under 60 seconds, tailored for the AEC (Architecture, Engineering, Construction) industry.

## 🎯 Features

- **Voice/Text Input**: Accept prompts via speech-to-text or typed input
- **Multi-Industry Support**: Interior Design, Architecture, Construction, Event Design
- **AI-Powered Generation**:
  -  Generate high-quality images using the **ClipDrop API**
  -  Generate detailed summaries and highlights using **Gemini API**
- **Real-time Results**: Generate 3 unique design concepts with images, titles, summaries, and key highlights
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **AI APIs**: Google Gemini API (text generation), ClipDrop API (image generation)
- **Speech**: Web Speech API

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- Google Gemini API key
- ClipDrop API key

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-design-assistant
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env

# Add your API keys to .env file
GEMINI_API_KEY=your_gemini_api_key_here
CLIPDROP_API_KEY=your_clipdrop_api_key_here
PORT=3001
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd client

# Install dependencies
npm install

### 4. Getting API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

#### ClipDrop API Key
1. Go to [ClipDrop API](https://clipdrop.co/apis)
2. Sign up for an account
3. Get your API key from the dashboard
4. Copy the key to your `.env` file

### 5. Running the Application

#### Start Backend Server
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:3001`

#### Start Frontend (in a new terminal)
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:3000`

## 🎬 Usage

1. **Enter Prompt**: Type your design idea or click the microphone to use voice input
2. **Select Use Case**: Choose from Interior Design, Architecture, Construction, or Event Design
3. **Generate**: Click "Generate 3 Design Concepts" button
4. **View Results**: See 3 unique concepts with images, descriptions, and key highlights

## 📝 Sample Prompts

### Interior Design
```
"Design a cozy, minimalist living room for a young couple working from home, using sustainable materials."
```

### Architecture
```
"Create a concept for a 2-story urban home in a hot climate, maximizing passive cooling and solar potential."
```

### Construction
```
"Plan the early layout for a 10,000 sq.ft office space renovation with modular construction elements."
```

### Event Design
```
"Design an elegant outdoor wedding reception for 150 guests with a garden theme."
```
