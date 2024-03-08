import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';

import { fetchCompanies, showCompanies, deleteCompanies, saveCompanies, updateCompanies } from '../../../store/actions/master/companyActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import {downloadBookPDF } from '../../../store/actions/tendering/OutlineAgreementActions'

import ModalForm from './sub/Modal'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';

class Companies extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.columns = [
            {
                Header: "No",
                accessor: "DT_RowIndex",
                height: 10,
            },
            {
                Header: () => "Nama Buku",
                accessor: "name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="name" onChange={(event) => this.onChanged(event)} value={this.state.params.name} />
                )
            },
            {
                Header: () => "Genre",
                accessor: "genre_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="genre_name" onChange={(event) => this.onChanged(event)} value={this.state.params.genre_name} />
                )
            },
            {
                Header: () => "Deskripsi",
                accessor: "deskripsi",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="deskripsi" onChange={(event) => this.onChanged(event)} value={this.state.params.deskripsi} />
                )
            },
            {
                Header: "Tahun",
                id: "tahun",
                accessor: d => d.tahun,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="tahun" onChange={(event) => this.onChanged(event)} value={this.state.params.tahun} />
                )
            },
            {
                Header: () => this.props.t("uom:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {<button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>}
                            {<button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>}
                        </center>
                    </React.Fragment>
                )
            },
        ];
        this.state = {
            data: [],
            params: {
                id: '',
                name: '',
                file: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                {name: 'Active', value: 'y', isChecked: false},
                {name: 'Inactive ', value: 'n', isChecked: false},
            ],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            isConfirm:false,
            uuid: '',
            isError:false,
            errors:{},
            loadingSubmit:false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
    }
    componentDidMount = () => {
        
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async () => {
        this.setState({loading:true})
        this.props.fetchCompanies(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading:false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }
    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        someProperty.start=0;
        this.setState({
            params: someProperty,
            page:0
        }, () => { this.req() });
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.page = arr.page
        someProperty.params.start = (arr.page * state)
        someProperty.params.length = state;
        someProperty.defaultPageSize = state;
        someProperty.params.column = arr.sorted[0].id
        someProperty.params.dir = (arr.sorted[0].desc ? 'desc' : 'asc')
        this.setState({ page: arr.page })
        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.asyncData();
        }
    }

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, isError: false, errors: {} , loadingSubmit:false})
    }

    savePayload = (type,payload) => {
        if(type==="save"){
            this.setState({loadingSubmit:true});
            this.props.saveCompanies(payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ modalOpen: false , loadingSubmit:false}, () => this.req())
            })
            .catch(error => {
                if(error !== undefined ){
                    toastr.error(error.data.message)
                    this.setState({ isError:true, errors: error.data.errors, loadingSubmit:false})
                }else{
                    toastr.error('Opps Somethings Wrong')
                }
            })
        }
    }

    updatePayload = (type,id, payload) => {
        if (type === "update") {
            this.setState({ loadingSubmit: true });
            this.props.updateCompanies(id, payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
            })
            .catch((error) => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
        }
    }

    deletePayload = (type) => {
         this.props.deleteCompanies(type)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.req()
        })
        .catch((error) => {
            if (error !== undefined) {
                toastr.error(error.data.message)
                this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
            } else {
                toastr.error('Opps Somethings Wrong')
            }
        })
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({isConfirm: true, uuid: uuid})
    }

    toggleSweetAlert(name) {
        switch(name) {
            case 'confirm':
                this.setState({ isConfirm: false });
                this.deletePayload(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
    }

    created_at = (date = '') => {
		let filters = {...this.state.params}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.created_at = date;
		} else {
			filters.created_at = '';	
		}
		this.setState({params: filters}, () => {
			this.asyncData()
		})
	}

	updated_at = (date = '') => {
		let filters = {...this.state.params}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.updated_at = date;
		} else {
			filters.updated_at = '';
		}
		this.setState({params: filters}, () => {
			this.asyncData()
		})
	}

	getCheck = (check) => {
		let filters = {...this.state.params}
		filters.start = 0;
		if(check.length > 0){
			filters.status = check.join(";");
			this.setState({params: filters}, () => this.asyncData())
		} else {
			filters.status = [];
			this.setState({params: filters}, () => this.asyncData())
		}
    }
    
    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}

    downloadPDF()
    {
        this.setState(({ loadings }) => ({ loadings: { ...loadings, download: true } }));

        this.props.downloadBookPDF()
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'Book.pdf'); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success", resp.data.message)
		})
		.catch((resp) => {
			  // this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download Export Book", resp?.statusText);
			// this.setState({loading: false});
		})
        .finally(() => {
            this.setState(({ loadings }) => ({ loadings: { ...loadings, download: false} }));
        });
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Library</li>
                </ol>
                <h1 className="page-header">Library  </h1>
                <Panel loading={false}>
                    <PanelHeader>
                    {t("company:title")}
					</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                    {<Button color="primary" className="btn btn-sm btn-primary mr-3" value='' onClick={(e) => this.downloadPDF(e, '')} >Print PDF</Button>}
                                    {<Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("company:button.add")}</Button>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    // loading={false}
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    PaginationComponent={ReactTablePagination}
                                    data={this.state.data}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                    className="-highlight"
                                    pages={this.state.pages}
                                    page={this.state.page}
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                {this.state.modalOpen &&
                    <ModalForm
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid}
                        showCompanies={this.props.showCompanies}
                        save={this.savePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        update={this.updatePayload}
                        toggleClose={this.toggleFormClose}
                        uploadLogo = {this.props.fileUpload}
                    />
                }
                {(this.state.isConfirm &&
                    <SweetAlert
                      warning
                      showCancel
                      confirmBtnText={t("common:delete.approve-delete")}
                      cancelBtnText={t("common:delete.cancel")}
                      confirmBtnBsStyle="danger"
                      cancelBtnBsStyle="default"
                      title={t("common:delete.title-delete")}
                      onConfirm={() => this.toggleSweetAlert('confirm')}
                      onCancel={() => this.toggleSweetAlert('cancel')}
                    >
                    </SweetAlert>
                )}
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
        fetchCompanies: (params) => dispatch(fetchCompanies(params)),
        showCompanies: (id) => dispatch(showCompanies(id)),
        deleteCompanies: (id) => dispatch(deleteCompanies(id)),
        saveCompanies: (id, payload) => dispatch(saveCompanies(id, payload)),
        updateCompanies: (id, payload) => dispatch(updateCompanies(id, payload)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        downloadBookPDF : () => dispatch(downloadBookPDF()),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Companies));
