import React, {Component} from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import TablePengajuan from './TablePengajuan';

const animatedComponents = makeAnimated();
class Form extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			selected_uuid: this.props.vendor_uuid,
			selected_id: this.props.data.sendData.vendor_id,
			loading: false,
			vendor_info: {
				id: '',
				name: '',
				sap_code: '',
			}
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
	
	setVendor = (e) => {
		this.setState(({ vendor_info }) => ({
			vendor_info: { ...vendor_info, id: '', name: '', sap_code: '' },
			selected_uuid: ''
		}), () => {
			this.setState(({ vendor_info }) => ({
				vendor_info: { ...vendor_info, id: e.target.id, name: e.target.vendor_name, sap_code: e.target.sap_code },
				selected_uuid: e.target.value, selected_id: e.target.id
			}));
		});
	}

	setLoading = (type) => {
		this.setState({ loading: type }, () => {
			this.props.setLoading(type)
		})
	}

	onInputChange = (option, { action }) => {
		if (action === "input-change") {
			this.props.handleInputVendor(option)
		}
	};

  render(){
		const {t} = this.props;
		const {sendData} = this.props.data;
		const errors_response = this.props.data.errors;
		
		const customStyles = {
      control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ?
          '#ddd' : 'red',
      })
		}
		
    return (
			<div>
				{!this.props.isVendor && <div className="row">
					<div className="col-md-12">
						<div className="form-group row m-b-15">
								<label className="col-md-3 col-form-label">Pilih Vendor<span className="text-danger">*</span></label>
								<div className="col-md-7">
									<Select
										components={animatedComponents}
										closeMenuOnSelect={true}
										as={Select} 
										placeholder={this.props.loadings.vendor ? t("Select.Sedang Memuat") : t("Select.Pilih") }
										isLoading={this.props.loadings.vendor}
										className="basic-multi-select"
										classNamePrefix="select"
										name="vendor_id"
										styles={errors_response.vendor_id ? customStyles : {}}
										onInputChange={this.onInputChange}
										onChange={(val)=> {this.setVendor({target: { id: val.id, value: val.value, vendor_name: val.vendor_name, sap_code: val.sap_code }})}}
										options={this.props.data.vendors} 
										defaultValue={sendData.vendor_id}
										isDisabled={this.state.loading}
										rules={{ required: false }} />
										{errors_response.vendor_id && <span className="text-danger"> {errors_response.vendor_id[0]} </span>}
								</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Nama Vendor</label>
							<div className="col-md-7">
								<div className="m-t-10">{this.state.vendor_info.name}</div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">No Pendaftaran</label>
							<div className="col-md-7">
								<div className="m-t-10">{this.state.vendor_info.id}</div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">No ERP</label>
							<div className="col-md-7">
								<div className="m-t-10">{this.state.vendor_info.sap_code}</div>
							</div>
						</div>
					</div>
				</div>}
				{this.state.selected_uuid !== '' && <TablePengajuan vendor_id={this.state.selected_id} vendor_uuid={this.state.selected_uuid} showExtendCompany={this.props.showExtendCompany} save={this.props.handleSave} close={this.props.close} t={this.props.t} setLoading={this.setLoading} />}
			</div>
    );
  }
}



export default Form;