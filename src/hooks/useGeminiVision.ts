import { useState, useCallback, useRef } from 'react';

interface VisionState {
  webcamImage: string | null;
  screenImage: string | null;
  isCapturing: boolean;
  error: string | null;
}

export const useGeminiVision = () => {
  const [state, setState] = useState<VisionState>({
    webcamImage: null,
    screenImage: null,
    isCapturing: false,
    error: null
  });

  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Capture webcam image
  const captureWebcam = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isCapturing: true, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        } 
      });
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        await new Promise(resolve => {
          if (webcamRef.current) {
            webcamRef.current.onloadedmetadata = resolve;
          }
        });
        
        // Capture frame
        if (canvasRef.current && webcamRef.current) {
          const canvas = canvasRef.current;
          const video = webcamRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setState(prev => ({ 
              ...prev, 
              webcamImage: imageData, 
              isCapturing: false 
            }));
          }
        }
        
        // Stop stream
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to capture webcam',
        isCapturing: false 
      }));
    }
  }, []);

  // Capture screen image
  const captureScreen = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isCapturing: true, error: null }));
      
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        } 
      });
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        await new Promise(resolve => {
          if (webcamRef.current) {
            webcamRef.current.onloadedmetadata = resolve;
          }
        });
        
        // Capture frame
        if (canvasRef.current && webcamRef.current) {
          const canvas = canvasRef.current;
          const video = webcamRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setState(prev => ({ 
              ...prev, 
              screenImage: imageData, 
              isCapturing: false 
            }));
          }
        }
        
        // Stop stream
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to capture screen',
        isCapturing: false 
      }));
    }
  }, []);

  // Send vision message to Gemini
  const sendVisionMessage = useCallback(async (message: string, images?: string | string[]) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // This would integrate with your Gemini API
      // For now, just log the message and images
      console.log('Sending vision message:', message);
      if (images) {
        if (Array.isArray(images)) {
          console.log('Multiple images received:', images.length);
          images.forEach((img, index) => {
            console.log(`Image ${index + 1} data length:`, img.length);
          });
        } else {
          console.log('Single image data length:', images.length);
        }
      }
      
      // TODO: Implement actual Gemini API call
      return 'Vision message sent (mock implementation)';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send vision message';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  }, []);

  // Clear images
  const clearImages = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      webcamImage: null, 
      screenImage: null 
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    captureWebcam,
    captureScreen,
    sendVisionMessage,
    clearImages,
    clearError,
    webcamRef,
    canvasRef
  };
};
