/** @format */

import Angle from 'lib/angle';
import { BBox2 } from 'lib/bbox/bbox2';
import Matrix3 from 'lib/matrix/matrix3';

const keyBuffer = new ArrayBuffer(16);
const keyBufferAsFloat64 = new Float64Array(keyBuffer);
const keyBufferAsInt32 = new Int32Array(keyBuffer);

export class Vector2 {
	static readonly ORIGIN = new this(0, 0);

	private readonly _hashed: number;

	get hashCode() {
		return this._hashed;
	}

	constructor(public x: number, public y: number) {
		keyBufferAsFloat64[0] = x;
		keyBufferAsFloat64[1] = y;
		this._hashed =
			keyBufferAsInt32[0] ^ keyBufferAsInt32[1] ^ keyBufferAsInt32[2] ^ keyBufferAsInt32[3];
	}

	dot(vec: Vector2) {
		return this.x * vec.x + this.y * vec.y;
	}

	get length() {
		return Math.sqrt(this.dot(this));
	}

	sin() {
		return this.y / this.length;
	}

	cos() {
		return this.x / this.length;
	}

	sub(vec: Vector2) {
		return new Vector2(this.x - vec.x, this.y - vec.y);
	}

	add(vec: Vector2) {
		return new Vector2(this.x + vec.x, this.y + vec.y);
	}

	scale(sx: number, sy: number) {
		return new Vector2(this.x * sx, this.y * sy);
	}

	angle(refPoint: Vector2) {
		return Math.atan2(this.y - refPoint.y, this.x - refPoint.x);
	}

	angleDegree(refPoint: Vector2) {
		return Angle.toDegree(this.angle(refPoint));
	}

	distance1(point: Vector2) {
		return Vector.hypot(point.x - this.x, point.y - this.y);
	}

	distance2(point: Vector2) {
		const dx = point.x - this.x;
		const dy = point.y - this.y;
		return dx * dx + dy * dy;
	}

	rotate(refPoint: Vector2, radian: number) {
		const cos = Math.cos(radian);
		const sin = Math.sin(radian);
		const dx = this.x - refPoint.x;
		const dy = this.y - refPoint.y;
		const x = dx * cos + dy * -sin;
		const y = dx * sin + dy * cos;
		return refPoint.add(new Vector2(x, y));
	}

	rotateD(refPoint: Vector2, degree: number) {
		return this.rotate(refPoint, Angle.toRadian(degree));
	}

	equal(point: Vector2) {
		return point.x === this.x && point.y === this.y;
	}

	multiply3(matrix: Matrix3) {
		const { 0: a, 1: d, 3: b, 4: e, 6: vx, 7: vy } = matrix.data;
		const x = this.x * a + this.y * b + vx;
		const y = this.y * d + this.y * e + vy;
		return new Vector2(x, y);
	}

	bbox() {
		return new BBox2(this.x, this.x, this.y, this.y);
	}

	toString() {
		return `Vector2 [X="${this.x}", Y="${this.y}"]`;
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}
