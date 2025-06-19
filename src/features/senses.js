/* eslint-disable no-unused-vars */
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CustomWiggle } from 'gsap/CustomWiggle'

gsap.registerPlugin(CustomEase, CustomWiggle)

export function senses() {
  const screen = document.querySelector('.screen'),
    speedText = screen.querySelector('.speed_text'),
    speedGauge = document.getElementById('speed'),
    powerGauge = document.getElementById('power'),
    needle = screen.querySelector('.needle_wrap'),
    background = document.querySelector('.senses_background'),
    ease = 'expo.out'

  screen.addEventListener('pointerdown', () => {
    accelerate.timeScale(1).play()
    rpm.timeScale(1).play()
    shake.play()
  })
  screen.addEventListener('pointerup', () => {
    accelerate.timeScale(0.5).reverse()
    rpm.timeScale(0.3).reverse()
    shake.progress(0).pause()
  })

  const accelerate = gsap.timeline({ 
    paused: true,
    defaults: {
      duration: 30,
      ease: ease,
    },
    onUpdate: () => {
      const parseEase = gsap.parseEase(ease);
      const easedProgress = parseEase(accelerate.progress());
      const currentSpeed = Math.round(easedProgress * 220);
      speedText.textContent = currentSpeed;
    }
  })
  accelerate.fromTo(needle, {
    rotation: -134,
  }, {
    rotation: 136,
  })
  .to(speedGauge, {
    strokeDashoffset: 0
  }, 0)

  CustomWiggle.create('shake', { wiggles: 600 })

  const rpm = gsap.timeline({ 
    paused: true,
    defaults: {
      duration: 0.4,
      // ease: 'power2.inOut',
    }
  })
  rpm.to(powerGauge, {
    strokeDashoffset: 0,
  })
  .from(screen, {
    scale: 0.9,
    ease: 'expo.out'
  }, 0)
  .to(background, {
    scale: 1.2,
    ease: 'expo.out',
    filter: 'blur(80px)'
  }, 0)

  const shake = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: {
      ease: 'shake',
      duration: 30,
    }
  })
  shake.to(screen, {
    y: 1,
  })
  .to(background, {
    x: -2,
  }, 0)

}