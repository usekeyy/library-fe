import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchTemplateReminder, showTemplateReminder, deleteTemplateReminder, saveTemplateReminder, updateTemplateReminder } from '../../../store/actions/expediting/templateReminderActions';
import { fetchPurchasingOrg } from '../../../store/actions/master/purchasingOrgActions';

import ModalForm from './sub/Modal'
import FilterStatus from '../../../components/filterstatus/FilterStatus';
// import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { statusName } from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';

class TemplateReminder extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                uuid: '',
                title: '',
                purchasing_org_id: '',
                purchasing_org_name: '',
                content: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            total: 0,
            defaultPageSize: 10,
            recordsFiltered: 0,
            recordsTotal: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalType: '',
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
				Header: "",
                filterable: false,
                maxWidth: 50,
                sortable: false,
                Cell: (row) => {
                    return <div>{row.index+1}</div>;
                }
            },
            // {
            //     Header: "Tax Code",
            //     accessor: "id",
            //     // filterable : false,
            //     // sortable : false,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="id" onChange={(event) => this.onChanged(event)} value={this.state.params.id} />
            //     )
            // },
            {
                Header: "Title",
                accessor: "title",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                )
            },
            {
                Header: "Purc. Org",
                accessor: "purchasing_org_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
                )
            },
            {
                Header: "Purc. Org Name",
                accessor: "purchasing_org_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_name} />
                )
            },
            {
                Header: "Status",
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
				Header: () => this.props.t("templateReminder:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            <button className="btn btn-xs btn-success" value={value} onClick={(e) => this.toggleFormOpen(e, value, 'detail')} ><i className="fa fa-list"></i></button>
                            {this.props.access.U && <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value, 'edit')} ><i className="fa fa-edit"></i></button>}
                            {this.props.access.D && <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>}
                            {/* <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>
                            <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button> */}
                        </center>
                    </React.Fragment>
                )
            },
        ]
    }

    debounced = debounce(text => this.fetchData());

    componentDidMount() {
        this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
		}
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    fetchData = async (params) => {
        this.setState({ loading: true })
        this.props.fetchTemplateReminder(params)
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
        }, () => {
            this.debounced(someProperty);
        });
    }

	toggleFormSync = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleSync: true, uuid: value})
		}
	}

    toggleFormOpen = (e, value, type) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid, modalType: type })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, modalType: '', toggleSync: false, isError: false, errors: {}, loadingSubmit: false })
    }

	// handleSync = (val) => {
	// 	if(this._isMounted){
	// 		this.setState({loading: true})
	// 		this.props.syncTax(val)
	// 		.then(res => {
	// 			const response = res.data;
	// 			toastr.success(response.message);
	// 			this._isMounted && this.setState({loading: false, errors: []}, () => {
    //                 this.toggleFormClose()
	// 				this.fetchData()
	// 			});
	// 		})
	// 		.catch(error => {
	// 			if(typeof error !== 'undefined'){
	// 				const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
	// 				toastr.error(message);
	// 				this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
	// 			} else {
	// 				this._isMounted && this.setState({loading: false});
	// 				toastr.error("Gagal Sinkron Data");
	// 			}
	// 		})
	// 	}
	// }

    savePayload = (type, payload) => {
        if (type === "save") {
            this.setState({ loadingSubmit: true });
            this.props.saveTemplateReminder(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.fetchData())
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
            this.props.updateTemplateReminder(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.fetchData())
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
        this.props.deleteTemplateReminder(type)
            .then((resp) => {
                this.setState({ isConfirm: false });
                toastr.success(resp.data.message);
                this.fetchData()
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
            this.fetchData(filters)()
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
            this.fetchData(filters)()
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters)())
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.fetchData(filters)())
        }
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.fetchData(val)());    
	}

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.params}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({params: optDt}, () => this.fetchData(optDt));
		}
	}

	changePage = (perPage) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.params.length);
			let optDt = {...this.state.params}
			let numb = 0;
			numb = perPage;
			if(numb > 0){
				numb = perPage * this.state.params.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({total: lengthPage, params: optDt}, () => this.fetchData(optDt));
		}
	}
	
	changePageSize = (length) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.params.length);
			let optDt = {...this.state.params}
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({total: lengthPage, params: optDt}, () => this.fetchData(optDt));
			console.log(this.state.params.start);
		}
	}

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Template Reminder</li>
                </ol>
                <h1 className="page-header">{t("templateReminder:title")}  <small>Master Data {t("templateReminder:title")}</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {t("templateReminder:table-title")}
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                {this.props.access.C && <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '', 'create')} >{t("templateReminder:button.add")}</Button>}
                                    {/* <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("templateReminder:button.add")}</Button> */}
                                </div>
                                {/* <span> </span>
                                <div className="pull-right m-b-10 p-r-4">
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
                                    onResetFilter={val => this.onResetFilter(val)}
                                    onSortedChange={val => {this.changeSorted(val) }}
                                    onPageSizeChange={(length) => {this.changePageSize(length)}}
                                    onPageChange={(perPage) => {this.changePage(perPage)}}
                                    options={this.state.params}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    pages={this.state.pages}
                                    page={this.state.page}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                {this.state.modalOpen &&
                    <ModalForm
                        toggleAdd={this.state.modalOpen}
                        modalType={this.state.modalType}
                        uuid={this.state.uuid}
                        user={this.props.user}
                        showTemplateReminder={this.props.showTemplateReminder}
                        fetchPurchasingOrg={this.props.fetchPurchasingOrg}
                        save={this.savePayload}
                        update={this.updatePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        toggleClose={this.toggleFormClose}
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
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchTemplateReminder: (params) => dispatch(fetchTemplateReminder(params)),
        showTemplateReminder: (id) => dispatch(showTemplateReminder(id)),
        deleteTemplateReminder: (id) => dispatch(deleteTemplateReminder(id)),
        saveTemplateReminder: (id, payload) => dispatch(saveTemplateReminder(id, payload)),
        updateTemplateReminder: (id, payload) => dispatch(updateTemplateReminder(id, payload)),
        fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TemplateReminder));
