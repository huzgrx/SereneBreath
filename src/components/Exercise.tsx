import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

import { exerciseManager } from "../modules/ExerciseManager";
import { AudioManager } from "../modules/AudioManager";

import { Time } from "./Time";
import { StepIndicator } from "./StepIndicator";
import { CircleAnimation } from "./CircleAnimation";

import { Pattern, Settings } from "../config/types";
import { useTranslation } from "../hooks/useTranslation";

export interface ExerciseProps {
  guide: Settings["guide"];
  vibrateOnStepChange: Settings["vibration"];
  pattern: Pattern;
  seconds: number;
  onClose: () => void;
}

export function Exercise({
  guide,
  vibrateOnStepChange,
  pattern,
  seconds,
  onClose,
}: ExerciseProps) {
  const { t } = useTranslation();

  const [data, setData] = useState({ seconds, step: 0 });

  const getTracks = (): [string, string, string] => {
    if (guide === "bell") {
      return ["/bell_1.mp3", "/bell_2.mp3", "/bell_1.mp3"];
    }

    if (guide === "disabled") {
      return ["", "", ""];
    }

    return [
      t(`audio.${guide}.inhale`),
      t(`audio.${guide}.hold`),
      t(`audio.${guide}.exhale`),
    ];
  };

  const audioRef = useRef(new AudioManager(getTracks()));

  const [containerStyle, containerSpring] = useSpring(() => ({
    from: {
      opacity: 0,
      scale: 1,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
  }));

  const [contentStyle, contentSpring] = useSpring(() => ({
    from: {
      opacity: 1,
    },
  }));

  const [completeStyle, completeSpring] = useSpring(() => ({
    from: {
      opacity: 0,
      scale: 0,
    },
  }));

  useEffect(() => {
    const audio = audioRef.current;
    const exercise = exerciseManager(seconds, pattern);

    exercise.on("update", setData);

    exercise.on("step", (step) => {
      audioRef.current.playStep(step);

      if (vibrateOnStepChange) {
        navigator.vibrate(200);
      }
    });

    exercise.on("end", () => {
      if (vibrateOnStepChange) {
        navigator.vibrate(2000);
      }

      audio.playBell();

      contentSpring.start({
        to: {
          opacity: 0,
        },
        onResolve: () =>
          completeSpring.start({
            to: {
              opacity: 1,
              scale: 1,
            },
          }),
      });
    });

    exercise.start();

    return () => exercise.destroy();
  }, []);

  return (
    <animated.div
      className="flex h-full w-full flex-col items-center justify-center"
      style={containerStyle}
    >
      <div className="relative">
        <animated.div
          className="absolute flex h-full w-full items-center justify-center text-3xl font-bold dark:text-white"
          style={completeStyle}
        >
          <p>{t("complete")}</p>
        </animated.div>
        <animated.div style={contentStyle}>
          <Time seconds={data.seconds} />
          <div className="mt-10 mb-10">
            <CircleAnimation pattern={pattern} currentStep={data.step} />
          </div>
          <StepIndicator step={data.step} />
        </animated.div>
      </div>
      <div className="mt-20 flex justify-center">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 hover:opacity-50 dark:border-white dark:text-white"
          title="Close"
          onClick={() =>
            containerSpring.start({
              from: {
                opacity: 1,
                scale: 1,
              },
              to: {
                opacity: 0,
                scale: 1,
              },
              onResolve: () => onClose(),
            })
          }
        >
          {closeIcon}
        </button>
      </div>
    </animated.div>
  );
}

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
