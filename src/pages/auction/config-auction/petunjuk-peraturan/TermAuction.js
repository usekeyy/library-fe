import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { showDetailParameterAuction , publishAuction } from '../../../../store/actions/auction/auctionActions'
import SideAccordion from '../SideAccordion'
import Form from './sub/Form'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel'
import SweetAlert from 'react-bootstrap-sweetalert';
import BlankSideAccordion from '../BlankSideAccordion'


class TermAuction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: true,
            loadings : {
                loading_publish_auction : false
            },
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
            },
            isConfirmPublish : false,
            isConfirmSaveDraft : false,
            publish_data : []

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

    publishAuction (payload) {
        if(this._isMounted){
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_publish_auction: true },
            }));
            this.props.publishAuction(this.props.match.params.id, payload)
            .then((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_publish_auction: false },
                }));
                toastr.success(resp.data.status, resp.data.message);
                this.getUUID()
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_publish_auction: false },
                }));
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    toAuctionList = () => {
        this.props.history.push('/auction')
    }

    toggleConfirmPublish = (data) => {
        if (this._isMounted) {
            this.setState({ isConfirmPublish: true, publish_data : data })
        }
    }

    toggleSweetAlertPublish(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmPublish: false });
                    this.publishAuction(this.state.publish_data)
                    break;
                case 'cancel':
                    this.setState({ isConfirmPublish: false, publish_data: []});
                    break;
                default:
                    break;
            }
        }
    }

    toggleConfirmSaveDraft = (data) => {
        if (this._isMounted) {
            this.setState({ isConfirmSaveDraft: true, publish_data : data })
        }
    }

    toggleSweetAlertisConfirmSaveDraft(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmSaveDraft: false });
                    this.publishAuction(this.state.publish_data)
                    break;
                case 'cancel':
                    this.setState({ isConfirmSaveDraft: false, publish_data: []});
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
                    <li className="breadcrumb-item">Parameter Auction</li>
                </ol>
                <h1 className="page-header">Auction Configuration</h1>
                <div className="row">
                    <div className="col-md-2">
                    {!this.state.loading &&
                        <SideAccordion
                            uuid={this.props.match.params.id}
                            header= {this.state.data}
                            actived = "term-auction"
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
                                state ={this.state}
                                access={this.props.access}
                                publishAuction = { (payload) => this.publishAuction (payload) }
                                toAuctionList = { () => this.toAuctionList () }
                                toggleConfirmPublish = { (payload) => this.toggleConfirmPublish (payload) }
                                toggleConfirmSaveDraft = { (payload) => this.toggleConfirmSaveDraft (payload) }
                            />
                        </div>
                    }
                </div>

                {(this.state.isConfirmPublish &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.publish-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.publish-title")}
                        onConfirm={() => this.toggleSweetAlertPublish('confirm')}
                        onCancel={() => this.toggleSweetAlertPublish('cancel')}
                    >
                    </SweetAlert>
                )}

                {(this.state.isConfirmSaveDraft &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.save-draft-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.save-draft-title")}
                        onConfirm={() => this.toggleSweetAlertisConfirmSaveDraft('confirm')}
                        onCancel={() => this.toggleSweetAlertisConfirmSaveDraft('cancel')}
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
        publishAuction: (id, payload) => dispatch(publishAuction(id, payload))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TermAuction));
