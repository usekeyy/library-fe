import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';

import { fetchChartOfAccount, saveChartOfAccount , updateChartOfAccount, showChartOfAccount, deleteChartOfAccount} from '../../../store/actions/master/chartOfAccountActions';

import ModalForm from './sub/Modal'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';


class ChartOfAccount extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.columns = [
            {
                Header: "Id",
                accessor: "id",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="id" onChange={(event) => this.onChanged(event)} value={this.state.params.id} />
                )
            },
            {
                Header: () => this.props.t("uom:label.name"),
                accessor: "name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="name" onChange={(event) => this.onChanged(event)} value={this.state.params.name} />
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
                Header: () => this.props.t("uom:label.created_at"),
                id: "created_at",
                accessor: d => formatDate(d.created_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: () => this.props.t("uom:label.updated_at"),
                id: "updated_at",
                accessor: d => formatDate(d.updated_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
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
                            <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>
                            <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>
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
            optionsChartOfAccount:[],
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
            loadingSubmit:false,
            loadings : {
                chart_of_account : false
            }
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
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
        this.setState({loading:true})
        this.props.fetchChartOfAccount(this.state.params)
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

    savePayload = (payload) => {
        if(this._isMounted){
            this.setState({loadingSubmit:true});
            this.props.saveChartOfAccount(payload)
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

    updatePayload = (id, payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.updateChartOfAccount(id, payload)
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
         this.props.deleteChartOfAccount(type)
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
    
    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Chart Of Account</li>
                </ol>
                <h1 className="page-header">Chart Of Account  <small>Master data Chart Of Account</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                    Chart Of Account
					</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                    <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("company:button.add")}</Button>
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
                        showChartOfAccount={this.props.showChartOfAccount}
                        save={this.savePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        optionsChartOfAccount= {this.state.optionsChartOfAccount}
                        update={this.updatePayload}
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
		access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchChartOfAccount: (params) => dispatch(fetchChartOfAccount(params)),
        showChartOfAccount: (id) => dispatch(showChartOfAccount(id)),
        deleteChartOfAccount: (id) => dispatch(deleteChartOfAccount(id)),
        saveChartOfAccount: (id, payload) => dispatch(saveChartOfAccount(id, payload)),
        updateChartOfAccount: (id, payload) => dispatch(updateChartOfAccount(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps) (withTranslation() (ChartOfAccount))

