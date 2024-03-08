import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import ReactLoading from 'react-loading';
import Header from './sub/Header'
import PeringkatHistory from '../sub/Rangking'
import HistoryAuction from './sub/HistoryAuction'
import PesertaAuctionHistory from './sub/PesertaAuctionHistory'
import { getHistryVendorAuction , getDocumentHistoryVendorAuction } from '../../../../store/actions/auction/auctionActions';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';

class HistoryVendorBuyyer extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data : [],
            loadings : {
                loading_page : false,
                loading_download_history_auction : false,
                loading_rangking_panel:true
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUUID()
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
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_page: true, loading_rangking_panel: true },
            }));
            this.props.getHistryVendorAuction(this.props.match.params.id, {vendor_id : this.props.match.params.vendor_id})
                .then((resp) => {
                    let datas = resp.data.data;
                    // datas.isFreeze = datas.is_freeze
                    // datas.freezeTimes = 5000
                    // datas.date = ((datas.isFreeze===null || datas.isFreeze==="n") && datas.is_vendor_aggrement!==null) ?  moment(new Date()).add(datas.freeze, 'minutes') : new Date() 
                    // if(datas.is_vendor_aggrement==="n"){
                    //     toastr.warning("Rejected Aggrement" ,"Anda Tidak Menyetujui Persyaratan Auction")
                    //     this.props.history.push('/task-vendor/auctions')
                    // }
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_page: false, loading_rangking_panel: false },
                        data : datas
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_page: false, loading_rangking_panel : false},
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    downloadHistoryVendorAuction = (payload) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_download_history_auction: true },
        }));
        this.props.getDocumentHistoryVendorAuction(this.props.match.params.id, {"vendor_id" : payload})
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${this.state.data?.header.auction_number}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_download_history_auction: false },
                }));
            })
            .catch(error => {
                // this.setState(({ loadings }) => ({
                //     loadings: { ...loadings, loading_download_berita_acara: false },
                // }));
                toastr.error("Download Failed");
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_download_history_auction: false },
                }));
            })
    }

    render() {
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction Configuration</li>
                    <li className="breadcrumb-item">Parameter Auction</li>
                </ol>
                <h1 className="page-header">Auction Configuration</h1>
                {this.state.loadings.loading_page && (
                    <div className="row">
                        <div className="col-sm-12">
                        <Panel>
                            <PanelBody>
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                            </PanelBody>
                        </Panel>
                        </div>
                    </div>
                )}
                {!this.state.loadings.loading_page &&
                <div className="row">
                    <div className="col-sm-12">
                    <Header
                        data={this.state.data?.header}
                    />
                    </div>
                    <div className="col-sm-12">
                    <PesertaAuctionHistory
                        data={this.state.data?.peserta}
                        header={this.state.data.header}
                        downloadHistoryVendorAuction= { (payload) => this.downloadHistoryVendorAuction(payload)}
                    />
                    </div>
                    <div className="col-sm-12">
                    <HistoryAuction
                        data={this.state.data?.detail_item}
                        header={this.state.data.header}
                    />
                    </div>
                    <div className="col-sm-12">
                    <PeringkatHistory
                        data={this.state.data?.ranking}
                        header={this.state.data.header}
                        loadings={this.state.loadings}
                    />
                    </div>
                </div>
                }
                
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
        getHistryVendorAuction : (id, payload) =>dispatch(getHistryVendorAuction(id,payload)),
        getDocumentHistoryVendorAuction : (id, payload) =>dispatch(getDocumentHistoryVendorAuction(id,payload))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(HistoryVendorBuyyer));
