import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchRekapTransmittalDocumentDetail} from '../../../../../store/actions/invoice/invoiceActions';
import { formatDate } from '../../../../../helpers/formatDate';


class RekapTransmittalDocument extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;

		this.state = {
			data: [],
			errors: [],
			loading: false
		}
	}

  componentDidMount = () => {
    this._isMounted = true;
		this.asyncData(this.props.match.params.id);
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	asyncData = async (id) => {
			this.setState({loading: true})
      this.props.fetchRekapTransmittalDocumentDetail(id)
      .then((resp) => {
				if(this._isMounted){
					this.setState({loading: false, data: resp.data.data});
				}
			})
      .catch((resp) => {
				this.setState({loading: false})
				toastr.error(resp.data.status, resp.data.message);
				this._isMounted = false;
			});
	}

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.props.match.params.id)
		}
	}

  render(){
	  // const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Master Data</li>
					<li className="breadcrumb-item active">{"Detail Rekap Transmittal Document"}</li>
				</ol>
				<h1 className="page-header">Detail Rekap Transmittal Document </h1>
				<Panel loading={false}>
					<PanelHeader>{"Detail Rekap Transmittal Document"}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
								<p className="font-weight-bold">No. Transmittal : {this.state.data?.no_transmittal}</p>
								<p className="font-weight-bold">Jumlah Dokumen : {this.state.data?.jumlah}</p>
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									<p className="font-weight-bold">Tanggal Transmittal : {this.state.data?.tanggal}</p>
									<p className="font-weight-bold">Created By : {this.state.data?.name}</p>
								</div>
							</Col>
						</Row>
						<Row>
                        <Col sm="12">
                            <div className="form-group row">
								<div className="table-responsive">
									<table className="table table-bordered table-striped table-sm text-nowrap" align="left">
										<thead>
											<tr>
												<th>No. Invoice</th>
												<th>Tgl. Invoice</th>
												<th>Kode Vendor</th>
												<th>Nama Vendor</th>
												<th>Nilai Invoice</th>
												<th>Currency</th>
												<th>No. Doc. SAP</th>
											</tr>
										</thead>
										<tbody>

											{
											!this.state.loading &&
											this.state.data?.items?.map((item,index) => {
												return (
													<tr key={index}>
														<td>{item.number}</td>
														<td>{formatDate(item.invoice_date)}</td>
														<td>{item.vendor_id}</td>
														<td>{item.vendor_name}</td>
														<td>{item.total}</td>
														<td>{item.currency}</td>
														<td>{item.sap_fi}</td>
													</tr>
												)
											})
											}
										</tbody>
									</table>
                                </div>
                            </div>
                        </Col>
						<Col sm="12">
							<div className="pull-right m-t-5 m-b-5">
								<button
									type="button"
									onClick={(e) => window.history.back()}
									disabled={this.state.loading}
									className="btn btn-white m-r-5">
									Kembali
									</button>
							</div>
						</Col>
                    </Row>
						
				</PanelBody>
			</Panel>
		</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchRekapTransmittalDocumentDetail: (id) => dispatch(fetchRekapTransmittalDocumentDetail(id)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (RekapTransmittalDocument));