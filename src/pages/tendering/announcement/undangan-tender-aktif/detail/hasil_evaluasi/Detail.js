import React, { Component } from 'react';
import {connect} from 'react-redux';
// import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { getDetailEvaluasiMonitoringVendor } from '../../../../../../store/actions/tendering/proposalTenderActions';
import { RowEmpty } from '../../../../../../components/tableoptions/TableOptions';


class Detail extends Component {
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
		this.getDetailEvaluasi()
    }
    
    getDetailEvaluasi = () => {
        this.setState({loading : true})
        this.props.getDetailEvaluasiMonitoringVendor(this.props.uuid)
            .then((resp) => {
                this.setState({
                    data_evaluasi : resp.data.data,
                    loading : false
                })
                    
            })
            .catch((resp) => {
                this.setState({
                    loading : false
                })
                console.log(resp)
                // toastr.error(resp.data.message);
            })
    }

    setTitleModal = (type) => {
        switch(type){
            case "admin" :
                return "Evaluasi Admin"
            case "teknis" :
                return  "Evaluasi Teknis"
            case "komersil" : 
                return "Evaluasi Komersil"
            default :
                return null;
        }
    }

    render() {
        // const {t} = this.props;
        const {typeEvaluasi} = this.props;

        const selectType = (type) => {
            switch(type){
                case "admin" :
                    return <DetailEvaluasiAdminKomersial data={this.state.data_evaluasi} type="admin" titlePanel= {this.setTitleModal(typeEvaluasi)}></DetailEvaluasiAdminKomersial>
                case "teknis" :
                    return <DetailEvaluasiTeknis data={this.state.data_evaluasi} type="teknis" titlePanel= {this.setTitleModal(typeEvaluasi)}></DetailEvaluasiTeknis>
                case "komersil" :
                    return <DetailEvaluasiAdminKomersial data={this.state.data_evaluasi} type="komersil" titlePanel= {this.setTitleModal(typeEvaluasi)}></DetailEvaluasiAdminKomersial>
                default :
                    return null;
            }
        }
        
        return (
            <div>
                <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleCloseModal()}>
                    <ModalHeader toggle={() => this.toggleCloseModal()}>
                        {this.setTitleModal(typeEvaluasi)}
                    </ModalHeader>
                    {this.state.loading ? <ReactLoading type="cylon" color="#0f9e3e" /> :
                    <ModalBody>
                        {selectType(typeEvaluasi)}
                    </ModalBody>
                    }
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleCloseModal()}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

class DetailEvaluasiAdminKomersial extends Component {
    setPanelTitle = (type) => {

    }

    render() {
        let rows;
        if(this.props.type === "admin"){
            const {admin} = this.props.data;
            if (admin?.length > 0){
                rows = admin?.map((dt, i) => {
                                    return (
                                            <tr key={i}>
                                                    <td>{i+1}</td>
                                                    <td>{dt.description}</td>
                                                    <td>{dt.hasil}</td>
                                                    <td>{dt.keterangan}</td>
                                            </tr>
                                    )
                            })
            }else {
                rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
            }
        }else if(this.props.type === "komersil"){
            const {komersil} = this.props.data;
            if (komersil?.length > 0){
            rows = komersil?.map((dt, i) => {
                                return (
                                        <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>{dt.description}</td>
                                                <td>{dt.hasil}</td>
                                                <td>{dt.keterangan}</td>
                                        </tr>
                                )
                        })
            }else {
                rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
            }
        }

        return (
            <div>
                <Panel>
                    <PanelHeader>{this.props.titlePanel}</PanelHeader>
                    <PanelBody>
                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                        <tr>
                                                <th>No</th>
                                                <th>Description</th>
                                                <th>Evaluasi</th>
                                                <th>Catatan</th>
                                        </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                        </table>
                    </PanelBody>
                </Panel>
            </div>
        )
    }

}

class DetailEvaluasiTeknis extends Component {
    render() {
        const {teknis} = this.props.data
        const {tipe} = this.props.data
        // tipe = "sistem gugur"
        let data_persyaratan = ""
        let data_evaluasi_teknis = ""
        if (teknis?.length > 0){
            data_evaluasi_teknis = teknis.map((dt,i) => {
                return (
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{dt.description}</td>
                        {/* {(tipe === "ambang batas" || tipe === "sistem nilai" || tipe === "sistem_nilai")&&<td>{dt?.bobot}</td>}
                        {(tipe === "ambang batas" || tipe === "sistem nilai" || tipe === "sistem_nilai") ? <td>{dt.score}</td> : <td>{dt.status}</td>} */}
                        {(tipe !== "ambang batas" && tipe !== "sistem nilai" && tipe !== "sistem_nilai") && <td>{dt.status}</td>}
                        <td>{dt.catatan}</td>
                    </tr>
                )
            })
    
            if (tipe === "ambang batas" || tipe === "sistem nilai" || tipe === "sistem_nilai"){
                data_persyaratan = teknis.map((dt,i) => {
                    if (i === 0){
                        return (
                            <table className="table table-sm text-nowrap">
                                <thead>
                                        <tr>
                                                <th>Metode Evaluasi</th>
                                                <th>: Sistem Nilai</th>
                                        </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <label>Bobot Teknis</label>
                                        </td>
                                        <td>
                                        <input type="text" readOnly className="form-control" value={dt.bobot_teknis} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Bobot Komersial</label>
                                        </td>
                                        <td>
                                        <input type="text" readOnly className="form-control" value={dt.bobot_komersil} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Ambang Batas</label>
                                        </td>
                                        <td>
                                        <input type="text" readOnly className="form-control" value={dt.ambang_batas} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )
                        
                    }else{
                        return null;
                    }
                    
                })
            }else if(tipe === "sistem gugur" || tipe === "sistem_gugur"){
                data_persyaratan = teknis.map((dt,i) => {
                        if (i === 0){
                            return (
                                <table className="table table-sm text-nowrap">
                                    <thead>
                                            <tr>
                                                    <th>Metode Evaluasi</th>
                                                    <th>: Sistem Gugur</th>
                                            </tr>
                                    </thead>
                                </table>
                            )
                            
                        }else{
                            return null;
                        }
                        
                    })
            }
        }else {
            data_persyaratan = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
            data_evaluasi_teknis = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
        }

        
        return (
            <div>
                {   (tipe !== "ambang batas" && tipe !== "sistem nilai" && tipe !== "sistem_nilai") &&
                    <Panel>
                        <PanelHeader>Detail Persyaratan</PanelHeader>
                        <PanelBody>
                            {data_persyaratan}
                        </PanelBody>
                    </Panel>

                }

                <Panel>
                    <PanelHeader>{this.props.titlePanel}</PanelHeader>
                    <PanelBody>
                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                        <tr>
                                                <th>No</th>
                                                <th>Description</th>
                                                {/* {(tipe === "ambang batas" || tipe === "sistem nilai" || tipe === "sistem_nilai")&& <th>Bobot</th>} */}
                                                {(tipe !== "ambang batas" && tipe !== "sistem nilai" && tipe !== "sistem_nilai") && <th>Evaluasi</th>}
                                                <th>Catatan</th>
                                        </tr>
                                </thead>
                                <tbody>
                                    {data_evaluasi_teknis}
                                </tbody>
                        </table>
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
		temporary: state.temporary
	}
}

const dispatchToProps = dispatch => {
	return {
		getDetailEvaluasiMonitoringVendor: (uuid) => dispatch(getDetailEvaluasiMonitoringVendor(uuid))
	}
}


export default connect(stateToProps,dispatchToProps)( withTranslation() (Detail));