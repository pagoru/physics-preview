import { Position, Position3d } from 'types/generics.types';
import * as PIXI from 'pixi.mjs';

export const positionUtils = () => {
	const getPosition3dString = ({ x, y, z }: Position3d): string =>
		`position3d@@@${x}.${y}.${z}`;
	const getPosition2dString = ({ x, y }: Position): string =>
		`position2d@@@${x}.${y}`;
	const getPositionFromIsometricPosition = ({ x, y, z }: Position3d) => ({
		x: -(z - x) * 2,
		y: z + x - y * 2,
	});
	const getIsometricFromPosition = ({ x, y }: Position): Position3d => ({
		x: Math.round(x / 2 - (x / 2 - y) / 2),
		y: 0,
		z: Math.round((y - x / 2) / 2),
	});
	const isPosition3dEqual = (point1: Position3d, point2: Position3d): boolean =>
		Math.round(point1.x) === Math.round(point2.x) &&
		Math.round(point1.y) === Math.round(point2.y) &&
		Math.round(point1.z) === Math.round(point2.z);

	const isPosition3dInside = (
		polygon: Position3d[],
		{ x, z }: Position3d
	): boolean =>
		new PIXI.Polygon(polygon.map(({ x, z }) => [x, z]).flat(1)).contains(x, z);

	const getRoundPosition = (position: Position3d): Position3d => ({
		x: Math.round(position.x),
		y: Math.round(position.y),
		z: Math.round(position.z),
	});

	return {
		getPosition3dString,
		getPosition2dString,
		getPositionFromIsometricPosition,
		getIsometricFromPosition,
		isPosition3dEqual,
		isPosition3dInside,
		getRoundPosition,
	};
};
