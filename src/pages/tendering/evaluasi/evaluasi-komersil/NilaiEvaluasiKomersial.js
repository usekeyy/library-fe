import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Form from './detail/Form';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { getEvaluationCommersialProcessVendor , storeEvaluasiCommersialProses } from '../../../../store/actions/tendering/evaluationCommercialActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import queryString from 'query-string'

class NilaiEvaluasiKomersial extends Component {
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
                { value: "lolos", label: "Pass" },
                { value: "tidak lolos", label: "Fail" },
            ],
            modalOpen: false,
            assingTo: [],
            configArr: [],
            evaluasiArr: [],
            headerArr: [],
            itemArr: [],
            values : queryString.parse(this.props.location.search),
            isMonitoring : this.props.location.pathname.split("/")[2] === 'monitoring-tender-buyer' ? true : false
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            this.getUUID()
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
            
            let params = this.state.values.pr_item_id ===""  ? {pr_item_id : 0 } : {pr_item_id :this.state.values.pr_item_id}
            this.setState({ loading: true });
            this.props.getEvaluationCommersialProcessVendor(this.props.match.params.id, this.props.match.params.uuid, params)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    // toastr.error("FAILED LOAD DATA", resp.data.message);
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
        this.props.history.push('/tendering/evaluation-commercial/detail/'+this.props.match.params.id)
    }

    storeEvaluasiCommersialProses(payload) {
        if (this._isMounted) {
            this.props.storeEvaluasiCommersialProses(this.props.match.params.id, payload)
            .then((resp) => {
                toastr.success("SUCCESS", resp.data.message);
                this.back()
            })
            .catch((resp) => {
                toastr.error("FAILED LOAD DATA", resp.data.message);
            });
        }
    }

    render() {
        const {t} = this.props
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
                        <Form
                            state={this.state}
                            vendor_id={this.props.match.params.uuid}
                            back={(e)=>this.back(e)}
                            pr_item_id = {this.state.values.pr_item_id==="" ? 0 : this.state.values.pr_item_id}
                            storeEvaluasiCommersialProses={(payload)=>this.storeEvaluasiCommersialProses(payload)}
                            isMonitoring={this.state.isMonitoring}
                        />
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
        getEvaluationCommersialProcessVendor: (id, vendor_id, params) => dispatch(getEvaluationCommersialProcessVendor(id, vendor_id, params)),
        storeEvaluasiCommersialProses: (id, payload) => dispatch(storeEvaluasiCommersialProses(id, payload)),

    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(NilaiEvaluasiKomersial))
