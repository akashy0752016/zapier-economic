//Base URL
const _sharedBaseUrl = 'https://restapi.e-conomic.com';

//Get List of Customers
const listDraftInvoices = (z, bundle) => {
  return z.request({
        url: `${_sharedBaseUrl}/invoices/drafts?skippages=0&pagesize=3&sort=-draftInvoiceNumber`,
        method: 'GET',
        /*headers: {
            'content-type': 'application/json',
            'X-AppSecretToken': process.env.APPTOKEN,
            'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
            'X-AppSecretToken': 'demo',
            'X-AgreementGrantToken': 'demo',
        }*/
    })
    .then((response) =>{ 
        const res = JSON.parse(response.content);
        if(response.status===200){
            var groupArray = [];
            for (var i = 0; i < res.collection.length; i++) {
                var counter = res.collection[i];
                var groupObj = {};
                groupObj['id'] = parseInt(counter.draftInvoiceNumber);
                groupObj['draftInvoiceNumber '] = parseInt(counter.draftInvoiceNumber);
                groupObj['date'] = counter.date;
                groupObj['currency'] = counter.currency;
                groupObj['exchangeRate'] = counter.exchangeRate;
                groupObj['netAmount'] = counter.netAmount;
                groupObj['netAmountInBaseCurrency'] = counter.netAmountInBaseCurrency;
                groupObj['grossAmount'] = counter.grossAmount;
                groupObj['marginInBaseCurrency'] = counter.marginInBaseCurrency;
                groupObj['marginPercentage'] = counter.marginPercentage;
                groupObj['vatAmount'] = counter.vatAmount;
                groupObj['roundingAmount'] = counter.roundingAmount;
                groupObj['costPriceInBaseCurrency'] = counter.costPriceInBaseCurrency;
                groupObj['dueDate'] = counter.dueDate;
                groupObj['paymentTerms'] = counter.paymentTerms;
                groupObj['customer'] = counter.customer;
                groupObj['recipient'] = counter.recipient;
                groupObj['layout'] = counter.layout;
                groupObj['pdf'] = counter.pdf;
                groupObj['soap'] = counter.soap;
                groupObj['templates'] = counter.templates;
                groupObj['self'] = counter.self;
                groupArray.push(groupObj);
            }
            return groupArray;
        // } else if (response.status == 400 || response.status ==401) {
        } else if (parseInt(response.status/100) == 4 || parseInt(response.status/100) == 5) {
            throw new Error(res.message);
        } else {
            return [];
        }
    });
};

const searchDraftInvoice = (z, bundle) => {
    if(bundle.inputData.invoiceNumber != null) {
        if (isNaN(bundle.inputData.invoiceNumber)) {
            throw new Error("Invoice Number should be an integer.");
        } else {
            return z.request({
                url: `${_sharedBaseUrl}/invoices/drafts/${bundle.inputData.invoiceNumber}`,
                method: 'GET',
                /*headers: {
                    'content-type': 'application/json',
                    'X-AppSecretToken': process.env.APPTOKEN,
                    'X-AgreementGrantToken': process.env.AGREEMENTTOKEN,
                }*/
            }).then((response) =>{ 
                const res = JSON.parse(response.content);
                if (response.status == 200){
                    return [res];
                } else if (response.status == 404) {
                    return [];
                } else if (parseInt(response.status/100) == 4 || parseInt(response.status/100) == 5) {
                    throw new Error(res.message);
                } else {
                    return [];
                }
            });
        }
    } else {
        throw new Error("Invoice Number is required.");
    }
};

const createDraftInvoice = (z, bundle) => {
    const inputParams = {};
    //const rgx = /(\d{4})-(\d{2})-(\d{2})/;
    //var t = 404;
    //z.console.log(t/100);
    //z.console.log(JSON.stringify(bundle.inputData));
    //return {};
    if (bundle.inputData.currency != null) {
        if (bundle.inputData.currency.length > 3 || bundle.inputData.currency < 3) {
            throw new Error("3-letter currency code is allowed.");
        } else {
            inputParams['currency'] = bundle.inputData.currency;
        }
    } else {
        throw new Error("Currency is required.");
    }

    if (bundle.inputData.customerNumber != null) {
        if (isNaN(bundle.inputData.customerNumber)) {
            throw new Error("Customer number must be an integer.");
        } else if (parseInt(bundle.inputData.customerNumber) < 1 || parseInt(bundle.inputData.customerNumber) > 999999999) {
            throw new Error("Customer number must be greater than 1 and less that 999999999.");
        } else {
            inputParams['customer'] = {
                'customerNumber': parseInt(bundle.inputData.customerNumber),
                'self': `${_sharedBaseUrl}/customers/${bundle.inputData.customerNumber}`
            };
        }
    } else {
        throw new Error("Customer Number is required.");
    }

    if (bundle.inputData.date != null) {
        inputParams['date'] = bundle.inputData.date.substr(0, 10);
    } else {
        throw new Error("Date is required.");
    }

    if (bundle.inputData.delivery_address != null || bundle.inputData.delivery_city != null || bundle.inputData.delivery_country != null || bundle.inputData.deliveryDate != null || bundle.inputData.deliveryTerms != null || bundle.inputData.zip != null) {
        inputParams['delivery'] = {};
        if (bundle.inputData.delivery_address != null) {
            if (bundle.inputData.delivery_address.length > 255) {
                throw new Error("Delivery address cannot be greater than 255 characters.");
            } else {
                inputParams['delivery']['address'] = bundle.inputData.delivery_address;
            }   
        }

        if (bundle.inputData.delivery_city != null) {
            if (bundle.inputData.delivery_city.length > 50) {
                throw new Error("Delivery city cannot be greater than 50 characters.");
            } else if(/\d/.test(bundle.inputData.delivery_city)) {
                throw new Error("Delivery City can contain alphabets or space or dash only.");
            } else {
                inputParams['delivery']['city'] = bundle.inputData.delivery_city;
            }   
        }

        if (bundle.inputData.delivery_country != null) {
            if (bundle.inputData.delivery_country.length > 50) {
                throw new Error("Delivery country cannot be greater than 50 characters.");
            } else if(/\d/.test(bundle.inputData.delivery_country)) {
                throw new Error("Delivery country can contain alphabets or space or dash only.");
            } else {
                inputParams['delivery']['country'] = bundle.inputData.delivery_country;
            }   
        }

        if (bundle.inputData.delivery_deliveryDate != null) {
            inputParams['delivery']['deliveryDate'] = bundle.inputData.delivery_deliveryDate.substr(0, 10);
        }

        if (bundle.inputData.delivery_deliveryTerms != null) {
            if (bundle.inputData.delivery_deliveryTerms.length > 100) {
                throw new Error("Delivery Terms cannot be greater than 100 characters.");
            } else {
                inputParams['delivery']['deliveryTerms'] = bundle.inputData.delivery_deliveryTerms;
            }   
        }

        if (bundle.inputData.delivery_zip != null) {
            if (bundle.inputData.delivery_zip.length > 30) {
                throw new Error("Delivery Zip Code cannot be greater than 30 characters.");
            } else {
                inputParams['delivery']['zip'] = bundle.inputData.delivery_zip;
            }   
        }
    }

    if (bundle.inputData.deliveryLocationNumber != null) {
        if (isNaN(bundle.inputData.deliveryLocationNumber)) {
            throw new Error("Delivery Location Number must be an integer");
        } else if (parseInt(bundle.inputData.deliveryLocationNumber) < 1) {
            throw new Error("Delivery Location Number cannot be less than 1.");
        } else {
            inputParams['deliveryLocation'] = {
                'deliveryLocationNumber': parseInt(bundle.inputData.deliveryLocationNumber),
                'self': `${_sharedBaseUrl}/customers/${bundle.inputData.customerNumber}/delivery-locations/${bundle.inputData.deliveryLocationNumber}`
            };
        }
    } /*else {
        throw new Error("Delivery Location Number is required.");
    }*/

    if (bundle.inputData.dueDate != null) {
        inputParams['dueDate'] = bundle.inputData.dueDate.substr(0, 10);
    }

    if (bundle.inputData.exchangeRate != null) {
        if (isNaN(bundle.inputData.exchangeRate)) {
            throw new Error("Exchange Rate should be a number.");
        } else if (parseFloat(bundle.inputData.exchangeRate) > 999999999999 || parseFloat(bundle.inputData.exchangeRate) < 0) {
            throw new Error("Exchange Rate should be less than 999999999999 and greater than or equal 0.");
        } else {
            inputParams['exchangeRate'] = bundle.inputData.exchangeRate;
        }
    }

    //Gross Amount is read only.

    if (bundle.inputData.layoutNumber != null) {
        if (isNaN(bundle.inputData.layoutNumber)) {
            throw new Error("Layout Number must be an integer");
        } else if (parseInt(bundle.inputData.layoutNumber) <= 0) {
            throw new Error("Layout Number must be an integer and greater than 0");
        } else {
            inputParams['layout'] = {
                'layoutNumber': parseInt(bundle.inputData.layoutNumber),
                'self': `${_sharedBaseUrl}/layouts/${bundle.inputData.layoutNumber}`
            };
        }
    } else {
        throw new Error("Layout Number is required.");
    }

    if (bundle.inputData.lineItems != null) {
        if (bundle.inputData.lineItems.length > 0) {
            inputParams['lines'] = [];
            for (var i = 0; i < bundle.inputData.lineItems.length; i++) {
                
                var inline = bundle.inputData.lineItems[i];
                var outline = {};
                outline['lineNumber'] = parseInt(i) + 1;
                
                if (inline.accrual_endDate != null || inline.accrual_startDate != null) {
                    outline['accrual'] = {};
                    if(inline.accrual_endDate != null) {
                        outline['accrual']['endDate'] = inline.accrual_endDate.substr(0, 10);
                    }
                    if(inline.accrual_startDate != null) {
                        outline['accrual']['startDate'] = inline.accrual_startDate.substr(0, 10);
                    }
                }

                if (inline.sortKey != null) {
                    if (isNaN(inline.sortKey)) {
                        throw new Error("Line Sort Key Number must be an integer.");
                    } else if (parseInt(inline.sortKey) < 0) {
                        throw new Error("Line Sort Key Number must be an integer and should be greater than or equal to 0");
                    } else {
                        outline['sortKey'] = parseInt(inline.sortKey);
                    }
                }

                if (inline.departmentalDistributionNumber != null || inline.distributionType != null) {
                    if (inline.departmentalDistributionNumber != null) {
                        if (isNaN(inline.departmentalDistributionNumber)) {
                            throw new Error("Department Distribution Number must be an integer.");
                        } else if (parseInt(inline.departmentalDistributionNumber) <= 0) {
                            throw new Error("Department Distribution Number cannot be less than or equal to 0");
                        } else {
                            outline['departmentalDistribution']['departmentalDistributionNumber'] = parseInt(inline.departmentalDistributionNumber);
                            outline['departmentalDistribution']['self'] = `${_sharedBaseUrl}/departmental-distributions/${departmentalDistributionNumber}`;
                            if (inline.distributionType != null) {
                                outline['departmentalDistribution']['distributionType'] = inline.distributionType;
                            }
                        }
                    }
                }

                if (inline.lineItem_description != null) {
                    if (inline.lineItem_description.length > 2500) {
                        throw new Error("Line Description cannot be more than 2500 characters.");
                    } else {
                        outline['description'] = inline.lineItem_description;
                    }
                }

                if (inline.lineNumber != null) {
                    if (isNaN(inline.lineNumber)) {
                        throw new Error("Line number must be an integer.");
                    } else if (parseInt(inline.lineNumber) < 1) {
                        throw new Error("Line number must be greater or equal to 1.");
                    } else {
                        outline['lineNumber'] = parseInt(inline.lineNumber);
                    }
                }

                if (inline.lineItem_marginInBaseCurrency != null) {
                    if (isNaN(inline.lineItem_marginInBaseCurrency)) {
                        throw new Error("Margin In Base-currency must be a number.");
                    } else if (parseFloat(inline.lineItem_marginInBaseCurrency) < 0) {
                        throw new Error("Margin In Base-currency must be a number and should be greater than 0.");
                    } else {
                        outline['marginInBaseCurrency'] = inline.lineItem_marginInBaseCurrency;
                    }
                }

                if (inline.lineItem_marginPercentage != null) {
                    if (isNaN(inline.lineItem_marginPercentage)) {
                        throw new Error("Margin Percentage must be a number.");
                    } else if (parseFloat(inline.lineItem_marginPercentage) < 0) {
                        throw new Error("Margin Percentage must be a number and should be greater than 0.");
                    } else {
                        outline['marginPercentage'] = inline.lineItem_marginPercentage;
                    }
                }

                if (inline.lineItem_productNumber != null) {
                    if (inline.lineItem_productNumber.length > 25) {
                        throw new Error("Product Number cannot be greater than 25 characters.");
                    } else {
                        outline['product'] = {
                            'productNumber': inline.lineItem_productNumber,
                            'self': `${_sharedBaseUrl}/products/${inline.lineItem_productNumber}`
                        };
                    }
                }

                if (inline.lineItem_quantity != null) {
                    if (isNaN(inline.lineItem_quantity)) {
                        throw new Error("Product Quantity must be a number.");
                    } else if (parseFloat(inline.lineItem_quantity) <= 0) {
                        throw new Error("Product Quantity cannot be less than or equal to 0.");
                    } else {
                        outline['quantity'] = inline.lineItem_quantity;
                    }
                }

                if (inline.lineItem_sortKey != null) {
                    if (isNaN(inline.lineItem_sortKey)) {
                        throw new Error("Sort Key must be an integer.");
                    } else if (parseInt(inline.lineItem_sortKey) < 0) {
                        throw new Error("Sort Key must be greater or equal to 0.");
                    } else {
                        outline['sortKey'] = parseInt(inline.lineItem_sortKey);
                    }
                }

                if (inline.lineItem_unitNumber != null) {
                    if (isNaN(inline.lineItem_unitNumber)) {
                        throw new Error("Unit Number must be an integer.");
                    } else if (parseInt(inline.lineItem_unitNumber) < 1) {
                        throw new Error("Unit Number must be greater or equal to 1.");
                    } else {
                        outline['unit'] = {
                            'unitNumber': parseInt(inline.lineItem_unitNumber),
                            'self': `${_sharedBaseUrl}/units/${inline.lineItem_unitNumber}`
                        };
                    }
                }

                if (inline.lineItem_unitCostPrice != null) {
                    if (isNaN(inline.lineItem_unitCostPrice)) {
                        throw new Error("Unit Cost Price must be a number.");
                    } else if (parseFloat(inline.lineItem_unitCostPrice) < 0) {
                        throw new Error("Unit Cost Price cannot be less than 0");
                    } else {
                        outline['unitCostPrice'] = inline.lineItem_unitCostPrice;
                    }
                }

                if (inline.lineItem_unitNetPrice != null) {
                    if (isNaN(inline.lineItem_unitNetPrice)) {
                        throw new Error("Unit Net Price must be a number.");
                    } else if (parseFloat(inline.lineItem_unitNetPrice) < 0) {
                        throw new Error("Unit Net Price cannot be less than 0");
                    } else {
                        outline['unitNetPrice'] = inline.lineItem_unitNetPrice;
                    }
                }
                inputParams['lines'].push(outline);
            }
        } else {
            throw new Error("Atleast one line item is required");
        }
    }  /*else {
        throw new Error("Atleast one line item is required");
    }*/

    if (bundle.inputData.marginInBaseCurrency != null) {
        if (isNaN(bundle.inputData.marginInBaseCurrency)) {
            throw new Error("Margin in Base-currency must be a number.");
        } else if (parseFloat(bundle.inputData.marginInBaseCurrency) < 0) {
            throw new Error("Margin in Base-currency must be greater than 0.");
        } else {
            inputParams['marginInBaseCurrency'] = bundle.inputData.marginInBaseCurrency;
        }
    }

    if (bundle.inputData.marginPercentage != null) {
        if (isNaN(bundle.inputData.marginPercentage)) {
            throw new Error("Margin Percentage must be a number.");
        } else if (parseFloat(bundle.inputData.marginPercentage) < 0) {
            throw new Error("Margin Percentage must be greater than 0.");
        } else {
            inputParams['marginPercentage'] = bundle.inputData.marginPercentage;
        }
    }

    if (bundle.inputData.netAmount != null) {
        if (isNaN(bundle.inputData.netAmount)) {
            throw new Error("Net Amount must be a number.");
        } else if (parseFloat(bundle.inputData.netAmount) < 0) {
            throw new Error("Net Amount must be greater than 0.");
        } else {
            inputParams['netAmount'] = bundle.inputData.netAmount;
        }
    }

    if (bundle.inputData.notes_heading != null || bundle.inputData.notes_textline1 != null || bundle.inputData.notes_textline2 != null) {
        
        inputParams['notes'] = {};
        
        if (bundle.inputData.notes_heading != null) {
            if (bundle.inputData.notes_heading.length > 250) {
                throw new Error("Notes Heading cannot have more than 250 characters.");
            } else {
                inputParams['notes']['heading'] = bundle.inputData.notes_heading;
            }
        }

        if (bundle.inputData.notes_textline1 != null) {
            if (bundle.inputData.notes_textline1.length > 1000) {
                throw new Error("Notes Text Line 1 cannot have more than 1000 characters.");
            } else {
                inputParams['notes']['textLine1'] = bundle.inputData.notes_textline1;
            }
        }

        if (bundle.inputData.notes_textline2 != null) {
            if (bundle.inputData.notes_textline2.length > 1000) {
                throw new Error("Notes Text Line 2 cannot have more than 1000 characters.");
            } else {
                inputParams['notes']['textLine2'] = bundle.inputData.notes_textline2;
            }
        }
    }

    if (bundle.inputData.daysOfCredit != null || bundle.inputData.paymentTermsNumber != null || bundle.inputData.paymentTermsType != null) {
        inputParams['paymentTerms'] = {};
        if (bundle.inputData.daysOfCredit != null) {
            if (isNaN(bundle.inputData.daysOfCredit)) {
                throw new Error("Days of Credit should be an integer.");
            } else if (parseInt(bundle.inputData.daysOfCredit) < 0) {
                throw new Error("Days of Credit should be greater than or equal to 0");
            } else {
                inputParams['paymentTerms']['daysOfCredit'] = parseInt(bundle.inputData.daysOfCredit);
            }
        }

        if (bundle.inputData.paymentTermsNumber != null) {
            if (isNaN(bundle.inputData.paymentTermsNumber)) {
                throw new Error("Payment Terms Number should be an integer.");
            } else if (parseInt(bundle.inputData.paymentTermsNumber) < 1) {
                throw new Error("Payment Terms Number should be greater than or equal to 1.");
            } else {
                inputParams['paymentTerms']['paymentTermsNumber'] = parseInt(bundle.inputData.paymentTermsNumber);
            }
        } else {
            throw new Error("Payment Terms Number is required.");
        }

        if (bundle.inputData.paymentTermsType != null) {
            inputParams['paymentTermsType'] = bundle.inputData.paymentTermsType;
        }
    } else {
        throw new Error("Payment Terms is required.");
    }

    //Project URI not found
    /*if (bundle.inputData.projectNumber != null) {
        if (isNaN(bundle.inputData.projectNumber)) {
            throw new Error("Project Number should be an integer.");
        } else if (parseInt(bundle.inputData.projectNumber) < 1) {
            throw new Error("Project Number should be greater than or equal to 1");
        } else {
            inputParams['project'] = {
                'projectNumber': parseInt(bundle.inputData.projectNumber),
                'self': ``
            };
        }
    }*/

    if (bundle.inputData.recipient_address != null || bundle.inputData.recipient_city != null || bundle.inputData.recipient_country != null || bundle.inputData.recipient_ean != null || bundle.inputData.recipient_name != null || bundle.inputData.recipient_publicEntryNumber != null || bundle.inputData.recipient_vatZoneNumber != null || bundle.inputData.recipient_zip != null) {
        inputParams['recipient'] = {};
        if (bundle.inputData.recipient_address != null) {
            if (bundle.inputData.recipient_address.length > 250) {
                throw new Error("Recipient Address cannot have more than 250 characters.");
            } else {
                inputParams['recipient']['address'] = bundle.inputData.recipient_address;
            }
        }
        if (bundle.inputData.recipient_city != null) {
            if (bundle.inputData.recipient_city.length > 250) {
                throw new Error("Recipient City cannot have more than 250 characters.");
            } else if(/\d/.test(bundle.inputData.recipient_city)) {
                throw new Error("Recipient City name can contain alphabets or space or dash only.");
            } else {
                inputParams['recipient']['city'] = bundle.inputData.recipient_city;
            }
        }
        if (bundle.inputData.recipient_country != null) {
            if (bundle.inputData.recipient_country.length > 50) {
                throw new Error("Recipient Country cannot have more than 50 characters.");
            } else if(/\d/.test(bundle.inputData.recipient_country)) {
                throw new Error("Recipient Country name can contain alphabets or space or dash only.");
            } else {
                inputParams['recipient']['country'] = bundle.inputData.recipient_country;
            }
        }
        if (bundle.inputData.recipient_ean != null) {
            if (bundle.inputData.recipient_ean.length > 13) {
                throw new Error("Recipient EAN cannot have more than 13 characters.");
            } else {
                inputParams['recipient']['ean'] = bundle.inputData.recipient_ean;
            }
        }
        if (bundle.inputData.recipient_name != null) {
            if (bundle.inputData.recipient_name.length > 250) {
                throw new Error("Recipient Name cannot have more than 250 characters.");
            } else {
                inputParams['recipient']['name'] = bundle.inputData.recipient_name;
            }
        } else {
            throw new Error("Recipient Name is required.");
        }
        if (bundle.inputData.recipient_publicEntryNumber != null) {
            if (bundle.inputData.recipient_publicEntryNumber.length > 40) {
                throw new Error("Recipient Public Entry Number cannot have more than 13 characters.");
            } else {
                inputParams['recipient']['publicEntryNumber'] = bundle.inputData.recipient_publicEntryNumber;
            }
        }
        if (bundle.inputData.recipient_vatZoneNumber != null) {
            if (isNaN(bundle.inputData.recipient_vatZoneNumber)) {
                throw new Error("Vat Zone Number must be an integer.");
            } else {
                inputParams['recipient']['vatZone'] = {
                    'vatZoneNumber': parseInt(bundle.inputData.recipient_vatZoneNumber),
                    'self': `${_sharedBaseUrl}/vat-zones/${bundle.inputData.recipient_vatZoneNumber}`
                }
            }
        } else {
            throw new Error("Vat Zone number is required.")
        }
        if (bundle.inputData.recipient_zip != null) {
            if (bundle.inputData.recipient_zip.length > 50) {
                throw new Error("Recipient Zip code cannot have more than 50 characters.");
            } else {
                inputParams['recipient']['zip'] = bundle.inputData.recipient_zip;
            }
        }
    } else {
        throw new Error("Recipient Name and Vat Zone Number is required.")
    }

    if (bundle.inputData.references_other != null || bundle.inputData.references_salesPerson_employeeNumber != null || bundle.inputData.references_vendorReference_employeeNumber != null) {
        inputParams['references'] = {};
        if (bundle.inputData.references_other != null) {
            if (bundle.inputData.references_other.length > 250) {
                throw new Error("References other must have less than 250 characters.");  
            } else {
                inputParams['references']['other'] = bundle.inputData.references_other;
            }   
        }
        if (bundle.inputData.references_salesPerson_employeeNumber != null) {
            if (isNaN(bundle.inputData.references_salesPerson_employeeNumber)) {
                throw new Error("Sales Person Employee Number must be an integer.");
            } else if (parseInt(bundle.inputData.references_salesPerson_employeeNumber) < 1) {
                throw new Error("Sales Person Employee Number must be greater than 0.");
            } else {
                inputParams['references']['salesPerson'] = {
                    'employeeNumber': parseInt(bundle.inputData.references_salesPerson_employeeNumber),
                    'self': `${_sharedBaseUrl}/employees/${bundle.inputData.references_salesPerson_employeeNumber}`
                }
            }
        }
        if (bundle.inputData.references_vendorReference_employeeNumber != null) {
            if (isNaN(bundle.inputData.references_vendorReference_employeeNumber)) {
                throw new Error("Vendor Reference Employee Number must be an integer.");
            } else if (parseInt(bundle.inputData.references_vendorReference_employeeNumber) < 1) {
                throw new Error("Vendor Reference Employee Number must be greater than 0.");
            } else {
                inputParams['references']['vendorReference'] = {
                    'employeeNumber': parseInt(bundle.inputData.references_vendorReference_employeeNumber),
                    'self': `${_sharedBaseUrl}/employees/${bundle.inputData.references_vendorReference_employeeNumber}`
                }
            }
        }
    }

    if (bundle.inputData.roundingAmount != null) {
        if (isNaN(bundle.inputData.roundingAmount)) {
            throw new Error("Rounding Amount should be number.");
        } else if (parseFloat(bundle.inputData.roundingAmount) < 0) {
            throw new Error("Rounding Amount cannot be less than 0.");
        } else {
            inputParams['roundingAmount'] = bundle.inputData.roundingAmount;
        }
    }

    if (bundle.inputData.vatAmount != null) {
        if (isNaN(bundle.inputData.vatAmount)) {
            throw new Error("Vat Amount should be number.");
        } else if (parseFloat(bundle.inputData.vatAmount) < 0) {
            throw new Error("Vat Amount cannot be less than 0.");
        } else {
            inputParams['vatAmount'] = bundle.inputData.vatAmount;
        }
    }

    const requestOptions = {
        url: `${_sharedBaseUrl}/invoices/drafts`,
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
        if(response.status == 201)
        {
            return res;
        } else if (parseInt(response.status/100) == 4 || parseInt(response.status/100) == 5) {
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
        }
    });

};

module.exports = {
    key: 'drafts',
    noun: 'Draft Invoice',

    // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
    list: {
        display: {
            label: 'New Draft Invoice',
            description: 'Trigger when a new draft invoice is added.(Without line item support)',
        },
        operation: {
            inputFields: [
            ],
            perform: listDraftInvoices,
        },
    },

    // The search method on this resource becomes a Search on this app
    search: {
        display: {
            label: 'Find Draft Invoice',
            description: 'Get Draft Invoice Information by Draft Invoice Number'
        },
        operation: {
            inputFields: [
                /*{key: 'invoiceType', type: 'string', required: true, dynamic: 'invoicetype.id.invoicename', label: 'Invoice Type', helpText: 'The Invoice Type.'},*/
                {key: 'invoiceNumber', required: true, type: 'integer', label: 'Draft Invoice Number', helpText: 'The Draft Invoice Number.'},
            ],
            perform: searchDraftInvoice
        }
    },

    create: {
        display: {
            label: 'Create Draft Invoice',
            description: 'Create Draft Invoice on the E-conomic App'
        },
        operation: {
            inputFields: [
                {key: 'invoiceNumber', required: true, type: 'integer', label: 'Draft Invoice Number', helpText: 'The Draft Invoice Number.'},

                {key: 'currency', type: 'string', dynamic: 'currencyList.id.currencyname', required: true, label: 'Currency', helpText: 'The ISO 4217 3-letter currency code of the invoice.'},
                {key: 'customerNumber', type: 'integer', dynamic: 'customers.id.name', required: true, altersDynamicFields: true, search: 'customersSearch.unitNumber', label: 'Customer Number', helpText: 'The customer number is a positive unique numerical identifier with a maximum of 9 digits. If no customer number is specified a number will be supplied by the system.'},
                {key: 'date', type: 'datetime', required: true, label: 'Date', helpText: 'Invoice issue date. Format according to ISO-8601 (YYYY-MM-DD).'},

                {key: 'delivery_address', type: 'string', label: 'Delivery Address', helpText: 'Street address where the goods must be delivered to the customer.'},
                {key: 'delivery_city', type: 'string', label: 'Delivery City', helpText: 'The city of the place of delivery'},
                {key: 'delivery_country', type: 'string', label: 'Delivery Country', helpText: 'The country of the place of delivery'},
                {key: 'delivery_deliveryDate', type: 'datetime', label: 'Delivery Date', helpText: 'The date of delivery. Format according to ISO-8601 (YYYY-MM-DD).'},
                {key: 'delivery_deliveryTerms', type: 'string', label: 'Delivery Terms', helpText: 'Details about the terms of delivery.'},
                {key: 'delivery_zip', type: 'string', label: 'Delivery Zip Code', helpText: 'The zip code of the place of delivery.'},

                {key: 'dueDate', type: 'datetime', required: true, label: 'Due Date', helpText: 'The date the invoice is due for payment. This property is only used if the terms of payment is of type \'duedate’, in which case it is a mandatory property. Format according to ISO-8601 (YYYY-MM-DD).'},
                {key: 'exchangeRate', type: 'number', label: 'Exchange Rate', helpText: 'The desired exchange rate between the invoice currency and the base currency of the agreement. The exchange rate expresses how much it will cost in base currency to buy 100 units of the invoice currency. If no exchange rate is supplied, the system will get the current daily rate, unless the invoice currency is the same as the base currency, in which case it will be set to 100.'},
                {key: 'grossAmount', type: 'number', required: true, label: 'Gross Amount', helpText: 'The total invoice amount in the invoice currency after all taxes and discounts have been applied. For a credit note this amount will be negative.'},
                {key: 'marginInBaseCurrency', type: 'integer', label: 'Margin In Base Currency', helpText: 'The difference between the net price and the cost price on the invoice line in base currency.'},
                {key: 'marginPercentage', type: 'integer', label: 'Margin Percentage', helpText: 'The margin on the invoice line expressed as a percentage.'},

                {key: 'layoutNumber', required: true, type: 'integer', dynamic: 'layout.id.layoutname', label: 'Layout', helpText: 'Layout to be applied for invoices and other documents for this customer.'},

                //Payment Terms
                {key: 'paymentTermsNumber', required: true, type: 'integer', dynamic: 'payment.id.paymentname', label: 'Payment Terms', helpText: 'The terms of payment for the invoice.'},
                {key: 'daysOfCredit', type: 'integer', required: true, label: 'Days of Credit', helpText: 'The number of days of credit on the invoice. This field is only valid if terms of payment is not of type \'duedate\'.'},
                {key: 'paymentTermsType', required: true, choices: {'net': 'NET', 'invoiceMonth': 'Invoice Month', 'paidInCash': 'Paid In Cash', 'prepaid': 'Prepaid', 'dueDate': 'Due Date', 'factoring': 'Factoring', 'invoiceWeekStartingSunday': 'Invoice Week Starting Sunday', 'invoiceWeekStartingMonday': 'Invoice Week Starting Monday', 'creditcard': 'Credit Card', 'avtaleGiro': 'Avtale Giro'}, altersDynamicFields: false},
                
                //Line Item
                {key: 'lineItems', required: true, children: [
                    {key: 'lineItem_sortKey', type: 'integer', label: 'Line Sort Key', helpText: 'A sort key used to sort the lines in ascending order within the invoice.'},
                    {key: 'lineItem_description', type: 'string', label: 'Line Description', helpText: 'A description of the product or service sold. Please note, that when setting existing products, description field is required. While setting non-existing product, description field can remain empty.'},
                    {key: 'lineItem_unit', type: 'integer', dynamic: 'units.id.unitname', label: 'Unit', helpText: 'The unit of meassure applied to the invoice line.'},
                    {key: 'lineItem_productNumber', type: 'string', dynamic: 'products.id.productname', label: 'Product', helpText: 'The product or service offered on the invoice line.'},
                    {key: 'lineItem_quantity', type: 'integer', label: 'Quantity', helpText: 'The number of units of goods on the invoice line.'},
                    {key: 'lineItem_unitCostPrice', type: 'number', label: 'Unit Cost Price', helpText: 'The cost price of 1 unit of the goods or services in the invoice currency.'},
                    {key: 'lineItem_unitNetPrice', type: 'integer', label: 'Unit Net Price', helpText: 'The price of 1 unit of the goods or services on the invoice line in the invoice currency.'},
                    {key: 'lineItem_discountPercentage', type: 'number', label: 'Discount Percentage', helpText: 'A line discount expressed as a percentage.'},
            
                    {key: 'lineItem_totalNetAmount', type: 'number', label: 'Total Net-ammount', helpText: 'Total Net Ammount'},
                    {key: 'lineItem_vatAmount', type: 'number', label: 'VAT Amount', helpText: 'The total amount of VAT on the invoice in the invoice currency. This will have the same sign as net amount'},
                    {key: 'lineItem_roundingAmount', type: 'number', label: 'Rounding Amount', helpText: 'The total rounding error, if any, on the invoice in base currency.'},
                    {key: 'lineItem_netAmount', type: 'number', label: 'Net Amount', helpText: 'The total invoice amount in the invoice currency before all taxes and discounts have been applied. For a credit note this amount will be negative.'},
                    {key: 'lineItem_netAmountInBaseCurrency', type: 'number', label: 'Net-amount Base-currency', helpText: 'Net Amount Base Currency'},
                ]},

                //Notes
                {key: 'heading', type: 'string', label: 'Heading', helpText: 'The invoice heading. Usually displayed at the top of the invoice.'},
                {key: 'textLine1', type: 'string', label: 'Text Line 1', helpText: 'The first line of supplementary text on the invoice. This is usually displayed right under the heading in a smaller font.'},
                {key: 'textLine2', type: 'string', label: 'Text Line 2', helpText: 'The second line of supplementary text in the notes on the invoice. This is usually displayed as a footer on the invoice.'},
                //Recipient Details
                {key: 'recipient_name', required: true, type: 'string', label: 'Recipient Name', helpText: 'The name of the actual recipient.'},
                {key: 'recipient_address', type: 'string', label: 'Recipient Address', helpText: 'The street address of the actual recipient.'},
                {key: 'recipient_city', type: 'string', label: 'Recipient City', helpText: 'The city of the actual recipient.'},
                {key: 'recipient_country', type: 'string', label: 'Recipient Country', helpText: 'The country of the actual recipient.'},
                {key: 'recipient_zip', type: 'string', label: 'Recipient Zip Code', helpText: 'The zip code of the actual recipient.'},
                //{key: 'recipient_ean', type: 'string', label: 'Recipient EAN', helpText: 'The \'International Article Number\’ of the actual recipient.'},
                {key: 'recipient_vatZoneNumber', required: true, type: 'integer', dynamic: 'vat.id.vatname', label: 'Recipient Vat Zone', helpText: 'Unique identifier of the vat zone.'},       

                //References
                {key: 'references_other', type: 'string', label: 'References Other', helpText: 'A text field that can be used to save any custom reference on the invoice.'},
                {key: 'references_salesPerson_employeeNumber', type: 'integer', dynamic: 'employees.id.name', label: 'References Sales Person', helpText: 'Unique identifier of the employee.'},
                {key: 'references_vendorReference_employeeNumber', type: 'integer', dynamic: 'employees.id.name', label: 'References Sales Person', helpText: 'Unique identifier of the employee.'},

                {key: 'roundingAmount', type: 'number', label: 'Rounding Amount', helpText: 'The total rounding error, if any, on the invoice in base currency.'},
                {key: 'vatAmount', type: 'number', label: 'VAT Amount', helpText: 'The total amount of VAT on the invoice in the invoice currency. This will have the same sign as net amount.'},
            ],

            perform: createDraftInvoice,
        },
    }
};
