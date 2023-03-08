import React from "react";
import { TextAnimated } from "./TextAnimated";

const STEPS = ["Inhale", "Hold", "Exhale", "Hold"];

export function StepIndicator(props: { step: number }) {
  return (
    <TextAnimated className="text-center">{STEPS[props.step]}</TextAnimated>
  );
}
