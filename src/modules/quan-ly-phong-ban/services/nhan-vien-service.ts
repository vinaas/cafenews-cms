import { logger } from './../../../authen/logger';
import { NhanVien } from './../models/nhan-vien';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';
import { Filter } from '../../../resources/base/filter-base';


export interface NhanVienService extends BaseService {

}
export class NhanVienServiceImpl implements NhanVienService {
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
  async Get(id: number): Promise<NhanVien> {
    let recBoChiTieu = await axios.get("api/BoChiTieus", {
      params: { id: id }
    });
    return recBoChiTieu.data;
  }

  async Post(item: NhanVien): Promise<NhanVien> {
    let rec = await axios.post("/api/BoChiTieus", item);
    return rec.data;
  }

  async Put(item: NhanVien): Promise<NhanVien> {
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

export class FakeNhanVienServiceImpl implements NhanVienService {
  
  async GetCount(filter?: Filter): Promise<number> {
   
    return Promise.resolve(100) // so luong data tra ve - dung de hien thi phan trang
  }
  async GetAll(filter?: Filter): Promise<any> {

    let dataGia = [{
      'id': 1,
      'tenNhanVien': 'tenNhanVien 1',
      'maNhanVien': 'maNhanVien 1',
      'chucVu': 'Trưởng phòng',
      'taiLieu': [],
      'phongbanid': 1,
    }, {
      'id': 2,
      'tenNhanVien': 'tenNhanVien 2',
      'maNhanVien': 'maNhanVien 2',
      'chucVu': 'Phó phòng',
      'taiLieu': [],
      'phongbanid': 1,
    }, {
      'id': 3,
      'tenNhanVien': 'tenNhanVien 3',
      'maNhanVien': 'maNhanVien 3',
      'chucVu': 'Thư ký',
      'taiLieu': [],
      'phongbanid': 2,
    }, {
      'id': 4,
      'tenNhanVien': 'tenNhanVien 4',
      'maNhanVien': 'maNhanVien 4',
      'chucVu': 'Nhân viên',
      'taiLieu': [],
      'phongbanid': 3,
    }]
    return Promise.resolve(dataGia)
  }

  Get(id: number): Promise<NhanVien> {
    throw new Error("Method not implemented.");
  }

  async Post(item: NhanVien): Promise<NhanVien> {

    // alert('ok')
    return Promise.resolve(item);
  }
  async Put(item: NhanVien): Promise<any> {
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

