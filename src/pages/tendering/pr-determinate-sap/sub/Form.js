import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { Row } from 'reactstrap';
// import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import {toastr} from 'react-redux-toastr';
const animatedComponents = makeAnimated();


const Form = (props) => {
    // const { t } = props
    const {  handleSubmit, control } = useForm();
    const onSubmit = async data => {
        console.log(data)
        props.putPrSourceDeterminateSap(props.uuid, []);
    };

    // const customStyles = {
    //     control: (base, state) => ({
    //       ...base,
    //       borderColor: state.isFocused ?
    //         '#ddd' : 'red',
    //     })
    //   }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <label className="col-form-label">Source Determinate</label>
                            <div className="col-lg-12">
                                <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                className="basic-multi-select"
                                classNamePrefix="select"
                                name="source"
                                control={control}
                                options={[{value:'erpoc', label:'E-Proc'}]} 
                                defaultValue={{value:'erpoc', label:'E-Proc'}}
                                isDisabled={true}
                                rules={{ required: false }}  />
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <label className="col-form-label">Assign To Buyer</label>
                            <div className="col-lg-12">
                                <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                className="basic-multi-select"
                                classNamePrefix="select"
                                name="buyyer"
                                control={control}
                                isDisabled={true}
                                options={[{value:props.data.assign_to_buyer, label:props.data.assign_to_buyer_name}]} 
                                defaultValue={{value:props.data.assign_to_buyer, label:props.data.assign_to_buyer_name}}
                                rules={{ required: false }}  />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="pull-right m-t-5 m-b-5">
                            <button
                                disabled={props.loadings.loadingBtnModal}
                                type="submit"
                                className="btn btn-warning m-r-5">
                                {props.loadings.loadingBtnModal && <i className="fa fa-spinner fa-spin"></i>}
                                    Update
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default withTranslation()(Form);