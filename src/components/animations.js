import { gsap } from 'gsap';
gsap.config({
  nullTargetWarn: false,
});

export const makeStartTimeline = () => {
  const tl = gsap.timeline();

  tl.to('.animation-bg', {
    duration: 0,
    zIndex: 1000,
    opacity: 0,
    yPercent: 100,
    ease: 'power2.out',
  }).to('.animation-bg', {
    duration: 0.5,
    opacity: '100%',
  });

  return tl;
};

export const makeEndTimeline = () => {
  const tl = gsap.timeline();

  tl.to('.animation-bg', {
    duration: 0.5,
    opacity: 0,
    ease: 'power4.out',
  })
  .to('.animation-bg', {
    duration: 0,
    yPercent: -100,
    zIndex: -1,
    ease: 'power2.in',
  });

  return tl;
};

export const makeFullTimeline = () => {
  const tl = gsap.timeline();

  tl.to('.animation-bg', {
    duration: 0,
    zIndex: 1000,
    opacity: 0,
    yPercent: 100,
    ease: 'power2.out',
  })
    .to('.animation-bg', {
      duration: 0.5,
      opacity: '100%',
    })
    .to('.animation-bg', {
      duration: 0.5,
      opacity: 0,
      ease: 'power4.out',
    })
    .to('.animation-bg', {
      duration: 0,
      yPercent: -100,
      zIndex: -1,
      ease: 'power2.in',
    });
  return tl;
};
