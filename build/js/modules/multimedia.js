import createElements from "./createElements.js";
import isInput from "./isInput.js";
import { keyboard, toggleFullScreen } from "./keyboard.js";
import setAttributes from "./setAttributes.js";
import adjustElement from "./adjustElement.js";
import { searchData } from "./get-register.js";
import search from "./search.js";

// import loadData from "./canvas.js";

/**
 * @param { string } path Ruta de la API
 * @return { Promise<Array<string|number>> }
 */
async function getData(path) {
	const response = await fetch(path);
	const data = await response.json();

	return data;
}

/**
 * @param { Object<string, string> } config Configuración de renderizado-
 * @returns { void }
 */
async function render(config) {
	/**
	 * @type { HTMLInputElement }
	 */
	const inputQuery = document.querySelector("#q");

	const { selectorMultimedia, selectorAside, path = "api/" } = config;
	if (!selectorMultimedia || !selectorAside) return;


	const multimedia = document.querySelector(selectorMultimedia);
	const aside = document.querySelector(selectorAside);
	if (!multimedia || !aside) {

		if (!multimedia) console.warn("Verifique que el selector para el objeto multimedia sea válido", { multimedia: multimedia });
		if (!aside) console.warn("Verifique que el selector para la barra lateral sea válido", { aside: aside });

		return;
	}

	const data = await getData(path);
	const filteredData = search(data);


	/**
	 * Ruta predeterminada en función del criterio de búsqueda
	 * previamente introducido por el usuario.
	 */
	let [defaultPath] = inputQuery.value.trim().length > 0
		? searchData(inputQuery.value, data)
		: filteredData;

	if (!data.length > 0) {
		console.warn("Agregue videos en la carpeta multimedia y dentro de la carpeta multimedia agregue una carpeta llamada \"jpeg\"");
		return;
	}


	defaultPath = defaultPath.replace(/^[.\/]/g, "");
	const [video] = createElements("video");

	setAttributes(video, {
		"src": `./multimedia/${defaultPath}`,
		"autoplay": "autoplay",
		"data-id": "0",
		"aria-label": "Visualizador de vídeos"
	});

	video.controls = true;

	const [multimediaInner] = createElements("div");
	multimediaInner.classList.add("flex__item__inner");
	multimediaInner.appendChild(video);
	multimedia.appendChild(multimediaInner);

	// Renderizar la lista de reproducción:
	const [lists, list, graphic, img, content, title] = createElements(
		"div", "a", "div", "img", "div", "div"
	);

	// Preparación de la lista del reproductor:
	lists.classList.add("lists");
	list.classList.add("lists__item");
	graphic.classList.add("lists__item__graphic");
	img.classList.add("lists__item__graphic__img");
	content.classList.add("lists__item__content");
	title.classList.add("lists__item__content__title");
	
	lists.setAttribute("data-svg", "build/images/logo-modificado.svg");

	/**
	 * @type { Array<Object<string, HTMLAnchorElement>> }
	 */
	const links = [];

	/**
	 * 
	 * @param { Array<string|number> } data Lista de archivos
	 */
	const loadList = (data) => {
		links.length = 0;

		lists.textContent = "";
		data.forEach((path, index) => {
			/**
			 * @type { string }
			 */
			let textTitle;

			/**
			 * @type { string }
			 */
			let __path = path.replace(/^(.\/)+/g, "");
			__path = __path.replace(/(y2mate\.com)+/g, "");
			__path = __path.replace(" - ", "");
			__path = __path.replace(/([a-zá-ź_\-0-9]+\.mp4)/gi, "");
			__path = __path.replace(/([a-zá-ź_\-0-9]+\.webm)/gi, "");

			textTitle = __path;

			__path = `${__path.substring(0, 50)}...`;

			const video = `multimedia/${path.replace(/^(\.\/)/, "")}`;
			let imagen = "multimedia/jpeg" + path.replace(/(\.webm|\.mp4)/gi, ".jpg");
			const search = path.replace(/(\.webm|\.mp4|^(\.\/))/gi, "");

			imagen = imagen.replace(".", "");

			const __list = list.cloneNode(false),
				__graphic = graphic.cloneNode(false),
				__img = img.cloneNode(false),
				__content = content.cloneNode(false),
				__title = title.cloneNode(false);

			__title.textContent = __path;

			__img.setAttribute("src", imagen);
			__graphic.appendChild(__img);
			__content.appendChild(__title);

			// Enlaces:
			setAttributes(__list, {
				"data-id": index,
				"title": search,
				"data-search": search,
				href: video
			});

			__list.append(__graphic, __content);

			lists.appendChild(__list);

			links.push({ href: video, __list });
		});
	}

	if (inputQuery) {
		inputQuery.oninput = function () {
			const peliculas = searchData(this.value, data);
			loadList(peliculas);
		}

		/**
		 * 
		 * @param {HTMLInputElement} element Input Element
		 * @param { boolean } option Este parámetro es opcional. Su valor por
		 * defecto «true»
		 *  
		 * @returns { void } 
		 */
		const focused = (element, option = true) => {
			/**
			 * @type { HTMLDivElement }
			 */
			const parentElement = element.parentNode.parentNode.parentNode;
			if (!parentElement || !parentElement.classList.contains("search")) return;

			option
				? parentElement.classList.add("search--focused")
				: parentElement.classList.remove("search--focused");
		};

		inputQuery.onfocus = function() {
			focused(this);
		}

		inputQuery.onblur = function() {
			focused(this, false);
		}
	}

	/**
	 * Mostrar la lista de reproducción al momento
	 * de cargar si previamente se había introducido
	 * un criterio de búsqueda.
	 */
	inputQuery.value.trim().length > 0
		? loadList(searchData(inputQuery.value, data))
		: loadList(filteredData);

	lists.addEventListener("click", function (e) {
		e.preventDefault();

		/**
		 * @type { HTMLAnchorElement }
		 */
		const anchor = e.target;

		if (anchor.tagName !== "A") return;

		video.setAttribute("data-id", anchor.dataset.id);
		video.setAttribute("src", anchor.href);
		history.pushState(data, "Done", `./?q=${anchor.dataset.search}`);

		search(data);
		location.href = "#multimedia";
	});

	video.muted = true;

	aside.textContent = "";
	aside.appendChild(lists);

	// Cuando el vídeo se detiene debe arrancar el siguiente:
	let pos = 0;
	video.addEventListener("ended", function () {
		/** @type { string } */
		let repeat = multimedia.dataset.repeat || "none";

		if (isNaN(this.dataset.id)) return;
		pos = Number(this.dataset.id) + 1;

		if (repeat == "all" && pos >= links.length) pos = 0;
		if (repeat == "current") pos = Number(this.dataset.id);

		const nextVideo = links[pos]?.href;

		console.log({ nextVideo, links });

		if (nextVideo) {
			this.src = nextVideo;
			this.dataset.id = pos;
			video.play();
		}
	});

	const footer = document.querySelector("footer");

	video.onclick = function () {
		this.paused
			? this.play()
			: this.pause();
	}

	video.ondblclick = function () {
		toggleFullScreen(this);
	}

	// Método abreviado de teclado:
	onkeydown = function (e) {
		if (!isInput(e.target)) keyboard(e, video);
	}

	// Ajustar anchura del elemento:
	const multimediaContainer = document.querySelector("#multimedia-container");

	video.addEventListener("loadeddata", function () {
		const { videoWidth, videoHeight } = this;

		setAttributes(this, {
			width: videoWidth,
			height: videoHeight
		});

		this.play();
		// if (footer) controls(this, footer);

		if (multimediaContainer) {
			adjustElement(this, multimediaContainer);
		}
	});

	addEventListener("resize", function () {
		adjustElement(video, multimediaContainer);
	});
}

const config = {
	selectorMultimedia: "#multimedia",
	selectorAside: "#sidebar",
};

render(config);

export { };