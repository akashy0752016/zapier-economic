//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

const createUnit = (z, bundle) => {
	const inputParams = {};
	if(bundle.inputData.name!=null) {
		if (bundle.inputData.name.length > 0 && bundle.inputData.name.length <=8) {
			inputParams['name'] = bundle.inputData.name;
		} else {
			throw new Error('Unit name must have at least 1 character and Max 8 characters.');	
		}
	} else {
		throw new Error('Unit name is required.');
	}
	const requestOptions = {
		url: _sharedBaseUrl + '/units',
		method: 'POST',
		body: JSON.stringify(inputParams),
		headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}
	};
	return z.request(requestOptions)
	.then((response) => {
		const res = JSON.parse(response.content);
		/*z.console.log(response.status);
		z.console.log(res);
		z.console.log(JSON.stringify(inputParams));*/
    	if(response.status==201){
    		groupObj = {};
    		groupObj['id'] = res.unitNumber;
    		groupObj['unitNumber'] = res.unitNumber;
    		groupObj['name'] = res.name;
    		groupObj['self'] = res.self;
    		groupObj['products'] = res.products;
    		return groupObj;
    	} else if (response.status == 400 || response.status == 401) {
    		throw new Error(res.message);
    	} else {
    		return {};
    	}	
	});
};

module.exports = {
	key: 'newunit',
	noun: 'Create New Unit',
	display: {
		label: 'Create New Unit',
		description: 'Create a new Unit on E-conomic App'
	},
	operation: {
		inputFields: [
			{key: 'name', type: 'string', required: true, label: 'Unit Name', helpText: 'The name of the unit. Max length of name 8 characters.'},
		],
		perform: createUnit,
	}
};