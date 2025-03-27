/**
 * Draws and downloads an icon.
 *
 * @param {number} size - The size of the icon in pixels.
 */
const drawIcon = (size) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    // Background
    context.fillStyle = '#1a73e8';
    context.beginPath();
    context.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    context.fill();
    // Inner circle
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(size/2, size/2, size/2 - size/8, 0, Math.PI * 2);
    context.fill();
    // Command line symbol
    context.fillStyle = '#1a73e8';
    // '>' symbol
    const arrowSize = size / 4;
    const centerX = size / 2 - arrowSize / 2;
    const centerY = size / 2;
    context.beginPath();
    context.moveTo(centerX, centerY - arrowSize / 2);
    context.lineTo(centerX + arrowSize, centerY);
    context.lineTo(centerX, centerY + arrowSize / 2);
    context.closePath();
    context.fill();
    // Horizontal line
    const lineWidth = size / 3;
    const lineHeight = size / 10;
    const lineX = centerX + arrowSize + size / 16;
    const lineY = centerY - lineHeight / 2;
    context.fillRect(lineX, lineY, lineWidth, lineHeight);

    // Download link
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `icon${size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

drawIcon(16);
drawIcon(48);
drawIcon(128);
