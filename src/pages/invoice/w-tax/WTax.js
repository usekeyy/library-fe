import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchWithHoldingTax, showWithHoldingTax, deleteWithHoldingTax, saveWithHoldingTax, updateWithHoldingTax, syncWithHoldingTax } from '../../../store/actions/invoice/withHoldingTaxActions';

import ModalForm from './sub/Modal'
import ModalSync from'./sub/ModalSync';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';


class WTax extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                w_tax_code: '',
                w_tax_type: '',
                percentage: '',
                name: '',
                description: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            defaultPageSize: 10,
            recordsFiltered: 0,
            recordsTotal: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
			toggleSync: false,
            isConfirm: false,
            uuid: '',
            isError: false,
            errors: {},
            loadingSubmit: false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
				Header: "Code",
                accessor: "w_tax_code",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="w_tax_code" onChange={(event) => this.onChanged(event)} value={this.state.params.w_tax_code} />
                )
            },
            {
				Header: "Type",
                accessor: "w_tax_type",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="w_tax_type" onChange={(event) => this.onChanged(event)} value={this.state.params.w_tax_type} />
                )
            },
            {
				Header: () => this.props.t("documentType:label.description"),
                accessor: "description",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="description" onChange={(event) => this.onChanged(event)} value={this.state.params.description} />
                )
            },
            {
				Header: "Percentage",
                accessor: "percentage",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="percentage" onChange={(event) => this.onChanged(event)} value={this.state.params.percentage} />
                )
            },
            // {
			// 	Header: "Document Category",
            //     accessor: "doc_cat",
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="doc_cat" onChange={(event) => this.onChanged(event)} value={this.state.params.doc_cat} />
            //     )
            // },
            {
				Header: () => this.props.t("documentType:label.status"),
                id: "status",
                accessor: d => d.status,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({ value }) => (
                    <label>{statusName(value)}</label>
                )
            },
            {
				Header: () => this.props.t("documentType:label.created_at"),
                id: "created_at",
                accessor: d => formatDate(d.created_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
				Header: () => this.props.t("documentType:label.updated_at"),
                id: "updated_at",
                accessor: d => formatDate(d.updated_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
            {
				Header: () => this.props.t("documentType:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {/* {<button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>}
                            {<button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>} */}
                        </center>
                    </React.Fragment>
                )
            },
        ]
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

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchWithHoldingTax(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading: false
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
        someProperty.start = 0
        this.setState({
            params: someProperty,
            page: 0
        }, () => { this.req() });
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
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

	toggleFormSync = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleSync: true, uuid: value})
		}
	}

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, toggleSync: false, isError: false, errors: {}, loadingSubmit: false })
    }

	handleSync = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.syncWithHoldingTax(val)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, errors: []}, () => {
                    this.toggleFormClose()
					this.asyncData()
				});
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this._isMounted && this.setState({loading: false});
					toastr.error("Gagal Sinkron Data");
				}
			})
		}
	}

    savePayload = (type, payload) => {
        if (type === "save") {
            this.setState({ loadingSubmit: true });
            this.props.saveWithHoldingTax(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    updatePayload = (type, id, payload) => {
        if (type === "update") {
            this.setState({ loadingSubmit: true });
            this.props.updateWithHoldingTax(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
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
        this.props.deleteWithHoldingTax(type)
            .then((resp) => {
                this.setState({ isConfirm: false });
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
        this.setState({ isConfirm: true, uuid: uuid })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
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
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.created_at = date;
        } else {
            filters.created_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    updated_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.updated_at = date;
        } else {
            filters.updated_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Invoice</li>
                    <li className="breadcrumb-item active">With Holding Tax</li>
                </ol>
                <h1 className="page-header">With Holding Tax</h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Table With Holding Tax
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                {/* <div className="pull-right m-b-10">
                                    {<Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("documentType:button.add")}</Button>}
                                </div> */}
                                {/* <span> </span>
                                <div className="pull-right m-b-10">
									<Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormSync(e, '')} >Sync</Button>
								</div> */}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    data={this.state.data}
                                    PaginationComponent={ReactTablePagination}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    className="-highlight"
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
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
                        showWithHoldingTax={this.props.showWithHoldingTax}
                        save={this.savePayload}
                        update={this.updatePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        toggleClose={this.toggleFormClose}
                    />
                }
				{this.state.toggleSync && 
                    <ModalSync 
                        loading={this.state.loading}
                        errors={this.state.errors}
                        toggleSync={this.state.toggleSync} 
                        toggleClose={this.toggleFormClose} 
                        sync={this.handleSync}
                        datas={this.state} 
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
        fetchWithHoldingTax: (params) => dispatch(fetchWithHoldingTax(params)),
        showWithHoldingTax: (id) => dispatch(showWithHoldingTax(id)),
        deleteWithHoldingTax: (id) => dispatch(deleteWithHoldingTax(id)),
        saveWithHoldingTax: (id, payload) => dispatch(saveWithHoldingTax(id, payload)),
        updateWithHoldingTax: (id, payload) => dispatch(updateWithHoldingTax(id, payload)),
		syncWithHoldingTax: (payload) => dispatch(syncWithHoldingTax(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(WTax));
