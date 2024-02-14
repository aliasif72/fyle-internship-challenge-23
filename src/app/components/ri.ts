// import { Component } from '@angular/core';
// import { lastValueFrom } from 'rxjs';
// import { ApiService } from 'src/app/services/api.service';

// type userType = Record<string,{username: string, url: string, bio: string, location: string, totalRepos:number}>;
// type repoType = Record<string,{ repoName: string, description: string, languages: string[]}[]>; 
// type repotypeMap = { repoName: string, description: string, languages: string[]}[]; 

// @Component({
//   selector: 'app-nav',
//   templateUrl: './nav.component.html',
//   styleUrls: ['./nav.component.scss'],
// })
// export class NavComponent {
//   item:string ='';
//   userData: any;
//   userProfile:userType={};
//   repoShow:repoType = {}; 
//   message: string = '';
//   error: boolean = false;
//   display: string = 'none';
//   userExist: boolean = false;
//   product:number=0;
//   repos:repoType={};

//   constructor(private apiService: ApiService) {
//      }

//   //DROPDOWN HANDLER
//     nextPrevPage(eventData : {pageNo:number,pageSize:number})
//     {
//       this.getRepos(this.item,eventData.pageNo,eventData.pageSize)   
//     }

//     //SEARCH BTN HANDLER
//     submitForm(loginName: {username:string}) {
//     this.item = loginName.username.trim().toLowerCase();
//     this.display = 'block';
//     setTimeout(() => (this.display = 'none'), 400);
//           this.apiService.getUser(this.item).subscribe( {next:(resUser) => {
//           this.userData=resUser;
//           this.userProfile[this.item] =
//           { 
//             username:this.userData.name ,
//             url:this.userData.html_url  ,
//             bio:this.userData.bio  ,
//             location: this.userData.location,
//             totalRepos:this.userData.public_repos 
//           }
//            this.getRepos(this.item,1,10);
//         this.userExist = true;
//       },
//       //ERROR LOGGING
//       error:(error) => {
//         if (error.status === 404) {
//           this.message = 'user not found';
//           setTimeout(() => {
//             this.display = 'none';
//             this.error = true;
//           }, 300);
//           setTimeout(() => (this.error = false), 1000);
//         } else if (error.status === 403) {
//           this.message = 'server not responding';
//           setTimeout(() => {
//             this.display = 'none';
//             this.error = true;
//           }, 300);
//           setTimeout(() => (this.error = false), 1000);
//         }
//       }
//      });
//     } 

//     // GET REPOSITORY HANDLER
//     getRepos(name:string,pageNo:number,pageSize:number){
//       let requiredTill=pageNo*pageSize;
//       const requiredFrom=requiredTill-pageSize;
//       this.product=pageNo*pageSize;
      
    
//     if (!this.repos.hasOwnProperty(this.item) || !Array.isArray(this.repos[this.item])) {
//       this.repos[this.item] = [];
//      }

//       const currentrepo=this.repos[this.item];

//       if(this.userData.public_repos < requiredTill)
//       {
//          requiredTill=this.userData.public_repos;
//       }

//       if(currentrepo.length>=requiredTill)
//       {
//         this.repoShow[this.item]=currentrepo.slice(requiredFrom,requiredTill)
//        }

//        else if(this.userData.public_repos > this.repos[this.item].length){
//      this.apiService.getRepos(name,pageNo,pageSize).subscribe(async (resRepo: any) => {
//       if (resRepo.length > 0) {
//       const reducedArray: repotypeMap =
//       await Promise.all( resRepo.map(async(ele: any) => {
//         const repoLangs = await lastValueFrom (this.apiService.getLangs(this.item, ele.name));
//         return    {
//               repoName: ele['name'],
//               description: ele['description'],
//               languages:  Object.keys(repoLangs)
//             };
//       }))    
//     this.repos[this.item]=[...this.repos[this.item],...reducedArray];
//     this.repoShow[this.item]=reducedArray;
//        };
//      }
//     )
//   }
//   }
// }
