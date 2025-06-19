/* eslint-disable no-unused-vars */
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CustomWiggle } from 'gsap/CustomWiggle'

gsap.registerPlugin(CustomEase, CustomWiggle)

const screen = document.querySelector('.screen'),
      button = document.querySelector('.senses_button'),
      shadow = document.querySelector('.screen_shadow'),
      speedText = screen.querySelector('.speed_text'),
      speedGauge = document.getElementById('speed'),
      powerGauge = document.getElementById('power'),
      needle = screen.querySelector('.needle_wrap'),
      background = document.querySelector('.senses_background'),
      ease = 'power4.out'

CustomWiggle.create('shake', { wiggles: 600 })
CustomWiggle.create('blur', { wiggles: 800, type: 'random' })

export function senses() {

  const accelerate = accelerateTimeline(),
        rpm = rpmTimeline(),
        shake = shakeTimeline()

  button.addEventListener('pointerdown', () => {
    accelerate.timeScale(1).play()
    rpm.timeScale(1).play()
    shake.play()
  })
  button.addEventListener('pointerup', () => {
    if (accelerate.progress() >= 0.3) {
      console.log('you are too fast!')
      accelerate.timeScale(5).reverse()
    } else {
      accelerate.timeScale(0.5).reverse()
    }
    rpm.timeScale(0.3).reverse()
    shake.progress(0).pause()
  })

}

// Timelines

function accelerateTimeline() {
  const timeline = gsap.timeline({ 
    paused: true,
    defaults: {
      duration: 40,
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
      ease: 'expo.inOut'
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
    scale: 0.92,
    filter: 'brightness(0.9)',
  }, 0)
  .to(background, {
    scale: 0.8,
    autoAlpha: 0.5,
  }, 0)
  .to(shadow, {
    filter: 'blur(120px)',
    scale: 1.2,
    backgroundColor: '#ff0300',
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
    x: 0.5,
    rotation: 0.1,
  })
  .to(screen, {
    filter: 'blur(1.5px)',
    ease: 'blur',
  }, 0)

  return timeline
}
