import React from 'react';
import {Panel, PanelHeader, PanelBody} from '../../../../../containers/layout/sub/panel/panel';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

class FormSync extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			m_tax: [
				{value: 'witholding_tax_1', label: 'Witholding Tax Type 1'},
				{value: 'witholding_tax_2', label: 'Witholding Tax Type 2'},
			]
		};
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			// console.log(this.props.history);
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	onInputChangeTermOfPayment = (option, { action }) => {
		if (action === "input-change") {
			this.props.fetchTermOfPayment(option)
		}
	};

	onInputChangeIncoterm = (option, { action }) => {
		if (action === "input-change") {
			this.props.fetchIncoterms(option)
		}
	};

	onInputChangeVendorAccGroup = (option, { action }) => {
		if (action === "input-change") {
			this.props.fetchVendorAccGroup(option)
		}
	};

	onInputChangeGlAccount = (option, { action }) => {
		if (action === "input-change") {
			this.props.fetchGlAccount(option)
		}
	};

	onInputChangeCurrency = (option, { action }) => {
		if (action === "input-change") {
			this.props.fetchCurrencies(option)
		}
	};

	onInputChangeSearchTerms = (option, { action }) => {
		if (action === "input-change") {
			this.props.fetchSearchTerms(option)
		}
	};

	handleChange = name => value => {
    	this.props.handleChange(name, value)
	  };
	  
	  handleChangeIncotermLocation = (name,value) => {
		  this.props.handleChange(name, value)
	  }
	
	render() {
		const {loadings} = this.props.parentState;
		const {m_incoterm} = this.props.parentState.master_data;
		const {t} = this.props;
		// const {data_vendor} = this.props;

		return (
		<div>
			<Panel>
				<PanelHeader>Data SAP</PanelHeader>
				{console.log(this.props.parentState)}
				<PanelBody >
					<div className="row">
						<div className="col-md-12">
							<div className="">
									<table className="table table-bordered table-striped table-sm">
											<thead>
													<tr>
															<th>Field SAP</th>
															<th>Value</th>
													</tr>
											</thead>
											<tbody>
													<tr>
															<td>Account Group</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.vendor_acc_group ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.vendor_acc_group}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`account_group`}
																	options={this.props.parentState.master_data.m_vendor_acc_group}
																	defaultValue={this.props.parentState.account_group}
																	onChange={this.handleChange('account_group')}
																	onInputChange={this.onInputChangeVendorAccGroup}
																	isDisabled={!this.props.isApplicant}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>SearchTerms</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.searchterms ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.searchterms}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`search_term`}
																	options={this.props.parentState.master_data.m_searchterm}
																	defaultValue={this.props.parentState.searchterms_id}
																	onChange={this.handleChange('searchterms_id')}
																	onInputChange={this.onInputChangeSearchTerms}
																	isDisabled={false}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Recont Account</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.gl_account ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.gl_account}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`recont_account`}
																	options={this.props.parentState.master_data.m_gl_account} 
																	value={this.props.parentState.recont_account}
																	onChange={this.handleChange('recont_account')}
																	onInputChange={this.onInputChangeGlAccount}
																	isDisabled={false}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Company Code</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.incoterm}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`company_code`}
																	options={[]} 
																	defaultValue={this.props.parentState.purchasing_org_id}
																	onChange={this.handleChange('company_code')}
																	isDisabled={true}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Purchasing Organiztion</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.incoterm}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`purchasing_org_id`}
																	options={[]} 
																	defaultValue={this.props.parentState.purchasing_org_id}
																	onChange={this.handleChange('purchasing_org_id')}
																	isDisabled={true}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Currency</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.currency ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.currency}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`currency`}
																	options={this.props.parentState.master_data.m_currency} 
																	defaultValue={this.props.parentState.currency}
																	onChange={this.handleChange('currency')}
																	onInputChange={this.onInputChangeCurrency}
																	isDisabled={false}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Term Of Payment</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.incoterm}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`term_of_payment`}
																	options={this.props.parentState.master_data.m_term_of_payment} 
																	defaultValue={this.props.parentState.term_of_payment}
																	onChange={this.handleChange('term_of_payment')}
																	onInputChange={this.onInputChangeTermOfPayment}
																	isDisabled={false}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Incoterms</td>
															<td>
																<Select
																	components={animatedComponents}
																	closeMenuOnSelect={true}
																	as={Select} 
																	placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																	isLoading={loadings.incoterm}
																	className="basic-multi-select"
																	classNamePrefix="select"
																	name={`incoterm_id`}
																	options={m_incoterm} 
																	defaultValue={this.props.parentState.incoterm_id}
																	onChange={this.handleChange('incoterm_id')}
																	onInputChange={this.onInputChangeIncoterm}
																	isDisabled={false}
																	isClearable={false} />
															</td>
													</tr>
													<tr>
															<td>Incoterms Location</td>
															<td>
																<input 
																	className="form-control" 
																	name="incoterm_location" 
																	onChange={e => this.handleChangeIncotermLocation('incoterm_location',e.target.value)}
																	disabled={this.props.parentState.incoterm_id === '' ? true : false}
																	defaultValue={this.props.parentState.incoterm_location}
																/>
															</td>
													</tr>
													<tr>
															<td>Witholding Tax Type</td>
															<td>
															<Select
																components={animatedComponents}
																closeMenuOnSelect={true}
																as={Select} 
																placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
																isLoading={loadings.incoterm}
																className="basic-multi-select"
																classNamePrefix="select"
																name={`witholding_tax`}
																defaultValue={this.props.parentState.witholding_tax}
																onChange={this.handleChange('witholding_tax')}
																// onInputChange={this.onInputChangeIncoterm}
																isDisabled={true}
																isClearable={false}
																isMulti={false} />
															</td>
													</tr>
											</tbody>
									</table>
							</div>
						</div>
					</div>
				</PanelBody>
			</Panel>
		</div>
		)
	}
}

export default FormSync;