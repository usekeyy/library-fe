import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
// import ReactLoading from 'react-loading';

import { fetchVprApprovalDetailPenilaian, saveVprPenilaian, saveVprAttachment, fetchVprAttachment, deleteVprAttachment, approvePenilaianVPR } from '../../../../store/actions/master/vprActions';
import { fileUpload } from '../../../../store/actions/uploadActions';

// import { Modal, ModalHeader, ModalBody } from 'reactstrap';
// import ModalAttachment from './sub-detail-penilaian/ModalAttachment';
import FormApproval from './sub-detail-penilaian/FormApproval';

class DetailPenilaian extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.location.state)
        this._isMounted = false
        this.state = {
            data: [],
            dataAttachment : [],
            statusApproval: '',
            notes : '',
            score: 0,
            isApprover : false,
            detailId: this.props.location.pathname.split("/")[4],
            purchId: this.props.location.pathname.split("/")[5],
            paramId: this.props.location.pathname.split("/")[6],
            loadingSubmit: false,
            loading: false,
            loadingAttachment: false,
            uuidAttachment: '',
            isError: false,
            errors: {},
            modalOpen: false,
            selectModal : '',
            isConfirm : false
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.fetchDetail();
        this.fetchAttachment();
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    fetchDetail = async () => {
        this.setState({ loading: true })
        this.props.fetchVprApprovalDetailPenilaian(this.state.paramId)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
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
    

    toList = (e) => {
        this.props.history.push('/vendor/supplier-performance-report/detail/'+this.state.detailId+'/'+this.state.purchId)
    }

    savePayload = (e,status) => {
        if (status === "n" && this.state.notes === ""){
            toastr.error("Notes Wajib Diisi Jika Reject")
            this.setState({ modalOpen: false });
        }else{
            this.setState({ loading: true });
            this.props.approvePenilaianVPR(this.state.paramId, this.setPayloadApproval(status))
                .then((resp) => {
                    console.log(resp.data)
                    toastr.success(resp.data.message);
                    this.toList()
                })
                .catch((error) => {
                    console.log(error)
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ loading: false });
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    setPayloadApproval = (status) => {
        return {
            vendor_id : this.state.data.vendor_id,
            po_id : this.state.data.id,
            status : status,
            note : this.state.notes
        }
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

    approvePenilaian = (id, payload) => {
        this.setState({ loadingSubmit: true });
        this.props.approvePenilaianVPR(id, payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                console.log(resp)
            })
            .catch((error) => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    setPayloadAttachment = (payload) => {
        return {
            vendor_id : this.state.data.po[0].vendor_id,
            po_id : this.state.data.po[0].id,
            file : payload.file_name,
            description : payload.deskripsi
        }
    }

    deleteVprAttachment = (uuid) => {
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

    setValueState = (key, value) => {
        if (key === "score"){
            this.setState({score : value})
        }else if (key === "notes"){
            this.setState({notes : value })
        }
    }

    // renderModalHeader = (key) => {
    //     if(key === 'attachment'){
    //         return "Attachment"
    //     }else if (key === 'statusApproval'){
    //         return "Approval Penilaian Vendor"
    //     }
    // }

    // renderBodyHeader = (key) => {
    //     if(key === 'attachment'){
    //         return <ModalAttachment 
    //                     upload={this.props.fileUpload}
    //                     saveAttachment = {this.saveAttachment}
    //                     fetchAttachment = {this.fetchAttachment}
    //                     loading = {this.state.loadingAttachment}
    //                 />
    //     }else if(key === 'statusApproval'){
    //         return(
    //             <div>
    //                 <h5 className="m-b-20">Apakah Anda Yakin Ingin {this.state.statusApproval === "y" ? "Menyetujui" : (this.state.statusApproval === "n" ? "Menolak" :"")} Penilaian VPR ini?</h5>
    //                 <div className="pull-right">
    //                     {this.state.statusApproval === "y" && <button className="btn btn-success m-r-5" onClick={(e) => this.savePayload(e, "y")}>Submit</button>}
    //                     {this.state.statusApproval === "n" && <button className="btn btn-danger m-r-5" onClick={(e) => this.savePayload(e, "n")}>Tolak</button>}
    //                     <button className="btn btn-default" onClick={() => this.toggleClose()}>Batal</button>
    //                 </div>
    //             </div>
    //         )
    //     }
    // }

    setModalOpen = (key,data) => {
        this.setState({selectModal : key, modalOpen : true})
        if (key === 'statusApproval'){
            this.setState({statusApproval : data})
        }
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
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Detail VPR Penilaian Vendor</li>
                </ol>
                <h1 className="page-header">Detail VPR Penilaian Vendor</h1>
                    <FormApproval 
                        parentState={this.state}
                        parentProps={this.props}
                        save = {this.savePayload}
                        toList = {this.toList}
                        upload={this.props.fileUpload}
                        setValueState = {this.setValueState}
                        setModalOpen = {this.setModalOpen}
                        deleteVprAttachment = {this.toggleConfirm}
                        accessApproval = {false}
                    />

                    {/* {this.state.modalOpen && 
                        <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} size="lg">
                            <ModalHeader>
                                {this.renderModalHeader(this.state.selectModal)}
                            </ModalHeader>
                            <ModalBody>
                                {this.renderBodyHeader(this.state.selectModal)}
                            </ModalBody>
                        </Modal>
                    } */}

                    {/* {(this.state.isConfirm &&
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
                    )} */}
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
        fetchVprApprovalDetailPenilaian: (uuid) => dispatch(fetchVprApprovalDetailPenilaian(uuid)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        saveVprPenilaian: (payload) => dispatch(saveVprPenilaian(payload)),
        saveVprAttachment: (payload) => dispatch(saveVprAttachment(payload)),
        fetchVprAttachment: (uuid) => dispatch(fetchVprAttachment(uuid)),
        deleteVprAttachment: (id) => dispatch(deleteVprAttachment(id)),
        approvePenilaianVPR: (id, payload) => dispatch(approvePenilaianVPR(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailPenilaian));
