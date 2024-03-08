import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {saveSimap} from '../../../store/actions/vendor/migrasiVendorActions';
import {fetchDataVendor} from '../../../store/actions/vendor/vendorActions';
import { fileUpload } from '../../../store/actions/uploadActions';

import { Row, Col } from 'reactstrap';
// import { uploadMigrasi } from '../../../store/actions/uploadActions';
// import FormMigrasi from './sub/FormMigrasi';
import FormUploadSimap from './sub/FormUploadSimap';

class UploadSimap extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
            dataVendor : [],
            loadingVendor : false,
            errors : false,
            loadingSubmit : false
		}
	}
	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
            this.fetchVendor()
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toggleTab = (tab) => {
    if(this.state.tab !== tab) this.setState({tab : tab});
  }

  redirectHistory = () => {
    this.props.history.push('/vendor/migration');
  }

  saveSimap = (payload) => {
        if(this._isMounted){
            this.setState({loadingSubmit : true});
            this.props.saveSimap(payload)
            .then((resp) => {
                // this.resetForm();
                // this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: false, loading: false, errors: [] } }), () => {
                //     this.child.current.fetchData();
                // });
                this.setState({loadingSubmit : false})
                toastr.success('Success Upload SIMAP');
                this.redirectHistory()
            })
            .catch((resp) => {
                // this.setState(({ akta }) => ({ akta: { ...akta, errors: resp.data.errors, loadingButton: false } }));
                // toastr.error(resp.data.message, resp.data.status);
                // let alert = ''
                // for (const [key, value] of Object.entries(resp.data.errors)) {
                //     alert = alert+  "\n" + value
                // }
                this.setState({loadingSubmit : false})
                toastr.error('Gagal Upload SIMAP');
            });
        }
    }

  fetchVendor = async (params = '') => {
    this.setState({loadingVendor: true})
    this.props.fetchDataVendor({ status : 'y', migration : 0, start : 0, length : 10, name : params})
    .then((resp) => {
            if(this._isMounted){
                const data = resp.data.data.map((item) => {
                    return {
                        value : item.id,
                        label : item.name
                    }
                })
                this.setState({loadingVendor: false, dataVendor: data});
            }
        })
    .catch((resp) => {
            this.setState({loadingVendor: false})
            toastr.error(resp.data.status, resp.data.message);
            this._isMounted = false;
        });
    }

  render(){


    return (
      <div>
        <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Vendor Management</li>
            <li className="breadcrumb-item active">Upload SIMAP</li>
        </ol>
        <h1 className="page-header">Upload SIMAP</h1>
        <Panel loading={false}>
                    <PanelHeader>Upload SIMAP</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="10">
                                <FormUploadSimap 
                                    data = {this.state}
                                    upload = {this.props.fileUpload}
                                    save = {this.saveSimap}
                                    fetchVendor = {this.fetchVendor}
                                />
                            </Col>
                        </Row>
                        <br></br>
                          <button className="btn btn-white pull-right" onClick={this.redirectHistory}>kembali</button>
                    </PanelBody>
                </Panel>
        </div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
        fetchDataVendor: (params) => dispatch(fetchDataVendor(params)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        saveSimap: (payload) => dispatch(saveSimap(payload)),
    
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (UploadSimap));