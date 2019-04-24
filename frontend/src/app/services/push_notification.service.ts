import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Toast, ToasterService } from 'angular5-toaster';
import { BACK_END_URL } from "../shared/app.globals"

@Injectable()
export class PushNotificationService {
    private socket: any;
    private toast: Toast;
    constructor(private toasterService: ToasterService) {
        this.socket = io(BACK_END_URL);
    }

    // Emit: saved event
    emitEventOnEmployeeSkillSubmit(data) {
        this.socket.emit('employee_submitted', data);
    }
    emitEventOnEmployeeSkillApprove(data) {
        this.socket.emit('rm_approved', data);
    }
    consumeEvenOnSkillApprove() {
        const self = this;
        this.socket.on('employee_submitted', function (data) {
            self.toast = {
                type: 'info',
                title: 'Skills Submitted',
                body: data.first_name + ' Submitted Skill Sets',
                showCloseButton: true,
                timeout: 5000,
                showDuraFtion: 5000,
                data: data,
            };
            var jsonObj = JSON.parse(localStorage.currentUser);
            if (jsonObj.id == data.show_employee_id)
                self.toasterService.pop(self.toast);
        });
    }
    consumeEvenOnSkillSubmit() {
        const self = this;
        this.socket.on('rm_approved', function (data) {
            self.toast = {
                type: 'info',
                title: 'Skills Approved',
                body: data.first_name + ' Approved Your Skill Sets',
                showCloseButton: true,
                timeout: 5000,
                showDuration: 5000,
                data: data,
            };
            var jsonObj = JSON.parse(localStorage.currentUser);
            if (jsonObj.id == data.show_employee_id)
                self.toasterService.pop(self.toast);
        });
    }

}