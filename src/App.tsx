/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Upload, X } from 'lucide-react';
import TransitionView from './components/TransitionView';

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }, []);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }, []);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const clearImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-red-600/30">
      {/* Header */}
      <header className="p-8 flex items-center justify-between border-b border-neutral-900 border-dashed">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/40 transform -rotate-3">
            <span className="text-white font-bold text-xl leading-none">FB</span>
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight">Live Transition Studio</h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Overlay & VFX for Streamers</p>
          </div>
        </div>
        
        {imageUrl && (
          <button 
            onClick={clearImage}
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors py-2 px-3 bg-neutral-900 rounded-full"
          >
            <X size={14} />
            Change Source
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {!imageUrl ? (
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full max-w-xl aspect-[16/10] border-2 border-dashed border-neutral-800 rounded-[2rem] flex flex-col items-center justify-center gap-6 hover:border-red-600/50 transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800 group-hover:scale-110 transition-transform">
              <Upload className="text-neutral-500 group-hover:text-red-500 transition-colors" />
            </div>
            
            <div className="text-center space-y-2 px-6">
              <h2 className="text-xl font-medium tracking-tight">Import Your Media</h2>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                Drag and drop your transition image here, or browse your local files.
              </p>
            </div>

            <label className="mt-4 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer border border-neutral-700">
              Select Image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <TransitionView imageUrl={imageUrl} />
        )}
      </main>

      {/* Footer Instructions */}
      <footer className="p-8 text-center border-t border-neutral-900">
        <p className="text-[11px] text-neutral-600 uppercase tracking-[0.2em] font-medium max-w-lg mx-auto leading-relaxed">
          Diseñado para broadcast profesional. 
          Previsualiza el efecto de desenfoque progresivo antes de tu salida a Facebook Live.
        </p>
      </footer>
    </div>
  );
}
