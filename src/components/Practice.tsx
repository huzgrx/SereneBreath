import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

import { createExercise } from "@/modules/exercise";

import { StepIndicator } from "@/components/StepIndicator";
import { Animator } from "@/components/Animator";
import { Progress } from "@/components/Progress";

import * as animations from "@/animations";

import { useTranslation } from "@/hooks/useTranslation";

import { Pattern, Settings, Technique } from "@/config/types";

export interface PracticeProps {
  animation: Technique["animation"];
  guide: Settings["guide"];
  vibrateOnStepChange: Settings["vibration"];
  pattern: Pattern;
  seconds: number;
  onClose: () => void;
}

export function Practice({
  animation,
  guide,
  vibrateOnStepChange,
  pattern,
  seconds,
  onClose,
}: PracticeProps) {
  const { t } = useTranslation();

  const [data, setData] = useState({ seconds, step: 0 });

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
    const exercise = createExercise({
      seconds,
      pattern,
      vibration: vibrateOnStepChange,
      guide,
    });

    exercise.on("update", setData);

    exercise.on("end", () => {
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
    <div className="relative h-full w-full">
      <animated.div
        className="absolute flex h-full w-full items-center justify-center text-3xl font-bold dark:text-white"
        style={completeStyle}
      >
        <p>{t("complete")}</p>
      </animated.div>
      <animated.div
        className="flex h-full w-full flex-col items-center justify-between py-10 md:py-28"
        style={containerStyle}
      >
        <animated.div style={contentStyle}>
          <StepIndicator step={data.step} />
        </animated.div>
        <animated.div style={contentStyle}>
          <div className="">
            <Animator
              animation={animations[animation]}
              pattern={pattern}
              currentStep={data.step}
            />
          </div>
        </animated.div>
        <Progress
          seconds={data.seconds}
          duration={seconds * 1000}
          onClose={() => {
            completeSpring.start({
              opacity: 0,
              scale: 0,
            });

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
            });
          }}
        />
      </animated.div>
    </div>
  );
}
