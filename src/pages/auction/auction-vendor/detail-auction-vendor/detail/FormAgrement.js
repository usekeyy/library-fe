import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel } from '../../../../../containers/layout/sub/panel/panel';
// import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// const animatedComponents = makeAnimated();


const FormAgrement = (props) => {
    // const { t } = props;
    const {handleSubmit, control } = useForm();
    const [status , setStatus] = React.useState("");
    const modules = {
        toolbar: [
            // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            // ['blockquote', 'code-block'],
            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction
            // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'font': [] }],
            // [{ 'align': [] }],
            // ['link', 'formula'],
            // ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }

    const onSubmit = async (data) => {
       console.log(status)
       props.storeAuctionVendorAggrement({"is_vendor_aggrement" : status })
    }

    const reject  = () => {
        setStatus("r");
    }
    const accept  = () => {
        setStatus("y");
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Panel>                   
                    <div className="col-lg-12">
                        <Controller
                            as={ReactQuill}
                            name="rule"
                            defaultValue={props.data?.rule}
                            modules={modules}
                            control={control}
                            readOnly={true}
                        />
                    </div>
                    <div className="col-lg-12 m-t-10">
                        <center>
                        <button
                            type="submit"
                            onClick={reject}
                            className="btn btn-danger m-r-5"
                            disabled={props.loadings.loading_submit_aggrement}
                        >
                            {props.loadings.loading_submit_aggrement && <i className="fa fa-spinner fa-spin"></i> } 
                            Tolak</button>
                        <button
                            type="submit"
                            onClick={accept}
                            className="btn btn-success m-r-5"
                            disabled={props.loadings.loading_submit_aggrement}
                        >
                            {props.loadings.loading_submit_aggrement && <i className="fa fa-spinner fa-spin"></i> } 
                            Terima
                        </button>
                        </center>
                    </div>
                </Panel>
            </form>
        </div>
    );
}

export default withTranslation()(FormAgrement);
