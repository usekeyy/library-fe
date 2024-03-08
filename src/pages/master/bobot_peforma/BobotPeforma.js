import React, { Component } from 'react'
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { withTranslation } from 'react-i18next';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';

import ModalForm from './sub/Modal';

import ReactTablePagination from '../../../components/paginations/ReactTablePagination';

import {fetchBobotPeforma,
    showBobotPeforma,
    deleteBobotPeforma,
    saveBobotPeforma,
    updateBobotPeforma} from '../../../store/actions/master/bobotPeformaActions';

class BobotPeforma extends Component {
    constructor(props){
        super(props)

        this._isMounted = false;

        this.state = {
            data : [],
            toggleAdd : false,
            loading : false,
            uuid: "", //keperluan update data (parsing ke modal)

            isConfirm: false,
            //sorting and pagination
            defaultPageSize: 10,
            pages: 0,
            recordsTotal: 0,
            recordsFiltered: 0,
            column: 1,
            dir: '',
            page: 0,
            options: {
				start: 0, 
				length: 10, 
				sorted_column: 2, 
				order: 'asc', 
				keyword: '',
				page: 0,
				code: '',
				description: '',
				created_at: '',
                updated_at: '',
                id :''
            },
            errors: [],

        }

        this.columns = [
            {
				Header:() => "Nomor",
                id: "nomor",
                accessor : d => d.nomor,
                width : 100,
                filterable: false,
                style: {background : "#f3f1f1"},
                Cell : row => (
                    <div style={{textAlign:"center"}}>{row.value}</div>
                ),
                sortable: false,
                
                
            },
			{
				Header:() => this.props.t("bobotPeforma:label.item_penilaian"),
				id: "item_penilaian",
                accessor: d => d.item_penilaian,
                style: {background : "#f3f1f1"},
                Filter: ({ filter, onChange }) => (
					<input className="form-control" name="item_penilaian" onChange={(event) => this.handleFilter(event)} value={this.state.options.item_penilaian} />
                ),
                sortable: false,
            },

            {
				Header:() => this.props.t("bobotPeforma:label.bobot"),
				id: "bobot",
                accessor: d => d.bobot,
                Filter: ({ filter, onChange }) => (
					<input className="form-control" name="bobot" onChange={(event) => this.handleFilter(event)} value={this.state.options.bobot} />
                ),
                Cell : props => <span>{`${props.value}%`}</span>,
                sortable: false,
            },
            {
				Header:() => this.props.t("bobotPeforma:label.lingkup"),
				id: "lingkup",
                accessor: d => d.lingkup,
                Filter: ({ filter, onChange }) => (
					<input className="form-control" name="lingkup" onChange={(event) => this.handleFilter(event)} value={this.state.options.lingkup} />
                ),
                sortable: false,
            },
            {
				Header: () => this.props.t("bobotPeforma:label.action"),
				id:"action",
				accessor: d => d.uuid,
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
                        {this.props.access.U && <Button color="warning" size="xs" value={value} onClick={(e) => this.toggleFormOpen(e,value)} ><span className="fa fa-edit">{this.props.t("bobotPeforma:button.update")}</span> </Button>}
						{/* {this.props.access.D && <Button color="danger" size="xs" value={value} onClick={(e) => this.toggleFormConfirm(e, value)} ><span className="fa fa-trash">delete</span></Button>} */}
						</center>
					</React.Fragment>
				)
			},
        ]

        
    }

    componentDidMount = () => {
        // this.setState({loading : true})
        this._isMounted = true;

        this.fetchAllData(this.state.options)

        
    }

    componentWillUnmount = () => {
        this._isMounted = false;
        this.setState = (state,callback)=>{
            return;
        };
    }

    sortableData(item_penilaian){
        switch (item_penilaian) {
          case "Aspek Quality":
            return 4
          case "Aspek Delivery":
            return 3
          case "Aspek Respon RFQ":
            return 1
          case "Aspek Service":
            return 5
          case "Aspek Price PO":
            return 2
          case "Aspek Lainnya":
            return 6
          default: 
            return ''
        }
      }

    fetchAllData = async (params) => {
        this.setState({loading: true})
        this.props.fetchBobotPeforma(params)
        .then((resp) => {
            if(this._isMounted){
                // let incrementNumber = 0;

                let dataRespon = resp.data.data.map((item) => {
                    // incrementNumber++
                    return {...item, nomor : this.sortableData(item.item_penilaian), id : item.id.toString()}
                })
                this.setState({recordsTotal : resp.data.recordsTotal})
                this.setState({loading: false, recordsFiltered: resp.data.recordsFiltered, data: dataRespon});
                this.setState({pages : Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length)})
            }
        })
        .catch((resp) => {
            this.setState({loading: false})
            toastr.error(resp.data.status, resp.data.message);
            this._isMounted = false;
        });
    }

    toggleFormOpen = (e, value) => {
        e.preventDefault(); //mencegah fungsi bawaan dari DOM
        const uuid = typeof value !== 'undefined'? value : e.target.value
        this.setState({toggleAdd : true, uuid : uuid})

    }

    toggleFormClose = () => {
        this.setState({toggleAdd : false, errors : []})
    }

    toggleFormConfirm = (e, value) => {
        e.preventDefault()
        const uuid = typeof value !== "undefined" ? value : e.target.value
        this.setState({isConfirm : true, uuid : uuid})
    }

    // toggle for confirm delete
    toggleSweetAlert = (chooseButton) => {
        switch (chooseButton) {
            case 'confirm':
                this.setState({ isConfirm: false });
                this.handleDelete(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
    }

    handleSave = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.saveBobotPeforma(val)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false, errors: []}, () => {
					this.fetchAllData()
				});
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					// const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(error.data.message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this._isMounted && this.setState({loading: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
		}
	}

    handleUpdate = (payload, id) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.updateBobotPeforma(payload, id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false, errors: []}, () => this.fetchAllData(this.state.options));
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					// const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(error.data.message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this._isMounted && this.setState({loading: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
		}
	}

    handleDelete = (id) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.deleteBobotPeforma(id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false}, () => this.fetchAllData());
			})
			.catch(error => {
                    toastr.error(error.data.message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
			})
		}
    }
    
    onResetFilter = (val) => {
		this.setState({
      options: val
    }, () => this.fetchAllData(this.state.options));    
	}

handleFilter = (event) => {
		let filters = this.state.options;
		filters.start = 0;
		filters.page = 0;
        filters[event.target.name] = event.target.value;
		this.setState({options: filters}, () => {
			this.fetchAllData(filters)
		})
    }
    
    changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.options}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({options: optDt}, () => this.fetchAllData(optDt));
		}
    }
    
    changePageSize = (length) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.recordsFiltered) / this.state.options.length);
			let optDt = {...this.state.options}
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({total: lengthPage, options: optDt}, () => this.fetchAllData(this.state.options));
		}
    }
    
    changePage = (perPage) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.recordsFiltered) / this.state.options.length);
			let optDt = {...this.state.options}
			let numb = 0;
			numb = perPage;
			if(numb > 0){
				numb = perPage * this.state.options.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({total: lengthPage, options: optDt}, () => this.fetchAllData(this.state.options));
		}
	}



    render() {
        const {t} = this.props; // belum berguna | sepertinya dari i18next.js
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor</li>
					<li className="breadcrumb-item active">{t("bobotPeforma:title")}</li>
				</ol>
				<h1 className="page-header"> Master {t("bobotPeforma:title")} </h1>
                {/* container panel */}
                <Panel loading={false}>
					<PanelHeader>{t("bobotPeforma:title")}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">

							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{/* {this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e)} > {t("common:Button.Tambah Baru")} </Button>} */}
                                    {/* {this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e)} > tambah </Button>} */}
								</div>
							</Col>
						</Row>
                        <ReactTable 
                            filterable 
                            loading={this.state.loading}
                            // manual
                            minRows={1}
                            PaginationComponent={ReactTablePagination}
                            data={this.state.data}
                            columns={this.columns}
                            defaultPageSize={this.state.defaultPageSize}
                            defaultSorted={[
                                {
                                    id : "nomor"
                                }
                            ]}
                            showPagination={true}
                            showPaginationTop={false}
                            showPaginationBottom={true}
                            pageSizeOptions={[10, 20, 25, 50, 100]}
                            recordsTotal={this.state.recordsTotal}
                            recordsFiltered={this.state.recordsFiltered}
                            // length={this.state.options.length}
                            // start={this.state.options.start}
                            page={this.state.options.page}
                            className="-highlight"
                            pages={this.state.pages}
                            // onResetFilter={val => this.onResetFilter(val)}
							options={this.state.options}
							// style={{ height: "450px" }}
onSortedChange={val => {this.changeSorted(val) }}
							onPageSizeChange={(length) => {this.changePageSize(length)}}
							onPageChange={(perPage) => {this.changePage(perPage)}}
                        />
                    </PanelBody>
                </Panel>

                {this.state.toggleAdd && 
                <ModalForm 
                    toggleAdd = {this.state.toggleAdd}
                    toggleClose = {this.toggleFormClose}
                    uuid = {this.state.uuid}
                    save={this.handleSave}
                    update={this.handleUpdate}
                    errors={this.state.errors}
                    showBobotPeforma={this.props.showBobotPeforma} 
                />
                }

                {/* modal for confirm delete */}
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    // confirmBtnText={t("common:delete.approve-delete")}
                    // cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={"yakin ingin hapus ?"}
                    onConfirm={() => this.toggleSweetAlert('confirm')}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />   
            </div>
        )
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
		fetchBobotPeforma: (params) => dispatch(fetchBobotPeforma(params)),
		saveBobotPeforma: (payload) => dispatch(saveBobotPeforma(payload)),
		showBobotPeforma: (id) => dispatch(showBobotPeforma(id)),
		updateBobotPeforma: (id, payload) => dispatch(updateBobotPeforma(id, payload)),
		deleteBobotPeforma: (id) => dispatch(deleteBobotPeforma(id)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (BobotPeforma));
