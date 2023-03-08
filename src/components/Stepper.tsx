import React from "react";

export interface StepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
}: StepperProps) {
  return (
    <div className="inline-flex items-center">
      <Control
        title="Decrease"
        onClick={() => {
          if (value > min) {
            onChange(value - 1);
          }
        }}
      >
        {minusIcon}
      </Control>
      <p className="mx-2 w-4 text-center text-sm dark:text-white">{value}</p>
      <Control
        title="Increase"
        onClick={() => {
          if (value < max) {
            onChange(value + 1);
          }
        }}
      >
        {plusIcon}
      </Control>
    </div>
  );
}

const Control = (props) => (
  <button
    type="button"
    className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
    {...props}
  />
);

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
  </svg>
);

const minusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
  </svg>
);
