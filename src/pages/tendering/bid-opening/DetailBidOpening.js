import React, { Component } from 'react'
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { publishBidOpening , DetailBidOpeningCommersial ,DetailBidOpeningTechnical , showBidOpening, showNoteBidOpening, reTenderBidOpening, openBidOpening, storeNoteBidOpening, S2BidOpening , downloadBidOpening} from '../../../store/actions/tendering/bidOpeningActions'
import { saveRetender } from '../../../store/actions/tendering/retenderActions'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactLoading from 'react-loading';
import Header from './sub/Header'
import DetailTender from './sub/DetailTender'
import BidAdministratitionTechnical from './sub/BidAdministratitionTechnical'
import BidCommersil from './sub/BidCommersil'
import Catatan from './sub/Catatan';
import FormModalTechnical from './sub/FormModalTechnical';
import FormModalCommercial from './sub/FormModalCommercial';
import ListPesertaItemize from './sub/ListPesertaItemize';
import { fileUpload } from '../../../store/actions/uploadActions';
import FormRetender from './sub/FormRetender';

class DetailBidOpening extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            loading: false,
            header: {
                created_by_name: '',
                no_proposal_tender: '',
                reference: '',
                title_proposal_tender: '',
                total_value: '',
                bid_administrasi: '',
                bid_comersil: '',
                metode_penyampaian_id: '',
                closing_date:''
            },
            data: [],
            note: [],
            loadings: {
                loadingNote: false,
                loadingNoteBtn: false,
                loadingReTender: false,
                loadingOpenBid: false,
                loadingPreviewBerita: false,
                loadingPublishBerita: false,
                loading_modal_technical:false,
                loading_modal_commercial:false,
                loading_modal_retender:false,
                loading_publish_bid_opening : false
            },
            modals:{
                loading_modal_technical_open:false,
                loading_modal_commercial_open:false,
                loading_modal_retender_open:false,
            },
            textNote: '',
            vendor_administrasi: [],
            sampul: '',
            dataTechnical:[],
            dataCommersial:[],
            errorsRetender : []
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            if (this.props.match.params.id !== undefined) {
                this.getUUID()
                this.getCatatan()
            }
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
            this.props.showBidOpening(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ header }) => ({
                        loading: false,
                        data: datas,
                        header: {
                            ...header, created_by_name: datas.created_by_name,
                            no_proposal_tender: datas.number,
                            reference: datas.reference,
                            title_proposal_tender: datas.title,
                            total_value: datas.total_value,
                            bid_administrasi: datas.bid_administrasi,
                            bid_comersil: datas.bid_comersil,
                            metode_penyampaian_id: datas.metode_penyampaian_id,
                            closing_date: datas.clossing_date+" "+datas.clossing_time,
                        },
                        vendor_administrasi: datas.vendor_administrasi,
                        sampul: datas.metode_penyampaian_id
                    }));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error("FAILED LOAD DATA", resp.data.message);
                    this.props.history.push('/tendering/bid-opening')
                });
        }
    }

    getCatatan() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingNote: true }
            }));
            this.props.showNoteBidOpening(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    toastr.success("Success", resp.data.message)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingNote: false },
                        note: datas
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingNote: false }
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    DetailBidOpeningTechnical(e,uuid_vendor) {
        if (this._isMounted) {
            this.setState(({modals,loadings})=> ({ 
                dataTechnical:[],
                loadings : {...loadings , loading_modal_technical : true},
                modals : {...modals , loading_modal_technical_open : true}
            }))

            this.props.DetailBidOpeningTechnical(this.props.match.params.id,uuid_vendor)
                .then((resp) => {
                    let datas = resp.data.data;
                    toastr.success("Success", resp.data.message)
                    this.setState(({modals,loadings})=> ({ 
                        dataTechnical:datas,
                        loadings : {...loadings , loading_modal_technical : false}
                    }))
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_modal_technical: false }
                    }));
                    if(resp.data!==undefined){
                        this.setState(({ modals }) => ({
                            modals : {...modals , loading_modal_technical_open : false}
                        }));
                        toastr.error(resp.data.status, resp.data.message)
                    }else{
                        toastr.error(resp.data.status, resp.data.message);
                    }
                });
        }
    }

    DetailBidOpeningCommersial(e,uuid_vendor, name_vendor, pr_item_id_payload=0) {
        if (this._isMounted) {
            this.setState(({modals,loadings})=> ({ 
                dataCommersial:[],
                loadings : {...loadings , loading_modal_commercial : true},
                modals : {...modals , loading_modal_commercial_open : true}
            }))

            this.props.DetailBidOpeningCommersial(this.props.match.params.id,uuid_vendor,{
                pr_item_id : pr_item_id_payload
            })
                .then((resp) => {
                    let datas = resp.data.data;
                    toastr.success("Success", resp.data.message)
                    this.setState(({modals,loadings,dataCommersial})=> ({ 
                        dataCommersial:{...dataCommersial, data : datas.items, vendor_id:uuid_vendor,vendor_name : name_vendor},
                        loadings : {...loadings , loading_modal_commercial : false}
                    }))
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_modal_commercial: false }
                    }));
                    if(resp.data!==undefined){
                        this.setState(({ modals }) => ({
                            modals : {...modals , loading_modal_commercial_open: false}
                        }));
                        toastr.error(resp.data.status, resp.data.message)
                    }else{
                        toastr.error(resp.data.status, resp.data.message);
                    }
                });
        }
    }

    reTendering(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingReTender: true }
            }));
            console.log(payload)
            this.props.saveRetender(payload)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingReTender: false },
                }));
                this.props.history.push('/tendering/monitoring-tender-buyer/detail/'+this.props.match.params.id)
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    errorsRetender : resp.data.errors,
                    loadings: { ...loadings, loadingReTender: false }
                }));
                toastr.error(resp.data.status, resp.data.message);
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    modalRetenderOpen(){
        if (this._isMounted) {
            this.setState(({modals,loadings})=> ({ 
                loadings : {...loadings , loading_modal_retender: true},
                modals : {...modals , loading_modal_retender_open : true},
                errorsRetender:[]
            }))
        }
    }

    OpenBid() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingOpenBid: true }
            }));
            this.props.openBidOpening(this.props.match.params.id)
                .then((resp) => {
                    toastr.success("Success", resp.data.message)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingOpenBid: false },
                    }));
                    this.getUUID()
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingOpenBid: false }
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    downloadBapp() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingOpenBid: true }
            }));
            this.props.downloadBidOpening(this.props.match.params.id)
                .then((resp) => {
                    const url = window.URL.createObjectURL(new Blob([resp.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${this.state.header.no_proposal_tender}.pdf`); //or any other extension
                    document.body.appendChild(link);
                    link.click();

                    toastr.success("Success", resp.data.message)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingOpenBid: false },
                    }));
                    // this.getUUID()
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingOpenBid: false }
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    OpenBid2Sampul(type) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingOpenBid: true }
            }));
            this.props.S2BidOpening(this.props.match.params.id, type)
                .then((resp) => {
                    toastr.success("Success", resp.data.message)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingOpenBid: false },
                    }));
                    this.getUUID()
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingOpenBid: false }
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    publishBidOpening(type) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_publish_bid_opening: true }
            }));
            this.props.publishBidOpening(this.props.match.params.id)
                .then((resp) => {
                    toastr.success("Success", resp.data.message)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_publish_bid_opening: false },
                    }));
                    this.getUUID()
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_publish_bid_opening: false }
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeCatatan(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingNoteBtn: true }
            }));
            this.props.storeNoteBidOpening({
                'note': payload.note,
                'uuid': this.props.match.params.id,
                'process': "Bid Opening",
            })
                .then((resp) => {
                    toastr.success("Success", resp.data.message)
                    this.setState(({ loadings }) => ({
                        textNote: '',
                        loadings: { ...loadings, loadingNoteBtn: false },
                    }));
                    this.getCatatan()
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        textNote: payload.note,
                        loadings: { ...loadings, loadingNoteBtn: false }
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    toggleOpenModalTechnical = (e, original) => {
        this.setState(({modals,loadings})=> ({ 
            dataTechnical:[],
            loadings : {...loadings , loading_modal_technical : true},
            modals : {...modals , loading_modal_technical_open : true}
        }))
    }

    toggleCloseModalTechnical = () => {
        this.setState(({modals,loadings})=> ({ 
            dataTechnical:[],
            loadings : {...loadings , loading_modal_technical : false},
            modals : {...modals , loading_modal_technical_open : false}
        }))
    }

    toggleOpenModalCommercial = (e, original) => {
        this.setState(({modals,loadings})=> ({ 
            dataTechnical:[],
            loadings : {...loadings , loading_modal_commercial : true},
            modals : {...modals , loading_modal_commercial_open : true}
        }))
    }

    toggleCloseModalCommercial = () => {
        this.setState(({modals,loadings})=> ({ 
            dataTechnical:[],
            loadings : {...loadings , loading_modal_commercial: false},
            modals : {...modals , loading_modal_commercial_open : false}
        }))
    }

    toggleCloseModalRetender = () => {
        this.setState(({modals,loadings}) => ({ 
            loadings : {...loadings , loading_modal_retender: false},
            modals : {...modals , loading_modal_retender_open : false},
            errorsRetender : []
        }))
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                {!this.state.loading &&
                    <div>
                        <Header
                            proposal_tender_no={this.state.header.no_proposal_tender}
                            title={this.state.header.title_proposal_tender}
                            reference={this.state.header.reference}
                            created_by_name={this.state.header.created_by_name}
                            total_value={this.state.header.total_value}
                            bid_administrasi={this.state.header.bid_administrasi}
                            bid_comersil={this.state.header.bid_comersil}
                            metode_penyampaian_id={this.state.header.metode_penyampaian_id}
                            closing_date={this.state.header.closing_date}
                            bid_opening_bapp={this.state.data.bid_opening_bapp}
                            user={this.props.user}
                            modalRetenderOpen={() => this.modalRetenderOpen()}
                            publishBidOpening={() => this.publishBidOpening()}
                            OpenBid={() => this.OpenBid()}
                            downloadBapp={() => this.downloadBapp()}
                            storeCatatan={() => this.storeCatatan()}
                            OpenBid2Sampul={(type) => this.OpenBid2Sampul(type)}
                            loadings={this.state.loadings}
                            retender_isactive = {this.state.data.retender_isactive}
                            
                        />
                        <DetailTender
                            metode_pengadaan_name={this.state.data.metode_pengadaan_name}
                            pra_qualification={this.state.data.pra_qualification}
                            metode_aanwijzing_name={this.state.data.metode_aanwijzing_name}
                            metode_penyampaian_name={this.state.data.metode_penyampaian_name}
                            metode_evaluasi={this.state.data.metode_evaluasi}
                            metode_negosiasi={this.state.data.metode_negosiasi}
                            order_placement={this.state.data.order_placement}
                            bid_bond={this.state.data.bid_bond}
                            bid_bond_value={this.state.data.bid_bond_value}
                        />

                        <BidAdministratitionTechnical
                            data={this.state.data.vendor_administrasi}
                            bid_administrasi={this.state.header.bid_administrasi}
                            detail={(e,payload) => this.DetailBidOpeningTechnical(e,payload)}
                        />
                        {this.state.data.order_placement==="itemize" && 
                         <ListPesertaItemize 
                            data={this.state.data.vendor_comersil}
                            evaluasiBtn={true}
                            bid_comersil={this.state.header.bid_comersil}
                            metode_evaluasi = {this.state.data.metode_evaluasi}
                            detail={(e,vendor_id,name_vendor, pr_item_id) => this.DetailBidOpeningCommersial(e,vendor_id,name_vendor, pr_item_id)}
                         />
                        }
                        {this.state.data.order_placement!=="itemize" && 
                        <BidCommersil
                            data={this.state.data.vendor_comersil}
                            bid_comersil={this.state.header.bid_comersil}
                            detail={(e,vendor_id,name_vendor) => this.DetailBidOpeningCommersial(e,vendor_id,name_vendor)}
                        />
                        }
                        <Catatan
                            data={this.state.note}
                            textNote={this.state.textNote}
                            loadings={this.state.loadings}
                            storeCatatan={(payload) => this.storeCatatan(payload)}
                        />
                    </div>
                }

            {/* Modal Teknical */}
            <Modal isOpen={this.state.modals.loading_modal_technical_open} toggle={() => this.toggleCloseModalTechnical()}>
                <ModalHeader toggle={() => this.toggleCloseModalTechnical()}>Detail Item Bid Technical</ModalHeader>
                <ModalBody>

                {this.state.loadings.loading_modal_technical &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loadings.loading_modal_technical &&
                <FormModalTechnical 
                    data={this.state.dataTechnical}
                />
                }
               
                    
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" type="button" onClick={(e) => this.toggleCloseModalTechnical(e)} >{t("currency:button.close")}</button>
                </ModalFooter>
            </Modal>
            {/* End Modal Techinacal */}

            {/* Modal Commersial */}
            <Modal isOpen={this.state.modals.loading_modal_commercial_open} toggle={() => this.toggleCloseModalCommercial()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleCloseModalCommercial()}>Detail Bid Commecial</ModalHeader>
                <ModalBody>

                {this.state.loadings.loading_modal_commercial &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loadings.loading_modal_commercial && <FormModalCommercial 
                    data={this.state.dataCommersial.data}
                    vendor_id={this.state.dataCommersial.vendor_id}
                    vendor_name={this.state.dataCommersial.vendor_name}
                />  
                }             
                    
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" type="button" onClick={() => this.toggleCloseModalCommercial()} >{t("currency:button.close")}</button>
                </ModalFooter>
            </Modal>
            {/* End Modal Commersial */}


            {/* Modal Retender */}
            <Modal isOpen={this.state.modals.loading_modal_retender_open} toggle={() => this.toggleCloseModalRetender()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleCloseModalRetender()}>Retender</ModalHeader>
                <FormRetender 
                    toggleClose={() => this.toggleCloseModalRetender()}
                    upload = {this.props.fileUpload}
                    proposal_tender_id={this.state.data.id}
                    reTendering={(payload) => this.reTendering(payload)}
                    loadings = {this.state.loadings}
                    errors = {this.state.errorsRetender}
                />       
            </Modal>
            {/* End Modal Retender */}
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
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        saveRetender: (id) => dispatch(saveRetender(id)),
        showBidOpening: (id) => dispatch(showBidOpening(id)),
        showNoteBidOpening: (id) => dispatch(showNoteBidOpening(id)),
        reTenderBidOpening: (id, payload) => dispatch(reTenderBidOpening(id, payload)),
        DetailBidOpeningTechnical: (uuid, uuid_vendor, payload) => dispatch(DetailBidOpeningTechnical(uuid, uuid_vendor, payload)),
        DetailBidOpeningCommersial: (uuid, uuid_vendor, payload) => dispatch(DetailBidOpeningCommersial(uuid, uuid_vendor, payload)),
        S2BidOpening: (id, type) => dispatch(S2BidOpening(id, type)),
        openBidOpening: (id) => dispatch(openBidOpening(id)),
        storeNoteBidOpening: (id) => dispatch(storeNoteBidOpening(id)),
        downloadBidOpening: (id) => dispatch(downloadBidOpening(id)),
        publishBidOpening: (id) => dispatch(publishBidOpening(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailBidOpening));