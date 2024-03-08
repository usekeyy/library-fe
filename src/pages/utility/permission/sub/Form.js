import React, {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';

const RouteForm = (props) => {
	const { register, errors, handleSubmit, watch } = useForm({});
  const password = useRef({});
  password.current = watch("password", "");
  const onSubmit = async data => {
		props.save(data)
  };

  return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
					<ModalBody>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Name</label>
							<div className="col-md-7">
								<input className="form-control" name="name" ref={register({required: true})} defaultValue={props.data.name || ''}/>
								{errors.name && <span className="text-danger">* This field is required</span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Username</label>
							<div className="col-md-7">
								<input className="form-control" name="username" ref={register({required: true})} defaultValue={props.data.username || ''} />
								{errors.username && <span className="text-danger">* This field is required</span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">email</label>
							<div className="col-md-7">
								<input
									name="email"
									className="form-control"
									defaultValue={props.data.email || ''}
									ref={register({
										required: "Required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "invalid email address"
										}
									})}
								/>
								{errors.email && <span className="text-danger">{errors.email.message}</span>}
							</div>
						</div>
						{props.uuid === null && (
							<div>
								<div className="form-group row m-b-15">
									<label className="col-md-3 col-form-label">Password</label>
									<div className="col-md-7">
										<input
											name="password"
											type="password"
											className="form-control"
											ref={register({
												required: "You must specify a password",
												minLength: {
													value: 6,
													message: "Password must have at least 6 characters"
												}
											})}
										/>
										{errors.password && <span className="text-danger">{errors.password.message}</span>}
									</div>
								</div>
								<div className="form-group row m-b-15">
									<label className="col-md-3 col-form-label">Ulangi password</label>
									<div className="col-md-7">
										<input
											name="re_password"
											className="form-control"
											type="password"
											ref={register({
												validate: value =>
													value === password.current || "The passwords do not match"
											})}
										/>
										{errors.re_password && <span className="text-danger">{errors.re_password.message}</span>}
									</div>
								</div>
							</div>
						)}
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Password</label>
							<div className="col-md-7">
								{/* <input className="form-control" name="password" ref={register({required: true})} defaultValue={props.data.password || ''} />
								{errors.password && <span className="text-danger">* This field is required</span>} */}
								<input
									name="password"
									type="password"
									className="form-control"
									ref={register({
										required: "You must specify a password",
										minLength: {
											value: 6,
											message: "Password must have at least 6 characters"
										}
									})}
								/>
								{errors.password && <span className="text-danger">{errors.password.message}</span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Ulangi password</label>
							<div className="col-md-7">
								{/* <input className="form-control" name="re_password" ref={register({required: true})} defaultValue={props.data.re_password || ''} />
								{errors.re_password && <span className="text-danger">* This field is required</span>} */}
								<input
									name="re_password"
									className="form-control"
									type="password"
									ref={register({
										validate: value =>
											value === password.current || "The passwords do not match"
									})}
								/>
								{errors.re_password && <span className="text-danger">{errors.re_password.message}</span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Roles</label>
							<div className="col-md-7">
								<Select 
								multi={false}
								options={props.m_role} 
								value={props.data.role}
								labelKey="name"
    						valueKey="id" />
								{/* <input className="form-control" name="roles" ref={register({required: true})} defaultValue={props.data.roles || ''} />
								{errors.roles && <span className="text-danger">* This field is required</span>} */}
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
								<button className="btn btn-white" onClick={() => props.toggleClose()}>Close</button>
								<button className="btn btn-success" type="submit">Submit</button>
					</ModalFooter>
			</form>
		</div>
  );
}

export default RouteForm;