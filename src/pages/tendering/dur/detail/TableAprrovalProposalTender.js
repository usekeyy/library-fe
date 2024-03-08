import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'

function TableAprrovalProposalTender(props) {
    return (
        
        <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm text-nowrap">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Tanggal Approval</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data && props.data.length > 0 ? props.data?.map((data,index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{data.user_name}</td>
                            <td>{data.role_name}</td>
                            <td>{data.workflow_status === 'executed' && formatDate(data.executed_at,true)}</td>
                        </tr>
                    ))
                    :
                    <tr>
                        <td colSpan="4" className="text-center">No Data Found...</td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableAprrovalProposalTender
