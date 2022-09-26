/** @format */

export default function arrayCopy<T>(
	src: Array<T>,
	srcPos: number,
	destination: Array<T>,
	destPos: number,
	length: number,
) {
	if (src.length === srcPos + length && destination.length >= destPos + length) {
		while (length-- > 0) {
			destination[destPos++] = src[srcPos++];
		}
	} else {
		throw new Error('arrayCopy out of range');
	}
}
