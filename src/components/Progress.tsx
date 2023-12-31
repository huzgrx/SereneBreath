import { useSpring, animated } from "@react-spring/web";
import { Time } from "@/components/Time";

export interface ProgressProps {
  onClose: () => void;
  duration: number;
  seconds: number;
}

const WIDTH = 150;
const HEIGHT = 90;

const strokeWidth = 15;

const M = {
  x: strokeWidth,
  y: 80,
};

const A = {
  rx: 30,
  ry: 30,
  axisRotation: 0,
  largeArcFlag: 0,
  sweepFlag: 1,
  x: 150 - strokeWidth,
  y: M.y,
};

const radius = (A.x - M.x) / 2;

const dashArray = 2 * Math.PI * (radius / 2);

const pathProps = {
  d: `M${M.x},${M.y} A${A.rx},${A.ry} ${A.axisRotation} ${A.largeArcFlag},${A.sweepFlag} ${A.x},${A.y}`,
  fill: "none",
  strokeWidth,
  strokeLinecap: "round",
} as const;

export function Progress({ onClose, duration, seconds }: ProgressProps) {
  const props = useSpring({
    from: {
      progress: dashArray,
    },
    to: {
      progress: 0,
    },
    config: {
      duration,
    },
  });

  const opacity = useSpring({
    from: {
      opacity: 1,
    },
    to: {
      opacity: seconds === 0 ? 0 : 1,
    },
  });

  return (
    <div className="relative flex flex-col items-center" style={{ width: 190 }}>
      <div>
        <animated.svg width={WIDTH} height={HEIGHT} style={opacity}>
          <path className="stroke-sky-200 " {...pathProps} />
          <animated.path
            className="stroke-blue-600 dark:stroke-blue-600"
            {...pathProps}
            strokeDasharray={dashArray}
            strokeDashoffset={props.progress}
          />
        </animated.svg>
        <div className="flex justify-center">
          <button
            className="absolute top-12 flex h-14 w-14 items-center justify-center rounded-full border border-gray-600  hover:opacity-50 dark:border-white dark:text-white"
            title="Close"
            onClick={onClose}
          >
            {closeIcon}
          </button>
        </div>
      </div>
      <animated.div
        className="mt-2 flex w-full justify-between"
        style={opacity}
      >
        <Time seconds={seconds} />
        <Time seconds={duration / 1000 - seconds} />
      </animated.div>
    </div>
  );
}

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
