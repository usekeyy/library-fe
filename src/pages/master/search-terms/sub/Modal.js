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
                code : "",
                descriptions : "",
            },
            loading: false
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
            this.props.showSearchTerms(id)
            .then((resp) => {
            let data = resp.data.data;
            let dataSend = {...this.state.dataSend}
            // dataSend.id = data.id;
            dataSend.code = data.code;
            dataSend.description = data.description;
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
                        {this.props.uuid !== "" ? t("searchterms:modal.title-update") : t("searchterms:modal.title-create") }
                        {/* Judul Modal */}
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
            </div>
        )
    }
}

export default withTranslation() (ModalForm)
