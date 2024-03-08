import React, { Component } from 'react'
import Form from './detail/Form'
import {showEvaluationTeknis, storeEvaluasiTeknisKlarifikasi , getDetailTaskVendorEvaluasiTeknis} from '../../../../store/actions/tendering/evaluationTechnicalActions'
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../store/actions/uploadActions';

class FormKlarifikasiVendor extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false    
        this.state = {
            data :[],
            klarifikasiData :[],
            loadings :{
                loading_submit_klasifikasi_btn : false,
                loading_submit_klasifikasi_form : false
            },
            loadingPage :false
            
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        this.getUUID()
        this.getKlarifikasiProposalTender()
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
            this.setState({ loadingPage: true });
            this.props.showEvaluationTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loadingPage: false })
                })
                .catch((resp) => {
                    this.setState({ loadingPage: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getKlarifikasiProposalTender() {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings, loading_submit_klasifikasi_form : true}
            }))
            this.props.getDetailTaskVendorEvaluasiTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_form : false},
                        klarifikasiData : datas
                    }))
                })
                .catch((resp) => {
                    // this.setState({ loadingPage: false });
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_form : false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeEvaluasiTeknisKlarifikasi(payload) {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings, loading_submit_klasifikasi_btn : true}
            }))
            this.props.storeEvaluasiTeknisKlarifikasi({
                uuid: this.props.match.params.id,
                vendor_id: this.props.user.username,
                note : payload.note,
                file : payload.file,
            })
                .then((resp) => {
                    toastr.success(resp.data.status, resp.data.message);
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_btn : false}
                    }))
                    this.getKlarifikasiProposalTender()
                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_btn : false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);

                });
        }
    }

    back() {
        this.props.history.push('/task-vendor/klarifikasi-evaluasi')
    }
   
    render() {
        return (
            <div>
                 {this.state.loadingPage &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loadingPage &&
                <Form
                    data={this.state.data}
                    loadings={this.state.loadings}
                    klarifikasiData={this.state.klarifikasiData}
                    upload={this.props.fileUpload}
                    back={()=>this.back()}
                    storeEvaluasiTeknisKlarifikasi={(payload) => this.storeEvaluasiTeknisKlarifikasi(payload)}
                /> 
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
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        showEvaluationTeknis: (id) => dispatch(showEvaluationTeknis(id)),
        getDetailTaskVendorEvaluasiTeknis: (id) => dispatch(getDetailTaskVendorEvaluasiTeknis(id)),
        storeEvaluasiTeknisKlarifikasi: (payload) => dispatch(storeEvaluasiTeknisKlarifikasi(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation() (FormKlarifikasiVendor))
