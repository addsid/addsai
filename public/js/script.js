async function generateImage() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");
  const downloadBtn = document.getElementById("downloadBtn");

  output.innerHTML = "Generating image...⏳";
  downloadBtn.style.display = "none";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.image) {
      const img = new Image();
      img.src = data.image; // Tidak perlu prefix lagi karena sudah ada dari backend
      img.alt = "Generated Image";
      output.innerHTML = "";
      output.appendChild(img);

      const safePrompt = prompt.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const now = new Date();
      const shortTimestamp = now.toISOString().slice(0, 19).replace(/[-T:]/g, "").replace(/(\d{8})(\d{6})/, "$1-$2");
      const fileName = `fivestar-gemini-${safePrompt}-${shortTimestamp}.png`;

      downloadBtn.href = data.image;
      downloadBtn.download = fileName;
      downloadBtn.style.display = "inline-block";
      document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    } else {
      output.innerHTML = "Failed to generate image.";
    }
  } catch (error) {
    output.innerHTML = "Error generating image. Please check your connection.";
    console.error("Error:", error);
  }
}



async function generateVideo() {
  const prompt = document.getElementById("videoPrompt").value;
  const output = document.getElementById("videoOutput");
  output.innerHTML = "Generating video...";

  const response = await fetch("/generate-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  if (data.videos && data.videos.length > 0) {
    output.innerHTML = data.videos
      .map((videoUrl) => `<video controls><source src="${videoUrl}" type="video/mp4"></video>`)
      .join("");
  } else {
    output.innerHTML = "Failed to generate video.";
  }
}
