import { useState } from "react";
import { khaltiClient } from "../khaltiClient";

export function useKhalti({ onSuccess, onError, autoRedirect = true } = {}) {
  const [pidx, setPidx] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initiate = async (data) => {
    try {
      setIsLoading(true);
      const res = await khaltiClient.post("/epayment/initiate/", data);
      setPidx(res.data.pidx);
      if (autoRedirect) {
        window.location.href = res.data.payment_url;
      }
    } catch (err) {
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { initiate, isLoading };
}
