import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from '../shared/loader.subject';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    skippUrls = [
        '/get_filtered_employee_list',
        '/get_role_list'
    ];
    activeRequests: number = 0;
    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let displayLoadingScreen = true;

        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(req.url)) {
                displayLoadingScreen = false;
                break;
            }
        }
        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.loaderService.startLoading();
            }
            this.activeRequests++;

            return next.handle(req).pipe(
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.loaderService.stopLoading();
                    }
                })
            )
        } else {
            return next.handle(req);
        }
    }
}