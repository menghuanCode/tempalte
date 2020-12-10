const { toFirstUpperCase } = require('./utils')

const columnsTsx = function () {
  return (`import React from 'react'
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
    `)
}

const tableTsx = function (name = '') {
  return (`import React, { useState, useRef } from 'react'
import GoodpayTable from '@/components/GoodpayTable'
import { columns, modalEditColumns, searchColumns } from './columns'

import {
    query,
    save,
} from '@/services/${name}'

import { ActionType } from '@ant-design/pro-table'
import { ActionModal, IModalProps } from '@/components/GoodpayModal'


const ${toFirstUpperCase(name)}Table = () => {
    const [modalProps, setModalProps] = useState<IModalProps>({ visible: false, title: '' });
    const table = useRef<ActionType>()

    // 修改汇率
    const handleEditRate = (entity: any, action: ActionType) => {
    setModalProps({
        title: '修改汇率',
        tableRef: table,
        visible: true,
        columns: modalEditColumns,
        formData: entity,
        onSubmit: save,
        onCancel: () => setModalProps({ ...modalProps, visible: false })
    })
    }


    const option = {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (dom: React.ReactNode, entity: any, index: number, action: ActionType) => {
        return (<div className="option">
        <span className="option-item option-manage" onClick={() => handleEditRate(entity, action)}>编辑</span>
        </div>
        )
    },
    fixed: 'right',
    }

    return (
    <>
        <GoodpayTable
        actionRef={table}
        columns={[...columns, ...searchColumns, option]}
        isSearch={false}
        request={query}
        />

        <ActionModal width="80%" maskClosable={false} {...modalProps} />
    </>
    )
}

export default ${toFirstUpperCase(name)}Table
    `)
}

const indexTsx = function (name = '', table = 'Table') {

  return (`import React from 'react'
import ${table} from './components/${table}'

const ${toFirstUpperCase(name)}Manage = () => {
    return <${table} />
}
export default ${toFirstUpperCase(name)}Manage
    `)
}

const apiTsx = function (name = '') {
  return (`import request from '@/utils/request';
import { IResponse, IListParams, Store } from './index.d'

export async function query(params: IListParams): Promise<IResponse> {
  return request('/api/${name}/page', {
    method: 'POST',
    requestType: 'json',
    data: params
  });
}

export async function deleteById(params: { id: string }): Promise<IResponse> {
  return request('/api/${name}/delete', {
    method: 'GET',
    requestType: 'form',
    params: params
  });
}

export async function deleteBatchIds(params: { ids: string }): Promise<IResponse> {
  return request('/api/${name}/deleteBatchIds', {
    method: 'POST',
    requestType: 'form',
    data: params
  });
}

export async function save(params: Store): Promise<IResponse> {
  return request('/api/${name}/save', {
    method: 'POST',
    requestType: 'json',
    data: params
  });
}`)
}


module.exports = {
  columnsTsx,
  tableTsx,
  indexTsx,
  apiTsx
}