import React from 'react'
import { TColumns } from '@/index.d'

// 账户 Columns
export const columns: TColumns = [
{ title: "#", dataIndex: "id", hideInSearch: true },
{ title: "币种类型", dataIndex: "coinType", hideInSearch: true },
{ title: "币种名称", dataIndex: "coinName", hideInSearch: true },
{
    title: "是否开启", dataIndex: "open", hideInSearch: true,
    render: (dom: React.ReactNode) => {
    return dom === 0 ?
        <span className="color-red">禁用</span> :
        <span className="color-green">启用</span>
    }
}
]

export const searchColumns: TColumns = [
{ title: "币种", dataIndex: "coinType", hideInTable: true },
]

export const modalEditColumns: TColumns = [
{ title: "#", dataIndex: "id", fieldProps: { required: true, col: { span: 0 } } },
{ title: "币种类型", dataIndex: "coinType", fieldProps: { required: true, col: { span: 8 } } },
{ title: "币种名称", dataIndex: "coinName", fieldProps: { required: true, col: { span: 8 } } }
]
    