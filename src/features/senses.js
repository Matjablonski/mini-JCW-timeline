/* eslint-disable no-unused-vars */
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CustomWiggle } from 'gsap/CustomWiggle'

gsap.registerPlugin(CustomEase, CustomWiggle)

const screen = document.querySelector('.screen'),
      speedText = screen.querySelector('.speed_text'),
      speedGauge = document.getElementById('speed'),
      powerGauge = document.getElementById('power'),
      needle = screen.querySelector('.needle_wrap'),
      background = document.querySelector('.senses_background'),
      ease = 'expo.out'

CustomWiggle.create('shake', { wiggles: 600 })

export function senses() {

  const accelerate = accelerateTimeline(),
        rpm = rpmTimeline(),
        shake = shakeTimeline()

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

}

// Timelines

function accelerateTimeline() {
  const timeline = gsap.timeline({ 
    paused: true,
    defaults: {
      duration: 30,
      ease: ease,
    },
    onUpdate: () => {
      const parseEase = gsap.parseEase(ease);
      const easedProgress = parseEase(timeline.progress());
      const currentSpeed = Math.round(easedProgress * 220);
      speedText.textContent = currentSpeed;
    }
  })
  timeline.fromTo(needle, {
    rotation: -134,
  }, {
    rotation: 136,
  })
  .to(speedGauge, {
    strokeDashoffset: 0
  }, 0)

  return timeline
}

function rpmTimeline() {
  const arrows = screen.querySelectorAll('.power_arrows .arrow')
  const timeline = gsap.timeline({ 
    paused: true,
    defaults: {
      duration: 0.4,
    },
    onUpdate: () => {
      const progress = timeline.progress();
      const total = arrows.length;
      const activeIndex = Math.min(Math.floor(progress * total), total - 1);

      arrows.forEach((arrow, i) => {
        arrow.classList.toggle('is-active', i <= activeIndex);
        arrow.classList.toggle('is-red', i === activeIndex);
      });
    }
  })
  timeline.to(powerGauge, {
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

  return timeline
}

function shakeTimeline() {
  const timeline = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: {
      ease: 'shake',
      duration: 30,
    }
  })
  timeline.to(screen, {
    y: 1,
  })
  .to(background, {
    x: -2,
  }, 0)

  return timeline
}
