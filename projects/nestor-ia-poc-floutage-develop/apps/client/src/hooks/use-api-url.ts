import { useEffect, useState } from 'react';

const DETECT_API_URL = 'detect_api_url';
const PREDICT_API_URL = 'predict_api_url';

export function useApiUrl() {
  const [detectApiUrl, setDetectApiApiUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DETECT_API_URL) || 'http://localhost:5050/detect';
    }
    return 'http://localhost:5050/detect';
  });

  const [predictApiUrl, setPredictApiUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PREDICT_API_URL) || 'http://localhost:5050/predict';
    }
    return 'http://localhost:5050/predict';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && detectApiUrl) {
      localStorage.setItem(DETECT_API_URL, detectApiUrl);
    }

    if (typeof window !== 'undefined' && predictApiUrl) {
      localStorage.setItem(PREDICT_API_URL, predictApiUrl);
    }
  }, [detectApiUrl, predictApiUrl]);

  return { detectApiUrl, setDetectApiApiUrl, predictApiUrl, setPredictApiUrl };
}
