/** @format */

import Angle from 'lib/angle';
import Matrix from './matrix';

const ORIGIN = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export default class Matrix3 extends Matrix {
	static readonly MIRROR_X = new Matrix3([-1, 0, 0, 0, 1, 0, 0, 0, 1]);

	static readonly MIRROR_Y = new Matrix3([1, 0, 0, 0, -1, 0, 0, 0, 1]);

	static readonly ROTATE_90 = new Matrix3([0, 1, 0, -1, 0, 0, 0, 0, 1]);

	static readonly ROTATE_NAGATIVE_90 = new Matrix3([0, -1, 0, 1, 0, 0, 0, 0, 1]);

	static translate(x: number, y: number) {
		return new Matrix3([1, 0, 0, 0, 1, 0, x, y, 1]);
	}

	static scale(x: number, y: number = x) {
		return new Matrix3([x, 0, 0, 0, y, 0, 0, 0, 1]);
	}

	static rotate(radian: number) {
		const cos = Math.cos(radian);
		const sin = Math.sin(radian);
		return new Matrix3([cos, sin, 0, -sin, cos, 0, 0, 0, 1]);
	}

	static rotateDegree(degree: number) {
		return this.rotate(Angle.toRadian(degree));
	}

	readonly iScale!: number;
	readonly jScale!: number;

	constructor(data: Array<number> = ORIGIN) {
		super(3, 3, data);
		const { 0: a, 3: b, 1: d, 4: e } = data;
		this.iScale = Math.sqrt(a * a + d * d);
		this.jScale = Math.sqrt(b * b + e * e);
	}

	multiply3(matrix: Matrix3) {
		const r = new Array<number>(3 * 3);
		Matrix.multiply(3, 3, 3, this.data, matrix.data, r);
		return new Matrix3(r);
	}

	translate(x: number, y: number) {
		return this.multiply3(Matrix3.translate(x, y));
	}

	scale(x: number, y: number = x) {
		return this.multiply3(Matrix3.scale(x, y));
	}

	det() {
		const { 0: a, 3: b, 1: d, 4: e } = this.data;
		return a * e - b * d;
	}

	rotate(radian: number) {
		return this.multiply3(Matrix3.rotate(radian));
	}

	rotateDegree(degree: number) {
		return this.multiply3(Matrix3.rotateDegree(degree));
	}

	resetTranslate() {
		const { 0: a, 3: b, 1: d, 4: e } = this.data;
		return new Matrix3([a, d, 0, b, e, 0, 0, 0, 1]);
	}

	setOrigin(x: number, y: number) {
		return Matrix3.translate(-x, -y).multiply3(this).translate(x, y);
	}
}
