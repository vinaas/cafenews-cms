import { element } from 'aurelia-protractor-plugin/protractor';
import { logger } from './../../../authen/logger';
import { PhongBan } from './../models/phong-ban';
import { BaseService } from './../../../resources/base/service-base';
// import {FakeNghiepVuServiceImpl,NghiepVuService} from '../services/nghiep-vu-service';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';
import { inject } from 'aurelia-framework';
// inject(FakeNghiepVuServiceImpl)

export interface PhongBanService extends BaseService {

}
export class PhongBanServiceImpl implements PhongBanService {
  // constructor(private nghiepVuSvr:FakeNghiepVuServiceImpl){
    
  //     }
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/Roles/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/Roles", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<PhongBan> {
    let recBoChiTieu = await axios.get("api/Roles", {
      params: { id: id }
    });
    return recBoChiTieu.data;
  }

  async Post(item: PhongBan): Promise<PhongBan> {
    let rec = await axios.post("/api/Roles", item);
    return rec.data;
  }

  async Put(item: PhongBan): Promise<PhongBan> {
    let rec = await axios.put("/api/Roles/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/Roles/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}

