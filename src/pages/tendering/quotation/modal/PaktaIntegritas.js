import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import Term from './Term';

const PaktaIntegritas = (props) => {
		const { t } = props;
		const { handleSubmit } = useForm({});
		const {header} = props.parentState.quotation;
		const {loadings} = props.parentState;

		const onSubmit = async data => {
			if(props.parentState.paramType === 'detail'){
				props.submit()
			}
			if(props.parentState.paramType === 'update'){
				props.update()
			}
		};

    return (
        <div>
					<form onSubmit={handleSubmit(onSubmit)}>
							<ModalBody>
								<div className="row">
									<div className="col-sm-12">
										<Term header={header} parentState={props.parentState} pakta_integritas={props.parentState.pakta_integritas} userName={props.parentProps.user.name.toUpperCase()} />
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} disabled={loadings.button}>{t("currency:button.close")}</button>
								<button className="btn btn-success" type="submit" disabled={loadings.button}> 
								{loadings.button && <i className="fa fa-spinner fa-spin"></i>}
								Submit </button>
							</ModalFooter>
						</form>
        </div>
    );
}

export default withTranslation()(PaktaIntegritas);
