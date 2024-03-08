import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchBidOpening  } from '../../../store/actions/tendering/bidOpeningActions'
import { Modal, ModalHeader } from 'reactstrap';
import { formatNumber } from '../../../helpers/formatNumber';
import { formatDate } from '../../../helpers/formatDate';
import FilterDate from '../../../components/filterdate/FilterDate';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class BidOpening extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                proposal_tender_no:'',
                title:'',
                closing_date:'',
                total_value:'',
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
                Header:() => this.props.t("bidOpening:label.number-proposal-tender"),
                id :"proposal_tender_no",
                accessor: d => d.proposal_tender_no,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header:() => this.props.t("bidOpening:label.description"),
                id: "title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                ),
            },
            {
                Header: () => this.props.t("bidOpening:label.value"),
                id: "total_value",
                accessor: d => d.total_value,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="total_value" onChange={(event) => this.onChanged(event)} value={this.state.params.total_value} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
            },
            {
                Header:() => this.props.t("bidOpening:label.closing-date"),
                id: "clossing_date",
                accessor: d => formatDate(d.clossing_date,false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="clossing_date" getDate={this.clossing_date} />
                )
            },
            // {
            //     Header: () => this.props.t("bidOpening:label.status"),
            //     id: "status",
            //     accessor: d=>d.status_bid,
            //     // accessor: d => (d.status !=="" && d.status_aanwijzing!==null) ? d.status_aanwijzing  : (new Date().getTime()/1000 < new Date(d.start_date +" "+d.start_time).getTime()/1000) ? 'Waiting' : (new Date().getTime()/1000 > new Date(d.start_date +" "+d.start_time).getTime()/1000 && new Date().getTime()/1000 < new Date(d.end_date +" "+d.end_time).getTime()/1000) ? "Live" : (new Date().getTime()/1000 > new Date(d.end_date +" "+d.end_time).getTime()/1000) ? "Close" : "", 
            //     filterable:false,
            //     Cell: ({ value }) => (
            //         <label>{value}</label>
            //     )
            // },
            {
                Header: () => this.props.t("bidOpening:label.action"),
                filterable: false,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <div>
                            <button className="btn btn-xs btn-warning m-r-5" value={d.original.uuid} onClick={(e) => this.edits(e,d.original.uuid)}  >Process</button>
                            {/* <button className="btn btn-xs btn-info" >History</button> */}
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
        this.props.fetchBidOpening(this.state.params)
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
        this.props.history.push('/tendering/bid-opening/' + value)
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

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
    }
    
    clossing_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.clossing_date = date;
        } else {
            filters.clossing_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }
    
    render() {
        return (
            <div>
            <ol className="breadcrumb float-xl-right">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Tendering</li>
                <li className="breadcrumb-item active">Bid Opening</li>
            </ol>
            <h1 className="page-header">Bid Opening<small></small></h1>
            <Panel loading={false} className="margin-bot-false">
                <PanelHeader>
                   Bid Opening
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

            <Modal isOpen={this.state.modalRegistration} toggle={() => this.toggleCloseModalRegistration()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleCloseModalRegistration()}>Modal Registration</ModalHeader>
            
            </Modal>

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
        fetchBidOpening: (params) => dispatch(fetchBidOpening(params)),
        // registrationAanwijzing: (id,payload) => dispatch(registrationAanwijzing(id,payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(BidOpening));