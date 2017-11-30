import { Filter } from './filter-base';
export interface BaseService  {
    Get(id: number): Promise<any>
    GetAll(filter?: Filter): Promise<Array<any>>
    GetCount(filter?: Filter): Promise<number>
    Post(item): Promise<any>
    Put( item ): Promise<any>
    Delete(id: number): Promise<any>
    DeleteMany(Ids: Array<number>): Promise<any>
}


