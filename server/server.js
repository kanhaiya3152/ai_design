import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const requiredEnvVars = ['GEMINI_API_KEY', 'CLIPDROP_API_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Use case specific prompts
const getUseCasePrompt = (useCase, userPrompt) => {
  const basePrompts = {
    interior: `You are an expert interior designer. Based on the prompt "${userPrompt}", generate 3 distinct interior design concepts. Focus on layout, space utilization, style, materials, color schemes, and furniture arrangements. Each concept should be unique and creative.`,
    
    architecture: `You are an expert architect. Based on the prompt "${userPrompt}", generate 3 distinct architectural design concepts. Focus on building form, massing, structural elements, sustainability features, site integration, and architectural style. Each concept should explore different approaches.`,
    
    construction: `You are an expert construction manager. Based on the prompt "${userPrompt}", generate 3 distinct construction concepts. Focus on structural systems, construction phasing, material choices, stakeholder considerations, cost optimization, and project timeline. Each concept should address different construction approaches.`,
    
    event: `You are an expert event designer. Based on the prompt "${userPrompt}", generate 3 distinct event design concepts. Focus on seating arrangements, lighting design, thematic elements, spatial flow, decoration, and atmospheric considerations. Each concept should create different event experiences.`
  };

  return `${basePrompts[useCase]}

Please format your response as a valid JSON object with this exact structure:
{
  "concepts": [
    {
      "title": "Creative concept title",
      "summary": "Brief 2-3 sentence description of the concept",
      "highlights": ["Key feature 1", "Key feature 2", "Key feature 3", "Key feature 4"],
      "imagePrompt": "Detailed visual description for AI image generation, focusing on the key visual elements, style, materials, colors, and atmosphere"
    }
  ]
}

Make sure each concept is distinctly different from the others, with unique approaches and creative solutions. The imagePrompt should be detailed enough to generate a compelling sketch-style architectural/design rendering.`;
};

// Generate text using Gemini
async function generateTextConcepts(prompt, useCase) {
  try {
    const geminiPrompt = getUseCasePrompt(useCase, prompt);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: geminiPrompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    let cleanedText = generatedText.trim();
    
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', cleanedText);
      
      // Fallback
      return {
        concepts: [
          {
            title: "Design Concept 1",
            summary: "A creative design solution based on your requirements.",
            highlights: ["Modern approach", "Functional layout", "Quality materials", "Thoughtful design"],
            imagePrompt: `${useCase} design concept based on: ${prompt}`
          },
          {
            title: "Design Concept 2", 
            summary: "An alternative design approach with unique features.",
            highlights: ["Innovative solution", "Efficient use of space", "Sustainable materials", "User-centered design"],
            imagePrompt: `Alternative ${useCase} design for: ${prompt}`
          },
          {
            title: "Design Concept 3",
            summary: "A bold design concept with distinctive characteristics.",
            highlights: ["Contemporary style", "Smart integration", "Premium finishes", "Harmonious composition"],
            imagePrompt: `Contemporary ${useCase} concept: ${prompt}`
          }
        ]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error('Failed to generate text concepts');
  }
}

// Generate image using ClipDrop
async function generateImage(imagePrompt) {
  try {
    const response = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      {
        prompt: `${imagePrompt}, architectural sketch style, professional rendering, clean lines, detailed illustration`,
      },
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const base64Image = Buffer.from(response.data).toString('base64');
    return `data:image/png;base64,${base64Image}`;
    
  } catch (error) {
    console.error('ClipDrop API error:', error.response?.data || error.message);
    return null;
  }
}

// Main API endpoint
app.post('/api/generate-design', async (req, res) => {
  try {
    const { prompt, useCase } = req.body;

    if (!prompt || !useCase) {
      return res.status(400).json({ 
        error: 'Prompt and use case are required' 
      });
    }

    console.log('Generating designs for:', { prompt, useCase });

    const textResponse = await generateTextConcepts(prompt, useCase);
    
    if (!textResponse.concepts || textResponse.concepts.length === 0) {
      throw new Error('No concepts generated');
    }

    const conceptsWithImages = await Promise.all(
      textResponse.concepts.map(async (concept, index) => {
        console.log(`Generating image ${index + 1}/3...`);
        
        const imageUrl = await generateImage(concept.imagePrompt);
        
        return {
          ...concept,
          imageUrl
        };
      })
    );

    console.log('Successfully generated all concepts');

    res.json({
      concepts: conceptsWithImages,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in generate-design endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to generate designs. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: {
      gemini: !!process.env.GEMINI_API_KEY,
      clipdrop: !!process.env.CLIPDROP_API_KEY
    }
  });
});

app.get('/' , (req,res)=>{res.send("Welcome to my backend")})

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log('Environment check:');
  console.log('- Gemini API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Missing');
  console.log('- ClipDrop API Key:', process.env.CLIPDROP_API_KEY ? 'Set' : 'Missing');
});