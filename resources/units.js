//Base Url
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
    	} else if (response.status == 404) {
            return [];
        } else if ( response.status == 400 || response.status == 401 ) {
    		throw new Error(res.message);
    	} else {
    		return [];
    	}    	
    });
};

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

//Function to create a unit
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
		/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
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
	key: 'units',
	noun: 'Units',
	
	// The search method on this resource becomes a Search on this app
	search: {
	    display: {
			label: 'Find Unit',
			description: 'Get the info for the Unit by Unit Number'
		},
		operation: {
			inputFields: [
				{key: 'unitNumber', required: true, type: 'integer', label: 'Unit Number', label: 'A unique identifier of the unit.'},
			],
			perform: searchUnits,
		}
	},

	// The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
	list: {
	    display: {
			label: 'New Unit',
			description: 'Triggers when a new Unit is added'
		},
		operation: {
			perform: unitList,
		}
    },

    create: {
    	display: {
			label: 'Create Unit',
			description: 'Create a new Unit on E-conomic App'
		},
		operation: {
			inputFields: [
				{key: 'unitNumber', type: 'integer', label: 'Unit Number', helpText: 'A unique identifier of the unit.'},
				{key: 'name', type: 'string', required: true, label: 'Unit Name', helpText: 'The name of the unit. Max length of name 8 characters.'},
			],
			perform: createUnit,
		}
    }

};