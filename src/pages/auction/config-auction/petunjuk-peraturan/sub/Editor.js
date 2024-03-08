import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const Editor = (props) => {
    const { t } = props;
    const { register, control } = useFormContext();
    const [status, setStatus] = React.useState("")
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

    const saveDraft  = () => {
        setStatus("n");
    }
    const publish  = () => {
        setStatus("p");
    }


    return (
        <div>
            <Panel>
                <PanelHeader>
                    {t("auction:panel.rules-auction")}
                </PanelHeader>
                <PanelBody>
                    <div className="col-lg-12">
                        <Controller
                            as={ReactQuill}
                            name="rule"
                            defaultValue={props.data?.rule}
                            modules={modules}
                            control={control}
                            readOnly={((props.header?.status!=='n') ? true : false)}
                        />
                    </div>
                    <div className="row pull-right m-t-10">
                        <input type="hidden" name="status" ref={register()} defaultValue={status}/>
                        {(props.access.C || props.access.U) &&
                        <button
                            type="submit"
                            onClick={publish}
                            className="btn btn-success m-r-5"
                            disabled={(props.header?.order_placement === "itemize" && props.header?.is_retender_itemize.includes('p')) ? true : (props.loadings.loading_publish_auction || ((props.header?.status!=='n') ? true : false))}
                        >
                            {props.loadings.loading_publish_auction && <i className="fa fa-spinner fa-spin"></i> } 
                            {t("auction:button.publish")}
                        </button>
                        }
                        {(props.access.C || props.access.U) &&
                        <button
                            type="submit"
                            onClick={saveDraft}
                            className="btn btn-white m-r-5"
                            disabled={(props.header?.order_placement === "itemize" && props.header?.is_retender_itemize.includes('p')) ? true  : (props.loadings.loading_publish_auction || ((props.header?.status!=='n') ? true : false))}
                        >
                            {props.loadings.loading_publish_auction && <i className="fa fa-spinner fa-spin"></i> } 
                            {t("auction:button.save-draft")}</button>
                        }
                        <button
                            type="button"
                            className="btn btn-white m-r-5"
                            onClick={()=>props.toAuctionList()}
                        >
                            {t("auction:button.cancel")}
                        </button>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Editor);
