import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import { Panel, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = (props) => {
    // const { t } = props;
    // const { register, control, handleSubmit, setValue, getValues } = useForm({});
    // const [edocument, setEdocument] = React.useState()
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'formula'],
            ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }

    const handleChange = (e) => {
        props.setData(e)
    }

    return (
        <div>
            <div className="m-t-5">
                <div className="form-group row">
                    <div className="col-sm-12">
                        <ReactQuill
                            value={props.text}
                            name="edocument"
                            modules={modules}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(QuillEditor);