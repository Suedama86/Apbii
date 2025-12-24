import React from 'react';
import { AppState, AppElement } from '../types';

interface PhonePreviewProps {
  appState: AppState;
  onSelectElement: (id: string) => void;
  selectedId: string | null;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ appState, onSelectElement, selectedId }) => {
  
  const renderImageContent = (src?: string, alt: string = "Image") => {
    if (!src) {
      return (
        <div className="w-full h-full min-h-[150px] bg-gray-200 flex flex-col items-center justify-center text-gray-400 rounded-lg">
          <i className="fas fa-image text-2xl mb-2"></i>
          <span className="text-xs">No Image Selected</span>
        </div>
      );
    }
    
    if (src.startsWith('GENERATE_IMAGE:')) {
      return (
        <div className="w-full h-full min-h-[150px] bg-gray-100 flex flex-col items-center justify-center text-indigo-500 animate-pulse rounded-lg">
          <i className="fas fa-magic text-2xl mb-2 fa-spin"></i>
          <span className="text-xs font-medium">Generating AI Asset...</span>
        </div>
      );
    }

    return (
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover rounded-lg shadow-sm"
      />
    );
  };

  const renderElement = (el: AppElement) => {
    const isSelected = selectedId === el.id;
    const baseClasses = `cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-blue-300`;
    
    switch (el.type) {
      case 'header':
        return (
          <div 
            key={el.id} 
            className={`${baseClasses} p-4 shadow-sm`}
            style={{ backgroundColor: el.style.backgroundColor || appState.themeColor, color: el.style.textColor || 'white', textAlign: el.style.align as any || 'left' }}
            onClick={() => onSelectElement(el.id)}
          >
            <h1 className="text-xl font-bold">{el.content.title}</h1>
            {el.content.subtitle && <p className="text-sm opacity-90">{el.content.subtitle}</p>}
          </div>
        );
      case 'hero':
        return (
          <div 
            key={el.id} 
            className={`${baseClasses} relative overflow-hidden h-48 flex items-end p-0`}
            onClick={() => onSelectElement(el.id)}
          >
             <div className="absolute inset-0 w-full h-full z-0">
               {renderImageContent(el.content.src, "Hero")}
             </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none"></div>
            <div className="relative z-20 text-white p-4 w-full">
              <h2 className="text-2xl font-bold">{el.content.title}</h2>
              <p className="text-sm">{el.content.subtitle}</p>
            </div>
          </div>
        );
      case 'text':
        return (
          <div 
            key={el.id} 
            className={`${baseClasses} p-4`}
            style={{ 
              textAlign: el.style.align as any || 'left', 
              color: el.style.textColor || '#333',
              backgroundColor: el.style.backgroundColor || 'transparent'
            }}
            onClick={() => onSelectElement(el.id)}
          >
            <p className="leading-relaxed">{el.content.text}</p>
          </div>
        );
      case 'image':
        return (
           <div key={el.id} className={`${baseClasses} p-2`} onClick={() => onSelectElement(el.id)}>
              {renderImageContent(el.content.src)}
           </div>
        );
      case 'button':
        return (
          <div key={el.id} className={`${baseClasses} p-4 flex justify-${el.style.align === 'center' ? 'center' : el.style.align === 'right' ? 'end' : 'start'}`} onClick={() => onSelectElement(el.id)}>
            <button 
              className="px-6 py-3 rounded-full font-semibold shadow-md transform active:scale-95 transition-transform"
              style={{ backgroundColor: el.style.backgroundColor || appState.themeColor, color: el.style.textColor || 'white' }}
            >
              {el.content.label}
            </button>
          </div>
        );
      case 'product':
        return (
          <div key={el.id} className={`${baseClasses} p-2`} onClick={() => onSelectElement(el.id)}>
            <div className="flex bg-white rounded-lg p-3 shadow-md items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                 {renderImageContent(el.content.src, "Product")}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{el.content.title || 'Product Name'}</h4>
                <p className="text-gray-500 text-xs">{el.content.subtitle || 'Description goes here'}</p>
              </div>
              <div className="font-bold text-green-600">{el.content.price || '$99'}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center h-full py-8">
      <div className="phone-frame w-[320px] h-[650px] bg-white relative flex flex-col">
        {/* Status Bar */}
        <div className="h-6 bg-black text-white text-[10px] px-4 flex justify-between items-center z-50">
          <span>9:41</span>
          <div className="flex gap-1">
            <i className="fas fa-signal"></i>
            <i className="fas fa-wifi"></i>
            <i className="fas fa-battery-full"></i>
          </div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-gray-50">
          {appState.elements.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <i className="fas fa-plus-circle text-4xl mb-4 text-gray-300"></i>
              <p>Add components or ask AI to build your app</p>
            </div>
          ) : (
            appState.elements.map(renderElement)
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full z-50 opacity-20"></div>
      </div>
    </div>
  );
};
