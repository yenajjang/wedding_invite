const gallery=['assets/photo-04.jpeg','assets/photo-05.jpeg','assets/photo-07.jpeg','assets/photo-01.jpeg','assets/photo-06.jpeg','assets/photo-09.jpeg','assets/photo-02.jpeg','assets/photo-03.jpeg','assets/photo-08.jpeg'];
let current=0;const lb=document.getElementById('lightbox'),img=document.getElementById('lightboxImage'),counter=document.getElementById('counter');
function show(i){current=(i+gallery.length)%gallery.length;img.src=gallery[current];counter.textContent=`${current+1} / ${gallery.length}`;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-gallery]').forEach((b,i)=>b.addEventListener('click',()=>show(i)));
document.getElementById('closeLightbox').onclick=close;document.getElementById('prevImage').onclick=()=>show(current-1);document.getElementById('nextImage').onclick=()=>show(current+1);lb.addEventListener('click',e=>{if(e.target===lb)close()});window.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1)});

const topHeader=document.getElementById('topHeader'),hero=document.getElementById('hero');
function syncHeaderBackground(){
  if(!topHeader||!hero)return;
  const heroBottom=hero.getBoundingClientRect().bottom;
  const onPhoto=heroBottom>topHeader.offsetHeight;
  topHeader.classList.toggle('solid',!onPhoto);
  topHeader.classList.toggle('transparent',onPhoto);
}
window.addEventListener('scroll',syncHeaderBackground,{passive:true});
window.addEventListener('resize',syncHeaderBackground);
syncHeaderBackground();
