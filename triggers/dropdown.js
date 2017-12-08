//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Triggers to get the list of the product groups
const productGroupList = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/product-groups?skippages=0&pagesize=1000&sort=-productGroupNumber`,
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
				groupObj['id'] = counter.productGroupNumber;
				groupObj['productGroupNumber'] = counter.productGroupNumber;
				groupObj['name'] = counter.name;
				groupObj['salesAccounts'] = counter.salesAccounts;
				groupObj['products'] = counter.products;
				groupObj['self'] = counter.self;
				groupArray.push(groupObj);
			}
			return groupArray;
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
};

//Function to get the list of the Currencies Available
const currencyList = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/currencies?skippages=0&pagesize=1000`,
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
				groupObj['id'] = counter.code;
				groupObj['currencyname'] = counter.name;
				groupArray.push(groupObj);
			}
			return groupArray;
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
};

//Function to get list of Customer Group List
const customerGroup = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/customer-groups?skippages=0&pagesize=1000`,
	    method: 'GET',
	    /*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		if(response.status == 200)
		{
			if((typeof res)==='object')
			{
				var groupArray = [];
				for (var i = 0; i < res.collection.length; i++) {
				    var counter = res.collection[i];
				    var groupObj = {};
			    	groupObj['id'] = parseInt(counter.customerGroupNumber);
			    	groupObj['groupname'] = counter.name;
			    	groupArray.push(groupObj);
				}
				//z.console.log(groupArray);
				return groupArray;
			}
			return [];
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
}

//Function to get list of the Payment Terms
const paymentTerms = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/payment-terms?skippages=0&pagesize=1000`,
	    method: 'GET',
	    /*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		if(response.status == 200)
		{
			if((typeof res)==='object')
			{
				var groupArray = [];
				for (var i = 0; i < res.collection.length; i++) {
				    var counter = res.collection[i];
				    var groupObj = {};
			    	groupObj['id'] = parseInt(counter.paymentTermsNumber);
			    	groupObj['paymentname'] = counter.name;
			    	groupArray.push(groupObj);
				}
				//z.console.log(groupArray);
				return groupArray;
			}
			return [];
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
}

//Function to get the list of the Layouts
const layouts = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/layouts?skippages=0&pagesize=1000`,
	    method: 'GET',
	    /*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		if(response.status == 200)
		{
			if((typeof res)==='object')
			{
				var groupArray = [];
				for (var i = 0; i < res.collection.length; i++) {
				    var counter = res.collection[i];
				    var groupObj = {};
			    	groupObj['id'] = parseInt(counter.layoutNumber);
			    	groupObj['layoutname'] = counter.name;
			    	groupArray.push(groupObj);
				}
				//z.console.log(groupArray);
				return groupArray;
			}
			return [];
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
}

//Function to get the list of the Vat Zones
const vatZones = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/vat-zones?skippages=0&pagesize=1000`,
	    method: 'GET',
	    /*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		if(response.status == 200)
		{
			if((typeof res)==='object')
			{
				var groupArray = [];
				for (var i = 0; i < res.collection.length; i++) {
				    var counter = res.collection[i];
				    if(counter.enabledForCustomer==true)
				    {
				    	var groupObj = {};
				    	groupObj['id'] = parseInt(counter.vatZoneNumber);
				    	groupObj['vatname'] = counter.name;
				    	groupArray.push(groupObj);
				    }
				}
				//z.console.log(groupArray);
				return groupArray;
			}
			return [];
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
}

// Function to get the List of the Sales Person/ Employee
const salesPersonList = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/employees?skippages=0&pagesize=1000&sort=-employeeNumber`,
		method: 'GET',
		/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		if (response.status == 200) {
			if ((typeof res) === 'object') {
				var groupArray = [];
				if (res.collection.length>0) {
					for (var i = 0; i < res.collection.length; i++) {
						var counter = res.collection[i];
						var groupObj = {};
						groupObj['id'] = counter.employeeNumber;
						groupObj['employeeNumber'] = counter.employeeNumber;
						groupObj['employeeGroup'] = {
							'employeeGroupNumber': counter.employeeGroup.employeeGroupNumber,
							'self': counter.employeeGroup.self
						};
						groupObj['name'] = counter.name;
						groupObj['customers'] = counter.customers;
						groupObj['draftInvoices'] = counter.draftInvoices;
						groupObj['bookedInvoices'] = counter.bookedInvoices;
						groupObj['email'] = counter.email;
						groupObj['phone'] = counter.phone;
						groupObj['self'] = counter.self;
						groupArray.push(groupObj);
					}
					return groupArray;
				} else {
					return [];
				}
			} else {}
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
};

//Function to get the list of the Invoice Types
const invoiceType = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/invoices`,
	    method: 'GET',
	    /*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		z.console.log(response.content);
		if(response.status == 200){
			if((typeof res)==='object')
			{
				var groupArray = [];
				var array =  Object.keys(res).map(function (key) { return key; });
				//z.console.log(array);return [];
				for (var i = 0; i < array.length; i++) {
					var groupObj = {};
			    	groupObj['id'] = array[i];
			    	groupObj['invoicename'] = array[i];
			    	groupArray.push(groupObj);
				}
				return groupArray;
			}
			return [];
		} else if (response.status == 400 || response.status == 401) {
			throw new Error(res.message);
		} else {
			return [];
		}
	});
};

module.exports = {
	key: 'dropdown',
	noun: 'Dropdown',

	//This list the Customer Groups on this trigger.
	group: {
		key: 'group',
		noun: 'Customer Group',
		display: {
			label: 'Customer Group',
			description: 'Get Customer Group List',
			hidden: true
		},
		operation: {
			perform: customerGroup,
		},
    },

    //This list the Laouts on this trigger.
    layout: {
    	key: 'layout',
		noun: 'Layouts',
		display: {
			label: 'Layouts',
			description: 'Get Layout List',
			hidden: true
		},
		operation: {
			perform: layouts,
		},
    },

    //This list the Payment Terms on this trigger
    payment: {
    	key: 'payment',
		noun: 'Payment Terms',
		display: {
			label: 'Payment Terms',
			description: 'Get Payment Terms List',
			hidden: true
		},
		operation: {
			perform: paymentTerms,
		},
    },

    //This list the Vat Zones on this trigger
    vat: {
    	key: 'vat',
		noun: 'Vat Zone',
		display: {
			label: 'Vat Zones',
			description: 'Get Vat Zone List',
			hidden: true
		},
		operation: {
			perform: vatZones,
		},
    },

    //This list the Invoice Type on this trigger
    invoicetype: {
    	key: 'invoicetype',
		noun: 'Invoice Type',
		display: {
			label: 'Invoice Type',
			description: 'Get Invoice Type List',
			hidden: true
		},
		operation: {
			perform: invoiceType,
		},
    },

    //This list the Currency on the trigger
    currencyList: {
    	key: 'currencyList',
    	noun: 'Currency List',
    	display: {
    		label: 'Currency List',
    		description: 'Get Currency List',
    		hidden: true
    	},
    	operation: {
    		perform: currencyList,
    	},
    },

    //This list the Product Group on the trigger
    productGroupList: {
    	key: 'productGroupList',
    	noun: 'Product Group List',
    	display: {
    		label: 'Product Group List',
    		description: 'Get Product Group List',
    		hidden: true
    	},
    	operation: {
    		perform: productGroupList,
    	},
    },

    salesPersonList: {
    	key: 'salesPersonList',
    	noun: 'Sales Persons or Employees List',
    	display: {
    		label: 'Sales Persons List',
    		description: 'Get Sales Persons/ Employees List',
    		hidden: true
    	},
    	operation: {
    		perform: salesPersonList
    	}
    }
};