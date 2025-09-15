document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // 새로고침 시 최상단 시작
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // 배경 영상
  const bgVideo = document.querySelector(".bg-video-content");
  bgVideo.playbackRate = 5.0; // 5배속

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
    duration: 1.8,
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

  // 프로필 모달
  let headerPf = document.querySelector('.h-pf');
  let pfModal = document.querySelector('.pf-modal');
  let closeBtn = document.querySelector('.btn-close'); 

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
  
  // 모달 open
  headerPf.addEventListener('click', () => { 
    pfModal.classList.add('active');
    blockBodyScroll();
  });
  // 모달 close 버튼
  closeBtn.addEventListener('click', function() { 
    pfModal.classList.remove('active');
    unblockBodyScroll();
    pfModal.querySelector('.modal-box').scrollTop = 0;
  });
  // 모달 외부 클릭 시 닫기
  pfModal.addEventListener('click', function() {
    const modalBox = pfModal.querySelector('.modal-box');
    if (!modalBox.contains(event.target)) {
      pfModal.classList.remove('active');
      unblockBodyScroll();
      pfModal.querySelector('.modal-box').scrollTop = 0;
    }
  });
});

document.fonts.ready.then(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

  // 메인화면
  gsap.from(".big-text", {
    y: -200,           
    opacity: 0,        
    duration: 0.7,
    ease: "power2.out",
  });
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function() {
      gsap.to("header .big-text", {
        fontSize: "2vw",
        paddingLeft: "1.2vw",
        scrollTrigger: {
          trigger: ".profile-sec",
          start: "top top",
          end: "bottom 60%",
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    },
    "(max-width: 1023px)": function() {
      gsap.to("header .big-text", {
        fontSize: "5vw",
        paddingLeft: "2.5vw",
        scrollTrigger: {
          trigger: ".profile-sec",
          start: "top top",
          end: "bottom 60%",
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    }
  });

  gsap.fromTo(".black-area",
    { height: "100%" },
    { height: "80%", delay: 0.5, duration: 1, ease: "power2.out", clearProps: "height" }
  );
  gsap.from(".small-text", {
    y: "100%",
    delay: 1,
    duration: 0.7,
    opacity: 0,
    ease: "power2.out",
  });

  // 스크롤 시 텍스트 위로 올라가는 효과
  gsap.to(".up-of-text", {
  y: "-2500%", 
  scrollTrigger: {
    trigger: "body",
        start: "top 0%",
        end: "bottom 0%",
    scrub: true         
    }
  });

  // 스크롤 시 텍스트 채워지는 효과
  const split2 = new SplitText(".fill-text", { type: "lines" });
  split2.lines.forEach((target) => {
    gsap.to(target, {
      backgroundPositionX: "0%",
      ease: "sine.inOut",
      duration: 1,
      scrollTrigger: {
        trigger: target,
        scrub: 1,
        start: "top 80%",
        end: "bottom 60%"
      }
    });
  });
  gsap.to(".h-pf", {
    opacity: 1,
    duration: 0.5,   
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".cube-sec",
      start: "top 30%",
      toggleActions: "play none none reverse" 
    }
  });

  // cube 섹션
  gsap.fromTo(".cube-wrap",
    { scale: 0.1, },   // 처음 크기
    {
      scale: 1,       // 원래 크기
      ease: "none",
      scrollTrigger: {
        trigger: ".cube-sec",
        start: "top bottom",   // cube-sec 시작점이 화면 밑에 닿을 때부터
        end: "bottom bottom",     // cube-sec이 화면 가운데 올 때까지
        scrub: true,           
      }
    }
  );
  gsap.fromTo(".cube-wrap",
    { top : "-170%" },   // 시작 위치
    { 
      top: "50%",      // 중앙 기준
      ease: "none",
      scrollTrigger: {
        trigger: ".main-sec",
        start: "top top",          // main-sec 화면 시작할 때부터
        endTrigger: ".cube-sec",   // cube-sec 기준으로 끝 위치 지정
        end: "bottom bottom",         // cube-sec이 화면 중앙 올 때까지
        scrub: true,
      }
    }
  );
  gsap.set(".cube", {
    rotateX: 25,  // 처음 기울기
    rotateY: -30,
    rotateZ: 45
  });
  ScrollTrigger.create({
    trigger: ".cube-sec",
    start: "top top",
    end: "+=150%",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      const progress = self.progress;
      if (progress < 0.3) {
        const tiltX = gsap.utils.interpolate(25, 0, progress / 0.3);
        const tiltZ = gsap.utils.interpolate(45, 0, progress / 0.3);
        const tiltY = gsap.utils.interpolate(-30, 0, progress / 0.3);

        gsap.set(".cube", {
          rotateX: tiltX,
          rotateY: tiltY,
          rotateZ: tiltZ
        });
      } else {
        // 30% 이후 : 정면 상태 유지 + 가로로 회전
        const rotation = ((progress - 0.3) / 0.7) * 270; 
        gsap.set(".cube", {
          rotateX: 0,
          rotateY: rotation,
          rotateZ: 0
        });
      }
    }
  });

  // WORK 가로 슬라이드
  let workList = gsap.utils.toArray('.work-list .work-item');
  let workListWrapper = document.querySelector('.work-list');

  let listWidth = workListWrapper.scrollWidth;  // 전체 가로 길이(px)
  let viewWidth = window.innerWidth;            // 현재 화면 너비(px)
  let moveX = listWidth - viewWidth;            // 이동해야 할 거리(px)

  // 여유값(px) — 필요에 맞게 조절 가능
  let startOffset = 100;  // 시작 시 살짝 보이는 정도
  let endOffset = 50;     // 끝에서 조금 더 나오는 정도

  let scrollhoriz = gsap.timeline({
    scrollTrigger: {
      trigger: '.work-sec',
      pin: true,
      scrub: 1,
      start: 'center center',
      end: () => "+=" + (moveX + startOffset + endOffset), 
      invalidateOnRefresh: true
    }
  });

  // 리스트 전체를 오른쪽 바깥(살짝 보이는 상태) → 왼쪽 끝(조금 더 나오는 상태)까지 이동
  scrollhoriz.fromTo(
    workListWrapper,
    { x: () => window.innerWidth - startOffset },  // 시작: 화면 오른쪽에서 살짝 보임
    { x: () => -(moveX + endOffset), ease: 'none' }, // 끝: 마지막 아이템 조금 더 나옴
    0
  );

  // 창 크기 바뀔 때 다시 계산
  window.addEventListener("resize", () => {
    listWidth = workListWrapper.scrollWidth;
    viewWidth = window.innerWidth;
    moveX = listWidth - viewWidth;
    ScrollTrigger.refresh();
  });

  // 개별 아이템 회전 효과
  scrollhoriz.fromTo(".rot1",
    { rotate: -10 },
    { rotate: 20, ease: "none" },
    0
  );
  scrollhoriz.fromTo(".rot2",
    { rotate: 15 },
    { rotate: -10, ease: "none" },
    0
  );

  // 한 글자씩 올라오는 효과
  const h1Text = new SplitType(".contact-now", {
    types: "words, chars",
  });
  const about = gsap
  .timeline({
    scrollTrigger: {
      trigger: ".contact-sec",
      start: "top 80%",
      end: "bottom bottom",
      scrub: 1
    },
  })
  .from(".contact-now .char", { yPercent: 100, opacity: 0, stagger: 0.05, duration: 1, ease: "power3.out" }, "text")
}); 

// window.addEventListener('scroll', () => {
//   document.body.style.setProperty(
//     '--scroll',
//     window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
//   );
// }, false);