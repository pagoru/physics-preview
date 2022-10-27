export const colorUtils = () => {
	const getRandomColor = (): number => Math.floor(Math.random() * 16777215);

	return {
		getRandomColor,
	};
};
