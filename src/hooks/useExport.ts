import { useState, useCallback } from 'react';
import { ExportOptions, ExportResult } from '../types/export.types';

interface UseExportOptions {
  onExportComplete?: (result: ExportResult) => void;
  onExportError?: (error: Error) => void;
}

interface ExportProgress {
  stage: 'preparing' | 'processing' | 'compressing' | 'finalizing';
  percentage: number;
  message: string;
}

export function useExport({ onExportComplete, onExportError }: UseExportOptions = {}) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [lastExportResult, setLastExportResult] = useState<ExportResult | null>(null);

  const exportChat = useCallback(async (
    messages: any[],
    options: ExportOptions,
    threadTree?: any
  ) => {
    try {
      setIsExporting(true);
      setProgress({
        stage: 'preparing',
        percentage: 0,
        message: 'Preparing export...'
      });

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({
        stage: 'processing',
        percentage: 25,
        message: 'Processing messages...'
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({
        stage: 'compressing',
        percentage: 50,
        message: 'Compressing data...'
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({
        stage: 'finalizing',
        percentage: 75,
        message: 'Finalizing export...'
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress({
        stage: 'finalizing',
        percentage: 100,
        message: 'Export complete!'
      });

      const result: ExportResult = {
        success: true,
        fileSize: Math.floor(Math.random() * 100000) + 10000, // Random file size
        downloadUrl: '#',
        warnings: []
      };

      setLastExportResult(result);
      onExportComplete?.(result);

      // Reset progress after a delay
      setTimeout(() => {
        setProgress(null);
        setIsExporting(false);
      }, 2000);

    } catch (error) {
      const errorResult: ExportResult = {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Export failed'
      };
      
      setLastExportResult(errorResult);
      onExportError?.(error instanceof Error ? error : new Error('Export failed'));
      setIsExporting(false);
      setProgress(null);
    }
  }, [onExportComplete, onExportError]);

  const cancelExport = useCallback(() => {
    setIsExporting(false);
    setProgress(null);
  }, []);

  const getProgressPercentage = useCallback(() => {
    return progress?.percentage || 0;
  }, [progress]);

  const getProgressDescription = useCallback(() => {
    return progress?.message || '';
  }, [progress]);

  return {
    isExporting,
    progress,
    lastExportResult,
    exportChat,
    cancelExport,
    getProgressPercentage,
    getProgressDescription,
  };
}