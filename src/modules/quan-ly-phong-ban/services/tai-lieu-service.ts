import { logger } from './../../../authen/logger';
import { TaiLieu } from './../models/tai-lieu';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';


export interface TaiLieuService extends BaseService {

}
export class NhanVienServiceImpl implements TaiLieuService {
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/BoChiTieus/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/BoChiTieus", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<TaiLieu> {
    let recBoChiTieu = await axios.get("api/BoChiTieus", {
      params: { id: id }
    });
    return recBoChiTieu.data;
  }

  async Post(item: TaiLieu): Promise<TaiLieu> {
    let rec = await axios.post("/api/BoChiTieus", item);
    return rec.data;
  }

  async Put(item: TaiLieu): Promise<TaiLieu> {
    let rec = await axios.put("/api/BoChiTieus/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/BoChiTieus/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}

export class FakeTaiLieuServiceImpl implements TaiLieuService {
  
  async GetCount(filter?: Filter): Promise<number> {
   
    return Promise.resolve(100) // so luong data tra ve - dung de hien thi phan trang
  }
  async GetAll(filter?: Filter): Promise<any> {

    let dataGia = [{
      'id': 1,
      'tenTaiLieu': 'tenTaiLieu 1',
      'moTa': 'moTa 1',
      'nhanVienid': 1
    }, {
      'id': 2,
      'tenTaiLieu': 'tenTaiLieu 2',
      'moTa': 'moTa 2',
      'nhanVienid': 1
    }, {
      'id': 3,
      'tenTaiLieu': 'tenTaiLieu 3',
      'moTa': 'moTa 3',
      'nhanVienid': 3
    }, {
      'id': 4,
      'tenTaiLieu': 'tenTaiLieu 4',
      'moTa': 'moTa 4',
      'nhanVienid': 4
    }]
    return Promise.resolve(dataGia)
  }

  Get(id: number): Promise<TaiLieu> {
    throw new Error("Method not implemented.");
  }

  async Post(item: TaiLieu): Promise<TaiLieu> {

    // alert('ok')
    return Promise.resolve(item);
  }
  async Put(item: TaiLieu): Promise<any> {
    // alert('ok')
    return Promise.resolve(item);
  }
  async Delete(id: number): Promise<any> {
    return id;
  }
  DeleteMany(Ids: Array<number>): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

