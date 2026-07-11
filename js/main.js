// 伤感情歌歌单，可自行增减
const songData = [
    { name: "可惜没如果", singer: "林俊杰", src: "./music/song1.mp3" },
    { name: "孤独患者", singer: "陈奕迅", src: "./music/song2.mp3" },
    { name: "说散就散", singer: "袁维娅", src: "./music/song3.mp3" },
    { name: "起风了", singer: "买辣椒也用券", src: "./music/song4.mp3" },
    { name: "漠河舞厅", singer: "柳爽", src: "./music/song5.mp3" }
];

// DOM元素
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const songNameEl = document.getElementById('songName');
const singerEl = document.getElementById('singer');
const songListEl = document.getElementById('songList');
const recordDom = document.getElementById('record');

let currentIndex = 0;
let isPlay = false;

// 渲染歌单
function renderList() {
    songListEl.innerHTML = '';
    songData.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'song-item' + (idx === currentIndex ? ' active' : '');
        div.innerText = `${item.name} · ${item.singer}`;
        div.onclick = () => playSong(idx);
        songListEl.appendChild(div);
    })
}

// 加载歌曲
function loadSong(index) {
    const song = songData[index];
    audio.src = song.src;
    songNameEl.innerText = song.name;
    singerEl.innerText = song.singer;
    renderList();
}

// 播放暂停切换
function togglePlay() {
    if (isPlay) {
        audio.pause();
        playBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>`;
        recordDom.classList.remove('play-animate');
    } else {
        audio.play();
        playBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`;
        recordDom.classList.add('play-animate');
    }
    isPlay = !isPlay;
}

// 点击歌单播放
function playSong(index) {
    currentIndex = index;
    loadSong(currentIndex);
    audio.play();
    playBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`;
    recordDom.classList.add('play-animate');
    isPlay = true;
}

// 上一首
function prevSong() {
    currentIndex = currentIndex === 0 ? songData.length - 1 : currentIndex - 1;
    playSong(currentIndex);
}

// 下一首
function nextSong() {
    currentIndex = currentIndex === songData.length - 1 ? 0 : currentIndex + 1;
    playSong(currentIndex);
}

// 时间格式化
function formatTime(time) {
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return `${m}:${s}`;
}

// 音频事件
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.innerText = formatTime(audio.duration);
    progress.max = audio.duration;
})

audio.addEventListener('timeupdate', () => {
    progress.value = audio.currentTime;
    currentTimeEl.innerText = formatTime(audio.currentTime);
})

progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
})

// 播放结束自动下一首
audio.addEventListener('ended', () => {
    nextSong();
})

// 绑定按钮点击
playBtn.onclick = togglePlay;
prevBtn.onclick = prevSong;
nextBtn.onclick = nextSong;

// 初始化页面
loadSong(currentIndex);
renderList();
