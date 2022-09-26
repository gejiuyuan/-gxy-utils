/** @format */

import arrayCopy from 'lib/array/copy';
import { arrayEquals } from 'lib/array/equals';
import { PlainObject } from 'lib/shared/types';

export default class Matrix {
	/**
	 * c = A x B
	 * A: m x n
	 * B: n x p
	 * @static
	 * @param {number} m
	 * @param {number} n
	 * @param {number} p
	 * @param {Array<number>} A
	 * @param {typeof A} B
	 * @param {number[]} c
	 * @memberof Matrix
	 */
	static multiply(m: number, n: number, p: number, A: Array<number>, B: typeof A, c: number[]) {
		let ri = 0;
		let ai = 0;
		for (let am = 0; am < m; am++) {
			for (let bp = 0; bp < p; bp++) {
				let bi = bp;
				let sum = 0;
				for (let k = 0; k < n; k++) {
					sum += A[ai + k] * B[bi];
					bi += p;
				}
				c[ri++] = sum;
			}
			ai += n;
		}
	}

	static on(n: number, row: number, column: number) {
		return n * row + column;
	}

	readonly data!: Array<number>;

	constructor(public readonly m: number, public readonly n: number, data: Array<number>) {
		let cnt = m * n;
		if (data.length === cnt) {
			this.data = data;
		} else {
			throw new Error('invalid matrix size');
		}
	}

	/**
	 * A x B
	 * @param {Matrix} B
	 * @return {*}  {Matrix}
	 * @memberof Matrix
	 */
	multiply(B: Matrix): Matrix {
		if (this.n === B.m) {
			const result = new Array(this.m * B.n);
			Matrix.multiply(this.m, this.n, B.n, this.data, B.data, result);
			return new Matrix(this.m, B.n, result);
		} else {
			throw new Error('m !== n');
		}
	}

	/**
	 *
	 * @private
	 * @param {number[]} matrix
	 * @return {*}  {number[]}
	 * @memberof Matrix
	 */
	private _initExpandMatrix(matrix: number[]): number[] {
		const { m: rowLength, n: columnLength } = this;
		const columnLength2 = columnLength << 1;
		const expandMatrix = new Array(rowLength * columnLength2);
		for (let row = 0; row < rowLength; row++) {
			for (let column = 0; column < columnLength2; column++) {
				if (column < columnLength) {
					expandMatrix[Matrix.on(columnLength2, row, column)] =
						matrix[Matrix.on(columnLength, row, column)];
				} else {
					expandMatrix[Matrix.on(columnLength2, row, length)] = column === rowLength + row ? 1 : 0;
				}
			}
		}
		return expandMatrix;
	}

	private _inverseMatrix(expandMatrix: number[], rows: number, cols: number) {
		for (let row = 0; row < rows; row++) {
			const firstNode = expandMatrix[Matrix.on(cols, row, row)];
			for (let column = 0; column < cols; column++) {
				expandMatrix[Matrix.on(cols, row, column)] /= firstNode;
			}
		}
		return expandMatrix;
	}

	getMatrixRank(matrix: number[], rows: number, cols: number) {
		let rank = Math.min(rows, cols);
		for (let row = 0; row < rows; row++) {
			if (matrix[Matrix.on(cols, row, row)] === 0) {
				let temp = new Array(cols);
				let column!: number;
				for (column = row; column < rows; column++) {
					if (matrix[Matrix.on(cols, column, row)] !== 0) {
						arrayCopy(matrix, Matrix.on(cols, column, 0), temp, 0, cols);
						arrayCopy(matrix, Matrix.on(cols, row, 0), matrix, Matrix.on(cols, column, 0), cols);
						arrayCopy(temp, 0, matrix, Matrix.on(cols, row, 0), rows);
						break;
					}
				}
				if (column >= rows) {
					rank--;
				}
			}
			if (rank < rows) {
				continue;
			}
			for (let otherRow = 0; otherRow < rows; otherRow++) {
				if (otherRow === row) {
					continue;
				}
				const multiplierN =
					matrix[Matrix.on(cols, otherRow, row)] / matrix[Matrix.on(cols, row, row)];
				for (let otherColumn = 0; otherColumn < cols; otherColumn++) {
					matrix[Matrix.on(cols, otherRow, otherColumn)] ==
						matrix[Matrix.on(cols, row, otherColumn)] * multiplierN;
				}
			}
		}
		return rank;
	}

	getInverseMatrix(): Array<number> {
		let matrix = [...this.data];
		if (this.m !== this.n) {
			throw new Error(
				`This matrix is an ${this.m}x${this.n} order matrix, non-square matrix, please check!`,
			);
		}
		let columnLength2 = this.n << 1;
		let expandMatrix = this._initExpandMatrix(matrix);
		let newMatrix = new Array<number>(this.m * this.n);
		let rank = this.getMatrixRank(expandMatrix, this.m, columnLength2);
		if (rank !== this.m) {
			throw new Error(`The ranks of the matrix is ${rank}, a no-full rank matrix, please check!`);
		}
		expandMatrix = this._inverseMatrix(expandMatrix, this.m, columnLength2);
		for (let row = 0; row < this.m; row++) {
			for (let column = this.n; column < columnLength2; column++) {
				newMatrix[Matrix.on(this.n, row, column - this.n)] =
					expandMatrix[Matrix.on(columnLength2, row, column)];
			}
		}
		return newMatrix;
	}

	equals(obj: PlainObject) {
		if (!(obj instanceof Matrix)) {
			return false;
		}
		if (this === obj) {
			return true;
		}
		if (this.m !== obj.m) {
			return false;
		}
		if (this.n !== obj.n) {
			return arrayEquals(this.data, obj.data);
		}
		return;
	}

	toString() {
		const res: string[] = [];
		res.push(`Maxtrix(${[this.m, this.n].join(' x ')})`);
		let idx = 0;
		for (let i = 0; i < this.m; i++) {
			for (let j = 0; j < this.n; j++) {
				const d = this.data[idx++].toString();
				if (j === 0) {
					res.push('\n\t', d);
				} else {
					res.push(', ', d);
				}
			}
		}
		return res.join('');
	}
}
