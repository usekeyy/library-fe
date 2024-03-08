import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
// import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
// import SweetAlert from 'react-bootstrap-sweetalert';

import Form from './Form'

class ModalForm extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            dataSend : {
                item_penilaian : "",
                bobot : "",
                bobot_qs : "",
                lingkup : ""
            },
            loading: false,
            // confirmBobotQS: false,
            payload : {}
        }
    }

    toggleClose = () => {
        this.props.toggleClose()
    }

    componentDidMount = () => {
        this._isMounted = true;
        if(this._isMounted){
            if(this.props.uuid !== ''){
                this.showByUUID(this.props.uuid);
            }
        }   
    }

    showByUUID = (id) => {
        if(this._isMounted){
            this.setState({loading: true})
            this.props.showBobotPeforma(id)
            .then((resp) => {
            let data = resp.data.data;
            let dataSend = {...this.state.dataSend}
            // dataSend.id = data.id;
            dataSend.item_penilaian = data.item_penilaian;
            dataSend.bobot = data.bobot;
            dataSend.bobot_qs = data.bobot_qs;
            dataSend.lingkup = data.lingkup;
            this.setState({dataSend, loading: false})
            })
            .catch((resp) => {
            this.setState({loading: false})
            toastr.error(resp.data.message);
            });
        }
    }

    handleSave = (payload) => {
        console.log(payload)
		if(this._isMounted){
            if(this.props.uuid !== ""){
                // if(this.state.dataSend.item_penilaian == "Aspek Service" || this.state.dataSend.item_penilaian == "Aspek Quality"){
                //     this.setState({ payload : payload})
                // }else{
                //     this.props.update(payload, this.props.uuid);
                // }
                this.props.update(payload, this.props.uuid);
                
            } else {
                this.props.save(payload);
                console.log("add")
            }
        }
    }

    // toggleConfirm = (chooseButton) => {
    //     switch (chooseButton) {
    //         case 'confirm':
    //             this.setState({ isConfirm: false });
    //             this.props.update(this.state.payload, this.props.uuid);
    //             break;
    //         case 'cancel':
    //             this.setState({confirmBobotQS : false})
    //             break;
    //         default:
    //             this.setState({confirmBobotQS : false})
    //             break;
    //     }
        
    // }

    



    render() {
        const {t} = this.props;
        return (
            <div>
                <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
                    <ModalHeader toggle={() => this.toggleClose()}>
                        {/* {this.props.uuid !== "" ? t("district:modal.title-update") : t("district:modal.title-create") } */}
                        {t("bobotPeforma:modal.title-update")}
                    </ModalHeader>

                    {this.state.loading && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    
                    {this.state.loading === false && (
                    <Form 
                        data={this.state.dataSend}
                        uuid={this.props.uuid}
                        save={(payload) => this.handleSave(payload)}
                        errors={this.props.errors}
                    />
                    )}
                </Modal>
                {/* <SweetAlert
                    warning
                    show={this.state.confirmBobotQS}
                    showCancel
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={"Pastikan Jumlah Nilai Bobot Q/S adalah 100"}
                    onConfirm={() => this.toggleConfirm('confirm')}
                    onCancel={() => this.toggleConfirm('cancel')}
                />  */}
            </div>
        )
    }
}

export default withTranslation()(ModalForm)
