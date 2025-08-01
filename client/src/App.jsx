import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Loader2, Sparkles, Home, Building, HardHat, PartyPopper } from 'lucide-react';

const AiDesignStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState('interior');
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [designResults, setDesignResults] = useState(null);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const useCases = [
    { id: 'interior', label: 'Interior Design', icon: Home, description: 'Layout, style, materials' },
    { id: 'architecture', label: 'Architecture', icon: Building, description: 'Building form, massing, sustainability' },
    { id: 'construction', label: 'Construction', icon: HardHat, description: 'Structural systems, phasing' },
    { id: 'event', label: 'Event Design', icon: PartyPopper, description: 'Seating, lighting, themes' }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
      };

      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setError('Speech recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setError('');
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setError('Speech recognition not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Mock AI generation function (replace with actual API calls)
  const generateDesigns = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock data - in real implementation, this would come from OpenAI + image generation APIs
      const mockResults = {
        interior: [
          {
            title: "The Nordic Light Workspace",
            image: "/api/placeholder/400/300",
            summary: "A serene Scandinavian-inspired space combining living and working areas with natural materials and abundant light.",
            highlights: ["Integrated oak desk", "Hidden storage solutions", "Wool and linen textiles", "Natural lighting optimization"]
          },
          {
            title: "Minimal Zen Office Haven",
            image: "/api/placeholder/400/300", 
            summary: "Clean lines and neutral tones create a peaceful environment perfect for focus and relaxation.",
            highlights: ["Built-in shelving", "Japanese-inspired elements", "Sustainable bamboo flooring", "Flexible workspace zones"]
          },
          {
            title: "Hygge Home Studio",
            image: "/api/placeholder/400/300",
            summary: "Cozy Danish design principles create an inviting space that balances productivity with comfort.",
            highlights: ["Warm wood accents", "Soft ambient lighting", "Modular furniture", "Indoor plants integration"]
          }
        ],
        architecture: [
          {
            title: "Climate-Responsive Urban Dwelling",
            image: "/api/placeholder/400/300",
            summary: "A two-story home designed for hot climates with passive cooling strategies and solar integration.",
            highlights: ["Deep overhangs for shade", "Cross-ventilation design", "Rooftop solar panels", "Thermal mass walls"]
          },
          {
            title: "Sustainable Stack House",
            image: "/api/placeholder/400/300",
            summary: "Vertical living solution maximizing solar potential while minimizing urban footprint.",
            highlights: ["Green roof system", "South-facing glazing", "Natural ventilation tower", "Rainwater collection"]
          },
          {
            title: "Desert Oasis Residence",
            image: "/api/placeholder/400/300",
            summary: "Courtyard-centered design creating microclimates and reducing cooling loads.",
            highlights: ["Central courtyard", "Earth-sheltered design", "Passive solar heating", "Wind catcher towers"]
          }
        ],
        construction: [
          {
            title: "Modular Office Framework",
            image: "/api/placeholder/400/300",
            summary: "Flexible construction approach allowing for phased renovation with minimal disruption.",
            highlights: ["Prefab wall systems", "Modular MEP routing", "Swing space planning", "Phased construction zones"]
          },
          {
            title: "Adaptive Workplace Grid",
            image: "/api/placeholder/400/300",
            summary: "Grid-based system enabling future reconfigurations and technology upgrades.",
            highlights: ["Raised floor system", "Demountable partitions", "Flexible utilities", "Future-proofing strategy"]
          },
          {
            title: "Collaborative Hub Layout",
            image: "/api/placeholder/400/300",
            summary: "Open framework design supporting various work styles and team configurations.",
            highlights: ["Open collaboration zones", "Soundproofing solutions", "Integrated technology", "Wellness-focused lighting"]
          }
        ],
        event: [
          {
            title: "Immersive Gala Experience",
            image: "/api/placeholder/400/300",
            summary: "Sophisticated event space with dynamic lighting and flexible seating arrangements.",
            highlights: ["360-degree lighting design", "Modular seating pods", "Interactive installations", "Acoustic optimization"]
          },
          {
            title: "Garden Party Elegance",
            image: "/api/placeholder/400/300",
            summary: "Outdoor event design blending natural elements with refined entertainment spaces.",
            highlights: ["String light canopy", "Mixed seating styles", "Natural material palette", "Weather contingency plan"]
          },
          {
            title: "Modern Celebration Hub",
            image: "/api/placeholder/400/300",
            summary: "Contemporary event space featuring bold design elements and interactive experiences.",
            highlights: ["LED feature walls", "Flexible bar stations", "Social media zones", "Sustainable materials"]
          }
        ]
      };

      setDesignResults(mockResults[useCase]);
    } catch (err) {
      setError('Failed to generate designs. Please try again.',err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError('Please enter a design prompt.');
      return;
    }
    generateDesigns();
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50 px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold py-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AI Design Studio
                </h1>
                <p className="text-sm text-slate-600">Voice to Vision in Seconds</p>
              </div>
            </div>
          </div>
        
      </header>

      <main className="flex-grow px-6 py-8 w-full">
        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8">
            <div className="space-y-6">
              {/* Use Case Selection */}
              <div>
                <label className="block text-2xl font-semibold text-slate-700 mb-4">
                  Select Your Industry Use Case
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {useCases.map((uc) => {
                    const Icon = uc.icon;
                    return (
                      <button
                        key={uc.id}
                        type="button"
                        onClick={() => setUseCase(uc.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          useCase === uc.id
                            ? 'border-white-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mb-2 ${useCase === uc.id ? 'text-white-600' : 'text-slate-600'}`} />
                        <h3 className={`font-medium text-sm ${useCase === uc.id ? 'text-white-900' : 'text-slate-600'}`}>
                          {uc.label}
                        </h3>
                        <p className={`text-xs mt-1 ${useCase === uc.id ? 'text-white-700' : 'text-slate-600'}`}>
                          {uc.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Describe Your Design Vision
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Design a cozy, minimalist living room for a young couple working from home, using sustainable materials..."
                    className="w-full p-4 pr-24 border text-black border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 bg-white/80 backdrop-blur-sm"
                    disabled={isGenerating}
                  />
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isGenerating}
                    className={`absolute right-3 top-3 p-2 rounded-lg transition-all duration-200 ${
                      isListening
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    } disabled:opacity-50`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>
                {isListening && (
                  <p className="text-sm text-blue-600 mt-2 flex items-center">
                    <div className="animate-pulse h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                    Listening... Speak now
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleSubmit}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Designs...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Generate 3 Design Concepts</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {designResults && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Design Concepts</h2>
              <p className="text-slate-600">3 unique concepts tailored to your vision</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {designResults.map((design, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-medium">AI-Generated Design</p>
                      <p className="text-sm text-slate-500 mt-1">Concept {index + 1}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{design.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{design.summary}</p>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Key Highlights</h4>
                      <div className="space-y-2">
                        {design.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-slate-600">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Prompts */}
        {!designResults && !isGenerating && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Sample Prompts to Get Started</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200/60">
                    <h4 className="font-semibold text-blue-900 mb-2">Interior Design</h4>
                    <p className="text-sm text-blue-800">"Design a cozy, minimalist living room for a young couple working from home, using sustainable materials."</p>
                  </div>
                  <div className="p-4 bg-green-50/80 rounded-xl border border-green-200/60">
                    <h4 className="font-semibold text-green-900 mb-2">Architecture</h4>
                    <p className="text-sm text-green-800">"Create a concept for a 2-story urban home in a hot climate, maximizing passive cooling and solar potential."</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50/80 rounded-xl border border-orange-200/60">
                    <h4 className="font-semibold text-orange-900 mb-2">Construction</h4>
                    <p className="text-sm text-orange-800">"Plan the early layout for a 10,000 sq.ft office space renovation with modular construction elements."</p>
                  </div>
                  <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200/60">
                    <h4 className="font-semibold text-purple-900 mb-2">Event Design</h4>
                    <p className="text-sm text-purple-800">"Design an elegant outdoor wedding reception for 150 guests with a garden theme and sustainable elements."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiDesignStudio;