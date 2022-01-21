/**
 * @param { HTMLElement } element Ingrese el elemento que le 
 * aplicará los attributos.
 * 
 * @param { Object<string, string> } attributes Seleccione los atributos
 * que establecerá sobre el elemento.
 */
function setAttributes(element, attributes) {
	if (!element || !attributes) {
		console.warn("Recuerda que debe pasar como parámetro un elemento y un objeto con los atributos que implementará sobre dicho elemento");
		return;
	} 

	for (const attribute in attributes) {
		const valueAttribute = attributes[attribute];
		element.setAttribute(attribute, valueAttribute);
	}	
}

export default setAttributes;