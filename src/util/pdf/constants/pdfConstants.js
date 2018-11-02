export const KeyKeywords = {
	Type: true,
	Subtype: true,
	BaseFont: true,
	PDF: true,
	ColorSpace: true,
	Filter: true,
	ProcSet: true
};
//72dpi 25.4mm 1mm=2.834645669
export const pageSazeMapA = {
	A4: [0, 0, 595, 842],
	A4: [0, 0, 595, 842]
}
export const paperSizeSet = {
	A6: {
		x: 105,
		y: 148
	},
	B6: {
		x: 128,
		y: 182
	},
	A5: {
		x: 148,
		y: 210
	},
	B5: {
		x: 182,
		y: 257
	},
	A4: {
		x: 210,
		y: 297
	},
	B4: {
		x: 257,
		y: 364
	},
	A3: {
		x: 297,
		y: 420
	}
}
export const pageSazeMap = (() => {
	const retMap = {};
	const retio = 1 / 25.4 * 72;
	for (let key in paperSizeSet) {
		const value = paperSizeSet[key];
		const x = Math.floor(value.x * 10 * retio) / 10;
		const y = Math.floor(value.y * 10 * retio) / 10;
		retMap[key] = [0, 0, x, y];
	}
	return retMap
})()