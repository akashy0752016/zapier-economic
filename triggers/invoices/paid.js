//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Function to get the list of the Paid invoices
const paidInvoice = (z, bundle) => {
	return z.request({
		url: `${_sharedBaseUrl}/invoices/paid?skippages=0&pagesize=1000&sort=-bookedInvoiceNumber`,
		method: 'GET',
		/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		},*/
	}).then((response) => {
		const res = JSON.parse(response.content);
		/*z.console.log(res.collection);
		z.console.log(res.collection.length);*/
		if(response.status == 200)
		{
			var groupArray = [];
			if(res.collection.length>0){
				for (var i = 0; i < res.collection.length; i++) {
					var counter = res.collection[i];
					var groupObj = {};
					groupObj['id'] = parseInt(counter.bookedInvoiceNumber);
					groupObj['bookedInvoiceNumber'] = counter.bookedInvoiceNumber;
					groupObj['currency'] = counter.currency;
					groupObj['customer'] = counter.customer;
					groupObj['date'] = counter.date;
					groupObj['delivery'] = counter.delivery;
					groupObj['deliveryLocation'] = counter.deliveryLocation;
					groupObj['dueDate'] = counter.dueDate;
					groupObj['grossAmount'] = counter.grossAmount;
					groupObj['layout'] = counter.layout;
					groupObj['netAmount'] = counter.netAmount;
					groupObj['netAmountInBaseCurrency'] = counter.netAmountInBaseCurrency;
					groupObj['notes'] = counter.notes;
					groupObj['paymentTerms'] = counter.paymentTerms;
					groupObj['pdf'] = counter.pdf;
					groupObj['project'] = counter.project;
					groupObj['recipient'] = counter.recipient;
					groupObj['references'] = counter.references;
					groupObj['remainder'] = counter.remainder;
					groupObj['remainderInBaseCurrency'] = counter.remainderInBaseCurrency;
					groupObj['roundingAmount'] = counter.roundingAmount;
					groupObj['self'] = counter.self;
					groupObj['sent'] = counter.sent;
					groupObj['vatAmount'] = counter.vatAmount;
					groupArray.push(groupObj);
				}
			}
			return groupArray;
		} else if (parseInt(response.status/100) == 4 || parseInt(response.status/100) == 5) {
			throw new Error(res.message);
		}
		return [];
	});
};

module.exports = {
	key: 'paid',
	noun: 'Paid invoices',
	display: {
		label: 'New Paid Invoice',
		description: 'Triggers when a new Paid Invoice is added'
	},
	operation: {
		perform: paidInvoice,
	}
};