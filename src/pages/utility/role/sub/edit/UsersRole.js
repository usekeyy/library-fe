import React, {Component} from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Button } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import {RowEmpty} from '../../../../../components/tableoptions/TableOptions';

const animatedComponents = makeAnimated();
class UsersRole extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}

  state = {
		idUsers: '',
		m_users: [],
		loading: false,
		users_selected: [],
		sendDt: {
			users: []
		},
		isConfirm: false
	}

	toggleConfirm = (e, value) => {
		this.setState({isConfirm: true, idUsers: value})
	}

	toggleSweetAlert(name) {
		switch(name) {
			case 'confirm':
				this.setState({ isConfirm: false });
				this.handleDelete(this.state.idUsers)
				break;
			case 'cancel':
				this.setState({ isConfirm: false, idUsers: '' });
				break;
			default:
				break;
		}
	}

	handleSave = () => {
		let arr = [];
		let sendDt = {...this.state.sendDt}
		if(this.state.users_selected !== null){
			this.state.users_selected.forEach(item => {
				arr.push(item.value)
			})
		}
		sendDt.users = arr;
		this.setState({sendDt}, () => this.props.save(this.props.uuid, this.state.sendDt))
	}

	handleDelete = (id) => {
		let arr = [];
		let sendDt = {...this.state.sendDt}
		arr.push(id)
		sendDt.users = arr;
		this.setState({sendDt}, () => this.props.delete(this.props.uuid, this.state.sendDt))
	}

	handleSelect = (value) => {
		this.setState({users_selected: value})
	}

  render(){
			let rows;
			let options;
			let {details} = this.props;
			let {loadings} = this.props;
			
			if(typeof details.users !== 'undefined'){
				if(details.users.length > 0){
					rows = details.users.map((dt, i) => (
									<tr key={i}>
											<td>{dt.name}</td>
											<td>
												<Button color="danger" size="xs" value={dt.id} onClick={(e) => this.toggleConfirm(e, dt.id)} ><span className="fa fa-trash"></span></Button>
											</td>
									</tr>
					));
				} else {
					rows = (<RowEmpty colSpan='2'>Tidak ada data</RowEmpty>);
				}
				options = this.props.m_users.map((dt) => {
					return { value: dt.id, label: dt.name };
				})
			} else {
				rows = (<RowEmpty colSpan='2'>Data not found</RowEmpty>);
			}
			return (
				<div>
					<PanelBody loading={false}>
						<div className="form-group">
							<label>Users <span className="text-danger">*</span></label>
							<div>
								<Select
									components={animatedComponents}
									closeMenuOnSelect={true}
									placeholder={loadings.options_users ? 'Sedang Memuat ..' : 'Pilih'}
									isLoading={loadings.options_users}
									className="basic-multi-select"
									classNamePrefix="select"
									onChange={this.handleSelect}
									name="users"
									isMulti
									options={options}
									rules={{ required: true }}
									isClearable
								/>
							</div>
						</div>
						<div className="form-group">         
							<button type="button" className="btn btn-success btn-sm" onClick={() => this.handleSave()} title="Save" disabled={loadings.userRoleBtn}>
								Simpan 
								{loadings.userRoleBtn && <i className="fas fa-spinner fa-pulse"></i>}
							</button>                   
						</div>
						<div className="table-responsive">
								<table className="table table-bordered table-striped table-sm">
										<thead>
												<tr>
													<th>Name</th>
													<th>Action</th>
												</tr>
										</thead>
										<tbody>{rows}</tbody>
								</table>
							</div>
						<div className="form-group">
							<button type="button" className="btn btn-danger m-r-5 btn-sm" onClick={(e) => this.props.goBack(e)} title="Kembali" disabled={loadings.userRoleBtn}>
								Kembali 
								{loadings.userRoleBtn && <i className="fas fa-spinner fa-pulse"></i>}
							</button>
						</div>
					</PanelBody>
					{(this.state.isConfirm &&
						<SweetAlert 
							danger
							showCancel
							confirmBtnText="Continue"
							confirmBtnBsStyle="primary"
							cancelBtnBsStyle="default"
							title="Are you sure?"
							onConfirm={() => this.toggleSweetAlert('confirm')}
							onCancel={() => this.toggleSweetAlert('cancel')}
						>
							Delete This Data?
						</SweetAlert>
					)}
				</div>
			);
		}
}

export default UsersRole;