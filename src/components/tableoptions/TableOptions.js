import React from 'react';

export const RowLoading = props => (
    <tr>
        <td colSpan={props.colSpan} className='text-center'>{props.children}</td>
    </tr>
);

export const RowEmpty = props => (
    <tr>
        <td colSpan={props.colSpan} className='text-center'>{props.children}</td>
    </tr>
);