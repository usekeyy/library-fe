import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = (props) => {
    const { t } = props;
    const { control, handleSubmit } = useForm({});
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
        props.summaryStore(data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="m-t-5">
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <Controller
                                as={ReactQuill}
                                name="edocument"
                                defaultValue={props.text}
                                modules={modules}
                                control={control}
                                readOnly={!props.button}
                            />
                        </div>
                    </div>
                    {props.button && props.status_aanwijzing!=="close" && !(new Date(props.end_date) < new Date(localStorage.getItem("times"))) &&
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
                    }
                </div>
            </form>
        </div>
    );
}

export default withTranslation()(QuillEditor);