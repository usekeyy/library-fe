import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Header from './detail/Header';
import DetailTender from './detail/DetailTender';
import DocumentTender from './detail/DocumentTender';
import HasilEvaluasi from './detail/HasilEvaluasi';
import ProsesEvaluasiKomersil from './detail/ProsesEvaluasiKomersil';
import HasilEvaluasiTeknis from './detail/HasilEvaluasiTeknis';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import ItemDetail from './detail/ItemDetail';
import Catatan from './detail/Catatan';
import { storeEvaluasiCommersialPublish, showEvaluationCommersial, storeConfiguration, getEvaluationCommersialConfig, getEvaluationCommersialEvaluasi } from '../../../../store/actions/tendering/evaluationCommercialActions'
import { showListVendorProcessTeknis } from '../../../../store/actions/tendering/evaluationTechnicalActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import ListPesertaItemizeTeknis from './detail/ListPesertaItemizeTeknis';
import ListPesertaItemizeCommersial from './detail/ListPesertaItemizeCommersial';
import ListPesertaItemizeCommercialResult from './detail/ListPesertaItemizeCommercialResult';

class DetailEvaluasiKomersil extends Component {
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
            configArr: [],
            evaluasiArr: [],
            headerArr: [],
            itemArr: [],
            hasilEvaluasiTeknis: [],
            detailHasilEvalusiTeknis: {
                ambang_batas_teknis: "",
                bobot_teknis: "",
                passing_grade: ""
            },
            headerProcessEvaluasiCommercil: {},
            isMonitoring : this.props.location.pathname.split("/")[2] === 'monitoring-tender-buyer' ? true : false
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            this.getUUID()
            this.getHasilEvaluasiTeknis()
            this.getEvaluationCommersialEvaluasi()
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
            this.props.showEvaluationCommersial(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getHasilEvaluasiTeknis() {
        if (this._isMounted) {
            this.props.showListVendorProcessTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ detailHasilEvalusiTeknis }) => ({
                        hasilEvaluasiTeknis: datas.vendor,
                        detailHasilEvalusiTeknis: { ...detailHasilEvalusiTeknis, ambang_batas_teknis: (datas.ambang_batas === null) ? 0 : datas.ambang_batas.ambang_batas, bobot_teknis: (datas.ambang_batas === null) ? 0 : datas.ambang_batas.bobot_teknis },
                    }));
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getEvaluasiTeknisConfig() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.getEvaluationCommersialConfig(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ configArr: datas })
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }
    getEvaluationCommersialEvaluasi() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.getEvaluationCommersialEvaluasi(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ evaluasiArr: datas.list_peserta, headerProcessEvaluasiCommercil: datas.header })
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeEvaluasiCommersialPublish(payload) {
        if (this._isMounted) {
            this.props.storeEvaluasiCommersialPublish(this.props.match.params.id, payload)
                .then((resp) => {
                    toastr.success("SUCCESS", resp.data.message)
                    this.back()
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
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
    back(e) {
        this.props.history.push('/tendering/evaluation-commercial')
    }

    evaluasiVendor(e, uuid, pr_item_id = "") {
        console.log(pr_item_id)
        if (this.state.isMonitoring){
            this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/nilai/' + this.props.match.params.id + '/vendor/' + uuid)
        }else{
            if (pr_item_id===""){
                this.props.history.push('/tendering/evaluation-commercial/nilai/' + this.props.match.params.id + '/vendor/' + uuid)
            }else{
                this.props.history.push('/tendering/evaluation-commercial/nilai/' + this.props.match.params.id + '/vendor/' + uuid+'?pr_item_id='+pr_item_id)
            }
        }
        
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Evaluasi</li>
                </ol>
                <h1 className="page-header">{t("evaluation:title-commecial-evaluation")}<small></small></h1>

                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loading &&
                    <div>
                        <Header
                            proposal_tender_no={this.state.data.header.proposal_tender_no}
                            description={this.state.data.header.title}
                            status={this.state.data.header.proses}
                            assignment={this.state.data.header.assignment}
                            vendor={false}
                        />
                        <DetailTender
                            metode_pengadaan_name={this.state.data.header.metode_pengadaan_name}
                            pra_qualification={this.state.data.header.pra_qualification}
                            metode_aanwijzing_name={this.state.data.header.metode_aanwijzing_name}
                            metode_penyampaian_name={this.state.data.header.metode_penyampaian_name}
                            metode_evaluasi={this.state.data.header.metode_evaluasi}
                            metode_negosiasi={this.state.data.header.metode_negosiasi}
                            multiwinner={this.state.data.header.multiwinner}
                            bid_bond={this.state.data.header.bid_bond}
                            bid_bond_value={this.state.data.header.bid_bond_value}
                            order_placement={this.state.data.header.order_placement}
                        />
                        <DocumentTender
                            data={this.state.data.doc_tender}
                        />

                        <ItemDetail
                            data={this.state.data.items}
                        />
                        {this.state.data.header.order_placement === "itemize" &&
                            <ListPesertaItemizeTeknis
                                data={this.state.hasilEvaluasiTeknis}
                                metode_evaluasi={this.state.data.header.metode_evaluasi}
                                detailHasilEvalusiTeknis={this.state.detailHasilEvalusiTeknis}
                            />
                        }
                        {this.state.data.header.order_placement !== "itemize" &&
                            <HasilEvaluasiTeknis
                                data={this.state.hasilEvaluasiTeknis}
                                metode_evaluasi={this.state.data.header.metode_evaluasi}
                                detailHasilEvalusiTeknis={this.state.detailHasilEvalusiTeknis}
                            />
                        }

                        {this.state.data.header.order_placement === "itemize" && 
                            <ListPesertaItemizeCommersial 
                                data={this.state.evaluasiArr}
                                header={this.state.headerProcessEvaluasiCommercil}
                                metode_evaluasi={this.state.data.header.metode_evaluasi}
                                evaluasiVendor={(e, uuid , pr_item_id) => this.evaluasiVendor(e, uuid, pr_item_id)}
                            />
                        }

                        {this.state.data.header.order_placement !== "itemize" &&
                            <ProsesEvaluasiKomersil
                                data={this.state.evaluasiArr}
                                header={this.state.headerProcessEvaluasiCommercil}
                                metode_evaluasi={this.state.data.header.metode_evaluasi}
                                evaluasiVendor={(e, uuid) => this.evaluasiVendor(e, uuid)}
                            />
                        }

                        {this.state.data.header.order_placement==="itemize" && 
                        <ListPesertaItemizeCommercialResult 
                                data={this.state.evaluasiArr}
                                openModal={() => this.toggleOpenModal()}
                                metode_evaluasi={this.state.data.header.metode_evaluasi}
                                headerProcessEvaluasiCommercil={this.state.headerProcessEvaluasiCommercil}
                        />
                        }
                        {this.state.data.header.order_placement !== "itemize" &&
                            <HasilEvaluasi
                                data={this.state.evaluasiArr}
                                openModal={() => this.toggleOpenModal()}
                                metode_evaluasi={this.state.data.header.metode_evaluasi}
                                headerProcessEvaluasiCommercil={this.state.headerProcessEvaluasiCommercil}
                            />
                        }
                        <Catatan
                            header={this.state.data.header}
                            storeEvaluasiCommersialPublish={(payload) => this.storeEvaluasiCommersialPublish(payload)}
                            back={(e) => this.back(e)}
                            isMonitoring={this.state.isMonitoring}/>
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
        showListVendorProcessTeknis: (id) => dispatch(showListVendorProcessTeknis(id)),
        showEvaluationCommersial: (id) => dispatch(showEvaluationCommersial(id)),
        getEvaluationCommersialConfig: (id) => dispatch(getEvaluationCommersialConfig(id)),
        getEvaluationCommersialEvaluasi: (id) => dispatch(getEvaluationCommersialEvaluasi(id)),
        storeConfiguration: (id, payload) => dispatch(storeConfiguration(id, payload)),
        storeEvaluasiCommersialPublish: (id, payload) => dispatch(storeEvaluasiCommersialPublish(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailEvaluasiKomersil))
