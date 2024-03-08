import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';
// import FilterDate from '../../../../components/filterdate/FilterDate';
import { formatNumber } from '../../../../helpers/formatNumber';
// import { getSummaryEAuction } from '../../../../store/actions/dashboard/dashboardTenderAction';
import { downloadExcelPerformanceReport } from '../../../../store/actions/vendor/performanceReportActions';
import { fetchDetailSummary } from '../../../../store/actions/dashboard/detail-tender/detailDashboard';

class DetailSummaryAuction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            currency: "",
            metode_auction: "",
            purchasing_org_id: "",
            params: {
                currency : this.props.match.params.currency,
                auction_number : "",
                proposal_tender_no : "",
                source : "",
                total_value : "",
                total_best_price : "",
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
			statusSearch: [
                {name: 'Aktif', value: 'aktif', isChecked: false},
                {name: 'Suspend', value: 'suspend', isChecked: false},
                {name: 'Banned', value: 'banned', isChecked: false},
			],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalPunishment: false,
            isConfirm: false,
            status: '',
            uuid: '',
            company_id: '',
            company_name: '',
            error: false,
            errors: {},
            loadingSubmit: false,
            // recordsTotal : 0,
            recordsFiltered: 0
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "No",
                accessor : "uuid",
                filterable : false,
                sortable : false,
                width : 60,
                Cell : ({index}) => (
                    <div>
                        <center>
                            {index + 1 + this.state.params.start}
                        </center>   
                    </div>
                    
                )
            },
            {
                Header: "No Auction",
				id: "auction_number",
				accessor: d => d.auction_number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="auction_number" onChange={(event) => this.onChanged(event)} value={this.state.params.auction_number} />
                ),
			},
            {
                Header: "No Tender",
				id: "proposal_tender_no",
				accessor: d => d.proposal_tender_no,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                ),
			},
            {
                Header: "Source",
				id: "source",
				accessor: d => d.source,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="source" onChange={(event) => this.onChanged(event)} value={this.state.params.source} />
                ),
			},
            {
                Header: "Value",
				id: "total_value",
				accessor: d => formatNumber(d.total_value,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="total_value" onChange={(event) => this.onChanged(event)} value={this.state.params.total_value} />
                ),
                Cell : ({original}) => (
                    <div style={{textAlign:"right"}}>
                       {formatNumber(original.total_value,2)}
                    </div>                    
                )
			},
            {
                Header: "Total Best Price",
				id: "total_best_price",
				accessor: d => formatNumber(d.total_best_price,2),
                filterable: false,
                sortable : false,
				// Filter: ({ filter, onChange }) => (
				// 	<input className="form-control" name="total_best_price" onChange={(event) => this.onChanged(event)} value={this.state.params.total_best_price} />
                // ),
                Cell : ({original}) => (
                    <div style={{textAlign:"right"}}>
                       {formatNumber(original.total_best_price,2)}
                    </div>                    
                )
			},
        ];
    }

    componentDidMount() {
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
        var someProperty = { ...this.state }
        someProperty.params.currency=this.props.match.params.currency
        this.setState({someProperty});
        this.setState({ loading: true })
        this.props.fetchDetailSummary(this.props.match.params.id,this.state.params)
            .then((resp) => {                
                this.setState({
                    // data: resp.data.data,
                    data: resp.data.auction_detail.data,
                    pages: Math.ceil(parseInt(resp.data.auction_detail.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.auction_detail.recordsFiltered,
                    currency: resp.data.header.currency,
                    metode_auction: resp.data.header.metode_auction,
                    purchasing_org_id: resp.data.header.purchasing_org_id,
                })
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            })
            .then(() => {
                this.setState({ loading: false })
            })
    }
	
    onChanged(event) {
        var someProperty = { ...this.state.params }
        if(event.target.name==="jumlah_eproc" || event.target.name==="jumlah_free" || event.target.name==="total_eproc" || event.target.name==="total_free"){
            someProperty[event.target.name] = event.target.value.toString().replace(/\./g,'').replace(/,/g,'')
        }else{
            someProperty[event.target.name] = event.target.value
        }
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
        this.setState({ page: arr.page })
        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        // console.log(stateArr)
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
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
        
    }

    valid_start = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.valid_start = date;
        } else {
            filters.valid_start = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    validity_end = (date = '') => {
        let filters = { ...this.state.params }
        filters.end = 0;
        filters.page = 0;
        if (date !== '') {
            filters.validity_end = date;
        } else {
            filters.validity_end = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelPerformanceReport()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'PerformanceReport.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState({loadingSubmit: false})
                // if (res.data.status == 'success'){
                //     toastr.success(res.data.message);
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }else{
                //     toastr.success("Gagal Sync");
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }
			})
			.catch(error => {
                // console.log(error)
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loadingSubmit: false});
				} else {
					this.setState({loadingSubmit: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
    }
    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}

    render() {
        return (
            <div>
                <Panel collapse={false}>
                    <PanelHeader>
                        Report Summary E-Auction
                    </PanelHeader>
                    <PanelBody>
                            <Col sm="12">
                                <div>
                                    <table className="table table-sm text-nowrap">
                                      <tbody>
                                          <tr>
                                              <td width="25%">Purchasing Organization</td>
                                              <td>: {this.state.purchasing_org_id} </td>
                                          </tr>
                                          <tr>
                                              <td>Currency</td>
                                              <td>: {this.state.currency}</td>
                                          </tr>
                                          <tr>
                                              <td>Metode Auction</td>
                                              <td>: {this.state.metode_auction}</td>
                                          </tr>
                                      </tbody>
                                   </table>
                                </div>
                                <br/>
                                <br/>
                            </Col>
                            <ReactTable
                                // loading={false}
                                
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
                                // recordsTotal={this.state.recordsTotal}
                                recordsFiltered={this.state.recordsFiltered}
                                length={this.state.params.length}
                                start={this.state.params.start}
                                pages={this.state.pages}
                                onResetFilter={val => this.onResetFilter(val)}
                                options={this.state.params}
                                page={this.state.page}
                                onFetchData={(state, instance) => {
                                    this.req(state);
                                }}
                            />
                    </PanelBody>
                </Panel>
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        user: state.auth.user.data,
        access: state.sidebarDt.access,
    }
}

const dispatchToProps = dispatch => {
	return {
		fetchDetailSummary: (id,params) => dispatch(fetchDetailSummary(id,params)),
        downloadExcelPerformanceReport : () => dispatch(downloadExcelPerformanceReport()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (DetailSummaryAuction));