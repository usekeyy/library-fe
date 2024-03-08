import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
// import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

import Form from './Form'

class ModalForm extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            dataSend : {
                kelompok : "",
                min_point : "",
                max_point : "",
                color : ""
            },
            loading: false,
            options : [
                {label : "Actived" , value : "y"},
                {label : "Inactived" , value : "n"}
            ]
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

    componentWillUnmount = () => {
        this._isMounted = false;
        this.setState = (state,callback)=>{
            return;
        };
    }

    showByUUID = (id) => {
        if(this._isMounted){
            this.setState({loading: true})
            this.props.showKelompokPeforma(id)
            .then((resp) => {
            let data = resp.data.data;
            let dataSend = {...this.state.dataSend}
            // dataSend.id = data.id;
            dataSend.kelompok = data.kelompok;
            dataSend.min_poin = data.min_poin;
            dataSend.max_poin = data.max_poin;
            dataSend.dur_restricted = (data.dur_restricted==="y") ? {label : "Actived" , value : "y"} : {label : "Inactived" , value : "n"};
            dataSend.color = data.color;
            this.setState({dataSend, loading: false})
            })
            .catch((resp) => {
            this.setState({loading: false})
            toastr.error(resp.data?.message);
            });
        }
    }

    handleSave = (payload) => {
        console.log(payload)
		if(this._isMounted){
            if(this.props.uuid !== ""){
                // console.log("update")
                this.props.update(payload, this.props.uuid);
            } else {
                this.props.save(payload);
                console.log("add")
            }
        }
  }

    render() {
        const {t} = this.props;
        return (
            <div>
                <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
                    <ModalHeader toggle={() => this.toggleClose()}>
                    {this.props.uuid !== "" ? t("kelompokPeforma:modal.title-update") : t("kelompokPeforma:modal.title-create") }
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
                        options = {this.state.options}
                        save={(payload) => this.handleSave(payload)}
                        errors={this.props.errors}
                    />
                    )}
                </Modal>
            </div>
        )
    }
}

export default withTranslation() (ModalForm)
