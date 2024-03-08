import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

// import {
// 				showUserSap,
// 				deleteUserSap,
// 				saveUserSap,
// 				updateUserSap,
// 				fetchUser
// 			} from '../../../../store/actions/master/userHasSapActions';

import {fetchRekapTransmittalDocument,cetakRekapTransmittal} from '../../../../store/actions/invoice/invoiceActions';

// import ModalForm from'./sub/Modal';
import FilterDate from '../../../../components/filterdate/FilterDate';
import Pagination from '../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import {debounce} from '../../../../helpers/debounce';
import { formatDate } from '../../../../helpers/formatDate';


class RekapTransmittalDocumentDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;

		this.state = {
			options: {
				start: 0, 
				length: 10, 
				sorted_column: 1, 
				order: 'asc', 
				keyword: '',
				page: 0,
				id: '',
				code: '',
				name: '',
				created_at: '',
				updated_at: ''
			},
			statusSearch: [
				{name: 'Active', value: 'y', isChecked: false},
				{name: 'Inactive ', value: 'n', isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false,
			loadingDownload : false
		}

		this.defaultSorted = [
			{
				id: "name",
				desc: false
			}
		];
		this.columns = [
			// {
			// 	Header:() => this.props.t("uom:label.id"),
			// 	id: "id",
			// 	accessor: d => d.id,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
			// 	)
			// },
			{
				Header:"Nomor Transmittal",
				id: "no_transmittal",
				accessor: d => d.no_transmittal,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="no_transmittal" onChange={(event) => this.handleFilter(event)} value={this.state.options.no_transmittal} />
				)
			},
			{
				Header:"Jumlah Dokumen",
				id: "jumlah",
				accessor: d => d.jumlah,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="jumlah" onChange={(event) => this.handleFilter(event)} value={this.state.options.jumlah} />
				)
			},
			{
				Header:"Created By",
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header: "Tanggal Transmittal",
				id: "tanggal",
				accessor: d => formatDate(d.tanggal, false),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="tanggal" getDate={this.updated_at} />
				)
			},
			{
				Header: () => this.props.t("uom:label.action"),
				id:"action",
				accessor: "no_transmittal",
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							{/* {this.props.access.U && <Button color="warning" size="xs" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><span className="fa fa-edit"></span> </Button>}
							{this.props.access.D && <Button color="danger" size="xs" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><span className="fa fa-trash"></span></Button>} */}
							<Button color="default" size="xs" value={value} onClick={(e) => this.toDetail(value.replace(/\//g, '-'))} >Detail</Button>
							<Button color="primary" size="xs" value={value} onClick={(e) => this.downloadRekapTransmittal(e, value.replace(/\//g, '-'))} disabled={this.state.loadingDownload}>{this.state.loadingDownload ? <i className="fa fa-spinner fa-spin"></i> : "Print"}</Button>
						</center>
					</React.Fragment>
				)
			},
		]
	}

	debounced = debounce(text => this.fetchData());

  componentDidMount = () => {
    this._isMounted = true;
		this.asyncData(this.state.options);
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  	toDetail = (id) => {
		this.props.history.push('/invoice/rekap-transmittal-document/detail/' + id)
		
	  }

	asyncData = async (params) => {
			this.setState({loading: true})
      this.props.fetchRekapTransmittalDocument(params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
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
			this.asyncData(this.state.options)
		}
	}

	downloadRekapTransmittal = (e,id) => {
		e.preventDefault();
		this.setState({loadingDownload : true});
		this.props.cetakRekapTransmittal(id)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `REKAP_TRANSMITTAL_DOCUMENT.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			this.setState({loadingDownload : false});
		})
		.catch((resp) => {
			this.setState({loadingDownload : false});
				toastr.error(resp.data.message);
		});
	}
	
	changePage = (perPage) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = {...this.state.options}
			let numb = 0;
			numb = perPage;
			if(numb > 0){
				numb = perPage * this.state.options.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({total: lengthPage, options: optDt}, () => this.fetchData());
		}
	}
	
	changePageSize = (length) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = {...this.state.options}
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({total: lengthPage, options: optDt}, () => this.fetchData());
			console.log(this.state.options.start);
		}
	}

	toggleFormOpen = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleAdd: true, uuid: value})
		}
	}
	
	toggleFormClose = () => {
		if(this._isMounted){
			this.setState({toggleAdd: false, uuid: '', errors: []})
		}
	}


	toggleConfirm = (e, value) => {
		if(this._isMounted){
			e.preventDefault()
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({isConfirm: true, uuid: uuid})
		}
	}

	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.setState({ isConfirm: false });
					this.handleDelete(this.state.uuid)
					break;
				case 'cancel':
					this.setState({ isConfirm: false, uuid: '' });
					break;
				default:
					break;
			}
		}
	}

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.options}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({options: optDt}, () => this.fetchData());
		}
	}

	onResetFilter = (val) => {
		this.setState({
      options: val
    }, () => this.fetchData());    
	}

handleFilter = (event) => {
		let filters = this.state.options;
		filters.start = 0;
		filters.page = 0;
		filters[event.target.name] = event.target.value;
		this.setState({options: filters}, () => {
			this.debounced(filters);
		})
	}

	created_at = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.created_at = date;
		} else {
			filters.created_at = '';	
		}
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	updated_at = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.tanggal = date;
		} else {
			filters.tanggal = '';
		}
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	getCheck = (check) => {
		let filters = {...this.state.options}
		filters.start = 0;
		if(check.length > 0){
			filters.status = check.join(";");
			this.setState({options: filters}, () => this.fetchData())
		} else {
			filters.status = [];
			this.setState({options: filters}, () => this.fetchData())
		}
	}
	

  render(){
	  // const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Master Data</li>
					<li className="breadcrumb-item active">{"Rekap Transmittal Document"}</li>
				</ol>
				<h1 className="page-header">Rekap Transmittal Document </h1>
				<Panel loading={false}>
					<PanelHeader>{"Table Rekap Transmittal Document"}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{/* {this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e, '')} >{t("uom:button.add")}</Button>} */}
									{/* <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e, '')} >{t("uom:button.add")}</Button> */}
								</div>
							</Col>
						</Row>
						<ReactTable 
							columns={this.columns} 
							filterable loading={this.state.loading} 
							manual
							minRows={1}
							PaginationComponent={Pagination}
							pageSizeOptions={[10, 20, 25, 50, 100]}
							recordsTotal={this.state.data.recordsTotal}
							recordsFiltered={this.state.data.recordsFiltered}
							data={this.state.data.data} 
							defaultPageSize={10} 
							defaultSorted={this.defaultSorted} 
							pages={this.state.total}
							page={this.state.options.page}
							onResetFilter={val => this.onResetFilter(val)}
							options={this.state.options}
							// style={{ height: "450px" }}
onSortedChange={val => {this.changeSorted(val) }}
							onPageSizeChange={(length) => {this.changePageSize(length)}}
							onPageChange={(perPage) => {this.changePage(perPage)}}
							className="-highlight" />
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
		fetchRekapTransmittalDocument: (params) => dispatch(fetchRekapTransmittalDocument(params)),
		cetakRekapTransmittal: (id) => dispatch(cetakRekapTransmittal(id)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (RekapTransmittalDocumentDetail));