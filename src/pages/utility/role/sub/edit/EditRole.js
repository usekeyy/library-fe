import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

import { fetchRolePermissions, saveRolePermissions, showRole, saveUserRole, deleteUserRole } from '../../../../../store/actions/utility/roleActions';
import { fetchUsers } from '../../../../../store/actions/utility/usersActions';
import { sidebarAction } from '../../../../../store/actions/sidebarActions';
import ReactLoading from 'react-loading';
import UsersRole from './UsersRole';

class EditRole extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.arr = [];
	}

  state = {
		data: [],
		loadings: {
			editRole: false,
			userRole: false,
			editRoleBtn: false,
			userRoleBtn: false,
			options_users: false
		},
		collapse: [],
		loading: false,
		isSelectAll: false,
		sendDt: [],
		m_users: [],
		detailRole: {},
		uuid: null
  }

  componentDidMount = () => {
		this._isMounted = true;
		let uri = this.props.location.pathname.split("/")[4];
		if(this._isMounted){
			if(uri !== ''){
				this.setState({uuid: uri}, () => {
					// console.log(this.state.uuid);
					this.fetchDataRole()
					this.fetchDataUsers()
					this.fetchDetailRoles()
				})
			} else {
				this.handleBack()
			}
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	asyncDataRole = async (params) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, editRole: true } }));
		this.props.fetchRolePermissions(params)
		.then((resp) => {
			if(this._isMounted){
				this.setState(({ loadings, data }) => ({ 
					loadings: { ...loadings, editRole: false },
					data: resp.data.data
				}));
				resp.data.data.modules.forEach((module, key) => {
					module.features.forEach((feature, i) => {
						feature.permissions.forEach((per, ii) => {
							this.handleChecklist(null, 'load', per.feature_id, feature.module_id, per.id, per.selected)
						})
					})
				});
			}
		})
		.catch((err) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, editRole: false } }));
			// console.log(err);
			let message = (typeof err !== 'undefined') ? err.data.message : 'Something Wrong';
			toastr.error('Oops', message);
			this._isMounted = false;
			this.handleBack()
		});
	}

	asyncDetailRole = async (id) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, userRole: true } }));
		this.props.showRole(id)
		.then((resp) => {
			if(this._isMounted){
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, userRole: false },
					detailRole: resp.data.data
				}));
			}
		})
		.catch((err) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, userRole: false } }));
			// console.log(err);
			let message = (typeof err !== 'undefined') ? err.data.message : 'Something Wrong';
			toastr.error('Oops', message);
			this._isMounted = false;
			this.handleBack()
		});
	}

	asyncDataUsers = async () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, options_users: true } }));
		this.props.fetchUsers()
		.then((resp) => {
			if(this._isMounted){
				this.setState(({ loadings, m_users }) => ({ 
					loadings: { ...loadings, options_users: false},
					m_users: resp.data.data
				}));
			}
		})
		.catch((err) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, options_users: false } }));
			// console.log(err);
			let message = (typeof err !== 'undefined') ? err.data.message : 'Something Wrong';
			toastr.error('Oops', message);
			this._isMounted = false;
			this.handleBack()
		});
	}

	fetchDataRole = () => {
		if(this._isMounted){
			this.asyncDataRole(this.state.uuid)
		}
	}

	fetchDataUsers = () => {
		if(this._isMounted){
			this.asyncDataUsers()
		}
	}

	fetchDetailRoles = () => {
		if(this._isMounted){
			this.asyncDetailRole(this.state.uuid)
		}
	}

	handleSelectFeature = (event) => {
    let fruites = this.state.fruites
    fruites.forEach(fruite => fruite.isChecked = event.target.checked) 
    this.setState({fruites: fruites})
	}
	
	handleChecklist = (event, type, feature_id, module_id, value, isChecked) => {
		let arr_permission = [];
		let arr_features = [];
		let setData = this.state.data
		let dataVal = (type === 'load') ? value : event.target.value;
		let ifCheked = (isChecked === 'y') ? true : false;
		let dataChecked = (type === 'load') ? ifCheked : event.target.checked;
		
		setData.modules.forEach((module, key) => {
			module.features.forEach((feature, i) => {
				feature.permissions.forEach((per, ii) => {
					if (parseInt(per.id) === parseInt(dataVal)) { 
						per.selected = (dataChecked) ? 'y' : 'n';
					}
				})
				feature.permissions.forEach((perm, iii) => {
					if(perm.feature_id === feature_id && perm.selected === 'y'){
						arr_permission.push(perm)
					}
				})
				if (feature.id === feature_id) { 
					feature.selected = (arr_permission.length > 0) ? 'y' : 'n';
				}
			})
			module.features.forEach((featurez, iii) => {
				if(featurez.module_id === module_id && featurez.selected === 'y'){
					arr_features.push(featurez)
				}
			})
			if (module.id === module_id) { 
				module.selected = (arr_features.length > 0) ? 'y' : 'n';
			}
		});
		this.setState({data: setData})
	}
	
	handleChecklistFeature = (event, module_id) => {
		let arr_features = [];
		let setData = this.state.data
		setData.modules.forEach((module, key) => {
			module.features.forEach((feature, i) => {
				if (feature.id === event.target.value) { 
					feature.selected = (event.target.checked) ? 'y' : 'n';
				}
				feature.permissions.forEach((per, ii) => {
					if(per.feature_id === event.target.value){
						per.selected = (event.target.checked) ? 'y' : 'n';
					}
				})
			})
			module.features.forEach((featurez, iii) => {
				if(featurez.module_id === module_id && featurez.selected === 'y'){
					arr_features.push(featurez)
				}
			})
			if (module.id === module_id) { 
				module.selected = (arr_features.length > 0) ? 'y' : 'n';
			}
		});
		this.setState({data: setData})
	}

	handleChecklistModule = (event) => {
		let setData = this.state.data
		setData.modules.forEach((module, key) => {
			if(module.id === event.target.value){
				module.selected = (event.target.checked) ? 'y' : 'n';
				module.features.forEach((feature, i) => {
					feature.selected = (event.target.checked) ? 'y' : 'n';
					feature.permissions.forEach((per, ii) => {
						per.selected = (event.target.checked) ? 'y' : 'n';
					})
				})
			}
		});
		this.setState({data: setData})
	}

	handleSelectAll = (event) => {
		let arr_moduless = [];
		let setData = this.state.data
		let checked = event.target.checked;
		this.setState({isSelectAll: checked})
		setData.modules.forEach((module, key) => {
			module.selected = (event.target.checked) ? 'y' : 'n';
			module.features.forEach((feature, i) => {
				feature.selected = (event.target.checked) ? 'y' : 'n';
				feature.permissions.forEach((per, ii) => {
					per.selected = (event.target.checked) ? 'y' : 'n';
				})
			})
		});
		setData.modules.forEach((modulez, ii) => {
			if(modulez.selected === 'y'){
				arr_moduless.push(modulez)
			}
		});
		if(arr_moduless.length > 0){
			this.setState({isSelectAll: true})
		} else {
			this.setState({isSelectAll: false})
		}
		this.setState({data: setData})
	}

	handleSave = (e) => {
		e.preventDefault();
		if(this._isMounted){
			let arr = [];
			this.state.data.modules.forEach((module, key) => {
				module.features.forEach((feature, i) => {
					feature.permissions.forEach((per, ii) => {
						if(per.selected === 'y'){
							arr.push(per.id)
						}
					})
				})
			});
			this.setState({sendDt: arr}, () => { 
				var obj = {
					permissions: this.state.sendDt
				}
				if(arr.length > 0){
					this.setState(({ loadings }) => ({ loadings: { ...loadings, editRoleBtn: true } }));
					this.props.saveRolePermissions(this.state.uuid, obj)
					.then(resp => {
						this.props.sidebarAction();
						this.setState(({ loadings }) => ({ loadings: { ...loadings, editRoleBtn: false } }), () => this.fetchDataRole());
						toastr.success("Berhasil Menyimpan Data");
						// this.handleBack()
					})
					.catch(resp => {
						this.setState(({ loadings }) => ({ loadings: { ...loadings, editRoleBtn: false } }));
						toastr.error(resp.data.status, resp.data.message);
					})
				} else {
					toastr.warning("Data Kosong !")
				}
			});
		}
	}

	handleSaveUsersRole = (id, payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, userRoleBtn: true } }));
		this.props.saveUserRole(id, payload)
		.then(resp => {
			this.props.sidebarAction();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, userRoleBtn: false } }), () => this.fetchDetailRoles());
			toastr.success("Berhasil Menyimpan Data");
		})
		.catch(resp => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, userRoleBtn: false } }));
			toastr.error(resp.data.status, resp.data.message);
		})
	}

	handleDeleteUsersRole = (id, payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, userRoleBtn: true } }));
		this.props.deleteUserRole(id, payload)
		.then(resp => {
			this.props.sidebarAction();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, userRoleBtn: false } }), () => this.fetchDetailRoles());
			toastr.success("Berhasil Menghapus Data");
		})
		.catch(errs => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, userRoleBtn: false } }));
			if(typeof errs !== 'undefined'){
				const {message} = (typeof errs !== 'undefined') ? errs.data : 'Error';
				toastr.error(message);
			} else {;
				toastr.error("Gagal Menyimpan Data");
			}
		})
	}

	handleBack = () => {
		this.props.history.push('/user/role')
	}

	toggle(key) {
		var index = this.arr.indexOf(key);
		if(index > -1){
			this.arr.splice(index, 1);
		} else {
			this.arr.push(key)
		}
		this.setState({collapse: this.arr});
  }

  render(){
			let showTbody;

			if(typeof this.state.data.modules !== 'undefined'){
				showTbody = this.state.data.modules.map((module, key) => (
					<React.Fragment key={key}>
						<tr className="bg-aqua-transparent-2" key={key}>
							<td colSpan="2">
								{!this.state.collapse.includes(key) && <i className="fa fa-plus p-l-2 m-r-10 set-pointer" onClick={() => this.toggle(key)}></i>}
								{this.state.collapse.includes(key) && <i className="fa fa-minus p-l-2 m-r-10 set-pointer" onClick={() => this.toggle(key)}></i>}
								<input type="checkbox" value={module.id} onChange={(e) => this.handleChecklistModule(e)} checked={module.selected === 'y'} />
								<b className="p-l-5"> {module.name.toUpperCase()}</b>
							</td>
						</tr>
					{module.features.map((feature, i) => (
						this.state.collapse.includes(key) && <tr key={i}>
							<td className="nowrap p-l-40">
								<input type="checkbox" value={feature.id} onChange={(e) => this.handleChecklistFeature(e, feature.module_id)} checked={feature.selected === 'y'} />
								<i className="p-l-5"> {feature.name}</i>                             
							</td>
							<td>
								{feature.permissions.map((per, ii) => (
									<div key={ii} className="form-check form-check-inline">
										<div className="form-group">
											<input type="checkbox" onChange={(e) => this.handleChecklist(e, 'click', per.feature_id, feature.module_id, per.id, per.selected )} value={per.id} checked={per.selected === 'y'} />
											<span> {per.action_name}</span>                                                        
										</div>
									</div>
								))}
							</td>
						</tr>
					))}
					</React.Fragment>
				));
			}
			return (
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item">Home</li>
						<li className="breadcrumb-item">User Management</li>
						<li className="breadcrumb-item active">Edit Role</li>
					</ol>
					<h1 className="page-header">Edit Role {this.state.detailRole.code} - {this.state.detailRole.name} </h1>
					<Panel loading={false}>
						<PanelHeader>Table Edit Role</PanelHeader>
						{this.state.loadings.editRole && (
							<center>
								<br/>
								<ReactLoading type="cylon" color="#0f9e3e" />
								<br/>
							</center>
						)}
						{this.state.loadings.editRole === false && (
						<PanelBody loading={false}>
							<table className="table table-bordered">
								<thead>
									<tr>
										<th width="200px">Permission</th>
										<th className="text-center">Aksi</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td colSpan="2">
											{/* <div className="form-group row">
												<label className="col-sm-1 col-form-label"><small>SELECT ALL</small></label>
												<div className="switcher">
													<input type="checkbox" name="select_all" id="select_all" defaultChecked={this.state.isSelectAll} onChange={this.handleSelectAll} value="select_all" />
													<label htmlFor="select_all"></label>
												</div>
											</div> */}
											{/* <input type="checkbox" value="select_all" checked={this.state.isSelectAll} onChange={this.handleSelectAll} />
											<b><i> SELECT ALL </i></b> */}
										</td>
									</tr>
									{showTbody}
								</tbody>
							</table>
							<div className="form-group">              
								<button type="button" className="btn btn-success btn-sm" onClick={(e) => this.handleSave(e)} title="Save" disabled={this.state.loadings.editRoleBtn}>
									Simpan 
									{this.state.loadings.editRoleBtn && <i className="fas fa-spinner fa-pulse"></i>}
								</button>                   
							</div>
						</PanelBody>
						)}
					</Panel>
						<Panel loading={false}>
						<PanelHeader>Tambah Users Role</PanelHeader>
						{this.state.loadings.userRole && (
							<center>
								<br/>
								<ReactLoading type="cylon" color="#0f9e3e" />
								<br/>
							</center>
						)}
						{this.state.loadings.userRole === false && 
							<UsersRole
								loadings={this.state.loadings}
								goBack={this.handleBack}
								uuid={this.state.uuid}
								save={this.handleSaveUsersRole}
								delete={this.handleDeleteUsersRole}
								m_users={this.state.m_users}
								details={this.state.detailRole}
						/>}
					</Panel>
				</div>
			);
		}
}

// const stateToProps = state => {
// 	return {

// 	}
// }

const dispatchToProps = dispatch => {
	return {
		fetchRolePermissions: (params) => dispatch(fetchRolePermissions(params)),
		saveRolePermissions: (id, payload) => dispatch(saveRolePermissions(id, payload)),
		sidebarAction: () => dispatch(sidebarAction()),
		fetchUsers: () => dispatch(fetchUsers()),
		showRole: (id) => dispatch(showRole(id)),
		saveUserRole: (id, payload) => dispatch(saveUserRole(id, payload)),
		deleteUserRole: (id, payload) => dispatch(deleteUserRole(id, payload)),
	}
}

export default connect(null, dispatchToProps)(EditRole);