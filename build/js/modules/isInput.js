const exclude = [
	"INPUT", "TEXTAREA"
];

/**
 * @param { HTMLInputElement } inputs
 * @returns { boolean }
 */
function isInput (...inputs) {
	if (!inputs) return;

	for (const input of inputs) {
		if (exclude.includes(input?.tagName)) return true;
	}

	return false;
}

export default isInput;