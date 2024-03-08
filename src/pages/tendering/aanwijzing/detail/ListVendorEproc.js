import React, { Component } from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { fetchAanwijzingListCreate } from '../../../../store/actions/tendering/aanwijzingActions';
import { formatDate } from '../../../../helpers/formatDate';
// import FilterDate from '../../../../components/filterdate/FilterDate';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ListVendorEproc extends Component {

    constructor(props) {
        super(props)

        this.state = {
            params: {
                no: '',
                reference: '',
                proposal_tender_no: '',
                versi: '',
                registration_end_date :'',
                quotation_end_date:'',
                pr:'',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false
        }

        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }

        ];
        this.columns = [
            {
                Header: "",
                id: "uuid",
                accessor: d => d.uuid,
                filterable: false,
                sortable:false,
                height: 10,
                Cell: d =>
                (
                    <React.Fragment>
                        <div>
                            <input type="radio" name="proposal_tender_uuid" value={d.original.uuid} onChange={(event) => props.handleChangeRadio(d.original.uuid)} />
                        </div>
                    </React.Fragment>
                )
            },
            {
                Header: "number",
                id: "number",
                accessor: d => d.number,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "No. PR",
                id: "pr",
                accessor: d => d.pr.join(';'),
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="pr" onChange={(event) => this.onChanged(event)} value={this.state.params.pr} />
                )
            },
            {
                Header: "Tanggal Batas Registrasi",
                id: "registration_end_date",
                accessor: d => formatDate(d.registration_end_date,true),
                Filter: ({ filter, onChange }) => (
                    <input placeholder="yyyy-mm-dd" className="form-control" name="registration_end_date" onChange={(event) => this.onChanged(event)} value={this.state.params.registration_end_date} />
                    // <FilterDate type="registration_end_date" getDate={this.registration_end_date} />
                )
            },
            {
                Header: "Tanggal Closing",
                id: "quotation_end_date",
                accessor: d => formatDate(d.quotation_end_date,true),
                Filter: ({ filter, onChange }) => (
                    <input placeholder="yyyy-mm-dd" className="form-control" name="quotation_end_date" onChange={(event) => this.onChanged(event)} value={this.state.params.quotation_end_date} />
                    // <FilterDate type="quotation_end_date" getDate={this.quotation_end_date} />
                )
            }
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
        this.props.handleChangeRadio("");
        this.props.fetchAanwijzingListCreate(this.state.params)
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
        this.props.history.push('/tendering/aanwijzing-vendor/detail/' + value)
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

    registration_end_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.registration_end_date = date;
        } else {
            filters.registration_end_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    quotation_end_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.quotation_end_date = date;
        } else {
            filters.quotation_end_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    render() {
        return (
            <div>
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
                    className="-highlight"
                    pages={this.state.pages}
                    page={this.state.page}
                    onFetchData={(state, instance) => {
                        this.req(state);
                    }}
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
        fetchAanwijzingListCreate: (params) => dispatch(fetchAanwijzingListCreate(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListVendorEproc));
