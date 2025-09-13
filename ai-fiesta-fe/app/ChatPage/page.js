"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Settings, BookOpen, Zap, Mic, Paperclip, Image, Copy, ThumbsUp, ThumbsDown, Share, Minimize2, Maximize2 } from 'lucide-react';
import { callAiModel } from '@/api/chatapi';

// Mock API functions - replace with your actual API calls
const callGeminiAPI = async (history) => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  return "Hello! How can I assist you today? (Gemini response)";
};

const callGPTAPI = async (history) => {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
  return "Hello there! How can I help you today? (GPT response)";
};

const callLlamaAPI = async (history) => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 2000));
  return "Greetings! How may I assist? (Llama response)";
};

const AIFiestaChat = () => {
  // Model configurations
  const models = [
    {
      id: 'gemini',
      name: 'Gemini 2.5 Lite',
      icon: '💎',
      color: 'blue',
      api: callAiModel // api call which accepts model name and history
    },
    {
      id: 'openai',
      name: 'GPT-4o mini',
      icon: '⚡',
      color: 'gray',
      api: callAiModel
    },
    {
      id: 'llama',
      name: 'llama Chat',
      icon: '🔮',
      color: 'purple',
      api: callAiModel
    }
  ];
  
    // State management
  const [activeModels, setActiveModels] = useState({
    gemini: true,
    openai: true,
    llama: true
  });

  const [modelId,setModelId] = useState("")
 



  const [minimizedPanels, setMinimizedPanels] = useState({
    gemini: false,
    openai: false,
    llama: false
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [histories, setHistories] = useState({
    gemini: [],
    openai: [],
    llama: []
  });

  const [projects, setProjects] = useState([]);

  const [currentProject, setCurrentProject] = useState();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState({
    gemini: false,
    openai: false,
    llama: false
  });

  //  useEffect(()=>{
  //    if (!activeModels[modelId]) {
  //     console.log("ac--",activeModels[modelId])
  //     setMinimizedPanels(prev => ({
  //       ...prev,
  //       [modelId]: !prev[modelId]
  //     }));
  //   }
  // },[activeModels,modelId])

  const inputRef = useRef(null);

  // Get active panels count
  const getActivePanelsCount = () => {
    return Object.values(activeModels).filter(Boolean).length;
  };

  // Get visible panels count (active and not minimized)
  const getVisiblePanelsCount = () => {
    return models.filter(model => 
      activeModels[model.id] && !minimizedPanels[model.id]
    ).length;
  };

  // Handle model toggle
  const toggleModel = (modelId) => {
    console.log("hii")
    const activeCount = getActivePanelsCount();
    if (activeCount === 1 && activeModels[modelId]) {
      return; // Prevent disabling the last active model
    }
    
    setActiveModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));

    // if (!activeModels[modelId]) {  this not usefull bcoz here when set active model it doesn update state immediatly so if set update it takes older value
    //   console.log("ac--",activeModels[modelId])
    //   setMinimizedPanels(prev => ({
    //     ...prev,
    //     [modelId]: false
    //   }));
    // }
    // setModelId(modelId)
  };

  // Handle panel minimize/maximize
  const toggleMinimize = (modelId) => {
    const visibleCount = getVisiblePanelsCount();
    if (visibleCount === 1 && !minimizedPanels[modelId]) {
      return; // Prevent minimizing the last visible panel
    }

    setMinimizedPanels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  // Handle sending message
  const handleSendMessage = async () => {

    try {
        setErrorMsg("")
      if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to ALL active model histories
    const activeModelIds = models.filter(model => activeModels[model.id]).map(model => model.id);
    
     // Update histories and get the new value
  // let newHistories;
  // setHistories(prev => {
  //   newHistories = { ...prev };
  //   console.log("prev",newHistories)
  //   activeModelIds.forEach(modelId => {
  //     newHistories[modelId] = [
  //       ...(prev[modelId] || []),
  //       { role: 'user', content: userMessage }
  //     ];
  //   });
  //   console.log("newhist-inside-setHistories-",newHistories)
  //   return newHistories;
  // });
  // console.log("hist--",newHistories)
  // console.log("histories---------",histories)

  //   // Update selected project histories if applicable
  // setProjects(prev => prev.map(project =>
  //   project.name === currentProject
  //     ? { ...project, histories: { ...newHistories } }
  //     : project
  // ));

    // ✅ Directly create newHistories locally
  const newHistories = { ...histories };
  activeModelIds.forEach(modelId => {
    newHistories[modelId] = [
      ...(newHistories[modelId] || []),
      { role: 'user', content: userMessage }
    ];
  });

  // ✅ Ab ek hi value state me daal
  setHistories(newHistories);

  // ✅ Aur projects me bhi wahi use kar
  setProjects(prev => prev.map(project =>
    project.name === currentProject
      ? { ...project, histories: { ...newHistories } }
      : project
  ));
  
    // Set loading states for active models
    const loadingStates = {};
    activeModelIds.forEach(modelId => {
      loadingStates[modelId] = true;
    });
    setIsLoading(loadingStates);

    // Make parallel API calls to active models
    const apiCalls = activeModelIds.map(async (modelId) => {
      try {
        const model = models.find(m => m.id === modelId);
        const modelHistory = [...newHistories[modelId], { role: 'user', content: userMessage }];
        const response = await  model.api(modelId,modelHistory);
        
        // Add model response to its specific history
          // Add model response to its specific history
          console.log("hey-1")
      setHistories(prev => {
        const updated = {
          ...prev,
          [modelId]: [
            ...(prev[modelId] || []),
            { role: 'model', content: response }
          ]
        };
        // Update only the current project with the new histories
        setProjects(projects =>
          projects.map(project =>
            project.name === currentProject
              ? { ...project, histories: { ...updated } }
              : project
          )
        );
        return updated;
      });
      console.log("hey-2")

        setIsLoading(prev => ({ ...prev, [modelId]: false }));
      } catch (error) {
        console.error(`Error calling ${modelId} API:`, error);
        setIsLoading(prev => ({ ...prev, [modelId]: false }));
        setErrorMsg(error.message); // Set error message
      }
    });
    console.log("apiCalls Array--",apiCalls)
    await Promise.all(apiCalls); // Ye line wait karti hai jab tak saare models ki API response nahi aa jaati.Matlab, ek hi baar mein sab parallel chalenge, aur jab sab complete ho jayenge tab aage ka code chalega.
  
      
    } catch (error) {
      console.log("yaha dekh")
       console.log("error in HandleSendMessage--",error.message)
    }

    };

  // Handle new chat
  const handleNewChat = () => {
    console.log({histories})
    // Save current chat to projects if it has messages
    const hasMessages = Object.values(histories).some(history => history.length > 0);
    if (hasMessages) {
      const newProject = {
        id: Date.now().toString(),
        name: `Chat ${projects.length + 1}`,
        date: 'Today',
        histories: { ...histories }
      };
      setProjects(prev => [newProject, ...prev]);
       setCurrentProject(newProject.name); // <-- set to new project name
    }

    // Reset current conversation
    setHistories({
      gemini: [],
      openai: [],
      llama: []
    });
    setCurrentProject(`Chat ${projects.length + 1}`);
  };

  // Handle project selection
  const handleSelectProject = (project) => {
    console.log("selected-history-",project)
    setCurrentProject(project.name);
    if (project.histories) {
      setHistories(project.histories || {
  gemini: [],
  openai: [],
  llama: []
});

    } else {
      setHistories({
        gemini: [],
        openai: [],
        llama: []
      });
    }
  };

  // Calculate panel width based on visible panels
  const getPanelWidth = () => {
    const visibleCount = getVisiblePanelsCount();
    if (visibleCount === 0) return 'w-0';
    return `w-1/${visibleCount}`;
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
            </div>
            <span className="text-white text-xl font-bold">AI Fiesta</span>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-3 flex items-center space-x-3 transition-colors"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Projects Section */}
        <div className="flex-1 px-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">Projects</span>
            <Plus size={16} className="text-gray-500" />
          </div>
          
          <div className="space-y-1">
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="text-gray-500 text-xs mb-2">{project.date}</div>
                <button
                  onClick={() => {handleSelectProject(project)}}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentProject === project.name 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {project.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-700 space-y-4">
          {/* Free Plan Info */}
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-white text-sm font-medium mb-1">Free Plan</div>
            <div className="text-gray-400 text-xs mb-2">2 / 3 messages used</div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>

          {/* Upgrade Button */}
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg px-4 py-3 flex items-center justify-center space-x-2 transition-all">
            <Zap size={16} />
            <span>Upgrade Plan</span>
          </button>

          {/* Settings */}
          <button className="w-full text-gray-400 hover:text-white px-4 py-2 flex items-center space-x-3 transition-colors">
            <Settings size={16} />
            <span>Settings</span>
            <BookOpen size={16} className="ml-auto" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col"> {/* flex-1 takes remaining width */}
        {/* Chat Panels */}
        <div className="flex-1 flex">
          {models.map((model) => {
            // if (!activeModels[model.id]) return null;
            const isActive = activeModels[model.id];
            const isMinimized = minimizedPanels[model.id];
            const visibleCount = getVisiblePanelsCount();
            const panelWidth = isMinimized ? 'w-16' : `${100 / visibleCount}%`;

            return (
              <div 
                key={model.id} 
                className="border-r border-gray-700 flex flex-col bg-gray-900 "
                style={{ width: panelWidth }}
              >
                {/* Panel Header */}
                <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{model.icon}</span>
                    {!isMinimized && (
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>{model.name}</span>
                        <button
                          onClick={() => toggleMinimize(model.id)}
                          className="text-gray-400 hover:text-white p-1 rounded"
                        >
                          <Minimize2 size={14} />
                        </button>
                      </div>
                    )}
                    {isMinimized && (
                      <button
                        onClick={() => toggleMinimize(model.id)}
                        className="text-gray-400 hover:text-white p-1 rounded ml-auto"
                      >
                        <Maximize2 size={14} />
                      </button>
                    )}
                  </div>
                  
                  {!isMinimized && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleModel(model.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          activeModels[model.id] ? 'bg-emerald-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                          activeModels[model.id] ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Panel Content */}
                {!isMinimized && (
                  <div className=" flex flex-col h-[530px] overflow-hidden overflow-y-scroll ">
                    {/* Messages */}
                    <div className="flex-1 p-4">
                      {histories[model.id].length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="text-6xl mb-4">{model.icon}</div>
                            <div className="text-gray-500">Ask me anything</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {histories && histories[model.id].map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] ${
                                message.role === 'user' 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-gray-800 text-gray-100'
                              } rounded-2xl px-4 py-3`}>
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                                    {message.role === 'user' ? 'A' : model.icon}
                                  </div>
                                  <span className="text-sm font-medium">
                                    {message.role === 'user' ? 'hello' : ''}
                                  </span>
                                </div>
                                <div className="text-sm">{message.content}</div>
                                <div className="text-xs text-red-700 self-end">{errorMsg && errorMsg}</div>
                                {message.role === 'model' && (
                                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-700">
                                    <button className="text-gray-400 hover:text-white p-1">
                                      <Copy size={14} />
                                    </button>
                                    <button className="text-gray-400 hover:text-white p-1">
                                      <ThumbsUp size={14} />
                                    </button>
                                    <button className="text-gray-400 hover:text-white p-1">
                                      <ThumbsDown size={14} />
                                    </button>
                                    <button className="text-gray-400 hover:text-white p-1">
                                      <Share size={14} />
                                    </button>
                                    <span className="text-xs text-gray-500 ml-auto">Share feedback</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {isLoading[model.id] && (
                            <div className="flex justify-start">
                              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-700 rounded-2xl border border-gray-600 flex items-center space-x-4 px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
              
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-600 transition-colors">
                  <Image size={16} />
                  <span className="sr-only">Generate Image</span>
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-600 transition-colors">
                  <Paperclip size={16} />
                  <span className="sr-only">Attach Files</span>
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-600 transition-colors">
                  <Mic size={16} />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Image size={14} />
                <span>Generate Image</span>
              </div>
              <div className="flex items-center space-x-2">
                <Paperclip size={14} />
                <span>Attach Files</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFiestaChat;