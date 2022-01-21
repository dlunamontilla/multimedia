/**
 * Obtener las proporciones de cualquier elemento HTML.
 * 
 * @param { HTMLElement } element Cualquier elemento HTML al que
 * se le van a obtener las proporciones.
 * @returns { Object<string, number> }
 */
function getSize (element) {
	if (!element) return {
		width: 0,
		heigth: 0
	}

	const size = element.getBoundingClientRect();
	const { width, height } = size;
	
	return {
		width, height
	};
}

/**
 * Mantener la relación de aspecto de un elemento HTML y ajustar
 * la anchura del mismo en función de su contenedor.
 * 
 * @param { HTMLElement } targetElement Elemento HTML que se tomará 
 * como punto de partida.
 * 
 * @param { HTMLElement } targetContainer Contenedor del elemento destino
 * sobre el que se aplicarán las propiedades personalizadas.
 * 
 * @returns { void }
 */
function adjustElement (targetElement, targetContainer) {
	const referenceWidth = getSize(targetContainer)?.width || 0;
	if (!referenceWidth > 0) return;

	const { width } = getSize(targetElement);
	const adjustLeft = (width / referenceWidth) * 100;
	const adjustRight = 100 - adjustLeft;

	targetContainer.setAttribute("style", `--adjust-left: ${adjustLeft}%; --adjust-right: ${adjustRight}%`);
}

export default adjustElement;