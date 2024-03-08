import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import {  Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';

import { fetchVprConfig, updateVprConfig } from '../../../../store/actions/master/vprActions';
import TableConfig from './sub/TableConfig';

class VprConfig extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            isError: false,
            errors: {},
            loadingSubmit: false,
            loading : false,
            paramId: this.props.location.pathname.split("/")[4],
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.asyncData()        
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchVprConfig(this.state.paramId)
            .then((resp) => {
                console.log(resp.data.data)
                this.setState({
                    data: resp.data.data,
                    loading : false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    

    updatePayload = (payload) => {
        this.setState({ loading: true });
        this.props.updateVprConfig(this.setArrayPayload(payload))
            .then((resp) => {
                console.log(resp.data)
                toastr.success(resp.data.message);
                this.asyncData()
            })
            .catch((error) => {
                console.log(error)
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ loading: false });
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
        
    }
    setArrayPayload = (payload) => {
        let result = [];
        for (const [key, value] of Object.entries(payload)) {
            result.push({
                id : key,
                value : value
            })
        }
        return result
    }
    render() {
        return (
            <div>
                {console.log(this.state.paramId)}
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">VPR Config</li>
                </ol>
                <h1 className="page-header">VPR Config  <small>Master Data VPR Config</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        VPR Config
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                            {this.state.loading ? 
                            <center><ReactLoading type="cylon" color="#0f9e3e" /></center> :
                                <TableConfig 
                                    data = {this.state.data}
                                    loading = {this.state.loading}
                                    save = {this.updatePayload}
                                    parentProps = {this.props}
                                />
                            }
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
        fetchVprConfig: (uuid) => dispatch(fetchVprConfig(uuid)),
        updateVprConfig: (payload) => dispatch(updateVprConfig(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(VprConfig));
