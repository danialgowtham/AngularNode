import { Time } from "@angular/common";

export interface Row {
    id: number;
    date: Date;
    start_time: Time;
    finish_time: Time;
    duration: Time;
  }