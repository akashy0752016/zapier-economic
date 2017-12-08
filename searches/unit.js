//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Get the details of the specific unit
const searchUnits = (z, bundle) => {
	if ( !(bundle.inputData.unitNumber != null) ) {
		throw new Error('Unit Number is required.');
	}
	return z.request({
      	url: `${_sharedBaseUrl}/units/${bundle.inputData.unitNumber}`,
      	method: 'GET',
      	/*headers: {
		    'content-type': 'application/json',
		    'X-AppSecretToken': process.env.APPTOKEN,
		    'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
	    }*/
    }).then((response) =>{ 
    	const res = JSON.parse(response.content);
    	if(response.status == 200) {
    		groupObj = {};
    		groupObj['id'] = res.unitNumber;
    		groupObj['unitNumber'] = res.unitNumber;
    		groupObj['name'] = res.name;
    		groupObj['self'] = res.self;
    		groupObj['products'] = res.products;
    		return [groupObj];
    	} else if ( response.status == 400 || response.status == 401 ) {
    		throw new Error(res.message);
    	} else {
    		return [];
    	}    	
    });
};

module.exports = {
	key: 'searchunit',
	noun: 'Search Unit by Unit Number',
	display: {
		label: 'Search Unit by Unit Number',
		description: 'Get the info for the Unit by Unit Number'
	},
	operation: {
		inputFields: [
			{key: 'unitNumber', required: true, type: 'integer', label: 'Unit Number', label: 'A unique identifier of the unit.'},
		],
		perform: searchUnits,
	}
};