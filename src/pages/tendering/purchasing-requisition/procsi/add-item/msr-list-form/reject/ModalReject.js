import React, { Component } from 'react';
// import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { Modal, ModalHeader } from 'reactstrap';
import FormReject from './FormReject';


class ModalReject extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {

        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {

        }
    }

    toggleClose = () => {
        // this.props.toggleClose();
    };

    componentWillUnmount = () => {
        this._isMounted = false
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    toggleClose = () => {
        this.props.toggleClose()
    }

    saveData = (payload) => {
        console.log(payload)
        this.props.reject(payload)
    }


    render() {
        // const { t } = this.props;
        return (
            <div>
                <Modal isOpen={this.props.isConfirmReject} toggle={() => this.toggleClose()}>
                    <ModalHeader toggle={() => this.toggleClose()}>Modal Reject</ModalHeader>
                    <FormReject
                        btnDisabled={this.props.btnDisabled}
                        toggleClose={() => this.toggleClose()}
                        saveData={(payload) => this.saveData(payload)}
                    />
                </Modal>
            </div>
        );
    }
}
const stateToProps = state => {
    return {
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {

    }
}

export default connect(stateToProps, dispatchToProps)((ModalReject));
