function drawHtmlOnCanvas(htmlElement, prevCtx) {
    // Create a canvas element and get its context
    const canvas = document.createElement('canvas');
    const ctx = prevCtx ? prevCtx : canvas.getContext('2d');
  
    // Get the computed styles of the HTML element
    const styles = window.getComputedStyle(htmlElement);
    console.log(styles)
  
    // Set the canvas size to match the element size and position it relative to the element
    if(!prevCtx) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.left = `${htmlElement.offsetLeft}px`;
        canvas.style.top = `${htmlElement.offsetTop}px`;

    }
  
    // Draw the background color
    ctx.fillStyle = styles.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw the background image, if present
    if (styles.backgroundImage !== 'none') {
      const imageUrl = styles.backgroundImage.slice(4, -1).replace(/"/g, '');
      const image = new Image();
      image.src = imageUrl;
      const [x, y] = styles.backgroundPosition.split(' ').map((val) => parseInt(val));
      const [width, height] = styles.backgroundSize.split(' ');
      if (width === 'cover' || height === 'cover') {
        image.onload = () => {
          const scaleX = canvas.width / image.width;
          const scaleY = canvas.height / image.height;
          const scale = Math.max(scaleX, scaleY);
          const imageWidth = image.width * scale;
          const imageHeight = image.height * scale;
          const offsetX = (imageWidth - canvas.width);
          const offsetY = (imageHeight - canvas.height);
          ctx.drawImage(image, -offsetX, -offsetY, imageWidth, imageHeight);
        };
      } else {
        const [imgWidth, imgHeight] = styles.backgroundSize.split(' ').map((val) => parseInt(val));
        image.onload = () => {
          const scaleX = imgWidth / image.width;
          const scaleY = imgHeight / image.height;
          ctx.scale(scaleX, scaleY);
          ctx.drawImage(image, x / scaleX, y / scaleY);
        };
      }
    }
  
    // Recursively draw all child elements
    // Array.from(htmlElement.children).forEach((childElement) => {
    //   drawHtmlOnCanvas(childElement, ctx);
    // });
  
    // Add the canvas to the DOM as a child of the element
    htmlElement.appendChild(canvas);
}