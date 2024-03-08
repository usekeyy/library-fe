import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { storeAanwijzingSummary } from '../../../../store/actions/tendering/aanwijzingActions'
import classnames from 'classnames';
import QuillEditor from './QuillEditor'
import TanyaJawab from './TanyaJawab';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';


class TabVendor extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this._data = []
        this.state = {
            activePill: '1',
            confirmAlert: false
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {

        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    togglePill = (pill) => {
        if (this.state.activePill !== pill) {
            this.setState({
                activePill: pill
            });
        }
    }

    summaryStore(payload) {
        if (this._isMounted) {
            let message = {
                summary: payload.edocument
            }
            this.props.storeAanwijzingSummary(this.props.uuid, message)
                .then((resp) => {
                    toastr.success(resp.data.message);
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    render() {
        let rows = ""
        const { status_aanwijzing, daftarHadir, uuid, listUpload, user, confirmAlert, end_date } = this.props;
        const tabs = this.props.rks.document_item;
        if (this.props.rks.document_item !== undefined) {
            rows = this.props.rks.document_item.map(function (key, index) {
                return (
                    <Panel key={index}>
                        <PanelHeader noButton={true}>
                            {tabs[index].title}
                        </PanelHeader>
                        <div className="row">
                            <div className="col-sm-12">
                                <QuillEditor text={key.content} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <TanyaJawab
                                    status_aanwijzing={status_aanwijzing}
                                    end_date = {end_date}
                                    uuid={key.uuid}
                                    aanwijzing_uuid={uuid}
                                />
                            </div>
                        </div>
                    </Panel>
                )
            })
        }




        return (
            <div>
                <Panel>
                    <PanelBody >
                        <Nav className="mb-3" pills>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activePill === '1' })}
                                    onClick={() => { this.togglePill('1'); }}
                                >
                                    <span className="d-sm-none">RKS</span>
                                    <span className="d-sm-block d-none">RKS</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activePill === '2' })}
                                    onClick={() => { this.togglePill('2'); }}
                                >
                                    <span className="d-sm-none">Summary</span>
                                    <span className="d-sm-block d-none">Summary</span>
                                </NavLink>
                            </NavItem>

                            {this.props.user.has_roles.includes("BYR001") &&
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activePill === '3' })}
                                        onClick={() => { this.togglePill('3'); }}
                                    >
                                        <span className="d-sm-none">Daftar Peserta</span>
                                        <span className="d-sm-block d-none">Daftar Peserta</span>
                                    </NavLink>
                                </NavItem>
                            }

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activePill === '4' })}
                                    onClick={() => { this.togglePill('4'); }}
                                >
                                    <span className="d-sm-none">List Upload Aanwijzing</span>
                                    <span className="d-sm-block d-none">List Upload Aanwijzing</span>
                                </NavLink>
                            </NavItem>

                        </Nav>
                        <TabContent className="rounded bg-white mb-4" activeTab={this.state.activePill}>
                            <TabPane tabId="1">
                                {rows}
                            </TabPane>
                            <TabPane tabId="2">
                                <Panel>
                                    <PanelHeader noButton={true}>
                                        Summary
                                </PanelHeader>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <QuillEditor
                                                status_aanwijzing={this.props.status_aanwijzing}
                                                end_date={this.props.end_date}
                                                text={this.props.summary}
                                                button={(this.props.user.has_roles.includes("BYR001"))}
                                                summaryStore={(payload) => this.summaryStore(payload)} />
                                        </div>
                                    </div>                                    
                                </Panel>
                            </TabPane>
                            <TabPane tabId="3">
                                <Panel key={3}>
                                    <PanelHeader noButton={true}>
                                        Daftar Hadir Peserta
                                </PanelHeader>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Vendor</th>
                                                        <th>Nama Vendor</th>
                                                    </tr>
                                                </thead>

                                                <tbody>{
                                                    this.props.daftarHadir !== undefined &&
                                                    Object.keys(daftarHadir).map(function (key, index) {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{index + 1}</td>
                                                                <td>{daftarHadir[index].vendor_id}</td>
                                                                <td>{daftarHadir[index].vendor_name}</td>
                                                            </tr>
                                                        )
                                                    })

                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Panel>
                            </TabPane>

                            <TabPane tabId="4">
                                <Panel key={4}>
                                    <PanelHeader noButton={true}>
                                        List Upload Aanwijzing
                                </PanelHeader>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Description</th>
                                                        <th>File</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>{
                                                    this.props.listUpload !== undefined &&
                                                    Object.keys(listUpload).map(function (key, index) {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{index + 1}</td>
                                                                <td>{listUpload[index].description}</td>
                                                                <td>
                                                                    {(listUpload[index].file !== "" && listUpload[index].file !== null) && <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${listUpload[index].file}`} > {listUpload[index].file} </a>}
                                                                </td>
                                                                <td>
                                                                    {user.has_roles.includes("BYR001") &&
                                                                        <button className="btn btn-sm btn-danger" onClick={() => confirmAlert(listUpload[index].uuid)}>
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })

                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Panel>
                            </TabPane>

                        </TabContent>
                    </PanelBody>
                </Panel>
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        storeAanwijzingSummary: (id, payload) => dispatch(storeAanwijzingSummary(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TabVendor))
