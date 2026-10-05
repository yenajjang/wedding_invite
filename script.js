const header = document.getElementById('topHeader');
const hero = document.getElementById('hero');
if (header && hero) {
  const updateHeader = () => {
    const threshold = hero.offsetHeight - header.offsetHeight;
    header.classList.toggle('is-over-hero', window.scrollY < threshold);
  };
  window.addEventListener('scroll', updateHeader, {passive:true});
  window.addEventListener('resize', updateHeader);
  updateHeader();
}

const gallery = [
  'assets/photo-04.jpeg','assets/photo-05.jpeg','assets/photo-07.jpeg',
  'assets/photo-02.jpeg','assets/photo-06.jpeg','assets/photo-09.jpeg',
  'assets/photo-01.jpeg','assets/photo-03.jpeg','assets/photo-08.jpeg'
];
let current=0;
const lb=document.getElementById('lightbox');
const lbImg=document.getElementById('lightboxImage');
const counter=document.getElementById('counter');
function show(i){current=(i+gallery.length)%gallery.length;lbImg.src=gallery[current];counter.textContent=`${current+1} / ${gallery.length}`;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-gallery]').forEach((b,i)=>b.addEventListener('click',()=>show(i)));
document.getElementById('closeLightbox').onclick=close;
document.getElementById('prevImage').onclick=()=>show(current-1);
document.getElementById('nextImage').onclick=()=>show(current+1);
lb.addEventListener('click',e=>{if(e.target===lb)close()});
window.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1)});

document.querySelector('[data-share="link"]')?.addEventListener('click', async()=>{
  await navigator.clipboard.writeText(location.href);
  alert('링크를 복사했습니다.');
});
document.querySelector('[data-share="native"]')?.addEventListener('click', async()=>{
  if(navigator.share){await navigator.share({title:document.title,text:'윤수한 & 김서령의 결혼식에 초대합니다.',url:location.href});}
  else {await navigator.clipboard.writeText(location.href);alert('링크를 복사했습니다.');}
});
document.querySelector('[data-share="kakao"]')?.addEventListener('click',()=>{
  alert('카카오톡 공유는 Kakao JavaScript SDK 키 연결 후 활성화할 수 있습니다.');
});


document.querySelectorAll('[data-copy-account]').forEach((button) => {
  button.addEventListener('click', async () => {
    const account = button.getAttribute('data-copy-account') || '';
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(account);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = account;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      button.textContent = '복사됨';
      setTimeout(() => button.textContent = original, 1400);
    } catch (e) {
      alert('계좌번호를 복사하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  });
});


(() => {
  const modal = document.getElementById('weddingDdayModal');
  const closeBtn = document.getElementById('ddayClose');
  const ddayNumber = document.getElementById('ddayNumber');
  const ddayTextNumber = document.getElementById('ddayTextNumber');
  if (!modal || !closeBtn || !ddayNumber || !ddayTextNumber) return;

  const now = new Date();
  const weddingDate = new Date(2026, 11, 19, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24));

  const displayDays = Math.max(diffDays, 0);
  ddayNumber.textContent = displayDays;
  ddayTextNumber.textContent = displayDays;

  if (diffDays < 0) {
    modal.classList.add('is-hidden');
  }

  closeBtn.addEventListener('click', () => {
    modal.classList.add('is-hidden');
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('is-hidden');
    }
  });
})();


(() => {
  const audio = document.getElementById('weddingBgm');
  const toggle = document.getElementById('bgmToggle');
  if (!audio || !toggle) return;

  audio.muted = false;
  audio.volume = 0.55;

  const tryAutoplay = () => {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Most mobile browsers block unmuted autoplay until the first user interaction.
        // Keep the speaker state visually on; the first tap anywhere can start playback.
      });
    }
  };

  tryAutoplay();

  const startOnFirstInteraction = async () => {
    if (!audio.paused) return;
    try {
      await audio.play();
    } catch (e) {}
  };
  document.addEventListener('pointerdown', startOnFirstInteraction, { once:true, passive:true });

  toggle.addEventListener('click', async () => {
    const shouldUnmute = audio.muted;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (e) {
        return;
      }
    }

    audio.muted = !shouldUnmute;
    toggle.classList.toggle('is-muted', audio.muted);
    toggle.setAttribute('aria-pressed', String(!audio.muted));
    toggle.setAttribute('aria-label', audio.muted ? '배경음악 켜기' : '배경음악 끄기');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) {
      audio.pause();
    } else if (!document.hidden) {
      tryAutoplay();
    }
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('rsvpModal');
  const openBtn = document.getElementById('openRsvpModal');
  const form = document.getElementById('rsvpForm');
  const minus = document.getElementById('guestMinus');
  const plus = document.getElementById('guestPlus');
  const countOutput = document.getElementById('guestCount');
  const countInput = document.getElementById('guestCountInput');
  const status = document.getElementById('rsvpFormStatus');
  const submitBtn = form ? form.querySelector('.rsvp-submit') : null;
  const successModal = document.getElementById('rsvpSuccessModal');
  const successCloseEls = document.querySelectorAll('[data-success-close]');

  if (!modal || !openBtn || !form || !minus || !plus || !countOutput || !countInput || !submitBtn) return;

  let companions = 0;

  const updateSubmitState = () => {
    const hasSide = !!form.querySelector('input[name="side"]:checked');
    const hasAttendance = !!form.querySelector('input[name="attendance"]:checked');
    const hasName = form.elements.name.value.trim().length > 0;
    submitBtn.disabled = !(hasSide && hasAttendance && hasName);
  };

  const syncCount = () => {
    countOutput.textContent = String(companions);
    countInput.value = String(companions);
  };

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('rsvp-modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('rsvp-modal-open');
  };

  const openSuccessModal = () => {
    if (!successModal) return;
    successModal.classList.add('is-open');
    successModal.setAttribute('aria-hidden', 'false');
  };

  const closeSuccessModal = () => {
    if (!successModal) return;
    successModal.classList.remove('is-open');
    successModal.setAttribute('aria-hidden', 'true');
  };

  successCloseEls.forEach((el) => {
    el.addEventListener('click', closeSuccessModal);
  });

  openBtn.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  modal.querySelectorAll('[data-rsvp-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  minus.addEventListener('click', () => {
    companions = Math.max(0, companions - 1);
    syncCount();
  });

  plus.addEventListener('click', () => {
    companions += 1;
    syncCount();
  });

  form.querySelectorAll('input[name="side"], input[name="attendance"]').forEach((input) => {
    input.addEventListener('change', updateSubmitState);
  });
  form.elements.name.addEventListener('input', updateSubmitState);

  const RSVP_API_URL = 'https://script.google.com/macros/s/AKfycbxYdPvTRdCLqBxox5u0ys41ooFEmiDrw-QQaqGeLkC45i4h0VY0AoZk9uwOJouTe4-i2w/exec';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    updateSubmitState();
    if (submitBtn.disabled) return;

    if (!RSVP_API_URL || RSVP_API_URL.includes('PASTE_GOOGLE_APPS_SCRIPT')) {
      status.textContent = 'Google Apps Script 웹앱 URL을 먼저 연결해주세요.';
      return;
    }

    const formData = new FormData(form);
    const payload = {
      side: formData.get('side'),
      attendance: formData.get('attendance'),
      meal: formData.get('meal') || '',
      name: (formData.get('name') || '').trim(),
      phone: (formData.get('phone') || '').trim(),
      companions: Number(formData.get('companions') || 0)
    };

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '제출 중...';
    status.textContent = '';

    try {
      await fetch(RSVP_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      form.reset();
      companions = 0;
      syncCount();
      updateSubmitState();
      submitBtn.textContent = originalText;
      closeModal();
      openSuccessModal();
    } catch (error) {
      status.textContent = '제출에 실패했습니다. 잠시 후 다시 시도해주세요.';
      submitBtn.textContent = originalText;
      updateSubmitState();
    }
  });

  syncCount();
  updateSubmitState();
});

document.querySelector('[data-share="top"]')?.addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior:'smooth'});
});
