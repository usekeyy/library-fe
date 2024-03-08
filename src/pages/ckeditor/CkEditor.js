import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

// import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
// import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';

class App extends Component {

    sidebarElementRef = React.createRef();
	presenceListElementRef = React.createRef();

    render() {
        return (
            <div className="App">
                <h2>Using CKEditor 5 build in React</h2>
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
                    config={{
                        plugin :[

                        ],
                        toolbar: [
                            'heading',
                            '|',
                            'fontsize',
                            'fontfamily',
                            '|',
                            'bold',
                            'italic',
                            'underline',
                            'strikethrough',
                            'removeFormat',
                            'highlight',
                            '|',
                            'alignment',
                            '|',
                            'numberedList',
                            'bulletedList',
                            '|',
                            'link',
                            'blockquote',
                            'imageUpload',
                            'insertTable',
                            'mediaEmbed',
                            '|',
                            'undo',
                            'redo',
                            '|',
                            'comment',
                            '|',
                            'trackChanges'
                        ],
                    }}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }

                />
            </div>
        );
    }
}

export default App;
