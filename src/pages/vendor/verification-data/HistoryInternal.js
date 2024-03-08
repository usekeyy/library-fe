import React, { Component } from 'react';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
// import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { Modal, ModalHeader } from 'reactstrap';
// import { statusName } from '../../../helpers/statusName';
// import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import History from './detail/History';

class HistoryInternal extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;

        this.state = {
            data: [],
            // options: {
            //     start: 0,
            //     length: 5,
            //     sorted_column: 1,
            //     column:'created_at',
            //     order: 'asc',
            //     page: 0,
            // },
            // loading: false,
            // isConfirm: false,
            uuid: '',
            // errors: [],
            // total: 0,
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
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            // this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
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
                {/* <Panel loading={false}>
                    <PanelHeader> Log {this.props.title} </PanelHeader>
                    <PanelBody loading={false}> */}
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <div className="pull-right m-b-10">
                                    <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this.toggleOpen(this.props.vendor_uuid, this.props.path)} > <i className="fa fa-table"></i> Log History</button>
                                </div>
                            </div>
                        </div>
                    {/* </PanelBody>
                </Panel> */}
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleClose()}>Log History</ModalHeader>
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

export default HistoryInternal;