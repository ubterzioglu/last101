(function () {
  const canvas = document.getElementById('devuser-shell-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/{}[]();:=-+*/&|%$#@!';
  const fontSize = 14;
  let drops = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.max(1, Math.floor(canvas.width / fontSize));
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  }

  function drawFrame() {
    context.fillStyle = 'rgba(0, 0, 0, 0.08)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#4285F4';
    context.font = fontSize + 'px monospace';

    for (let index = 0; index < drops.length; index += 1) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      context.fillText(char, index * fontSize, drops[index] * fontSize);

      if (drops[index] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[index] = 0;
      }

      drops[index] += 1;
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.setInterval(drawFrame, 35);
})();
