
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

class TinyEditor extends React.Component {

  
  handleEditorChange = (e) => {
    console.log(
      'Content was updated:',
      e.target.getContent()
    );
  }

  config = {
    height: 500,
    menubar: false,
    plugins: [
        'advlist lists link image',
        'charmap print  help',
        ' visualblocks',
        'insertdatetime wordcount'
      ],
    toolbar:
      'undo redo | formatselect | bold italic | \
      alignleft aligncenter alignright | \
      bullist numlist outdent indent | help'
  }

  token = localStorage.getItem('token')
  idDocument = '123'

  render() {
    return (
      <Editor
        key={this.idDocument}
        apiKey="m72qvl9fc2laefm5e6peengo0fxiok5003ao9qi808e0pgn5"
        initialValue="<p>Initial content</p>"
        cloudChannel='5-dev'
        init={{
         ...this.config,
         plugins : 'rtc ' + this.config.plugins.join(' '),
         rtc_document_id : this.idDocument,
        //  rtc_encryption_provider: () => Promise.resolve({ key: 'jfnroxodcrn61widggq2jo5jjxklw71jlqwlfh91crby37jj'}),
        //  rtc_token_provider: ({ idDocument }) => Promise.resolve({ token }),
        }}
        onChange={this.handleEditorChange}
      />
    );
  }
}

export default TinyEditor;