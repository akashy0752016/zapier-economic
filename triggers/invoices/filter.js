//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Function to get the list of the Paid invoices
const filterInvoices = (z, bundle) => {
	var url = ``;
	if (bundle.inputDataRaw.invoiceType == null) {
		throw new Error("Invoice Type is required.");
	} else {
		if (bundle.inputDataRaw.invoiceType != null && bundle.inputDataRaw.invoiceType == 'drafts') {
			url = `${_sharedBaseUrl}/invoices/${bundle.inputDataRaw.invoiceType}?skippages=0&pagesize=10&sort=-draftInvoiceNumber`;
		} else if (bundle.inputDataRaw.invoiceType != null) {
			url = `${_sharedBaseUrl}/invoices/${bundle.inputDataRaw.invoiceType}?skippages=0&pagesize=10&sort=-bookedInvoiceNumber`;
		}
	}
	if (bundle.inputDataRaw.daysOld != null) {
		if (isNaN(bundle.inputDataRaw.daysOld)) {
			throw new Error("Days Old must have an integer value.");
		} else {
			var todayDate = new Date();
			todayDate = todayDate.setDate(todayDate.getDate() - parseInt(bundle.inputDataRaw.daysOld));
			var date = new Date(todayDate);
			var dd = date.getDate();
		    var mm = date.getMonth() + 1;
		    var yyyy = date.getFullYear();
			z.console.log(yyyy+ "-" + mm + "-" + dd);
			z.console.log(date+ "   day " + dd + "  month  " + mm + "   year   " + yyyy);
			url = url + '&filter=date$lte:' + yyyy+ "-" + mm + "-" + dd;
		}
	} else {
		throw new Error("Days Old is required.");
	}
	return z.request({
		url: url,
		method: 'GET',
		/*headers: {
			'content-type': 'application/json',
			'X-AppSecretToken': process.env.APPTOKEN,
			'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
		},*/
	}).then((response) => {
		if (response.status == 200) {
			const res = JSON.parse(response.content);
			var tempArray = [];
			if (res.collection.length > 0) {
				for (var i = 0; i < res.collection.length; i++) {
					var counter = res.collection[i];
					var groupObj = {};
					if (counter.bookedInvoiceNumber != null) {
						groupObj['id'] = parseInt(counter.bookedInvoiceNumber);	
						groupObj['bookedInvoiceNumber'] = counter.bookedInvoiceNumber;
					} else if (counter.draftInvoiceNumber != null) {
						groupObj['id'] = parseInt(counter.draftInvoiceNumber);	
						groupObj['draftInvoiceNumber'] = counter.draftInvoiceNumber;
					}
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
					tempArray.push(groupObj);
				}
			}
			return tempArray;
		} else if (parseInt(response.status/100) == 4 || parseInt(response.status/100) == 5) {
            throw new Error(res.message);
        } else {
            return [];
        }
	});
};

module.exports = {
	key: 'searchInvoice',
	noun: 'Filter Invoices',
	display: {
		label: 'Filter Invoices',
		description: 'Triggers when a new Invoice is added that meets the specific condtions (Without line item support)'
	},
	operation: {
		inputFields : [
			{key: 'invoiceType', type: 'string', required: true, choices: {'drafts': 'Drafts', 'booked': 'Booked', 'paid': 'Paid', 'unpaid': 'Unpaid', 'overdue': 'Overdue', 'not-due': 'Not-Due', 'sent': 'Sent'}, label: 'Invoice Type', helpText: 'The Invoice Type.'},
			{key: 'daysOld', type: 'integer', required: true, label: 'Days Old', helpText: 'From now, at least how old is the invoices?'}
		],
		perform: filterInvoices,
	}
};