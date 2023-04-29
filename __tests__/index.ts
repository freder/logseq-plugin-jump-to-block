import { cleanLabel } from '../src/utils/index';


describe('cleanLabel', () => {
	it('should remove properties', () => {
		const content = `## asdf
id:: 643135d6-33b2-4aea-a78c-e6b3e0ce0f80
test-asdf::  12 12`;
		const result = cleanLabel(content);
		expect(result).toEqual('## asdf');
	});

	it('should remove todo items', () => {
		const content = 'TODO buy milk';
		const result = cleanLabel(content);
		expect(result).toEqual('buy milk');
	});

	it('should image dimensions', () => {
		const content = '![](./asdf.png) {:width 400}';
		const result = cleanLabel(content);
		expect(result).toEqual('![](./asdf.png)');
	});
});
