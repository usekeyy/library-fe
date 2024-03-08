import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../containers/layout/sub/panel/panel';


class QuillEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        this.modules = {
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
                [ 'link', 'image', 'video', 'formula' ], 
        
                ['clean']
            ],
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            }
        }
    }

    handleChange(value) {
        console.log(value)
    }

    render() {
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active"></li>
                </ol>
                <h1 className="page-header">Quill Editor<small>Master Quill Editor</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Quill Editor
					</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">

                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactQuill value={this.state.text}
                                    modules={this.modules}
                                    onChange={this.handleChange}
                                    
                                    />
                            </Col>
                        </Row>

                    </PanelBody>
                </Panel>


            </div>
        )
    }
}



export default QuillEditor;
