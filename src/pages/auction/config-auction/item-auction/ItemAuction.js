import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { showDetailParameterAuction, updateItemAuction , DeleteItemsFreeAuction } from '../../../../store/actions/auction/auctionActions'
import SweetAlert from 'react-bootstrap-sweetalert';
import SideAccordion from '../SideAccordion'
import Form from './sub/Form'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel'
import { Modal, ModalHeader } from 'reactstrap'
import FormModal from './sub/FormModal'
import FormFreeAuction from './sub/FormFreeAuction'
import { fetchUom } from '../../../../store/actions/master/uomActions'
import { fetchCurrencies } from '../../../../store/actions/master/currenciesActions'
import { storeItemFreeAuction , putItemFreeAuction} from '../../../../store/actions/auction/freeAuction'
import BlankSideAccordion from '../BlankSideAccordion'


class ItemAuction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            isConfirm: false,
            uuid: "",
            loading: true,
            loadings: {
                loading_fetch_purchasing_org: false,
                loading_fetch_purchasing_group: false,
                loading_fetch_uom : false,
                loading_fetch_currencies : false,
                loading_save_free_auction_item : false,
                loading_update_detail_auction : false,
            },
            currencies: [],
            uoms : [],
            modalItem: false,
            modalFreeAuction: false,
            dataFreeAuction: [],
            urutan : 0 ,
            dataModal: [],
            itemSelected: 0,
            errors_free_auction : [],
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
                ],
                purchasingOrg: []
            }

        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUUID();
        this.fetchCurrencies()
        this.fetchUom()
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
                    this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    openModals(item) {
        if (this._isMounted) {
            this.setState({ modalItem: true, dataModal: this.state.data?.detail_item[item], itemSelected: item })
        }
    }

    openModalFreeAuction(item) {
        if (this._isMounted) {
            this.setState({ modalFreeAuction: true })
        }
    }

    editModalFreeAuction(item) {
        if (this._isMounted) {
            console.log(item)
            this.setState({ modalFreeAuction: true, dataFreeAuction : this.state.data.detail_item[item] , urutan : item })
        }
    }

    tonggleCloseModalItem = () => {
        this.setState({ modalItem: false })
    }

    tonggleCloseModalFreeAuction = () => {
        this.setState({ modalFreeAuction: false, dataFreeAuction : [] })
    }

    save(payload) {
        let arr = []
        this.state.data.detail_item.forEach((element, i) => {
            if (i === this.state.itemSelected) {
                arr.push(payload)
            } else {
                arr.push(element)
            }

        });
        this.setState(({ data }) => ({
            data: { ...data, detail_item: arr }
        }));

        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_update_detail_auction: true },
        }));
        this.props.updateItemAuction(this.props.match.params.id, {
            discount: payload.discount,
            high_unit_price: payload.high_unit_price,
            low_unit_price: payload.low_unit_price,
            proposal_tender_item_id: payload.proposal_tender_item_id,
            note: payload.note
        })
            .then((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_update_detail_auction: false },
                    modalItem: false
                }));
                toastr.success(resp.data.status, resp.data.message);
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_update_detail_auction: false },
                }));
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    updateItemAuction(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_update_detail_auction: true },
            }));
            this.props.updateItemAuction(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_update_detail_auction: false },
                    }));
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_update_detail_auction: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    toAuctionList = () => {
        this.props.history.push('/auction')
    }

    fetchCurrencies = (newValue) => {
        if (newValue === undefined || newValue !== '') {
            let select_params = (newValue !== '') ? { start: 0, length: 5, select: newValue } : { start: 0, length: 5 };
            this.props.fetchCurrencies(select_params)
                .then((resp) => {
                    let data = resp.data.data;
                    let options = data.map((data) => {
                        return { value: data.id, label: data.id + ' - ' + data.short_text };
                    })
                    this.setState({ currencies: options })
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);
                });
        }
    }

    fetchUom = (newValue) => {
        if (newValue === undefined || newValue !== '') {
            let select_params = (newValue !== '') ? { start: 0, length: 5, select: newValue } : { start: 0, length: 5 };
            this.props.fetchUom(select_params)
                .then((resp) => {
                    let data = resp.data.data;
                    let options = data.map((data) => {
                        return { value: data.code, label: data.code + ' - ' + data.name };
                    })
                    this.setState({ uoms: options })
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);
                });
        }
    }

    storeItemFreeAuction(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_save_free_auction_item: true },
                errors_free_auction : []
            }));
            this.props.storeItemFreeAuction(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_save_free_auction_item: false },
                        modalFreeAuction : false
                    }));
                    this.getUUID();
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_save_free_auction_item: false },
                        errors_free_auction : resp.data.errors
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    putItemFreeAuction(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_save_free_auction_item: true },
                errors_free_auction : []
            }));
            this.props.putItemFreeAuction(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_save_free_auction_item: false },
                        modalFreeAuction : false
                    }));
                    this.getUUID();
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_save_free_auction_item: false },
                        errors_free_auction : resp.data.errors
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    handleDelete = (id) => {
		if(this._isMounted){
			this.props.DeleteItemsFreeAuction(id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({}, () => this.getUUID());
			})
			.catch(error => {
					const {message} = error.data;
					if(typeof message === 'string') {
							toastr.error('Something Wrong', message);
					}
					this._isMounted && this.setState({error: true, errors: message, loading: false});
			})
		}
	}

	toggleConfirm = (e, value) => {
		if(this._isMounted){
			e.preventDefault()
			this.setState({isConfirm: true, uuid: value})
		}
	}

	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.setState({ isConfirm: false });
					this.handleDelete(this.state.uuid)
					break;
				case 'cancel':
					this.setState({ isConfirm: false, uuid: '' });
					break;
				default:
					break;
			}
		}
	}

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction Configuration</li>
                    <li className="breadcrumb-item">Item Auction</li>
                </ol>
                <h1 className="page-header">Auction Configuration</h1>
                <div className="row">
                    <div className="col-md-2">
                    {!this.state.loading &&
                        <SideAccordion
                            uuid={this.props.match.params.id}
                            actived="item-auction"
                            header= {this.state.data}
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
                                options={this.state.options}
                                state={this.state}
                                access={this.props.access}
                                openModals={(payload) => this.openModals(payload)}
                                openModalFreeAuction={(payload) => this.openModalFreeAuction(payload)}
                                editModalFreeAuction={(payload) => this.editModalFreeAuction(payload)}
                                updateItemAuction={(payload) => this.updateItemAuction(payload)}
                                toAuctionList={(payload) => this.toAuctionList(payload)}
                                toggleConfirm = {(e,payload) => this.toggleConfirm(e, payload)}
                            />
                        </div>
                    }
                    {!this.state.loading &&
                    <Modal isOpen={this.state.modalItem} className="modal-lg">
                        <ModalHeader toggle={() => this.tonggleCloseModalItem()}>Item Auction</ModalHeader>
                        <div className="col-lg-12 m-t-10">
                            <FormModal
                                price_calculation={this.state.data.detail?.price_calculation}
                                data={this.state.dataModal}
                                loadings={this.state.loadings}
                                access={this.props.access}
                                header={this.state.data?.header}
                                save={(payload) => this.save(payload)}
                                toggle={() => this.tonggleCloseModalItem()}
                            />
                        </div>
                    </Modal>}
                    {!this.state.loading &&
                    <Modal isOpen={this.state.modalFreeAuction} className="modal-lg">
                        <ModalHeader toggle={() => this.tonggleCloseModalFreeAuction()}>Item Free Auction</ModalHeader>
                        <div className="col-lg-12 m-t-10">
                            <FormFreeAuction
                                price_calculation={this.state.data?.detail?.price_calculation}
                                errors = {this.state.errors_free_auction}
                                currencies={this.state.currencies}
                                header={this.state.data?.header}
                                uoms={this.state.uoms}
                                loadings = {this.state.loadings}
                                queue = {this.state.data.detail_item?.length}
                                handleChangeCurrencies={this.fetchCurrencies}
                                handleChangeUom={this.fetchUom}
                                toggle={() => this.tonggleCloseModalFreeAuction()}
                                save = {(payload) =>this.storeItemFreeAuction(payload)}
                                update = {(payload) =>this.putItemFreeAuction(payload)}
                                data  = {this.state.dataFreeAuction}
                                urutan ={this.state.urutan}
                                
                            />
                        </div>
                    </Modal>
                    }
                </div>
                {(this.state.isConfirm &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText={t("common:delete.approve-delete")}
						cancelBtnText={t("common:delete.cancel")}
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title={t("common:delete.title-delete")}
						onConfirm={() => this.toggleSweetAlert('confirm')}
						onCancel={() => this.toggleSweetAlert('cancel')}
					>
					</SweetAlert>
				)}
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
        fetchCurrencies: (payload) => dispatch(fetchCurrencies(payload)),
        storeItemFreeAuction: (id,payload) => dispatch(storeItemFreeAuction(id,payload)),
        putItemFreeAuction: (id,payload) => dispatch(putItemFreeAuction(id,payload)),
        fetchUom: (payload) => dispatch(fetchUom(payload)),
        DeleteItemsFreeAuction: (id) => dispatch(DeleteItemsFreeAuction(id)),
        updateItemAuction: (id, payload) => dispatch(updateItemAuction(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ItemAuction));
