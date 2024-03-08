import React from 'react';
import { useFormContext} from 'react-hook-form';
import { Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import FileUploadInformation from '../../../../components/upload/FileUploadInformation';
// import { toastr } from 'react-redux-toastr';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { Col } from 'reactstrap/lib';

// const animatedComponents = makeAnimated();

const TableConfig = (props) => {
	// const {t} = props;
	const { register, errors } = useFormContext();
  // const [disabledForm,setDisabledForm] = React.useState(true)
  const [score,setScore] = React.useState(props.data.score ? props.data.score : 0)
  const [tempScore, setTempScore] = React.useState(props.tempScore)
  // const [attachment,setAttachment] = React.useState(["file"])
  // const [loading, setLoading] = React.useState(false)
  const centerTable = {
    verticalAlign: 'middle',
    textAlign: 'center'
  }
  const centerVerticalTable = {
    verticalAlign: 'middle'
  }

  React.useEffect(() => {
    setTempScore(props.tempScore)
  },[props.tempScore])
  
  React.useEffect(() => {
    if(props.data.score){
      setScore(props.data.score)
    }else{
      setScore(0)
    }
  },[props.data.score])

	// let msg = props.errors;

  // const editable = () => {
  //   setDisabledForm(false)
  // }

  const rating = props?.data?.rating?.map((item, index) => {
    return (
        <th style={centerTable} key={index}>
          <h5><label className="label label-default">{item.rating_description}</label></h5>
        </th>
    )
  })

  const summary = (data, values) => {
    const temp = tempScore.filter((item) => item.id === data.target.name);
    if (temp.length > 0){
      const a = tempScore.map((item) => {
        if (item.id === data.target.name){
          return {
            id : item.id,
            value : parseInt(values)
          }
        }else{
          return item
        }
      })
      setTempScore(a)
      setScore(score + parseInt(values) - temp[0].value)
      props.setValueState("score", (score + parseInt(values) - temp[0].value))
    }else{
        setTempScore([...tempScore, {
          id : data.target.name,
          value : parseInt(values)
        }])
      setScore(score + parseInt(values))
      props.setValueState("score", (score + parseInt(values)))
    }
  }

  // const addAttachment = (e) => {
  //   e.preventDefault()
  //   setAttachment([...attachment, "file"])
  // }

  // const deleteAttachment = (e, index) => {
  //   e.preventDefault()
  //   const temp = attachment.filter((item,indexs) => indexs !== index)
  //   setAttachment(temp)
  // }

  // const changeFile = (e, index) => {
  //   console.log(index+1)
  //   setLoading(!loading);
  //   props.upload('PVL001', e.target.files[0])
  //   .then((resp) => {
  //       setLoading(false);
  //       setValue(("file_name"+(index+1)), resp.data.data.name)
  //       // setFile_akta(resp.data.data.name)
  //       // setPlace_file_akta('temp')
  //   })
  //   .catch((err) => {
  //       setLoading(false);
  //       setValue(("file_name"+(index+1)), "")
  //       toastr.error(err.data?.message, err.data?.errors?.file[0])
  //   })
  // }

  let tempCategory = ""
  let tempIndex = 0
  let tempSubIndex = 0
  const data = props?.data?.subcategory?.map((item,index) => {
    if (item.category !== tempCategory){
      tempCategory = item.category
      tempIndex = tempIndex + 1
      tempSubIndex = 1
      return (
        <>
          <tr key={"category" + index}>
            <td>{tempIndex}</td>
            <td><b>{item.category}</b></td>
            <td colSpan={rating?.length}></td>
            {/* <td><input type="checkbox" name={"category" + item.id} value={item.id} style={centerTable}/></td> */}
          </tr>
          <tr key={"subcategory" + (index)}>
            <td style={centerVerticalTable}>{(tempIndex + "." + tempSubIndex)}</td>
            <td style={centerVerticalTable}>{item.description || item.subcategory}</td>
            {item?.value?.map((item_sub_sub,index_sub_sub) => {
              return (
                <td key={ 'value' + index_sub_sub}>
                  <center><b>{item_sub_sub.value}</b></center>
                  <center className={(errors[item.vpr_subcategory_id] || errors[item.subcategory_id]) ? "form-control is-invalid" : "form-control"}>
                    {(props.accessCreate && (props.statusText === 'Open' || props.statusText === 'Rejected')) ?
                      <input type="radio" name={item.vpr_subcategory_id || item.subcategory_id} defaultChecked={item_sub_sub.main_value === "1" ? true : false} onClick={(e) => summary(e, item_sub_sub.value)} value={item_sub_sub.vpr_rating_id || item_sub_sub.rating_id} ref={register({required: true})}/>
                      :
                      <input type="radio" readOnly name={item.vpr_subcategory_id || item.subcategory_id} checked={item_sub_sub.main_value === "1" ? true : false} value={item_sub_sub.vpr_rating_id || item_sub_sub.rating_id} ref={register({required: true})}/>  
                    }
                  </center>
                  {/* <input type="number" style={centerTable} className="form-control" name={item_sub_sub.id} defaultValue={item_sub_sub.value} ref={register({ required: true })} disabled={disabledForm}/> */}
                </td>
              )
            })}
            
            {/* <td><input type="checkbox" name={"subcategory" + item_sub.id} value={item_sub.id} style={centerTable}/></td> */}
          </tr>
        </>
      )
    }else{
      tempSubIndex = tempSubIndex + 1
      return (
        <tr key={"subcategory" + (index)}>
          <td style={centerVerticalTable}>{tempIndex + "." + tempSubIndex}</td>
          <td style={centerVerticalTable}>{item.description || item.subcategory}</td>
          {item?.value?.map((item_sub_sub,index_sub_sub) => {
            return (
              <td key={ 'value' + index_sub_sub}>
                <center><b>{item_sub_sub.value}</b></center>
                <center className={(errors[item.vpr_subcategory_id] || errors[item.subcategory_id]) ? "form-control is-invalid" : "form-control"}>
                  {(props.accessCreate && (props.statusText === 'Open' || props.statusText === 'Rejected')) ?
                    <input type="radio" name={item.vpr_subcategory_id || item.subcategory_id} defaultChecked={item_sub_sub.main_value === "1" ? true : false} onClick={(e) => summary(e, item_sub_sub.value)} value={item_sub_sub.vpr_rating_id || item_sub_sub.rating_id} ref={register({required: true})}/>
                    :
                    <input type="radio" readOnly name={item.vpr_subcategory_id || item.subcategory_id} checked={item_sub_sub.main_value === "1" ? true : false} value={item_sub_sub.vpr_rating_id || item_sub_sub.rating_id} ref={register({required: true})}/>  
                  }
                </center>
                {/* <input type="number" style={centerTable} className="form-control" name={item_sub_sub.id} defaultValue={item_sub_sub.value} ref={register({ required: true })} disabled={disabledForm}/> */}
              </td>
            )
          })}
          
          {/* <td><input type="checkbox" name={"subcategory" + item_sub.id} value={item_sub.id} style={centerTable}/></td> */}
        </tr>
      )
    }
  })
  
  // const data = props?.data?.category?.map((item,index) => {
  //   return (
  //     <>
      
  //       <tr key={item.category + ''+ index}>
  //         <td>{index + 1}</td>
  //         <td><b>{item.category}</b></td>
  //         <td colSpan={rating?.length}></td>
  //       </tr>
  //       {item?.subcategory?.map((item_sub, index_sub) => (
  //         // return (
  //           <tr key={(item_sub.id) + '.' + (index_sub)}>
  //             <td style={centerVerticalTable}>{(index + 1) + '.' + (index_sub + 1)}</td>
  //             <td style={centerVerticalTable}>{item_sub.description || item_sub.subcategory}</td>
  //             {item_sub?.vpr_config?.map((item_sub_sub,index_sub_sub) => {
  //               return (
  //                 <td key={item_sub_sub.id +''+index_sub_sub}>
  //                   <center><b>{item_sub_sub.value}</b></center>
  //                   <center className={(errors[item_sub.id] || errors[item_sub.subcategory_id]) ? "form-control is-invalid" : "form-control"}><input type="radio" name={item_sub.id || item_sub.subcategory_id} defaultChecked={item_sub_sub.main_value === "1" ? true : false} onClick={(e) => summary(e, item_sub_sub.value)} value={item_sub_sub.vpr_rating_id || item_sub_sub.rating_id} ref={register({required: true})}/></center>
  //                 </td>
  //               )
  //             })}
  //           </tr>
          
  //       ))}
        
  //     </>
  //   )
      
  // })

	return (
		<div>
      <Panel loading={props.loading}>
          <PanelHeader>
              Penilaian Vendor table
          </PanelHeader>
          <PanelBody loading={props.loading}>
              <Row>
                  <Col sm="12">
                    <div className="pull-right h3">Score : {score}</div>
                      <h4>
                        Nama vendor : {props?.data?.po?.vendor_name || props?.data?.vendor_name}
                      </h4>
                      <h4>
                        Nomor PO : {props?.data?.po?.eproc_number || props?.data?.eproc_number}
                      </h4>
                      <br></br>
                        {Object.keys(errors).length !== 0 && <span className="text-danger"> Notes : pastikan semua performance category sudah dinilai </span>}
                        <table className="table table-bordered justify-content-center">
                          <thead>
                            <tr key="head">
                              <th rowSpan="2" style={centerTable}>No</th>
                              <th rowSpan="2" style={centerTable}>Performance Category</th>
                              <th style={centerTable} colSpan={rating?.length}>Performance Rating</th>
                            </tr>
                            <tr key="rating">
                              {rating}
                            </tr> 
                          </thead>
                          <tbody>
                            {data}
                          </tbody>
                        </table>
                        {/* {attachment.map((item,index) => {
                          return (
                            <div className="form-group row m-b-15">
                              <label className="col-md-2 col-form-label">Attachment {index+1}</label>
                              <div className="col-md-5">
                                  <input type="text" className={"form-control"} name={"file_name"+(index+1)} ref={register({required: false})} placeholder="" disabled={true} />
                                  <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/${place_file_akta}/${file_akta}` } > {t("common:Button.Download")} </a>
                                  {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
                                  <FileUploadInformation idFileUpload="PVL001"/>
                              </div>
                              <div className="col-md-5">
                                  <label className="custom-file-upload">
                                      <input type="file" name={"file"+(index+1)} ref={register({required: false})} placeholder="" onChange={(e) => changeFile(e,index)}/>
                                      <i className={props.loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                  </label>
                                  {(index+1) === attachment.length &&
                                    <button className="btn btn-success m-l-5" onClick={(e) => addAttachment(e)}><i className="fas fa-plus"></i></button>
                                  }
                                  <button className="btn btn-danger m-l-5" onClick={(e) => deleteAttachment(e,index)}><i className="fas fa-minus"></i></button>
                              </div>
                              
                            </div>
                          )
                        })} */}
                  </Col>
              </Row>

          </PanelBody>

      </Panel>
      
		</div>
	);
}

export default  withTranslation() (TableConfig);