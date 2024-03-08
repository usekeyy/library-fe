import React from 'react';

import { Panel, PanelHeader, PanelBody } from '../../../layout/sub/panel/panel';
import { fetchKonfigurasiShow } from '../../../../store/actions/master/announcementActions';
import FormRegistrasi from './FormRegistrasi';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

class Registrasi extends React.Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.state = {
			sendData: {},
			loading: false,
			status_registrasi : false,
			loading_registrasi : false
		}
	}
	
	componentDidMount(){
		this._isMounted = true;
		this.showCurrentStatusRegistrasi();
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	showCurrentStatusRegistrasi = async () => {
		this.setState({loading_registrasi : true})
        this.props.fetchKonfigurasiShow()
            .then((resp) => {
                this.setState({
                    status_registrasi : resp.data.data.status === 'o' ? true : false,
					loading_registrasi : false
                })
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
				this.setState({loading_registrasi : false})
            });
    }

	render() {
		const {t} = this.props.props
		return (
			<div className="row">
				<div className="col-md-12">
					<Panel>
						<PanelHeader>Form {t('Beranda.Registrasi.Title')} Vendor</PanelHeader>
						<PanelBody>
							{/* {this.state.loading_registrasi ? <center>Loading........</center> :
							!this.state.status_registrasi ?
							<center style={{marginTop : "100px", marginBottom : "100px"}}>
								<h3>
								Pendaftaran rekanan baru belum bisa dilakukan, info selengkapnya dapat menghubungi tim Vendor Management Pupuk Indonesia Group
								</h3>
							</center>
							: */}
							<FormRegistrasi 
								isCancel={this.props.isCancel}
								showPaktaIntegritas={this.props.showPaktaIntegritas}
								fetchRegion={this.props.fetchRegion}
								fetchDistrict={this.props.fetchDistrict}
								fetchSubDistrict={this.props.fetchSubDistrict}
								fetchPostcalCode={this.props.fetchPostcalCode}
								fetchVillage={this.props.fetchVillage}
								data={this.props.data}
								m_company={this.props.m_company}
								m_purchasing_org={this.props.m_purchasing_org}
								m_country={this.props.m_country}
								m_region={this.props.m_region}
								m_district={this.props.m_district}
								m_sub_district={this.props.m_sub_district}
								m_village={this.props.m_village}
								m_postcal_code={this.props.m_postcal_code}
								m_vendor_type={this.props.m_vendor_type}
								loadings={this.props.loadings}
								errors_response={this.props.errors}
								props={this.props.props}
								setCountry={this.props.setCountry}
								loading={this.state.loading} />
							{/* } */}
						</PanelBody>
					</Panel>
				</div>
			</div>
		)
	}
}

// export default Registrasi;

const stateToProps = state => {
	return {

	}
}

const dispatchToProps = dispatch => {
	return {
        fetchKonfigurasiShow: () => dispatch(fetchKonfigurasiShow()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Registrasi));