//Triggers
//const unitlist = require('./triggers/unit');
const paid = require('./triggers/invoices/paid');
const searchInvoice = require('./triggers/invoices/filter');
//Triggers for dynamic dropdowns
const dropdown = require('./triggers/dropdown');
//Resources
const products = require('./resources/products');
const units = require('./resources/units');
const customers = require('./resources/customers');
const drafts = require('./resources/invoices/drafts');
//Creates
const updateorcreate = require('./creates/invoices/drafts');
//Searches
//const searchunit = require('./searches/unit');
//Authentication
const authentication = require('./authentication');

// To include the API key header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeApiKeyHeader = (request, z, bundle) => {
  //if (bundle.authData.APPTOKEN != null && bundle.authData.AGREEMENTTOKEN != null) {
    request.headers = request.headers || {};
    request.headers['X-AppSecretToken'] = bundle.authData.APPTOKEN;
    request.headers['X-AgreementGrantToken'] = bundle.authData.AGREEMENTTOKEN;
    request.headers['content-type'] = 'application/json';
  //}
  return request;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    includeApiKeyHeader
  ],

  afterResponse: [
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
    [products.key]: products,
    [customers.key]: customers,
    [drafts.key]: drafts,
    [units.key]: units
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    //unitlist: unitlist,
    paid: paid,
    searchInvoice: searchInvoice,
    productGroup: dropdown.productGroupList,
    customerGroup: dropdown.group,
    layouts: dropdown.layout,
    paymentTerms: dropdown.payment,
    vatZones: dropdown.vat,
    currency: dropdown.currencyList,
    employees: dropdown.salesPersonList,
    invoicetype: dropdown.invoicetype
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    //searchunit: searchunit
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    updateorcreate: updateorcreate
  }
};

// Finally, export the app.
module.exports = App;
