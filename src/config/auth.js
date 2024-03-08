import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper';

const locationHelper = locationHelperBuilder({});

const userIsAuthenticatedDefaults = {
    authenticatedSelector: state => state.auth.token !== null,
    authenticatingSelector: state => state.auth.loading,
    wrapperDisplayName: 'UserIsAuthenticated'
}

export const userIsAuthenticated = connectedAuthWrapper(userIsAuthenticatedDefaults)

export const userIsAuthenticatedRedir = connectedRouterRedirect({
    ...userIsAuthenticatedDefaults,
    redirectPath: '/beranda'
});

const userIsAuthenticatedAdminDefaults = {
    authenticatedSelector: state => (state.auth.token !== null) && (state.auth.access === 'OK'),
    wrapperDisplayName: 'UserIsLogged'
}

export const userIsAuthenticatedAdmin = connectedAuthWrapper(userIsAuthenticatedAdminDefaults);

export const userIsAdminRedir = connectedRouterRedirect({
    ...userIsAuthenticatedAdminDefaults, 
    redirectPath: '/beranda',
    predicate: state => state.access
});

const userIsNotAuthenticatedDefaults = {
    authenticatedSelector: state => state.auth.token === null && state.auth.loading === false,
    wrapperDisplayName: 'UserIsNotAuthenticated'
}

export const userIsNotAuthenticated = connectedAuthWrapper(userIsNotAuthenticatedDefaults);

export const userIsNotAuthenticatedRedir = connectedRouterRedirect({
    ...userIsNotAuthenticatedDefaults,
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    authenticatedSelector: state => state.auth.token === null,
    allowRedirectBack: false
})