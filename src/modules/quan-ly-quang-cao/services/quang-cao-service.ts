import { logger } from './../../../authen/logger';
import { QuangCao } from './../models/quang-cao';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';


export interface QuangCaoService extends BaseService {

}
export class QuangCaoServiceImpl implements QuangCaoService {
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/QuangCaos/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/QuangCaos", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<QuangCao> {
    let recQuangCao = await axios.get("api/QuangCaos", {
      params: { id: id }
    });
    return recQuangCao.data;
  }

  async Post(item: QuangCao): Promise<QuangCao> {
    let rec = await axios.post("/api/QuangCaos", item);
    return rec.data;
  }

  async Put(item: QuangCao): Promise<QuangCao> {
    let rec = await axios.put("/api/QuangCaos/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/QuangCaos/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}
