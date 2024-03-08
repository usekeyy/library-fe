import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
// import withFixedColumns from "react-table-hoc-fixed-columns";
import ModalForm from'./sub/Modal';
import { fetchReminder, showReminder, updateReminder } from '../../../store/actions/expediting/reminderActions'
import SweetAlert from 'react-bootstrap-sweetalert';
import FilterDate from '../../../components/filterdate/FilterDate';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
import {debounce} from '../../../helpers/debounce';
// import { statusName } from '../../../helpers/statusName';
import moment from 'moment';

class Reminder extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            param_modal: [],
            params: {
                id: '',
                po_eproc_number: '',
                po_sap_number: '',
                reminder_date: '',
                purchasing_requisition_number: '',
                item_no: '',
                item_desc: '',
                waiting_days: '',
                seq: '',
                task:'',
                status: '',
                remindered:'1',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Sent', value: '1', isChecked: false },
                { name: 'Waiting', value: '0', isChecked: false },
            ],
            total: 0,
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalType: '',
            isConfirm: false,
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit:false
        }
        this.defaultSorted = [
            {
                id: "remindered",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "No. PO Eproc",
                accessor: "po_eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_eproc_number} />
                ),
            },
            {
                Header: "No. PO SAP",
                accessor: "po_sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_sap_number} />
                )
            },
            {
                Header: "No. PR",
                accessor: "purchasing_requisition_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_requisition_number" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_requisition_number} />
                )
            },
            {
                Header: "Item PR",
                // width: 180,
                accessor: "item_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="item_no" onChange={(event) => this.onChanged(event)} value={this.state.params.item_no} />
                )
            },
            {
                Header: "Description",
                accessor: "item_desc",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="item_desc" onChange={(event) => this.onChanged(event)} value={this.state.params.item_desc} />
                )
            },
            {
                Header: "Sequence",
                accessor: "seq",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="seq" onChange={(event) => this.onChanged(event)} value={this.state.params.seq} />
                )
            },
            {
                Header: "Task",
                accessor: "task_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="task" onChange={(event) => this.onChanged(event)} value={this.state.params.task} />
                ),
            },
            {
                Header: "Tgl Reminder",
                id: "reminder_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.reminder_date} />
                ),
                Cell: ({ value }) => (
                    value.reminder_date !== null && value.reminder_date !== '' && 
                    <label>{moment(value.reminder_date).format("DD-MM-YYYY")}</label>
                )
            },
            // {
            //     Header: "Waiting Days",
            //     accessor: "waiting_days",
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="waiting_days" onChange={(event) => this.onChanged(event)} value={this.state.params.waiting_days} />
            //     )
            // },
            // {
            //     Header: "Status",
            //     id: "remindered",
            //     accessor: d => d.remindered,
            //     Filter: ({ filter, onChange }) => (
            //         <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
            //     ),
            //     Cell: ({ value }) => (
            //         <label>{this.statusName(value)}</label>
            //     )
            // },
            {
                Header: "Action",
                filterable: false,
                // width: 180,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <center>
                            <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={(e) => this.toggleFormOpen(e, d.original.uuid, d.original, 'detail')} >Detail</button>
                        </center>
                    </React.Fragment>
                )
            },
        ];
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

    statusName = (payload) => {
        if (payload.toString() === '1') {
            return 'Sent'
        } else if (payload.toString() === '0') {
            return 'Waiting'
        }
    }
    fetchData = async (params) => {
        this.setState({ loading: true })
        this.props.fetchReminder(params)
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
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        this.setState({
            params: someProperty
        }, () => {
            this.debounced(someProperty);
        });
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
            this.fetchData(filters)
        })
    }

    reminder_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.reminder_date = date;
        } else {
            filters.reminder_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
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
            this.fetchData(filters)
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.remindered = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters))
        } else {
            filters.remindered = [];
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }
    
    toggleFormOpen = (e, value, data, type) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid, modalType: type, param_modal: data })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, modalType: '' })
    }

    edits(e, value) {
        this.props.history.push('/expediting/list-progress/detail/' + value)
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

	onResetFilter = (val) => {
        val.remindered = '1'
		this.setState({
            params: val
        }, () => this.fetchData(val));    
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
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Expediting</li>
                    <li className="breadcrumb-item active">Reminder</li>
                </ol>
                <h1 className="page-header">Reminder</h1>
                <Panel loading={false}>
                    <PanelHeader>List Reminder</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
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
                                    onSortedChange={val => {this.changeSorted(val) }}
                                    onPageSizeChange={(length) => {this.changePageSize(length)}}
                                    onPageChange={(perPage) => {this.changePage(perPage)}}
                                    options={this.state.params}
                                    className="-highlight"
                                    pages={this.state.pages}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                {this.state.modalOpen &&
                    <ModalForm
                        errors={this.state.errors}
                        toggleAdd={this.state.modalOpen}
                        modalType={this.state.modalType}
                        showReminder={this.props.showReminder}
                        updateReminder={this.props.updateReminder}
                        uuid={this.state.uuid}
                        loadingSubmit={this.state.loadingSubmit}
                        save={this.savePayload}
                        update={this.updatePayload}
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
		access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchReminder: (params) => dispatch(fetchReminder(params)),
        showReminder: (id) => dispatch(showReminder(id)),
        updateReminder: (id, payload) => dispatch(updateReminder(id, payload)),
        // fetchVillages: (params) => dispatch(fetchVillages(params)),
        // fetchDistricts: (params) => dispatch(fetchDistricts(params)),
        // deleteVillages: (id) => dispatch(deleteVillages(id)),
        // saveVillages: (id, payload) => dispatch(saveVillages(id, payload)),
        // fetchRegions: (params) => dispatch(fetchRegions(params)),
        // fetchCountries: (params) => dispatch(fetchCountries(params)),
        // fetchSubDistricts: (params) => dispatch(fetchSubDistricts(params)),
    }
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Reminder));
