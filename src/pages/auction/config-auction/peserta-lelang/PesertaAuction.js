import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { showDetailParameterAuction , pesertaItemsAuction } from '../../../../store/actions/auction/auctionActions'
import SideAccordion from '../SideAccordion'
import Form from './sub/Form'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel'
import { getOptionsVendorAuction } from '../../../../store/actions/auction/freeAuction'
import SweetAlert from 'react-bootstrap-sweetalert';
import { getPenawaranVendor ,storePenawaranVendor , deleteVendorPenawaran } from '../../../../store/actions/auction/monitoringBuyyerActions'
import { Modal, ModalHeader } from 'reactstrap'
import Penawaran from './sub/Penawaran'
import Peserta from './sub/Peserta'
import BlankSideAccordion from '../BlankSideAccordion'



class PesertaLelang extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: true,
            loadings :{
                loading_peserta_auction : false,
                loading_vendor_options : false,
                loading_store_delete : false,
                loading_data_initial_bid : true,
                loading_submit_bid: false
            },
            errors : [],
            isConfirmDelete: false,
            isOpenModalInitialBid: false,
            DataInitialBid : [],
            initial_bid_vendor_selected : "",
            initial_deleted_vendor_selected : "",
            vendorsSelection : [],
            checkAll : false,
            vendorOptions : [],
            tempVendorSelections : [],
            tempVendorSelectionsId : [],
            vendorSelected : [],
            prKeyItem : [],
            options: {
                simulate: [
                    { value: "simulate", label: "Simulate" },
                    { value: "live", label: "Live" },
                ],
                actionType: [
                    { value: "reverse_auction", label: "Reverse Auction" },
                    { value: "foward_auction", label: "Foward Auction" },
                ],
                perhitunganHargaSatuan: [
                    { value: "diskon", label: "Diskon" },
                    { value: "harga_satuan", label: "Harga Satuan" },
                ],
                metodeEvaluasiPenantuanPemenang: [
                    { value: "paket", label: "Paket" },
                    { value: "itemize", label: "Itemize" },
                ],
                perhitunganPeringkat: [
                    { value: "simple", label: "Simple" },
                    { value: "simple_best", label: "Simple Best" },
                    { value: "multivariate", label: "Multivariate" },
                ],
                opsiPenampilanPeringkat: [
                    { value: "memimpin", label: "Memimpin" },
                    { value: "semua", label: "Semua" },
                    { value: "sembunyikan", label: "Sembunyikan" },
                ],
                visibilitas: [
                    { value: "tunjukan", label: "Tunjukkan" },
                    { value: "sembunyikan", label: "Sembunyikan" },
                ],
                incrementDecrement: [
                    { value: "increment", label: "Increment" },
                    { value: "decrement", label: "Deckrement" },
                ],
                denominimalisasi: [
                    { value: "1", label: "1" },
                    { value: "10", label: "10" },
                    { value: "100", label: "100" },
                    { value: "1000", label: "1000" },
                ]
            }

        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUUID();
        
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
            this.props.showDetailParameterAuction(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    let IdSelected = []
                    if(datas.header.order_placement==="itemize"){
                        datas.list_peserta.forEach((element, i)=> {
                            IdSelected[element.pr_item_id] = (element.vendor.length === datas.vendor_selected[element.pr_item_id].length ) ? true : false
                        })
                    }                 
                    if(datas.header.source==="free"){
                        IdSelected = datas.vendor_selected
                    }  
                    this.setState(({ 
                        loading: false, 
                        data: datas , 
                        tempVendorSelections : datas.list_peserta , 
                        tempVendorSelectionsId : IdSelected, 
                        vendorsSelection: datas.vendor_selected , 
                        checkAll : ( datas.list_peserta.length === datas.vendor_selected.length ) ? true : false  ,
                        prKeyItem : IdSelected
                    }));
                    if(datas.header.source==="free"){
                        this.getOptionsVendorAuction();
                    }
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    handlerCheckAll = () => {
        let arr_selected = this.state.vendorsSelection;
		if (!this.state.checkAll) {
			this.state.data.list_peserta.forEach((element, i) => {
				if (!arr_selected.includes(element.vendor_id)) {
					arr_selected.push(element.vendor_id)
				}
			});
		} else {
			arr_selected = []
		}

		this.setState({
			checkAll: !this.state.checkAll,
            vendorsSelection :  arr_selected
		});
    }

    addVendorSelection (data) {
        if(this._isMounted){
            let tempvendor = this.state.tempVendorSelections
            let tempidselected  = this.state.tempVendorSelectionsId   
            if(!tempidselected.includes(data.value)){
                let explode = data.label.split(" - ")
                tempvendor.push({vendor_id : data.value, vendor_name : explode[1] })
                tempidselected.push(data.value)

                this.setState({
                    tempVendorSelections : tempvendor,
                    tempVendorSelectionsId: tempidselected
                })
                this.getOptionsVendorAuction();
            }
        }
    }

    onCheck  = (data) => {
        let arr_selected = this.state.vendorsSelection;
        if (!arr_selected.includes(data)) {
            arr_selected.push(data)
        }else{
            let newArr = []
            arr_selected.forEach(element => {
              if(element!==data){
                newArr.push(element)
              }
            });
            arr_selected = newArr
        }

        if(arr_selected.length!==this.state.data?.list_peserta.length){
            this.setState({
                checkAll :  false,
                vendorsSelection :  arr_selected
            });
        }else{
            this.setState({
                checkAll :  true,
                vendorsSelection :  arr_selected
            });
        }
    }

    onCheckItemize = (i,data,j) => {
        let arr = this.state.vendorsSelection
        let arrKey = this.state.prKeyItem
        let tempArrID = arr[i]
        if(!arr[i].includes(data)){
            tempArrID.push(data)
            arr[i]= tempArrID            
        }else{
            let newArr = []
            tempArrID.forEach(element => {
            if(element!==data){
                newArr.push(element)
            }
            });
            arr[i]= newArr
        }
        arrKey[i]=(this.state.data?.list_peserta[j].vendor.length === arr[i].length ) ? true : false
        this.setState({vendorsSelection:arr, prKeyItem : arrKey})
    }

    onCheckAllItemize = (i,j) => {
        let arr = this.state.vendorsSelection
        let arrKey = this.state.prKeyItem

        if(arrKey[i]){
            arrKey[i] = false
            arr[i]= []            
        }else{
            this.state.data.list_peserta[j].vendor.forEach(element => {
            if(!arr[i].includes(element['vendor_id'])){
                arr[i].push(element['vendor_id'])
            }
            });
            arrKey[i] = true
        }
		this.setState({vendorsSelection:arr, prKeyItem : arrKey})
    }

    pesertaItemsAuction (payload) {
        if(this._isMounted){
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_peserta_auction: true },
                errors : []
            }));
            this.props.pesertaItemsAuction(this.props.match.params.id, payload)
            .then((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_peserta_auction: false },
                }));
                toastr.success(resp.data.status, resp.data.message);
                this.getUUID()
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_peserta_auction: false },
                    errors : resp.data.errors
                }));
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    toAuctionList = () => {
        this.props.history.push('/auction')
    }

    getOptionsVendorAuction = (newValue) => {
        if (newValue === undefined || newValue !== '') {
            let select_params = (newValue !== '') ? { start: 0, length: 5, select: newValue } : { start: 0, length: 5 };
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_vendor_options: true },
            }));
            this.props.getOptionsVendorAuction(this.props.match.params.id,select_params)
                .then((resp) => {
                    let data = resp.data.data;
                    let options = data.map((data) => {
                        return { value: data.vendor_id, label: data.vendor_id + ' - ' + data.vendor_name, isDisabled : this.state.tempVendorSelectionsId.includes(data.vendor_id) };
                    })
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_vendor_options: false },
                        vendorOptions : options
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_vendor_options: false },
                    }));
                    toastr.error(resp.data.message);
                });
        }
    }

    toggleConfirmFreeze = (e, vendor_id) => {
        if (this._isMounted) {
            e.preventDefault()
            this.setState({ isConfirmDelete: true , initial_deleted_vendor_selected : vendor_id})
        }
    }

    toggleSweetAlertFreeze(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.deleteVendorPenawaran()
                    this.setState({ isConfirmDelete: false });
                    break;
                case 'cancel':
                    this.setState({ isConfirmDelete: false, initial_deleted_vendor_selected : ""});
                    break;
                default:
                    break;
            }
        }
    }

    deleteVendorPenawaran = () => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_peserta_auction: true },
            }));
            this.props.deleteVendorPenawaran(this.state.initial_deleted_vendor_selected)
                .then(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_peserta_auction: false },                        
                        initial_deleted_vendor_selected : ""
                    }));
                    this.getUUID()
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_peserta_auction: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                })
        }
    }


    toggleOpenModalInitialBid = (vendor_id) => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_initial_bid: true },
                isOpenModalInitialBid : true,
                initial_bid_vendor_selected : vendor_id
            }));
            this.props.getPenawaranVendor(this.props.match.params.id,vendor_id)
            .then((resp) => {
                let datas = resp.data.data 
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_data_initial_bid: false },
                    DataInitialBid : datas
                }));
                toastr.success(resp.data.status, resp.data.message);
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_data_initial_bid: false },
                }));
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    toggleCloseModalInitialBid = () => {
        if (this._isMounted) {            
            this.setState({ isOpenModalInitialBid: false, initial_bid_vendor_selected : "" ,DataInitialBid : []})
        }
    }

    storePenawaranVendor = (payload) => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_bid: true },
            }));
            this.props.storePenawaranVendor(this.props.match.params.id, this.state.initial_bid_vendor_selected, payload)
                .then(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_bid: false },
                        isOpenModalInitialBid: false,
                        initial_bid_vendor_selected : ""
                    }));
                    this.getUUID();
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_bid: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                })
        }
    }
    
    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction Configuration</li>
                    <li className="breadcrumb-item">vendor Auction</li>
                </ol>
                <h1 className="page-header">Auction Configuration</h1>
                <div className="row">
                    <div className="col-md-2">
                        {!this.state.loading &&
                        <SideAccordion
                            uuid={this.props.match.params.id}
                            header= {this.state.data}
                            actived = "peserta-auction"
                        />
                        }
                         {this.state.loading &&
                            <BlankSideAccordion/>
                        }
                    </div>
                    {this.state.loading &&
                        <div className="col-sm-10">
                            <Panel>
                                <PanelBody>
                                    <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                                </PanelBody>
                            </Panel>
                        </div>
                    }
                    {!this.state.loading &&
                        <div className="col-sm-10">
                            <Form
                                access={this.props.access}
                                options={this.state.options}
                                state ={this.state}
                                handlerCheckAll = {()=> this.handlerCheckAll()}
                                onCheck = {(payload)=> this.onCheck(payload)}
                                onCheckItemize = {(i, data ,j) => this.onCheckItemize(i, data, j)}
                                onCheckAllItemize = {(i,j) => this.onCheckAllItemize(i, j)}
                                pesertaItemsAuction = {(payload) => this.pesertaItemsAuction (payload)}
                                toAuctionList = {() => this.toAuctionList ()}
                                addVendorSelection = {(data) => this.addVendorSelection(data)}
                                getOptionsVendorAuction = {(payload) =>this.getOptionsVendorAuction(payload)}
                                toggleConfirmFreeze = {(e,vendor_id) =>this.toggleConfirmFreeze(e,vendor_id)}
                                toggleOpenModalInitialBid = {(vendor_id) =>this.toggleOpenModalInitialBid(vendor_id)}
                            />
                        </div>
                    }
                </div>

                {(this.state.isConfirmDelete &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.approve-delete")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.title-delete")}
                        onConfirm={() => this.toggleSweetAlertFreeze('confirm')}
                        onCancel={() => this.toggleSweetAlertFreeze('cancel')}
                    >
                    </SweetAlert>
                )}
                <Modal isOpen={this.state.isOpenModalInitialBid} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModalInitialBid()}>{t("auction:panel.initial-bid")}</ModalHeader>
                    {this.state.loadings.loading_data_initial_bid &&
                    <div className="col-lg-12 m-t-10">
                        <Panel>
                            <PanelBody>
                                <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                            </PanelBody>
                        </Panel>
                    </div>
                    }
                    {!this.state.loadings.loading_data_initial_bid &&
                    <div className="col-lg-12 m-t-10">
                        <Peserta
                            data={this.state.DataInitialBid.list_peserta}
                            loadings = {this.state.loadings}
                        />
                        <Penawaran
                            header={this.state.data?.header}
                            data={this.state.DataInitialBid.detail_item}
                            score_multivariate={this.state.DataInitialBid.score_multivariate}
                            loadings = {this.state.loadings}
                            toggle={() => this.toggleCloseModalInitialBid()}
                            storePenawaranVendor={(payload) => this.storePenawaranVendor(payload)}
                        />
                      
                    </div>
                    }
                </Modal>
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
        showDetailParameterAuction: (id) => dispatch(showDetailParameterAuction(id)),
        deleteVendorPenawaran: (id) => dispatch(deleteVendorPenawaran(id)),
        pesertaItemsAuction: (id, payload) => dispatch(pesertaItemsAuction(id, payload)),
        getPenawaranVendor: (id, payload) => dispatch(getPenawaranVendor(id, payload)),
        getOptionsVendorAuction: (id, payload) => dispatch(getOptionsVendorAuction(id, payload)),
        storePenawaranVendor: (id,vendor_id, payload) => dispatch(storePenawaranVendor(id, vendor_id, payload)),
        
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(PesertaLelang));
