import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { getListTableTaskEvaluasiTeknisVendor  } from '../../../../store/actions/tendering/evaluationTechnicalActions'
import FilterDate from '../../../../components/filterdate/FilterDate';
import { formatDate } from '../../../../helpers/formatDate';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class KlarifikasiVendor extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                no:'',
                title:'',
                proposal_tender_no:'',
                version:'',
                start_date:'',
                company:'',
                aanwijzing_name:'',
                status_aanwijzing:'',
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
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            modalRegistration: false,
            loadings : {
                    loadingModalRegistration: false
            },
            dataRegistration :[],
            dataModalRegistration : {
                start_date :'',
                end_date:'',
                paket_no :'',
                title : '',
                uuid:''
            }
        }
        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }
        ];
        this.columns = [
            {
                Header:()=>this.props.t("evaluation:label.no-proposal-tender"),
                id :"proposal_tender_no",
                accessor: d => d.proposal_tender_no,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: ()=>this.props.t("evaluation:label.title"),
                id: "title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                ),
            },
            {
                Header:()=>this.props.t("evaluation:label.clarification-date"),
                id: "clarification_date",
                accessor: d => formatDate(d.clarification_date, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.clarification_date} />
                )
            },
            {
                Header:()=>this.props.t("evaluation:label.due-date"),
                id: "due_date",
                accessor: d => formatDate(d.due_date),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="due_date" getDate={this.due_date} />
                )
            },
            {
                Header: ()=> this.props.t("evaluation:label.action"),
                filterable: false,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <div>
                            <button className="btn btn-xs btn-warning m-r-5" value={d.original.uuid} onClick={(e) => this.edits(e,d.original)}  >Process</button>
                        </div>
                    </React.Fragment>
                )
            },
        ];
    }

    componentDidMount = () => {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.getListTableTaskEvaluasiTeknisVendor(this.state.params)
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
        someProperty.start = 0;
        this.setState({
            params: someProperty,
            page: 0
        }, () => { this.req() });
    }

    edits(e, value) {
        console.log(value)
        this.props.history.push('/task-vendor/klarifikasi-evaluasi/' + value.uuid)
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

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status_aanwijzing = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    clarification_date = (date = '') => {
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

    due_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.due_date = date;
        } else {
            filters.due_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
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
                <li className="breadcrumb-item">Tendering</li>
                <li className="breadcrumb-item active">{t("evaluation:panel-title.task-klarification")}</li>
            </ol>
            <h1 className="page-header">{t("evaluation:panel-title.task-klarification")}<small></small></h1>
            <Panel loading={false} className="margin-bot-false">
                <PanelHeader>
                {t("evaluation:panel-title.task-klarification")}
                </PanelHeader>
                <PanelBody loading={false}>
                    <Row>
                        <Col sm="12">
                            <ReactTableFixedColumns
                                filterable 
                                loading={this.state.loading}
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
        getListTableTaskEvaluasiTeknisVendor: (params) => dispatch(getListTableTaskEvaluasiTeknisVendor(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(KlarifikasiVendor))
