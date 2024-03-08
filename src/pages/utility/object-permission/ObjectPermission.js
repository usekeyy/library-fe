import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';

import { fetchObjectPermission, saveObjectPermission } from '../../../store/actions/utility/objectPermissionActions';
import ReactLoading from 'react-loading';

class ObjectPermission extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.arr = [];
	}

  state = {
		data: [],
		dataTemp: [],
		loadings: {
			editObjPermission: false,
			userObjPermission: false,
			editObjPermissionBtn: false,
			userObjPermissionBtn: false,
			ObjPermissionInput: []
		},
		collapse: [],
		loading: false,
		isSelectAll: false,
		sendDt: [],
		detailObjPermission: {},
		uuid: null
  }

  componentDidMount = () => {
		this._isMounted = true;
		let uri = this.props.location.pathname.split("/")[4];
		if(this._isMounted){
			if(uri !== ''){
				this.setState({uuid: uri}, () => {
					// console.log(this.state.uuid);
					this.fetchData()
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

	asyncData = async (params) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, editObjPermission: true } }));
		this.props.fetchObjectPermission(params)
		.then((resp) => {
			if(this._isMounted){
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, editObjPermission: false },
					data: resp.data.data
				}), () => {
					if(this.state.data > 0){
						toastr.error('No data found');
					} 
				});
			}
		})
		.catch((err) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, editObjPermission: false } }));
			let message = (typeof err.data !== 'undefined') ? err.data.message : 'Something Wrong';
			toastr.error('Oops', message);
			this._isMounted = false;
			this.handleBack()
		});
	}

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.state.uuid)
		}
	}

	handleSelectFeature = (event) => {
    let fruites = this.state.fruites
    fruites.forEach(fruite => fruite.isChecked = event.target.checked) 
    this.setState({fruites: fruites})
	}

	handleSave = (e) => {
		e.preventDefault();
		if(this._isMounted){
			let arr = [];
			this.state.dataTemp.modules.forEach((module, key) => {
				module.features.forEach((feature, i) => {
					feature.permissions.forEach((per, ii) => {
						per.objects.forEach((obj, objKey) => {
							arr.push({
								permission_object_id: obj.permission_object_id,
								value: obj.value						
							})
						})
					})
				})
			});
			this.setState({sendDt: arr}, () => { 
				if(arr.length > 0){
					this.setState(({ loadings }) => ({ loadings: { ...loadings, editObjPermissionBtn: true } }));
					this.props.saveObjectPermission(this.state.uuid, this.state.sendDt)
					.then(resp => {
						this.setState(({ loadings }) => ({ loadings: { ...loadings, editObjPermissionBtn: false } }), () => this.fetchData());
						toastr.success("Berhasil Menyimpan Data");
						// this.handleBack()
					})
					.catch(err => {
						this.setState(({ loadings }) => ({ loadings: { ...loadings, editObjPermissionBtn: false } }));
						let message = (typeof err !== 'undefined') ? err.data.message : 'Something Wrong';
						toastr.error('', message);
					})
				} else {
					toastr.warning("Data Kosong !")
				}
			});
		}
	}

	hanleBlur = (e, objId) => {
		e.preventDefault();
		if(this._isMounted){
			// if(e.target.value !== ''){
				this.setState(({ loadings }) => ({ loadings: { ...loadings, ObjPermissionInput: [objId], editObjPermissionBtn: true } }));
				this.props.saveObjectPermission(this.state.uuid, {
					permission_object_id: objId,
					value: e.target.value			
				})
				.then(resp => {
					this.setState(({ loadings }) => ({ loadings: { ...loadings, ObjPermissionInput: [], editObjPermissionBtn: false } }), () => this.fetchData());
					toastr.success("Berhasil Menyimpan Data");
				})
				.catch(err => {
					this.setState(({ loadings }) => ({ loadings: { ...loadings, ObjPermissionInput: [], editObjPermissionBtn: false } }));
					let message = (typeof err !== 'undefined') ? err.data.message : 'Something Wrong';
					toastr.error('', message);
				})
			// } else {
			// 	toastr.warning("Data Kosong !")
			// }
		}
	}

	handleBack = () => {
		this.props.history.push('/user/user')
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
	
	handleChange = (e, obj_id) => {
		let arr = this.state.data;
		arr.modules.forEach((module, key) => {
			module.features.forEach((feature, i) => {
				feature.permissions.forEach((per, ii) => {
					per.objects.forEach((obj, objKey) => {
						if(obj_id === obj.permission_object_id){
							obj.value = e.target.value;
						}
					})
				})
			})
		});
		this.setState({ dataTemp: arr })
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
								<b className="p-l-5"> {module.name.toUpperCase()}</b>
							</td>
						</tr>
					{module.features.map((feature, i) => (
						this.state.collapse.includes(key) && <tr key={i}>
							<td className="nowrap p-l-40">
								<i className="p-l-5"> {feature.name} </i>                             
							</td>
							<td>
								<div className="row">
									<div className="col-md-12">
									{feature.permissions.map((per, ii) => (
										<div key={ii} >
											<label> <b>{per.action_name}</b> </label> 
											{per.objects.map((obj, keyObj) => (
													<div key={keyObj} className="form-group row p-10 p-l-15">
														<label htmlFor={obj.permission_object_id}> 
															{`${obj.name} - ${obj.attribute}`} 
															{this.state.loadings.editObjPermissionBtn && <i className="fas fa-spinner fa-pulse"></i>}
														</label>
														<input type="text" className="form-control" id={obj.permission_object_id} onBlur={(e) => this.hanleBlur(e, obj.permission_object_id)} defaultValue={obj.value} disabled={this.state.loadings.editObjPermissionBtn} />
													</div>
											))}
										</div>
									))}
									</div>
								</div>
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
						<li className="breadcrumb-item active">Object Permission</li>
					</ol>
					<h1 className="page-header">Object Permission </h1>
					<Panel loading={false}>
						<PanelHeader>Table Object Permission</PanelHeader>
						{this.state.loadings.editObjPermission && (
							<center>
								<br/>
								<ReactLoading type="cylon" color="#0f9e3e" />
								<br/>
							</center>
						)}
						{this.state.loadings.editObjPermission === false && (
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
										<td colSpan="2"></td>
									</tr>
									{showTbody}
								</tbody>
							</table>
							<div className="form-group">
								<button type="button" className="btn btn-danger btn-sm" onClick={(e) => this.handleBack(e)} title="Save" disabled={this.state.loadings.editObjPermissionBtn}>
									Kembali 
									{this.state.loadings.editObjPermissionBtn && <i className="fas fa-spinner fa-pulse"></i>}
								</button>
							</div>
						</PanelBody>
						)}
					</Panel>
				</div>
			);
		}
}

const stateToProps = state => {
	return {

	}
}

const dispatchToProps = dispatch => {
	return {
		fetchObjectPermission: (id, params) => dispatch(fetchObjectPermission(id, params)),
		saveObjectPermission: (id, payload) => dispatch(saveObjectPermission(id, payload)),
	}
}

export default connect(stateToProps, dispatchToProps)(ObjectPermission);