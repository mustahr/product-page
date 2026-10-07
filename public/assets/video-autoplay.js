(()=>{
/** Retry muted autoplay when media becomes ready or the video enters view. */
function startVideoAutoplay(video) {
    let started = false, disposed = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const play = () => { if (disposed || started || document.hidden)
        return; const attempt = video.play(); attempt?.then(() => { started = true; }).catch(() => { }); };
    const onPlaying = () => { started = true; };
    video.addEventListener('loadeddata', play);
    video.addEventListener('canplay', play);
    video.addEventListener('playing', onPlaying);
    document.addEventListener('visibilitychange', play);
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting))
        play(); }) : null;
    observer?.observe(video);
    const gesture = () => { play(); };
    document.addEventListener('pointerdown', gesture, { once: true });
    document.addEventListener('keydown', gesture, { once: true });
    play();
    return () => { disposed = true; observer?.disconnect(); video.removeEventListener('loadeddata', play); video.removeEventListener('canplay', play); video.removeEventListener('playing', onPlaying); document.removeEventListener('visibilitychange', play); document.removeEventListener('pointerdown', gesture); document.removeEventListener('keydown', gesture); };
}

document.querySelectorAll('video[autoplay]').forEach(startVideoAutoplay);
})();
