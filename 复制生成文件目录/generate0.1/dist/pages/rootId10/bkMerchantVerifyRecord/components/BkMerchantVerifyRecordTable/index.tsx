import React, { useState, useRef } from 'react'
import GoodpayTable from '@/components/GoodpayTable'
import { columns, modalEditColumns, searchColumns } from './columns'

import {
    query,
    save,
} from '@/services/bkMerchantVerifyRecord.ts'

import { ActionType } from '@ant-design/pro-table'
import { ActionModal, IModalProps } from '@/components/GoodpayModal'


const BkMerchantVerifyRecordTable = () => {
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
        <span className="option-item option-manage iconfont icon-bianji" onClick={() => handleEditRate(entity, action)}></span>
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

export default BkMerchantVerifyRecordTable
    