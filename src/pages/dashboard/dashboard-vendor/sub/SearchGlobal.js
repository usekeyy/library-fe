import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

const SearchGlobal = (props) =>  {
    const { handleSubmit,register } = useForm({});

    const onSubmit = data => {
        console.log(data)
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group row m-b-15">
                    <div className="col-md-5 col-push-7">
                        <input type="text" className="form-control" name="name" ref={register({required: false})} placeholder="search" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default withTranslation()(SearchGlobal);
