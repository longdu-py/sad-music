// 伤感情歌歌单配置，自行替换歌曲文件名
const songData = [
    {
        name: "可惜没如果",
        singer: "林俊杰",
        src: "./music/song1.mp3"
    },
    {
        name: "孤独患者",
        singer: "陈奕迅",
        src: "./music/song2.mp3"
    },
    {
        name: "说散就散",
        singer: "袁维娅",
        src: "./music/song3.mp3"
    }
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

let currentIndex = 0;
let isPlay = false;

// 渲染歌单
function renderList() {
    songListEl.innerHTML = '';
    songData.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'song-item' + (idx === currentIndex ? ' active' : '');
        div.innerHTML = `${item.name} - ${item.singer}`;
        div.onclick = () => playSong(idx);
        songListEl.appendChild(div);
    })
}

// 加载对应歌曲
function loadSong(index) {
    const song = songData[index];
    audio.src = song.src;
    songNameEl.innerText = song.name;
    singerEl.innerText = song.singer;
    renderList();
}

// 播放/暂停
function togglePlay() {
    if (isPlay) {
        audio.pause();
        playBtn.innerText = '播放';
    } else {
        audio.play();
        playBtn.innerText = '暂停';
    }
    isPlay = !isPlay;
}

// 切歌
function playSong(index) {
    currentIndex = index;
    loadSong(currentIndex);
    audio.play();
    playBtn.innerText = '暂停';
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

// 格式化时间
function formatTime(time) {
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return `${m}:${s}`;
}

// 音频时长加载完成
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.innerText = formatTime(audio.duration);
    progress.max = audio.duration;
})

// 播放实时更新进度
audio.addEventListener('timeupdate', () => {
    progress.value = audio.currentTime;
    currentTimeEl.innerText = formatTime(audio.currentTime);
})

// 拖动进度条跳转
progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
})

// 歌曲播放完毕自动下一首
audio.addEventListener('ended', nextSong);

// 按钮绑定事件
playBtn.onclick = togglePlay;
prevBtn.onclick = prevSong;
nextBtn.onclick = nextSong;

// 初始化页面
loadSong(currentIndex);
renderList();
