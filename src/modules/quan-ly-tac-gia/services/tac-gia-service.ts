import { logger } from './../../../authen/logger';
import { TacGia } from './../models/tac-gia';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';


export interface TacGiaService extends BaseService {

}
export class TacGiaServiceImpl implements TacGiaService {
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/TacGia/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/TacGia", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<TacGia> {
    let recTacGia = await axios.get("api/TacGia", {
      params: { id: id }
    });
    return recTacGia.data;
  }

  async Post(item: TacGia): Promise<TacGia> {
    let rec = await axios.post("/api/TacGia", item);
    return rec.data;
  }

  async Put(item: TacGia): Promise<TacGia> {
    let rec = await axios.put("/api/TacGia/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/TacGia/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}
