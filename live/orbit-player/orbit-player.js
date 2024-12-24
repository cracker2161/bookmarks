class OrbitPlayer {
    constructor(selector, options = {}) {
        this.options = {
            autoplay: options.autoplay || false,
            theme: options.theme || 'dark',
            controls: options.controls || true,
            title: options.title || ''
        };

        // ভিডিও এলিমেন্ট
        this.video = (typeof selector === 'string') ? document.querySelector(selector) : selector;
        
        // HLS সাপোর্ট চেক
        this.checkHLS();
        
        // প্লেয়ার সেটআপ
        this.setupPlayer();
    }

    checkHLS() {
        const source = this.video.src;
        if (source.includes('.m3u8')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.onload = () => {
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(source);
                    hls.attachMedia(this.video);
                }
            };
            document.head.appendChild(script);
        }
    }

    setupPlayer() {
        // প্লেয়ার কনটেইনার
        this.container = document.createElement('div');
        this.container.className = `orbit-player ${this.options.theme}`;
        this.video.parentElement.insertBefore(this.container, this.video);
        this.container.appendChild(this.video);

        // কন্ট্রোলস তৈরি
        this.createControls();
        
        // ইভেন্ট লিসেনার
        this.addEventListeners();
    }

    createControls() {
        this.controls = document.createElement('div');
        this.controls.className = 'orbit-controls';
        
        // কন্ট্রোল এলিমেন্টস
        this.controls.innerHTML = `
            <div class="orbit-control-left">
                <button class="orbit-play">
                    <svg viewBox="0 0 24 24">
                        <path class="play-icon" d="M8 5v14l11-7z"/>
                        <path class="pause-icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                </button>
                
                <div class="orbit-time">
                    <span class="current-time">0:00</span>
                    <span>/</span>
                    <span class="total-time">0:00</span>
                </div>
            </div>

            <div class="orbit-progress">
                <div class="orbit-progress-bar"></div>
                <div class="orbit-buffer-bar"></div>
            </div>

            <div class="orbit-control-right">
                <div class="orbit-volume">
                    <button class="orbit-mute">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                    </button>
                    <div class="orbit-volume-slider">
                        <div class="orbit-volume-bar"></div>
                    </div>
                </div>

                <button class="orbit-fullscreen">
                    <svg viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                </button>
            </div>
        `;

        this.container.appendChild(this.controls);
    }

    addEventListeners() {
        // প্লে/পজ
        const playButton = this.controls.querySelector('.orbit-play');
        playButton.addEventListener('click', () => this.togglePlay());

        // ভলিউম
        const volumeSlider = this.controls.querySelector('.orbit-volume-slider');
        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const volume = (e.clientX - rect.left) / rect.width;
            this.setVolume(volume);
        });

        // মিউট
        const muteButton = this.controls.querySelector('.orbit-mute');
        muteButton.addEventListener('click', () => this.toggleMute());

        // প্রোগ্রেস বার
        const progressBar = this.controls.querySelector('.orbit-progress');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.video.currentTime = pos * this.video.duration;
        });

        // ফুলস্ক্রিন
        const fullscreenButton = this.controls.querySelector('.orbit-fullscreen');
        fullscreenButton.addEventListener('click', () => this.toggleFullscreen());

        // ভিডিও ইভেন্টস
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('play', () => this.container.classList.add('playing'));
        this.video.addEventListener('pause', () => this.container.classList.remove('playing'));
    }

    // কন্ট্রোল মেথডস
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    setVolume(value) {
        this.video.volume = Math.max(0, Math.min(1, value));
        this.controls.querySelector('.orbit-volume-bar').style.width = 
            (this.video.volume * 100) + '%';
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.container.classList.toggle('muted', this.video.muted);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    updateProgress() {
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.controls.querySelector('.orbit-progress-bar').style.width = `${progress}%`;
        
        // টাইম আপডেট
        this.controls.querySelector('.current-time').textContent = 
            this.formatTime(this.video.currentTime);
        this.controls.querySelector('.total-time').textContent = 
            this.formatTime(this.video.duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// গ্লোবাল স্কোপে এক্সপোজ
window.OrbitPlayer = OrbitPlayer;
