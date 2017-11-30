import { logger } from './../../../authen/logger';
import { ChuyenMucBaiViet } from './../models/chuyen-muc-bai-viet';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';


export interface ChuyenMucService extends BaseService {

}
export class ChuyenMucBaiVietServiceImpl implements ChuyenMucService {
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/ChuyenMucs/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/ChuyenMucs", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<ChuyenMucBaiViet> {
    let recChuyenMuc = await axios.get("api/ChuyenMucs", {
      params: { id: id }
    });
    return recChuyenMuc.data;
  }

  async Post(item: ChuyenMucBaiViet): Promise<ChuyenMucBaiViet> {
    let rec = await axios.post("/api/ChuyenMucs", item);
    return rec.data;
  }

  async Put(item: ChuyenMucBaiViet): Promise<ChuyenMucBaiViet> {
    let rec = await axios.put("/api/ChuyenMucs/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/ChuyenMucs/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}
