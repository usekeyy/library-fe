import React from 'react';
import { useFormContext} from 'react-hook-form';
import {  Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import FileUploadInformation from '../../../../components/upload/FileUploadInformation';
// import { toastr } from 'react-redux-toastr';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { Col } from 'reactstrap/lib';

// const animatedComponents = makeAnimated();

const ApprovalTableConfig = (props) => {
	// const {t} = props;
	const { register } = useFormContext();
  // const [disabledForm,setDisabledForm] = React.useState(true)
  // const [score,setScore] = React.useState(0)
  // const [tempScore, setTempScore] = React.useState([])
  // const [attachment,setAttachment] = React.useState(["file"])
  // const [loading, setLoading] = React.useState(false)
  const centerTable = {
    verticalAlign: 'middle',
    textAlign: 'center'
  }
  const centerVerticalTable = {
    verticalAlign: 'middle'
  }

  

	// let msg = props.errors;

  // const editable = () => {
  //   setDisabledForm(false)
  // }

  const rating = props?.data?.rating?.map((item, index) => {
    return (
        <th style={centerTable} key={index}>
          <h5><label className="label label-default">{item.description}</label></h5>
        </th>
    )
  })

  // const summary = (data, values) => {
  //   const temp = tempScore.filter((item) => item.id === data.target.name);
  //   if (temp.length > 0){
  //     const a = tempScore.map((item) => {
  //       if (item.id === data.target.name){
  //         return {
  //           id : item.id,
  //           value : parseInt(values)
  //         }
  //       }else{
  //         return item
  //       }
  //     })
  //     setTempScore(a)
  //     setScore(score + parseInt(values) - temp[0].value)
  //   }else{
  //       setTempScore([...tempScore, {
  //         id : data.target.name,
  //         value : parseInt(values)
  //       }])
  //     setScore(score + parseInt(values))
  //   }
  //   props.setValueState("score", score)
  // }

  // const addAttachment = (e) => {
  //   e.preventDefault()
  //   setAttachment([...attachment, "file"])
  // }

  // const deleteAttachment = (e, index) => {
  //   e.preventDefault()
  //   const temp = attachment.filter((item,indexs) => indexs !== index)
  //   setAttachment(temp)
  // }
  
  const data = props?.data?.category?.map((item,index) => {
    return (
      <>
        <tr key={item.category + ''+ index}>
          <td>{index + 1}</td>
          <td><b>{item.category}</b></td>
          <td colSpan={rating?.length}></td>
        </tr>
        {item?.subcategory?.map((item_sub, index_sub) => (
          // return (
            <tr key={(item_sub.id) + '.' + (index_sub)}>
              <td style={centerVerticalTable}>{(index + 1) + '.' + (index_sub + 1)}</td>
              <td style={centerVerticalTable}>{item_sub.subcategory}</td>
              {item_sub?.vpr_config?.map((item_sub_sub,index_sub_sub) => {
                return (
                  <td key={item_sub_sub.id +''+index_sub_sub}>
                    <center><b>{item_sub_sub.value}</b></center>
                    <center className="form-control"><input type="radio" name={index +''+index_sub} value={item_sub_sub.vpr_rating_id} ref={register({required: false})} checked={item_sub_sub.main_value === '1' ? true : false} onChange={(e) => e.preventDefault()}/></center>
                  </td>
                )
              })}
            </tr>
          
        ))}
        
      </>
    )
      
  })

	return (
		<div>
      <Panel loading={false}>
          <PanelHeader>
              Penilaian Vendor
          </PanelHeader>
          <PanelBody loading={false}>
              <Row>
                  <Col sm="12">
                    <div className="pull-right h3">Score : {props?.data?.score}</div>
                      <h4>
                        Nama vendor : {props?.data?.vendor_name}
                      </h4>
                      <h4>
                        Nomor PO : {props?.data?.eproc_number}
                      </h4>
                      <br></br>
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
                  </Col>
              </Row>

          </PanelBody>

      </Panel>
      
		</div>
	);
}

export default  withTranslation() (ApprovalTableConfig);