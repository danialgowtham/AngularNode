import {Injectable} from '@angular/core';
// import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' }) 
export class SkillDataService {
    private skill_sets :Array<{com_stru_map_id: Number, experience_month: Number}>;
    pushData(com_skl_map_id:Number,experience:Number){
        this.skill_sets.push({"com_stru_map_id":com_skl_map_id,"experience_month":experience})
    }
    getData(){  
        return this.skill_sets;
    }
    clearData(){
        this.skill_sets=[];
    }
}