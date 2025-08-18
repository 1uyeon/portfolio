document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // html 불러오기
  const allElements = document.querySelectorAll('[data-include-path]');
  allElements.forEach(async el => {
    const includePath = el.dataset.includePath;
    try {
      const response = await fetch(includePath);
      if (response.ok) {
        const html = await response.text();
        el.outerHTML = html;
      } else {
        console.error(`❌ Failed to load: ${includePath} (status ${response.status})`);
      }
    } catch (err) {
      console.error(`🚨 Error loading ${includePath}:`, err);
    }
  });

  // Lenis (부드러운 스크롤 효과)
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    direction: 'vertical',
    gestureDirection: 'vertical'
  });
  // Lenis + gsap 연동
  lenis.on('scroll', ScrollTrigger.update);
  // 애니메이션 프레임 업데이트
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 헤더 네비게이션 클릭 시 이동
  const scrollMap = {
    '.go-home': '.main-sec',
    '.go-about': '.profile-sec',
    '.go-works': '.work-sec',
    '.go-contact': '.contact-sec'
  };
  Object.entries(scrollMap).forEach(([triggerSelector, targetSelector]) => {
    const trigger = document.querySelector(triggerSelector);
    if (trigger) {
      trigger.addEventListener('click', () => {
        lenis.scrollTo(targetSelector);
      });
    }
  });

  // work-detail 모달 관련
  const workDetail = document.querySelectorAll('.work-detail');
  const closeBtn = document.querySelectorAll('.btn-close'); 

  function getBodyScrollbarWidth() {  // body 스크롤 넓이 계산 함수
    return window.innerWidth - document.documentElement.offsetWidth;
  }
  function blockBodyScroll(className = 'modal-open') { // body 스크롤 비활성화 함수
    const isBlocked = document.body.classList.contains(className);
    if (isBlocked) return;
    document.body.style.setProperty('--scrollbar-width',  `${getBodyScrollbarWidth()}px`);
    document.body.classList.add(className);
    lenis.stop();
  }
  function unblockBodyScroll(className = 'modal-open') {  // body 스크롤 활성화 함수
    const isBlocked = document.body.classList.contains(className);
    if (!isBlocked) return;
    document.body.style.removeProperty('--scrollbar-width');
    document.body.classList.remove(className);
    lenis.start();
  }
  
  document.querySelectorAll('.work-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      workDetail.forEach(detail => {
        detail.classList.remove('active'); // 모든 work-detail의 active 제거
      });

      const num = index + 1;
      const classSuffix = num < 10 ? `0${num}` : `${num}`;
      const detailClass = `.detail-${classSuffix}`;
      const targetDetail = document.querySelector(detailClass);
      if (targetDetail) {
        targetDetail.classList.add('active');
        blockBodyScroll();
      }
    });
  });

  closeBtn.forEach(btn => { // 모달 close 버튼
    btn.addEventListener('click', function() {
      const workDetaileach = btn.closest('.work-detail');
      if (workDetaileach) {
        workDetaileach.classList.remove('active');
        unblockBodyScroll();
        workDetaileach.querySelector('.content-wrap').scrollTop = 0;
      }
    });
  });
  workDetail.forEach(detail => {  // 모달 외부 클릭 시 닫기
    detail.addEventListener('click', function() {
      const modalBox = detail.querySelector('.modal-box');
      if (!modalBox.contains(event.target)) {
        detail.classList.remove('active');
        unblockBodyScroll();
        modalBox.querySelector('.content-wrap').scrollTop = 0;
      }
    });
  });
});


document.fonts.ready.then(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

  // 텍스트 올라오는 효과
  gsap.set(".split", { opacity: 1 });

  let split;
  SplitText.create(".split", {
    type: "words,lines",
    linesClass: "line",
    autoSplit: true,
    mask: "lines",
    onSplit: (self) => {
      split = gsap.from(self.lines, {
        duration: 1.6,
        yPercent: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "expo.out",
      });
      return split;
    }
  });

  // 텍스트 랜덤 스크램블 효과
  const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const config = {
    random: true,
  }
  const links = document.querySelectorAll('.scramble')
  const scramble = (event) => {
    const target = event.target.firstElementChild
    if (!gsap.isTweening(target) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      gsap.to(target, {
        duration: .4,
        ease: 'sine.inOut',
        scrambleText: {
          text: target.innerText,
          speed: 2,
          chars: config.random ? defaultChars : target.innerText.replace(/\s/g, '')
        }
      });
    }
  }
  for (const link of links) {
    link.addEventListener('pointerenter', scramble)
    link.addEventListener('focus', scramble)
  }

  // 조준선 마우스 트래킹
  document.querySelector(".main-sec").addEventListener("mousemove", function (e) {
    const x = (e.clientX - window.innerWidth / 2) / 10;
    const y = (e.clientY - window.innerHeight / 2) / 10;

    gsap.to(".main-sec .sight-line .line-hr", { y: y });
    gsap.to(".main-sec .sight-line .line-vr", { x: x });
    gsap.to(".main-sec .sight-line .line-cross", { x: x , y: y });
  });

  // 스크롤 시 텍스트 채워짐
  const split2 = new SplitText(".sec-title h1", { type: "lines" });

  split2.lines.forEach((target) => {
    gsap.to(target, {
      backgroundPositionX: 0,
      ease: "sine.inOut",
      duration: 1,
      scrollTrigger: {
        trigger: target,
        scrub: 1,
        start: "top center",
        end: "bottom center"
      }
    });
  });

  // 한 글자씩 올라오는 효과
  const h1Text = new SplitType(".contact-now", {
    types: "words, chars",
  });
  const about = gsap
  .timeline({
    scrollTrigger: {
      trigger: ".contact-sec",
      start: "0% 80%",
      end: "100% 100%",
      // scrub: 0
    },
  })
  .from(".contact-now .char", { yPercent: 100, opacity: 0, stagger: 0.05, duration: 1, ease: "power3.out" }, "text")

  // iOS용 강제 리렌더링 함수
  function forceIOSRepaint() {
    if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
      document.body.style.display = 'none';
      document.body.offsetHeight; // reflow
      document.body.style.display = '';
    }
  }

  const white = ScrollTrigger.create({
    trigger: '.work-sec',
    start: "0% 30%",
    end: "bottom+=300 top",
    // endTrigger: "#footer",
    onEnter: () => {
      document.body.classList.add("white")
      forceIOSRepaint();
    },
    onLeaveBack: () => {
      document.body.classList.remove("white")
      forceIOSRepaint();
    }
  });
}); 