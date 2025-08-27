import React, { useState } from 'react';
import { useVoiceMode } from '../hooks/useVoiceMode';

export default function VoiceTestPage() {
  const { 
    transcript, 
    transcriptArray,
    isRecording, 
    isConnected,
    error, 
    startRecording, 
    stopRecording, 
    clearTranscript, 
    clearError 
  } = useVoiceMode();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🎤 Voice Mode Test</h1>
        
        {/* Voice Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Voice Controls</h2>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Recording
            </button>
            
            <button
              onClick={clearTranscript}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Transcript
            </button>
          </div>

          {/* Status */}
          <div className="text-sm text-gray-300 mb-4">
            <p><strong>Status:</strong> {isRecording ? '🔴 Recording' : '⚪ Idle'}</p>
            {error && (
              <p className="text-red-400 mt-2">
                <strong>Error:</strong> {error}
                <button 
                  onClick={clearError}
                  className="ml-2 text-red-300 hover:text-red-100 underline"
                >
                  Clear
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Live Transcript</h2>
          
          <div className="bg-gray-700 rounded p-4 min-h-[200px] space-y-2">
            <div>
              <strong className="text-green-300">AI Response:</strong>
              {transcript ? (
                <p className="text-white ml-2 text-lg">{transcript}</p>
              ) : (
                <p className="text-gray-400 italic ml-2">Speak and the AI will respond...</p>
              )}
            </div>
            
            <div className="mt-4 p-2 bg-gray-600 rounded text-xs">
              <strong>Debug Info:</strong>
              <br />
              WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              <br />
              isRecording: {isRecording.toString()}
              <br />
              error: {error || 'none'}
              <br />
              transcript chunks: {transcriptArray.length}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-300">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-200">
            <li>Click "Start Recording" and allow microphone access</li>
            <li>Speak into your microphone</li>
            <li>Click "Stop Recording" when done</li>
            <li>Check the transcript below</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
