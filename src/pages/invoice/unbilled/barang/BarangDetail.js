import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { showUnbilled } from '../../../../store/actions/invoice/unbilledActions';
import { fetchPenalty } from '../../../../store/actions/invoice/grsaActions';
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../../containers/layout/sub/panel/panel';
import Detail from './detail/Detail';
import Penalty from './detail/Penalty';
import Preview from '../../../../components/modal/preview/Preview';

export class BarangDetail extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this._cursor = '';
        this.state = {
			role_vendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			// status_detail: this.props.location.state.status_detail,
            data: [],
            data_penalty: [],
            delete_penalty: [],
            data_user_vendor: [],
            param_modal: [],
            data_header: [],
            param_penalty: {
                penalty_type: '',
                penalty_type_param: [],
                amount: '',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            data_option: {
                m_penalty_type: [
                    {
                        value: 'potongan_mutu',
                        label: 'Potongan Mutu',
                    },
                    {
                        value: 'denda_keterlambatan',
                        label: 'Denda Keterlambatan',
                    },
                ],
                m_jenis_pembebanan: [
                    {
                        value: 'inventory',
                        label: 'Inventory',
                    },
                    {
                        value: 'non_inventory',
                        label: 'Non Inventory',
                    },
                ],
                m_acc_assgn_category: [],
                m_gl_account: [],
                m_asset: [],
                m_cost_center: [],
                m_wbs_element: [],
            },
            loadings: {
                loadingModal: false,
                acc_assgn_category: true,
                gl_account_id: true,
                asset_id: true,
                cost_center_id: true,
                wbe_element_id: true,
                loading_input_penalty: false,
                loading_list_penalty: false,
            },
            select_params: {
                start: 0,
                length: 10,
            },
            loading: true,
            errors: [],
            isError: false, 
            isConfirm: false,
            loadingSubmit: false,
            modalType:'',
            uuid:'',
            title:'',
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
        if (this._isMounted) {
            this.getUUID()
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleClose = () => {
        this.setState({ modalOpen:false, modalType:'', isError: false, errors: [], status_submit: false });
	}

    toggleDelete = (e, value, code) => {
        e.preventDefault();

        let title = ''
        switch (code) {
            case 'penalty':
                title = 'Delete Penalty, ' + this.props.t("common:delete.title-delete")
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, code_confirm: code, title: title })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'penalty':
                this.deletePenalty(this.state.uuid)
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
        return true
    }

    getUUID = async () => {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props
                .showUnbilled(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    datas.total_amount_item = 0;
                    datas.total_additional_cost = 0;
                    datas.total_penalty = 0;
                    this.setState({ loading: false, data: datas })
                })
                .catch((resp) => {
                    if (resp.data.message === "User does not have the right permissions.") {
                        this.props.history.push('/')
                        toastr.error(resp.data.message);
                    }
                    else {
                        this.setState({ loading: false });
                        toastr.error(resp.data.message);;
                    }
                });
        }
    }

    modalPenalty = (e, payload) => {
        payload.vendor_id = this.state.data.vendor_id
        payload.vendor_name = this.state.data.vendor_name
        payload.vendor_sap_number = this.state.data.vendor_sap_number
        payload.reference = this.state.data.reference

        this.props.fetchPenalty({goods_receipt_item_id: payload.id})
            .then((resp) => {
                let datas = resp.data.data;
                // console.log(datas)
                // return
                this.setState({
                    modalOpen:true,
                    data_header: payload,
                    param_modal: datas,
                    data_penalty: datas,
                    modalType:'penalty',
                });
                // this.setState({ loading: false, data: datas })
            })
            .catch((resp) => {
                if (resp.data.message === "User does not have the right permissions.") {
                    // this.props.history.push('/')
                    toastr.error(resp.data.message);
                }
                else {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                }
            });

        // e.preventDefault();
        // console.log(payload)
	}

    renderSwitchBody(param) {
        switch(param) {
          case 'penalty':
            return <Penalty
                        loadings={this.state.loadings}
						errors={this.state.errors}
                        modalType={this.state.tipe_modal}
                        data_header={this.state.data_header}
                        param_modal={this.state.param_modal}
                        data_option={this.state.data_option}
                        param_penalty={this.state.param_penalty}
                        data={this.state.data_penalty}
                        toggleOpenPreview={this.toggleOpenPreview}
                        toggleDelete={this.toggleDelete}
                        toggleClose={this.toggleClose}
						/>;
          default:
            return ;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
            case 'additional-cost':
                return <ModalHeader toggle={() => this.toggleClose()}>Additional Cost</ModalHeader>;
            case 'penalty':
                return <ModalHeader toggle={() => this.toggleClose()}>Penalty</ModalHeader>;
              default:
                return ;
        }
    }

	toggleOpenPreview = (e, file, url) => {
		e.preventDefault()
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

    render() {
        const {t} = this.props;
        return (
            <div>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                { !this.state.loading && 
                    <Detail
                        data={this.state.data}
                        loadingSubmit={this.state.loadingSubmit}
                        modalPenalty={this.modalPenalty}
                    />
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
                    confirmBtnBsStyle="danger"
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
        showUnbilled: (id) => dispatch(showUnbilled(id)),
        fetchPenalty: (param) => dispatch(fetchPenalty(param)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(BarangDetail));

