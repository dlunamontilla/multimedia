import { getFormData, searchData } from "./get-register.js";

/**
 * 
 * @param { Array<string> } data Array de rutas de archivos.
 * @returns { Array<string> } Devuelve una lista de rutas de videos.
 */
const search = (data) => {
    let { search } = location;
    search = search.replace(/^(\?q=)/gi, "");
    search = decodeURIComponent(search);

    return data.length > 0
        ? searchData(search, data)
        : data;
}

/**
 * 
 * @param { string } selector Ingrese un selector válido;
 */
const searchForm = (selector) => {
    /**
     * @type { HTMLFormElement }
     */
    const form = document.querySelector(selector);
    if (!form || form.tagName !== "FORM") {
        console.warn("Debe colocar el selector de un formulario");
        return;
    }

    form.onsubmit = function (e) {
        e.preventDefault();
        const { q } = getFormData(this);
        history.pushState(getFormData(this), "Done", `?q=${q}`);
    }
}

searchForm("#search");

export default search;
