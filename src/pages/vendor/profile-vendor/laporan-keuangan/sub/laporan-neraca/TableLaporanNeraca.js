import React, {Component} from 'react';
import ReactTable from 'react-table';
import withFixedColumns from "react-table-hoc-fixed-columns";
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import {statusVerifikasi, statusName} from '../../../../../../helpers/statusName';
import ReactTablePagination from '../../../../../../components/paginations/ReactTablePagination';
import {formatNumber} from '../../../../../../helpers/formatNumber';
import { withTranslation } from 'react-i18next';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class TableLaporanNeraca extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;

        this.state = {
            data: [],
            options: {
                start: 0,
                length: 10,
                sorted_column: 1,
                order: 'asc',
                page: 0,
                source : this.props.isInternal ? 'master' : ''
            },
            isConfirm: false,
            uuid: '',
            errors: [],
            total: 0
        }
        this.defaultSorted = [
            {
                id: "tahun_laporan",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: () => this.props.t("profileVendor:laporan-neraca-tahun"),
                id: "tahun_laporan",
                accessor: d => d.tahun_laporan
            }, {
                Header: () => this.props.t("profileVendor:laporan-neraca-matauang"),
                id: "currency_id",
                accessor: d => d.currency_id
            }, {
                Header: () => this.props.t("profileVendor:laporan-neraca-nilai-asset"),
                id: "nilai_aset",
                accessor: d => formatNumber(d.nilai_aset)
            }, {
                // Header: () => this.props.t("profileVendor:laporan-neraca-aktiva"),
                Header: "Aktiva",
                id: "aktiva",
                accessor: d => d,
                filterable: false,
                sortable: false,
                width: 250,
                Cell: ({value}) => (
                <React.Fragment>
                        <center>
                            <table className="table table-bordered">
                                <thead>
                                </thead>
                                <tbody>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-aktiva-lancar")}</b></small> </td>
                                                <td> <small>{formatNumber(value.aktiva_lancar)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-aktiva-selain")}</b></small> </td>
                                                <td> <small>{formatNumber(value.aktiva_tetap_selain_tanah)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-aktiva-tanah")}</b></small> </td>
                                                <td> <small>{formatNumber(value.aktiva_tetap_tanah)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-aktiva-lain")}</b></small> </td>
                                                <td> <small>{formatNumber(value.aktiva_tetap_lain)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>Total</b></small> </td>
                                                <td> <small>{formatNumber(parseInt(value.aktiva_lancar)+parseInt(value.aktiva_tetap_selain_tanah)+parseInt(value.aktiva_tetap_tanah)+parseInt(value.aktiva_tetap_lain))}</small></td>
                                        </tr>
                                    </tbody>
                            </table>
                        </center>
                </React.Fragment>
                )
            }, {
                Header: "Pasiva",
                id: "pasiva",
                accessor: d => d,
                filterable: false,
                sortable: false,
                width: 200,
                Cell: ({value}) => (
                <React.Fragment>
                        <center>
                            <table className="table table-bordered">
                                <thead>
                                </thead>
                                <tbody>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-hutang-pendek")}</b></small> </td>
                                                <td> <small>{formatNumber(value.hutang_jangka_pendek)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-hutang-panjang")}</b></small> </td>
                                                <td> <small>{formatNumber(value.hutang_jangka_panjang)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-hutang-lain")}</b></small> </td>
                                                <td> <small>{formatNumber(value.hutang_lain)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>{this.props.t("profileVendor:laporan-neraca-permodalan")}</b></small> </td>
                                                <td> <small>{formatNumber(value.permodalan)}</small> </td>
                                        </tr>
                                        <tr>
                                                <td> <small><b>Total</b></small> </td>
                                                <td> <small>{formatNumber(parseInt(value.hutang_jangka_pendek)+parseInt(value.hutang_jangka_panjang)+parseInt(value.hutang_lain)+parseInt(value.permodalan))}</small></td>
                                        </tr>
                                    </tbody>
                            </table>
                        </center>
                </React.Fragment>
                )
            }, {
                Header: () => this.props.t("profileVendor:laporan-neraca-file"),
                id: "file",
                width: 250,
                accessor: d => d.file,
                Cell: ({original}) => (
					<React.Fragment>
                        <a href="/" onClick={ (e) => this.checkFileTemp(e,original.file)}>{original.file}</a>
						{/* <a target="_blank" rel="noopener noreferrer" href={(original.tipe_verifikasi === 'sudah_diverifikasi' || original.tipe_verifikasi === 'tambah_data' || original.tipe_verifikasi === 'submit_pendaftaran') ? `${process.env.REACT_APP_API_BASE_URL}files/vendor/${original.file}` : `${process.env.REACT_APP_API_BASE_URL}files/temp/${original.file}`} > {original.file} </a> */}
					</React.Fragment>
				)
            }, {
                Header: "Status",
                id: "status",
                accessor: d => statusName(d.status),
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
                            {this.props.access.U && this.props.isVendor && !this.props.has_draft_verification && <button disabled={this.props.verification.verifLength > 0} className="btn btn-xs btn-warning" onClick={(e) => this.props.showLaporanNeraca(this.props.user_uuid, value.uuid)} ><span className="fa fa-edit"></span> </button>}
							{this.props.access.U && this.props.isVendor && !this.props.has_draft_verification && <button disabled={this.props.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.handleDelete(value.uuid)} ><span className="fa fa-trash"></span></button>}
							{this.props.access.A && !this.props.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.props.verification.verifLength > 0} className="btn btn-xs btn-primary" onClick={(e) => this.props.saveVerificationItem(this.props.user_uuid, value.uuid, this.props.path, { status: 'y' })}><span className={ (this.props.laporan_neraca.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-check"} disabled={this.props.laporan_neraca.loadingButton}></span> </button>}
							{this.props.access.A && !this.props.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.props.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.props.saveVerificationItem(this.props.user_uuid, value.uuid, this.props.path, { status: 'n' })}><span className={ (this.props.laporan_neraca.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-times"} disabled={this.props.laporan_neraca.loadingButton}></span></button>}
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
        this.setState({loading: true})
        this.props.setLoadingForm(false);
        this
            .props
            .fetchLaporanNeraca(this.props.user_uuid, params)
            .then((resp) => {
                if (this._isMounted) {
                    let lengthPage = Math.ceil(
                        parseInt(resp.data.recordsFiltered) / this.state.options.length
                    );
                    this.setState({loading: false, total: lengthPage, data: resp.data}, () => {
                        var found = false;
                        const arr = [];
                        let temp = false;
                        for(var i = 0; i < this.state.data.data.length; i++) {
                            if(this.state.data.data[i].status === 'y'){
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
        this.setState({uuid: value, isConfirm: true})
    }

    toggleSweetAlert(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({
                        isConfirm: false
                    }, () => {
                        this
                            .props
                            .delete(this.state.uuid)
                        this.setState({uuid: ''});
                    });
                    break;
                case 'cancel':
                    this.setState({isConfirm: false, uuid: ''});
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
                    useBlockLayout
                    columns={this.columns}
                    filterable={false}
                    loading={this.state.loading}
                    manual="manual"
                    minRows={1}
                    PaginationComponent={ReactTablePagination}
                    pageSizeOptions={[10, 20, 25, 50, 100]}
                    recordsTotal={this.state.data.recordsTotal}
                    recordsFiltered={this.state.data.recordsFiltered}
                    data={this.state.data.data}
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
                            showCancel="showCancel"
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

export default withTranslation() (TableLaporanNeraca);