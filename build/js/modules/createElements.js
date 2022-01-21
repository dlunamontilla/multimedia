/**
 * @param { string } elements Nombre de la etiqueta HTML
 * @return { Array<HTMLElement> }
 */
function createElements(...elements) {
	/** @type { Array<HTMLElement>} */
	const __elements = [];

	elements.forEach(element => {
		if (typeof element === "string")
			__elements.push(
				document.createElement(element)
			);
	});

	return __elements;
}

export default createElements;