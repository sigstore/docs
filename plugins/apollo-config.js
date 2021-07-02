const {IntrospectionFragmentMatcher, InMemoryCache} = require('apollo-cache-inmemory');
const introspectionQueryResultData = require('../fragmentTypes.json');

export default function ({env}) {

    // Add support for matrix
    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData
    });

    return {
        httpEndpoint: process.env.VUE_APP_BACKEND,
        getAuth: () => 'Bearer ' + process.env.GRAPHQL_TOKEN,
        cache: new InMemoryCache({fragmentMatcher})
    };
}