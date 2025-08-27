import { useGeminiVision } from "@/hooks/useGeminiVision";

export default function VisionControls() {
  const {
    captureWebcam,
    captureScreen,
    webcamImage,
    screenImage,
    isCapturing,
    clearImages,
    hasImages,
    setWebcamImage,
    setScreenImage
  } = useGeminiVision();

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🎥 Vision Controls
        </h3>
        {hasImages && (
          <button
            onClick={clearImages}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Capture Buttons */}
      <div className="flex gap-2">
        <button
          onClick={captureWebcam}
          disabled={isCapturing}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCapturing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Capturing...
            </>
          ) : (
            <>
              📷 Webcam
            </>
          )}
        </button>

        <button
          onClick={captureScreen}
          disabled={isCapturing}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCapturing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Capturing...
            </>
          ) : (
            <>
              🖥️ Screen
            </>
          )}
        </button>
      </div>

      {/* Image Previews */}
      {hasImages && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Captured Images:</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Webcam Preview */}
            {webcamImage && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Webcam</label>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={webcamImage}
                    alt="Webcam capture"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => webcamImage && setWebcamImage(null)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Screen Preview */}
            {screenImage && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Screen</label>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenImage}
                    alt="Screen capture"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => screenImage && setScreenImage(null)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
            💡 <strong>Tip:</strong> These images will be automatically included in your next message to Gemini. 
            The AI will see and analyze whatever you've captured.
          </div>
        </div>
      )}

      {/* No Images State */}
      {!hasImages && (
        <div className="text-center text-gray-500 py-4">
          <p className="text-sm">No images captured yet</p>
          <p className="text-xs mt-1">Use the buttons above to capture webcam or screen</p>
        </div>
      )}
    </div>
  );
}
