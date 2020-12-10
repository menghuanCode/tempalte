import request from '@/utils/request';
import { IResponse, IListParams, Store } from './index.d'

export async function query(params: IListParams): Promise<IResponse> {
  return request('/api/authorizedAssetAccount/page', {
    method: 'POST',
    requestType: 'json',
    data: params
  });
}

export async function deleteById(params: { id: string }): Promise<IResponse> {
  return request('/api/authorizedAssetAccount/delete', {
    method: 'GET',
    requestType: 'form',
    params: params
  });
}

export async function deleteBatchIds(params: { ids: string }): Promise<IResponse> {
  return request('/api/authorizedAssetAccount/deleteBatchIds', {
    method: 'POST',
    requestType: 'form',
    data: params
  });
}

export async function save(params: Store): Promise<IResponse> {
  return request('/api/authorizedAssetAccount/save', {
    method: 'POST',
    requestType: 'json',
    data: params
  });
}