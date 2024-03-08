import React, {Component} from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

class Term extends Component {
		constructor(props) {
			super(props);
			this._isMounted = false;
			this._data = []
			this.state = {
				activePill: '1',
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

		togglePill = (pill) => {
			if (this.state.activePill !== pill) {
				this.setState({
					activePill: pill
				});
			}
		}
		
		findProcessing = (arr, key) => {
			let data
			arr.forEach((items, i) => {
				if(items.id === key){
					data = items.name
				}
			})
			return data
		}

		toggleOpenModal = (e, data) => {
			e.preventDefault()
			this.props.modals(data)
		}

		render(){
			// const { t } = this.props;
			const {m_persyaratan} = this.props.parentState.proposal_tender;
			const {header} = this.props.parentState.proposal_tender;
			// const {attachments} = this.props.parentState.proposal_tender;
			// const {uuid} = this.props.parentState;
			const {errors} = this.props.parentState.proposal_tender;
			const {loadings} = this.props.parentState;
			let rows;

			if (m_persyaratan.length > 0) {
					rows = m_persyaratan.map((dt, i) => {
							return (
									<tr key={i}>
											<td>{dt.term_name}</td>
											<td>
												{header.metode_evaluasi !== '' && <button className="btn btn-xs btn-lime" onClick={(e) => this.props.modalsTerm(dt.term_code)} disabled={loadings.button} >Persyaratan</button>}
											</td>
									</tr>
							)
					})
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
			
			return (
				<div>
					<Panel className="margin-bot-false">
						<PanelHeader>Persyaratan</PanelHeader>
						{(loadings.persyaratan) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
						{(!loadings.persyaratan) &&
						<PanelBody >
							<div className="row">
									<div className="col-sm-12">
											{/* {errors['terms'] && <h6 className="text-danger">{errors['terms'][0]}</h6>} */}
											{errors.terms  && errors.terms.map((element,i) => {
												// ...use `element`...
												return (<li key={i} className='text-danger'>{element}</li>)
											})}
											<div className="table-responsive">
													<table className="table table-bordered table-striped table-sm text-nowrap">
															<thead>
																	<tr>
																			<th>Persyaratan</th>
																			<th>Action</th>
																	</tr>
															</thead>
															<tbody>{rows}</tbody>
													</table>
											</div>
									</div>
								</div>
						</PanelBody>}
					</Panel>
				</div>
			);
		}
}

export default Term;
