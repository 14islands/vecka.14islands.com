export default (func, threshold, execAsap) => {
	let timeout;

	return () => {
		let obj = this, args = arguments;

		let delayed = () => {
			if (!execAsap) {
				func.apply(obj, args);
			}
			timeout = null;
		}

		if (timeout) {
			clearTimeout(timeout);
		} else if (execAsap) {
			func.apply(obj, args);
		}

		timeout = setTimeout(delayed, threshold || 100);
	}
}
