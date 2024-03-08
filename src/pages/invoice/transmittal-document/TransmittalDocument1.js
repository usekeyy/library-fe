import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
// import Unbilled from '../Unbilled';
import { fetchInvoice, fetchDocumentInvoice, submitTransmittal, generateTransmittal } from '../../../store/actions/invoice/invoiceActions';
import { mergeDocument }from '../../../store/actions/uploadActions';
import { fetchBank } from '../../../store/actions/master/bankActions';
import { fetchUsers } from '../../../store/actions/utility/usersActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import List from './sub/List';
import Item from './sub/Item';
// import Form from './invoice/Form';
// import DetailOA from './sub/DetailOA';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import FormChecklist from './sub/FormChecklist';
import Preview from '../../../components/modal/preview/Preview';

class TransmittalDocument1 extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.childList = React.createRef();
		this.childItem = React.createRef();
		this._data = []
		this.state = {
			data_list: [],
			data_invoice: {
				datas: [],
				items: [],
				items_selected: [],
				errors: [],
				loading: true,
				loadingButton: false
			},
			loadings: {
				button: false,
				buttonUpload: false,
				items: false,
				showItems: false,
				users: false,
				determination: false,
				loadingModal: false
			},
			loading: false,
			m_determination: [
				{ value: "eproc", label: "E-Proc" },
				{ value: "sap", label: "SAP" },
			],
			m_users: [],
			modalOpen: false,
			modalType: '',
			modalData : {
				data_header:[],
				items:[],
			},
			pathActive: props.location.name,
			uuid_temp: '',
            title:'',
			isCheckedAll: false,
            isConfirm: false,
			statusForm: false,
			color_confirm: '',
			data_lampiran_pendukung: [],
			param_invoice: {
				faktur_pajak_attachment: '',
				faktur_pajak_file: '',
				faktur_pajak_no: '',
				status: '',
				invoice_no: '',
				invoice_date: '',
				invoice_attachment: '',
				invoice_file: '',
				bank_transfer: [],
				ppn: [],
				pr_no: '',
				po_no: '',
				gr_no: '',
				keterangan: '',
			},
			param_lampiran_pendukung: {
				document_date: '',
				file: '',
				file_name: '',
			},
			param_option: {
				m_bank: [],
				m_ppn: [
					{
						value: 'y',
						label: 'Ya'
					},
					{
						value: 'n',
						label: 'Tidak'
					},
				],
			},
			loadings_invoice: {
				input_lampiran_pendukung: false,
				list_lampiran_pendukung: false,
				bank: false,
			},
			status_processing: false,
            preview: {
                modalOpen: false,
                title: '',
                src: '',
                loading: false,
            },
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	setLoading = (type) => {
		this.setState({ loading: type })
	}
	
	setListData = (data) => {
		this.setState({ data_list: data })
	}

	handleCheckAll = (e, isCheckedAll) => {
		const {data_list} = this.state;
		this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: [], items_selected: []}
		}));
		let arr = this.state.data_invoice.items;
		let arr_selected = this.state.data_invoice.items_selected;
		if(!isCheckedAll){
			// isCheckedAll = true
			// let status = false
			isCheckedAll = true
			if(data_list.length > 0){
				data_list.forEach(element => {
					if (!arr_selected.includes(element.uuid)) {
						arr_selected.push(element.uuid)
						arr.push(element)
					}
				});
			}

			this.setState(({ data_invoice }) => ({
				data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.eproc_number-b.eproc_number), items_selected: arr_selected},
				isCheckedAll: isCheckedAll
			}));
		} else {
			this.setState(({ data_invoice }) => ({
				data_invoice: { ...data_invoice, items: [], items_selected: []},
				isCheckedAll: false
			}));
		}
	}

	handleChecklist = (e, payload, uuid) => {
		console.log(payload)
		let arr = this.state.data_invoice.items;
		let arr_selected = this.state.data_invoice.items_selected;
		let arrTemp = []
		let arrTempSelected = []
		// if (payload.mvp_file === null) {
		// 	if (this.props.user.has_roles.includes("INVER2") && (payload.status === 'posted' || payload.status === 'rejected_hc_bendahara')) {
		// 		this.toggleDelete('', '', 'no-mvp')
		// 		return
		// 	}
		// }
		if(arr.includes(payload)){
			arr.forEach((element, i) => {
				if (element.uuid!==uuid) {
					arrTemp.push(element)
					arrTempSelected.push(element.uuid)
				} 
			});
			arr=arrTemp
			arr_selected=arrTempSelected
		} else {
			if (arr_selected.includes(uuid)){
				// return
				arr.forEach((item, key) => {
					if (item.uuid === uuid) {
						const index = arr.indexOf(key);
						arr.splice(index, 1)
						arr_selected.splice(index, 1)
					}
				});
			} else {
				// return
				arr.push(payload);
				arr_selected.push(uuid)
			}
		}

		this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.eproc_number-b.eproc_number), items_selected: arr_selected},
		}), () => { 
			setTimeout(() => {
				this.setState(({ data_invoice }) => ({ 
					data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.eproc_number-b.eproc_number), items_selected: arr_selected},
				}));
			})
		});
	}

	setItems = (data) => {
		const arr = [];
		data.forEach((item, key) => {
			if(this.state.data_invoice.items_selected.includes(item.uuid)){
				arr.push(item)
			}
		})
		this.setState(({ loadings, data_invoice }) => ({ 
			data_invoice: { ...data_invoice, errors: [], datas: [], items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.eproc_number-b.eproc_number) },
			loadings: { ...loadings, buttonUpload: false, button: false, showItems: false } 
		}));
	}

	submitTransmittal = () => {
		let items = this.state.data_invoice.items
		this.setState({ status_processing: false })
		if (items.some(d => (d.status === 'approved_1'|| d.status === 'rejected_hc') && (d.status === 'approved_2'|| d.status === 'rejected_hc_bendahara') )) {
			this.setState({ status_processing: true }, () => {
				setTimeout(() => {
					this.setState({ status_processing: true })
				}, 3000);
			})
			return
		}
		let arr_invoice_id = []
		items.forEach(element => {
			arr_invoice_id.push(element.id)
		});
		// console.log(items[0].status)
		// return
		let param = {
			invoice_id: arr_invoice_id,
			status: (items[0].status === 'approved_1'|| items[0].status === 'rejected_hc') ? 'sent' :
			 		(items[0].status === 'posted'|| items[0].status === 'rejected_hc_bendahara') ? 'sent_bendahara' : ''
		}
        this.props.submitTransmittal(param)
            .then((resp) => {
				// window.location.reload();
				toastr.success(resp.data.message);
				this.setState({ modalOpen: true, modalType : "submit" })
            })
            .catch(error => {
                this.setState({loadingSubmit: false, isConfirm: false})
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    this.setState({ isError: true, errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

	toggleClose = () => {
		this.setState({ modalOpen: false });
	}

	modalChecklist = (payload, data_param) => {
        this.props.fetchDocumentInvoice(payload)
            .then((resp) => {
                let datas = resp.data.data
                let arr = []
                if (datas.some(d => d.tipe === "mvp")) {
                    let index = datas.findIndex(d => d.tipe === "mvp");
                    arr.push(datas[index])
                    datas.forEach(element => {
                        if (element.tipe !== 'mvp') {
                            arr.push(element)
                        }
                    });
                }
                else {
                    arr = datas
                }
				this.setState(({ modalData }) => ({
					modalData: { ...modalData, items: arr, data_header: data_param },
					modalOpen:true,
				}));
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
            })
	}

	toggleOpenPreview = (e, file, url) => {
		this.setState(({ preview }) => ({
			preview: { ...preview, title: file, src: url, loading: true, modalOpen: true },
		}), () => {
            setTimeout(() => {
                this.setState(({ preview }) => ({
                    preview: { ...preview, loading: false },
                }));
            }, 100)
        });
	}

	toggleClosePreview = () => {
		this.setState(({ preview }) => ({
			preview: { ...preview, title: '', src: '', modalOpen: false },
		}));
	}

    renderSwitchBody(param) {
        switch(param) {
			case 'submit':
            	return (
					<div>
						<ModalBody>
							<p>
							Transmittal Dokumen Invoice telah berhasil disubmit. Pastikan telah mencetak rekap transmittal terlebih dahulu untuk proses verifikasi selanjutnya.
							</p>
						</ModalBody>
						<ModalFooter>
							<button className="btn btn-success" type="submit" onClick={(e) => this.generateTransmittal(e, "now")}>Print Now</button>
							<button className="btn btn-white" onClick={(e) => this.generateTransmittal(e,"later")}>Print Later</button>
						</ModalFooter>
					</div>);
			default:
				return <FormChecklist
					disabledForm={true}
                    toggleOpenPreview={this.toggleOpenPreview}
					user={this.props.user}
					modalData={this.state.modalData}
					mergeDocument={this.mergeDocument}
					toggleClose={this.toggleClose}
				/>
        }
    }

	renderSwitchHeader(param) {
        switch(param) {
          case 'submit':
            return <ModalHeader toggle={() => this.toggleClose()}>Print</ModalHeader>;
          default:
            return <ModalHeader toggle={() => this.toggleClose()}>Checklist Hardcopy</ModalHeader>;
        }
    }

    redirectDetail = (url) => {
		const win = window.open(url, "_blank")
		win.focus();
        // this.props.history.push(url)
    }


    toggleDelete = (e, value, code) => {
        let title = ''
        switch (code) {
            case 'no-mvp':
                title = 'Upload lampiran MVP terlebih dahulu'
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid_temp: uuid, code_confirm: code, color_confirm: "danger", title: title })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'lampiran-pendukung':
                this.deleteLampiranPendukung(this.state.uuid_temp)
                break;
            default:
                this.setState({ isConfirm: false, uuid_temp: '' });
                break;
        }
        return true
    }

    fetchBank = (newValue) => {
        this.setState(({ loadings_invoice }) => ({
            loadings_invoice: { ...loadings_invoice, bank: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchBank(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.name};
                });
                this.setState(({ loadings_invoice, param_option }) => ({
                    loadings_invoice: { ...loadings_invoice, bank: false },
                    param_option: { ...param_option, m_bank: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings_invoice }) => ({
                    loadings_invoice: { ...loadings_invoice, bank: false },
                }));
                toastr.error(resp.data.message);
            });
    };
    

	setOptionLampiran = async (payload, type) => {
        let param_lampiran_pendukung = this.state.param_lampiran_pendukung
        switch(type) {
            case 'file':
                param_lampiran_pendukung.file = payload;
                break;
            case 'file-name':
                param_lampiran_pendukung.file_name = payload;
                break;
            case 'document-date':
                param_lampiran_pendukung.document_date = payload;
                break;
            default:
                break;
        }
        this.setState({ param_lampiran_pendukung: param_lampiran_pendukung })
    }

	addLampiranPendukung = () => {
        let param_lampiran_pendukung = this.state.param_lampiran_pendukung
		// console.log(param_lampiran_pendukung)
        let data_lampiran_pendukung = this.state.data_lampiran_pendukung
        data_lampiran_pendukung.push(param_lampiran_pendukung)

        this.setState(({ param_lampiran_pendukung, loadings_invoice }) => ({
            param_lampiran_pendukung: { ...param_lampiran_pendukung,
                file: '',
                file_name: '',
                documetn_date: '',
            },
            data_lampiran_pendukung: data_lampiran_pendukung,
            loadings_invoice: { ...loadings_invoice, input_lampiran_pendukung: true },
        }), () => {
            setTimeout(() => {
                this.setState(({ loadings_invoice }) => ({
                    loadings_invoice: { ...loadings_invoice, input_lampiran_pendukung: false },
                }))
            }, 10)
        });
	}

    deleteLampiranPendukung = (key) => {
		console.log(key)
        let data_lampiran_pendukung = this.state.data_lampiran_pendukung
        delete data_lampiran_pendukung[key];

        this.setState(({ loadings_invoice }) => ({
            loadings_invoice: { ...loadings_invoice, list_lampiran_pendukung: true },
            isConfirm: false,
        }), () => {
            let new_data = []
            data_lampiran_pendukung.map(function(d, i) {
                return new_data.push(d)
            })
            setTimeout(() => {
                this.setState(({ loadings_invoice }) => ({
                    loadings_invoice: { ...loadings_invoice, list_lampiran_pendukung: false },
                    data_lampiran_pendukung: new_data,
                }))
            })
        })
    }

    generateTransmittal = (e, type) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		let items = this.state.data_invoice.items
		if (items.length === 0) {
			return
		}
		let invoice_id = []
		items.forEach(element => {
			invoice_id.push(element.id)
		});
		let text_invoice_id = invoice_id.join('_')
        this.props.generateTransmittal({invoice_id: invoice_id})
			.then((resp) => {
			// this.setState(({}) => ({loadingDownload : false}));
				if (type === 'now'){
					const url = window.URL.createObjectURL(new Blob([resp.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', `Transmittal_Invoice_${text_invoice_id}_${this.props.user.name}.pdf`); //or any other extension
					document.body.appendChild(link);
					link.click();
					toastr.success("Success Print");
				}
				this.setState({modalOpen: false, modalType : ''});
				window.location.reload();
			})
			.catch((resp) => {
				this.setState({loadingDownload : false});
				toastr.error("Failed Generate Transmittal Invoice");
				this.setState({modalOpen: false, modalType : ''});
				window.location.reload();
			});
	}

    mergeDocument = () => {
		let items = this.state.modalData.items
		let arr_file = []
		// let arr_file = ["temp/ZxtsPp7yBBLcvpJNnL7AAyXtlqOnI1a7nOUiCEIf.pdf",
        // "temp/ZYJjMMbxJWsGZRbk6kPk7QuTlVFCZcziPL0TCpYl.pdf"]
		items.forEach(element => {
			arr_file.push(`${element.dir.substring(1)}/${element.file}`)
		});
		let params = {
			files: arr_file,
		}
        this.props.mergeDocument(params)
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data], {type : 'application/pdf'}));
                this.setState(({ preview }) => ({
                    preview: { ...preview, title: `Dokumen Invoice ${this.state.modalData.data_header.number}(merged)`, src: url, loading: true, modalOpen: true },
                }), () => {
                    setTimeout(() => {
                        this.setState(({ preview }) => ({
                            preview: { ...preview, loading: false },
                        }));
                    }, 100)
                });

                // let pdfWindow = window.open("")
                // pdfWindow.document.write(
                //     "<iframe width='100%' height='100%' src='" + url + "'></iframe>"
                // )
            })
            .catch((resp) => {
				toastr.error(`Failed Download Dokumen Invoice ${this.state.modalData.data_header.number}(merged)`);
            });
    };
    
	render(){
		const {t} = this.props;
		// console.log(this.state.data_invoice.items_tender_selected);
		return (
			<div>
				{this.state.statusForm === false &&
					<div>
						<ol className="breadcrumb float-xl-right">
							<li className="breadcrumb-item">Home</li>
							<li className="breadcrumb-item">Invoice</li>
							<li className="breadcrumb-item active">Transmittal Send Document</li>
						</ol>
						<h1 className="page-header">Transmittal Send Document</h1>
						<List
							ref={this.childList}
							user={this.props.user}
							modalChecklist={this.modalChecklist}
							redirectDetail={this.redirectDetail}
							handleChecklist={this.handleChecklist}
							handleCheckAll={this.handleCheckAll}
							setLoading={this.setLoading}
							parentProps={this.props}
							fetchInvoice={this.props.fetchInvoice}
							parentState={this.state}
							// syncPRPrice={this.syncPRPrice}
							setListData={this.setListData}
							setItems={this.setItems}
							modals={this.modals}
						/>
						<Item
							ref={this.childItem}
							user={this.props.user}
							modalChecklist={this.modalChecklist}
							redirectDetail={this.redirectDetail}
							parentProps={this.props}
							parentState={this.state}
							submitTransmittal={this.submitTransmittal}
							generateTransmittal={this.generateTransmittal}
							modals={this.modals}
							t={this.props.t}
						/>
					</div>
				}
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    {this.renderSwitchHeader(this.state.modalType)}
                    {this.state.loadings.loadingModal ? (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    ) : this.renderSwitchBody(this.state.modalType)}
                </Modal>
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={t("common:delete.yes")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle={this.state.color_confirm}
                    cancelBtnBsStyle="default"
                    title={this.state.title}
                    onConfirm={() => this.toggleSweetAlert(this.state.code_confirm)}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
				{!this.state.preview.loading &&
                    <Preview
                        open={this.state.preview.modalOpen}
                        title={this.state.preview.title}
                        src={this.state.preview.src}
                        loading={this.state.preview.loading}
                        toggle={this.toggleClosePreview}
                    />
				}
			</div>
		);
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
		fetchInvoice: (params) => dispatch(fetchInvoice(params)),
		fetchDocumentInvoice: (id) => dispatch(fetchDocumentInvoice(id)),
		submitTransmittal: (payload) => dispatch(submitTransmittal(payload)),
		generateTransmittal: (params) => dispatch(generateTransmittal(params)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchUsers: (params) => dispatch(fetchUsers(params)),
		fetchBank: (params) => dispatch(fetchBank(params)),
		mergeDocument: (payload) => dispatch(mergeDocument(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TransmittalDocument1));