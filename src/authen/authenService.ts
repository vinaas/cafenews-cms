import { AppSetting } from './../appsettings/index';
import { logger } from './logger';
import { PLATFORM } from 'aurelia-pal';
import { STORAGE } from './../helpers/storage';
import { inject } from 'aurelia-framework';
import axios from 'axios';

@inject(STORAGE)
export class AuthenService {
  constructor(private storage: STORAGE) {

  }
  get isAuthenticated(): boolean {
    let token = this.storage.get(STORAGE.tokenKey);
    if (token)
      return true;
    return false;
  }
  get userInfo(): any {
    let userInfo = this.storage.get(STORAGE.userInfoKey);
    if (userInfo)
      return userInfo;
    return undefined;
  }
  logout() {
    this.storage.remove(STORAGE.tokenKey);
    this.storage.remove(STORAGE.userInfoKey);
    PLATFORM.location.reload();

  }
  login(userCredential: UserCredential): Promise<boolean> {
    // return new Promise((resolve) => {
    //    resolve(this.fakeLogin(userCredential))
      
    // });

    let self = this;
    return new Promise((resolve, reject) => {
      axios.post(AppSetting.apiEndPoint+"/api/MyUsers/login",userCredential).then(function(res) {
        // setTimeout(() => {
          console.log("username" + userCredential.username );
          self.storage.set(STORAGE.tokenKey, res.data.id);
          self.storage.set(STORAGE.userInfoKey, { userName: userCredential.username, userId : res.data.userId,
                image: "https://dummyimage.com/60x60/000/ff008c", roles: ['dev'] })
          self.setAxiosGlobal(res.data.id);
          resolve(true);
        // }, 100);
      }).catch(err=>{
        console.error("login " + JSON.stringify(err));
        resolve(false);
      })

    })
  }
  private fakeLogin(userCredential: UserCredential) : boolean {
    let self = this;
    // let users = [
    //   { username : "user1", password : "!@#456" },
    //   { username : "user1", password : "!@#456" },
    //   { username : "user1", password : "!@#456" },
    // ]
    let rs = false;
    if (userCredential.username == "user1" && userCredential.password == "123")
    {
      rs = true; 
      self.storage.set(STORAGE.tokenKey, userCredential.username);
      self.storage.set(STORAGE.userInfoKey, { userName: userCredential.username, 
        userId: "1", 
        image: "https://dummyimage.com/60x60/000/ff008c", roles: ['admin'] })
      self.setAxiosGlobal(userCredential.username);
    }

    if (userCredential.username == "user2" && userCredential.password == "!@#456")
      {
        rs = true; 
        self.storage.set(STORAGE.tokenKey, userCredential.username);
        self.storage.set(STORAGE.userInfoKey, { userName: userCredential.username,
           userId: "2", 
           image: "https://dummyimage.com/60x60/000/ff008c", roles: ['admin'] })
        self.setAxiosGlobal(userCredential.username);
      }

      if (userCredential.username == "user3" && userCredential.password == "!@#456")
      {
        rs = true; 
        self.storage.set(STORAGE.tokenKey, userCredential.username);
        self.storage.set(STORAGE.userInfoKey, { userName: userCredential.username, 
          userId: "3", 
          image: "https://dummyimage.com/60x60/000/ff008c", roles: ['admin'] })
        self.setAxiosGlobal(userCredential.username);
      }

      if (userCredential.username == "user4" && userCredential.password == "!@#456")
      {
        rs = true; 
        self.storage.set(STORAGE.tokenKey, userCredential.username);
        self.storage.set(STORAGE.userInfoKey, { userName: userCredential.username, 
          userId: "4", 
          image: "https://dummyimage.com/60x60/000/ff008c", roles: ['user'] })
        self.setAxiosGlobal(userCredential.username);
      }

      if (userCredential.username == "user5" && userCredential.password == "!@#456")
        {
          rs = true; 
          self.storage.set(STORAGE.tokenKey, userCredential.username);
          self.storage.set(STORAGE.userInfoKey, { userName: userCredential.username, 
            userId: "5", 
            image: "https://dummyimage.com/60x60/000/ff008c", roles: ['user'] })
          self.setAxiosGlobal(userCredential.username);
        }
  
    return rs;
  }
  private setAxiosGlobal(token: string) {
    axios.defaults.headers = { 'Authorization': token };
    logger.info('Add axios header Authorization global');
  }
}
export interface UserCredential {
  username: string;
  password: string;
}
