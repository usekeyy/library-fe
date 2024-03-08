import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { showDetailParameterAuction, storeDetailAuction } from '../../../../store/actions/auction/auctionActions'
import SideAccordion from '../SideAccordion'
import Form from './sub/Form'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel'
import { fetchPurchasingOrg } from '../../../../store/actions/master/purchasingOrgActions'
import { fetchPurchasingGroup } from '../../../../store/actions/master/purchasingGroupActions'
import BlankSideAccordion from '../BlankSideAccordion'

class ParameterAuction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: true,
            loadings: {
                loading_fetch_purchasing_org: false,
                loading_fetch_purchasing_group: false,
                loading_store_detail_auction : false
            },
            errors : [],
            options: {
                simulate: [
                    { value: "simulate", label: "Simulasi" },
                    { value: "live", label: "Live" },
                ],
                actionType: [
                    { value: "reverse_auction", label: "Reverse Auction" },
                    { value: "forward_auction", label: "Foward Auction" },
                ],
                perhitunganHargaSatuan: [
                    { value: "diskon", label: "Diskon", isDisabled : (this.state?.header.source==="eproc") ? true : false },
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
                opsi_penerimaan_jumlah: [
                    { value: "diterima", label: "Di Terima" },
                    { value: "ditolak", label: "Di Tolak" },
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
                purchasingOrg: [],
                purchasingGroup: []
            }

        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUUID();
        this.fetchPurchasingOrg()
        this.fetchPurchasingGroup({id:this.props.user?.company_id!=="" ? this.props.user.company_id : ""})
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
                    // this.setState({ loading: false });
                    // toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    fetchPurchasingOrg() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_fetch_purchasing_org: true },
            }));
            this.props.fetchPurchasingOrg()
                .then((resp) => {
                    let m_company = resp.data.data;
                    let purchasingOrgs = m_company.map((dt) => {
                        return { value: dt.id, label: dt.id+" - "+dt.name };
                    })
                    this.setState(({ loadings, options }) => ({
                        loadings: { ...loadings, loading_fetch_purchasing_org: false },
                        options: { ...options, purchasingOrg: purchasingOrgs },
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_fetch_purchasing_org: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    fetchPurchasingGroup (payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_fetch_purchasing_group: true },
            }));
            let select_params =
            payload.id !== ""
                ? { start: 0, length: 10, purchasing_org_id: payload.id, name : payload.name }
                : { start: 0, length: 10 };
            this.props.fetchPurchasingGroup(select_params)
                .then((resp) => {
                    let response = resp.data.data;
                    let purchasingGroup = response.map((dt) => {
                        return { value: dt.id, label: dt.id+" - "+dt.name };
                    })
                    this.setState(({ loadings, options }) => ({
                        loadings: { ...loadings, loading_fetch_purchasing_group: false },
                        options: { ...options, purchasingGroup: purchasingGroup },
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_fetch_purchasing_group: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeDetailAuction(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_store_detail_auction: true },
                errors : []
            }));
            this.props.storeDetailAuction(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_store_detail_auction: false },
                        errors : []
                    }));
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_store_detail_auction: false },
                        errors : resp.data.errors
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    toAuctionList = () => {
        this.props.history.push('/auction')
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction Configuration</li>
                    <li className="breadcrumb-item">Parameter Auction</li>
                </ol>
                <h1 className="page-header">Auction Configuration</h1>
                <div className="row">
                    <div className="col-md-2">
                    {!this.state.loading &&
                        <SideAccordion
                            uuid={this.props.match.params.id}
                            actived = "parameter-auction"
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
                                access = {this.props.access}
                                state={this.state}
                                fetchPurchasingGroup={(payload) => this.fetchPurchasingGroup(payload)}
                                storeDetailAuction={(payload) => this.storeDetailAuction(payload)}
                                toAuctionList={(payload) => this.toAuctionList(payload)}
                            />
                        </div>
                    }
                </div>
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
        showDetailParameterAuction: (id) => dispatch(showDetailParameterAuction(id)),
        fetchPurchasingOrg: (payload) => dispatch(fetchPurchasingOrg(payload)),
        fetchPurchasingGroup: (payload) => dispatch(fetchPurchasingGroup(payload)),
        storeDetailAuction: (id,payload) => dispatch(storeDetailAuction(id,payload))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ParameterAuction));
