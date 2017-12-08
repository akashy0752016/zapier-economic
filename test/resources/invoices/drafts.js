require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../../index');
const appTester = zapier.createAppTester(App);

describe('Draft Invoice Resource', () => {
	it('should test new draft invoices', (done) => {
		const bundle = {};
		appTester(App.resources.drafts.list.operation.perform, bundle)
			.then((results) => {
				//console.log("Testing");
				console.log(results);
				done();
		}).catch(done);
	}).timeout(10000);
});