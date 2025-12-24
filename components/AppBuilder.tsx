import React, { useState } from 'react';
import { PhonePreview } from './PhonePreview';
import { AppState, AppElement } from '../types';
import { generateAppLayout, generateImage } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface AppBuilderProps {
  onBack: () => void;
}

export const AppBuilder: React.FC<AppBuilderProps> = ({ onBack }) => {
  const [appState, setAppState] = useState<AppState>({
    appName: 'My New App',
    themeColor: '#4f46e5',
    elements: []
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'design' | 'ai'>('components');

  const addElement = (type: AppElement['type']) => {
    const newElement: AppElement = {
      id: uuidv4(),
      type,
      content: {
        title: type === 'header' || type === 'hero' ? 'New Heading' : type === 'product' ? 'Product Name' : undefined,
        text: type === 'text' ? 'Add your text here.' : undefined,
        label: type === 'button' ? 'Click Me' : undefined,
        price: type === 'product' ? '$19.99' : undefined,
        // No mock URL. Let the UI handle empty src.
        src: undefined
      },
      style: {
        align: 'left',
        padding: 'medium'
      }
    };
    setAppState(prev => ({ ...prev, elements: [...prev.elements, newElement] }));
  };

  const updateElement = (id: string, updates: Partial<AppElement['content'] | AppElement['style']>) => {
    setAppState(prev => ({
      ...prev,
      elements: prev.elements.map(el => {
        if (el.id !== id) return el;
        return {
          ...el,
          content: { ...el.content, ...('title' in updates || 'text' in updates || 'label' in updates || 'src' in updates || 'price' in updates || 'subtitle' in updates ? updates : {}) },
          style: { ...el.style, ...('backgroundColor' in updates || 'textColor' in updates || 'align' in updates ? updates : {}) }
        };
      })
    }));
  };

  const removeElement = (id: string) => {
    setAppState(prev => ({ ...prev, elements: prev.elements.filter(e => e.id !== id) }));
    setSelectedElementId(null);
  };

  const processGeneratedImages = async (elements: AppElement[]) => {
    // Return a new array with promises for image generation started where needed
    const updatedElements = [...elements];
    
    // We update the state immediately with the layout (showing loaders), then update again as images finish
    setAppState(prev => ({ ...prev, elements: updatedElements }));

    // Identify elements that need images
    const imageIndices = updatedElements
      .map((el, index) => ({ el, index }))
      .filter(({ el }) => el.content.src && el.content.src.startsWith('GENERATE_IMAGE:'));

    // Process sequentially or in small batches to be safe with API limits if any, 
    // but Promise.all is usually fine for a few images.
    for (const { el, index } of imageIndices) {
        if (!el.content.src) continue;
        const prompt = el.content.src.replace('GENERATE_IMAGE:', '').trim();
        
        // Generate
        try {
            const base64Image = await generateImage(prompt);
            if (base64Image) {
                setAppState(prevState => {
                    const newElements = [...prevState.elements];
                    // Find the element by ID to be safe against concurrent updates
                    const targetIndex = newElements.findIndex(e => e.id === el.id);
                    if (targetIndex !== -1) {
                        newElements[targetIndex] = {
                            ...newElements[targetIndex],
                            content: { ...newElements[targetIndex].content, src: base64Image }
                        };
                    }
                    return { ...prevState, elements: newElements };
                });
            }
        } catch (e) {
            console.error("Error generating image for element", el.id, e);
        }
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    const response = await generateAppLayout(aiPrompt);
    
    if (response) {
      // Create new elements with valid IDs
      const elementsWithIds = response.elements.map(el => ({...el, id: uuidv4()}));
      
      setAppState({
        appName: response.appName,
        themeColor: response.themeColor || '#4f46e5',
        elements: elementsWithIds
      });
      
      setIsGenerating(false);
      setActiveTab('design');
      
      // Trigger image generation for the new elements
      processGeneratedImages(elementsWithIds);
    } else {
        setIsGenerating(false);
    }
  };

  const getSelectedElement = () => appState.elements.find(e => e.id === selectedElementId);

  return (
    <div className="flex flex-col h-screen bg-surface text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-darker border-b border-gray-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <i className="fas fa-cube text-white text-xs"></i>
            </div>
            <span className="font-bold text-lg tracking-tight">AI App Builder</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Editing: <span className="text-white font-medium">{appState.appName}</span></span>
          <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors">
            <i className="fas fa-rocket mr-2"></i> Publish App
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-darker border-r border-gray-800 flex flex-col">
          <div className="flex border-b border-gray-800">
            <button 
              onClick={() => setActiveTab('components')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'components' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
            >
              Components
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
            >
              AI Magic
            </button>
            <button 
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'design' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-400 hover:text-white'}`}
            >
              Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'components' && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => addElement('header')} className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-primary group">
                  <i className="fas fa-heading text-2xl text-gray-400 group-hover:text-primary mb-1"></i>
                  <span className="text-xs font-medium">Header</span>
                </button>
                <button onClick={() => addElement('hero')} className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-primary group">
                  <i className="fas fa-image text-2xl text-gray-400 group-hover:text-primary mb-1"></i>
                  <span className="text-xs font-medium">Hero</span>
                </button>
                <button onClick={() => addElement('text')} className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-primary group">
                  <i className="fas fa-paragraph text-2xl text-gray-400 group-hover:text-primary mb-1"></i>
                  <span className="text-xs font-medium">Text</span>
                </button>
                <button onClick={() => addElement('image')} className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-primary group">
                  <i className="fas fa-images text-2xl text-gray-400 group-hover:text-primary mb-1"></i>
                  <span className="text-xs font-medium">Image</span>
                </button>
                <button onClick={() => addElement('button')} className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-primary group">
                  <i className="fas fa-stop text-2xl text-gray-400 group-hover:text-primary mb-1"></i>
                  <span className="text-xs font-medium">Button</span>
                </button>
                <button onClick={() => addElement('product')} className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-primary group">
                  <i className="fas fa-shopping-bag text-2xl text-gray-400 group-hover:text-primary mb-1"></i>
                  <span className="text-xs font-medium">Product</span>
                </button>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                 <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 rounded-xl border border-purple-500/30">
                    <h3 className="font-bold text-white mb-2"><i className="fas fa-sparkles text-purple-400 mr-2"></i>AI Generator</h3>
                    <p className="text-xs text-gray-300 mb-4">Describe your dream app and let our patent-pending AI build the entire layout in seconds.</p>
                    
                    <textarea 
                      className="w-full bg-darker border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none h-32"
                      placeholder="e.g. A fitness app with a dark theme, a hero section showing a runner, a list of workout programs, and a subscribe button."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    ></textarea>
                    
                    <button 
                      onClick={handleAiGenerate}
                      disabled={isGenerating}
                      className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <><i className="fas fa-circle-notch fa-spin"></i> Building...</>
                      ) : (
                        <><i className="fas fa-magic"></i> Generate App</>
                      )}
                    </button>
                 </div>
                 <div className="text-xs text-gray-500 text-center">
                   Powered by Gemini Flash 3.0 & Imagen
                 </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">App Name</label>
                  <input 
                    type="text" 
                    value={appState.appName}
                    onChange={(e) => setAppState(prev => ({...prev, appName: e.target.value}))}
                    className="w-full bg-surface border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Theme Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#ec4899', '#3b82f6', '#111827'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setAppState(prev => ({...prev, themeColor: color}))}
                        className={`w-8 h-8 rounded-full border-2 ${appState.themeColor === color ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-2">Layers</p>
                    <div className="space-y-1">
                      {appState.elements.map((el, idx) => (
                        <div 
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${selectedElementId === el.id ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                          <span className="truncate">{el.type} - {idx + 1}</span>
                          <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="text-xs opacity-50 hover:opacity-100"><i className="fas fa-trash"></i></button>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 bg-surface relative flex items-center justify-center p-8">
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           <PhonePreview appState={appState} onSelectElement={setSelectedElementId} selectedId={selectedElementId} />
        </main>

        {/* Right Properties Panel */}
        <aside className="w-72 bg-darker border-l border-gray-800 p-6 flex flex-col">
          <h3 className="font-bold text-white mb-4 border-b border-gray-800 pb-2">Properties</h3>
          
          {selectedElementId && getSelectedElement() ? (
            <div className="space-y-4">
              {/* Common Text Inputs */}
              {(getSelectedElement()?.content.title !== undefined) && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={getSelectedElement()!.content.title} 
                    onChange={(e) => updateElement(selectedElementId, { title: e.target.value })}
                    className="w-full bg-surface border border-gray-700 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              )}
               {(getSelectedElement()?.content.subtitle !== undefined) && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
                  <input 
                    type="text" 
                    value={getSelectedElement()!.content.subtitle} 
                    onChange={(e) => updateElement(selectedElementId, { subtitle: e.target.value })}
                    className="w-full bg-surface border border-gray-700 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              )}
              {(getSelectedElement()?.content.text !== undefined) && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Content Text</label>
                  <textarea 
                    value={getSelectedElement()!.content.text} 
                    onChange={(e) => updateElement(selectedElementId, { text: e.target.value })}
                    className="w-full bg-surface border border-gray-700 rounded px-2 py-1 text-sm text-white h-24 resize-none"
                  />
                </div>
              )}
              {(getSelectedElement()?.content.label !== undefined) && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Button Label</label>
                  <input 
                    type="text" 
                    value={getSelectedElement()!.content.label} 
                    onChange={(e) => updateElement(selectedElementId, { label: e.target.value })}
                    className="w-full bg-surface border border-gray-700 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              )}
               {(getSelectedElement()?.content.price !== undefined) && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Price</label>
                  <input 
                    type="text" 
                    value={getSelectedElement()!.content.price} 
                    onChange={(e) => updateElement(selectedElementId, { price: e.target.value })}
                    className="w-full bg-surface border border-gray-700 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              )}

              {/* Style Controls */}
              <div className="pt-4 border-t border-gray-800">
                <label className="block text-xs font-bold text-gray-400 mb-2">Styling</label>
                
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Alignment</label>
                  <div className="flex bg-surface rounded border border-gray-700 p-1">
                    <button onClick={() => updateElement(selectedElementId, { align: 'left' })} className={`flex-1 py-1 rounded ${getSelectedElement()?.style.align === 'left' ? 'bg-gray-600' : ''}`}><i className="fas fa-align-left text-xs"></i></button>
                    <button onClick={() => updateElement(selectedElementId, { align: 'center' })} className={`flex-1 py-1 rounded ${getSelectedElement()?.style.align === 'center' ? 'bg-gray-600' : ''}`}><i className="fas fa-align-center text-xs"></i></button>
                    <button onClick={() => updateElement(selectedElementId, { align: 'right' })} className={`flex-1 py-1 rounded ${getSelectedElement()?.style.align === 'right' ? 'bg-gray-600' : ''}`}><i className="fas fa-align-right text-xs"></i></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="block text-xs text-gray-500 mb-1">Bg Color</label>
                      <input type="color" className="w-full h-8 rounded cursor-pointer bg-transparent" value={getSelectedElement()?.style.backgroundColor || '#ffffff'} onChange={(e) => updateElement(selectedElementId, { backgroundColor: e.target.value })} />
                   </div>
                   <div>
                      <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                      <input type="color" className="w-full h-8 rounded cursor-pointer bg-transparent" value={getSelectedElement()?.style.textColor || '#000000'} onChange={(e) => updateElement(selectedElementId, { textColor: e.target.value })} />
                   </div>
                </div>
              </div>

              <button 
                onClick={() => removeElement(selectedElementId)}
                className="w-full mt-6 bg-red-900/50 hover:bg-red-900 text-red-200 py-2 rounded text-xs font-bold transition-colors border border-red-900"
              >
                Delete Component
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <i className="fas fa-mouse-pointer text-3xl mb-3 opacity-30"></i>
              <p className="text-sm">Select a component on the preview to edit its properties.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
