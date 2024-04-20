"use client";

import { useEffect, useMemo, useState } from "react";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import CustomLink from "../atom/customLink";
import Icon from "../atom/icon";

const InDevelopment = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#ffffff",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#000000",
        },
        links: {
          color: "#000000",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <>
      <div
        style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      >
        {init ? (
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
          ></Particles>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col items-center md:flex-row">
        <Icon kind="me" className={"h-44 w-44"} />
        <div className="pl-10">
          <h1 className="text-5xl font-bold ">Uh oh...</h1>
          <p className="flex items-center pt-5 ">
            <span>The site is still under development !</span>
            <span className="pl-2">
              <Icon kind="wrenchAndHammer" className={"h-5 w-5"} />
            </span>
          </p>
          <span>the requested page is not available</span>

          <CustomLink
            href="/"
            className="flex items-center pb-1 pt-1 hover:underline"
          >
            Take me
            <span className="pl-2">
              <Icon kind="home" className={"h-24 w-24"} />
            </span>
          </CustomLink>
        </div>
      </div>
    </>
  );
};

export default InDevelopment;
