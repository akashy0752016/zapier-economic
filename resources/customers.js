//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

function emailValidate(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return false;
	} else {
		return true;
	}
}

const searchCustomer = (z, bundle) => {
	if (parseInt(bundle.inputData.customerNumber) < 1 || parseInt(bundle.inputData.customerNumber) > 999999999 || isNaN(bundle.inputData.customerNumber)) {
		throw new Error('Customer Number Out of Range. The Customer number must be between 1 and 999999999');
	}
	return z.request({
	    url: `${_sharedBaseUrl}/customers/${bundle.inputData.customerNumber}`,
	    method: 'GET',
	    /*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
    })
    .then((response) =>{ 
    	const res = JSON.parse(response.content);
    	if(response.status===200) {
    		return [res];
    	} else if (response.status == 404) {
            return [];
    	} else if (parseInt(response.status/100) == 4 || parseInt(response.status/100) == 5) {
    		throw new Error(res.message);
    	} else {
    		return [];
    	}   	
    });
};

//Get List of Customers
const listCustomers = (z, bundle) => {
  return z.request({
      	url: `${_sharedBaseUrl}/customers?skippages=0&pagesize=1000&sort=-customerNumber`,
      	method: 'GET',
      	/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
	  	}*/
    })
    .then((response) =>{ 
    	const res = JSON.parse(response.content);
    	//res._zap_data_was_found = false;
    	//return listVatZone(z, bundle);
    	if(response.status===200){
    		var groupArray = [];
    		for (var i = 0; i < res.collection.length; i++) {
    			var counter = res.collection[i];
				var groupObj = {};
				groupObj['id'] = parseInt(counter.customerNumber);
				groupObj['customerNumber'] = parseInt(counter.customerNumber);
				groupObj['currency'] = counter.currency;
				groupObj['paymentTerms'] = counter.paymentTerms;
				groupObj['customerGroup'] = counter.customerGroup;
				groupObj['address'] = counter.address;
				groupObj['balance'] = counter.balance;
				groupObj['dueAmount'] = counter.dueAmount;
				groupObj['country'] = counter.country;
				groupObj['creditLimit'] = counter.creditLimit;
				groupObj['email'] = counter.email;
				groupObj['name'] = counter.name;
				groupObj['zip'] = counter.zip;
				groupObj['vatZone'] = counter.vatZone;
				groupObj['lastUpdated'] = counter.lastUpdated;
				groupObj['contacts'] = counter.contacts;
				groupObj['templates'] = counter.templates;
				groupObj['totals'] = counter.totals;
				groupObj['deliveryLocations'] = counter.deliveryLocations;
				groupObj['invoices'] = counter.invoices;
				groupObj['self'] = counter.self;
				if(counter.mobilePhone!=null)
				{
					groupObj['mobilePhone'] = counter.mobilePhone;
				}	
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

// Create New Customer
const createCustomer = (z, bundle) => {
	const inputParams = {};

	if ( bundle.inputData.currency == null || bundle.inputData.customerGroupNumber == null || bundle.inputData.name == null || bundle.inputData.paymentTermsNumber == null || bundle.inputData.vatZoneNumber == null) {
		throw new Error("To create Currency, Customer Group Number, Name, Payment Terms Number and Vat Zone Number is mandetory");
	}
	
	if (bundle.inputData.address != null) {
		if (bundle.inputData.address.length <= 500) {
			inputParams['address'] = bundle.inputData.address;
		} else {
			throw new Error("Customer Address length cannot be greater than 500 characters");
		}
	}
	
	if (bundle.inputData.balance != null) {
		if (!isNaN(bundle.inputData.balance) || bundle.inputData.balance.indexOf('.') != -1) {
			inputParams['balance'] = bundle.inputData.balance;
		} else {
			throw new Error("Balance should be a number.");
		}
	}

	if (bundle.inputData.barred != null) {
		inputParams['barred'] = bundle.inputData.barred;
	}

	if (bundle.inputData.city != null) {
		if (bundle.inputData.city.length <= 50) {
			if(/\d/.test(bundle.inputData.city)) {
				throw new Error("City name can contain alphabets or space or dash only.");
			} else {
				inputParams['city'] = bundle.inputData.city;
			}
		} else {
			throw new Error("City name must be less than or equal to 50 characters");
		}
	}

	if (bundle.inputData.corporateIdentificationNumber != null) {
		if (bundle.inputData.corporateIdentificationNumber.length <= 40) {
			inputParams['corporateIdentificationNumber'] = bundle.inputData.corporateIdentificationNumber;
		} else {
			throw new Error("Corporate Identification Number must be less than or equal to 40 characters");	
		}
	}

	if (bundle.inputData.country != null) {
		if (bundle.inputData.country.length <= 50) {
			if(/\d/.test(bundle.inputData.country)) {
				throw new Error("Country name can contain alphabets or space or dash only.");
			} else {
				inputParams['country'] = bundle.inputData.country;
			}
		} else {
			throw new Error("Country name must be less than or equal to 50 characters");
		}
	}

	if (bundle.inputData.creditLimit != null) {
		if (!isNaN(bundle.inputData.creditLimit) || bundle.inputData.creditLimit.indexOf('.') != -1) {
			inputParams['creditLimit'] = bundle.inputData.creditLimit;
		} else {
			throw new Error("Credit Limit should be a number.");
		}
	}

	if (bundle.inputData.currency != null) {
		if (bundle.inputData.currency.length == 3) {
			inputParams['currency'] = bundle.inputData.currency;
		} else {
			throw new Error("Currency should be of 3 characters.");	
		}
	} else {
		throw new Error("Currency is required.");
	}

	if (bundle.inputData.customerGroupNumber != null) {
		if (isNaN(bundle.inputData.customerGroupNumber)) {
			throw new Error("Customer Group Number must be a number.");
		} else {
			inputParams['customerGroup'] = {
				'customerGroupNumber': parseInt(bundle.inputData.customerGroupNumber),
				'self': `${_sharedBaseUrl}/customer-groups/${bundle.inputData.customerGroupNumber}`
			};
		}
	} else {
		throw new Error("Customer Group Number is required.");
	}

	if (bundle.inputData.customerNumber != null) {
		if (isNaN(bundle.inputData.customerNumber)) {
			throw new Error("Customer Number must be a integer");
		} else if (parseInt(bundle.inputData.customerNumber) > 999999999 || parseInt(bundle.inputData.customerNumber) < 1) {
			throw new Error("Customer Number must be a between 1 and 999999999");
		} else {
			inputParams['customerNumber'] = parseInt(bundle.inputData.customerNumber);
		}
	}

	if (bundle.inputData.ean != null) {
		if (bundle.inputData.ean.length > 40) {
			throw new Error("EAN length should be less than 40 characters.");
		} else {
			inputParams['ean'] = bundle.inputData.ean;
		}
	}

	if (bundle.inputData.email != null) {
		if (bundle.inputData.email.length > 255) {
			throw new Error("Email must be less than 255 characters");
		} else {
			var emails = bundle.inputData.email.split(" ");
			if(emails.length > 1) {
				for (var i = 0; i < emails.length; i++) {
					if(emailValidate(emails[i])) {
						throw new Error(emails[i] + " is not a valid email addess. Please enter a valid email address.");
					}
				}
			} else {
				if(emailValidate(bundle.inputData.email)) {
					throw new Error(bundle.inputData.email + "is not a valid email addess. Please enter a valid email address.");
				}
			}
			inputParams['email'] = bundle.inputData.email;
		}
	}

	if (bundle.inputData.layoutNumber != null) {
		if(isNaN(bundle.inputData.layoutNumber)) {
			throw new Error("Layout Number must be a integer.");
		} else {
			inputParams['layout'] = {
				'layoutNumber': parseInt(bundle.inputData.layoutNumber),
				'self': `${_sharedBaseUrl}/layouts/${bundle.inputData.layoutNumber}`
			};
		}
	}

	if (bundle.inputData.name != null) {
		if (bundle.inputData.name.length < 1 || bundle.inputData.name.length > 255) {
			throw new Error("Customer name cannot be greater than 255 characters.");
		} else {
			if(/\d/.test(bundle.inputData.name)) {
				throw new Error("Customer name cannot contain digits.");
			} else {
				inputParams['name'] = bundle.inputData.name;
			}
		}
	} else {
		throw new Error("Customer Name is mandetory.");
	}

	if (bundle.inputData.paymentTermsNumber != null) {
		if (isNaN(bundle.inputData.paymentTermsNumber)) {
			throw new Error("Payment Terms Number must be an integer.");
		} else {
			inputParams['paymentTerms'] = {
				'paymentTermsNumber': parseInt(bundle.inputData.paymentTermsNumber),
				'self': `${_sharedBaseUrl}/payment-terms/${bundle.inputData.paymentTermsNumber}`
			};
		}
	} else {
		throw new Error("Payment Terms Number is mandetory.");
	}

	if (bundle.inputData.publicEntryNumber != null) {
		if (bundle.inputData.publicEntryNumber.length > 50) {
			throw new Error("Public Entry Number must be less than 50 characters.");
		} else {
			inputParams['publicEntryNumber'] = bundle.inputData.publicEntryNumber;
		}
	}

	if (bundle.inputData.employeeNumber != null) {
		if (isNaN(bundle.inputData.employeeNumber)) {
			throw new Error("Employee Number must be an integer.");
		} else {
			inputParams['salesPerson'] = {
				'employeeNumber': parseInt(bundle.inputData.employeeNumber),
				'self': `${_sharedBaseUrl}/employees/${bundle.inputData.employeeNumber}`
			}
		}
	}

	if (bundle.inputData.telephoneAndFaxNumber != null) {
		if (bundle.inputData.telephoneAndFaxNumber.length > 255) {
			throw new Error("Telephone And Fax Number cannot be greater than 255 characters.")
		} else {
			inputParams['telephoneAndFaxNumber'] = bundle.inputData.telephoneAndFaxNumber;
		}
	}

	if (bundle.inputData.vatNumber != null) {
		if (bundle.inputData.vatNumber.length > 50) {
			throw new Error("Vat Number cannot be greater than 50 characters.");
		} else {
			inputParams['vatNumber'] = bundle.inputData.vatNumber;
		}
	}

	if (bundle.inputData.vatZoneNumber !=  null) {
		if (isNaN(bundle.inputData.vatZoneNumber)) {
			throw new Error("Vat Zone Number must be a integer.");
		} else {
			inputParams['vatZone'] = {
				'vatZoneNumber': parseInt(bundle.inputData.vatZoneNumber),
				'self': `${_sharedBaseUrl}/vat-zones/${bundle.inputData.vatZoneNumber}`
			};
		}
	} else {
		throw new Error("Vat Zone Number is mandetory.");
	}

	if (bundle.inputData.website != null) {
		if (bundle.inputData.website.length > 255) {
			throw new Error("Website name cannot be greater than 255 characters.");
		} else {
			inputParams['website'] = bundle.inputData.website;
		}
	}

	if (bundle.inputData.zip != null) {
		if (bundle.inputData.zip.length > 30) {
			throw new Error("Zip code cannot be greater than 30 characters.");
		} else {
			inputParams['zip'] = bundle.inputData.zip;
		}
	}

	return z.request({
    	url: `${_sharedBaseUrl}/customers/${bundle.inputData.customerNumber}`,
    	method: 'GET',
    }).then((response) => {
    	if (response.status == 200) {
    		throw new Error("Customer with Customer Number " + bundle.inputData.customerNumber + " already exits in our record.");
    	} else {
    		const requestOptions = {
				url: `${_sharedBaseUrl}/customers`,
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
				//z.console.log(response.status);
				//z.console.log(res);
				//z.console.log(JSON.stringify(inputParams));
		    	if(response.status == 201){
		    		return res;
		    	} else if (response.status == 400 || response.status == 401) {
		    		//z.console.log(res.errors != null);
		    		if (res.errors != null) {
		    			var msg = "";
		    			for (var key in res.errors) {
			    			var obj = res.errors[key];
			    			//z.console.log(obj);
			    			msg = msg + obj.errors[0].errorMessage + " ";
			    			//z.console.log(msg);
			    		}
			    		throw new Error(res.message + " " + msg);
		    		} else {
		    			throw new Error(res.message);
		    		}
		    	} else {
		    		return {};
		    	}
			});
    	}
    });
};

module.exports = {
	key: 'customers',
	noun: 'Customers',

	// The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
	list: {
	    display: {
	      	label: 'New Customers',
	      	description: 'Trigger when a new customer is added.',
	    },
	    operation: {
	        inputFields: [
	        ],
	        perform: listCustomers,
		},
    },

	create: {
		display: {
			label: 'Create Customer',
			description: 'Create Customer on the E-conomic App'
		},
		operation: {
			inputFields: [
				{key: 'customerNumber', type: 'integer', label: 'Customer Number', helpText: 'The customer number is a positive unique numerical identifier with a maximum of 9 digits. If no customer number is specified a number will be supplied by the system.'},
				{key: 'name', type: 'string', required: true, label: 'Name', helpText: 'The customer name.'},
				{key: 'email', type: 'string', required: true, label: 'Email', helpText: 'Customer e-mail address where e-conomic invoices should be emailed. Note: you can specify multiple email addresses in this field, separated by a space. If you need to send a copy of the invoice or write to other e-mail addresses, you can also create one or more customer contacts.'},
				{key: 'address', type: 'string', label: 'Address', helpText: 'Address for the customer including street and number.'},
				{key: 'balance', type: 'number', label: 'Balance', helpText: 'The outstanding amount for this customer.'},
				{key: 'city', type: 'string', label: 'City', helpText: 'The customer’s city.'},
				{key: 'country', type: 'string', label: 'Country', helpText: 'The customer’s country.'},
				{key: 'corporateIdentificationNumber', type: 'string', label: 'Corporate Identification Number', helpText: 'Corporate Identification Number. For example CVR in Denmark.'},
				{key: 'creditLimit', type: 'number', label: 'Credit Limit', helpText: 'A maximum credit for this customer. Once the maximum is reached or passed in connection with an order/quotation/invoice for this customer you see a warning in e-conomic.'},
				{key: 'currency', type: 'string', dynamic: 'currency.id.currencyname', required: true, label: 'Currency', helpText: 'The ISO 4217 3-letter currency code of the invoice.'},
				{key: 'customerGroupNumber', type: 'integer', dynamic: 'customerGroup.id.groupname', required: true, label: 'Customer Group', helpText: 'The unique identifier of the customer group.'},
				//{key: 'ean', type: 'string', label: 'European Article Number', helpText: 'International Article Number (originally European Article Number). EAN is used for invoicing the Danish public sector.'},
				{key: 'layoutNumber', type: 'integer', dynamic: 'layouts.id.layoutname', label: 'Layout', helpText: 'Layout to be applied for invoices and other documents for this customer.'},
				{key: 'paymentTermsNumber', type: 'integer', dynamic: 'paymentTerms.id.paymentname', required: true, label: 'Payment Terms', helpText: 'The default payment terms for the customer.'},
				{key: 'employeeNumber', type: 'integer', dynamic: 'employees.id.name', label: 'Sales person', helpText: 'Reference to the employee responsible for contact with this customer.'},
				{key: 'telephoneAndFaxNumber', type: 'string', label: 'Telephone & Fax number', helpText: 'The customer’s telephone and/or fax number.'},
				{key: 'vatNumber', type: 'string', label: 'Vat Number', helpText: 'The customer’s value added tax identification number. This field is only available to agreements in Sweden, UK, Germany, Poland and Finland. Not to be mistaken for the danish CVR number, which is defined on the corporateIdentificationNumber property.'},
				{key: 'vatZoneNumber', type: 'integer', dynamic: 'vatZones.id.vatname', required: true, label: 'Vat Zone Number', helpText: 'Indicates in which VAT-zone the customer is located (e.g.: domestically, in Europe or elsewhere abroad).'},
				{key: 'website', type: 'string', label: 'Website', helpText: 'Customer website'},
				{key: 'zip', type: 'string', label: 'Zip Code', helpText: 'The customer’s postcode.'},
			],

			perform: createCustomer,
		},
	},

	// The search method on this resource becomes a Search on this app
	search: {
	    display: {
			label: 'Find Customer',
			description: 'Get Customer Information by Customer Number'
		},
		operation: {
			inputFields: [
				{key: 'customerNumber', required: true, type: 'integer'},
			],
			
			perform: searchCustomer,
		},
	},
};