let workTime = 25 * 60;
let breakTime = 5 * 60;
let longBreakTime = 15 * 60;
let isWork = true;
let isRunning = false;
let timer;
let remaining = workTime;

const timerDisplay = document.getElementById('timer');
const statusText = document.getElementById('status');
const statusRing = document.getElementById('statusRing');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');

// 🔊 Add alarm sound
const buttonSound = new Audio("sound/button-sound.mp3");
const bellsound = new Audio("sound/bell-sound.mp3");

function updateDisplay() {
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  statusText.textContent = isWork ? 'Work' : 'Break';
  statusRing.className = `status-ring ${isWork ? 'work' : 'break'}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startPauseBtn.textContent = 'PAUSE';
  startPauseBtn.style.backgroundColor = 'var(--pause)';
  timer = setInterval(() => {
    if (remaining > 0) {
      remaining--;
      updateDisplay();
    } else {
      clearInterval(timer);
      alarmSound.currentTime = 0;  // reset to start
      alarmSound.play();           // 🔔 play alarm
      isWork = !isWork;
      remaining = isWork ? workTime : breakTime;
      updateDisplay();
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  startPauseBtn.textContent = 'START';
  startPauseBtn.style.backgroundColor = 'var(--start)';
}

function resetTimer() {
  pauseTimer();
  remaining = workTime;
  isWork = true;
  updateDisplay();
}

startPauseBtn.addEventListener('click', () => {
  isRunning ? pauseTimer() : startTimer();
});

resetBtn.addEventListener('click', resetTimer);

document.getElementById('saveSettings').addEventListener('click', () => {
  const work = parseInt(document.getElementById('workDuration').value, 10);
  const brk = parseInt(document.getElementById('breakDuration').value, 10);
  const longBrk = parseInt(document.getElementById('longBreakDuration').value, 10);

  if (work && brk && longBrk) {
    workTime = work * 60;
    breakTime = brk * 60;
    longBreakTime = longBrk * 60;
    resetTimer();
    localStorage.setItem('pomodoro-settings', JSON.stringify({ work, brk, longBrk }));
  }
});

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem('pomodoro-settings'));
  if (saved) {
    document.getElementById('workDuration').value = saved.work;
    document.getElementById('breakDuration').value = saved.brk;
    document.getElementById('longBreakDuration').value = saved.longBrk;
    workTime = saved.work * 60;
    breakTime = saved.brk * 60;
    longBreakTime = saved.longBrk * 60;
    remaining = workTime;
  }
  updateDisplay();
};
