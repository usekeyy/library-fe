import React, { Component } from 'react'
import { connect } from 'react-redux';
// import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import ChartOpenOA from './panel/oa/ChartOpenOA';
// import TableOpenOA from './panel/oa/TableOpenOA';
import ChartPOAktif from './panel/po/ChartPOAktif';
import TablePOAktif from './panel/po/TablePOAktif';
// import ChartSourcePO from './panel/po/ChartSourcePO';
// import TableSourcePO from './panel/po/TableSourcePO';
// import TableRealisasiPO from './panel/po/TableRealisasiPO';
import TableWorkflowPO from './panel/po/TableWorkflowPO';
import ChartPenerimaanPO from './panel/po/ChartPenerimaanPO';
import TablePenerimaanPO from './panel/po/TablePenerimaanPO';
import ChartProSaving from './panel/procurement/ChartProSaving';
import TableProSaving from './panel/procurement/TableProSaving';
import ChartProcLeadTime from './panel/procurement/ChartProcLeadTime';
// import TableProcLeadTime from './panel/procurement/TableProcLeadTime';
// import ChartMrsrLeadTime from './panel/mrsr/ChartMrsrLeadTime';
// import TableMrsrLeadTime from './panel/mrsr/TableMrsrLeadTime';
// import TableReportMrsr from './panel/mrsr/TableReportMrsr';
// import TableSummaryEauction from './panel/auction/TableSummaryEauction';
// import ReportVprRfq from '../dashboard-vendor/panel/report-vpr-rfq/ReportVprRfq';
import ChartProSavingCompany from './panel/procurement/ChartProSavingCompany';
import ChartProLeadTimeCompany from './panel/procurement/ChartProLeadTimeCompany';
import TablePOprogress from './panel/procurement/TablePOprogress';


class DashboardTender extends Component {
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
                {/* <ChartOpenOA />
                <TableOpenOA props={this.props}/> */}
                <ChartPOAktif />
                <TablePOAktif props={this.props}/>
                {/* <ChartSourcePO props={this.props} />
                <TableSourcePO props={this.props}/>
                <TableRealisasiPO  props={this.props}/> */}
                <TableWorkflowPO props={this.props}/>
                <ChartPenerimaanPO />
                <TablePenerimaanPO props={this.props}/>
                {/* <TableReportMrsr props={this.props}/> */}
                <ChartProSaving />
                <ChartProSavingCompany />
                <TableProSaving />
                <ChartProcLeadTime />
                <ChartProLeadTimeCompany />
                <TablePOprogress />
                {/* <TableProcLeadTime />
                <ChartMrsrLeadTime />
                <TableMrsrLeadTime />
                <TableSummaryEauction props={this.props}/>
                <ReportVprRfq /> */}
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

export default connect(stateToProps, dispatchToProps)(withTranslation()(DashboardTender));