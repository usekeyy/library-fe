import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
// import { Modal, ModalHeader } from 'reactstrap';
// import ReactLoading from 'react-loading';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { fileUpload } from '../../../store/actions/uploadActions';
import {fetchPenawaranTerkirim} from '../../../store/actions/tendering/quotationActions';
// import Registrasi from './modal/Registrasi'
import { toastr } from 'react-redux-toastr'

class PenawaranTerkirim extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			data: [],
			uuid: '',
			quotation: {
				header: {},
				errors: []
			},
			loading: false,
			loadings: {
				modal: false,
				button: false,
			},
			modalOpen: false
		}
		
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	setLoading = (type, data) => {
		this.setState(({ quotation }) => ({ loading: type, data: data }));
	}

	toDetail = (uuid) => {
		// this.props.history.push(`/task-vendor/undangan-tender/registration/${uuid}`)
	}

	handleAction = (type, data, uuid) => {
		switch (type) {
			case 'registrasi':	
				this.setState({ modalOpen: true })
				this.setState(({ quotation }) => ({ 
					uuid: uuid,
					modalOpen: true,
					quotation: { ...quotation, header: data },
				}));
				break;
			case 'process':	
				this.props.history.push(`/task-vendor/penawaran-terkirim/detail/${uuid}`)
				break;
			case 'update':	
				// this.props.history.push(`/task-vendor/quotation/update/${uuid}`)
				this.props.history.push(`/task-vendor/penawaran-terkirim/update/${uuid}`)
				break;
			default:
				break;
		}
	}

	toggleCloseTerm = () => {
		this.setState({ modalOpen: false, uuid: '' })
	}

	submitRegisterVendorQuotation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
			this.props.submitRegisterVendorQuotation(this.state.uuid, params)
			.then((resp) => {
				toastr.success(resp.data.status, resp.data.message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings,  button: false }, modalOpen: false }), 
				() => this.child.current.fetchData());
				// this.props.history.push(`/task-vendor/quotation`)
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings,  button: false, errors: resp.data.errors } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}
	
  render(){
		const {t} = this.props;
		console.log(this.state.quotation.header);
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Penawaran Terkirim</li>
				</ol>
				<h1 className="page-header">Penawaran Terkirim </h1>
				<Panel loading={false}>
					<PanelHeader>Penawaran Terkirim Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						<Table
							t={t}
							ref={this.child}
							user_uuid={this.props.user.uuid}
							fetchQuotation={this.props.fetchPenawaranTerkirim}
							setLoading={this.setLoading}
							toDetail={this.toDetail}
							handleAction={this.handleAction}
						/>
						{/* <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleCloseTerm()} className="modal-lg">
						<ModalHeader toggle={() => this.toggleCloseTerm()}>Persyaratan {this.state.modalType} </ModalHeader>
							{this.state.loadings.modal && (
								<center>
								<br />
								<ReactLoading type="cylon" color="#0f9e3e" />
								<br />
								</center>
							)}
								{this.state.loadings.modal === false && (
								<Registrasi
									parentState={this.state}
									parentProps={this.props}
									toggleClose={this.toggleCloseTerm}
									upload={this.props.fileUpload}
									submitRegisterVendorQuotation={this.submitRegisterVendorQuotation}
								/>
							)}
						</Modal> */}
						{/*  */}
					</PanelBody>
				</Panel>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchPenawaranTerkirim: (uuid,params) => dispatch(fetchPenawaranTerkirim(uuid,params)),
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		// submitRegisterVendorQuotation: (id, payload) => dispatch(submitRegisterVendorQuotation(id, payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PenawaranTerkirim));