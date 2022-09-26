/** @format */

import { Vector2 } from 'lib/vector/vector2';

export class BBox2 {
	constructor(public minX: number, public maxX: number, public minY: number, public maxY: number) {}

	isContain(point: Vector2) {
		return this.isContainX(point.x) && this.isContainY(point.y);
	}

	isContainX(x: number) {
		return x >= this.minX && x <= this.maxX;
	}

	isContainY(y: number) {
		return y >= this.minY && y <= this.maxY;
	}
}

export class BBox2Factory {
	private minX!: number;
	private maxX!: number;
	private minY!: number;
	private maxY!: number;

	constructor() {
		this.init();
	}

	extend1(bbox: BBox2): BBox2Factory {
		this.minX = Math.min(this.minX, bbox.minX);
		this.maxY = Math.max(this.maxX, bbox.maxX);
		this.minY = Math.min(this.minY, bbox.minY);
		this.maxY = Math.max(this.maxX, bbox.maxY);
		return this;
	}

	extend2(point: Vector2) {
		this.minX = Math.min(this.minX, point.x);
		this.maxX = Math.max(this.maxX, point.x);
		this.minY = Math.min(this.minY, point.y);
		this.maxY = Math.max(this.maxY, point.y);
		return this;
	}

	extend3(points: Array<Vector2>) {
		for (let i = 0; i < points.length; i++) {
			this.extend2(points[i]);
		}
		return this;
	}

	extend4(minX: number, maxX: number, minY: number, maxY: number) {
		this.minX = Math.min(this.minX, minX);
		this.maxX = Math.max(this.maxX, maxX);
		this.minY = Math.min(this.minY, minY);
		this.maxY = Math.max(this.maxY, maxY);
		return this;
	}

	extend5(space: number) {
		if (space < 0) {
			const scale2 = space * 2;
			if (scale2 < this.minX - this.maxX || scale2 < this.minY - this.maxY) {
				return this;
			}
		}
		this.minX -= space;
		this.maxX += space;
		this.minY -= space;
		this.maxY += space;
		return this;
	}

	init() {
		this.minX = Number.POSITIVE_INFINITY;
		this.maxX = Number.NEGATIVE_INFINITY;
		this.minY = Number.POSITIVE_INFINITY;
		this.maxY = Number.NEGATIVE_INFINITY;
	}

	valid() {
		return [this.minX, this.maxX, this.minY, this.maxY].every(Number.isFinite);
	}

	build() {
		return new BBox2(this.minX, this.maxX, this.minY, this.maxY);
	}
}
