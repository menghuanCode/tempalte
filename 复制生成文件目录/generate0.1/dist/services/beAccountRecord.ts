import request from '@/utils/request';
import { IResponse, IListParams, Store } from './index.d'

export async function query(params: IListParams): Promise<IResponse> {
  return request('/api/beAccountRecord/page', {
    method: 'POST',
    requestType: 'json',
    data: params
  });
}

export async function deleteById(params: { id: string }): Promise<IResponse> {
  return request('/api/beAccountRecord/delete', {
    method: 'GET',
    requestType: 'form',
    params: params
  });
}

export async function deleteBatchIds(params: { ids: string }): Promise<IResponse> {
  return request('/api/beAccountRecord/deleteBatchIds', {
    method: 'POST',
    requestType: 'form',
    data: params
  });
}

export async function save(params: Store): Promise<IResponse> {
  return request('/api/beAccountRecord/save', {
    method: 'POST',
    requestType: 'json',
    data: params
  });
}