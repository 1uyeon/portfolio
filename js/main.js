// 브라우저가 스크롤 위치를 기억하지 않게 설정
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
// 새로고침이나 이동 시 항상 맨 위로
window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // 로딩페이지
  const percentEl = document.getElementById("percent");
  const loader = document.getElementById("loader");
  let percent = 0;

  gsap.fromTo(
    percentEl,
    { y: '150%'},   // 시작 상태
    { y: '0',  duration: 1, ease: "power2.out" } // 끝 상태
  );

  function updatePercent() {
    percent++;
    percentEl.textContent = percent;

    if (percent < 100) {
      const progress = percent / 100;

      // 기본 딜레이 (앞은 빠르고 뒤는 조금 느려짐)
      const baseDelay = 5;   // 최소
      const extraDelay = 30;  // 뒤로 갈수록 추가
      let delay = baseDelay + extraDelay * progress * progress;

      // 랜덤 멈칫 포인트 
      const pausePoints = [80, 95];
      if (pausePoints.some(p => Math.abs(percent - p) < 2)) {
        delay += 100; // 0.1초 멈칫
      }

      setTimeout(updatePercent, delay);
    } else {
      // 100 도달 시 약간 멈칫 후 종료
      setTimeout(() => {
        gsap.to(percentEl, {
          y: "150%"
        });
        gsap.to(loader, {
          // opacity: 0,
          duration: 0.5,
          delay: 0.8,
          height: 0,
          onComplete: () => {
            loader.style.display = "none";
          }
        });
      }, 100);
    }
  }
  updatePercent();

  // 메인화면
  gsap.from(".big-text", {
    y: -200,           
    opacity: 0,        
    duration: 1,
    delay: 3.5,
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
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    },
    "(max-width: 1023px)": function() {
      gsap.to("header .big-text", {
        fontSize: "4.5vw",
        paddingLeft: "2.5vw",
        scrollTrigger: {
          trigger: ".profile-sec",
          start: "top top",
          end: "bottom 60%",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }
  });
  gsap.to(".black-area",
    { height: "80dvh",
      delay: 3, 
      duration: 1, 
      ease: "power2.out"
    }
  );
  gsap.from(".small-text", {
    y: "100%",
    duration: 1,
    delay: 4,
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
  ScrollTrigger.matchMedia({
    "(min-width:1024px)": () => {
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
    },
    "(max-width:1023px)": () => {
      gsap.fromTo(".cube-wrap",
        { top : "-80%" },   // 시작 위치
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
    }
  });
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

  // 여유값(px)
  let startOffset = 100;  // 시작 시 살짝 보이는 정도
  let endOffset = 50;     // 끝에서 조금 더 나오는 정도

function createWorkTimeline() {
  return gsap.timeline({
    scrollTrigger: {
      trigger: '.work-sec',
      pin: true,
      scrub: 0.3, // 모바일에서도 빠르게 반응
      start: 'top top',
      end: () => "+=" + (moveX + startOffset + endOffset),
      invalidateOnRefresh: true
    }
  });
}

let scrollhoriz = createWorkTimeline();

// 리스트 전체 이동
scrollhoriz.fromTo(
  workListWrapper,
  { x: () => window.innerWidth - startOffset },  // 시작: 화면 오른쪽 살짝 보임
  { x: () => -(moveX + endOffset), ease: 'none' }, // 끝: 마지막 아이템 조금 더 나옴
  0
);

// 개별 아이템 회전 효과 (선택 사항)
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

// 모바일/데스크탑 대응
ScrollTrigger.matchMedia({
  "(min-width:1024px)": () => {
    // PC용: 기존 설정 유지
    scrollhoriz.scrollTrigger.scrub = 1;
  },
  "(max-width:1023px)": () => {
    // 모바일용: scrub 속도 빠르게, 이동 거리 줄임
    scrollhoriz.scrollTrigger.scrub = 0.3;
    startOffset = 50;
    endOffset = 30;
    moveX = workListWrapper.scrollWidth - window.innerWidth;

    scrollhoriz.scrollTrigger.end = "+=" + (moveX + startOffset + endOffset);
  }
});

// 리사이즈 / 방향 전환 대응
function updateWorkList() {
  listWidth = workListWrapper.scrollWidth;
  viewWidth = window.innerWidth;
  moveX = listWidth - viewWidth;

  scrollhoriz.scrollTrigger.end = "+=" + (moveX + startOffset + endOffset);
  ScrollTrigger.refresh();
}

window.addEventListener("resize", updateWorkList);
window.addEventListener("orientationchange", updateWorkList);


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

  // 새로고침 시 최상단 시작
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Lenis (부드러운 스크롤 효과)
  const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: true,
    // direction: 'vertical',
    // gestureDirection: 'vertical'
  });
  // Lenis + gsap 연동
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

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
  pfModal.addEventListener('click', function(e) {
    const modalBox = pfModal.querySelector('.modal-box');
    if (!modalBox.contains(e.target)) {
      pfModal.classList.remove('active');
      unblockBodyScroll();
      pfModal.querySelector('.modal-box').scrollTop = 0;
    }
  });

  // Back to top 버튼
  const scrollToTopBtn = document.querySelector(".btn-gotop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollToTopBtn.classList.add("active");
    } else {
      scrollToTopBtn.classList.remove("active");
    }
  });

  scrollToTopBtn.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  });
});