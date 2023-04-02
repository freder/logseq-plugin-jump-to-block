import { prepareLabel } from '../src/utils/index';


describe('prepareLabel', () => {
	it('should remove properties', () => {
		const result = prepareLabel('11');
		expect(result).toEqual(undefined);
	});
});
