import React from 'react'

function TableTask(props) {
    const { data, loading, setPayloadAssignTask } = props;
    const handleChecklist = (task_id) => {
        setPayloadAssignTask(true, task_id)
    }
    return (
        <div>
            <div className="col-sm-12" style={{overflowX: "auto"}}>
                {loading ? <center>"Loading....."</center> : 
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-sm text-wrap">
                        <thead>
                                <tr key="head">
                                    <th>
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Jumlah Task
                                    </th>
                                </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? data.map(data => (
                                <tr key={data.id}>
                                    <td><input type="checkbox" name={data.task_id} onClick={_=> handleChecklist(data.task_id)}/></td>
                                    <td>{data.name}</td>
                                    <td>{data.tickets_count}</td>
                                </tr>
                            ))
                            :
                            <tr key="body">
                                <td colSpan={3}>
                                    <center>Tidak Ditemukan Task</center>
                                </td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
                }
            </div>
        </div>
    )
}

export default TableTask
