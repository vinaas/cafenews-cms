import { logger } from './../../../authen/logger';
import { ChuDeBaiViet } from './../models/chu-de-bai-viet';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';


export interface ChuDeService extends BaseService {

}
export class ChuDeBaiVietServiceImpl implements ChuDeService {
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/ChuDes/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/ChuDes", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<ChuDeBaiViet> {
    let recChuDe = await axios.get("api/ChuDes", {
      params: { id: id }
    });
    return recChuDe.data;
  }

  async Post(item: ChuDeBaiViet): Promise<ChuDeBaiViet> {
    let rec = await axios.post("/api/ChuDes", item);
    return rec.data;
  }

  async Put(item: ChuDeBaiViet): Promise<ChuDeBaiViet> {
    let rec = await axios.put("/api/ChuDes/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/ChuDes/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}
