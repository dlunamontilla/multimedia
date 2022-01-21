(function () {
	var requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;

	window.requestAnimationFrame = requestAnimationFrame;
})();

const canvas = document.createElement("canvas");
canvas.setAttribute("aria-label", "Visualizador de vídeos");
const context = canvas.getContext("2d");

/**
 * @param { Object<string, *> } config
 */
const loadData = function loadData(config) {
	const { video, multimedia } = config;
	if (!video || !multimedia) return;

	const width = video.videoWidth;
	const height = video.videoHeight;

	multimedia.appendChild(canvas);

	canvas.setAttribute("width", width);
	canvas.setAttribute("height", height);
	context.clearRect(0, 0, width, height);

	let num = 0;

	function pintarVideo() {
		if (video.paused || video.ended) return;
		requestAnimationFrame(pintarVideo);

		context.drawImage(video, 0, 0, width, height);
		resultados.textContent = `{width: ${width}, height: ${height}, num: ${++num}}`;
	}

	video.onplay = () => {
		requestAnimationFrame(pintarVideo);
	}

	return canvas;
}

export default loadData;