import { gsap } from 'gsap';

export const makeTimeline = () => {
  const tl = gsap.timeline();

  gsap.config({
    nullTargetWarn: false,
  });

  tl.from('.bg-full', {
    duration: 0.45,
    x: '0%',
    ease: 'power2.out',
  })
    .to('.bg-full', {
      duration: 0.75,
      opacity: 100,
      backgroundColor: '#fff333',
      ease: 'power2.out',
    })
    .to('.bg-full', {
      duration: 0.5,
      opacity: 0,
      y: '100%',
      ease: 'power2.out',
    });

  return tl;
};
