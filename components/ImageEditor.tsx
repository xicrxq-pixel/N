
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) return;
    setLoading(true);
    
    const matches = sourceImage.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const result = await editImageWithGemini(base64Data, prompt, mimeType);
      if (result) setEditedImage(result);
      else alert("عذراً، لم أستطع تعديل الصورة.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white shadow-xl rounded-[40px] w-full p-8 border-t-8 border-pink-200">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-2">محرر الصور الأنيق</h2>
        <p className="text-pink-300 text-center mb-8 font-medium italic">"لمسات سحرية لصورك الجميلة"</p>

        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center border-4 border-dashed border-pink-50 rounded-[35px] p-6 bg-pink-50/20 min-h-[300px] relative overflow-hidden">
            {!sourceImage && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center text-pink-200 hover:text-pink-400 transition-colors"
              >
                <i className="fas fa-wand-magic-sparkles text-6xl mb-4"></i>
                <span className="text-lg font-bold">ارفعي صورتك هنا</span>
              </button>
            )}

            {sourceImage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-pink-200 uppercase text-center">قبل</p>
                  <img src={sourceImage} alt="Original" className="rounded-[25px] max-h-64 mx-auto object-contain shadow-md border-2 border-white" />
                </div>
                {editedImage && (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="text-xs font-bold text-pink-400 uppercase text-center">بعد السحر</p>
                    <img src={editedImage} alt="Edited" className="rounded-[25px] max-h-64 mx-auto object-contain shadow-md border-4 border-pink-100" />
                  </div>
                )}
                {!editedImage && loading && (
                  <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
                    <p className="mt-4 text-pink-300 font-bold">جاري إضافة اللمسات السحرية...</p>
                  </div>
                )}
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="space-y-3 text-right">
            <label className="text-sm font-bold text-gray-500 block px-1">ما هو تعديلك المطلوب؟</label>
            <input 
              type="text"
              placeholder="مثال: أضيفي إضاءة وردية، حوليها للوحة فنية..."
              className="w-full p-4 bg-pink-50/20 border-2 border-pink-50 rounded-[20px] focus:outline-none focus:border-pink-300 transition-all text-gray-700 text-right"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="flex gap-4">
             <button
                disabled={!sourceImage || !prompt || loading}
                onClick={handleEdit}
                className="flex-1 py-4 bg-pink-300 text-white font-bold rounded-[20px] shadow-lg shadow-pink-50 hover:bg-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'سحر جاري...' : 'تعديل الصورة'}
              </button>
              {sourceImage && (
                <button
                  onClick={() => { setSourceImage(null); setEditedImage(null); setPrompt(''); }}
                  className="px-6 py-4 bg-pink-50 text-pink-300 font-bold rounded-[20px] hover:bg-pink-100 transition-all border border-pink-100"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
