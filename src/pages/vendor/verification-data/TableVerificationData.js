import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { Modal, ModalHeader } from 'reactstrap';
// import { statusName } from '../../../helpers/statusName';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import History from './detail/History';

class TableVerificationData extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;

        this.state = {
            data: [],
            options: {
                start: 0,
                length: 5,
                // sorted_column: 1,
                column:'created_at',
                order: 'asc',
                page: 0,
            },
            loading: false,
            isConfirm: false,
            uuid: '',
            errors: [],
            total: 0,
            modalOpen: false,
            path: '',
            loadings: {
                modal: false
            }
        }
        this.defaultSorted = [
            {
                id: "created_at",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "Tanggal",
                id: "created_at",
                accessor: d => d.created_at,
            }, {
                Header: "Status",
                id: "status",
                accessor: d => (d.status === 'y') ? 'Setuju' : 'Tolak',
            }, {
                Header: "Keterangan",
                id: "note",
                accessor: d => d.note,
            }, {
                Header: "Diproses Oleh",
                id: "created_by_name",
                accessor: d => d.created_by_name,
            }
            , {
                Header: "Action",
                id: "action",
                accessor: "uuid",
                filterable: false,
                sortable: false,
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {<button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.handleDelete(value)} ><span className="fa fa-trash"></span></button>}
                        </center>
                    </React.Fragment>
                )
            }
        ];
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async (uuid, path, params) => {
        if (this._isMounted) {
            this.setState({loading: true})
            this.props.showVerification(uuid, path, params)
            .then((resp) => {
                const {data} = resp.data
                let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
                this.setState({loading: false, total: lengthPage, data: resp.data}, () => {
                    if(this.props.isVerifMultiple !== undefined && this.props.isVerifMultiple){
                        this.props.checkStatusLog(data.length)
                    }
                });
            })
            .catch((resp) => {
                this._isMounted = false && this.setState({loading: false})
                let message = (typeof resp !== 'undefined') ? resp.data.message : 'Something Wrong';
                toastr.error(message);
                window.location.assign("/error/404")
            });
        }
    }

    fetchData = () => {
        this.asyncData(this.props.verification_uuid, this.props.path, this.state.options)
    }

    changePage = (perPage) => {
        if (this._isMounted) {
            let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
            let optDt = { ...this.state.options }
            let numb = 0;
            numb = perPage;
            if (numb > 0) {
                numb = perPage * this.state.options.length;
            }
            optDt.start = numb;
            optDt.page = perPage;
            // optDt.length = state;
            this.setState({ total: lengthPage, options: optDt }, () => this.fetchData());
        }
    }

    changePageSize = (length) => {
        if (this._isMounted) {
            let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
            let optDt = { ...this.state.options }
            optDt.start = 0;
            optDt.page = 0;
            optDt.length = length;
            this.setState({ total: lengthPage, options: optDt }, () => this.fetchData());
            // console.log(this.state.options.start);
        }
    }

    changeSorted = (val) => {
        if (this._isMounted) {
            let optDt = { ...this.state.options }
            optDt.column = val[0].id;
            optDt.dir = (val[0].desc ? 'desc' : 'asc');
            this.setState({ options: optDt }, () => this.fetchData());
        }
    }

    handleDelete = (value) => {
        this.setState({ uuid: value, isConfirm: true })
    }

    toggleSweetAlert(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirm: false }, () => {
                        this.deleteVerificationItem(this.props.verification_uuid, this.state.uuid, this.props.path)
                        this.setState({ isConfirm: false });
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

    deleteVerificationItem = (uuid, item_uuid, path) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.deleteVerificationItem(uuid, item_uuid, path)
			.then((resp) => {
			    this.setState({loading: false, uuid: ''}, () => {
                    this.fetchData()
                    if (this.props.fetchData !== undefined){
                        this.props.fetchData()
                    }
                })
				toastr.success('Success Delete Verification Data');
			})
			.catch((resp) => {
				this.setState({loading: false, uuid: ''})
				toastr.error(resp.data.message, resp.data.errors);
			});
		}
    }
    
    toggleClose = () => {
		this.setState({ modalOpen: false, uuid: '', path: '' })
	}

	toggleOpen = (uuid, path) => {
		this.setState({ modalOpen: true, uuid: uuid, path: path });
	}

    render() {
        // const { t } = this.props;

        return (
            <div>
                <Panel loading={false}>
                    <PanelHeader> Log {this.props.title} </PanelHeader>
                    <PanelBody loading={false}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="pull-right m-b-10">
                                    <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.toggleOpen(this.props.vendor_uuid, this.props.path)} > <i className="fa fa-table"></i> Log History</button>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <ReactTable
                                    columns={this.columns}
                                    filterable={false}
                                    loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    PaginationComponent={ReactTablePagination}
                                    pageSizeOptions={[5, 10, 20, 30, 50]}
                                    recordsTotal={this.state.data.recordsTotal}
                                    recordsFiltered={this.state.data.recordsFiltered}
                                    data={this.state.data.data}
                                    defaultPageSize={5}
                                    defaultSorted={this.defaultSorted}
                                    pages={this.state.total}
                                    page={this.state.options.page}
                                    offResetFilter={true}
                                    onSortedChange={val => { this.changeSorted(val) }}
                                    onPageSizeChange={(length) => { this.changePageSize(length) }}
                                    onPageChange={(perPage) => { this.changePage(perPage) }}
                                    className="-highlight" />
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleClose()}>Log History {this.state.modalType} </ModalHeader>
                    {this.state.loadings.modal && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
                    {!this.state.loadings.modal && (
                    <History
                        parentState={this.state}
                        parentProps={this.props}
                        toggleClose={this.toggleClose}
                        showLogHistory={this.props.showLogHistory}
                    />)}
                </Modal>
                {(this.state.isConfirm &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText="Yes, delete it!"
                        cancelBtnText="Cancel"
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title="Apakah anda yakin ?"
                        onConfirm={() => this.toggleSweetAlert('confirm')}
                        onCancel={() => this.toggleSweetAlert('cancel')}
                    >
                        Delete This Data?
                </SweetAlert>
                )}
            </div>
        );
    }
}

export default TableVerificationData;