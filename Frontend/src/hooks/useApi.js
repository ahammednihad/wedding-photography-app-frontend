import { useState, useCallback } from "react";
import { getErrorMessage } from "../utils/helpers";

// Custom hook for API calls with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      if (onSuccess) {
        onSuccess(response.data);
      }
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { execute, loading, error, reset };
};
