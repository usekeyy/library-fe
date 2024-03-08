import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';
import ReduxToastr from 'react-redux-toastr';
import rootReducer from './store/rootReducer';
import jwtMiddleware from './config/jwtMiddleware';
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import crossBrowserListener from './config/redux-persist-listener';
import 'pace-js'
import 'pace-js/themes/blue/pace-theme-minimal.css'
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-quill/dist/quill.snow.css';
import 'simple-line-icons/css/simple-line-icons.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './index.css';
import './scss/react.scss';
import 'bootstrap-social/bootstrap-social.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './App.css';
import './config/i18n'

dotenvExpand(dotenv.config())

const persistConfig = {
  key: 'root',
	storage: storage,
	// whitelist: ['auth', 'sidebarDt', 'vendorProfile', 'verification', 'toastr'],
	predicate: action => action.type !== 'SUCCESS_SHOW_PROFILE_VENDOR',
	stateReconciler: hardSet
};

const pReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(pReducer,
	process.env.NODE_ENV === "production" ? applyMiddleware(thunk) : composeWithDevTools(applyMiddleware(thunk)),
)

if (process.env.NODE_ENV === "production")
console.log = console.warn = console.error = () => {}
	
const persistor = persistStore(store);
jwtMiddleware.setupInterceptors(store);
jwtMiddleware.refresh(store);

window.addEventListener('storage', crossBrowserListener(store, persistConfig));
window.addEventListener('error', e => {
	// prompt user to confirm refresh
  if (/Loading chunk [\d]+ failed/.test(e.message)) { window.location.reload(); }
});

ReactDOM.render(
	<Provider store={store} >
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
		<ReduxToastr
			timeOut={4000}
			newestOnTop={false}
			preventDuplicates
			position="top-right"
			getState={(state) => state.toastr}
			transitionIn="bounceInDown"
			transitionOut="bounceOutUp"
			progressBar
			closeOnToastrClick/>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
