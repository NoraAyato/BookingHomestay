import { useCallback } from "react";
export function useReloadNavigate() {
  return useCallback((to) => {
    window.location.href = to;
  }, []);
}
