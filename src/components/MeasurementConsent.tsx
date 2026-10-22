import { useEffect } from "react";
import { loadPixel } from "../utils/atendimento";

export function MeasurementConsent() {
  useEffect(() => { loadPixel(); }, []);
  return null;
}
