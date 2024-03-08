import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination'
import { Panel, PanelBody, PanelHeader } from '../../../containers/layout/sub/panel/panel'
import 'react-table/react-table.css';
import { fetchAuctionList } from '../../../store/actions/auction/auctionActions'
import { toastr } from 'react-redux-toastr'
import { formatNumber } from '../../../helpers/formatNumber'
import { Modal, ModalHeader } from 'reactstrap'
import Form from './sub/Form'
import { fetchPurchasingOrg } from '../../../store/actions/master/purchasingOrgActions'
import { fetchPurchasingGroup } from '../../../store/actions/master/purchasingGroupActions'
import { storeFreeAuction } from '../../../store/actions/auction/freeAuction'
import { camelCase } from '../../../helpers/camelCase'

class auction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                auction_number : '',
                proposal_tender_no : '',
                auction_description : '',
                total_value : '',
                start: 0,
                length: 0,
                column: '',
                dir: '',
                created_by_name:''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            toggleSync: false,
            isConfirm: false,
            uuid: '',
            error: false,
            loadingSubmit: false,
            loadings: {
                loading_fetch_purchasing_org: false,
                loading_fetch_purchasing_group: false,
                loading_store_detail_auction : false
            },
            errors : [],
            options: {
                simulate: [
                    { value: "simulasi", label: "Simulasi" },
                    { value: "live", label: "Live" },
                ],
                actionType: [
                    { value: "reverse_auction", label: "Reverse Auction" },
                    { value: "forward_auction", label: "Foward Auction" },
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
        this.defaultSorted = [
            {
                id: "auction_number",
                desc: true
            }
        ];
        this.columns = [
            {
                Header: () => this.props.t("auction:label.no-auction"),
                accessor: "auction_number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="auction_number" onChange={(event) => this.onChanged(event)} value={this.state.params.auction_number} />
                )
            },
            {
                Header: () => this.props.t("auction:label.no-proposal-tender"),
                accessor: "proposal_tender_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: () => this.props.t("auction:label.description"),
                accessor: "auction_description",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="auction_description" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                )
            },
            {
                Header: () => this.props.t("auction:label.value"),
                id: "total_value",
                accessor: d => d.total_value,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="total_value" onChange={(event) => this.onChanged(event)} value={this.state.params.total_value} />
                ),
                Cell: ({ value }) => (
                    <div className="pull-right">
                        <label>{formatNumber(value, 2)}</label>
                    </div>
                )
            },
            {
                Header: () => this.props.t("auction:label.type"),
                accessor: "jenis_auction",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="jenis_auction" onChange={(event) => this.onChanged(event)} value={this.state.params.jenis_auction} />
                ),
                Cell: ({ value }) => (
                    <div>
                        <label>{camelCase(value)}</label>
                    </div>
                )
            },            
            {
                Header: () => this.props.t("auction:label.status"),
                accessor: "status_auction_text",
                filterable : false
                // Filter: ({ filter, onChange }) => (
                //     <input className="form-control" name="status" onChange={(event) => this.onChanged(event)} value={this.state.params.asset_class} />
                // )
            },        
            {
                Header: () => this.props.t("auction:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: d => (
                    <React.Fragment>
                        <center>
                            {this.props.access.R && d.original.status!=="n" &&
                                <button className="btn btn-xs btn-warning m-r-5" value={d.original.uuid} onClick={(e) => this.toProcess(e, d.original.uuid)} >
                                    {this.props.t("auction:button.process")}
                                </button>
                            }
                            {this.props.access.R && 
                                <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.toDetail(e, d.original.uuid)} >
                                    {this.props.t("auction:button.detail")}
                                </button>
                            }
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchPurchasingOrg()
        if(!this.props.user.has_roles.includes('BYR001') && this.props.user.has_roles.length>1){
            this.columns.splice(6,0, {
                Header: () => this.props.t("auction:label.created_by_name"),
                accessor: "created_by_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="created_by_name" onChange={(event) => this.onChanged(event)} value={this.state.params.created_by_name} />
                )
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    toDetail(e, value) {
        this.props.history.push('/auction/parameter-auction/' + value)
    }

    toProcess(e, value) {
        this.props.history.push('/auction/monitoring-buyyer/' + value)
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchAuctionList(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length)
                })
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
            })
            .then(() => {
                this.setState({ loading: false })
            })
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        this.setState({
            params: someProperty
        }, () => { this.req() });
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.params.start = (arr.page * state)
        someProperty.params.length = state;
        someProperty.defaultPageSize = state;
        someProperty.params.column = arr.sorted[0].id
        someProperty.params.dir = (arr.sorted[0].desc ? 'desc' : 'asc')

        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.asyncData();
        }
    }

    onResetFilter = (val) => {
        this.setState({
            params: val,
        }, () => this.asyncData());
    }

    openModals (item) {
        if(this._isMounted){
            this.setState({ modalOpen: true })
        }
    }

    tonggleCloseModal = () => {
        this.setState({ modalOpen: false })
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
                ? { start: 0, length: 10, purchasing_org_id: payload.id, select : payload.name }
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

    storeFreeAuction(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_store_free_auction: true },
                errors : []
            }));
            this.props.storeFreeAuction(payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_store_free_auction: false },
                        errors : []
                    }));
                    toastr.success(resp.data.status, resp.data.message);
                    this.props.history.push('/auction/parameter-auction/' + resp.data.data.uuid)
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_store_free_auction: false },
                        errors : resp.data.errors
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                {console.log(this.props.access)}
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction</li>
                    <li className="breadcrumb-item">List Auction</li>
                </ol>
                <h1 className="page-header">{t("auction:title")}</h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {t("auction:title")}
                    </PanelHeader>
                    <PanelBody loading={false}>
                        {this.props.access.C && 
                        <div className="row">
                            <div className="col-sm-12">
                                <button className="pull-right btn btn-sm btn-success" onClick={() => this.openModals()}>
                                    {t("auction:label.create-free-auction")}
                                </button>
                            </div>  
                        </div>
                        }
                        <div className="row m-t-10">
                            <div className="col-sm-12">
                                <ReactTable
                                    // loading={false}
                                    filterable 
                                    loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    PaginationComponent={ReactTablePagination}
                                    data={this.state.data}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                    className="-highlight"
                                    pages={this.state.pages}
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </div>
                        </div>
                    </PanelBody>
                </Panel>

                <Modal isOpen={this.state.modalOpen} className="modal-lg">
                    <ModalHeader toggle={() => this.tonggleCloseModal()}>{t("auction:label.create-free-parameter-auction")}</ModalHeader>
                    <div className="col-lg-12 m-t-10">
                       <Form
                            access={this.props.access}
                            loadings = {this.state.loadings}
                            options = {this.state.options}
                            errors = {this.state.errors}
                            tongleClose={() => this.tonggleCloseModal()}
                            fetchPurchasingGroup = {(payload) => this.fetchPurchasingGroup(payload)}
                            storeFreeAuction = {(payload) => this.storeFreeAuction(payload)}
                       />
                    </div>
                </Modal>
            </div>
        )
    }
}
const stateToProps = state => {
    return {
        user: state.auth.user.data,
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchAuctionList: (parameter) => dispatch(fetchAuctionList(parameter)),
        fetchPurchasingOrg: (parameter) => dispatch(fetchPurchasingOrg(parameter)),
        fetchPurchasingGroup: (parameter) => dispatch(fetchPurchasingGroup(parameter)),
        storeFreeAuction: (payload) => dispatch(storeFreeAuction(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(auction));
