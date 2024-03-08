import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import TableSos from './TableSos';

class ReportSos extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            params: {
                start: 0,
                length: 0,
            },
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
        // const { dataProps } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Report Vendor By Purchasing Organization, Status, SoS
                    </PanelHeader>
                    <PanelBody>
                        <Row>
                            <Col>
                                <TableSos />
                            </Col>
                        </Row>
                    </PanelBody>
                </Panel>
                        
                        
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        // fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ReportSos));