import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Header from '../detail/Header';
import DetailTender from '../detail/DetailTender';
import DocumentTender from '../detail/DocumentTender';
import ListPeserta from './sub/ListPeserta';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import ItemsSelfAssigment from '../detail/ItemsSelfAssigment';
import { showEvaluationTeknis, showListVendorProcessTeknis, saveEvaluasiTeknisPublish } from '../../../../../store/actions/tendering/evaluationTechnicalActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import ListPesertaItemize from '../detail/ListPesertaItemize'

class SelfAssigment extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            documents: [{
                "type": "OE",
                "description": " Lampiran 1",
                "attactment": "file.xls"
            }, {
                "type": "OA",
                "description": " Lampiran 2",
                "attactment": "filekedua.xls"
            }],
            loading: true,
            loadings: {
                loadingSaveAssignment: false
            },
            statusOptions: [
                { value: "self", label: "Self" },
                { value: "evaluator", label: "Assigment To Evaluator" },
            ],
            modalOpen: false,
            assingTo: [],
            vendor :[],
            isMonitoring : this.props.location.pathname.split("/")[2] === 'monitoring-tender-buyer' ? true : false
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            this.getUUID()
            this.assignTo()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showEvaluationTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.message);
                    // this.back('e')
                });
        }
    }

    assignTo() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showListVendorProcessTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ vendor: datas.vendor })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.message);
                    this.back('e')
                });
        }
    }

    toggleOpenModal = (e, original) => {
        this.setState({
            modalOpen: true
        })
    }

    toggleCloseModal = () => {
        this.setState({
            modalOpen: false
        })
    }

    evaluasiVendor(e, uuid) {
        if (this.state.isMonitoring){
            this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/teknis_process/' + this.props.match.params.id + '/vendor/' + uuid)
        }else {
            this.props.history.push('/tendering/evaluation-technical-assignment/process/' + this.props.match.params.id + '/vendor/' + uuid)
        }
    }

    evaluasiVendorItemize(e, uuid, pr_uuid) {
        if (this.state.isMonitoring){
            this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/teknis_process/' + this.props.match.params.id + '/vendor/' + uuid+'/'+pr_uuid)
        }else {
            this.props.history.push('/tendering/evaluation-technical-assignment/process/' + this.props.match.params.id + '/vendor/' + uuid+'/'+pr_uuid)
        }
    }

    back(e) {
        this.props.history.push('/tendering/evaluation-technical-assignment')
    }

    publish (e) {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.saveEvaluasiTeknisPublish(this.props.match.params.id, {status : 'approve'})
                .then((resp) => {
                    // let datas = resp.data.data;
                    // this.getUUID();
                    this.props.history.push('/tendering/evaluation-technical-assignment')
                    toastr.success("PUBLISH SUCCESS", resp.data.message);
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error("PUBLISH FAILED", resp.data.message);
                });
        }
    }

    render() {
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Evaluasi</li>
                </ol>
                <h1 className="page-header">Evaluasi Teknis<small></small></h1>

                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loading &&
                    <div>
                        <Header
                            proposal_tender_no={this.state.data.proposal_tender_no}
                            description={this.state.data.title}
                            status={this.state.data.status_proses === null ? "Process" : this.state.data.status_proses}
                        />
                        <DetailTender
                            metode_pengadaan_name={this.state.data.metode_pengadaan_name}
                            pra_qualification={this.state.data.pra_qualification}
                            metode_aanwijzing_name={this.state.data.metode_aanwijzing_name}
                            metode_penyampaian_name={this.state.data.metode_penyampaian_name}
                            metode_evaluasi={this.state.data.metode_evaluasi}
                            metode_negosiasi={this.state.data.metode_negosiasi}
                            multiwinner={this.state.data.multiwinner}
                            bid_bond={this.state.data.bid_bond}
                            bid_bond_value={this.state.data.bid_bond_value}
                            order_placement={this.state.data.order_placement}
                        />
                        <DocumentTender
                            data={this.state.data.doc_tender}
                        />
                        <ItemsSelfAssigment
                            column_penawaran = {false}
                            data={this.state.data.items}
                        />
                        {this.state.data.order_placement==="paket" &&
                        <ListPeserta
                            data={this.state.vendor}
                            openModal={() => this.toggleOpenModal()}
                            uuid_evaluasi = {this.props.match.params.id}
                            evaluasiVendor={(e, uuid) => this.evaluasiVendor(e, uuid)}
                            isMonitoring = {this.state.isMonitoring}
                        />
                        }

                        {this.state.data.order_placement==="itemize" &&
                            <ListPesertaItemize
                            data={this.state.vendor}
                            uuid_evaluasi = {this.props.match.params.id}
                            metode_evaluasi = {this.state.data.metode_evaluasi}
                            evaluasiVendor={(e, uuid,pr_uuid) => this.evaluasiVendorItemize(e, uuid, pr_uuid)}
                            evaluasiBtn={true}
                            />
                        }

                        {!this.state.isMonitoring && 
                        <Panel className="margin-bot-false">
                            <PanelHeader>Process</PanelHeader>
                            <PanelBody >
                                <div className="row pull-right m-t-10">
                                    <button type="submit" className="m-r-10 btn btn-info" disabled={this.state.data.is_retender_itemize.includes('p') ? true : false}  onClick={(e) => this.publish(e)} > Publish</button>
                                    <button type="button" className="m-r-10 btn btn-light" onClick={(e)=>this.back(e)}> Back</button>
                                </div>
                            </PanelBody>
                        </Panel>
                        }
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
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        showEvaluationTeknis: (id) => dispatch(showEvaluationTeknis(id)),
        showListVendorProcessTeknis: (id) => dispatch(showListVendorProcessTeknis(id)),
        saveEvaluasiTeknisPublish: (id, payload) => dispatch(saveEvaluasiTeknisPublish(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(SelfAssigment))
