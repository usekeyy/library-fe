import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FormEdoc = (props) => {
    const { control } = useForm({});
    // const [edocument, setEdocument] = React.useState()
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
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
            [{ 'align': [] }],
            ['link', 'formula'],
            // ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }

    // const onSubmit = async data => {
    //     props.summaryStore(data)
    // }

    return (
        <div>
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                <div className="m-t-5">
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <Controller
                                as={ReactQuill}
                                name="edocument"
                                defaultValue={props.data}
                                modules={modules}
                                control={control}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>
            {/* </form> */}
        </div>
    );
}

export default withTranslation()(FormEdoc);