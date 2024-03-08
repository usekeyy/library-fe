import React, { Component } from 'react';
// import {connect} from 'react-redux';
// import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
// import { withTranslation } from 'react-i18next';
// import { RowEmpty } from '../../../../../../components/tableoptions/TableOptions';


class ModalRekapNegosiasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_evaluasi : [],
            title_modal : "tes",
            loading : false
        }
    }


    toggleCloseModal = () => {
        this.props.toggleClose()
    }

    componentDidMount = () => {
		// this.getDetailEvaluasi()
    }

    render() {
        const {data} = this.props;
        
        return (
            <div>
                <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleCloseModal()}>
                    <ModalHeader toggle={() => this.toggleCloseModal()}>
                        Rekap Negosiasi
                    </ModalHeader>
                    <ModalBody>
                        <Panel>
                            <PanelHeader>Detail Item Penawaran</PanelHeader>
                            
                            <PanelBody >
                                <div>Status Quote : <span className="text-red"><i>Deviate</i></span></div>
                                <br></br>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-wrap">
                                            <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Tender</th>
                                                        <th>Penawaran</th>
                                                    </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><b>No PR</b></td>
                                                    <td>{data?.pr_number}</td>
                                                    <td>{data?.pr_number}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>PR Item</b></td>
                                                    <td>{data?.item_no}</td>
                                                    <td>{data?.item_no}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Jenis Item</b></td>
                                                    <td>{data?.tipe}</td>
                                                    <td>{data?.tipe}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Material No</b></td>
                                                    <td>{data?.material_id}</td>
                                                    <td>{data?.material_id}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Spesifikasi</b></td>
                                                    <td>{data?.pr_spesifikasi}</td>
                                                    <td>{data?.spesifikasi}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Quantity</b></td>
                                                    <td align="right">{data?.pr_qty}</td>
                                                    <td align="right">{data?.qty}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Currency</b></td>
                                                    <td>{data?.currency}</td>
                                                    <td>{data?.currency}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Delivery Time</b></td>
                                                    <td align="right">{data?.delivery_time}</td>
                                                    <td align="right">{data?.delivery_time}</td>
                                                </tr>
                                                
                                            </tbody>
                                    </table>
                            </div>
                            </PanelBody>
                        </Panel>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleCloseModal()}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ModalRekapNegosiasi;