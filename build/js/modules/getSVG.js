/**
 * Debe agregar en el código HTML el atributo data-svg
 * sobre los elementos que desee cargar archivos SVG con la
 * extensión .xml.
 * 
 * Debe tomar en cuenta que debe ser un archivo XML válido
 * que tenga la sintaxis de un archivo SVG.
 * 
 * @returns {Promise<void>}
 */
async function getSVG () {
    const svgs = document.querySelectorAll("[data-svg$='xml']");
    const inject = /(<svg)/gi;

    svgs.forEach(svg => {
        const path = svg.dataset.svg;
        const ariaLabel = svg.getAttribute("aria-label");

        svg.removeAttribute("data-svg");
        svg.textContent = "";

        fetch(path).then(response => response.text())
            .then(data => {
                svg.innerHTML = data.replace(inject, `<svg aria-label="${ariaLabel}"`);
            });
    });
}

/**
 * Insertar archivos SVG a los elementos que contengan el 
 * atributo data-svg:
 */
getSVG();

export { };