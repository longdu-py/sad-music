// DOM元素
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const progressInner = document.getElementById('progressInner');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const songName = document.getElementById('songName');
const songAuthor = document.getElementById('songAuthor');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const cover = document.querySelector('.cover');
const musicInput = document.getElementById('musicInput');
const playlist = document.getElementById('playlist');
const canvas = document.getElementById('audioCanvas');
const ctx = canvas.getContext('2d');

// 全局变量
let songList = [];
let currentIndex = 0;
let isPlay = false;
let audioCtx, analyser, dataArray;

// 画布自适应
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 格式化时间
function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// 渲染歌单
function renderList() {
    playlist.innerHTML = '';
    songList.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = `play-item ${idx === currentIndex ? 'active' : ''}`;
        div.innerText = item.name;
        div.onclick = () => playSong(idx);
        playlist.appendChild(div);
    });
}

// 播放指定歌曲
function playSong(index) {
    if (!songList[index]) return;
    currentIndex = index;
    const file = songList[index];
    const url = URL.createObjectURL(file);
    audio.src = url;
    songName.innerText = file.name.replace('.mp3', '');
    songAuthor.innerText = '私人伤感情歌';
    audio.play();
    isPlay = true;
    playBtn.innerText = '暂停';
    cover.classList.add('play');
    renderList();
    initAudioVisual();
}

// 音频可视化频谱
function initAudioVisual() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    const bufferLen = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLen);
    drawWave();
}

// 绘制频谱
function drawWave() {
    requestAnimationFrame(drawWave);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width / dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
        const h = dataArray[i] * 1.8;
        const x = i * w;
        // 伤感粉紫渐变频谱
        const grad = ctx.createLinearGradient(0, canvas.height/2 - h, 0, canvas.height/2 + h);
        grad.addColorStop(0, '#ff4499');
        grad.addColorStop(1, '#772266');
        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height/2 - h/2, w - 2, h);
    }
}

// 播放暂停切换
playBtn.onclick = () => {
    if (songList.length === 0) {
        alert('请先上传你的伤感情歌MP3文件！');
        return;
    }
    if (isPlay) {
        audio.pause();
        playBtn.innerText = '播放';
        cover.classList.remove('play');
    } else {
        if(audioCtx?.state === 'suspended') audioCtx.resume();
        audio.play();
        playBtn.innerText = '暂停';
        cover.classList.add('play');
    }
    isPlay = !isPlay;
};

// 进度条拖拽
progressBar.onclick = e => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
};

// 时间实时更新
audio.ontimeupdate = () => {
    const per = audio.currentTime / audio.duration;
    progressInner.style.width = per * 100 + '%';
    currentTimeEl.innerText = formatTime(audio.currentTime);
};

// 歌曲加载完成
audio.onloadedmetadata = () => {
    totalTimeEl.innerText = formatTime(audio.duration);
};

// 播放结束自动下一首
audio.onended = () => {
    nextBtn.click();
};

// 上一首
prevBtn.onclick = () => {
    if (songList.length === 0) return;
    currentIndex = currentIndex === 0 ? songList.length - 1 : currentIndex - 1;
    playSong(currentIndex);
};

// 下一首
nextBtn.onclick = () => {
    if (songList.length === 0) return;
    currentIndex = currentIndex === songList.length - 1 ? 0 : currentIndex + 1;
    playSong(currentIndex);
};

// 上传本地伤感情歌
musicInput.onchange = e => {
    const files = Array.from(e.target.files);
    songList = songList.concat(files.filter(f => f.type === 'audio/mpeg'));
    renderList();
    if(songList.length === files.length) playSong(0);
};
