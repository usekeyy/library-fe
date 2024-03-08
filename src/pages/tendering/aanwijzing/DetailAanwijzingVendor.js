import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { toastr } from 'react-redux-toastr'
import { deleteAanwijzingUpload , storeNoteAanwijzing , showAanwijzingDetail, showAanwijzingQuestion, closeAanwijzing, downloadBeritaAcaraAanwijzing , storeUploadAanwijzing , getAanwijzinglistUpload} from '../../../store/actions/tendering/aanwijzingActions'
import Headervendor from './detail/HeaderVendor'
import TabVendor from './detail/TabVendor'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import NoteAanwijzing from './detail/NoteAanwijzing'
import { Modal , ModalHeader} from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import Upload from './detail/Upload'
import { fileUpload } from '../../../store/actions/uploadActions'
import SweetAlert from 'react-bootstrap-sweetalert'
import DocumentAanwijzing from './detail/DocumentAanwijzing'



class DetailAanwijzingVendor extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            data: [],
            header: [],
            rks: [],
            summary:[],
            questions: [],
            daftarHadir:[],
            doc_tender:[],
            notes: "",
            vendors: [],
            vendorSelection: [],
            detail: [],
            attactment: [],
            loadings: {
                loading_vendor: false,
                loadingModal: false,
                loading_store_note:false,
                loading_close_aanwijzing : false,
                loading_preview_berita_acara : false,
                loading_upload_aanwijzing_manual : false
            },
            loading: false,
            errors: [],
            loadingSubmit: false,
            checkAll: false,
            optionsFilterBy: [
                { value: "sosheader", label: "SoS Header" },
                { value: "sositem", label: "SoS Item" },
            ],
            modalOpen: false,
            modalData: {
                items: [],
                item_potext: [],
                account_assignment: [],
                serviceline: []
            },
            modalUpload : false,
            listUpload :[],
            confirmUpload : false,
            list_uuid_selected : ""
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.props.match.params.id !== undefined) {
                this.getUUID()
                this.getAanwijzinglistUpload()
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showAanwijzingDetail(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loading: false, doc_tender: datas.doc_tender, rks: datas.rks, daftarHadir:datas.daftarHadir, header: datas.header ,summary:datas.summary}));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getAanwijzinglistUpload() {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props.getAanwijzinglistUpload(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ listUpload : datas}));
                })
                .catch((resp) => {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    closeAanwijzing() {
        if (this._isMounted) {
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_close_aanwijzing: true},
                errors : []
            }))
            let message = {
                status_aanwijzing:"close"
            }
            this.props.closeAanwijzing(this.props.match.params.id,message)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_close_aanwijzing: false},
                }))
                toastr.success("Succes", " Close Aanwijzing Success")
                this.props.history.push('/tendering/aanwijzing-user')
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_close_aanwijzing: false},
                    errors : resp.data.errors
                }))
            });
        }
    }

    storeNoteAanwijzing(payload) {
        if (this._isMounted) {
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_store_note: true},
                errors : []
            }))
            this.props.storeNoteAanwijzing(this.state.header.uuid,payload)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_store_note: false},
                }))
                toastr.success(resp.data.status, resp.data.message)
            })
            .catch((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_store_note: false},
                    errors : resp.data.errors
                }))
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    downloadBeritaAcaraAanwijzing = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
        this.setState(({loadings}) => ({ 
            loadings : {...loadings , loading_preview_berita_acara: true},
            errors : []
        }))
		this.props.downloadBeritaAcaraAanwijzing(this.props.match.params.id)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_preview_berita_acara: false},
                errors : []
            }))
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Aanwijzing_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success", resp.data.message)
		})
		.catch((resp) => {
      		// this.setState(({}) => ({loadingDownload : false}));
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_preview_berita_acara: false}
            }))
			toastr.error("Failed Download Berita Acara");
			// this.setState({loading: false});
		});
    }
    
    tonggleCloseModalUpload = () => {
        this.setState({ modalUpload : false })
    }

    modalUploadOpen = () => {
        this.setState({ modalUpload: true })
    }

    storeUploadAanwijzing(payload) {
        if (this._isMounted) {
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_store_upload: true},
                errors : []
            }))
            this.props.storeUploadAanwijzing(this.props.match.params.id,payload)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_store_upload: false},
                    modalUpload : false
                }))
                this.getAanwijzinglistUpload()
                toastr.success(resp.data.status, resp.data.message)
            })
            .catch((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_store_upload: false},
                    errors : resp.data.errors
                }))
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    deleteAanwijzingUpload(payload) {
        if (this._isMounted) {
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_delete_upload: true},
                errors : [],
                confirmUpload : false
            }))
            this.props.deleteAanwijzingUpload(payload)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_delete_upload: false},
                    confirmUpload : false
                }))
                this.getAanwijzinglistUpload()
                toastr.success(resp.data.status, resp.data.message)
            })
            .catch((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_delete_upload: false},
                    errors : resp.data.errors
                }))
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    confirmAlert (payload) {
        this.setState({confirmUpload : true , list_uuid_selected : payload})
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deleteAanwijzingUpload(this.state.list_uuid_selected)
                break;
            case 'cancel':
                this.setState({ confirmUpload: false, list_uuid_selected: ''});
                break;
            default:
                this.setState({ confirmUpload: false, list_uuid_selected: ''});
                break;
        }
    }



    render() {
        const {t} = this.props
        return (
            <div>
                
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                {!this.state.loading &&
                    <div>
                        <Headervendor
                            proposal_tender_no={this.state.header.proposal_tender_no}
                            title={this.state.header.title}
                            start_date={(this.state.header.start_date===null) ? "" : this.state.header.start_date + " " + this.state.header.start_time}
                            created_by_name={this.state.header.created_by_name}
                            status_aanwijzing={this.state.header.status_aanwijzing}
                            end_date={(this.state.header.end_date===null) ? "" :this.state.header.end_date + " " + this.state.header.end_time}
                            closeAanwijzing={(payload) => this.closeAanwijzing(payload)}
                            user = {this.props.user}
                            loadings={this.state.loadings}
                            downloadBeritaAcaraAanwijzing = {this.downloadBeritaAcaraAanwijzing}
                            note_aanwijzing = {this.state.header.note_aanwijzing}
                            modalUpload = {this.modalUploadOpen}
                        />
                        {!this.props.user.has_roles.includes("VNDR01") && 
                            <NoteAanwijzing 
                                status_aanwijzing = {this.state.header.status_aanwijzing}
                                end_date={(this.state.header.end_date===null) ? "" :this.state.header.end_date + " " + this.state.header.end_time}
                                note_aanwijzing = {this.state.header.note_aanwijzing}
                                storeNoteAanwijzing = {(payload) => this.storeNoteAanwijzing(payload)}
                                loadings = {this.state.loadings.loading_store_note}
                                errors={this.state.errors}
                            />
                        }

                        <DocumentAanwijzing 
                            data={this.state.doc_tender}
                        />
                        <TabVendor
                            uuid={this.props.match.params.id}
                            status_aanwijzing={this.state.header.status_aanwijzing}
                            end_date={(this.state.header.end_date===null) ? "" :this.state.header.end_date + " " + this.state.header.end_time}
                            rks={this.state.rks}
                            listUpload  = {this.state.listUpload}
                            daftarHadir={this.state.daftarHadir}
                            summary={this.state.summary.length===0 ? "" : this.state.summary[0].summary}
                            showAanwijzingQuestion={this.props.showAanwijzingQuestion}
                            confirmAlert = {(payload) => this.confirmAlert(payload)}
                        />
                    </div>
                }

                {/* Modal Monitoring Tender */}
                <Modal isOpen={this.state.modalUpload} toggle={() => this.tonggleCloseModalUpload()} className="modal-lg">
                    <ModalHeader toggle={() => this.tonggleCloseModalUpload()}>Detail Item</ModalHeader>
                    <ModalBody>
                        <Upload 
                         upload={this.props.fileUpload}
                         storeUploadAanwijzing = {(payload) => this.storeUploadAanwijzing(payload)}
                         loadings = {this.state.loadings}
                         />
                    </ModalBody>
                </Modal>
                {/* End Modal Monitoring Tender */}

                {(this.state.confirmUpload &&
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
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        showAanwijzingDetail: (id) => dispatch(showAanwijzingDetail(id)),
        showAanwijzingQuestion: (uuid_aanwijzing,id) => dispatch(showAanwijzingQuestion(uuid_aanwijzing,id)),
        closeAanwijzing: (id, payload) => dispatch(closeAanwijzing(id, payload)),
        storeUploadAanwijzing: (id, payload) => dispatch(storeUploadAanwijzing(id, payload)),
        storeNoteAanwijzing: (id, payload) => dispatch(storeNoteAanwijzing(id, payload)),
        downloadBeritaAcaraAanwijzing: (id) => dispatch(downloadBeritaAcaraAanwijzing(id)),
        getAanwijzinglistUpload: (id) => dispatch(getAanwijzinglistUpload(id)),
        deleteAanwijzingUpload :(id) => dispatch(deleteAanwijzingUpload(id))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailAanwijzingVendor));