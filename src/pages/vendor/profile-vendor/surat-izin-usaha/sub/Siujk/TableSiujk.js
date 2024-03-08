import React, {Component} from 'react';
import ReactTable from 'react-table';
import withFixedColumns from "react-table-hoc-fixed-columns";
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import {statusVerifikasi, statusName} from '../../../../../../helpers/statusName';

import ReactTablePagination from '../../../../../../components/paginations/ReactTablePagination';
import {siujkGroupByClassification} from '../../../../../../helpers/globalHelper';
import {groupBy} from '../../../../../../helpers/globalHelper';
import { formatDate } from '../../../../../../helpers/formatDate';
import { withTranslation } from 'react-i18next';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class TableSiujk extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;

        this.state = {
            data: [],
            datas: [],
            options: {
                start: 0,
                length: 10,
                sorted_column: 1,
                order: 'asc',
                page: 0,
                source : this.props.isInternal ? 'master' : ''
            },
            uuid: '',
            isConfirm: false,
            errors: [],
            total: 0
        }
        this.defaultSorted = [
            {
                id: "number",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: () => this.props.t("profileVendor:siujk-number"),
                id: "number",
                accessor: d => d.number
            }, {
                Header: () => this.props.t('profileVendor:siujk-file'),
                id: "file",
                accessor: d => d.file,
                Cell: ({original}) => (
					<React.Fragment>
                        <a href="/" onClick={ (e) => this.checkFileTemp(e,original.file)}>{original.file}</a>
						{/* <a target="_blank" rel="noopener noreferrer" href={(original.tipe_verifikasi === 'sudah_diverifikasi' || original.tipe_verifikasi === 'tambah_data' || original.tipe_verifikasi === 'submit_pendaftaran') ? `${process.env.REACT_APP_API_BASE_URL}files/vendor/${original.file}` : `${process.env.REACT_APP_API_BASE_URL}files/temp/${original.file}`} > {original.file} </a> */}
					</React.Fragment>
				)
            }, {
                Header: () => this.props.t('profileVendor:siujk-valid-from'),
                id: "start_date",
                accessor: d => formatDate(d.start_date,false)
            }, {
                Header: () => this.props.t('profileVendor:siujk-valid-to'),
                id: "end_date",
                accessor: d => formatDate(d.end_date,false)
            }, {
                Header: () => this.props.t('profileVendor:siujk-published-by'),
                id: "issued_by",
                accessor: d => d.issued_by
            }, {
                Header: () => this.props.t('profileVendor:siujk-clasification'),
                id: "classification_id",
                accessor: d => d,
                filterable: false,
                sortable: false,
                width: 650,
                Cell: val => (
                <React.Fragment>
                    <center>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Klasifikasi</th>
                                    <th>Sub Klasifikasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    val.sub_classification !== null && this.state.data.data !== null && this.state.data.data.length > 0 && this.state.datas[val.value.number].map((item, key) => (
                                        <React.Fragment key={key}>
                                            <tr key={key}>
                                                <td rowSpan={
                                                    item.sub_classification !== null ? (JSON.parse(item.sub_classification).length > 0) ? JSON.parse(item.sub_classification).length+1 : JSON.parse(item.sub_classification).length : 0 }>
                                                        {`${item.classification_id} - ${item.classification_name}`}
                                                </td>
                                            </tr>
                                            {item.sub_classification !== null && JSON.parse(item.sub_classification).map((sub, keySub) => (
                                                <React.Fragment key={keySub}>
                                                        {(sub.vendor_classification_id === item.classification_id) &&
                                                                <tr key={keySub}><td>{`${sub.id} - ${sub.name}`}</td></tr>
                                                        }
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))
                                }
                            </tbody>
                        </table>
                    </center>
                </React.Fragment>
                )
            }, {
                Header: () => this.props.t('profileVendor:siujk-qualification'),
                id: "vendor_qualification_id",
                accessor: d => `${d.vendor_qualification_id} - ${d.qualification_name}`
            }, {
                Header: () => this.props.t('profileVendor:siujk-primary'),
                id: "main",
                accessor: d => (d.main === 'y') ? "SIUJK Utama" : '-'
            }, {
                Header: "Status",
                id: "status",
                accessor: d => statusName(d.status),
              },
              {
                Header: () => this.props.t("profileVendor:status-expired"),
                id: "status_expired",
                accessor: d => d.status_expired,
              },
              {
                Header: () => this.props.t("profileVendor:status-verifikasi"),
                id: "tipe_verifikasi",
                accessor: d => statusVerifikasi(d.tipe_verifikasi),
              }, {
                Header: "Action",
                id: "action",
                accessor: d => d,
                className: "sticky",
				headerClassName: "sticky",
				fixed: "right",
                filterable: false,
                sortable: false,
                Cell: ({value}) => (
                    <React.Fragment>
                        {this.props.verification_uuid !== false && <center>
                            {this.props.access.U && this.props.isVendor && !this.props.has_draft_verification && <button disabled={this.props.verification.verifLength > 0} className="btn btn-xs btn-warning" onClick={(e) => this.props.showSiujk(this.props.user_uuid, value.uuid)} ><span className="fa fa-edit"></span> </button>}
							{this.props.access.U && this.props.isVendor && !this.props.has_draft_verification && <button disabled={this.props.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.handleDelete(value.uuid)} ><span className="fa fa-trash"></span></button>}
							{this.props.access.A && !this.props.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.props.verification.verifLength > 0} className="btn btn-xs btn-primary" onClick={(e) => this.props.saveVerificationItem(this.props.user_uuid, value.uuid, this.props.path, { status: 'y' })}><span className={ (this.props.siujk.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-check"} disabled={this.props.siujk.loadingButton}></span> </button>}
							{this.props.access.A && !this.props.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.props.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.props.saveVerificationItem(this.props.user_uuid, value.uuid, this.props.path, { status: 'n' })}><span className={ (this.props.siujk.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-times"} disabled={this.props.siujk.loadingButton}></span></button>}
                        </center>}
                    </React.Fragment>
                )
            }
        ];
    }

    componentDidMount = () => {
        this._isMounted = true;
        const { childRef } = this.props;
        childRef(this);
        if (this._isMounted) {
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { childRef } = this.props;
        childRef(undefined);
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
      }

      checkFileTemp = async (e,file) => {
        e.preventDefault()
        let url = `${process.env.REACT_APP_API_BASE_URL}files/vendor/${file}`
        let url2 = `${process.env.REACT_APP_API_BASE_URL}files/temp/${file}`
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        try {
            http.send();
            if (http.status!==404){
                window.open(url)
            }else{
                window.open(url2)
            }
        } catch (error) {
            window.open(url)
        } 
    }

    asyncData = async (params) => {
        this.props.setLoadingForm(false);
        this.setState({loading: true})
        this.props.setLoadingForm(false);
        this
            .props
            .fetchSiujk(this.props.user_uuid, params)
            .then((resp) => {
                if (this._isMounted) {
                    // console.log(siujkGroupByClassification(resp.data.data));
                    // console.log(groupBy(resp.data.data, "number")["ORD000000186"]);
                    let lengthPage = Math.ceil(
                        parseInt(resp.data.recordsFiltered) / this.state.options.length
                    );
                    this.setState({loading: false, total: lengthPage, data: resp.data, datas: groupBy(resp.data.data, "number")}, () => {
                        var found = false;
                        const arr = [];
                        let temp = false;
                        for(var i = 0; i < this.state.data.data.length; i++) {
                            if (this.state.data.data[i].status === 'y'){
                                arr.push(this.state.data.data[i].status);
                            }
                            if (this.state.data.data[i].status === 'n') {
                                // console.log("ooke");
                                found = true;
                                break;
                            }

                            if (this.state.data.data[i].tipe_verifikasi === 'update_data' || this.state.data.data[i].tipe_verifikasi === 'submit_pendaftaran' || this.state.data.data[i].tipe_verifikasi === 'tambah_data' || this.state.data.data[i].tipe_verifikasi === 'hapus_data'){
                                this.props.setStatusDraftVerif(true)
                                temp = true
                            }else{
                                !temp && this.props.setStatusDraftVerif(false)
                            }
                        }
                        this.props.checkStatus(found, resp.data.data.length, arr.length)
                        this.props.setLoadingForm(false)
                    });
                }
            })
            .catch((resp) => {
                this.setState({loading: false})
                let message = (typeof resp !== 'undefined')
                    ? resp.message
                    : 'Something Wrong';
                toastr.error(message);
            });
    }

    fetchData = () => {
        this.asyncData(this.state.options)
    }

    changePage = (perPage) => {
        if (this._isMounted) {
            let lengthPage = Math.ceil(
                parseInt(this.state.data.recordsFiltered) / this.state.options.length
            );
            let optDt = {
                ...this.state.options
            }
            let numb = 0;
            numb = perPage;
            if (numb > 0) {
                numb = perPage * this.state.options.length;
            }
            optDt.start = numb;
            optDt.page = perPage;
            // optDt.length = state;
            this.setState({
                total: lengthPage,
                options: optDt
            }, () => this.fetchData());
        }
    }

    changePageSize = (length) => {
        if (this._isMounted) {
            let lengthPage = Math.ceil(
                parseInt(this.state.data.recordsFiltered) / this.state.options.length
            );
            let optDt = {
                ...this.state.options
            }
            optDt.start = 0;
            optDt.page = 0;
            optDt.length = length;
            this.setState({
                total: lengthPage,
                options: optDt
            }, () => this.fetchData());
        }
    }

    changeSorted = (val) => {
        if (this._isMounted) {
            let optDt = {
                ...this.state.options
            }
            optDt.column = val[0].id;
            optDt.dir = (
                val[0].desc
                    ? 'desc'
                    : 'asc'
            );
            this.setState({
                options: optDt
            }, () => this.fetchData());
        }
    }

    handleDelete = (value) => {
        this.setState({ uuid: value, isConfirm: true})
    }
    
    toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
                case 'confirm':
                    this.setState({ isConfirm: false }, () => {
                        this.props.delete(this.state.uuid)
					    this.setState({ uuid: '' });
                    });
					break;
				case 'cancel':
					this.setState({ isConfirm: false, uuid: '' });
					break;
				default:
					break;
			}
		}
    }

    render() {
        return (
            <div>
                <ReactTableFixedColumns
                    columns={this.columns}
                    filterable={false}
                    loading={this.state.loading}
                    manual="manual"
                    minRows={1}
                    PaginationComponent={ReactTablePagination}
                    pageSizeOptions={[10, 20, 25, 50, 100]}
                    recordsTotal={this.state.data.recordsTotal}
                    recordsFiltered={this.state.data.recordsFiltered}
                    data={(this.state.data.data !== undefined && this.state.data.data !== null) ? (this.state.data.data.length > 0) ? siujkGroupByClassification(this.state.data.data) : [] : []}
                    defaultPageSize={10}
                    defaultSorted={this.defaultSorted}
                    pages={this.state.total}
                    page={this.state.options.page}
                    offResetFilter={true}
                    onSortedChange={val => {
                        this.changeSorted(val)
                    }}
                    onPageSizeChange={(length) => {
                        this.changePageSize(length)
                    }}
                    onPageChange={(perPage) => {
                        this.changePage(perPage)
                    }}
                    className="-highlight"/> {
                    (
                        this.state.isConfirm && <SweetAlert
                            warning
                            showCancel={true}
                            confirmBtnText="Yes, delete it!"
                            cancelBtnText="Cancel"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title="Apakah anda yakin ?"
                            onConfirm={() => this.toggleSweetAlert('confirm')}
                            onCancel={() => this.toggleSweetAlert('cancel')}>
                            Delete This Data?
                        </SweetAlert>
                    )
                }
            </div>
        );
    }
}

export default withTranslation() (TableSiujk);