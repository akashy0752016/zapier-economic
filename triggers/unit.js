//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Function to get the list of the Units Available
const unitList = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/units?skippages=0&pagesize=1000&sort=-unitNumber`,
		method: 'GET',
		/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		},*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		z.console.log(response.content);
		if(response.status == 200)
		{
			var groupArray = [];
			for (var i = 0; i < res.collection.length; i++) {
				var counter = res.collection[i];
				var groupObj = {};
				groupObj['id'] = parseInt(counter.unitNumber);
				groupObj['unitNumber'] = parseInt(counter.unitNumber);
				groupObj['unitname'] = counter.name;
				groupObj['products'] = counter.products;
				groupObj['self'] = counter.self;
				groupArray.push(groupObj);
			}
			return groupArray;
		} else if (response.status ==401) {
			throw new Error('Login to API server failed.');
		}
		return [];
	});
};

module.exports = {
	key: 'unitlist',
	noun: 'Units',
	display: {
		label: 'New Unit',
		description: 'Triggers when a new Unit is added'
	},
	operation: {
		perform: unitList,
	}
};