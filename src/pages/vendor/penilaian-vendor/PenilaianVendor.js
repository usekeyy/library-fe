import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
// import ReactLoading from 'react-loading';

import { fetchVprDetailPenilaian, saveVprPenilaian, saveVprAttachment, fetchVprAttachment, deleteVprAttachment, fetchVprTemplate } from '../../../store/actions/master/vprActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import Form from './sub/Form';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ModalAttachment from './sub/ModalAttachment';

class PenilaianVendor extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            dataAttachment : [],
            score: 0,
            tempScore : [],
            paramId: this.props.location.pathname.split("/")[3],
            loadingSubmit: false,
            loading: false,
            loadingAttachment: false,
            uuidAttachment: '',
            isError: false,
            errors: {},
            modalOpen: false,
            selectModal : '',
            isConfirm : false,
            isStatusCreate : false,
            dataTemplate : [],
            dataDefaultTemplate : {}
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.fetchDetail();
        this.fetchAttachment();
        this.fetchTemplate();
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    fetchDetail = async (uuidTemplate) => {
        let uuidTemp = this.state.paramId
        if (uuidTemplate){
            uuidTemp = uuidTemplate
        }
        this.setState({ loading: true })
        this.props.fetchVprDetailPenilaian(uuidTemp, this.state.paramId)
            .then((resp) => {
                if (!(resp.data.data?.po && resp.data.data?.po?.status_text === "Open")){
                    this.setInitialtempScore(resp.data.data)
                }
                if (resp.data.data.po){
                    this.setState({isStatusCreate : resp.data.data.po.status_text, score : resp.data.data.po.score})
                }else{
                    this.setState({isStatusCreate : resp.data.data.status_text, score : resp.data.data.score})
                }
                if(resp.data.data?.subcategory){
                    let datax = resp.data.data.subcategory.sort((a,b) => (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0))
                    resp.data.data.subcategory = datax;
                }
                this.setState({
                    data: resp.data.data,
                    dataDefaultTemplate : resp.data.data?.template ? resp.data.data?.template : {},
                    loading : false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    fetchAttachment = async () => {
        this.setState({ loadingAttachment: true })
        this.props.fetchVprAttachment(this.state.paramId)
            .then((resp) => {
                this.setState({
                    dataAttachment: resp.data.data,
                    loadingAttachment : false
                })
            })
            .catch((resp) => {
                this.setState({ loadingAttachment: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    fetchTemplate = async () => {
        this.setState({ loadings: true })
        this.props.fetchVprTemplate()
            .then((resp) => {
                this.setState({
                    dataTemplate: resp.data.data,
                    loading: false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }
    

    toList = (e) => {
        // e.preventDefault()
        this.props.history.push('/vendor/penilaian-vendor/')
    }

    savePayload = (payload) => {
        // console.log(payload)
        this.setState({ loadingSubmit: true });
        this.props.saveVprPenilaian(payload)
            .then((resp) => {
                console.log(resp.data)
                toastr.success(resp.data.message);
                this.toList()
            })
            .catch((error) => {
                console.log(error)
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ loadingSubmit: false });
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
        
    }

    saveAttachment = (payload) => {
        // console.log(this.setPayloadAttachment(payload))
        this.setState({ loadingAttachment: true });
        this.props.saveVprAttachment(this.setPayloadAttachment(payload))
            .then((resp) => {
                console.log(resp.data)
                toastr.success(resp.data.message);
                this.setState({modalOpen : false, selectModal : ""})
                this.fetchAttachment()
            })
            .catch((error) => {
                console.log(error)
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ loadingAttachment: false });
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
        
    }

    setPayloadAttachment = (payload) => {
        return {
            vendor_id : (this.state.data?.po?.vendor_id || this.state?.data?.vendor_id),
            po_id : (this.state.data?.po?.id || this.state?.data?.id),
            file : payload.file_name,
            description : payload.deskripsi
        }
    }

    deleteVprAttachment = (uuid) => {
        // e.preventDefault()
        this.props.deleteVprAttachment(uuid)
            .then((resp) => {
                this.setState({ isConfirm: false });
                toastr.success(resp.data.message);
                this.fetchAttachment()
            })
            .catch((error) => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
                this.setState({ isConfirm: false });
            })
    }

    setInitialtempScore = (data) => {
        const result = [];
        data.subcategory.map((item_sub) => {
            item_sub.value.map((item_sub_sub) => {
                if (item_sub_sub.main_value === "1"){
                    result.push({
                        id : item_sub.subcategory_id.toString(),
                        value : item_sub_sub.value
                    })
                }
            })
        })
        // data.category.map((item) => {
        //     item.subcategory.map((item_sub) => {
        //         item_sub.vpr_config.map((item_sub_sub) => {
        //             if (item_sub_sub.main_value === "1"){
        //                 result.push({
        //                     id : item_sub.subcategory_id.toString(),
        //                     value : item_sub_sub.value
        //                 })
        //             }
        //         })
        //     })
        // });
        this.setState({tempScore : result})
    }

    setValueState = (key, value) => {
        if (key === "score"){
            this.setState({score : value})
        }
    }

    renderModalHeader = (key) => {
        if(key === 'attachment'){
            return "Attachment"
        }
    }

    renderBodyHeader = (key) => {
        if(key === 'attachment'){
            return <ModalAttachment 
                        upload={this.props.fileUpload}
                        saveAttachment = {this.saveAttachment}
                        fetchAttachment = {this.fetchAttachment}
                        loading = {this.state.loadingAttachment}
                    />
        }
    }

    setModalOpen = (key,e) => {
        if (key === 'attachment'){
            e.preventDefault()
        }
        this.setState({selectModal : key, modalOpen : true})
    }

    toggleClose = () => {
        this.setState({modalOpen : false})
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deleteVprAttachment(this.state.uuidAttachment)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuidAttachment: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuidAttachment: '' });
                break;
        }
    }

    toggleConfirm = (e,uuid) => {
        console.log("clicked")
        e.preventDefault()
        this.setState({ isConfirm: true, uuidAttachment: uuid })
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">VPR Penilaian Vendor</li>
                </ol>
                <h1 className="page-header">VPR Penilaian Vendor</h1>
                    <Form 
                        parentState={this.state}
                        parentProps={this.props}
                        save = {this.savePayload}
                        toList = {this.toList}
                        upload={this.props.fileUpload}
                        setValueState = {this.setValueState}
                        setModalOpen = {this.setModalOpen}
                        deleteVprAttachment = {this.toggleConfirm}
                        accessCreate = {this.props.access.C}
                        fetchDetail = {this.fetchDetail}
                    />

                    {this.state.modalOpen && 
                        <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} size="lg">
                            <ModalHeader>
                                {this.renderModalHeader(this.state.selectModal)}
                            </ModalHeader>
                            <ModalBody>
                                {this.renderBodyHeader(this.state.selectModal)}
                            </ModalBody>
                        </Modal>
                    }

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
        access: state.sidebarDt.access,
        user: state.auth.user.data
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchVprDetailPenilaian: (uuidTemplate, uuidPo) => dispatch(fetchVprDetailPenilaian(uuidTemplate, uuidPo)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        saveVprPenilaian: (payload) => dispatch(saveVprPenilaian(payload)),
        saveVprAttachment: (payload) => dispatch(saveVprAttachment(payload)),
        fetchVprAttachment: (uuid) => dispatch(fetchVprAttachment(uuid)),
        deleteVprAttachment: (id) => dispatch(deleteVprAttachment(id)),
        fetchVprTemplate: (params) => dispatch(fetchVprTemplate(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(PenilaianVendor));
