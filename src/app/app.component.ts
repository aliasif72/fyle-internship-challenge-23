import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

type userType = Record<
  string,
  {
    username: string;
    url: string;
    bio: string;
    location: string;
    totalRepos: number;
  }
>;
type repoType = Record<
  string,
  { repoName: string; description: string; languages: string[] }[]
>;
type repotypeMap = {
  repoName: string;
  description: string;
  languages: string[];
}[];
type cachedData = {
  repos: repoType;
  repoShow: repoType;
  userData: userType;
  profileName: string;
  product: number;
  pageNo: number;
  pageSize: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  profileName: string = '';
  userData: userType = {};
  repoShow: repoType = {};
  message: string = '';
  error: boolean = false;
  display: string = 'none';
  product: number = 0;
  pageNo: number = 1;
  repos: repoType = {};

  constructor(
    private apiService: ApiService,
    private lsService: LocalStorageService
  ) {}

  ngOnInit() {
    //ON RELOAD GET USER REPOSITORIES FROM LOCAL STORAGE
    const data = this.lsService.getCachedData('identifier');
    if (data) {
      this.userData = data.userData;
      this.profileName = data.profileName;
      (this.repos = data.repos), (this.repoShow = data.repoShow);
      this.product = data.product;
      this.pageNo = data.pageNo;
    }
  }

  //DROPDOWN HANDLER
  nextPrevPage(eventData: { pageNo: number; pageSize: number }) {
    this.display = 'block';
    this.getRepos(this.profileName, eventData.pageNo, eventData.pageSize);
  }

  //SEARCH BTN HANDLER
  async submitForm(loginName: { username: string }) {
    this.profileName = loginName.username.trim().toLowerCase();
    this.display = 'block';
    this.repos = {};
    this.repoShow = {};
    this.userData = {};
    try {
      const resUser = await lastValueFrom(
        this.apiService.getUser(this.profileName)
      );
      this.userData[this.profileName] = {
        username: resUser.name,
        url: resUser.html_url,
        bio: resUser.bio,
        location: resUser.location,
        totalRepos: resUser.public_repos,
      };
      this.getRepos(this.profileName, 1, 10);
    } catch (error: any) {
      //ERROR LOGGING
      if (error.status === 404) {
        this.message = 'User not found';
      } else if (error.status === 403) {
        this.message = 'Server not responding';
      } else {
        this.message = 'An error occurred';
      }

      setTimeout(() => {
        this.display = 'none';
        this.error = true;
      }, 300);
      setTimeout(() => (this.error = false), 1000);
    }
  }

  // GET REPOSITORY HANDLER
  async getRepos(name: string, pageNo: number, pageSize: number) {
    let requiredTill = pageNo * pageSize;
    const requiredFrom = requiredTill - pageSize;
    this.product = pageNo * pageSize;

    if (
      !this.repos.hasOwnProperty(this.profileName) ||
      !Array.isArray(this.repos[this.profileName])
    ) {
      this.repos[this.profileName] = [];
    }

    const currentrepo = this.repos[this.profileName];

    if (this.userData[this.profileName].totalRepos < requiredTill) {
      requiredTill = this.userData[this.profileName].totalRepos;
    }

    if (currentrepo.length >= requiredTill) {
      this.repoShow[this.profileName] = currentrepo.slice(
        requiredFrom,
        requiredTill
      );
      this.display = 'none';
      this.storeDataInLS(pageNo, pageSize);
    } else if (
      this.userData[this.profileName].totalRepos >
      this.repos[this.profileName].length
    ) {
      const resRepo = await lastValueFrom(
        this.apiService.getRepos(name, pageNo, pageSize)
      );
      if (resRepo.length > 0) {
        const reducedArray: repotypeMap = await Promise.all(
          resRepo.map(async (ele: any) => {
            const repoLangs = await lastValueFrom(
              this.apiService.getLangs(this.profileName, ele.name)
            );
            return {
              repoName: ele.name,
              description: ele.description,
              languages: Object.keys(repoLangs),
            };
          })
        );
        this.repos[this.profileName] = [
          ...this.repos[this.profileName],
          ...reducedArray,
        ];
        this.repoShow[this.profileName] = reducedArray;
        this.display = 'none';
        this.storeDataInLS(pageNo, pageSize);
      }
    }
  }

  storeDataInLS(pageNo: number, pageSize: number) {
    const data: cachedData = {
      repos: this.repos,
      repoShow: this.repoShow,
      userData: this.userData,
      profileName: this.profileName,
      product: this.product,
      pageNo,
      pageSize,
    };
    this.lsService.setCachedData('identifier', data);
  }
}
