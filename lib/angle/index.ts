/** @format */

export default class Angle {
	static toDegree(radian: number) {
		return (radian * 180) / Math.PI;
	}

	static toRadian(degree: number) {
		return (degree / 180) * Math.PI;
	}
}
