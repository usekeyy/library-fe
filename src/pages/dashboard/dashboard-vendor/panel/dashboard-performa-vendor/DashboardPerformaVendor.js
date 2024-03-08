import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

import ChartPerformaVendor from './ChartPerformaVendor';
import TablePerformavendor from './TablePerformavendor';

class DashboardPerformaVendor extends Component {
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
        // const { t } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard Performa Vendor
                    </PanelHeader>
                    <PanelBody>
                        <Row>
                            <Col sm="12">
                                <ChartPerformaVendor 
                                    type ="bar"
                                    height = "400"
                                    options = {this.state.options}
                                    series = {this.state.series}
                                />
                            </Col>
                            <br></br>
                            <Col>
                                <TablePerformavendor type="dashboard"/>
                            </Col>
                        </Row>
                    </PanelBody>
                </Panel>
                        
                        
            </div>
        )
    }
}

export default (withTranslation()(DashboardPerformaVendor));