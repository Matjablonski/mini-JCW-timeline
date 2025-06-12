import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Vars
const section = document.getElementById('timeline-intro')
const introContainer = section.querySelector('.intro_container')
const imgContainers = section.querySelectorAll('.timeline_images')

// Rotate all images in circle
function setImagesRotation() {
  imgContainers.forEach((container) => {
    const wrappers = [...container.querySelectorAll('.image_wrap')]
    const calDeg = 360 / wrappers.length
    wrappers.forEach((wrap, index) => {
      wrap.style.transform = `translate(-50%, 0%) rotate(${calDeg * index}deg)`
    })
  })
  gsap.set(imgContainers[1], { scale: 0.62 })
}

// Animate the rotation of all images
// This is rotating both wrappers clockwise and counter-clockwise respectively
function animateRotation() {
  const timeline = gsap.timeline({
    defaults: {
      duration: 60,
      ease: 'none',
      repeat: -1,
    },
  })
  imgContainers.forEach((container, index) => {
    timeline.to(
      container,
      {
        rotation: index === 0 ? 360 : -360,
      },
      index === 0 ? 0 : '<'
    )
  })

  return timeline
}

// Setup scrolling animation
function timelineAnimation() {
  // Parallax entrance timeline
  gsap.from(introContainer, {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section.start',
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
  // Intro timeline
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=300%',
      scrub: 0.5,
      pin: introContainer,
    },
    defaults: {
      ease: 'power2.inOut',
    },
  })
  timeline
    .to(
      imgContainers,
      {
        scale: 2,
        stagger: 0.05,
      },
      '+=15%'
    )
    .to(
      '.timeline_images_wrap',
      {
        rotation: -90,
      },
      '<'
    )
    .to(
      '.timeline_header_wrap',
      {
        scale: 1.2,
      },
      '<'
    )
    .to(
      '.timeline_header_wrap',
      {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      '<'
    )
    .from(
      '.timeline_container',
      {
        opacity: 0,
        ease: 'power2.out',
      },
      '<+=0.2'
    )
}

function timelineEntrance() {
  gsap.set('.timeline_container', { marginTop: '-300vh', zIndex: 0 })
  const sections = document.querySelectorAll('.timeline_item')

  // Setup horizontal scroll
  const horizontalScroll = gsap.to(sections, {
    xPercent: -100 * sections.length,
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline_container',
      start: 'top top',
      end: `+=${sections.length * 2000}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
    },
  })

  // Master timeline to add vertical animation depending on the section position
  const master = gsap.timeline()

  const createSectionTimeline = (section, yPercent) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'left right',
        end: 'right right',
        containerAnimation: horizontalScroll,
        scrub: true,
      },
    })
    timeline.to('.timeline_section', {
      yPercent,
      ease: 'none',
    })
    master.add(timeline)
  }

  sections.forEach((section) => {
    const yPercent = section.classList.contains('is-top')
      ? 15
      : section.classList.contains('is-bottom')
      ? -15
      : 0
    createSectionTimeline(section, yPercent)
  })
}

window.addEventListener('load', () => {
  setImagesRotation()
  animateRotation()
  timelineAnimation()
  timelineEntrance()
  ScrollTrigger.refresh()
})
