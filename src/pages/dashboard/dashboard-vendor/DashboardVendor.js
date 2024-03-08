import React, { Component } from 'react'
import { connect } from 'react-redux';
// import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// import DashboardPerformaVendor from './panel/dashboard-performa-vendor/DashboardPerformaVendor';
import ReportPeformaVendor from './panel/report-performa-vendor/ReportPeformaVendor';
import ReportPeformaVendorOlehVendor from './panel/report-performa-vendor-oleh-vendor/ReportPeformaVendorOlehVendor';
// import DashboardStatusVendor from './panel/dashboard-status-vendor/DashboardStatusVendor';
// import DashboardKeaktifanVendor from './panel/dashboard-status-keaktifan/DashboardKeaktifanVendor';
// import ReportSos from './panel/report-sos/ReportSos';
// import SearchGlobal from './sub/SearchGlobal';
// import ReportVprRfq from './panel/report-vpr-rfq/ReportVprRfq';

class DashboardVendor extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            params: {
                start: 0,
                length: 0,
            },
            isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
        }
    }

    componentDidMount = () => {
        this._isMounted = true;        
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                {/* <SearchGlobal /> */}
                {this.state.isVendor ? 
                    <ReportPeformaVendorOlehVendor dataProps = {this.props} /> :

                    <div>
                        {/* <DashboardPerformaVendor dataProps = {this.props}/> */}
                        <ReportPeformaVendor dataProps = {this.props} />
                        {/* <DashboardStatusVendor dataProps = {this.props} /> */}
                        {/* <ReportSos dataProps = {this.props} /> */}
                        {/* <DashboardKeaktifanVendor dataProps = {this.props} /> */}
                        {/* <ReportVprRfq /> */}
                    </div>
                }
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user : state.auth.user.data
    }
}

const dispatchToProps = dispatch => {
    return {
        // fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DashboardVendor));