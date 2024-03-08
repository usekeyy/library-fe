import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ConfigQuillEditor = (props) => {
    const { t } = props;
    const { control, handleSubmit , register} = useForm({});
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

    const onSubmit = async data => {
        props.data.document_item_title = data.title
        props.data.document_item_content = data.edocument
        props.save(props.indexEdoc, props.data)
    }


    return (
        <div className="col-sm-12">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="m-t-5">
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label>Title :</label>
                            <input className="form-control col-sm-12" ref={register({required:true})} name="title" defaultValue={props.data.document_item_title} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <Controller
                                as={ReactQuill}
                                name="edocument"
                                defaultValue={props.data.document_item_content}
                                modules={modules}
                                control={control}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <div className="pull-right m-t-5 m-b-5">
                                <button
                                    type="submit"
                                    className="btn btn-success m-r-5">
                                    {t("common:Button.Kirim")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default withTranslation()(ConfigQuillEditor);