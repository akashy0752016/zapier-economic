//Base Url
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Get the details of the specific unit
const searchProduct = (z, bundle) => {
	const inputParams = {};
	if (bundle.inputData.productNumber != null) {
		if(bundle.inputData.productNumber.length < 1 || bundle.inputData.productNumber.length > 25) {
			throw new Error('The Product number should contain atleast 1 characters and maximum 25 characters');
		} else {
			inputParams['productNumber'] = bundle.inputData.productNumber;
		}
	} else {
		throw new Error('Product number is required.');
	}
	return z.request({
		url: `${_sharedBaseUrl}/products/${inputParams['productNumber']}`,
		method: 'GET',
		/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		},*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		/*z.console.log(response.content);
		z.console.log(response.status);*/
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

//Function to get the list of the Products Available
const productsList = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/products?skippages=0&pagesize=1000&sort=-lastUpdated&filter=barred$eq:false`,
		method: 'GET',
		/*headers: {
			'charset': 'iso-8859-1',
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		}*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		z.console.log(response.content);
		if (response.status == 200) {
			var groupArray = [];
			for (var i = 0; i < res.collection.length; i++) {
			    var counter = res.collection[i];
		    	var groupObj = {};
		    	groupObj['id'] = counter.productNumber;
		    	groupObj['productNumber'] = counter.productNumber;
		    	groupObj['productname'] = counter.name;
		    	groupObj['recommendedPrice'] = counter.recommendedPrice;
		    	groupObj['salesPrice'] = counter.salesPrice;
		    	groupObj['barred'] = counter.barred;
		    	groupObj['lastUpdated'] = counter.lastUpdated;
		    	groupObj['productGroup'] = {
		    		'productGroupNumber': counter.productGroup.productGroupNumber,
		    		'name': counter.productGroup.name,
		    		'salesAccounts': counter.productGroup.salesAccounts,
		    		'products': counter.productGroup.products,
		    		'self': counter.productGroup.self
		    	};
		    	if(counter.unit!=null) {
		    		groupObj['unit'] = {
		    			'unitNumber': counter.unit.unitNumber,
		    			'name': counter.unit.name,
		    			'self': counter.unit.self
		    		};
		    	}
		    	if(counter.inventory) {
		    		groupObj['inventory'] = {
		    			'available': counter.inventory.available,
		    			'inStock': counter.inventory.inStock,
		    			'orderedFromSuppliers': counter.inventory.orderedFromSuppliers,
		    			'orderedByCustomers': counter.inventory.orderedByCustomers,
		    			'packageVolume': counter.inventory.packageVolume,
		    			'recommendedCostPrice': counter.inventory.recommendedCostPrice
		    		};
		    	}
		    	groupObj['invoices'] = {
		    		'drafts': counter.invoices.drafts,
		    		'booked': counter.invoices.booked,
		    		'self': counter.invoices.self
		    	};
		    	groupObj['pricing'] = counter.pricing;
		    	groupObj['self'] = counter.self;
		    	groupArray.push(groupObj);
			}
			return groupArray;
		} else if (response.status == 401) {
			throw new Error('Login to API server failed.');
		}
		return [];
	});
};

//Function to create a product
const createProduct = (z, bundle) => {
	const inputParams = {};
	
	//inputParams['barred'] = false;

	if(bundle.inputData.barCode != null) {
		if(bundle.inputData.barCode.length > 50) {
			throw new Error('Bar Code must be exactly or less than 50 characters')
		} else {
			inputParams['barCode'] = bundle.inputData.barCode;
		}
	}
	//z.console.log(typeof bundle.inputData.barred);
	//z.console.log(bundle.inputData.barred);
	//return {};
	if (bundle.inputData.barred != null) {
		inputParams['barred'] = bundle.inputData.barred;
	} 

	if (bundle.inputData.costPrice != null) {
		if (isNaN(bundle.inputData.costPrice)) {
			throw new Error("Cost Price should be number.");
		} else if (bundle.inputData.costPrice < 0) {
			throw new Error("Cost Price should not have negative value.");
		}else {
			inputParams['costPrice'] = bundle.inputData.costPrice;
		}
	}

	if (bundle.inputData.departmentalDistributionNumber != null) {
		if (parseInt(bundle.inputData.departmentalDistributionNumber) < 1) {
			throw new Error('Departmental Distribution Number minimum value should be 1.');
		} else {
			inputParams['departmentalDistribution'] = {
				'departmentalDistributionNumber': parseInt(bundle.inputData.departmentalDistributionNumber),
				'self': `${_sharedBaseUrl}/departmental-distributions/${bundle.inputData.departmentalDistributionNumber}`
			};
			if (bundle.inputData.distributionType != null) {
				inputParams['departmentalDistribution']['distributionType'] = bundle.inputData.distributionType;
			}
		}
	}

	if (bundle.inputData.description != null) {
		if(bundle.inputData.description.length > 500) {
			throw new Error('Description must be ecaxtly or less than 500 characters');
		} else {
			inputParams['description'] = bundle.inputData.description;
		}
	}

	if (bundle.inputData.available != null || bundle.inputData.grossWeight != null || bundle.inputData.grossWeightinStock != null || bundle.inputData.netWeight != null || bundle.inputData.orderedByCustomers != null || bundle.inputData.orderedFromSuppliers != null || bundle.inputData.packageVolume != null || bundle.inputData.recommendedCostPrice != null) {
		if ((bundle.inputData.available != null && bundle.inputData.grossWeight != null && bundle.inputData.grossWeightinStock != null && bundle.inputData.netWeight != null && bundle.inputData.orderedByCustomers != null && bundle.inputData.orderedFromSuppliers != null) || (bundle.inputData.packageVolume != null || bundle.inputData.recommendedCostPrice != null)) {
			inputParams['inventory'] = {};
			if (bundle.inputData.available != null) {
				if (isNaN(bundle.inputData.available)) {
					throw new Error("Inventory Available can contain only numbers.");
				} else if(parseInt(bundle.inputData.available) < 0) {
					throw new Error("Inventory Available should not have negative value.");
				} else {
					inputParams['inventory']['available'] = bundle.inputData.available;		
				}
			} else {
				throw new Error("Inventory Available is required.");
			}
			
			if (bundle.inputData.grossWeight != null) {
				if (isNaN(bundle.inputData.grossWeight)) {
					throw new Error("Inventory Gross Weight can contain only numbers.");
				} else if(parsefloat(bundle.inputData.grossWeight) < 0) {
					throw new Error("Inventory Gross Weight should not have negative value.");
				} else {
					inputParams['inventory']['grossWeight'] = bundle.inputData.grossWeight;
				}
			} else {
				throw new Error("Inventory Gross Weight is required.");
			}

			if (bundle.inputData.inStock != null) {
				if (isNaN(bundle.inputData.inStock)) {
					throw new Error("Inventory Gross Weight in Stock can contain only numbers.");
				} else if(parsefloat(bundle.inputData.inStock) < 0) {
					throw new Error("Inventory Gross Weight in Stock should not have negative value.");
				} else {
					inputParams['inventory']['inStock'] = bundle.inputData.inStock;
				}
			} else {
				throw new Error("Inventory Gross Weight in Stock is required.");
			}
			
			if (bundle.inputData.netWeight != null) {
				if (isNaN(bundle.inputData.netWeight)) {
					throw new Error("Inventory Net Weight can contain only numbers.");
				} else if(parsefloat(bundle.inputData.netWeight) < 0) {
					throw new Error("Inventory Net Weight should not have negative value.");
				} else {
					inputParams['inventory']['netWeight'] = bundle.inputData.netWeight;
				}
			} else {
				throw new Error("Inventory Net Weight is required.");
			}
			
			if (bundle.inputData.orderedByCustomers != null) {
				if (isNaN(bundle.inputData.orderedByCustomers)) {
					throw new Error("Inventory Order By Customers can contain only numbers.");
				} else {
					inputParams['inventory']['orderedByCustomers'] = bundle.inputData.orderedByCustomers;
				}
			} else {
				throw new Error("Inventory Order By Customers is required.");
			}
			
			if (bundle.inputData.orderedFromSuppliers != null) {
				if (isNaN(bundle.inputData.orderedFromSuppliers)) {
					throw new Error("Inventory Ordered From Suppliers can contain only numbers.");
				} else {
					inputParams['inventory']['orderedFromSuppliers'] = bundle.inputData.orderedFromSuppliers;
				}
			} else {
				throw new Error("Inventory Ordered From Suppliers is required.");
			}
			
			if(bundle.inputData.packageVolume != null) {
				if (isNaN(bundle.inputData.packageVolume)) {
					throw new Error("Inventory Package Volume can contain only numbers.");
				} else if(parsefloat(bundle.inputData.packageVolume) < 0) {
					throw new Error("Inventory Package Volume should not have negative value.");
				} else {
					inputParams['inventory']['packageVolume'] = bundle.inputData.packageVolume;
				}
			}

			if(bundle.inputData.recommendedCostPrice != null) {
				if (isNaN(bundle.inputData.recommendedCostPrice)) {
					throw new Error("Inventory Recommended Cost Price can contain only numbers.");
				} else if(parsefloat(bundle.inputData.recommendedCostPrice) < 0) {
					throw new Error("Inventory Recommended Cost Price should not have negative value.");
				} else {
					inputParams['inventory']['recommendedCostPrice'] = bundle.inputData.recommendedCostPrice;
				}
			}
		} else {
			throw new Error('For adding inventory the following fields are required. Inventory Available, Inventory Gross Weight, Inventory Gross Weight in Stock, Inventory Net Weight, Inventory Order By Customers and Inventory Ordered From Suppliers ');	
		}
	}
	/*if (bundle.inputData.available != null && bundle.inputData.grossWeight != null && bundle.inputData.grossWeightinStock != null && bundle.inputData.netWeight != null && bundle.inputData.orderedByCustomers != null && bundle.inputData.orderedFromSuppliers != null || (bundle.inputData.packageVolume != null || bundle.inputData.recommendedCostPrice != null)) {
		inputParams['inventory'] = {};
		inputParams['inventory']['available'] = bundle.inputData.available;
		inputParams['inventory']['grossWeight'] = bundle.inputData.grossWeight;
		inputParams['inventory']['inStock'] = bundle.inputData.inStock;
		inputParams['inventory']['netWeight'] = bundle.inputData.netWeight;
		inputParams['inventory']['orderedByCustomers'] = bundle.inputData.orderedByCustomers;
		inputParams['inventory']['orderedFromSuppliers'] = bundle.inputData.orderedFromSuppliers;
		
		if(bundle.inputData.packageVolume != null) {
			inputParams['inventory']['packageVolume'] = bundle.inputData.packageVolume;
		}
		
		if(bundle.inputData.recommendedCostPrice != null) {
			inputParams['inventory']['recommendedCostPrice'] = bundle.inputData.recommendedCostPrice;
		}
		
	} else {
		//throw new Error('For adding inventory the forllowing fields are required. Inventory Available, Inventory Gross Weight, Inventory Gross Weight in Stock, Inventory Net Weight, Inventory Order By Customers and Inventory Ordered From Suppliers ');
	}*/

	if (bundle.inputData.name != null) {
		if (bundle.inputData.name.length <= 300) {
			inputParams['name'] = bundle.inputData.name;
		} else {
			throw new Error('The product name length must be less than or equal to 300 characters');
		}
	} else {
		throw new Error('Product name is required.');
	}

	if (bundle.inputData.productGroupNumber != null) {
		if (isNaN(bundle.inputData.productGroupNumber)) {
			throw new Error("Product Group Number should be number.");
		} else if (parseInt(bundle.inputData.productGroupNumber) < 0) {
			throw new Error("Product Group Number should not have negative value.");
		} else {
			inputParams['productGroup'] = {
				'productGroupNumber': parseInt(bundle.inputData.productGroupNumber),
				'self': `${_sharedBaseUrl}/product-groups/${bundle.inputData.productGroupNumber}`
			};
		}
	}

	if (bundle.inputData.productNumber != null) {
		if(bundle.inputData.productNumber.length < 1 || bundle.inputData.productNumber.length > 25) {
			throw new Error('The Product number should contain atleast 1 characters and maximum 25 characters');
		} else {
			if (/^\w+$/i.test(bundle.inputData.productNumber)) {
				inputParams['productNumber'] = bundle.inputData.productNumber;
			} else {
				throw new Error('The Product number can have alphabets or number');
			}
		}
	} else {
		throw new Error('Product number is required.');
	}

	if (bundle.inputData.recommendedPrice != null) {
		if (isNaN(bundle.inputData.recommendedPrice)) {
			throw new Error("Recommended Price should be number.");
		} else if (parsefloat(bundle.inputData.recommendedPrice) < 0) {
			throw new Error("Recommended Price should not have negative value.");
		}else {
			inputParams['recommendedPrice'] = bundle.inputData.recommendedPrice;
		}
	}

	/*if (bundle.inputData.recommendedPrice != null) {
		inputParams['recommendedPrice'] = bundle.inputData.recommendedPrice;
	}*/

	if (bundle.inputData.salesPrice != null) {
		if (isNaN(bundle.inputData.salesPrice)) {
			throw new Error("Sales Price should be number.");
		} else if (parsefloat(bundle.inputData.salesPrice) < 0) {
			throw new Error("Sales Price should not have negative value.");
		}else {
			inputParams['salesPrice'] = bundle.inputData.salesPrice;
		}
	}

	/*if (bundle.inputData.salesPrice) {
		inputParams['salesPrice'] = bundle.inputData.salesPrice;
	}*/

	if(bundle.inputData.unitNumber != null) {
		if (isNaN(bundle.inputData.unitNumber)) {
			throw new Error("Unit Number should be number.");
		} else if (parseInt(bundle.inputData.unitNumber) < 0) {
			throw new Error("Unit Number should not have negative value.");
		} else {
			inputParams['unit'] = {
				'unitNumber': parseInt(bundle.inputData.unitNumber),
				'self': `${_sharedBaseUrl}/units/${bundle.inputData.unitNumber}`
			};
		}
	}
	//z.console.log(bundle.inputData);
	//z.console.log(inputParams);
	const requestOptions = {
		url: _sharedBaseUrl + '/products',
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
		z.console.log(response.status);
		z.console.log(res);
		z.console.log(JSON.stringify(inputParams));
		if(response.status == 201)
		{
			return res;
		} else {
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
			//throw new Error(res.message);	
		}
	});
};

module.exports = {
	key: 'products',
	noun: 'Products',
	
	// The search method on this resource becomes a Search on this app
	search: {
	    display: {
			label: 'Find Product',
			description: 'Get Product Information by Product Number'
		},
		operation: {
			inputFields: [
				{key: 'productNumber', required: true, type: 'string', label: 'Product Number', helpText: 'Unique alphanumeric product number. Maximum 25 characters and minimum 1 character'},
			],
			
			perform: searchProduct,
		},
	},

	// The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
	list: {
	    display: {
	      	label: 'New Product',
	      	description: 'Trigger when a new Product is added.',
	    },
	    operation: {
	        inputFields: [
	        ],
	        perform: productsList,
		},
    },

    create: {
    	display: {
    		label: 'Create Product',
    		description: 'Create Product on the E-conomic App'
    	},
    	operation: {
    		inputFields: [
    			{key: 'productNumber', required: true, type: 'string', label: 'Product Number', helpText: 'Unique alphanumeric product number. Maximum 25 characters and minimum 1 character'},
    			{key: 'barCode', type: 'string', label: 'Bar Code', helpText: 'String representation of a machine readable barcode symbol that represents this product. Bar Code length must be less than or equal to 50 characters'},
    			{key: 'name', required: true, type: 'string', label: 'Product Name', helpText: 'Descriptive name of the product.'},
    			{key: 'productGroupNumber', dynamic: 'productGroup.id.name', required: true, type: 'integer', label: 'Product Group Number', helpText: 'A reference to the product group this product is contained within.'},
    			{key: 'barred', type: 'boolean', label: 'Barred Product', helpText: 'If this value is true, then the product can no longer be sold, and trying to book an invoice with this product will not be possible.'},
    			{key: 'costPrice', type: 'number', label: 'Cost Price', helpText: 'The cost of the goods. If you have the inventory module enabled, this is read-only and will just be ignored.'},
    			{key: 'departmentalDistributionNumber', type: 'integer', label: 'Departmental Distribution Number', helpText: 'A unique identifier of the departmental distribution. Minimum value should be 1.'},
    			//{key: 'distributionType', type: 'string', label: 'Distribution Type', helpText: 'Type of distribution.'},
    			{key: 'description', type: 'string', label: 'Product Discription', helpText: 'Free text description of product. Maximum 500 characters.'},
    			{key: 'available', type: 'integer', label: 'Inventory Availabe', helpText: 'The number of units available to sell. This is the difference between the amount in stock and the amount ordered by customers.'},
    			{key: 'grossWeight', type: 'number', label: 'Inventory Gross Weight', helpText: 'The gross weight of the product.'},
    			{key: 'inStock', type: 'integer', label: 'Inventory Stock', helpText: 'The number of units in stock including any that have been ordered by customers.'},
    			{key: 'netWeight', type: 'number', label: 'Inventory Net Weight', helpText: 'The net weight of the product.'},
    			{key: 'orderedByCustomers', type: 'integer', label: 'Inventory Units Ordered By Customers', helpText: 'The number of units that have been ordered by customers, but haven’t been sold yet.'},
    			{key: 'orderedFromSuppliers', type: 'integer', label: 'Inventory Units Ordered From Suppliers', helpText: 'The number of units that have been ordered from your suppliers, but haven’t been delivered to you yet.'},
    			{key: 'packageVolume', type: 'number', label: 'Inventory Package Volume', helpText: 'The volume the shipped package makes up.'},
    			{key: 'recommendedCostPrice', type: 'number', label: 'Inventory Recommended Cost Price', helpText: 'The recommendedCostPrice of the product. The field is required if the Inventory module is enabled.'},
    			{key: 'recommendedPrice', type: 'number', label: 'Recommended Price', helpText: 'Recommended retail price of the goods.'},
    			{key: 'salesPrice', type: 'number', label: 'Sales Price', helpText: 'This is the unit net price that will appear on invoice lines when a product is added to an invoice line.'},
    			{key: 'unitNumber', type: 'integer', dynamic: 'units.id.unitname', search: 'unitsSearch.unitNumber', label: 'Unit', helpText: 'The unit of meassure applied to the invoice line.'},
    		],
    		perform: createProduct
    	}
    }

};