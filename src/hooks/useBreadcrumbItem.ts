import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export function useBreadcrumbItem(label: string) {
  const location = useLocation();
  const { setCustomLabel } = useBreadcrumb();

  useEffect(() => {
    setCustomLabel(location.pathname, label);
  }, [label, location.pathname, setCustomLabel]);
}
