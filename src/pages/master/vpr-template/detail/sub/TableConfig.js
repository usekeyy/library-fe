import React from 'react';
import { useForm} from 'react-hook-form';
// import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';

// const animatedComponents = makeAnimated();

const TableConfig = (props) => {
	// const {t} = props;
	const { register, handleSubmit } = useForm({});
  const [disabledForm,setDisabledForm] = React.useState(true)
  const centerTable = {
    verticalAlign: 'middle',
    textAlign: 'center'
  }
	// let msg = props.errors;
	const onSubmit = async data => {
		// console.log(data)
    setDisabledForm(true)
		props.save(data);
	};

  const editable = () => {
    setDisabledForm(false)
  }

  const rating = props?.data?.rating?.map((item, index) => {
    return (
        <th style={centerTable} key ={index}>
          <h5><label className="label label-default">{item.rating_description}</label></h5>
        </th>
    )
  })
  console.log(props.data.category)
  let tempCategory = 0
  let tempIndex = 0
  let tempSubIndex = 0
  const data = props?.data?.subcategory?.map((item,index) => {
    if (item.category_id !== tempCategory){
      tempCategory = item.category_id
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
            <td>{(tempIndex + "." + tempSubIndex)}</td>
            <td>{item.description}</td>
            {item?.value?.map((item_sub_sub,index_sub_sub) => {
              return (
                <td key={ 'value' + index_sub_sub}>
                  <input type="number" style={centerTable} className="form-control" name={item_sub_sub.id} defaultValue={item_sub_sub.value} ref={register({ required: true })} disabled={disabledForm}/>
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
          <td>{tempIndex + "." + tempSubIndex}</td>
          <td>{item.description}</td>
          {item?.value?.map((item_sub_sub,index_sub_sub) => {
            return (
              <td key={ 'value' + index_sub_sub}>
                <input type="number" style={centerTable} className="form-control" name={item_sub_sub.id} defaultValue={item_sub_sub.value} ref={register({ required: true })} disabled={disabledForm}/>
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
  //       <tr key={index}>
  //         <td>{index + 1}</td>
  //         <td><b>{item.category}</b></td>
  //         <td colSpan={rating?.length}></td>
  //         {/* <td><input type="checkbox" name={"category" + item.id} value={item.id} style={centerTable}/></td> */}
  //       </tr>
  //       {item?.subcategory?.map((item_sub, index_sub) => (
  //         // return (
  //           <tr key={(index) + '.' + (index_sub)}>
  //             <td>{(index + 1) + '.' + (index_sub + 1)}</td>
  //             <td>{item_sub.description}</td>
  //             {item_sub?.vpr_config?.map((item_sub_sub,index_sub_sub) => {
  //               return (
  //                 <td key={index_sub + '.' + index_sub_sub}>
  //                   <input type="number" style={centerTable} className="form-control" name={item_sub_sub.id} defaultValue={item_sub_sub.value} ref={register({ required: true })} disabled={disabledForm}/>
  //                 </td>
  //               )
  //             })}
              
  //             {/* <td><input type="checkbox" name={"subcategory" + item_sub.id} value={item_sub.id} style={centerTable}/></td> */}
  //           </tr>
          
  //       ))}
        
  //     </>
  //   )
      
  // })

	return (
		<div>
      {disabledForm &&
        <div className="pull-right m-b-10">
          <button color="primary" className="btn btn-sm btn-primary" value='' onClick={() => editable()} >Edit</button>
        </div>
      }
			<form onSubmit={handleSubmit(onSubmit)}>
        <table className="table table-bordered justify-content-center">
              <thead>
                <tr key="head">
                  <th rowSpan="2" style={centerTable}>No</th>
                  <th rowSpan="2" style={centerTable}>Performance Category</th>
                  <th style={centerTable} colSpan={rating?.length}>Performance Rating</th>
                  {/* <th rowSpan="2" style={centerTable}>Checked</th> */}
                </tr>
                <tr key="rating">
                  {rating}
                </tr>
              </thead>
              <tbody>
                {data}
                {/* <tr>
                  <td>1</td>
                  <td><b>PRICE</b></td>
                  <td colSpan={rating?.length}></td>
                </tr>
                <tr>
                  <td>1.1</td>
                  <td>Reasonable price for works compare to market price</td>
                  <td>
                    <input style={centerTable} className="form-control" name="id1" defaultValue={0} ref={register({ required: true })}/>
                  </td>
                  <td>
                    <input style={centerTable} className="form-control" name="id2" defaultValue={0} ref={register({ required: true })}/>
                  </td>
                  <td>
                    <input style={centerTable} className="form-control" name="id3" defaultValue={0} ref={register({ required: true })}/>
                  </td>
                  <td>
                    <input style={centerTable} className="form-control" name="id4" defaultValue={0} ref={register({ required: true })}/>
                  </td>
                </tr> */}
              </tbody>
            </table>
            {!disabledForm && 
            <div className="pull-right m-b-10">
              {props.parentProps.access.U && <button className="btn btn-success" type="submit">Save</button>}
              {/* <button color="primary" className="btn btn-primary" value='' onClick={(e) => console.log('tes')} >Edit</button> */}
            </div>}
			</form>
		</div>
	);
}

export default  withTranslation() (TableConfig);