/** @format */

export function arrayEquals<T>(a1: Array<T>, a2: Array<T>) {
	if (a1.length === a2.length) {
		for (let i = 0; i < a1.length; i++) {
			if (a1[i] !== a2[i]) {
				return false;
			}
		}
		return true;
	}
	return false;
}
