import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { showDetailParameterAuction, historyItemsAuction } from '../../../../store/actions/auction/auctionActions'
import SideAccordion from '../SideAccordion'
import Form from './sub/Form'
import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelFooter, PanelHeader } from '../../../../containers/layout/sub/panel/panel'
import { Modal, ModalHeader } from 'reactstrap'
import { formatNumber } from '../../../../helpers/formatNumber'
import { formatDate } from '../../../../helpers/formatDate'
import BlankSideAccordion from '../BlankSideAccordion'


class HistoryAuction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: true,
            loadings: {
                loading_data_modal_history: false
            },
            tipeHistory : "",
            options: {
                simulate: [
                    { value: "simulasi", label: "Simulate" },
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
            },
            modalHistory: false,
            dataModal: []

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
                    this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    tonggleCloseModalItem = () => {
        this.setState({ modalHistory: false })
    }

    openModalHistory(item) {
        if (this._isMounted) {
            this.setState({
                modalHistory: true,
                tipeHistory : this.state.data?.history[item].description
            })
            this.historyItemsAuction(this.state.data?.history[item].uuid_history)
        }
    }

    historyItemsAuction(id) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_modal_history: true },
            }));
            this.props.historyItemsAuction(id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_modal_history: false },
                        dataModal : datas,
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_modal_history: false },
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
        let rows = this.state.dataModal.map((dt,i) => {
            return (
                <tr key={i}>
                    <td>{dt.column}</td>
                    <td align="right">{this.state.tipeHistory==="Perubahan jadwal" ? formatDate(dt.before, true) : formatNumber(dt.before,2)}</td>
                    <td align="right">{this.state.tipeHistory==="Perubahan jadwal" ? formatDate(dt.after, true) : formatNumber(dt.after,2)}</td>
                </tr>
            )
        });

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
                            actived="history-auction"
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
                                access={this.props.access}
                                options={this.state.options}
                                state={this.state}
                                openModalHistory={(payload) => this.openModalHistory(payload)}
                                tonggleCloseModalItem={() => this.tonggleCloseModalItem()}
                                toAuctionList={() => this.toAuctionList()}
                            />
                        </div>
                    }
                </div>

                <Modal isOpen={this.state.modalHistory} toggle={() => this.tonggleCloseModalItem()} className="modal-lg">
                    <ModalHeader toggle={() => this.tonggleCloseModalItem()}>Detail History</ModalHeader>
                    <div className="col-lg-12 m-t-10 m-b-10">
                        <Panel>
                            <PanelHeader>
                            {this.state.tipeHistory}
                            </PanelHeader>
                            <PanelBody>
                                {this.state.loadings.loading_data_modal_history && (
                                    <center>
                                    <br />
                                    <ReactLoading type="cylon" color="#0f9e3e" />
                                    <br />
                                    </center>
                                )}
                                {!this.state.loadings.loading_data_modal_history && this.state.tipeHistory==="Perubahan jadwal" &&
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Column</th>
                                                        <th>Value</th>
                                                        <th>Change Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                   {rows}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                }
                                {!this.state.loadings.loading_data_modal_history && this.state.tipeHistory==="Perubahan detail item" &&
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Column</th>
                                                        <th>Value</th>
                                                        <th>Change Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* <tr>
                                                        <td>Unit Price Tertinggi</td>
                                                        <td align="right">{formatNumber(this.state.dataModal.before, 2)}</td>
                                                        <td align="right">{formatNumber(this.state.dataModal.after, 2)}</td>
                                                    </tr> */}
                                                    {rows}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                }
                            </PanelBody>
                            <PanelFooter>
                                <button className="btn btn-sm btn-white pull-right" type="button" onClick={() => this.tonggleCloseModalItem()}>
                                    Back
                                </button>
                            </PanelFooter>
                        </Panel>
                    </div>
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
        historyItemsAuction: (id) => dispatch(historyItemsAuction(id))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(HistoryAuction));
