import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Header = (props) => {
		const { t } = props;
		const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
		const { register, control } = useFormContext();
		const {header} = props.parentState.proposal_tender;
		const {items} = props.parentState.proposal_tender;
		const {errors} = props.parentState.proposal_tender;
		const {uuid} = props.parentState;
		const {loading} = props.parentState.proposal_tender;
		const {loadings} = props.parentState;
		const {user} = props.parentProps;

		let purchasingGroup = [];
		const arrTemp = [];

		const removeDuplicity = (datas) => {
				return datas.filter((item, index,arr)=>{
				const c = arr.map(item=> item.value);
				return  index === c.indexOf(item.value)
			})
		}
		
		if (items.length > 0){
			items.forEach((item, key) => {
				if(arrTemp.indexOf(item)){
					arrTemp.push({value: item.purchasing_group_id, label: `${item.purchasing_group_id} - ${item.purchasing_group_name}`})
				}
			})
			purchasingGroup = removeDuplicity(arrTemp);
		}


    return (
			<div>
				<Panel>
					<PanelHeader>Header</PanelHeader>
					{loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loading &&
					<PanelBody>
						<Row>
							<Col sm="12">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Created by</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="created_by_name" ref={register({})} className="form-control" placeholder="" defaultValue={(uuid !== "") ? user.name : header.created_by_name} />
												{errors.created_by_name && <span className="text-danger">{errors.created_by_name[0]}</span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">No Proposal Tender</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="number" ref={register({})} className="form-control" placeholder="" defaultValue={(uuid !== "") ? header.number : ''} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Referensi</label>
										<div className="col-sm-10">
												<input type="text" readOnly={false} name="reference" ref={register({})} className="form-control" placeholder="" defaultValue={(uuid !== "") ? header.reference : ''} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Judul Proposal Tender <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<input type="text" readOnly={false} name="title" ref={register({})} className={(errors['header.title']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(uuid !== "") ? header.title : ''} />
												{errors['header.title'] && <span className="text-danger"> {errors['header.title'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Purchasing Group <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.metode_aanwijzing ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.metode_aanwijzing}
													className="basic-multi-select"
													classNamePrefix="select"
													name="purchasing_group_id"
													styles={errors['header.purchasing_group_id'] ? customStyles : {}}
													control={control}
													options={purchasingGroup} 
													defaultValue={header.purchasing_group_id}
													rules={{ required: false }} 
													isClearable={false} />
												{errors['header.purchasing_group_id'] && <span className="text-danger"> {errors['header.purchasing_group_id'][0]} </span>}
										</div>
								</div>
							</Col>
						</Row>
					</PanelBody>
					}
				</Panel>
			</div>
    );
}

export default withTranslation()(Header);