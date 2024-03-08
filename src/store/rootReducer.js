import {combineReducers} from 'redux';
import {reducer as toastrReducer} from 'react-redux-toastr';

import authReducer from './reducers/authReducers';
import sidebarReducer from './reducers/sidebarReducers';
import pusherReducers from './reducers/utility/pusherReducers';
import profileVendorReducers from './reducers/vendor/profileVendorReducers';
import verifikasiVendorReducers from './reducers/vendor/verifikasiVendorReducers';
import proposalTenderReducers from './reducers/tendering/proposalTenderReducers';
import praQualificationReducer from './reducers/tendering/praQualificationReducer';
import chatReducer from './reducers/auction/chatReducers';
import typingReducer from './reducers/auction/chatOnTypingReducers';
// import actionReducer from './reducers/actionReducers';
// import routeReducer from './reducers/routeReducers';
// import usersReducer from './reducers/utility/usersReducers';
// import roleReducer from './reducers/utility/roleReducers';
// import vendorAccGroupReducer from './reducers/master/vendorAccGroupReducers';
// import plantReducer from './reducers/master/plantReducers';
// import purchasingOrgReducer from './reducers/master/purchasingOrgReducers';
// import uomReducer from './reducers/master/uomReducers';
// import mrpControllerReducer from './reducers/master/mrpControllerReducers';
// import maintPlannerGroupReducer from './reducers/master/maintPlannerGroupReducers';


const rootReducer = combineReducers({
    auth: authReducer,
    toastr: toastrReducer,
    sidebarDt: sidebarReducer,
    notifications: pusherReducers,
    vendorProfile: profileVendorReducers,
    verification: verifikasiVendorReducers,
    temporary: proposalTenderReducers,
    praQualification: praQualificationReducer,
    chat: chatReducer,
    typing: typingReducer,
    // actionDt: actionReducer,
    // routeDt: routeReducer,
    // usersDt: usersReducer,
    // roleDt: roleReducer,
    // vendorAccGroupDt: vendorAccGroupReducer,
    // plantDt: plantReducer,
    // purchasingOrgDt: purchasingOrgReducer,
    // uomDt: uomReducer,
    // mrpControllerDt: mrpControllerReducer,
    // maintPlannerGroupDt: maintPlannerGroupReducer,
});

export default rootReducer;