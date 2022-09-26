/** @format */

class Vector {
	static hypot(x: number, y: number) {
		x = Math.abs(x);
		y = Math.abs(y);
		if (y > x) {
			y ^= x;
			x ^= y;
			y ^= x;
		}
		if (x === 0) {
			return y;
		}
		const t = y / x;
		return x * Math.sqrt(1 + t * t);
	}
}
