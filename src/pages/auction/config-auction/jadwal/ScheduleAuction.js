import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { showDetailParameterAuction, storeScheduleItemAuction } from '../../../../store/actions/auction/auctionActions'
import SideAccordion from '../SideAccordion'
import Form from './sub/Form'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel'
import BlankSideAccordion from '../BlankSideAccordion'

class ScheduleAuction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: true,
            loadings :{
                loading_submit_schedule : false
            },
            errors : [],
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
                    this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeScheduleItemAuction(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_schedule: true },
                errors : []
            }));
            this.props.storeScheduleItemAuction(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_schedule: false },
                        errors : []
                    }));
                    toastr.success(resp.data.status, resp.data.message);
                    this.getUUID()                    
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_schedule: false },
                        errors : resp.data?.errors
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
                            actived = "schedule-auction"
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
                                state ={this.state}
                                storeScheduleItemAuction= {(payload)=>this.storeScheduleItemAuction(payload)}
                                toAuctionList= {()=>this.toAuctionList()}
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
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        showDetailParameterAuction: (id) => dispatch(showDetailParameterAuction(id)),
        storeScheduleItemAuction: (id, payload) => dispatch(storeScheduleItemAuction(id, payload))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ScheduleAuction));
