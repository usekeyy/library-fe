import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchCurrencies, showCurrencies, deleteCurrencies, saveCurrencies, updateCurrencies } from '../../../store/actions/master/currenciesActions';

import ModalForm from './sub/Modal'
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';


class Currencies extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                short_text:'',
                long_text: '',
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
                Header: () => this.props.t("currency:label.short-text"),
                accessor: "short_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="shot_text" onChange={(event) => this.onChanged(event)} value={this.state.params.short_text} />
                )
            },
            {
                Header: () => this.props.t("currency:label.long-text"),
                accessor: "long_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="long_text" onChange={(event) => this.onChanged(event)} value={this.state.params.long_text} />
                )
            },
            {
                Header: () => this.props.t("currency:label.status"),
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
                Header: () => this.props.t("currency:label.created_at"),
                id: "created_at",
                accessor: d => formatDate(d.created_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: () => this.props.t("currency:label.updated_at"),
                id: "updated_at",
                accessor: d => formatDate(d.updated_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
            {
                Header: () => this.props.t("currency:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {this.props.access.U && <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>}
                            {this.props.access.D && <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>}
                        </center>
                    </React.Fragment>
                )
            },
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
        this.props.fetchCurrencies(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
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
        this.setState({
            params: someProperty
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
        this.setState({ modalOpen: false })
    }

    savePayload = (type,payload) => {
        if(type==="save"){
            this.setState({ loadingSubmit: true });
            this.props.saveCurrencies(payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
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
            this.props.updateCurrencies(id, payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
            })
            .catch((error) => {
                if(error !== undefined ){
                    toastr.error(error.data.message)
                    this.setState({ isError:true, errors: error.data.errors, loadingSubmit:false})
                }else{
                    toastr.error('Opps Somethings Wrong')
                }
            })
        }
    }

    deletePayload = (type) => {
         this.props.deleteCurrencies(type)
        .then((resp) => {
            this.setState({ isConfirm: false });
            toastr.success(resp.data.message);
            this.req()
        })
        .catch((error) => {
            console.log(error)
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
                    <li className="breadcrumb-item active">{t("currency:title")}</li>
                </ol>
                <h1 className="page-header">{t("currency:title")}  <small>Master {t("currency:title")}</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {t("currency:title")}
					</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                    {this.props.access.C && <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("currency:button.add")}</Button>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    data={this.state.data}
                                    columns={this.columns}
                                    PaginationComponent={ReactTablePagination}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    className="-highlight"
                                    pages={this.state.pages}
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
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
                        showCurrencies={this.props.showCurrencies}
                        save={this.savePayload}
                        update={this.updatePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        toggleClose={this.toggleFormClose}
                    />
                }
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
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
        fetchCurrencies: (params) => dispatch(fetchCurrencies(params)),
        showCurrencies: (id) => dispatch(showCurrencies(id)),
        deleteCurrencies: (id) => dispatch(deleteCurrencies(id)),
        saveCurrencies: (id, payload) => dispatch(saveCurrencies(id, payload)),
        updateCurrencies: (id, payload) => dispatch(updateCurrencies(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Currencies));
