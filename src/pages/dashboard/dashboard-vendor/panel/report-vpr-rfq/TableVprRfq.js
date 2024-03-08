import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';

import ReactTablePagination from '../../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../../components/filterstatus/FilterStatus';
import { getVendorVprRfqTable,downloadExcelVendorRFQ } from '../../../../../store/actions/dashboard/dashboardVendorAction';
import { formatNumber } from '../../../../../helpers/formatNumber';
import { formatDate } from '../../../../../helpers/formatDate';

class TableVprRfq extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            // approval: {
            //     status: '',
            //     name: '',
            // },
            params: {
                purchasing_org_name: "",
                ranking: "",
                sap_code:"",
                vendor_name : "",
                total : "",
                kelompok :"",
                status :"",
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
			statusSearch: [
                {name: 'Aktif', value: 'aktif', isChecked: false},
                {name: 'Suspend', value: 'suspend', isChecked: false},
                {name: 'Blacklist', value: 'Blacklist', isChecked: false},
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
                Header: "RFQ",
				id: "rfq",
				accessor: d => d.rfq,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="rfq" onChange={(event) => this.onChanged(event)} value={this.state.params.rfq} />
                )
			},
            {
                Header: "Purchasing Organization",
				id: "purchasing_org_id",
				accessor: d => d.purchasing_org_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
                ),
			},
            {
                Header: "Purchasing Group",
				id: "purchasing_group_id",
				accessor: d => d.purchasing_group_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_group_id} />
                )
			},
            {
                Header: "Vendor Number",
				id: "vendor_id",
				accessor: d => d.vendor_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                )
			},
            {
                Header: "Vendor Name",
				id: "vendor_name",
				accessor: d => d.vendor_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
			},
            {
                Header: "City",
				id: "city",
				accessor: d => d.city,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="city" onChange={(event) => this.onChanged(event)} value={this.state.params.city} />
                )
			},
            {
                Header: "Score RFQ",
				id: "skor_rfq",
				accessor: d => d.skor_rfq,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="skor_rfq" onChange={(event) => this.onChanged(event)} value={this.state.params.skor_rfq} />
                )
			},
            {
                Header: "Tanggal RFQ",
				id: "tanggal_rfq",
				accessor: d => formatDate(d.tanggal_rfq,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="tanggal_rfq" onChange={(event) => this.onChanged(event)} value={this.state.params.tanggal_rfq} />
                )
			},
            {
                Header: "Quotation Deadline",
				id: "quote_deadline",
				accessor: d => formatDate(d.quote_deadline,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="quote_deadline" onChange={(event) => this.onChanged(event)} value={this.state.params.quote_deadline} />
                )
			},
            {
                Header: "Quotation Date",
				id: "quotation_date",
				accessor: d => formatDate(d.quotation_date,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="quotation_date" onChange={(event) => this.onChanged(event)} value={this.state.params.quotation_date} />
                )
			},
            {
                Header: "Bid Opening Date",
				id: "bid_opening_date",
				accessor: d => formatDate(d.bid_opening_date,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="bid_opening_date" onChange={(event) => this.onChanged(event)} value={this.state.params.bid_opening_date} />
                )
			},
            {
                Header: "Vendor Quote Number",
				id: "vendor_quote_no",
				accessor: d => d.vendor_quote_no,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_quote_no" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_quote_no} />
                )
			},
            {
                Header: "Nilai Quotation (IDR)",
				id: "nilai_quote",
				accessor: d => d.nilai_quote,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nilai_quote" onChange={(event) => this.onChanged(event)} value={this.state.params.nilai_quote} />
                ),
                Cell : ({value}) => (
                    <React.Fragment>
                        <div className="pull-right">{formatNumber(value,2)}</div>
                    </React.Fragment>
                )
			},
            {
                Header: "Reject Reason",
				id: "reason_reject",
				accessor: d => d.reason_reject,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="reason_reject" onChange={(event) => this.onChanged(event)} value={this.state.params.reason_reject} />
                )
			},
            {
                Header: "Status Of Bid",
				id: "status_of_bid",
				accessor: d => d.status_of_bid,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="status_of_bid" onChange={(event) => this.onChanged(event)} value={this.state.params.status_of_bid} />
                )
			},
            {
                Header: "Searchterms",
				id: "search_term",
				accessor: d => d.search_term,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="search_term" onChange={(event) => this.onChanged(event)} value={this.state.params.search_term} />
                )
			},
            {
                Header: "DUR No",
				id: "rfq",
				accessor: d => d.rfq,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="rfq" onChange={(event) => this.onChanged(event)} value={this.state.params.rfq} />
                )
			},

            {
                Header: "EPROC/ECC",
				id: "eproc_ecc",
				accessor: d => d.eproc_ecc,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="eproc_ecc" onChange={(event) => this.onChanged(event)} value={this.state.params.eproc_ecc} />
                ),
                Cell : ({value}) => (
                    <div>
                        EPROC
                    </div>
                )
			},

        ];
    }

    setStatus(value){
        if (value === "Active") {
            return <h5><span className="label label-success">{this.props.t("performanceReport:data-table.aktif")}</span></h5>
        }else if(value === "Suspend"){
            return <h5><span className="label label-warning">Suspend</span></h5>
        }else if(value === "Banned"){
            return <h5><span className="label label-danger">Banned</span></h5>
        }
    }

    setSoSHeader(bidangUsahaId, bidangUsahaName){
        const temp = bidangUsahaId?.map((item, index) => {
            return (
                <li key={index} style={{listStyleType : "none"}}>
                    {item + ' ' + bidangUsahaName[index]}
                </li>
            )
        })

        return temp
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
        this.setState({ loading: true })
        this.props.getVendorVprRfqTable(this.state.params)
            .then((resp) => {
                
                this.setState({
                    // data: resp.data.data,
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered
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

    downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelVendorRFQ()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Report_Vendor_RFQ.xlsx'); //or any other extension
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
      params: val
    }, () => this.asyncData());    
	}
    
    render() {
        return (
            <div>
                <Col sm="12">
                    <div className="pull-right">
                        {/* <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.syncVprButton()}>
                            Sync {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                        </Button> */}
                        <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.downloadExcel()} >Download Excel 
                        {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                        </Button>
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
                    page={this.state.page}
                    onResetFilter={val => this.onResetFilter(val)}
                    options={this.state.params}
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
        user: state.auth.user.data,
        access: state.sidebarDt.access,
    }
}

const dispatchToProps = dispatch => {
	return {
		// fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		getVendorVprRfqTable: (params) => dispatch(getVendorVprRfqTable(params)),
        downloadExcelVendorRFQ : () => dispatch(downloadExcelVendorRFQ()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableVprRfq));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));