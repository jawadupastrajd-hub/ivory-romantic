"use client";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { wedding as w } from "@/lib/wedding";

function Ornament() { return <div className="ornament" aria-hidden="true"><span /><svg viewBox="0 0 100 28"><path d="M0 14Q20 14 25 9Q30 1 37 9Q42 18 48 14Q40 9 45 4Q50-2 55 4Q60 9 52 14Q58 18 63 9Q70 1 75 9Q80 14 100 14M50 14Q38 19 44 24Q50 29 50 14Q50 29 56 24Q62 19 50 14" fill="none" stroke="currentColor" strokeWidth="1" /></svg><span /></div>; }
function Crown() { return <svg className="crown" viewBox="0 0 72 48" aria-hidden="true"><path d="M10 13L21 28L36 8L51 28L62 13L55 39H17Z" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M18 43H54M21 35H51" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="11" r="2.2" fill="currentColor" /><circle cx="36" cy="6" r="2.2" fill="currentColor" /><circle cx="62" cy="11" r="2.2" fill="currentColor" /></svg>; }
function Rose({ className = "" }: { className?: string }) { return <svg className={`rose ${className}`} viewBox="0 0 140 170" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M66 164Q76 112 62 73M66 136Q38 141 22 119Q53 115 66 136M68 118Q101 113 114 87Q80 85 68 118M65 151Q92 157 112 139Q81 131 65 151" /><path d="M65 24C21-3 9 47 39 66C7 83 35 111 60 91C88 119 119 88 98 66C139 40 107 3 83 23C82 7 60 4 65 24Z" /><path d="M65 24C39 17 29 43 48 58C31 78 57 94 68 74C91 88 109 60 87 48C103 22 72 13 65 38C43 38 52 61 70 59C88 53 76 30 65 38" /></g></svg>; }
function Card({ title, children, icon = true }: { title: string; children: React.ReactNode; icon?: boolean }) { return <section className="section-card" data-reveal>{icon && <Crown />}<h2>{title}</h2><Ornament />{children}</section>; }

/* Golden dust drifting over the hero */
function GoldDust({ active }: { active: boolean }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!active) return;
        const el = ref.current; if (!el) return;
        const ctx = el.getContext('2d'); if (!ctx) return;
        let raf = 0; let W = 0, H = 0;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        function resize() { W = el!.clientWidth; H = el!.clientHeight; el!.width = W * dpr; el!.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); }
        resize(); window.addEventListener('resize', resize);
        const P = Array.from({ length: 55 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            r: .8 + Math.random() * 2.2, s: .12 + Math.random() * .4,
            ph: Math.random() * Math.PI * 2, sw: 10 + Math.random() * 26,
            a: .25 + Math.random() * .6,
        }));
        let t = 0;
        function frame() {
            t += .016; ctx!.clearRect(0, 0, W, H);
            for (const p of P) {
                p.y -= p.s; if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
                const tw = .55 + .45 * Math.sin(t * 2 + p.ph);
                ctx!.beginPath();
                ctx!.fillStyle = `rgba(232,214,181,${(p.a * tw).toFixed(3)})`;
                ctx!.arc(p.x + Math.sin(t + p.ph) * p.sw * .3, p.y, p.r, 0, Math.PI * 2);
                ctx!.fill();
            }
            raf = requestAnimationFrame(frame);
        }
        frame();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, [active]);
    return <canvas ref={ref} className="dust-canvas" aria-hidden="true" />;
}

/* Delicate falling rose petals over the hero */
const PETALS = [
    { left: 4, size: 13, dur: 19, delay: 0, color: '#821B3D' },
    { left: 12, size: 10, dur: 23, delay: 6, color: '#D6336C' },
    { left: 23, size: 12, dur: 17, delay: 11, color: '#E75480' },
    { left: 46, size: 9, dur: 21, delay: 3, color: '#821B3D' },
    { left: 74, size: 12, dur: 18, delay: 8, color: '#D6336C' },
    { left: 86, size: 10, dur: 22, delay: 1, color: '#E75480' },
    { left: 94, size: 13, dur: 20, delay: 13, color: '#821B3D' },
];
function Petals() {
    return <div className="petals" aria-hidden="true">{PETALS.map((p, i) => <span key={i} className="petal" style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.3, background: p.color, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />)}</div>;
}

/* Warm lantern glows, aligned with the real lanterns in the hero photo.
   The photo is 1672x941 and shown with object-fit: cover, so a lantern's
   screen position depends on the hero's aspect ratio — it is measured from
   the hero box, and hidden when its lantern is cropped out of frame. */
const HERO_IMG_W = 1672, HERO_IMG_H = 941;
const LANTERNS = [
    { fx: .18, fy: .29, size: 150 },
    { fx: .82, fy: .29, size: 150 },
    { fx: .125, fy: .81, size: 130 },
    { fx: .855, fy: .81, size: 130 },
];
function useLanternPositions(heroRef: React.RefObject<HTMLElement | null>) {
    const [pos, setPos] = useState<{ x: number; y: number; size: number; visible: boolean }[] | null>(null);
    useEffect(() => {
        function measure() {
            const el = heroRef.current; if (!el) return;
            const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
            const s = Math.max(W / HERO_IMG_W, H / HERO_IMG_H);
            const rw = HERO_IMG_W * s, rh = HERO_IMG_H * s;
            const ox = (W - rw) / 2, oy = (H - rh) / 2;
            setPos(LANTERNS.map(l => {
                const x = (ox + l.fx * rw) / W * 100, y = (oy + l.fy * rh) / H * 100;
                return { x, y, size: Math.round(l.size * s), visible: x > -3 && x < 103 && y > -3 && y < 103 };
            }));
        }
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [heroRef]);
    return pos;
}

function Marquee() {
    const items = [`${w.groom}`, '✦', `${w.bride}`, '✦', '16–17 JANUARY 2027', '✦'];
    const row = [...items, ...items];
    return <div className="marquee" aria-hidden="true"><div className="marquee-track">{row.map((s, i) => s === '✦' ? <b key={i}>✦</b> : <span key={i}>{s}</span>)}</div></div>;
}

function SaveDate({ urdu }: { urdu: boolean }) {
    const [open, setOpen] = useState(false);
    function stamp(d: Date) { return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; }
    const start = new Date(w.date); const end = new Date(start.getTime() + 4 * 3600 * 1000);
    const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${w.groom} & ${w.bride} — Wedding`)}&dates=${stamp(start)}/${stamp(end)}&location=${encodeURIComponent(w.venue + ', ' + w.address)}`;
    function download() { const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'BEGIN:VEVENT', `UID:wedding-invitation-${stamp(start)}`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${w.groom} & ${w.bride} Wedding`, `LOCATION:${w.venue}, ${w.address}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'); const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'wedding-save-the-date.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setOpen(false); }
    return <div className="save-date"><button className="gold-button" onClick={() => setOpen(!open)} aria-expanded={open}>♧ {urdu ? 'تاریخ محفوظ کریں' : 'SAVE THE DATE'}</button>{open && <div className="calendar-menu"><a href={google} target="_blank" rel="noreferrer">Google Calendar ↗</a><button onClick={download}>Apple / Outlook Calendar ↓</button></div>}</div>;
}
function Countdown({ urdu }: { urdu: boolean }) { const [values, setValues] = useState([0, 0, 0, 0]); useEffect(() => { function tick() { const d = Math.max(0, new Date(w.date).getTime() - Date.now()); setValues([Math.floor(d / 86400000), Math.floor(d / 3600000) % 24, Math.floor(d / 60000) % 60, Math.floor(d / 1000) % 60]); } tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, []); return <div className="countdown">{values.map((value, i) => <div key={i}><strong>{String(value).padStart(2, '0')}</strong><span>{(urdu ? ['دن', 'گھنٹے', 'منٹ', 'سیکنڈ'] : ['DAYS', 'HOURS', 'MINUTES', 'SECONDS'])[i]}</span></div>)}</div>; }
function InvitationSection({ urdu }: { urdu: boolean }) {
    return <section className="invitation-section" data-reveal>
        <h2>{urdu ? 'ہماری نئی زندگی کا آغاز' : 'Our forever begins'}</h2>
        <Ornament />
        <p className="invite-sub">{urdu ? 'آپ مدعو ہیں!' : "You’re Invited!"}</p>
        <div className="invite-dates">
            <strong>{w.dateText}</strong>
            <span>{w.day}</span>
            {w.time.split('·').map((part, i) => <span key={i}>{part.trim()}</span>)}
        </div>
        <span className="invite-heart" aria-hidden="true">♥</span>
        <p className="invite-forward">{urdu ? 'ہم آپ کے منتظر ہیں' : 'We look forward to seeing you'}</p>
        <SaveDate urdu={urdu} />
    </section>;
}
export default function DarkInvitation() {
    const [started, setStarted] = useState(false);
    const [ready, setReady] = useState(false);
    const [preloaderDismissed, setPreloaderDismissed] = useState(false);
    const [showNames, setShowNames] = useState(false);
    const [urdu, setUrdu] = useState(false);
    const [muted, setMuted] = useState(true);
    const [slide, setSlide] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const audio = useRef<HTMLAudioElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const lanterns = useLanternPositions(heroRef);
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);
    const photos = [{ src: '/images/slide-2.jpg', alt: 'Bride and groom in Pakistani wedding attire' }, { src: '/images/slide-3.jpg', alt: 'Pakistani wedding outfit inspiration' }, { src: '/images/slide-4.jpg', alt: 'Traditional sherwani and waistcoat inspiration' }, { src: '/images/couple.png', alt: 'A new beginning together' }];

    useEffect(() => {
        let mounted = true;
        const criticalImages = ['/images/hero.jpg', '/images/slide-2.jpg', '/images/slide-3.jpg', '/images/slide-4.jpg', '/images/couple.png'];
        let loadedImages = 0; let audioReady = false;
        const checkAllReady = () => { if (!mounted) return; if (loadedImages >= criticalImages.length && audioReady) setReady(true); };
        criticalImages.forEach(src => { const img = new Image(); img.src = src; img.onload = () => { loadedImages++; checkAllReady(); }; img.onerror = () => { loadedImages++; checkAllReady(); }; });
        const au = new Audio(); au.preload = 'auto'; au.src = '/media/wedding-song.mp3';
        const onAudio = () => { audioReady = true; checkAllReady(); };
        au.addEventListener('canplaythrough', onAudio, { once: true });
        au.addEventListener('error', onAudio, { once: true });
        setTimeout(onAudio, 4000);
        const fallback = setTimeout(() => { if (mounted) setReady(true); }, 5000);
        return () => { mounted = false; clearTimeout(fallback); };
    }, []);
    useEffect(() => { if (ready) { const t = setTimeout(() => setPreloaderDismissed(true), 850); return () => clearTimeout(t); } }, [ready]);
    useEffect(() => { const id = setInterval(() => setSlide(i => (i + 1) % 4), 4500); return () => clearInterval(id); }, []);
    useEffect(() => {
        if (!showNames) return;
        const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } }), { threshold: .08 });
        document.querySelectorAll('[data-reveal]').forEach(e => observer.observe(e));
        return () => observer.disconnect();
    }, [showNames]);
    useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
    useEffect(() => {
        if (!showNames) {
            document.documentElement.classList.add('video-locked');
            document.body.classList.add('video-locked');
            window.scrollTo(0, 0);
            const handleTouch = (e: TouchEvent) => { if ((e.target as HTMLElement)?.closest('button')) return; e.preventDefault(); };
            const handleWheel = (e: WheelEvent) => { e.preventDefault(); };
            const handleKey = (e: KeyboardEvent) => { if (['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.code)) e.preventDefault(); };
            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('touchmove', handleTouch, { passive: false });
            window.addEventListener('keydown', handleKey);
            return () => {
                document.documentElement.classList.remove('video-locked');
                document.body.classList.remove('video-locked');
                window.removeEventListener('wheel', handleWheel);
                window.removeEventListener('touchmove', handleTouch);
                window.removeEventListener('keydown', handleKey);
            };
        } else {
            document.documentElement.classList.remove('video-locked');
            document.body.classList.remove('video-locked');
        }
    }, [showNames]);
    useEffect(() => { if (lightbox === null) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; function key(e: KeyboardEvent) { if (e.key === 'Escape') setLightbox(null); if (e.key === 'ArrowRight') setLightbox(i => i === null ? null : (i + 1) % 4); if (e.key === 'ArrowLeft') setLightbox(i => i === null ? null : (i + 3) % 4); } window.addEventListener('keydown', key); return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', key); }; }, [lightbox]);
    function start() {
        if (started) return;
        setStarted(true);
        const au = audio.current;
        if (au) { au.muted = muted; au.play().catch(() => { /* autoplay blocked */ }); }
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => { setShowNames(true); }, 900);
    }
    function toggleSound() {
        const next = !muted;
        setMuted(next);
        const au = audio.current;
        if (au) { au.muted = next; if (!next) au.play().catch(() => { /* ignored */ }); }
    }
    const t = (en: string, ur: string) => urdu ? ur : en;
    return <div className={`page-shell ${urdu ? 'urdu' : ''} ${!showNames ? 'is-locked' : ''}`} lang={urdu ? 'ur' : 'en'}>
        {!preloaderDismissed && (
            <div className={`preloader ${ready ? 'fade-out' : ''}`} aria-hidden={ready}>
                <div className="preloader-inner">
                    <span className="preloader-text">{urdu ? 'دعوت نامہ تیار ہو رہا ہے' : 'PREPARING YOUR INVITATION'}</span>
                    <div className="preloader-divider"><span className="p-line" /><span className="p-diamond">◆</span><span className="p-line" /></div>
                    <div className="preloader-dots"><span /><span /><span /></div>
                </div>
            </div>
        )}
        <button className="language-toggle" onClick={() => setUrdu(!urdu)}>◎ {urdu ? 'English' : 'اردو'}</button><button className="sound-toggle" onClick={toggleSound} aria-label={muted ? (urdu ? 'موسیقی آن کریں' : 'Unmute music') : (urdu ? 'موسیقی بند کریں' : 'Mute music')} aria-pressed={!muted}>{muted ? <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" /><path d="M16.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg> : <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" /><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>}</button>
        <audio ref={audio} src="/media/wedding-song.mp3" loop preload="auto" aria-hidden="true" />
        <section ref={heroRef} className={`hero ${showNames ? 'names-visible' : ''}`}>
            <img className="hero-photo" src="/images/hero.jpg" alt="Ivory wedding archway with golden lanterns and burgundy flowers" fetchPriority="high" />
            {!started && ready && <button className="opening-hit-area" onClick={start} aria-label={t('Tap to open your invitation', 'دعوت نامہ کھولیں')} />}
            <div className="hero-shade" />
            <GoldDust active={!reducedMotion} />
            {lanterns && lanterns.filter(l => l.visible).map((l, i) => <span key={i} className={`lantern-glow lg-${i}`} style={{ left: `${l.x}%`, top: `${l.y}%`, width: l.size, height: l.size }} aria-hidden="true" />)}
            <Petals />
            <div className="couple-heading"><span className="small-heart">♥</span><p className="hero-intro">{t(w.heroIntro, w.heroIntroUrdu)}</p><div className="heart-rule">— ♥ —</div><h1>{urdu ? w.groomUrdu : w.groom}{w.groomFamily && <small>{t(w.groomFamily, w.groomFamilyUrdu)}</small>}</h1><span className="amp">{urdu ? 'اور' : 'with'}</span><h1>{urdu ? w.brideUrdu : w.bride}{w.brideFamily && <small>{t(w.brideFamily, w.brideFamilyUrdu)}</small>}</h1></div>
            {showNames && <a className="scroll-cue" href="#main">{t('SCROLL', 'مزید دیکھیں')}<span>⌄</span></a>}
        </section>
        {showNames && (
            <>
                <Marquee />
                <InvitationSection urdu={urdu} />
                <main id="main" dir={urdu ? 'rtl' : 'ltr'}>
                    <section className="gallery-section" data-reveal><Ornament /><div className="gallery-frame"><button className="gallery-image" onClick={() => setLightbox(slide)} aria-label="Open wedding photograph">{photos.map((p, i) => <img src={p.src} alt={p.alt} key={i} className={i === slide ? 'active' : ''} loading="lazy" />)}</button><button className="gallery-prev" onClick={() => setSlide(i => (i + 3) % 4)} aria-label="Previous photo">‹</button><button className="gallery-next" onClick={() => setSlide(i => (i + 1) % 4)} aria-label="Next photo">›</button></div><div className="gallery-dots">{photos.map((_, i) => <button key={i} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} aria-label={`Photo ${i + 1}`} aria-pressed={i === slide} />)}</div></section>
                    <Card title={t('Counting Down to Forever', 'ہماری خوشیوں کے آغاز میں')}><Countdown urdu={urdu} /></Card>
                    <Card title={t('Program Timeline', 'تقریبات کا پروگرام')}><div className="timeline">{w.timeline.map((event, i) => <div className="timeline-item" key={i}>{event.day && <p className="event-day">{event.day}</p>}<p className="event-time">{event.time}</p><h3 className="event-title">{urdu ? event.urdu : event.title}</h3>{(urdu ? event.noteUrdu : event.note) && <p className="event-desc">{urdu ? event.noteUrdu : event.note}</p>}{i === w.timeline.length - 1 && <p className="time-note">{urdu ? w.punctualityUrdu : w.punctuality}</p>}</div>)}</div></Card>
                    <Card title={t('Venue & Location', 'مقامِ تقریب')}>
                        <Rose className="venue-rose" />
                        {w.venues.map((v, i) => (
                            <div className="venue-card-item" key={i} style={i > 0 ? { marginTop: '26px', paddingTop: '22px', borderTop: '1px dashed #E7D3AE' } : undefined}>
                                <span className="event-tag">{t(v.tag, v.tagUrdu)}</span>
                                <h3 className="venue-title">{t(v.name, v.nameUrdu)}</h3>
                                <p className="venue-address">{t(v.address, v.addressUrdu)}</p>
                                <iframe className="venue-map" title={v.name} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(v.mapQuery)}&z=15&output=embed`} />
                                <a className="gold-button map-button" href={v.mapUrl} target="_blank" rel="noreferrer">⌖ {t('View on Google Maps', 'گوگل میپس پر دیکھیں')}</a>
                            </div>
                        ))}
                    </Card>
                    {w.preEvents.length > 0 && <Card title={t('Pre-Wedding Events', 'شادی سے پہلے کی تقریبات')}><div className="timeline">{w.preEvents.map((event, i) => <div className="timeline-item" key={i}><p className="event-day">{event.day}</p><p className="event-time">{event.time}</p><h3 className="event-title">{urdu ? event.urdu : event.title}</h3>{(urdu ? event.noteUrdu : event.note) && <p className="event-desc">{urdu ? event.noteUrdu : event.note}</p>}</div>)}</div></Card>}
                    <section className="closing" data-reveal>
                        <div className="monogram" aria-hidden="true"><span className="m-line" /><span className="m-diamond"><span>B·F</span></span><span className="m-line" /></div>
                        <Rose className="closing-rose left" /><Rose className="closing-rose right" /><Crown />
                        <p>{t("We can’t wait to celebrate with you!", 'آپ کی آمد کے منتظر!')}</p>
                        <h2>{urdu ? (<>{w.groomUrdu}<br />اور {w.brideUrdu}</>) : (<>{w.groom}<br />& {w.bride}</>)}</h2>
                        <Ornament /><span className="closing-heart">♥</span>
                    </section>
                </main>
            </>
        )}
        {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Wedding photographs" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo" autoFocus>×</button><button onClick={e => { e.stopPropagation(); setLightbox((lightbox + 3) % 4); }} aria-label="Previous photograph">‹</button><img src={photos[lightbox].src} alt={photos[lightbox].alt} onClick={e => e.stopPropagation()} /><button onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % 4); }} aria-label="Next photograph">›</button></div>}
    </div>;
}
