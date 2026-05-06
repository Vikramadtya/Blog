"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

const BackGroundParticle = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, [theme]);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true, // makes sure it covers the screen
        zIndex: -1, // lowest layer
      },
      background: {
        color: {
          value: theme === "light" ? "#ffffff" : "#000000",
        },
      },
      particles: {
        color: {
          value: theme === "light" ? "#000000" : "#ffffff",
        },
        links: {
          enable: true,
          color: theme === "light" ? "#000000" : "#ffffff",
          distance: 150,
          opacity: 0.5,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          outModes: {
            default: "bounce",
          },
        },
        number: {
          value: 60,
          density: {
            enable: true,
            area: 800,
          },
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.4,
        },
        size: {
          value: { min: 1, max: 4 },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      detectRetina: true,
    }),
    [theme],
  );

  return <>{init && <Particles id="tsparticles" options={options} />}</>;
};

export default BackGroundParticle;
