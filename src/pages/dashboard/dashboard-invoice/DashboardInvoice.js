import React, { Component } from 'react'
import { connect } from 'react-redux';
// import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import ChartStatusInvoice from './panel/ChartStatusInvoice';
import TableStatusInvoice from './panel/TableStatusInvoice';
import ChartInvoicePaymentLead from './panel/ChartInvoicePaymentLead';
import TableChartInvoicePaymentLead from './panel/TableChartInvoicePaymentLead';


class DashboardInvoice extends Component {
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
                <ChartStatusInvoice />
                <TableStatusInvoice props={this.props}/>
                <ChartInvoicePaymentLead />
                <TableChartInvoicePaymentLead />
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

export default connect(stateToProps, dispatchToProps)(withTranslation()(DashboardInvoice));