import { User } from './../models/user';
import { Filter } from './../../../resources/base/filter-base';
import { BaseService } from './../../../resources/base/service-base';
import axios from 'axios';

export interface UserService extends BaseService {
  Patch(item: User): Promise<User>
}

export class UserServiceImpl implements UserService {
  async GetCount(filter?: Filter): Promise<number> {
    let rec = await axios.get("/api/ApplicationUsers/count", {
      params: { filter: filter.where }
    });
    return rec.data.count;
  }
  async GetAll(filter?: Filter): Promise<any> {
    let rec = await axios.get("/api/ApplicationUsers", {
      params: { filter: filter }
    });
    return rec.data;
  }
  async Get(id: number): Promise<User> {
    let recUser = await axios.get("api/ApplicationUsers", {
      params: { id: id }
    });
    return recUser.data;
  }

  async Post(item: User): Promise<User> {
    let rec = await axios.post("/api/ApplicationUsers", item);
    return rec.data;
  }

  async Patch(item: User): Promise<User> {
    let rec = await axios.patch("/api/ApplicationUsers/" + item.id, item);
    return rec.data;
  }

  async Put(item: User): Promise<User> {
    let rec = await axios.put("/api/ApplicationUsers/" + item.id, item);
    return rec.data;
  }
  async Delete(id: number): Promise<any> {
    let rec = await axios.delete("/api/ApplicationUsers/" + id);
    return rec.data;
  }

  async DeleteMany(ids: Array<number>): Promise<any> {
    let tasks = ids.map(id => this.Delete(id))
    return await Promise.all(tasks);
  }
}

// export class FakeUserServiceImpl implements UserService {

//   async GetCount(filter?: Filter): Promise<number> {

//     return Promise.resolve(100) // so luong data tra ve - dung de hien thi phan trang
//   }
//   async GetAll(filter?: Filter): Promise<any> {
//     let rec = await axios.get("/api/ApplicationUsers", {
//       params: { filter: filter }
//     });
//     return rec.data;

    // let dataGia = [{
    //   'id': 1,
    //   'username': 'test 1',
    //   'password': 'test 1',
    //   'realm': 'test 1',
    //   'email': 'test 1',
    // }, {
    //   'id': 2,
    //   'username': 'test 2',
    //   'password': 'test 2',
    //   'realm': 'test 2',
    //   'email': 'test 2',
    // }, {
    //   'id': 3,
    //   'username': 'test 3',
    //   'password': 'test 3',
    //   'realm': 'test 3',
    //   'email': 'test 3',
    // }, {
    //   'id': 4,
    //   'username': 'test 4',
    //   'password': 'test 4',
    //   'realm': 'test 4',
    //   'email': 'test 4',
    // }]
    // return Promise.resolve(dataGia)
//   }

//   Get(id: number): Promise<User> {
//     throw new Error("Method not implemented.");
//   }

//   async Post(item: User): Promise<User> {
//     let rec = await axios.post("/api/ApplicationUsers", item);
//     return rec.data;
//   }

//   async Put(item: User): Promise<any> {
//     // alert('ok')
//     return Promise.resolve(item);
//   }
//   async Delete(id: number): Promise<any> {
//     return id;
//   }
//   DeleteMany(Ids: Array<number>): Promise<any> {
//     throw new Error("Method not implemented.");
//   }
// }
