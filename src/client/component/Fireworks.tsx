import * as React from 'react';
import { useRef, useEffect } from 'react';

import * as FireworksCanvas from 'fireworks-canvas'

export const FireWorks = () => {
  const fireworkRef = useRef(null);

  useEffect(() => {
    if (fireworkRef.current) {
      const options = {
        maxRockets: 6,
        explosionChance: 0.5,
        numParticles: 200, // number of particles to spawn when rocket explodes (+0-10)
        explosionMinHeight: 0.8, // percentage. min height at which rockets can explode
        explosionMaxHeight: 0.9, // percentage. max height before a particle is exploded
      }
      // @ts-ignore
      const fire = new FireworksCanvas(fireworkRef.current, options)
      fire.start()
    }
  }, [])

  return (
    <div id="canvas" ref={fireworkRef} />
  )
}
